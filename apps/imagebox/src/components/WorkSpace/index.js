import React, { Component, PropTypes } from 'react';
import { merge, template, get, set, isEqual } from 'lodash';
import { translate } from "react-translate";
import XAddText from '../../../../common/ZNOComponents/XAddText';
import { getSize } from '../../../../common/utils/helper';
import { parsePropertiesToFloat } from '../../../../common/utils/math';
import { workSpacePrecent, sideBarWidth, spreadTypes } from '../../contants/strings';
import { IMAGES_CROPPER, IMAGES_CROPPER_PARAMS } from '../../contants/apiUrl';
import { combineImgCopperUrl, loadImg } from '../../../../common/utils/image';
import { getRotatedAngle, getDefaultCropLRXY } from '../../../../common/utils/crop';
import { elementTypes } from '../../contants/strings';
import { Element } from '../../../../common/utils/entry';

import XDrop from '../../../../common/ZNOComponents/XDrop';
import Loading from '../Loading';

import Spread from '../Spread';
import OutInSide from '../OutInSide';
import OperationPanel from '../OperationPanel';
import './index.scss';

class WorkSpace extends Component {
  constructor(props) {
    super(props);

    // 初始化state
    this.state = this.initWorkspace();
  }

  componentWillReceiveProps(nextProps) {
    const baseUrls = get(nextProps, 'baseUrls');

    // spreads有更新时, 就只更新spreadsOptions
    if (!isEqual(this.props.spreads, nextProps.spreads)) {
      const { boundWorkspaceActions } = nextProps;
      const { spreads, texts } = nextProps;
      const spreadOptions = this.formatSpreadOptions(spreads, texts);

      if (spreadOptions && spreadOptions.length) {
        const index = this.getCurrentSpreadIndex();
        boundWorkspaceActions.changeSpread(spreadOptions[index !== -1 ? index : 0]);
      }

      this.setState({
        spreadOptions
      });
    }

    // currentSpread有更新时, 就只更新currentSpread数据
    if (!isEqual(this.props.currentSpread, nextProps.currentSpread)) {

      this.setState({
        currentSpread: nextProps.currentSpread
      });
    }

    // baseUrls数据有更新时, 就只更新baseUrls的数据.
    if (!isEqual(this.state.baseUrls, baseUrls) && baseUrls) {
      const imageBaseUrl = template(IMAGES_CROPPER)(baseUrls);
      this.setState({
        baseUrls,
        imageBaseUrl
      });
    }
  }

  /**
   * 挂载后, 就加上onresize事件.
   */
  componentDidMount() {
    // 当窗口大小改变时, 重新设置workspace的大小.
    this.addResizeEvent();
  }

  /**
   * 在卸载之前, 取消onresize事件.
   */
  componentWillUnmount() {
    window.onresize = null;
  }

  /**
   * 根据props的值, 初始化state的值.
   */

  initWorkspace(props) {
    const { spreads, baseUrls, currentSpread, texts } = props || this.props;
    const spreadOptions = this.formatSpreadOptions(spreads, texts);
    const state = {
      baseUrls,

      // spread的绘制参数
      spreadOptions,

      // 当前显示的spread
      currentSpread,

      // 在当前的spread中, 渲染的photoelement的索引.
      activePhotoElementIndex: 0,

      // 点击画布, 弹出的操作面板.
      // operations: {
      //   shown: false,
      //   offset: {
      //     top: 150,
      //     left: 500
      //   }
      // }
    };

    return state;
  }

  formatSpreadOptions(spreads, texts) {
    const { imageArray } = this.props;
    const spreadsOptions = [];
    if (!spreads || !spreads.length) {
      return spreadsOptions;
    }

    spreads.forEach((s) => {
      const pageSize = getSize();

      let wsPrecent;
      switch (s.type) {
        case spreadTypes.coverPage:
          wsPrecent = workSpacePrecent.big;
          break;
        case spreadTypes.innerPage:
          wsPrecent = workSpacePrecent.sm;
          break;
        default:
          break;
      }

      if (wsPrecent) {
        const workspaceWidth = (pageSize.width - sideBarWidth) * wsPrecent;
        const rate = workspaceWidth / s.width;
        const left = sideBarWidth + (((pageSize.width - sideBarWidth) - workspaceWidth) / 2);
        const opt = merge({}, s, {
          width: s.width * rate,
          height: s.height * rate,
          bleedTop: s.bleedTop * rate,
          bleedBottom: s.bleedBottom * rate,
          bleedLeft: s.bleedLeft * rate,
          bleedRight: s.bleedRight * rate,
          spineThicknessWidth: s.spineThicknessWidth * rate,
          wrapSize: s.wrapSize * rate
        });

        // 检查spread下面的elements, 是否提供encImgId.
        const elements = [];
        if (s.elements && s.elements.length) {
          s.elements.forEach((ele) => {
            if (ele.type === elementTypes.photo) {
              const img = imageArray.find((v) => {
                return v.id === ele.imageid;
              });

              elements.push(merge({}, ele, {
                encImgId: img ? img.encImgId : ''
              }));
            } else {
              elements.push(ele);
            }
          });
        }

        spreadsOptions.push({
          rate,
          pageSize,
          workspaceWidth,
          spreadOptions: opt,
          elementsOptions: elements,
          textsOptions: texts,
          originalOptions: s,
          left
        });
      }
    });

    return spreadsOptions;
  }

  getCurrentSpreadIndex() {
    // 查找当前显示的是那一个spread
    const index = this.state.spreadOptions.findIndex((v) => {
      return v.spreadOptions.id === this.state.currentSpread.spreadOptions.id;
    });

    return index;
  }

  /**
   * onresize的处理函数, 更改state.
   */
  addResizeEvent() {
    let timer = null;

    window.onresize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const index = this.getCurrentSpreadIndex();
        const state = this.initWorkspace();

        // resize后, 继续显示当前的spread, 而不是调到默认的spread中.
        if (index !== -1) {
          state.currentSpread = state.spreadOptions[index];
        }
        this.setState(state);
      }, 500);
    };
  }

  /**
   * 点击查看封面页时.
   */
  onOutside() {
    const { boundWorkspaceActions } = this.props;

    // 关闭operation panel.
    boundWorkspaceActions.toggleOperationPanel(false);

    const index = this.getCurrentSpreadIndex();
    const spreadOptions = this.state.spreadOptions;
    if (spreadOptions && spreadOptions.length && !Object.is(index, 0)) {
      boundWorkspaceActions.changeSpread(spreadOptions[0]);
    }
  }

  /**
   * 点击查看里面页时.
   */
  onInside() {
    const { boundWorkspaceActions } = this.props;
    // 关闭operation panel.
    boundWorkspaceActions.toggleOperationPanel(false);

    const index = this.getCurrentSpreadIndex();
    const spreadOptions = this.state.spreadOptions;
    if (spreadOptions && spreadOptions.length > 1 && !Object.is(index, 1)) {
      boundWorkspaceActions.changeSpread(spreadOptions[1]);
    }
  }

  /**
   * 显示或隐藏操作面板
   */
  toggleOperationPanel(ev) {
    const { operationPanel, boundWorkspaceActions } = this.props;

    const event = ev || window.event;
    event.stopPropagation();

    // 隐藏或显示操作面板
    const offset = {
      top: event.clientY,
      left: event.clientX
    };

    boundWorkspaceActions.toggleOperationPanel(!operationPanel.status, offset);
  }

  /**
   * 裁剪图片的处理函数
   * @param ev
   */
  onCropImage(ev) {
    const { boundSystemActions, baseUrls, imageArray, boundProjectActions, boundWorkspaceActions } = this.props;

    // 关闭operation panel.
    boundWorkspaceActions.toggleOperationPanel(false);

    // 获取在当前的spread和处于活动状态的photoelement的索引.
    const { activePhotoElementIndex, currentSpread } = this.state;
    const activePhotoElement = get(currentSpread, `elementsOptions[${activePhotoElementIndex}]`);

    // 如果活动状态的photoelement不为空.
    if (activePhotoElement) {
      const corpApiTemplate = template(IMAGES_CROPPER)(baseUrls) + IMAGES_CROPPER_PARAMS;
      const { width, height } = currentSpread.spreadOptions;
      const { cropLUX = 0, cropLUY = 0, cropRLX = 1, cropRLY = 1, rotation = 0, imageid = 0, encImgId = '' } = activePhotoElement;
      let eId = encImgId;
      if (!eId) {
        const img = imageArray.find((v) => {
          return v.id === imageid;
        });

        eId = img ? img.encImgId : '';
      }

      boundSystemActions.showImageEditModal({
        imageEditApiTemplate: corpApiTemplate,
        encImgId: eId,
        imageId: eId ? 0 : imageid,
        rotation,
        aspectRatio: width / height,
        crop: {
          cropLUX,
          cropLUY,
          cropRLX,
          cropRLY
        },
        onDoneClick: (encImgId, crop, rotate) => {
          const spreadId = currentSpread.spreadOptions.id;
          const elementId = activePhotoElement.id;
          boundProjectActions.updateElement(spreadId, elementId, merge({}, crop, { imgRot: rotate }));
        }
      });
    }
  }

  /**
   * 旋转图片的处理函数
   * @param ev
   */
  onRotateImage(ev) {
    const { boundWorkspaceActions } = this.props;
    // 关闭operation panel.
    boundWorkspaceActions.toggleOperationPanel(false);

    // 获取在当前的spread和处于活动状态的photoelement的索引.
    const { activePhotoElementIndex, currentSpread } = this.state;
    const activePhotoElement = get(currentSpread, `elementsOptions[${activePhotoElementIndex}]`);

    const newDegree = getRotatedAngle(activePhotoElement.imgRot, 90);
    this.updateElement({ imgRot: newDegree });
  }

  /**
   * 删除图片的处理函数
   * @param ev
   */
  onRemoveImage(ev) {
    const { boundProjectActions, boundWorkspaceActions } = this.props;
    // 关闭operation panel.
    boundWorkspaceActions.toggleOperationPanel(false);

    // 获取在当前的spread和处于活动状态的photoelement的索引.
    const { activePhotoElementIndex, currentSpread } = this.state;
    const activePhotoElement = get(currentSpread, `elementsOptions[${activePhotoElementIndex}]`);

    // 获取当前的spread和获取的element
    const spreadId = currentSpread.spreadOptions.id;
    const elementId = activePhotoElement.id;

    boundProjectActions.deleteElement(spreadId, elementId);
  }

  /**
   * 图片拖拽到工作区并释放鼠标时触发的处理函数.
   */
  onSpreadDroped(event) {
    event.stopPropagation();
    event.preventDefault();

    const { boundProjectActions, boundWorkspaceActions } = this.props;
    // 关闭operation panel.
    boundWorkspaceActions.toggleOperationPanel(false);

    const data = JSON.parse(event.dataTransfer.getData('drag'));
    const { boundSystemActions, boundUploadedImagesActions } = this.props;

    if (data) {
      // 显示loading icon
      boundSystemActions.showLoading(true);
      const { width, height } = this.state.currentSpread.spreadOptions;

      let newData = parsePropertiesToFloat(data, ['width', 'height']);

      let imageOptions = new Element(merge(newData, getDefaultCropLRXY(newData.width, newData.height, width, height)));

      const elementsOptions = this.state.currentSpread.elementsOptions;
      if (elementsOptions && elementsOptions.length) {
        imageOptions = merge({}, elementsOptions[0], imageOptions, {
          encImgId: encodeURIComponent(newData.encImgId)
        });
      }

      const { imageBaseUrl, activePhotoElementIndex } = this.state;
      const imageUrl = combineImgCopperUrl(imageBaseUrl + IMAGES_CROPPER_PARAMS,
        imageOptions,
        width,
        height);

      // 如果activePhotoElement存在, 就更新它, 否则创建一个新的element
      this.createOrUpdateElement(imageOptions);

      // 预加载图片.
      loadImg(imageUrl).then((img) => {
        // 隐藏loading icon
        boundSystemActions.hideLoading();

        const currentSpread = merge({}, this.state.currentSpread, set(this.state.currentSpread, `elementsOptions[${activePhotoElementIndex}]`, imageOptions));
        boundWorkspaceActions.changeSpread(currentSpread);
      }, () => {
        // 隐藏loading icon
        boundSystemActions.hideLoading();
      });
    }

    event.dataTransfer.clearData();
  }

  /**
   * 如果activePhotoElement存在, 就更新它, 否则创建一个新的element
   */
  createOrUpdateElement(newAttribute, type = elementTypes.photo) {
    const { boundProjectActions } = this.props;

    // 获取在当前的spread和处于活动状态的photoelement的索引.
    const { activePhotoElementIndex, currentSpread } = this.state;
    const activePhotoElement = get(currentSpread, `elementsOptions[${activePhotoElementIndex}]`);

    // 获取当前的spread和获取的element
    const spreadId = currentSpread.spreadOptions.id;

    // 如果activePhotoElement存在, 就更新它, 否则创建一个新的element
    if (newAttribute) {
      if (activePhotoElement) {
        const elementId = activePhotoElement.id;
        boundProjectActions.updateElement(spreadId, elementId, newAttribute);
      } else {
        boundProjectActions.createElement(spreadId, merge({}, newAttribute, { type }));
      }
    }
  }

  /**
   * 在store上创建一个新的element
   */
  updateElement(newAttribute) {
    const { boundProjectActions } = this.props;

    // 获取在当前的spread和处于活动状态的photoelement的索引.
    const { activePhotoElementIndex, currentSpread } = this.state;
    const activePhotoElement = get(currentSpread, `elementsOptions[${activePhotoElementIndex}]`);

    // 获取当前的spread和获取的element
    const spreadId = currentSpread.spreadOptions.id;
    const elementId = activePhotoElement.id;

    if (newAttribute) {
      boundProjectActions.updateElement(spreadId, elementId, newAttribute);
    }
  }

  getSpreadHtml() {
    let html = '';
    const currentSpread = this.state.currentSpread;
    const { baseUrls, boundProjectActions, boundUploadedImagesActions, boundWorkspaceActions, toggleModal, editText, ratio } = this.props;
    const { imageBaseUrl, texts, activePhotoElementIndex } = this.state;
    if (currentSpread && currentSpread.spreadOptions) {
      html = (<Spread spreadId={currentSpread.spreadOptions.id}
                      spreadOptions={currentSpread.spreadOptions}
                      elementsOptions={currentSpread.elementsOptions}
                      boundProjectActions={boundProjectActions}
                      imageBaseUrl={imageBaseUrl}
                      toggleOperationPanel={this.toggleOperationPanel.bind(this)}
                      isPreview={false}
                      activePhotoElementIndex={activePhotoElementIndex}
                      baseUrls={baseUrls}
                      boundUploadedImagesActions={boundUploadedImagesActions}
                      boundWorkspaceActions={boundWorkspaceActions}
                      toggleModal={toggleModal}
                      editText={editText}
                      ratio={ratio}
      />);
    }

    return html;
  }

  render() {
    console.log('workspace state', this.state);
    // t方法是用于本地化, 通过传入的key, 来获取对应的value.
    const { children, t, loadingData, baseUrls, texts, boundTextOptionsActions, addText, operationPanel } = this.props;

    const workSpaceStyle = {
      width: `${this.state.currentSpread.workspaceWidth}px`,
      left: `${this.state.currentSpread.left}px`,
      position: 'absolute'
    };

    return (
      <section className="work-space" ref="workSpace" style={workSpaceStyle}>
        {children}
        <div className="btn-list">
          {/* add text 按钮 */}
          <XAddText text={t('ADD_TEXT')} onClicked={addText}/>
        </div>

        <div className="image-editor">
          <XDrop onDroped={ this.onSpreadDroped.bind(this) }>
            {this.getSpreadHtml()}
          </XDrop>
        </div>
        <div className="btn-list m-b-66">
          <OutInSide onLeftClicked={this.onOutside.bind(this)}
                     onRightClicked={this.onInside.bind(this)}
          />
        </div>

        {/* 操作面板 */}
        <OperationPanel shown={operationPanel.status}
                        offset={operationPanel.offset}
                        onCropImage={this.onCropImage.bind(this)}
                        onRotateImage={this.onRotateImage.bind(this)}
                        onRemoveImage={this.onRemoveImage.bind(this)}
        />

        <Loading
          isShow={loadingData.isShow}
          isModalShow={loadingData.isModalShow}
        />
      </section>
    );
  }
}

WorkSpace.propTypes = {
  spreads: PropTypes.any,
  baseUrls: PropTypes.any,
  uploadBaseUrl: PropTypes.string
  // spreads: PropTypes.arrayOf(PropTypes.shape({
  //   textInCenter: PropTypes.string,
  //   bgColor: PropTypes.string,
  //   width: PropTypes.number,
  //   height: PropTypes.number,
  //   bleedTop: PropTypes.number,
  //   bleedBottom: PropTypes.number,
  //   bleedLeft: PropTypes.number,
  //   bleedRight: PropTypes.number,
  //   spineThicknessWidth: PropTypes.number,
  //   wrapSize: PropTypes.number
  // }),
};

// 要导出的一个translate模块.
// - 第一个括号里的参数对应的是资源文件中定义的.
// - 第一个括号里的参数对应的是你要导出的组件名.
export default translate('WorkSpace')(WorkSpace);
