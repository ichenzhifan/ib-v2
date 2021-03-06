import { get, isUndefined } from 'lodash';
import { CALL_API } from '../middlewares/api';
import { GET_PROJECT_DATA, SAVE_PROJECT, NEW_PROJECT } from '../contants/apiUrl';
import {
  CHANGE_PROJECT_SETTING,
  INIT_SPREAD_ARRAY,
  INIT_IMAGE_ARRAY,
  INIT_IMAGE_USED_COUNT_MAP,
  UPDATE_IMAGE_USED_COUNT_MAP,
  CREATE_ELEMENT,
  UPDATE_ELEMENT,
  DELETE_ELEMENT,
  DELETE_PROJECT_IMAGE
} from '../contants/actionTypes';

import { generateProject } from '../../src/utils/projectGenerator';

export function getProjectData(userId, projectId) {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls.baseUrl');
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_PROJECT_DATA,
          params: { baseUrl, userId, projectId }
        }
      }
    }).then((res) => {
      const serverOptions = get(res, 'project.imageBox.spec.option');
      const newSetting = {};
      serverOptions.forEach((option) => {
        // 兼容老数据
        if (option.id === 'thickness') {
          newSetting.spineThickness = option.value;
        } else {
          newSetting[option.id] = option.value;
        }
      });
      dispatch({
        type: CHANGE_PROJECT_SETTING,
        setting: newSetting
      });

      const serverSpreads = get(res, 'project.imageBox.spreads');
      dispatch({
        type: INIT_SPREAD_ARRAY,
        spreads: serverSpreads
      });

      dispatch({
        type: INIT_IMAGE_USED_COUNT_MAP,
        spreads: serverSpreads
      });

      const serverImages = get(res, 'project.images');
      dispatch({
        type: INIT_IMAGE_ARRAY,
        images: serverImages
      });
    });
  };
}


export function changeProjectSetting(setting) {
  return {
    type: CHANGE_PROJECT_SETTING,
    setting
  };
}

export function saveProject(
  projectId,
  userId,
  setting,
  spreadArray,
  imageArray) {
  return (dispatch, getState) => {
    const baseUrl = get(getState(), 'system.env.urls.baseUrl');
    const projectXmlString = generateProject(
      projectId,
      userId,
      setting,
      spreadArray,
      imageArray
    );
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: projectId ? SAVE_PROJECT : NEW_PROJECT,
          params: { baseUrl, userId, projectId }
        },
        request: {
          projectXml: projectXmlString,
          thumbnailPX: 0,
          thumbnailPY: 0,
          thumbnailPW: 1,
          thumbnailPH: 1,
          requestKey: Date.now()
        }
      }
    });
  };
}

export function createElement(spreadId, element) {
  return (dispatch, getState) => {
    dispatch({
      type: CREATE_ELEMENT,
      spreadId,
      element
    });

    if (!isUndefined(element.imageid)) {
      dispatch({
        type: UPDATE_IMAGE_USED_COUNT_MAP,
        spreads: getState().project.spreadArray
      });
    }
  };
}

export function updateElement(spreadId, elementId, newAttribute) {
  return (dispatch, getState) => {
    dispatch({
      type: UPDATE_ELEMENT,
      spreadId,
      elementId,
      newAttribute
    });

    if (!isUndefined(newAttribute.imageid)) {
      dispatch({
        type: UPDATE_IMAGE_USED_COUNT_MAP,
        spreads: getState().project.spreadArray
      });
    }
  };
}

export function deleteElement(spreadId, elementId) {
  return (dispatch, getState) => {
    dispatch({
      type: DELETE_ELEMENT,
      spreadId,
      elementId
    });

    dispatch({
      type: UPDATE_IMAGE_USED_COUNT_MAP,
      spreads: getState().project.spreadArray
    });
  };
}

export function deleteProjectImage(imageId) {
  return {
    type: DELETE_PROJECT_IMAGE,
    imageId
  };
}
