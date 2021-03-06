import { merge, forEach } from 'lodash';
import X2JS from 'x2js';

import { guid } from '../../../common/utils/math';

const generateSpread = (parameterMap) => {
  return {
    id: guid(),
    w: parameterMap.width,
    h: parameterMap.height,
    bleedTop: parameterMap.bleedSize,
    bleedBottom: parameterMap.bleedSize,
    bleedLeft: parameterMap.bleedSize,
    bleedRight: parameterMap.bleedSize,
    spineThicknessWidth: parameterMap.spineThickness,
    wrapSize: parameterMap.wrapSize,
    elements: []
  };
};

const generateBlackLeatheretteSpread = (parameterMap) => {
  return merge({}, generateSpread(parameterMap), {
    type: 'coverPage',
    pageNumber: 0
  });
};

const generateImageWrappedSpread = (type, parameterMap) => {
  let outObj = {
    type,
    pageNumber: 0
  };

  if (type === 'innerPage') {
    outObj = merge({}, outObj, {
      w: parameterMap.innerWidth,
      h: parameterMap.innerHeight,
      wrapSize: parameterMap.interWrapSize,
      pageNumber: 1
    });
  }

  return merge({}, generateSpread(parameterMap), outObj);
};

const generateSpreadArray = (imageBoxType, parameterMap) => {
  const spreadArray = [];
  switch (imageBoxType) {
    case 'BL':
      spreadArray.push(generateBlackLeatheretteSpread(parameterMap));
      break;
    case 'IW': {
      const coverPage = generateImageWrappedSpread(
        'coverPage', parameterMap
      );
      const innerPage = generateImageWrappedSpread(
        'innerPage', parameterMap
      );

      spreadArray.push(coverPage);
      spreadArray.push(innerPage);

      break;
    }
    default:
  }

  return spreadArray;
};

const convertProjectSetting = (setting) => {
  const outArray = [];
  forEach(setting, (v, k) => {
    outArray.push({
      _id: k,
      _value: v
    });
  });
  return outArray;
};

const convertElementArray = (elementArray) => {
  const outArray = [];
  elementArray.forEach((element) => {
    const outObj = {};
    forEach(element, (value, key) => {
      outObj[`_${key}`] = value;
    });
    outArray.push(outObj);
  });
  return outArray;
};

const convertSpreadArray = (spreadArray) => {
  const outArray = [];
  spreadArray.forEach((spread) => {
    const outObj = {};
    forEach(spread, (value, key) => {
      if (key === 'elements') {
        outObj.elements = {
          element: convertElementArray(value)
        };
      }

      outObj[`_${key}`] = value;
    });
    outArray.push(outObj);
  });
  return outArray;
};

const convertImageArray = (imageArray) => {
  return convertElementArray(imageArray);
};

const generateProject = (
  projectId,
  userId,
  setting,
  spreadArray,
  imageArray
) => {
  const now = new Date();
  const yearMonthDateString = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const hourMinuteSecondString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  const projectObj = {
    project: {
      _clientId: 'web-h5',
      _createAuthor: 'web-h5|1.0|1',
      guid: projectId,
      userId: userId,
      title: setting.title,
      updatedDate: `${yearMonthDateString} ${hourMinuteSecondString}`,
      imageBox: {
        spec: {
          _version: '1.0',
          option: convertProjectSetting(setting)
        },
        imageBoxSetting: {},
        spreads: {
          spread: convertSpreadArray(spreadArray)
        }
      },
      mergeInfo: { mergedMobileImages: {} },
      images: {
        image: convertImageArray(imageArray)
      }
    }
  };
  const x2jsInstance = new X2JS();

  return x2jsInstance.js2xml(projectObj);
};


export {
  generateSpreadArray,
  generateProject
};
