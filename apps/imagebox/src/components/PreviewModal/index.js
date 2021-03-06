import React, { Component, PropTypes } from 'react';
import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import Spread from '../../components/Spread';
import OutInSide from '../OutInSide';
import { translate } from 'react-translate';
import { merge, template, get, set, isEqual, isUndefined } from 'lodash';
import { workSpacePrecent, sideBarWidth, spreadTypes } from '../../contants/strings';
import { getSize } from '../../../../common/utils/helper';
import { IMAGES_CROPPER, IMAGES_CROPPER_PARAMS } from '../../contants/apiUrl';
import './index.scss';


class PreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = this.initWorkspace();
  }

  componentWillReceiveProps(nextProps) {
    // spreads有更新时, 就只更新spreadsOptions
    const oldSetting = this.props.setting;
    const newSetting = nextProps.setting;

    if ((!isUndefined(oldSetting) && oldSetting.type !== newSetting.type)||
      (!isUndefined(newSetting) && oldSetting.size !== newSetting.size)) {
        const { boundWorkspaceActions } = nextProps;
        const { spreads, texts } = nextProps;
        const spreadOptions = this.formatSpreadOptions(spreads, texts);

        if (spreadOptions && spreadOptions.length) {
          boundWorkspaceActions.changeSpread(spreadOptions[0]);
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
  }

  componentDidMount() {
    this.addResizeEvent();
  }

  componentWillUnmount() {
    //window.onresize = null;
    window.removeEventListener("resize", this.resizeHandle.bind(this));
  }

  resizeHandle(event) {
    let timer = null;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const index = this.getCurrentSpreadIndex();
      const state = this.initWorkspace();

      // resize后, 继续显示当前的spread, 而不是调到默认的spread中.
      if (index !== -1) {
        this.state.currentSpread = this.state.spreadOptions[index];
      }
      this.setState(state);
    }, 500);
  }

  addResizeEvent() {
    window.addEventListener("resize", this.resizeHandle.bind(this));
  }

  initWorkspace() {
    const { spreads, baseUrls, currentSpread, texts } =  this.props;
    const spreadOptions = this.formatSpreadOptions(spreads, texts);
    const imageBaseUrl = baseUrls.baseUrl ? template(IMAGES_CROPPER)(baseUrls) : '';
    const state = {
      imageBaseUrl,

      // spread的绘制参数
      spreadOptions,

      // 当前显示的spread
      currentSpread,
    };

    return state;
  }

  formatSpreadOptions(spreads, texts) {
    const { t } = this.props;
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

        spreadsOptions.push({
          rate,
          pageSize,
          workspaceWidth,
          spreadOptions: opt,
          elementsOptions: s.elements,
          textsOptions: texts,
          originalOptions: s,
          left
        });
      }
    });

    return spreadsOptions;
  }

  onOutside() {
    const { boundWorkspaceActions } = this.props;
    const index = this.getCurrentSpreadIndex();
    const spreadOptions = this.state.spreadOptions;
    if (spreadOptions && spreadOptions.length && !Object.is(index, 0)) {
      boundWorkspaceActions.changeSpread(spreadOptions[0]);
    }
  }

  onInside() {
    const { boundWorkspaceActions } = this.props;
    const index = this.getCurrentSpreadIndex();
    const spreadOptions = this.state.spreadOptions;
    if (spreadOptions && spreadOptions.length > 1 && !Object.is(index, 1)) {
      boundWorkspaceActions.changeSpread(spreadOptions[1]);
    }
  }

  getCurrentSpreadIndex() {
    const index = this.state.spreadOptions.findIndex((v) => {
      return v.spreadOptions.id === this.state.currentSpread.spreadOptions.id;
    });

    return index;
  }

  getSpreadHtml() {
    let html = '';
    const currentSpread = this.state.currentSpread;
    const { imageBaseUrl, texts } = this.state;
    if (currentSpread && currentSpread.spreadOptions) {
      html = (<Spread spreadId={currentSpread.spreadOptions.id}
                      spreadOptions={currentSpread.spreadOptions}
                      elementsOptions={currentSpread.elementsOptions}
                      imageBaseUrl={imageBaseUrl}
                      textsOptions={texts}
                      isPreview={true}
      />);
    }

    return html;
  }

  render() {
    const { onClosed, opened, t } = this.props;
    const { spreadOptions } = this.state.currentSpread;
    const spreadWidth = spreadOptions ? spreadOptions.width : 0;
    return (
      <XModal className="preview-modal" onClosed={ onClosed }
              opened={ opened }>
        <div className="box-preview">
          <hr className="hr-preview"/>
          <div className="container-preview" style={{ height: window.innerHeight - 50 }}>

            <div className="spread-container" style={{ marginLeft: window.innerWidth / 2 - spreadWidth / 2 }}>
              {this.getSpreadHtml()}
            </div>
            <div className="btn-list m-b-66">
              <OutInSide leftText={t('OUTSIDE')}
                         rightText={t('INSIDE')}
                         onLeftClicked={this.onOutside.bind(this)}
                         onRightClicked={this.onInside.bind(this)}
              />
            </div>
          </div>
        </div>
      </XModal>
    );
  }
}

PreviewModal.propTypes = {
  onClosed: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired
};

export default translate('PreviewModal')(PreviewModal);
