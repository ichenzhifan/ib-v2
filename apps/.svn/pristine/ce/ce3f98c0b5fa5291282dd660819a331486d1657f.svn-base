import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import classNames from 'classnames';
import './index.scss';

export default class XPopover extends Component {
  constructor(props) {
    super(props);

    const { shown, event, offset } = this.props;
    this.state = {
      shown: shown || false,
      event: event || 'click',
      offset: offset || {
        top: 0,
        left: 0
      }
    };

    this.onHideHandle = this.onHide.bind(this);

    // 如果为显示状态, 就加上隐藏面板的事件监听
    if (shown) {
      document.addEventListener('click', this.onHideHandle, false);
      window.addEventListener('resize', this.onHideHandle, false);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!Object.is(this.props.shown, nextProps.shown)) {
      // 如果是显示popover, 给document加上click事件, 用于隐藏popover
      if (nextProps.shown) {
        document.addEventListener('click', this.onHideHandle, false);
        window.addEventListener('resize', this.onHideHandle, false);
      } else {
        document.removeEventListener('click', this.onHideHandle, false);
        window.removeEventListener('resize', this.onHideHandle, false);
      }
    }

    this.setState({
      shown: nextProps.shown,
      offset: nextProps.offset
    });
  }

  /**
   * 隐藏popover
   */
  onHide() {
    this.setState({
      shown: false
    });

    // 移除事件监听.
    document.removeEventListener('click', this.onHideHandle, false);
    window.removeEventListener('resize', this.onHideHandle, false);
  }

  /**
   * 显示或隐藏popover
   * @param {Bool} shown true: 显示popover, false: 为隐藏popover
   */
  toggle(shown) {
    const onHideHandle = () => {
      this.toggle(false);
    };

    // 如果是显示popover, 给document加上click事件, 用于隐藏popover
    if (shown) {
      document.addEventListener('click', onHideHandle, false);
      document.addEventListener('resize', onHideHandle, false);
    } else {
      document.removeEventListener('click', onHideHandle, false);
      document.removeEventListener('resize', onHideHandle, false);
    }

    this.setState({
      shown
    });
  }

  render() {
    const { className, children } = this.props;
    const customClass = classNames('x-popover', className, { 'show': this.state.shown });
    const style = {
      top: `${this.state.offset.top}px`,
      left: `${this.state.offset.left}px`
    };

    return (
      <div className={customClass} style={style}>
        {children}
      </div>
    );
  }
}

XPopover.propTypes = {
  className: PropTypes.string,

  // Popover是否显示, true为显示
  shown: PropTypes.bool,

  // 触发Popover显示的事件, 默认为click
  event: PropTypes.string,

  // Popover显示时所在的位置.
  offset: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number
  })
};
