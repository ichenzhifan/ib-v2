import React, { Component, PropTypes } from 'react';
import { merge, template, isEqual, set } from  'lodash';


// 导入用于本地化的组件
import { translate } from 'react-translate';
import { elementTypes, spreadTypes } from '../../contants/strings';

import {
  getBorderLinesXY,
  getWrapLinesXY,
  getSpineThicknessLinesXY,
  getPreviewSpineThicknessLinesXY
} from '../../../../common/utils/line';
import { makeId } from '../../../../common/utils/math';
import { combineImgCopperUrl, loadImg } from '../../../../common/utils/image';
import classNames from 'classnames';
import { IMAGES_CROPPER_PARAMS, TEXT_SRC } from '../../contants/apiUrl';
import { getWrapBoxes } from '../../../../common/utils/draw';
import XElements from '../../../../common/ZNOComponents/XElements';
import XBGElement from '../../../../common/ZNOComponents/XBGElement';
import XPhotoElement from '../../../../common/ZNOComponents/XPhotoElement';
import XTextElement from '../../../../common/ZNOComponents/XTextElement';
import XLines from '../../../../common/ZNOComponents/XLines';
import XBoxes from '../../../../common/ZNOComponents/XBoxes';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';

import './index.scss';

class Spread extends Component {
  constructor(props) {
    super(props);

    const state = this.initSpread(this.props);
    this.state = merge({}, state, {
      autoOpen: false
    });
  }

  componentWillReceiveProps(nextProps) {
    const { elementsOptions } = nextProps;
    if (!this.state.liveUpdateCropImageUrl && elementsOptions.url) {
      this.setState({
        liveUpdateCropImageUrl: elementsOptions.url
      });
    }

    if (!isEqual(this.props.spreadOptions, nextProps.spreadOptions)
      || !isEqual(this.props.elementsOptions, nextProps.elementsOptions)) {
      this.setState(this.initSpread(nextProps));
    }
  }

  initSpread(props) {
    const { spreadOptions, elementsOptions, isPreview, imageBaseUrl, baseUrls } = props;
    const { width, height } = spreadOptions;
    const _this = this;

    // 获取各种线的坐标.
    const lineWidth = 1;
    const borderLines = getBorderLinesXY(width, height, lineWidth, '#bcbcbc', true, 10);

    // 包括包边和出血区域在当前的case中, 因为没有设计出血线.
    const wrapLines = getWrapLinesXY(width, height, spreadOptions.wrapSize + spreadOptions.bleedTop, lineWidth, '#95989a');
    const spineThicknessLines = getSpineThicknessLinesXY(width, height, spreadOptions.spineThicknessWidth, lineWidth, '#bcbcbc', true, 12);
    const previewSpineThicknessLines = getPreviewSpineThicknessLinesXY(spreadOptions.wrapSize + spreadOptions.bleedTop, width, height, spreadOptions.spineThicknessWidth, lineWidth, '#bcbcbc', false);

    // photo元素的options设置
    const photoElements = [];
    const textElements = [];

    elementsOptions.forEach((m) => {
      if (m.type === elementTypes.photo) {
        photoElements.push(merge({}, m, {
          lineWidth,
          imageUrl: imageBaseUrl ? combineImgCopperUrl(imageBaseUrl + IMAGES_CROPPER_PARAMS,
            m,
            width,
            height) : ''
        }, {
          wrapSize: spreadOptions.wrapSize + spreadOptions.bleedTop,
          bleedTop: 0,
          bleedBottom: 0,
          bleedLeft: 0,
          bleedRight: 0
        }));
      } else if (m.type === elementTypes.text) {
        if (baseUrls) {
          const textUrl = template(TEXT_SRC)({
            fontBaseUrl: baseUrls.productBaseURL,
            text: encodeURIComponent(m.text),
            fontSize: encodeURIComponent(m.fontSize),
            fontColor: encodeURIComponent(m.color),
            fontFamily: encodeURIComponent(m.fontFamily),
            textAlign: encodeURIComponent(m.textAlign)
          });
          textElements.push(merge({}, m, {
            textUrl: textUrl
          }));
        }
      }
    });

    // 包边区域元素的options设置
    const boxesOptions = merge({}, spreadOptions, {
      wrapSize: spreadOptions.wrapSize + spreadOptions.bleedTop,
      bleedTop: 0,
      bleedBottom: 0,
      bleedLeft: 0,
      bleedRight: 0
    });

    // 获取上下左右四个包边区域的坐标和宽高信息
    let boxColor = '';
    if (isPreview) {
      boxColor = 'rgba(255, 255, 255, 1)';
    } else {
      boxColor = 'rgba(0, 0, 0, 0.05)';
    }
    const boxSize = {
      width,
      height,
      color: boxColor,
      bleedTop: boxesOptions.bleedTop,
      bleedBottom: boxesOptions.bleedBottom,
      bleedLeft: boxesOptions.bleedLeft,
      bleedRight: boxesOptions.bleedRight,
      wrapSize: boxesOptions.wrapSize,
      lineWidth
    };

    // 各种线的信息
    let lines = (spreadOptions.type === spreadTypes.coverPage) ? previewSpineThicknessLines : [];
    if (!isPreview) {
      lines = spreadOptions.type === spreadTypes.coverPage ?
        [...borderLines, ...wrapLines, ...spineThicknessLines]
        : [...borderLines, ...wrapLines];
    }

    const state = {
      lineWidth,
      borderLines,
      wrapLines,
      spineThicknessLines,
      photoElements,
      textElements,
      boxesOptions,
      boxSize,
      lines,
      previewSpineThicknessLines,
      liveUpdateCropImageUrl: elementsOptions.url
    };
    return state;
  }

  getPhotoElementHtml() {
    const { spreadId, spreadOptions, ratio, toggleOperationPanel } = this.props;
    const { width, height } = spreadOptions;

    const elements = this.state.photoElements.map((p, i) => {
      return (
        <XPhotoElement key={i} canvasId={makeId(spreadId)}
                       width={p.targetWidth || width}
                       height={p.targetHeight || height}
                       ratio={ratio}
                       onClicked={toggleOperationPanel}
                       options={p}>
        </XPhotoElement>
      );
    });

    return elements;
  }

  getTextElementHtml() {
    const { spreadId, spreadOptions, ratio } = this.props;

    const elements = this.state.textElements.map((p, i) => {
      return (
        <XTextElement canvasId={makeId(spreadId)}
                      width={p.width}
                      height={p.height}
                      options={p}
                      handleMouseMove={this.handleTextMove.bind(this)}
                      handleMouseDown={this.handleOnText.bind(this)}
                      handleDblClick={this.handleTextDblClick.bind(this)}
                      ratio={ratio}
                      key={i}>
        </XTextElement>
      );
    });

    return elements;
  }


  handleOnText(event) {

  }

  handleTextMove(opt) {
    const { boundProjectActions, spreadId, spreadOptions } = this.props;
    const { width, height } = spreadOptions;
    //边界检测
    if(opt.x<=0){
      opt.x=0;
    }else if(opt.x>=width-opt.width){
      opt.x=width-opt.width;
    }
    if(opt.y<=0){
      opt.y=0;
    }else if(opt.y>=height-opt.height){
      opt.y=height-opt.height;
    }
    boundProjectActions.updateElement(
      spreadId,
      opt.id,
      {
        x: opt.x,
        y: opt.y
      }
    );
  }

  handleBgClick(event) {
    // 标记, 图片上传完成后, 自动添加到canvas中.
    const { editText, boundWorkspaceActions, spreadId, spreadOptions } = this.props;
    boundWorkspaceActions.autoAddPhotoToCanvas(true, spreadId, spreadOptions.width, spreadOptions.height);

    this.setState({
      autoOpen: true
    });
  }

  handleTextDblClick(options) {
    editText(options);
  }

  resetOpenState() {
    this.setState({
      autoOpen: false
    });
  }

  render() {
    const { className, spreadId, spreadOptions, t, boundUploadedImagesActions, toggleModal } = this.props;
    const { width, height, bgColor } = spreadOptions;

    const customClass = classNames('spread', className);

    // spread的样式
    const styles = {
      width: `${width}px`,
      height: `${height}px`
    };

    return (
      <div className={customClass} style={styles}>
        <XFileUpload className="hidden"
                     isAutoOpen={this.state.autoOpen}
                     boundUploadedImagesActions={boundUploadedImagesActions}
                     toggleModal={toggleModal}
                     resetOpenState={this.resetOpenState.bind(this)}>
        </XFileUpload>
        <XElements>
          {/* 背景元素, 设置画布背景 */}
          <XBGElement canvasId={makeId(spreadId)}
                      bgColor={bgColor}
                      width={width}
                      height={height}
                      textInCenter={t('CLICK_TO_ADD_PHOTO') || ''}
                      handleClick={this.handleBgClick.bind(this)}
          />

          {/* 图片元素, 用于渲染图片 */}
          { this.getPhotoElementHtml() }

          {/* 文本元素, 用于渲染文本 */}
          { this.getTextElementHtml() }

        </XElements>

        {/* 四个包边区域 */}
        <XBoxes canvasId={makeId(spreadId)}
                width={width}
                height={height}
                boxSize={this.state.boxSize}
        />


        {/* 线条元素, 用于绘制各种线条 */}
        <XLines canvasId={makeId(spreadId)}
                width={width}
                height={height}
                lines={this.state.lines}
        />

      </div>
    );
  }
}

Spread.propTypes = {
  spreadId: PropTypes.string.isRequired,

  // spread的参数设置
  spreadOptions: PropTypes.shape({
    bgColor: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    bleedTop: PropTypes.number,
    bleedBottom: PropTypes.number,
    bleedLeft: PropTypes.number,
    bleedRight: PropTypes.number,
    spineThicknessWidth: PropTypes.number,
    wrapSize: PropTypes.number,
  }).isRequired,

  // 在spread上绘制图片的参数设置.
  elementsOptions: PropTypes.arrayOf(PropTypes.shape({
    // 图片的原始大小
    width: PropTypes.number,
    height: PropTypes.number,

    // 容器的大小
    targetWidth: PropTypes.number,
    targetHeight: PropTypes.number,

    // 图片的id
    encImgId: PropTypes.string,
    imageId: PropTypes.string
  })),

  imageBaseUrl: PropTypes.string,
  onClicked: PropTypes.func,
  className: PropTypes.string,
  isPreview: PropTypes.bool
};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('Spread')(Spread);
