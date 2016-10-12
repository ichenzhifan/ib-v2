import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

class XNotify extends Component {
  constructor(props) {
    super(props);
    this.handleClose= this.handleClose.bind(this);
  }

  handleClose() {
    const { hideNotify } = this.props;
    hideNotify();
  }

  render() {
    const { notifyMessage, isShow } = this.props;
    const cName= classNames('notify-top', { show: isShow })
    return (
      <div className={cName}>
        <span>◆</span>
        <a
          href="javascript:void(0)"
          className="icon-close"
          onClick={this.handleClose}
        ></a>
        <div className="notify-mes">{notifyMessage}</div>
      </div>
    );
  }
}

XNotify.propTypes = {
  hideNotify: PropTypes.func.isRequired,
  notifyMessage: PropTypes.string.isRequired,
  isShow: PropTypes.bool.isRequired
};

export default XNotify;
