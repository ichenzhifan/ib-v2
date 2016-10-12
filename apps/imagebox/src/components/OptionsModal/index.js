import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import XModal from '../../../../common/ZNOComponents/XModal';
import XButton from '../../../../common/ZNOComponents/XButton';
import XSelect from '../../../../common/ZNOComponents/XSelect';
import './index.scss';

class OptionsModal extends Component {
  constructor(props) {
    super(props);
    // setting 为当前项目的信息对象，包含 size、type、product、title 等属性
    const { setting } = this.props;
    // 在 state 中为当前弹框中的数据设置缓存区
    this.state = {
      title: setting.title,
      type: setting.type,
      size: setting.size,
      warntipShow: false,
      warnMes: '',
      typeMap: [],
      sizeMap: []
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleResetProject = this.handleResetProject.bind(this);
  }
  // 当再一次点开的option 弹框时，根据当前 state 与 props 比较确定是否需要更新 state。
  componentWillReceiveProps(nextProps) {
    this.setState({ warntipShow: false });
    const { title, type, size } = this.state;
    if (title !== nextProps.setting.title || type !== nextProps.setting.type ||
    size !== nextProps.setting.size) {
      this.setState({
        title: nextProps.setting.title,
        type: nextProps.setting.type,
        size: nextProps.setting.size
      });
    }
    const { optionMap } = nextProps;
    if (optionMap && optionMap.type) {
      let typeMap = [];
      let sizeMap = [];
      typeMap = optionMap.type.map((item) => {
        return {
          value: item.id,
          label: item.name
        };
      });
      sizeMap = optionMap.size.map((item) => {
        return {
          value: item.id,
          label: item.name
        };
      });
      this.setState({
        typeMap: typeMap,
        sizeMap: sizeMap
      });
    }
  }
  // 当 title 输入框内容变化时候将值 同步到 state.title
  handleTitleChange(event) {
    this.setState({ title: event.target.value });
  }
  // 当 type 下拉框内容改变时将值同步到 state.type
  handleTypeChange(value) {
    this.setState({ type: value.value });
  }
  // 当 size 下拉框内容改变时将值同步到 state.size
  handleSizeChange(value) {
    this.setState({ size: value.value });
  }
  // 当点下 done 按钮时，将 state 中的状态同步到 数据模型中
  handleResetProject() {
    // title 检测，首先检测 title 为空，然后检测 title 是否符合规则。
    if (!this.state.title.trim()) {
      this.setState({
        warntipShow: true,
        warnMes: 'Incorrect format,please try again.'
      });
      return;
    } else if (!(/^[a-zA-Z 0-9\d_\s]+$/.test(this.state.title))) {
      this.setState({
        warntipShow: true,
        warnMes: 'Only letters, numbers, blank space and _ (underscore) are allowed in the title.' });
      return;
    }
    const { boundProjectActions, onClosed } = this.props;
    boundProjectActions.changeProjectSetting({
      title: this.state.title,
      type: this.state.type,
      size: this.state.size
    });
    // 关闭当前 options 弹窗组件
    onClosed();
  }

  render() {
    const { optionMap, onClosed, opened } = this.props;
    const className = classNames('format-tip', { 'show-inline': this.state.warntipShow });
    return (
      <XModal
        className="options-modal"
        onClosed={onClosed}
        opened={opened}
      >
        <div className="option-modal-name">Options</div>
        <div className="options-modal-title">
          <p className={className}>{this.state.warnMes}</p>
          <label htmlFor="options-modal-title" >Title:</label>
          <input
            type="text"
            id="options-modal-title"
            value={this.state.title}
            onChange={this.handleTitleChange}
          />
        </div>
        <div className="options-modal-panneltype">
          <label>Panel Type:</label>
          <div className="select-wrap">
            {/*
                <select
                  value={this.state.type}
                  onChange={this.handleTypeChange}
                >
                 {
                    optionMap && optionMap.type
                    ? optionMap.type.map((item, index) => {
                      return (
                        <option value={item.id} key={index}>{ item.name }</option>
                      );
                    })
                    : null
                 }
                </select>
            */}
            <XSelect
              options={this.state.typeMap}
              searchable={false}
              onChanged={this.handleTypeChange}
              value={this.state.type}
            />
          </div>
        </div>
        <div className="options-modal-size">
          <label>Size:</label>
          <div className="select-wrap">
            {/*
              <select
                value={this.state.size}
                onChange={this.handleSizeChange}
              >
                {
                  optionMap && optionMap.size
                  ? optionMap.size.map((item, index) => {
                    return (
                      <option value={item.id} key={index}>{ item.name }</option>
                    );
                  })
                  : null
                }
              </select>
            */}
            <XSelect
              options={this.state.sizeMap}
              searchable={false}
              onChanged={this.handleSizeChange}
              value={this.state.size}
            />
          </div>
        </div>
        <div className="options-modal-button">
          <XButton
            onClicked={this.handleResetProject}
          >Done</XButton>
        </div>
      </XModal>
   );
  }
}

OptionsModal.propTypes = {
  optionMap: PropTypes.object,
  setting: PropTypes.object.isRequired,
  boundProjectActions: PropTypes.object.isRequired,
  onClosed: PropTypes.func.isRequired,
  opened: PropTypes.bool.isRequired
};

export default OptionsModal;
