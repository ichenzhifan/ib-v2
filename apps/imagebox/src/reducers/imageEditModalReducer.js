import { merge } from 'lodash';
import {
  SHOW_IMAGE_EDIT_MODAL,
  HIDE_IMAGE_EDIT_MODAL
} from '../../src/contants/actionTypes';

const initialState = {
  isShown: false,
  imageEditApiTemplate: '',
  encImgId: '',
  onDoneClick: () => {},
  onCancelClick: () => {}
};

const imageEditModalData = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_IMAGE_EDIT_MODAL: {
      return merge({}, state, action.imageEditModalData, { isShown: true });
    }
    case HIDE_IMAGE_EDIT_MODAL: {
      return merge({}, state, { isShown: false });
    }
    default:
      return state;
  }
};

export default imageEditModalData;
