import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import './index.scss';

export default class XHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseDown: false
    }
  }

  handleMouseDown(event) {
    var { handleMouseDown } = this.props;
    this.setState({
      mouseDown: true
    });
    handleMouseDown && handleMouseDown(event);
  }

  handleMouseMove(event) {
    var { handleMouseMove } = this.props;
    if (this.state.mouseDown) {
      handleMouseMove && handleMouseMove(event);
    }
  }

  handleMouseUp(event) {
    var { handleMouseUp } = this.props;
    this.setState({
      mouseDown: false
    });
    handleMouseUp && handleMouseUp(event);
  }

  handleMouseOut(event) {
    var { handleMouseOut } = this.props;
    this.setState({
      mouseDown: false
    });
    handleMouseOut && handleMouseOut(event);
  }

  render() {
    const {
            className,
            children,
            handleClick,
            handleDblClick,
            handleMouseOver,
            handleDrop,
            handleDragStart,
            handleDragOver,
            handleDragEnter,
            handleDragLeave,
            handleDragEnd,
            draggable
          } = this.props;
    const customClass = classNames('x-handler', className);

    return (
      <div className={customClass}
           onClick={handleClick}
           onDoubleClick={handleDblClick}
           onMouseDown={this.handleMouseDown.bind(this)}
           onMouseMove={this.handleMouseMove.bind(this)}
           onMouseOver={handleMouseOver}
           onMouseOut={this.handleMouseOut.bind(this)}
           onMouseUp={this.handleMouseUp.bind(this)}
           onDrop={handleDrop}
           onDragStart={handleDragStart}
           onDragOver={handleDragOver}
           onDragEnter={handleDragEnter}
           onDragLeave={handleDragLeave}
           onDragEnd={handleDragEnd}
           draggable={draggable}>
        {children}
      </div>
    );
  }
}

XHandler.propTypes = {
  className: PropTypes.string,
  handleClick: PropTypes.func,
  handleDblClick: PropTypes.func,
  handleMouseDown: PropTypes.func,
  handleMouseOver: PropTypes.func,
  handleMouseOut: PropTypes.func,
  handleDrop: PropTypes.func,
  handleDragStart: PropTypes.func,
  handleDragOver: PropTypes.func,
  handleDragEnter: PropTypes.func,
  handleDragLeave: PropTypes.func,
  handleDragEnd: PropTypes.func,
  draggable: PropTypes.bool
};
