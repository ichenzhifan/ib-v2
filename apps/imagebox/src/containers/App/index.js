import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { set, get, template, isEqual, merge, forIn } from 'lodash';

// 导入用于本地化的组件
import { TranslatorProvider } from 'react-translate';
import qs from 'qs';

import 'normalize.css';
import './index.scss';

import * as specActions from '../../actions/specActions';
import * as projectActions from '../../actions/projectActions';
import * as envActions from '../../actions/envActions';
import * as loginActions from '../../actions/loginActions';
import * as uploadedImagesActions from '../../actions/imagesActions';
import * as systemActions from '../../actions/systemActions';
import * as priceActions from '../../actions/priceActions';
import * as workspaceActions from '../../actions/workspaceActions';

import MainContainer from '../../components/MainContainer';
import PageHeader from '../../components/PageHeader';
import SideBar from '../../components/SideBar';
import WorkSpace from '../../components/WorkSpace';
import UploadModal from '../../components/UploadModal';
import RedirectHomeModal from '../../components/RedirectHomeModal';
import OptionsModal from '../../components/OptionsModal';
import XLoginModal from '../../../../common/ZNOComponents/XLoginModal';

import PreviewModel from '../../components/PreviewModal';
import XNotify from '../../../../common/ZNOComponents/XNotify';

import ItemPrice from '../../components/ItemPrice';
import TextEditor from '../../components/TextEditor';
import Loading from '../../components/Loading';

class App extends Component {
  constructor(props) {
    super(props);

    // 定义一些初始化值.
    this.state = {
      modalSwitches: {
        // options设置弹框
        options: false,
        //upload 弹框
        upload: false,
        // 登录弹框
        login: false,
        // 点击 logo 回到主页的弹框
        redirectHomeModalShow: false,
        // header 中点击 options 时修改当前 project 参数的弹框

        optionsModalShow: false,
        // 预览弹框
        preview: false,

        optionsModalShow: false,

        // texteditor弹框
        texteditorShow: false
      },

      projectId: null,

      spreads: [],

      textOptions: null,
      // spreads: [{
      //   id: 'UNIQUE-0',
      //   type: 'coverPage',
      //   bgColor: '#f6f6f6',
      //   width: 9165.354330708662,
      //   height: 3673.228346456693,
      //   bleedTop: 35.43307086614173,
      //   bleedBottom: 35.43307086614173,
      //   bleedLeft: 35.43307086614173,
      //   bleedRight: 35.43307086614173,
      //   spineThicknessWidth: 826.7716535433071,
      //   wrapSize: 330.7086614173228
      // }, {
      //   id: 'UNIQUE-1',
      //   type: 'innerPage',
      //   bgColor: '#f6f6f6',
      //   width: 4051.1811023622045,
      //   height: 3106.299212598425,
      //   bleedTop: 35.43307086614173,
      //   bleedBottom: 35.43307086614173,
      //   bleedLeft: 35.43307086614173,
      //   bleedRight: 35.43307086614173,
      //   spineThicknessWidth: 0,
      //   wrapSize: 177.1653543307087
      // }],
      images: [{
        imageId: '278661',
        encImgId: encodeURIComponent('qBa0z64FjjY%3D'),
        height: 3456,
        width: 5184
      }, {
        imageId: '278662',
        encImgId: encodeURIComponent('wBu77xFQfaE%3D'),
        height: 5312,
        width: 3984
      }]
    };
  }

  componentWillReceiveProps(nextProps) {
    const { spreads, currentSpread } = nextProps;
    if (spreads && !isEqual(this.state.spreads, spreads)) {
      const newSpreads = spreads.map((s) => {
        return merge({}, s, {
          width: s.w,
          height: s.h,
          bgColor: '#f6f6f6'
        });
      });

      this.setState({
        spreads: newSpreads,
        currentSpread
      });
    }
  }

  componentWillMount() {
    const queryStringObj = qs.parse(window.location.search.substr(1));
    this.setState({
      projectId: queryStringObj.projectId
    });
  }

  /**
   * 显示或关闭modal
   * @param {string} type 待关闭的modal在state中key的值(this.state.modalSwitches).
   * @param {bool} status true/false, modal是显示还是关闭
   */
  toggleModal(type, status) {
    let state = set(this.state, `modalSwitches.${type}`, status);
    this.setState(state);
  }

  toggleNewAdded(status) {
    let state = set(this.state, 'textOptions.newAdded', status);
    this.setState(state);
  }

  handleLogin() {
    // 隐藏login弹框
    this.toggleModal.bind(this, 'login', false);
  }

  addText() {
    this.toggleModal('texteditorShow', true);
    this.setState({
      textOptions: null
    });
  }

  editText(options){
    this.toggleModal('texteditorShow', true);
    this.setState({
      textOptions: options
    });
  }

  render() {
    const {
      translations,
      boundSpecActions,
      boundProjectActions,
      boundLoginActions,
      boundEnvActions,
      boundSystemActions,
      boundNotifyActions,
      boundUploadedImagesActions,
      boundPriceActions,
      boundWorkspaceActions,

      optionMap,
      setting,
      userId,
      spreadArray,
      imageArray,
      imageUsedCountMap,

      uploadingImages,
      price,

      notify,
      confirmData,
      loadingData,
      imageEditModalData,
      currentSpread,
      operationPanel,
      baseUrls,

      ratio
    } = this.props;

    const { projectId } = this.state;
    const redirectHomeTip = (
      <div className="homepage-text">
        This will take you to home page.
        <br />
        Please select an option before continuing.
      </div>
    );


    return (
      <TranslatorProvider translations={translations}>
        <MainContainer
          className="app"
          boundSpecActions={boundSpecActions}
          boundProjectActions={boundProjectActions}
          boundEnvActions={boundEnvActions}
          boundSystemActions={boundSystemActions}
          boundPriceActions={boundPriceActions}
          imageEditModalData={imageEditModalData}
          userId={userId}
          projectId={projectId}
          confirmData={confirmData}
        >
          <PageHeader
            showRedirectHomeModal={this.toggleModal.bind(this, 'redirectHomeModalShow', true)}
            showOptionsModal={this.toggleModal.bind(this, 'optionsModalShow', true)}
            onLoginHandle={this.toggleModal.bind(this, 'login', true)}
            onPreviewHandle={this.toggleModal.bind(this, 'preview', true)}
            setting={setting}
            projectId={projectId}
            userId={userId}
            spreadArray={spreadArray}
            imageArray={imageArray}
            boundSystemActions={boundSystemActions}
            boundProjectActions={boundProjectActions}
          />

          <ItemPrice price={price}/>
          <SideBar
            boundUploadedImagesActions={ boundUploadedImagesActions }
            boundProjectActions={ boundProjectActions }
            toggleModal={ this.toggleModal.bind(this) }
            imageArray={imageArray}
            imageUsedCountMap={imageUsedCountMap}
            baseUrls={baseUrls}
          />
          <WorkSpace
            boundSystemActions={boundSystemActions}
            boundProjectActions={boundProjectActions}
            boundWorkspaceActions={boundWorkspaceActions}
            setting={setting}
            spreads={this.state.spreads}
            currentSpread={currentSpread}
            baseUrls={baseUrls}
            loadingData={loadingData}
            imageArray={imageArray}
            operationPanel={operationPanel}
            boundUploadedImagesActions={boundUploadedImagesActions}
            addText={this.addText.bind(this)}
            editText={this.editText.bind(this)}
            toggleModal={this.toggleModal.bind(this)}
            ratio={ratio}
          >
            {/* 显示弹窗 */}
            {/*<input*/}
            {/*type="button"*/}
            {/*className="cursor-p"*/}
            {/*value="显示弹窗"*/}
            {/*onClick={this.toggleModal.bind(this, 'options', true)}*/}
            {/*/>*/}
          </WorkSpace>

          <UploadModal
            opened={this.state.modalSwitches.upload}
            uploadingImages={uploadingImages}
            boundUploadedImagesActions={boundUploadedImagesActions}
            toggleModal={this.toggleModal.bind(this)}
          />

          <RedirectHomeModal
            onClosed={this.toggleModal.bind(this, 'redirectHomeModalShow', false)}
            opened={this.state.modalSwitches.redirectHomeModalShow}
            mes={redirectHomeTip}
          />

          <XLoginModal
            loginActions={boundLoginActions}
            onClosed={this.toggleModal.bind(this, 'login', false)}
            opened={this.state.modalSwitches.login}
          />

          <PreviewModel
            onClosed={this.toggleModal.bind(this, 'preview', false)}
            opened={this.state.modalSwitches.preview}
            spreads={this.state.spreads}
            images={this.state.images}
            baseUrls={baseUrls}
            loadingData={loadingData}
            boundSystemActions={boundSystemActions}
            boundProjectActions={boundProjectActions}
            boundWorkspaceActions={boundWorkspaceActions}
            currentSpread={currentSpread}
            boundUploadedImagesActions={boundUploadedImagesActions}
            toggleModal={this.toggleModal.bind(this)}
          />

          <XNotify
            isShow={notify.isShow}
            notifyMessage={notify.notifyMessage}
            hideNotify={boundSystemActions.hideNotify}
          />
          <RedirectHomeModal
            onClosed={this.toggleModal.bind(this, 'redirectHomeModalShow', false)}
            opened={this.state.modalSwitches.redirectHomeModalShow}
            mes={redirectHomeTip}
          />

          {/*header 中点击 options 的配置修改弹框*/}
          <OptionsModal
            onClosed={ this.toggleModal.bind(this, "optionsModalShow", false) }
            opened={ this.state.modalSwitches.optionsModalShow }
            optionMap={optionMap}
            setting={setting}
            boundProjectActions={boundProjectActions}
          />
          <TextEditor opened={this.state.modalSwitches.texteditorShow}
                      textOptions={this.state.textOptions}
                      baseUrls={baseUrls}
                      onClosed={this.toggleModal.bind(this, "texteditorShow", false)}
                      currentSpread={currentSpread}
                      boundProjectActions={boundProjectActions}/>

        </MainContainer>
      </TranslatorProvider>
    );
  }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
const mapStateToProps = state => ({
  optionMap: get(state, 'project.availableOptionMap'),
  setting: get(state, 'project.setting'),
  spreadArray: get(state, 'project.spreadArray'),
  imageArray: get(state, 'project.imageArray'),
  userId: get(state, 'system.env.userInfo.userId'),

  // 标识图片的使用次数.
  imageUsedCountMap: get(state, 'project.imageUsedCountMap'),

  // project spreads.
  spreads: get(state, 'project.spreadArray'),

  // 当前workspace上活动的spread.
  currentSpread: get(state, 'system.workspace.currentSpread'),

  // 显示或隐藏workspace上的操作面板.
  operationPanel: get(state, 'system.workspace.operationPanel'),

  uploadingImages: state.system.images.uploading,
  price: state.system.price,

  baseUrls: get(state, 'system.env.urls'),
  notify: state.system.notify,
  confirmData: state.system.confirmData,
  loadingData: state.system.loadingData,
  imageEditModalData: get(state, 'system.imageEditModalData'),
  ratio: get(state, 'system.workspace.currentSpread.rate')
});

const mapDispatchToProps = dispatch => ({
  boundSpecActions: bindActionCreators(specActions, dispatch),
  boundProjectActions: bindActionCreators(projectActions, dispatch),
  boundLoginActions: bindActionCreators(loginActions, dispatch),
  boundEnvActions: bindActionCreators(envActions, dispatch),
  boundUploadedImagesActions: bindActionCreators(uploadedImagesActions, dispatch),
  boundSystemActions: bindActionCreators(systemActions, dispatch),
  boundPriceActions: bindActionCreators(priceActions, dispatch),
  boundWorkspaceActions: bindActionCreators(workspaceActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
