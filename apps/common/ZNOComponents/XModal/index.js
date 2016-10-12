import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

export default class XModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children, className, opened, onClosed } = this.props;
    const modalClassName = classNames('x-modal', {
      'show': opened
    });
    const contentClassName = classNames('content', className);

    return (
      <div className={modalClassName}>
        <div className="backdrop"/>
        <div className={contentClassName}>
          <span className="icon-close" onClick={onClosed}/>
          {children}
        </div>
      </div>
    );
  }
}

XModal.propTypes = {
  onClosed: PropTypes.func.isRequired,
  className: PropTypes.string,
  opened: PropTypes.bool.isRequired
};
