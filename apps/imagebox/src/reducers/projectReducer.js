import qs from 'qs';
import {
  merge,
  get,
  set,
  pick,
  forEach,
  isEmpty,
  mapValues,
  findIndex,
  isArray,
  isUndefined,
  isObject
} from 'lodash';
import {
  API_SUCCESS,
  CHANGE_PROJECT_SETTING,
  INIT_SPREAD_ARRAY,
  INIT_IMAGE_ARRAY,
  INIT_IMAGE_USED_COUNT_MAP,
  UPDATE_IMAGE_USED_COUNT_MAP,
  CREATE_ELEMENT,
  UPDATE_ELEMENT,
  DELETE_ELEMENT,
  UPLOAD_COMPLETE,
  DELETE_PROJECT_IMAGE
} from '../contants/actionTypes';
import { GET_PROJECT_DATA, GET_SPEC_DATA } from '../contants/apiUrl';

import { getPxByMM, guid } from '../../../common/utils/math';
import { generateSpreadArray, generateProject } from '../../src/utils/projectGenerator';
import { convertObjIn } from '../../../common/utils/typeConverter';
import projectParser from '../../../common/utils/projectParser';
import specParser from '../../../common/utils/specParser';

// 从url附加的参数信息中获取用户project的一些初始属性
const queryStringObj = qs.parse(window.location.search.substr(1));
const initialState = {
  setting: pick(queryStringObj, ['title', 'size', 'product', 'type']),
  spreadArray: [],
  imageArray: [],
  imageUsedCountMap: {}
};

const getNewProjectSetting = (oldSetting, newSetting, configurableOptionArray) => {
  const shadowAffectedSettingKeys = Object.keys(newSetting);
  const shadowAffectedConfigurableOptionArray = [];

  configurableOptionArray.forEach((optionMap) => {
    forEach(shadowAffectedSettingKeys, (settingKey) => {
      if (optionMap.keyPattern.indexOf(settingKey) !== -1) {
        shadowAffectedConfigurableOptionArray.push(optionMap);
        return false;
      }
    });
  });

  const deepAffectedConfigurableOptionArray =
    shadowAffectedConfigurableOptionArray.concat([]);
  shadowAffectedConfigurableOptionArray.forEach((optionMap) => {
    projectParser.getAffectedConfigurableOptionArray(
      optionMap,
      configurableOptionArray,
      deepAffectedConfigurableOptionArray
    );
  });

  const mergedSetting = merge({}, oldSetting, newSetting);

  const allNewSetting = projectParser.getProjectSetting(
    mergedSetting, deepAffectedConfigurableOptionArray
  );

  return merge({}, mergedSetting, allNewSetting);
};

const convertParametersUnit = (parameterMap) => {
  const {
    baseWidth,
    baseHeight,
    innerBaseWidth,
    innerBaseHeight,
    innerWrapSize,
    spineSize,
    wrapSize,
    bleedSize
  } = parameterMap;

  const outObj = {
    baseWidth,
    baseHeight,
    innerBaseWidth,
    innerBaseHeight,
    wrapSize,
    innerWrapSize,
    bleedSize,
    width: spineSize + (2 * (baseWidth + wrapSize + bleedSize)),
    height: baseHeight + (2 * (wrapSize + bleedSize)),
    innerWidth: innerBaseWidth + (2 * (innerWrapSize + bleedSize)),
    innerHeight: innerBaseHeight + (2 * (innerWrapSize + bleedSize)),
    spineThickness: spineSize
  };

  return mapValues(outObj, v => getPxByMM(v));
};

const addElementIdIfHasNoId = (elements) => {
  const outArray = [];
  elements.forEach((element) => {
    if (element) {
      if (typeof element.id !== 'undefined') {
        outArray.push(element);
      } else {
        outArray.push(merge({}, element, { id: guid() }));
      }
    }
  });
  return outArray;
};

const convertSpreads = (spreads) => {
  const outArray = [];
  const spreadArray = isArray(spreads.spread)
    ? [...spreads.spread]
    : [spreads.spread];

  spreadArray.forEach((spread) => {
    const outObj = {};
    forEach(spread, (value, key) => {
      if (key === 'elements') {
        const { element } = value;
        const elements = isArray(element) ? [...element] : [element];
        outObj.elements = addElementIdIfHasNoId(elements);
      } else {
        outObj[key] = value;
      }
    });
    outArray.push(outObj);
  });

  return outArray;
};

const convertImages = (images) => {
  return isArray(images.image) ? [...images.image] : [images.image];
};

const getImageUsedCountMap = (obj) => {
  const outObj = {};
  forEach(obj, (value, key) => {
    if (key === 'imageid') {
      outObj[value] = 1;
    }
    if (isObject(value)) {
      const resultMap = getImageUsedCountMap(value);
      forEach(resultMap, (v, k) => {
        if (isUndefined(outObj[k])) {
          outObj[k] = resultMap[k];
        } else {
          outObj[k] += resultMap[k];
        }
      });
    }
  });
  return outObj;
};

const project = (state = initialState, action) => {
  switch (action.type) {
    case API_SUCCESS: {
      switch (action.apiPattern.name) {
        case GET_PROJECT_DATA: {
          const xmlObj = action.response;
          const projectObj = xmlObj.project;

          return merge({}, state, {
            __originalData__: projectObj
          });
        }
        case GET_SPEC_DATA: {
          const specObj = get(action, 'response.product-spec');

          const configurableOptionArray = specParser
            .prepareConfigurableOptionMap(specObj);
          const allOptionMap = specParser.prepareOptionGroup(specObj);
          const parameterArray = specParser.prepareParameters(specObj);

          const setting = projectParser
            .getDefaultProjectSetting(state.setting, configurableOptionArray);

          const availableOptionMap = projectParser.getAvailableOptionMap(
            setting, configurableOptionArray, allOptionMap
          );

          const parameterMap = projectParser.getParameters(
            setting,
            parameterArray
          );

          const convertedParameterMap = convertParametersUnit(parameterMap);
          const spreadArray = generateSpreadArray(
            setting.type, convertedParameterMap
          );

          return merge({}, state, {
            configurableOptionArray,
            setting,
            availableOptionMap,
            allOptionMap,
            parameterArray,
            spreadArray,
            parameterMap: convertedParameterMap
          });
        }
        default:
          return state;
      }
    }
    case CHANGE_PROJECT_SETTING: {
      const newSetting = action.setting;
      if (!isEmpty(newSetting)) {
        const { configurableOptionArray, allOptionMap, parameterArray } = state;
        const isSpecDataLoaded = configurableOptionArray;
        if (isSpecDataLoaded) {
          const setting = getNewProjectSetting(
            state.setting,
            newSetting,
            configurableOptionArray
          );

          const availableOptionMap = projectParser.getAvailableOptionMap(
            setting,
            configurableOptionArray,
            allOptionMap
          );

          const parameterMap = projectParser.getParameters(
            setting,
            parameterArray
          );

          const convertedParameterMap = convertParametersUnit(parameterMap);
          const spreadArray = generateSpreadArray(
            setting.type, convertedParameterMap
          );

          const newState = merge({}, state, {
            setting,
            parameterMap: convertedParameterMap
          });

          set(newState, 'spreadArray', spreadArray);
          set(newState, 'availableOptionMap', availableOptionMap);

          return newState;
        }

        return merge({}, state, { setting: newSetting });
      }
      return state;
    }
    case INIT_SPREAD_ARRAY: {
      const { spreads } = action;
      return merge({}, state, {
        spreadArray: convertObjIn(convertSpreads(spreads))
      });
    }
    case INIT_IMAGE_ARRAY: {
      const { images } = action;
      return merge({}, state, {
        imageArray: convertObjIn(convertImages(images))
      });
    }
    case INIT_IMAGE_USED_COUNT_MAP:
    case UPDATE_IMAGE_USED_COUNT_MAP: {
      const { spreads } = action;
      const newState = merge({}, state);
      return set(
        newState,
        'imageUsedCountMap',
        getImageUsedCountMap(convertObjIn(spreads))
      );
    }
    case CREATE_ELEMENT: {
      const { spreadArray } = state;
      const { spreadId, element } = action;
      const currentSpreadIndex = findIndex(spreadArray, s => (s.id === spreadId));
      if (currentSpreadIndex !== -1) {
        const currentSpread = spreadArray[currentSpreadIndex];

        const newElement = merge({}, element, { id: guid() });

        return set(
          merge({}, state),
          `spreadArray[${currentSpreadIndex}].elements`,
          [...currentSpread.elements, newElement]
        );
      }
      return state;
    }
    case UPDATE_ELEMENT: {
      const { spreadArray } = state;
      const { spreadId, elementId, newAttribute } = action;
      const currentSpreadIndex = findIndex(spreadArray, s => (s.id === spreadId));
      if (currentSpreadIndex !== -1) {
        const currentSpread = spreadArray[currentSpreadIndex];
        const currentElementIndex = findIndex(
          currentSpread.elements,
          (element) => {
            return element.id === elementId;
          }
        );
        const currentElement = currentSpread.elements[currentElementIndex];

        return set(
          merge({}, state),
          `spreadArray[${currentSpreadIndex}].elements[${currentElementIndex}]`,
          merge({}, currentElement, newAttribute)
        );
      }

      return state;
    }
    case DELETE_ELEMENT: {
      const { spreadArray } = state;
      const { spreadId, elementId } = action;
      const currentSpreadIndex = findIndex(spreadArray, s => (s.id === spreadId));
      if (currentSpreadIndex !== -1) {
        const currentSpread = spreadArray[currentSpreadIndex];
        const { elements } = currentSpread;
        const currentElementIndex = findIndex(elements, (element) => {
          return element.id === elementId;
        });

        return set(
          merge({}, state),
          `spreadArray[${currentSpreadIndex}].elements`,
          [
            ...elements.slice(0, currentElementIndex),
            ...elements.slice(currentElementIndex + 1)
          ]
        );
      }

      return state;
    }
    case UPLOAD_COMPLETE: {
      const { imageArray } = state;
      const { fields } = action;
      const imageObj = {
        id: fields.imageId,
        guid: fields.guid,
        encImgId: fields.encImgId,
        name: fields.name,
        height: fields.height,
        width: fields.width,
        createTime: fields.createTime,
        order: imageArray.length,
        shotTime: ''
      };
      return merge({}, state, {
        imageArray: [...imageArray, convertObjIn(imageObj)]
      });
    }
    case DELETE_PROJECT_IMAGE: {
      const { imageArray } = state;
      const { imageId } = action;
      const currentImageIndex = findIndex(
        imageArray,
        i => i.id === imageId
      );
      return set(
        merge({}, state),
        'imageArray',
        [
          ...imageArray.slice(0, currentImageIndex),
          ...imageArray.slice(currentImageIndex + 1)
        ]
      );
    }
    default:
      return state;
  }
};


export default project;
