import { v4 as uuidv4 } from 'uuid';

import { listProjects } from '../../services/gcloudService';
import { createDeployment, getDeployment } from '../../services/deploymentService';

export const UPDATE_SIGNIN_STATUS = 'UPDATE_SIGNIN_STATUS';
export const SET_PROJECT_LIST = 'SET_PROJECT_LIST';
export const SET_ZONE_LIST = 'SET_ZONE_LIST';
export const SET_VERSION_LIST = 'SET_VERSION_LIST';
export const SET_IS_CREATING_PROJECT = 'SET_IS_CREATING_PROJECT';
export const SET_PROJECT_ID = 'SET_PROJECT_ID';
export const SET_PROJECT_NAME = 'SET_PROJECT_NAME';
export const SET_ZONE = 'SET_ZONE';
export const SET_VERSION = 'SET_VERSION';
export const SET_CLUSTER_ID = 'SET_CLUSTER_ID';
export const UPDATE_PROJECT_CREATION_STATUS = 'UPDATE_PROJECT_CREATION_STATUS';
export const UPDATE_DEPLOYMENT_STATUS = 'UPDATE_DEPLOYMENT_STATUS';
export const UPDATE_URL = 'UPDATE_URL';
export const UPDATE_POLLING_STATUS = 'UPDATE_POLLING_STATUS';

export const updateSigninStatus = (isSignedIn) => {
  const GoogleAuth = window.gapi.auth2.getAuthInstance();
  let token = '';
  if (isSignedIn) {
    token = GoogleAuth.currentUser.get().getAuthResponse(true).access_token;
  }
  return {
    type: UPDATE_SIGNIN_STATUS,
    payload: {
      isAuthorized: isSignedIn,
      token: token
    }
  };
};

export const signOut = () => {
  return async (dispatch) => {
    const GoogleAuth = window.gapi.auth2.getAuthInstance();
    await GoogleAuth.signOut();

    dispatch(updateSigninStatus(false));
  }
};

export const fetchProjects = (token) => {
  return async (dispatch) => {
    try {
      const r = await listProjects(token);
      dispatch(setProjectList(r.data.projects));
    } catch (e) {
      // request error: ?maybe we could disable the form?
    }
  };
};

export const setProjectList = (projectList) => {
  return {
    type: SET_PROJECT_LIST,
    payload: {
      projectList: projectList
    }
  };
};

export const setProjectId = (projectId) => {
  return {
    type: SET_PROJECT_ID,
    payload: {
      projectId: projectId
    }
  };
};

export const setIsCreatingProject = (isCreatingProject) => {
  return {
    type: SET_IS_CREATING_PROJECT,
    payload: {
      isCreatingProject: isCreatingProject
    }
  };
};

export const setZone = (zone) => {
  return {
    type: SET_ZONE,
    payload: {
      zone: zone
    }
  };
};

export const setVersion = (version) => {
  return {
    type: SET_VERSION,
    payload: {
      version: version
    }
  };
};

export const setClusterId = (clusterId) => {
  return {
    type: SET_CLUSTER_ID,
    payload: {
      clusterId: clusterId
    }
  };
};

export const startDeployment = (projectId, zone, configFile, token) => {
  return async (dispatch) => {
    if (projectId === '') {
      dispatch(updateDeploymentStatus('PROJECT_UNDEFINED'));
      return;
    }

    const randomStr = uuidv4().split('-')[0];
    const clusterId = `platiagro-${randomStr}`;
    dispatch(setClusterId(clusterId));

    dispatch(updateDeploymentStatus('PROVISIONING'));

    try {
      await createDeployment(projectId, zone, clusterId, configFile, token);
    } catch (e) {
      dispatch(updateDeploymentStatus('ERROR'));
      return;
    }
  }
};

export const updateDeploymentStatus = (status) => {
  return {
    type: UPDATE_DEPLOYMENT_STATUS,
    payload: {
      status: status
    }
  }
};

export const updateUrl = (url) => {
  return {
    type: UPDATE_URL,
    payload: {
      url: url
    }
  }
};

export const verifyDeploymentStatus = (projectId, zone, clusterId, token, status, isPolling) => {
  return async (dispatch) => {
    try {
      // only polls if status equals to PROVISIONING
      // and is not waiting for a poll to complete
      if (status === 'PROVISIONING' && !isPolling) {
        dispatch(updatePollingStatus(true));
        const r = await getDeployment(projectId, zone, clusterId, token);
        dispatch(updateDeploymentStatus(r.data.status));
        if (r.data.url) {
          dispatch(updateUrl(r.data.url));
        }
        dispatch(updatePollingStatus(false));
      }
    } catch (e) {
      // request error: ?maybe we could disable the form?
      dispatch(updatePollingStatus(false));
      if (e.response.status !== 404) {
        dispatch(updateDeploymentStatus('ERROR'));
      }
    }
  };
};

export const updatePollingStatus = (isPolling) => {
  return {
    type: UPDATE_POLLING_STATUS,
    payload: {
      isPolling: isPolling
    }
  };
};