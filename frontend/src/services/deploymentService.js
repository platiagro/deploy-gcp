import axios from 'axios';

export const URL =
  process.env.REACT_APP_BACKEND_API || 'http://localhost:8080';

const backend = axios.create({
  baseURL: URL
});

export const createDeployment = async (projectId, zone, nodeCount, machineType, accelerator, clusterId, configFile, token) => {
  return backend.put('/v1/deployments', {
    projectId: projectId,
    zone: zone,
    nodeCount: nodeCount,
    machineType: machineType,
    accelerator: accelerator,
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