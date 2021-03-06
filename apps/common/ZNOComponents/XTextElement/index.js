import React, { Component, PropTypes } from 'react';
import { get, merge, isEqual } from 'lodash';
import { drawImage, clear, drawDashedLine } from '../../utils/draw';
import classNames from 'classnames';
import XHandler from '../XHandler';
import './index.scss';

export default class XTextElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disX: 0,
      disY: 0,
      positionChange: false
    };
  }

  /**
   * 性能提升, 只要宽高和图片的属性发生变化时才重新渲染.
   * @param nextProps
   * @param nextState
   */
  shouldComponentUpdate(nextProps, nextState) {
    // const isUpdated = !isEqual({
    //   width: this.props.width,
    //   height: this.props.height,
    //   options: this.props.options
    // }, {
    //   width: nextProps.width,
    //   height: nextProps.height,
    //   options: nextProps.options
    // });
    let isUpdated = !isEqual({
      width: this.props.width,
      height: this.props.height,
      fontFamily: get(this.props,'options.fontFamily'),
      fontSize: get(this.props,'options.fontSize'),
      fontWeight: get(this.props,'options.fontWeight'),
      color: get(this.props,'options.color'),
      text: get(this.props,'options.text'),
      textWidth: get(this.props,'options.width'),
      textHeight: get(this.props,'options.height')
    }, {
      width: nextProps.width,
      height: nextProps.height,
      fontFamily: get(nextProps,'options.fontFamily'),
      fontSize: get(nextProps,'options.fontSize'),
      fontWeight: get(nextProps,'options.fontWeight'),
      color: get(nextProps,'options.color'),
      text: get(nextProps,'options.text'),
      textWidth: get(nextProps,'options.width'),
      textHeight: get(nextProps,'options.height')
    });

    if (isUpdated) {
      this.setState({
        positionChange: false
      });
    }else{
      isUpdated = !isEqual({
        x: get(this.props,'options.x'),
        y: get(this.props,'options.y')
      }, {
        x: get(nextProps,'options.x'),
        y: get(nextProps,'options.y')
      });
      if (isUpdated) {
        this.setState({
          positionChange: true
        });
      }
    }

    return isUpdated;
  }

  /**
   * 渲染图片.
   */
  componentDidUpdate() {
    if (!this.state.positionChange) {
      this.draw();
    }
  }

  /**
   * 渲染图片.
   */
  componentDidMount() {
    this.draw();
  }

  draw() {
    const { canvasId, width, height, options } = this.props;
    const { textUrl } = options;

    // 加载图片并绘制.
    clear(canvasId, 0, 0, width, height);
    drawImage(canvasId, textUrl, 0, 0, null, width, height);

    //绘制虚线框
    // this.drawDashedRect();
  }

  drawDashedRect() {
    const { canvasId, width, height, options } = this.props;
    const color = '#f7f7f7';
    //top
    drawDashedLine(canvasId, color, -1, 0, width, 0, 1, 3);
    //left
    drawDashedLine(canvasId, color, 0, 0, 0, height, 1, 3);
    //right
    drawDashedLine(canvasId, color, width, 0, width, height, 1, 3);
    //bottom
    drawDashedLine(canvasId, color, 0, height, width, height, 1, 3);
  }

  handleMouseDown(event) {
    const { handleMouseDown, options } = this.props;
    const disX = event.pageX - options.x;
    const disY = event.pageY - options.y;
    this.setState({
      disX: disX,
      disY: disY
    });
    handleMouseDown && handleMouseDown(event);
  }

  handleMouseMove(event) {
    const { handleMouseMove, options } = this.props;
    const { disX, disY } = this.state;
    const { id, width, height } = options;
    const x = event.pageX - disX;
    const y = event.pageY - disY;
    handleMouseMove && handleMouseMove({
      id,
      x,
      y,
      width,
      height
    })
  }

  handleDblClick() {
    const { handleDblClick, options } = this.props;
    handleDblClick(options);
  }

  render() {
    const { className, children, handleMouseMove, handleMouseDown, canvasId, width, height, options, ratio } = this.props;
    const customClass = classNames('x-text-element', className);
    // 定位textElement
    const styles = {
      top: `${options.y}px`,
      left: `${options.x}px`
    };
    return (
      <div className={customClass} style={styles}>
        <canvas id={canvasId} width={width} height={height}></canvas>
        {children}
        {/* 控制元素, 用于控制渲染出来的图片, 如缩放, 旋转等 */}
        <XHandler handleMouseDown={this.handleMouseDown.bind(this)}
                  handleDblClick={this.handleDblClick.bind(this)}
                  handleMouseMove={this.handleMouseMove.bind(this)}/>
      </div>
    );
  }
}

XTextElement.propTypes = {
  className: PropTypes.string,

  // 画布的宽和高
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,

  // 线的位置信息
  options: PropTypes.shape({
    textUrl: PropTypes.string.isRequired,
    lineWidth: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number
  }).isRequired
};
