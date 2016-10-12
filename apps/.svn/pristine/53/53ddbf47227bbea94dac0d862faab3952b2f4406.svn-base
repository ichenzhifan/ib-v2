import { template } from 'lodash';
import { CALL_API } from '../middlewares/api';
import { API_BASE, GET_ENV, GET_SESSION_USER_INFO, USER_ID, GET_USER_ALBUM_ID } from '../contants/apiUrl';
import { combine, getUrl } from '../../../common/utils/url';
import { webClientId } from '../../../common/utils/strings';
import { getRandomNum } from '../../../common/utils/math';
import { title } from '../../../common/utils/querystring';

/**
 * action, 获取环境变量, 如各种api的根路径
 */
export function getEnv() {
  return (dispatch) => {
    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_ENV,
          params: {
            webClientId,
            baseUrl: API_BASE,
            autoRandomNum: getRandomNum()
          }
        }
      }
    });
  };
}

/**
 * action, 获取用户的会话信息
 */
export function getUserInfo() {
  return (dispatch, getState) => {
    const baseUrl = getUrl(getState(), 'system.env.urls.baseUrl');

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_SESSION_USER_INFO,
          params: {
            baseUrl,
            webClientId,
            autoRandomNum: getRandomNum()
          }
        }
      }
    });
  };
}

/**
 * action, 获取用户的Album id
 */
export function getAlbumId() {
  return (dispatch, getState) => {
    const baseUrl = getUrl(getState(), 'system.env.urls.baseUrl');
    const id = getUrl(getState(), 'system.env.userInfo.userId');

    let url = combine(API_BASE, template(GET_USER_ALBUM_ID)({ userId: id }), {
      // todo: title必须有值在线上环境.
      albumName: encodeURIComponent(title || 'test')
    });

    return dispatch({
      [CALL_API]: {
        apiPattern: {
          name: GET_USER_ALBUM_ID,
          params: {
            baseUrl,
            userId: id,
            albumName: encodeURIComponent(title || 'test')
          }
        }
      }
    });
  };
}
