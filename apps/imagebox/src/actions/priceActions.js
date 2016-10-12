import { template, get } from 'lodash';
import { CALL_API } from '../middlewares/api';
import { GET_PRODUCT_PRICE } from '../contants/apiUrl';
import { CHANGE_PROJECT_SETTING } from '../contants/actionTypes';

export function getProductPrice(product,opt) {
  return (dispatch,getState) => {
    const options = opt.join(",");
    const baseUrl = get(getState(), 'system.env.urls.baseUrl');
    return dispatch({
      [CALL_API]: {
        apiPattern : {
          name: GET_PRODUCT_PRICE,
          params : { baseUrl, product, options }
        }
      }
    })
  }
}
