import React, { Component, PropTypes } from 'react';
import './index.scss';
import logo from './new-logo-white.svg';

class XHeader extends Component {
  constructor(props) {
    super(props);
    this.handleLogoClick = this.handleLogoClick.bind(this);
  }
  // 点击logo 进入主页时候的执行函数
  handleLogoClick() {
    false
    ? window.location = '//www.zno.com.dd'
    : this.props.showRedirectHomeModal({
      confirmMessage: (
        <div className="homepage-text">
          This will take you to home page.
          <br/>
          Please select an option before continuing.
        </div>
      ),
      okButtonText: 'Save',
      cancelButtonText:'Don\'t Save',
      onOkClick: () => {},
      onCancelClick: () => {}
    });
  }

  render() {
    const { children } = this.props;
    return (
      <div className="mod-header">
        <div className="logo" onClick={this.handleLogoClick}>
          <img src={logo} alt="logo" />
        </div>
        <div className="header-area">
          {children}
        </div>
      </div>
    );
  }
}

XHeader.propTypes = {
  showRedirectHomeModal: PropTypes.func.isRequired
};

export default XHeader;
