import { isObject, isBoolean, forEach, toNumber } from 'lodash';

export const convertObjIn = (obj) => {
  const outObj = {};
  forEach(obj, (value, key) => {
    if (!isNaN(toNumber(value))) {
      outObj[key] = toNumber(value);
    } else if (value === 'true' || value === 'false') {
      outObj[key] = Boolean(value === 'true');
    } else if (isObject(value)) {
      outObj[key] = convertObjIn(value);
    } else {
      outObj[key] = value;
    }
  });

  return outObj;
};

export const convertObjOut = (obj) => {
  const outObj = {};
  forEach(obj, (value, key) => {
    if (isBoolean(value)) {
      outObj[key] = value ? 'true' : 'false';
    } else if (isObject(value)) {
      outObj[key] = convertObjOut(value);
    } else {
      outObj[key] = value;
    }
  });

  return outObj;
};
