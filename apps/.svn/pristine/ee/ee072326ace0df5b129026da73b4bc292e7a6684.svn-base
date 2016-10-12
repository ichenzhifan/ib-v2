import React, {Component, PropTypes} from 'react';

export default class XDrop extends Component {
  constructor(props) {
    super(props);
  }

  onDrapOvered(event) {
    event.stopPropagation();
    event.preventDefault();
    return false;
  }

  render() {
    const { children, onDroped, onDragEntered, onDragLeaved, onDragEnded } = this.props;
    return (
      <div onDrop={onDroped}
           onDragOver={this.onDrapOvered.bind(this)}
           onDragEnter={onDragEntered}
           onDragEnd={onDragEnded}
           onDragLeave={onDragLeaved}>
        {children}
      </div>
    );
  }
}

XDrop.propTypes = {
  onDroped: PropTypes.func.isRequired,
  onDragEntered: PropTypes.func,
  onDragLeaved: PropTypes.func,
  onDragEnded: PropTypes.func
}
