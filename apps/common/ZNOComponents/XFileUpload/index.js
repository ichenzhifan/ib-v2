import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import XButton from '../XButton';
import classNames from 'classnames';
import './index.scss';

class XFileUpload extends Component {
  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps){
    const { resetOpenState } = this.props;
    if (nextProps.isAutoOpen) {
      this.onClickInput();
      resetOpenState();
    }
  }

  /**
   * 点击input控件, 弹出文件选择框.
   */
  onClickInput() {
    console.log("will");
    const input = findDOMNode(this.refs.fileInput);
    input.click();
  }

  render() {
    const { className, children, multiple } = this.props;
    const uploadFile = classNames('upload-button', className);
    return (
      <XButton className={uploadFile} onClicked={this.onClickInput.bind(this)}>
        <input type="file" ref="fileInput" onChange={ this.handleSelectFile.bind(this) } multiple={ multiple }/>
        <span>{children}</span>
      </XButton>
    );
  }

  handleSelectFile(event) {
    if (event.target.value) {
      const { boundUploadedImagesActions, toggleModal } = this.props;
      toggleModal('upload', true);
      const files = [...event.target.files];
      boundUploadedImagesActions.addImages(files);
    }
    event.target.value = '';
  }

}
XFileUpload.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string,
  multiple: PropTypes.string
};

export default XFileUpload;
