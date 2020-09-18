"""Deployment manager."""

from multiprocessing import Process
from os import chdir, makedirs
from os.path import expanduser
from re import match
from subprocess import run
from tempfile import mkdtemp
from time import sleep

from requests import get
from requests.exceptions import ConnectionError, HTTPError
from yaml import dump

from .gcloud import enable_service, get_service_account, create_service_account, \
    create_service_account_key, get_iam_policy, set_iam_policy, create_cluster, \
    get_cluster


PROVISIONING = "PROVISIONING"
RUNNING = "RUNNING"


def get_deployment_status(params: dict) -> dict:
    """Gets the deployment status on GCP.

    Args:
        params:

    Returns:
        A dict containing the response body.

    """
    try:
        proc = run([
            "kubectl",
            "-n",
            "istio-system",
            "get",
            "service",
            "istio-ingressgateway",
            "-o",
            "jsonpath={.status.loadBalancer.ingress[0].ip}"
        ], capture_output=True, text=True)
        ip = proc.stdout
        m = match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$", ip)
        if ip is not None and m is not None:
            url = f"http://{ip}"
            # verify the platform is up and running
            resp = get(url)
            resp.raise_for_status()
            return {"status": RUNNING, "url": url}
    except (ConnectionError, HTTPError):
        pass
    return {"status": PROVISIONING}


def create_deployment(params: dict) -> dict:
    """Creates resources and installs PlatIAgro on GCP.

    Args:
        params:

    Returns:
        A dict containing the parsed response body.

    """
    project_id = params["projectId"]
    zone = params["zone"]
    cluster_id = params["clusterId"]
    config_file = params["configFile"]
    token = params["token"]

    # enables required GCP services
    services = [
        "cloudresourcemanager.googleapis.com",
        "iam.googleapis.com",
        "container.googleapis.com",
    ]
    for service in services:
        enable_service(project_id, service, token)

    # checks if service account already exists
    service_account = "platiagro-deploy-admin"
    service_account_email = f"{service_account}@{project_id}.iam.gserviceaccount.com"
    try:
        get_service_account(project_id, service_account_email, token)
    except HTTPError:
        # creates service account
        create_service_account(project_id, service_account, token)

    max_attempts = 4
    for attempt in range(0, max_attempts):
        try:
            # gets IAM policy for this project
            policy = get_iam_policy(project_id, token)

            # appends new roles for the service account
            roles = [
                "roles/container.admin",
                "roles/compute.viewer",
                "roles/storage.admin",
                "roles/iam.serviceAccountTokenCreator",
                "roles/iam.serviceAccountUser",
            ]
            member = f"serviceAccount:{service_account_email}"
            for role in roles:
                policy["bindings"].append({"role": role, "members": [member]})

            # sets the new IAM policy
            set_iam_policy(project_id, policy, token)
        except HTTPError as e:
            # if it's a conflict, try again, otherwise return http error
            if e.response.status_code != 409:
                raise e

    # creates service account key
    create_service_account_key(project_id, service_account_email, token)

    # creates a GKE cluster
    create_cluster(project_id, zone, cluster_id, token)

    # installs in the background
    p = Process(target=install_in_the_background, args=(
        project_id, zone, cluster_id, config_file, token,))
    p.start()

    return {"status": PROVISIONING}


def install_in_the_background(project_id: str, location: str, cluster_id: str, config_file: str, token: str):
    """Installs the platform in the GKE cluster.

    Args:
        project_id: GCP project ID.
        location: Google Compute Engine zone.
        cluster_id: Cluster ID.
        config_file: kfctl config file.
        token: Access token from the Google Authorization Server.

    """
    # starts polling until cluster is running
    while True:
        # get cluster info
        cluster = get_cluster(project_id, location, cluster_id, token)
        if cluster["status"] != "PROVISIONING":
            break
        sleep(3)

    kubeconfig = empty_kubeconfig()
    cluster_name = f"gke_{project_id}_{location}_{cluster_id}"
    # add cluster info
    kubeconfig["clusters"].append(
        cluster_kubeconfig(
            name=cluster_name,
            server=f"https://{cluster['endpoint']}",
            ca_data=cluster["masterAuth"]["clusterCaCertificate"],
        ),
    )

    # add context info
    kubeconfig["contexts"].append(
        context_kubeconfig(
            name=cluster_name,
            cluster=cluster_name,
            user=cluster_name,
        )
    )

    # add user info
    kubeconfig["users"].append(
        user_kubeconfig(
            name=cluster_name,
            token=token,
        )
    )

    kubeconfig["current-context"] = cluster_name

    kubeconfig_dir = expanduser("~/.kube")
    makedirs(kubeconfig_dir, exist_ok=True)

    # adds credentials to ~/.kube/config
    kubeconfig_path = expanduser("~/.kube/config")
    with open(kubeconfig_path, "w", encoding="utf8") as outfile:
        dump(kubeconfig, outfile)

    # installs PlatIAgro
    dirpath = mkdtemp()
    chdir(dirpath)
    run(["kfctl", "apply", "-V", "-f", config_file])


def empty_kubeconfig():
    """Generate and return a kubeconfig object."""
    return {
        "apiVersion": "v1",
        "contexts": [],
        "clusters": [],
        "current-context": "",
        "kind": "Config",
        "preferences": {},
        "users": [],
    }


def cluster_kubeconfig(name, server, ca_data):
    """Generate and return a cluster kubeconfig object."""
    return {
        "name": name,
        "cluster": {
            "server": server,
            "certificate-authority-data": ca_data,
        },
    }


def context_kubeconfig(name, cluster, user):
    """Generate and return a context kubeconfig object."""
    return {
        "name": name,
        "context": {
            "cluster": cluster,
            "user": user,
        },
    }


def user_kubeconfig(name, token):
    """Generate and return a user kubeconfig object."""
    return {
        "name": name,
        "user": {
            "token": token,
        },
    }
