import 'isomorphic-fetch';
import { API_BASE } from '../contants/apiUrl';
import { API_REQUEST, API_SUCCESS, API_FAILURE } from '../contants/actionTypes';

function callApi(api, request) {
  const fullUrl = API_BASE + api;
  let option = {};

  if (request) {
    option = {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    };
  }

  return fetch(fullUrl, option)
    .then(response => response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject({ json, response });
      }
      return json;
    });
}

export const CALL_API = Symbol('Call API');

export default store => next => (action) => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { api, request } = callAPI;

  if (typeof api === 'function') {
    api = api(store.getState());
  }

  if (typeof api !== 'string') {
    throw new Error('Specify a string api URL.');
  }

  next({
    api,
    type: API_REQUEST,
    request
  });

  return callApi(api).then(
    (response) => {
      next({
        api,
        type: API_SUCCESS,
        response
      });
    },
    (result) => {
      next({
        api,
        type: API_FAILURE,
        result
      });
    }
  );
};
