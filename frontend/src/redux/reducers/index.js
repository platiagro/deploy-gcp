import {
  UPDATE_SIGNIN_STATUS,
  SET_PROJECT_LIST, SET_IS_CREATING_PROJECT,
  SET_PROJECT_ID, SET_PROJECT_NAME, SET_ZONE, SET_VERSION, SET_CLUSTER_ID,
  UPDATE_DEPLOYMENT_STATUS, UPDATE_URL, UPDATE_POLLING_STATUS,
  UPDATE_PROJECT_CREATION_STATUS,
} from '../actions';

const initialState = {
  isAuthorized: false,
  token: null,
  projectList: [],
  zoneList: [
    'us-central1-a',
    'us-central1-c',
    'us-east1-c',
    'us-east1-d',
    'us-west1-b',
    'europe-west1-b',
    'europe-west1-d',
    'asia-east1-a',
    'asia-east1-b',
    'southamerica-east1-a',
    'southamerica-east1-b',
    'southamerica-east1-c',
  ],
  versionList: [
    {
      value: 'https://raw.githubusercontent.com/platiagro/manifests/v0.1.0-kubeflow-v1.0-branch/kfdef/kfctl_platiagro.v0.1.0.yaml',
      text: 'v0.1.0'
    },
    {
      value: 'https://raw.githubusercontent.com/platiagro/manifests/feature/dojot-installer/kfdef/kfctl_dojot.v0.4.3.yaml',
      text: 'v0.1.0 + dojot v0.4.3'
    },
    {
      value: 'https://raw.githubusercontent.com/platiagro/manifests/v0.0.2-kubeflow-v1.0-branch/kfdef/kfctl_platiagro.v0.0.2.yaml',
      text: 'v0.0.2'
    },
  ],
  projectId: '',
  zone: 'us-central1-a',
  version: 'https://raw.githubusercontent.com/platiagro/manifests/v0.1.0-kubeflow-v1.0-branch/kfdef/kfctl_platiagro.v0.1.0.yaml',
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
