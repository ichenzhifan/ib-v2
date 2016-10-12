import React, { Component, PropTypes } from 'react';

import XHeader from '../../../../common/ZNOComponents/XHeader';
import './index.scss';

class PageHeader extends Component {
  constructor(props) {
    super(props);
    this.handleDownload = this.handleDownload.bind(this);
    this.handlePreview = this.handlePreview.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleOrder = this.handleOrder.bind(this);
  }

  handleDownload(e) {
    window.open('http://www.zno.com.dd/template-resources/h5Client/data/12X12SPEC_IW_T.zip', '_parent');
  }

  handleSetOption() {
    alert('handleSetOption');
  }

  handlePreview() {
    const { boundSystemActions } = this.props;
    boundSystemActions.showConfirm({
      confirmMessage: 'Your current project was already orderd or added to cart.You need to save your addtional changes into a new project.',
      okButtonText: 'Save as',
      cancelButtonText: 'Cancel',
      onOkClick: () => {
      },
      onCancelClick: () => {
      }
    });
    // alert('handlePreview');
  }

  handleSave() {
    const {
      boundSystemActions,
      boundProjectActions,
      projectId,
      userId,
      setting,
      spreadArray,
      imageArray
    } = this.props;

    boundProjectActions.saveProject(
      projectId,
      userId,
      setting,
      spreadArray,
      imageArray
    );
  }

  handleOrder() {
    alert('handleOrder');
  }


  render() {
    const {
      boundSystemActions,
      onLoginHandle,
      showRedirectHomeModal,
      showOptionsModal,
      onPreviewHandle,
      setting
    } = this.props;

    return (
      <XHeader
        showRedirectHomeModal={boundSystemActions.showConfirm}
      >
        <pre className="project-title">
          Customize your { setting && setting.product ==='IB'?'Image Box':'[ERR PRODUCT]' } - { setting && setting.size?setting.size.replace('X','*'):null } - { setting && setting.product === "IB"?setting.type==="IW"?'cover':'inside':'[ERROR]' }
        </pre>
        <div className="head-nav">
          <span className="nav-item" onClick={ this.handleDownload }>Box Spec</span>
          <span className="nav-item" onClick={ showOptionsModal }>Options</span>
          <span className="nav-item" onClick={ onPreviewHandle}>Preview</span>
          <span className="nav-item" onClick={ this.handleSave }>Save</span>
          <span className="nav-item" onClick={ this.handleOrder }>Order</span>
          <span className="nav-item" onClick={ onLoginHandle }>Login</span>
        </div>
      </XHeader>
    );
  }
}

PageHeader.propTypes = {
  showOptionsModal: PropTypes.func.isRequired,
  showRedirectHomeModal: PropTypes.func.isRequired,
  onLoginHandle: PropTypes.func.isRequired,
  onPreviewHandle: PropTypes.func.isRequired,
  projectId: PropTypes.string,
  userId: PropTypes.string,
  spreadArray: PropTypes.array.isRequired,
  imageArray: PropTypes.array.isRequired,
  setting: PropTypes.object.isRequired,
  boundSystemActions: PropTypes.object.isRequired,
  boundProjectActions: PropTypes.object.isRequired
};

export default PageHeader;
