import React, { Component, PropTypes } from 'react';
import { merge, get, set, pick, forEach, isEmpty } from 'lodash';
import { PENDING, DONE, PROGRESS, FAIL } from '../../contants/uploadStatus';
import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import { translate } from 'react-translate';
import ItemList from '../UploadItemList';
import './index.scss';

class UploadModal extends Component {
	constructor(props) {
  super(props);
}

  componentWillReceiveProps(nextProps) {

  }

  handleAddMore(e) {
    //
  }

  handleUploadModalClosed(){
    const { boundUploadedImagesActions, toggleModal, uploadingImages } = this.props;
    const uploading = uploadingImages.filter((item)=>{
      return item.status === PENDING || item.status === PROGRESS;
    })
    if(uploading.length){
        if(window.confirm("Your image has not been uploaded.\n What do you want to do?")){
          uploadingImages.map((item)=>{
            item.xhr.abort();
          });
        }else{
          return false;
        }
    }
    toggleModal('upload', false);
    boundUploadedImagesActions.clearImages();
  }

  selectFile() {

  }

  render() {
    const { opened, t, uploadingImages, boundUploadedImagesActions, toggleModal } = this.props;
    // this.setState({
    //   uploadedImages : merge([],uploadingImages)
    // })
    let successUploaded = 0, errorUploaded = 0;
    // 计算上传成功和失败的图片数量
    uploadingImages.map((item)=>{
        if(item.status === DONE){
          successUploaded ++;
        }else if(item.status === FAIL){
          errorUploaded ++;
        }
    })
    return (
      <XModal
        className="upload-modal"
        onClosed={ this.handleUploadModalClosed.bind(this) }
        opened={opened}
      >
        <div className="box-image-upload">
          <h3 className="title">
            { t('UPLOAD_IMAGES') }
          </h3>
          <ItemList
              uploadList={ uploadingImages }
              boundUploadedImagesActions={ boundUploadedImagesActions } />
          <div className="upload-meta">
            <div className="upload-info">
              <span className="compelete">
                { t('COMPLETE_COUNT', { n: successUploaded }) }
              </span>
              <span className="failed">
                { t('FILED_COUNT', { n: errorUploaded }) }
              </span>
            </div>
            <div className="upload-buttons">
              <XFileUpload
                  className="white"
                  boundUploadedImagesActions={ boundUploadedImagesActions }
                  toggleModal={ toggleModal }
                  multiple="multiple">
                { t('ADD_MORE_PHOTOS') }
              </XFileUpload>
              <XButton
                onClicked={ this.handleUploadModalClosed.bind(this) }
                className="cancel-all"
              >
                { t('CANCELL_ALL') }
              </XButton>
            </div>
          </div>
        </div>
      </XModal>
    );
  }
}

UploadModal.propTypes = {
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  uploadList : PropTypes.array
};

export default translate('UploadModal')(UploadModal);
