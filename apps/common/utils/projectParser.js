import { merge, get, forEach, isEmpty, isArray } from 'lodash';

/**
 * 检测setting对象中的属性是否和key对象里面的规则相匹配
 *
 * @param      {object}   setting  [description]
 * @param      {object}   entry    [description]
 * @return     {Boolean}  [description]
 */
const isEntryMatched = (setting, entry) => {
  let isMatched = true;

  forEach(entry.key, (value, key) => {
    if (value.indexOf(setting[key]) === -1 && value.indexOf('*') === -1) {
      isMatched = false;
      return false;
    }
  });

  return isMatched;
};

/**
 * 根据当前的projectSetting对象，从configurableOptionArray中
 * 获取其他的setting属性（取默认值，若当前值在可选项中，则不修改）
 *
 * @param      {object}  setting                  [description]
 * @param      {array}   configurableOptionArray  [description]
 * @return     {object}  [description]
 */
const getProjectSetting = (setting, configurableOptionArray) => {
  if (isEmpty(setting)) {
    return {};
  }
  if (!isArray(configurableOptionArray) || !configurableOptionArray.length) {
    return setting;
  }
  const outSetting = merge({}, setting);
  const sortedConfigurableOptionArray = configurableOptionArray.sort((a, b) => {
    return a.keyPattern.length - b.keyPattern.length;
  });

  sortedConfigurableOptionArray.forEach((optionMap) => {
    optionMap.entry.forEach((entry) => {
      const isMatched = isEntryMatched(setting, entry);

      if (isMatched) {
        const defaultValue = entry.defaultValue;
        const oldValue = outSetting[optionMap.id];
        if (defaultValue && entry.value.indexOf(oldValue) === -1) {
          outSetting[optionMap.id] = defaultValue;
        }
      }
    });
  });

  return outSetting;
};

const getParameters = (setting, parameterArray) => {
  if (isEmpty(setting) || !parameterArray) {
    return {};
  }
  const outParameters = {};

  const sortedParameterArray = parameterArray.sort((a, b) => {
    return a.keyPattern.length - b.keyPattern.length;
  });

  sortedParameterArray.forEach((parameter) => {
    parameter.entry.forEach((entry) => {
      const isMatched = isEntryMatched(setting, entry);

      if (isMatched) {
        outParameters[parameter.id] = parseFloat(entry.baseValue[0]);
      }
    });
  });

  return outParameters;
};


/**
 * 根据当前用户选择的产品，从spec中获取对应的project初始属性
 *
 * @param      {object}  projectObj               project的初始属性
 * @param      {array}   configurableOptionArray  spec中解析得到的新数组
 * @return     {object}  完整的projectSetting对象
 */
const getDefaultProjectSetting = (projectObj, configurableOptionArray) => {
  const outObj = merge({}, projectObj);
  const singleKeyPatternOptionArray = configurableOptionArray.filter((obj) => {
    return obj.keyPattern.length === 1;
  });

  singleKeyPatternOptionArray.forEach((optionMap) => {
    optionMap.entry.forEach((entry) => {
      entry.value.forEach((v) => {
        if (v === projectObj[optionMap.id]) {
          const onlyKeyPattern = optionMap.keyPattern[0];
          if (!outObj[onlyKeyPattern]) {
            outObj[onlyKeyPattern] = entry.key[onlyKeyPattern][0];
          }
        }
      });
    });
  });

  const setting = getProjectSetting(outObj, configurableOptionArray);

  return merge({}, outObj, setting);
};


/**
 * 根据当前的setting生成对应的project参数选项
 *
 * @param      {object}  setting                  [description]
 * @param      {array}   configurableOptionArray  [description]
 * @param      {object}  allOptionMap             The option group
 * @return     {object}  [返回一个hashMap]
 */
const getAvailableOptionMap = (setting,
                               configurableOptionArray,
                               allOptionMap) => {
  const outMap = {};
  configurableOptionArray.forEach((optionMap) => {
    optionMap.entry.forEach((entry) => {
      const isMatched = isEntryMatched(setting, entry);

      if (isMatched) {
        outMap[optionMap.id] = [...allOptionMap[optionMap.id]];
      }
    });
  });

  return outMap;
};


/**
 * 根据当前的optionMap对象递归找到所有受影响的optionMap
 *
 * @param      {object}  optionMap                当前受影响的optionMap
 * @param      {array}   configurableOptionArray  从spec解析出来的optionArray
 * @param      {array}   resultArray              存放受影响的optionMap的结果集
 * @return     {array}   [description]
 */
const getAffectedConfigurableOptionArray = (optionMap,
                                            configurableOptionArray,
                                            resultArray) => {
  configurableOptionArray.forEach((o) => {
    if (o.keyPattern.indexOf(optionMap.id) !== -1) {
      resultArray.push(o);
      getAffectedConfigurableOptionArray(o, configurableOptionArray, resultArray);
    }
  });

  return resultArray;
};

export default {
  isEntryMatched,
  getParameters,
  getProjectSetting,
  getDefaultProjectSetting,
  getAvailableOptionMap,
  getAffectedConfigurableOptionArray
};
