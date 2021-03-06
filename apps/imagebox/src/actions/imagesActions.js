import {
  ADD_IMAGES,
  UPDATE_IMAGEID,
  UPDATE_PERCENT,
  UPLOAD_COMPLETE,
  UPDATE_FIELDS,
  CLEAR_IMAGES,
  DELETE_IMAGE,
  RETRY_IMAGE,
  ERROR_TO_FIRST,
  SORT_IMAGE,
  DELETE_UPLOADED_IMAGE,
  UPDATE_IMAGE_USED_COUNT,
  CREATE_ELEMENT,
  AUTO_ADD_PHOTO_TO_CANVAS
} from '../contants/actionTypes';
import x2jsInstance from '../utils/xml2js';
import request from '../utils/ajax';
import { combine } from '../utils/url';
import { PENDING, DONE, PROGRESS, FAIL } from '../contants/uploadStatus';
import { UPLOAD_BASE, GET_IMAGE_IDS, UPLOAD_IMAGES, IMAGE_SRC } from '../contants/apiUrl';
import { getDefaultCropLRXY } from '../../../common/utils/crop';
import { Element } from '../../../common/utils/entry';
import { parsePropertiesToFloat } from '../../../common/utils/math';
import { set, get, template, merge } from 'lodash';

export function addImages(files) {
  return (dispatch, getState) => {
    const { system } = getState();
    const { uploading } = system.images;
    const { env, workspace } = system;
    const { autoAddPhotoToCanvas } = workspace;
    const getImageIdsUrl = template(GET_IMAGE_IDS)({ uploadBaseUrl: env.urls.uploadBaseUrl });
    const uploadImagesUrl = template(UPLOAD_IMAGES)({ uploadBaseUrl: env.urls.uploadBaseUrl });
    //未登录不上传
    if (!system.env.userInfo) {
      return false;
    }
    dispatch({ type: ADD_IMAGES, files });
    uploadFiles(getImageIdsUrl, uploadImagesUrl, files, dispatch, env, uploading, autoAddPhotoToCanvas);
  }
}

export function clearImages() {
  return {
    type: CLEAR_IMAGES
  }
}

export function deleteImage(imageId) {
  return {
    type: DELETE_IMAGE,
    imageId
  }
}

export function retryImage(imageId) {
  return (dispatch, getState) => {
    const { system } = getState();
    const { uploading } = system.images;
    const { env, workspace } = system;
    const { autoAddPhotoToCanvas } = workspace;
    const getImageIdsUrl = template(GET_IMAGE_IDS)({ uploadBaseUrl: env.urls.uploadBaseUrl });
    const uploadImagesUrl = template(UPLOAD_IMAGES)({ uploadBaseUrl: env.urls.uploadBaseUrl });
    //未登录不上传
    if (!system.env.userInfo) {
      return false;
    }
    //重传拿原始索引
    const index = uploading.findIndex((item)=> {
      return item.imageId === imageId;
    })
    uploadFiles(getImageIdsUrl, uploadImagesUrl, [uploading[index].file], dispatch, env, uploading, autoAddPhotoToCanvas, true, index);
  }
}
// /**
//  * 根据field重新排序uploadedImage
//  * @param field
//  */
// export function sortImage(field){
//     return {
//       type : SORT_IMAGE,
//       field
//     }
// }
// /**
//  * 根据imageId删除图片列表中选中的图片
//  *@param imageId
//  */
// export function deleteUploadedImage(imageId){
//   return {
//     type : DELETE_UPLOADED_IMAGE,
//     imageId
//   }
// }
// /**
//  * 根据imageId更新图片的使用次数
//  *@param imageId
//  */
// export function updateUploadedImageUsedCount(imageId){
//   return {
//     type : UPDATE_IMAGE_USED_COUNT,
//     imageId
//   }
// }

/**
 * action, 上传图片
 * @param getImgIdsUrl 获取图片ids接口
 * @param uploadImagesUrl 上传图片接口
 * @param files 上传图片列表
 * @param dispatch
 * @param env
 * @param uploadedImages
 * @param isRetry 是否重传
 * @param index 重传索引
 * @returns {function(*)}
 */
function uploadFiles(getImgIdsUrl, uploadImagesUrl, files, dispatch, env, uploadedImages, autoAddPhotoToCanvas, isRetry, index) {
  const uploadImagesLength = uploadedImages.length;
  request({
    url: combine(getImgIdsUrl, '', {
      imageIdCount: files.length
    }),
    success: function (result) {
      if (result) {
        const xmlData = x2jsInstance.xml2js(result);
        const ids = xmlData.imageIds.id;
        const idCount = Array.isArray(ids) ? ids.length : 1;
        for (let i = 0; i < idCount; i++) {
          const currentId = Array.isArray(ids) ? ids[i] : ids;
          // 获取imageid
          const idx = typeof index != 'undefined' ? index : i + uploadImagesLength;
          dispatch({
            type: UPDATE_IMAGEID,
            index: idx,
            imageId: currentId
          });
          if (isRetry) {
            dispatch({
              type: UPDATE_FIELDS,
              imageId: currentId,
              fields: {
                precent: 0,
                info: ''
              }
            });
          }
          const file = files[i];
          const formData = new FormData();
          formData.append('uid', get(env, 'userInfo.userId'));
          formData.append('timestamp', get(env, 'userInfo.timestamp'));
          formData.append('token', get(env, 'userInfo.token'));
          formData.append('albumId', get(env, 'albumId'));
          formData.append('albumName', "test title");
          formData.append('Filename', file.name.replace(/[\&\/\_]+/g, ''));
          formData.append('filename', file);
          // 更新上传状态并开始上传
          dispatch({
            type: UPDATE_FIELDS,
            imageId: currentId,
            fields: {
              status: PROGRESS
            }
          });
          const xhr = request({
            url: combine(uploadImagesUrl, '', {
              imageId: currentId
            }),
            method: 'post',
            data: formData,
            success: function (res) {
              if (res) {
                const xmlRes = x2jsInstance.xml2js(res);
                if (res.indexOf('state="success"') !== -1) {
                  // 更新成功状态
                  dispatch({
                    type: UPDATE_FIELDS,
                    imageId: currentId,
                    fields: {
                      status: DONE,
                      percent: 'Done'
                    }
                  });

                  const fileInfo = {
                    name: file.name.replace(/[\&\/\_]+/g, ''),
                    url: combine(get(env, 'urls.uploadBaseUrl'), IMAGE_SRC, {
                      qaulityLevel: 0,
                      puid: get(xmlRes, 'resultData.img.encImgId')
                    }),
                    usedCount: 0,
                    status: DONE,
                    imageId: currentId,
                    totalSize: get(xmlRes, 'resultData.img.size'),
                    guid: get(xmlRes, 'resultData.img.guid'),
                    uploadTime: new Date(get(xmlRes, 'resultData.img.insertTime')).getTime(),
                    encImgId: get(xmlRes, 'resultData.img.encImgId'),
                    width: get(xmlRes, 'resultData.img.width'),
                    height: get(xmlRes, 'resultData.img.height'),
                    createTime: file.lastModified
                  };
                  dispatch({
                    type: UPLOAD_COMPLETE,
                    fields: fileInfo
                  });

                  // 判断是否需要自动添加到画布中.
                  if (autoAddPhotoToCanvas && autoAddPhotoToCanvas.status) {
                    const { spreadId, targetHeight, targetWidth } = autoAddPhotoToCanvas;
                    let newData = parsePropertiesToFloat(merge({}, fileInfo, { imageid: fileInfo.imageId }), ['width', 'height']);

                    // 获取图片的裁剪参数.
                    let element = new Element(merge(newData, getDefaultCropLRXY(newData.width, newData.height, targetWidth, targetHeight)));

                    // 新增一个element.
                    dispatch({
                      type: CREATE_ELEMENT,
                      spreadId,
                      element
                    });

                    // 关闭自动添加的功能, 只有在需要的时候再开启.
                    dispatch({
                      type: AUTO_ADD_PHOTO_TO_CANVAS,
                      status: false,
                      spreadId: '',
                      targetWidth: 0,
                      targetHeight: 0
                    });
                  }
                } else if (res.indexOf('state="fail"') !== -1) {
                  // 更新失败状态
                  dispatch({
                    type: UPDATE_FIELDS,
                    imageId: currentId,
                    fields: {
                      status: FAIL,
                      percent: xmlRes.resultData.errorInfo,
                      info: xmlRes.resultData.errorInfo,
                      file: file
                    }
                  });
                  //将上传失败的放到第一个
                  if (!isRetry) {
                    dispatch({
                      type: ERROR_TO_FIRST,
                      imageId: currentId
                    })
                  }
                }
              }

            },
            progress: function (data) {
              dispatch({
                type: UPDATE_PERCENT,
                imageId: currentId,
                percent: Math.floor(data.loaded / data.total * 100)
              });
            },
            error: function () {
              // 更新失败状态
              dispatch({
                type: UPDATE_FIELDS,
                imageId: currentId,
                fields: {
                  status: FAIL,
                }
              });
            }
          });
          //更新xhr
          dispatch({
            type: UPDATE_FIELDS,
            imageId: currentId,
            fields: {
              xhr: xhr,
            }
          });
        }
      }
    }
  })
}
