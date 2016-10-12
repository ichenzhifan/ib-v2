import React, { Component, PropTypes } from 'react';
import { merge, isEqual } from 'lodash';
import { drawImage, clear } from '../../utils/draw';
import classNames from 'classnames';
import XHandler from '../XHandler';
import './index.scss';

export default class XPhotoElement extends Component {
  constructor(props) {
    super(props);
  }

  /**
   * 性能提升, 只要宽高和图片的属性发生变化时才重新渲染.
   * @param nextProps
   * @param nextState
   */
  shouldComponentUpdate(nextProps, nextState) {
    const isUpdated = !isEqual({
      width: this.props.width,
      height: this.props.height,
      options: this.props.options
    }, {
      width: nextProps.width,
      height: nextProps.height,
      options: nextProps.options
    });

    return isUpdated;
  }

  /**
   * 在render后, 渲染图片.
   */
  componentDidMount() {
    this.draw();
  }

  /**
   * 需要重新更新时, 重绘一下图片
   */
  componentDidUpdate() {
    this.draw();
  }

  /**
   * 渲染图片.
   */
  draw() {
    const { canvasId, width, height, options } = this.props;
    const { imageUrl, x = 0, y = 0 } = options;

    // 加载图片并绘制.
    clear(canvasId, x, y, width, height);
    drawImage(canvasId, imageUrl, x, y, null, width, height);
  }

  render() {
    const { className, children, canvasId, width, height } = this.props;
    const customClass = classNames('x-photo-element', className);

    return (
      <div className={customClass}>
        <canvas id={canvasId} width={width} height={height}></canvas>
          {children}
          {/* 控制元素, 用于控制渲染出来的图片, 如缩放, 旋转等 */}
          <XHandler />
      </div>
    );
  }
}

XPhotoElement.propTypes = {
  className: PropTypes.string,

  // 画布的宽和高
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,

  // 线的位置信息
  options: PropTypes.shape({
    imageUrl: PropTypes.string.isRequired,
    lineWidth: PropTypes.number,

    // 出血线的位置
    bleedTop: PropTypes.number,
    bleedBottom: PropTypes.number,
    bleedLeft: PropTypes.number,
    bleedRight: PropTypes.number,

    // 书脊的厚度
    spineThicknessWidth: PropTypes.number,

    // 包边
    wrapSize: PropTypes.number
  }).isRequired
};
