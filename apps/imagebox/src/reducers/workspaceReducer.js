import { combineReducers } from 'redux';
import { CHANGE_WORKSPACE_SPREAD } from '../contants/actionTypes';

const currentSpread = (state = {}, action) => {
  switch (action.type) {
    // 更改workspace中活动的spread
    case CHANGE_WORKSPACE_SPREAD: {
      return action.spread;
    }
    default:
      return state;
  }
};

export default combineReducers({
  currentSpread
});
