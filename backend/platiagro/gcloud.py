"""Accesses Google Cloud Resources"""
import requests


def enable_service(project_id: str, service_name: str, token: str) -> dict:
    """Enables a service for a project, so it can be used.

    Args:
        project_id: GCP project ID.
        service_name: Service name from GCP.
        token: Access token from the Google Authorization Server.

    Returns:
        A dict containing the response body.
    """
    host = "https://servicemanagement.googleapis.com"
    url = f"{host}/v1/services/{service_name}:enable"
    resp = requests.post(url, json={
        "consumerId": f"project:{project_id}",
    }, headers={
        "Authorization": f"Bearer {token}",
    })
    resp.raise_for_status()
    return resp.json()


def get_service_account(project_id: str, service_account: str, token: str) -> dict:
    """Gets the service account.

    Args:
        project_id: GCP project ID.
        service_account: Service account name.
        token: Access token from the Google Authorization Server.

    Returns:
        A dict containing the response body.
    """
    host = "https://iam.googleapis.com"
    url = f"{host}/v1/projects/{project_id}/serviceAccounts/{service_account}"
    resp = requests.get(url, headers={
        "Authorization": f"Bearer {token}"
    })
    resp.raise_for_status()
    return resp.json()


def create_service_account(project_id: str, service_account: str, token: str) -> dict:
    """Creates the service account in the Identity and Access Management API.

    Args:
        project_id: GCP project ID.
        service_account: Service account name.
        token: Access token from the Google Authorization Server.

    Returns:
        A dict containing the response body.
    """
    host = "https://iam.googleapis.com"
    url = f"{host}/v1/projects/{project_id}/serviceAccounts"
    resp = requests.post(url, json={
        "accountId": service_account,
        "serviceAccount": {
            "displayName": "platiagro service account",
        },
    }, headers={
        "Authorization": f"Bearer {token}",
    })
    resp.raise_for_status()
    return resp.json()


def create_service_account_key(project_id: str, service_account: str, token: str) -> dict:
    """Creates the service account key in the Identity and Access Management API.

    Args:
        project_id: GCP project ID.
        service_account: Service account name.
        token: Access token from the Google Authorization Server.

    Returns:
        A dict containing the response body.
    """
    host = "https://iam.googleapis.com"
    url = f"{host}/v1/projects/{project_id}/serviceAccounts/{service_account}/keys"
    resp = requests.post(url, json={
        "privateKeyType": "TYPE_GOOGLE_CREDENTIALS_FILE",
        "keyAlgorithm": "KEY_ALG_RSA_2048",
    }, headers={
        "Authorization": f"Bearer {token}"
    })
    resp.raise_for_status()
    return resp.json()


def get_iam_policy(project_id: str, token: str) -> dict:
    """Gets the Cloud IAM access control policy for a ServiceAccount.

    Args:
        project_id: GCP project ID.
        token: Access token from the Google Authorization Server.

    Returns:
        A dict containing the response body.
    """
    host = "https://cloudresourcemanager.googleapis.com"
    url = f"{host}/v1/projects/{project_id}:getIamPolicy"
    resp = requests.post(url, json={}, headers={
        "Authorization": f"Bearer {token}",
    })
    resp.raise_for_status()
    return resp.json()


def set_iam_policy(project_id: str, policy: dict, token: str) -> dict:
    """Sets the Cloud IAM access control policy for a ServiceAccount.

    Args:
        project_id: GCP project ID.
        policy: IAM policy.
        token: Access token from the Google Authorization Server.

    Returns:
        A dict containing the response body.
    """
    host = "https://cloudresourcemanager.googleapis.com"
    url = f"{host}/v1/projects/{project_id}:setIamPolicy"
    resp = requests.post(url, json={
        "policy": policy,
    }, headers={
        "Authorization": f"Bearer {token}"
    })
    resp.raise_for_status()
    return resp.json()


def create_cluster(project_id: str, location: str, cluster_id: str, token: str) -> dict:
    """Creates a cluster in the Identity and Access Management API.

    Args:
        project_id: GCP project ID.
        location: Google Compute Engine zone.
        cluster_id: Cluster ID
        token: Access token from the Google Authorization Server.

    Returns:
        A dict containing the response body.
    """
    host = "https://container.googleapis.com"
    url = f"{host}/v1beta1/projects/{project_id}/locations/{location}/clusters"
    resp = requests.post(url, json={
        "cluster": {
            "name": cluster_id,
            "nodePools": [
                {
                    "name": "default-pool",
                    "initialNodeCount": 2,
                    "config": {
                        "machineType": "e2-standard-2",
                    }
                },
            ],
            "initialClusterVersion": "1.15",
        },
    }, headers={
        "Authorization": f"Bearer {token}"
    })
    resp.raise_for_status()
    return resp.json()


def get_cluster(project_id: str, location: str, cluster_id: str, token: str) -> dict:
    """Gets the GKE Cluster data.

    Args:
        project_id: GCP project ID.
        location: Google Compute Engine zone.
        cluster_id: Cluster ID
        token: Access token from the Google Authorization Server.

    Returns:
        A dict containing the response body.
    """
    host = "https://container.googleapis.com"
    url = f"{host}/v1beta1/projects/{project_id}/locations/{location}/clusters/{cluster_id}"
    resp = requests.get(url, headers={
        "Authorization": f"Bearer {token}",
    })
    resp.raise_for_status()
    return resp.json()
