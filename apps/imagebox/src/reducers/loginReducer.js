import { get, set } from 'lodash';
import { API_SUCCESS } from '../contants/actionTypes';
import { LOGIN, GET_SESSION_USER_INFO, GET_USER_ALBUM_ID } from '../contants/apiUrl';
import  x2jsInstance  from '../../../common/utils/xml2js';

const sKey = 'COOKIES_IN_STORAGE';
const uKey = 'USERINFO_IN_STORAGE';

/**
 * 设置cookie
 * @param data
 */
const setCookie = data => {
  document.cookie = data;
};

/**
 * 把cookie数组保存到localstorage
 * @param data
 */
const setToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));

  // 设置cookie
  // if (data && data.length) {
  //   setCookie(data[data.length - 1]['Set-Cookie']);
  // }
}

/**
 * 从localstorage中获取上次的cookie
 * @returns {Array}
 */
const getInitCookies = () => {
  const result = localStorage.getItem(sKey);

  if (result) {
    let data = JSON.parse(result);
    data.forEach(v => setCookie(v['Set-Cookie']));

    return data;
  }

  return [];
}

/**
 * 从localstorage中获取上次的cookie
 * @returns {Array}
 */
const getInitUserInfo = () => {
  const result = localStorage.getItem(uKey);

  return result ? JSON.parse(result) : {};
}

// 获取cookie的默认值.
const defaultCookies = getInitCookies();
const defaultUserInfo = getInitUserInfo();

/**
 * cookies的reducer, 把新获取的cookie更新到store.
 * @param state
 * @param action
 */
export const cookies = (state = defaultCookies, action) => {
  switch (action.type) {
    case API_SUCCESS:
      if (action.apiPattern.name === LOGIN) {
        const myCookies = get(action.response, 'cookies');

        setToStorage(sKey, myCookies);
        myCookies.forEach(v => setCookie(v['Set-Cookie']));

        return myCookies || [];
      }
      return state;
    default:
      return state;
  }
};

/**
 * userInfo的reducer, 把获取到的userInfo更新到store
 * @param state
 * @param action
 */
export const userInfo = (state = defaultUserInfo, action) => {
  switch (action.type) {
    case API_SUCCESS:
      if (action.apiPattern.name === LOGIN) {
        const data = get(action.response, 'userInfo') || {};
        setToStorage(uKey, data);

        return data;
      } else if (action.apiPattern.name === GET_SESSION_USER_INFO) {
        // todo. 当前的session user info为空.
        console.log('userinfo:', action.response);
        return state;
      }
      return state;
    default:
      return state;
  }
};

/**
 * 获取album id.
 * @param state
 * @param action
 */
export const albumId = (state = 118450, action) => {
  switch (action.type) {
    case API_SUCCESS:
      if (action.apiPattern.name === GET_USER_ALBUM_ID) {
        // 获取album id
        // todo: album id暂时还无法获取成功. 在线上联调的时候, 使用实际的返回值.
        console.log('album id:', action.response);

        // return action.response;
        return state;
      }
    default:
      return state;
  }
};

