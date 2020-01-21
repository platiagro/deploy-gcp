import axios from 'axios';

const cloudresourcemanager = axios.create({
  baseURL: 'https://cloudresourcemanager.googleapis.com'
});

const servicemanagement = axios.create({
  baseURL: 'https://servicemanagement.googleapis.com'
});

const iam = axios.create({
  baseURL: 'https://iam.googleapis.com'
});

const container = axios.create({
  baseURL: 'https://container.googleapis.com'
});

export const listProjects = async (token) => {
  return cloudresourcemanager.get('/v1/projects', {
    params: {
      filter: 'lifecycleState:ACTIVE'
    },
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const enableService = async (projectId, serviceName, token) => {
  return servicemanagement.post(`/v1/services/${serviceName}:enable`, {
    consumerId: `project:${projectId}`,
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getServiceAccount = async (projectId, serviceAccount, token) => {
  return iam.get(`/v1/projects/${projectId}/serviceAccounts/${serviceAccount}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createServiceAccount = async (projectId, serviceAccount, token) => {
  return iam.post(`/v1/projects/${projectId}/serviceAccounts`, {
    accountId: serviceAccount,
    serviceAccount: {
      displayName: 'platiagro service account'
    }
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createServiceAccountKey = async (projectId, serviceAccount, token) => {
  return iam.post(`/v1/projects/${projectId}/serviceAccounts/${serviceAccount}/keys`, {
    privateKeyType: 'TYPE_GOOGLE_CREDENTIALS_FILE',
    keyAlgorithm: 'KEY_ALG_RSA_2048'
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getIamPolicy = async (projectId, token) => {
  return cloudresourcemanager.post(`/v1/projects/${projectId}:getIamPolicy`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const setIamPolicy = async (projectId, policy, token) => {
  return cloudresourcemanager.post(`/v1/projects/${projectId}:setIamPolicy`, {
    'policy': policy,
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createCluster = async (projectId, location, clusterId, token) => {
  return container.post(
    `/v1beta1/projects/${projectId}/locations/${location}/clusters`, {
    cluster: {
      name: clusterId,
      nodePools: [
        {
          name: 'default-pool',
          initialNodeCount: 1
        }
      ],
      initialClusterVersion: '1.15'
    }
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getCluster = async (projectId, location, clusterId, token) => {
  return container.get(
    `/v1beta1/projects/${projectId}/locations/${location}/clusters/${clusterId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};