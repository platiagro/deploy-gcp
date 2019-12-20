import axios from 'axios';

const backend = axios.create({
  baseURL: 'http://localhost:8080'
});

export const createDeployment = async (projectId, zone, clusterId, configFile, token) => {
  return backend.put('/v1/deployments', {
    projectId: projectId,
    zone: zone,
    clusterId: clusterId,
    configFile: configFile,
    token: token,
  });
};

export const getDeployment = async (projectId, zone, clusterId, token) => {
  return backend.get('/v1/deployments', {
    params: {
      projectId: projectId,
      zone: zone,
      clusterId: clusterId,
      token: token,
    }
  });
};