import React, { Component, PropTypes } from 'react';
import { merge, template, mapValues } from 'lodash';
import ReactCrop from 'react-image-crop';


import XModal from '../XModal';
import XButton from '../XButton';

import 'react-image-crop/dist/ReactCrop.css';
import './index.scss';

const convertCropIn = (cropLUX, cropLUY, cropRLX, cropRLY) => {
  return mapValues({
    x: cropLUX,
    y: cropLUY,
    width: cropRLX - cropLUX,
    height: cropRLY - cropLUY
  }, o => o * 100);
};

const convertCropOut = (x, y, width, height) => {
  return mapValues({
    cropLUX: x,
    cropLUY: y,
    cropRLX: width + x,
    cropRLY: height + y
  }, o => o / 100);
};

class ImageEditModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imgSrc: '',
      rotate: 0,
      crop: null,
      initCrop: {
        x: 10,
        y: 10,
        width: 80,
        height: 80
      }
    };

    this.onCropChange = this.onCropChange.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const oldEncImgId = this.props.encImgId;
    const oldImgId = this.props.imageId;

    const {
      imageEditApiTemplate,
      defaultImageEditParams,
      encImgId,
      imageId,
      rotation,
      crop,
      aspectRatio
    } = nextProps;

    if (oldEncImgId !== encImgId || oldImgId !== imageId) {
      const newImgSrc = template(imageEditApiTemplate)(
        merge({}, defaultImageEditParams, { encImgId, imageId, rotation })
      );

      const { initCrop } = this.state;
      let newInitCrop = merge({}, initCrop, { aspect: aspectRatio });
      if (crop) {
        newInitCrop = merge(newInitCrop, convertCropIn(
          crop.cropLUX,
          crop.cropLUY,
          crop.cropRLX,
          crop.cropRLY
        ));
      }

      this.setState({
        imgSrc: newImgSrc,
        initCrop: newInitCrop,
        rotate: rotation
      });
    }
  }

  onCropChange(crop, pixelCrop) {
    this.setState({
      crop
    });
  }

  onImageLoaded(crop, image, pixelCrop) {
    this.setState({
      crop
    });
  }

  onSubmit() {
    const { encImgId, onDoneClick, onCancelClick } = this.props;
    const { crop, rotate } = this.state;

    const convertedCrop = convertCropOut(
      crop.x, crop.y, crop.width, crop.height
    );
    console.log(crop);
    console.log(convertedCrop);
    onDoneClick(encImgId, convertedCrop, rotate);
    onCancelClick();
  }

  rotate(degree) {
    const {
      imageEditApiTemplate,
      defaultImageEditParams,
      encImgId,
      imageId
    } = this.props;

    const { rotate } = this.state;

    let newRotate = 0;
    if (degree > 0) {
      if (rotate === 180) {
        newRotate = -90;
      } else {
        newRotate = rotate + degree;
      }
    } else {
      if (rotate === -90) {
        newRotate = 180;
      } else {
        newRotate = rotate + degree;
      }
    }

    const newImgSrc = template(imageEditApiTemplate)(
      merge({}, defaultImageEditParams, { encImgId, imageId, rotation: newRotate })
    );

    this.setState({
      imgSrc: newImgSrc,
      rotate: newRotate
    });
  }

  render() {
    const {
      isShown,
      onCancelClick
    } = this.props;

    const { imgSrc, initCrop } = this.state;


    return (
      <XModal
        className="image-edit-modal"
        opened={isShown}
        onClosed={onCancelClick}
      >
        <h3 className="modal-title">Set Image</h3>
        <div className="image-name">AEAE09876</div>

        <div className="cropper-area">
          {
            imgSrc
            ? <ReactCrop
              src={imgSrc}
              crop={initCrop}
              onChange={this.onCropChange}
              onImageLoaded={this.onImageLoaded}
            />
            : null
          }
        </div>

        <div className="rotate-controls">
          <div className="left-control">
            <button
              className="left-button"
              onClick={this.rotate.bind(this, -90)}
            />
            <p className="description">-90&deg;</p>
          </div>
          <div className="right-control">
            <button
              className="right-button"
              onClick={this.rotate.bind(this, 90)}
            />
            <p className="description">+90&deg;</p>
          </div>
        </div>

        <p className="modal-foot">
          <XButton
            onClicked={this.onSubmit}
          >
            Done
          </XButton>
        </p>
      </XModal>
    );
  }
}

ImageEditModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  imageEditApiTemplate: PropTypes.string.isRequired,
  encImgId: PropTypes.string.isRequired,
  onDoneClick: PropTypes.func.isRequired,
  aspectRatio: PropTypes.number,
  rotation: PropTypes.number,
  crop: PropTypes.shape({
    cropLUX: PropTypes.number,
    cropLUY: PropTypes.number,
    cropRLX: PropTypes.number,
    cropRLY: PropTypes.number
  }),
  onCancelClick: PropTypes.func,
};

ImageEditModal.defaultProps = {
  defaultImageEditParams: {
    px: 0,
    py: 0,
    pw: 1,
    ph: 1,
    width: 480,
    height: 310,
    rotation: 0
  },
  rotation: 0
};


export default ImageEditModal;
