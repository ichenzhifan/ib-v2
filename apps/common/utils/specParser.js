import { get, merge } from 'lodash';

/**
 * 将optionGroup数组转化为hashMap
 *
 * @param      {object}  specObj  spec对象
 * @return     {object}  返回一个新的hasMap
 */
const prepareOptionGroup = (specObj) => {
  const outMap = {};
  const optionArray = get(specObj, 'global.options.optionGroup');
  optionArray.forEach((obj) => {
    const newArray = obj.option.length ? [...obj.option] : [obj.option];
    outMap[obj.id] = newArray;
  });

  return outMap;
};


const prepareKeyPatternData = (dataArray, entryValueName) => {
  const outArray = [];

  dataArray.forEach((optionMap) => {
    const keyPatternArray = optionMap.keyPattern.split('-');

    const newOptionMap = merge({}, optionMap, {
      keyPattern: keyPatternArray,
      entry: null
    });

    let entryList = [];
    if (Array.isArray(optionMap.entry)) {
      entryList = optionMap.entry;
    } else {
      entryList = [optionMap.entry];
    }

    entryList.forEach((entry) => {
      const keyArray = entry.key.split('-');
      const newKey = {};

      keyPatternArray.forEach((key, index) => {
        let keyByKeyPattern = keyArray[index];
        if (keyByKeyPattern.startsWith('[') && keyByKeyPattern.endsWith(']')) {
          keyByKeyPattern = keyByKeyPattern
            .substring(1, keyByKeyPattern.length - 1).split(',');
        } else if (keyByKeyPattern.indexOf(',') !== -1 &&
          keyPatternArray.length === 1) {
          keyByKeyPattern = keyByKeyPattern.split(',');
        } else {
          keyByKeyPattern = [keyByKeyPattern];
        }

        newKey[key] = keyByKeyPattern;
      });

      const newEntry = merge(entry, {
        key: newKey,
        [entryValueName]: entry[entryValueName].split(',')
      });

      if (!newOptionMap.entry) {
        newOptionMap.entry = [];
      }

      newOptionMap.entry.push(newEntry);
    });

    outArray.push(newOptionMap);
  });

  return outArray;
};


 /**
  * 将configurableOptionMap里面的数据转化为js对象
  *
  * @param      {object}  specObj  spec对象
  * @return     {array}   返回一个新的数组
  */
const prepareConfigurableOptionMap = (specObj) => {
  const configurableOptionMap = get(specObj, 'configurableOptionMap.optionMap');
  return prepareKeyPatternData(configurableOptionMap, 'value');
};

const prepareParameters = (specObj) => {
  const parameters = get(specObj, 'parameters.parameter');
  return prepareKeyPatternData(parameters, 'baseValue');
};

export default {
  prepareOptionGroup,
  prepareConfigurableOptionMap,
  prepareParameters
};
