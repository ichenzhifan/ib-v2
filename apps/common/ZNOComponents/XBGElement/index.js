import React, { Component, PropTypes } from 'react';
import { drawRect, drawTextInCenter, clear } from '../../utils/draw';
import XHandler from '../XHandler';
import classNames from 'classnames';
import './index.scss';

export default class XBGElement extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    const { bgColor, canvasId, width, height, textInCenter } = this.props;

    // 绘制背景
    clear(canvasId, bgColor, 0, 0, width, height);
    drawRect(canvasId, bgColor, 0, 0, width, height, false, 0);

    // 中间的文字
    if (textInCenter && textInCenter.trim()) {
      drawTextInCenter(canvasId, textInCenter, '#acacac', 20, 'Gotham SSm A');
    }
  }

  render() {
    const { className, children, canvasId, width, height, handleClick } = this.props;
    const customClass = classNames('x-bg-element', className);

    return (
      <div className={customClass}>
        <canvas id={canvasId} width={width} height={height}></canvas>
        <XHandler handleClick={handleClick}/>
        {children}
      </div>
    );
  }
}

XBGElement.propTypes = {
  canvasId: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  textInCenter: PropTypes.string,
  className: PropTypes.string
};
