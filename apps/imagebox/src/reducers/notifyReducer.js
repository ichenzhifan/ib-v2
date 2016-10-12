import { merge } from 'lodash';
import { SHOW_NOTIFY, HIDE_NOTIFY } from '../contants/actionTypes';

const notify = (state={ isShow: false, notifyMessage: ''}, action) => {
  switch (action.type) {
    case SHOW_NOTIFY :
      return merge({}, state, {
        notifyMessage: action.notifyMessage,
        isShow: true
      });
    case HIDE_NOTIFY :
      return merge({}, state, {
        notifyMessage: '',
        isShow: false
      });
    default:
      return state;
  }
};

export default notify;
