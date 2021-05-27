import {
  UPDATE_SIGNIN_STATUS,
  SET_PROJECT_LIST, SET_IS_CREATING_PROJECT,
  SET_PROJECT_ID, SET_PROJECT_NAME, SET_ZONE, SET_MACHINE_TYPE, SET_NODE_COUNT,
  SET_VERSION, SET_CLUSTER_ID,
  UPDATE_DEPLOYMENT_STATUS, UPDATE_URL, UPDATE_POLLING_STATUS,
  UPDATE_PROJECT_CREATION_STATUS,
  SET_ACCELERATOR,
} from '../actions';

const initialState = {
  isAuthorized: false,
  token: null,
  projectList: [],
  zoneList: [
    'us-east1-c',
    'us-east1-d',
    'us-west1-b',
    'us-central1-a',
    'us-central1-c',
    'europe-west1-b',
    'europe-west1-d',
    'asia-east1-a',
    'asia-east1-b',
    'southamerica-east1-a',
    'southamerica-east1-b',
    'southamerica-east1-c',
  ],
  machineTypeList: [
    {
      value: 'n1-standard-2',
      text: 'n1-standard-2 - 2 vCPUs / 7.5GB'
    },
    {
      value: 'n1-standard-4',
      text: 'n1-standard-4 - 4 vCPUs / 15GB'
    },
    {
      value: 'n1-standard-8',
      text: 'n1-standard-8 - 8 vCPUs / 30GB'
    },
    {
      value: 'e2-standard-2',
      text: 'e2-standard-2 - 2 vCPUs / 8GB'
    },
    {
      value: 'e2-standard-4',
      text: 'e2-standard-4 - 4 vCPUs / 16GB'
    },
    {
      value: 'e2-standard-8',
      text: 'e2-standard-8 - 8 vCPUs / 32GB'
    },
  ],
  nodeCountList: [
    {
      value: 2,
      text: '2 (mínimo)'
    },
    {
      value: 3,
      text: '3'
    },
  ],
  acceleratorList: [
    {
      value: null,
      text: 'Nenhum'
    },
    {
      value: 'nvidia-tesla-t4',
      text: 'NVIDIA® T4'
    },
    {
      value: 'nvidia-tesla-v100',
      text: 'NVIDIA® V100'
    },
    {
      value: 'nvidia-tesla-p100',
      text: 'NVIDIA® P100'
    },
    {
      value: 'nvidia-tesla-p4',
      text: 'NVIDIA® P4'
    },
  ],
  versionList: [
    {
      value: 'https://raw.githubusercontent.com/platiagro/manifests/v0.2.0-kubeflow-v1.2-branch/kfdef/kfctl_k8s_platiagro.v0.2.0.yaml',
      text: 'PlatIAgro v0.2.0',
    },
  ],
  projectId: '',
  zone: 'us-east1-c',
  machineType: 'n1-standard-4',
  nodeCount: 2,
  accelerator: null,
  version: 'https://raw.githubusercontent.com/platiagro/manifests/v0.2.0-kubeflow-v1.2-branch/kfdef/kfctl_k8s_platiagro.v0.2.0.yaml',
  clusterId: 'platiagro',
  status: '',
  url: '',
  isPolling: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_SIGNIN_STATUS:
      return {
        ...state,
        isAuthorized: action.payload.isAuthorized,
        token: action.payload.token
      };
    case SET_PROJECT_LIST:
      return {
        ...state,
        projectList: action.payload.projectList
      };
    case SET_IS_CREATING_PROJECT:
      return {
        ...state,
        isCreatingProject: action.payload.isCreatingProject
      };
    case SET_PROJECT_ID:
      return {
        ...state,
        projectId: action.payload.projectId
      };
    case SET_PROJECT_NAME:
      return {
        ...state,
        projectName: action.payload.projectName
      };
    case SET_ZONE:
      return {
        ...state,
        zone: action.payload.zone
      };
    case SET_MACHINE_TYPE:
      return {
        ...state,
        machineType: action.payload.machineType
      };
    case SET_NODE_COUNT:
      return {
        ...state,
        nodeCount: action.payload.nodeCount
      };
    case SET_ACCELERATOR:
      return {
        ...state,
        accelerator: action.payload.accelerator
      };
    case SET_VERSION:
      return {
        ...state,
        version: action.payload.version
      };
    case SET_CLUSTER_ID:
      return {
        ...state,
        clusterId: action.payload.clusterId
      };
    case UPDATE_DEPLOYMENT_STATUS:
      return {
        ...state,
        status: action.payload.status,
      };
    case UPDATE_URL:
      return {
        ...state,
        url: action.payload.url,
      };
    case UPDATE_POLLING_STATUS:
      return {
        ...state,
        isPolling: action.payload.isPolling,
      };
    case UPDATE_PROJECT_CREATION_STATUS:
      return {
        ...state,
        projectCreationStatus: action.payload.projectCreationStatus,
      };
    default:
      return state;
  }
};
