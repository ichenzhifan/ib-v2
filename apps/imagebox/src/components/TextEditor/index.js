import 'isomorphic-fetch';
import React, {Component} from 'react';
import { translate } from 'react-translate';
import { merge, template, get, set, isEqual } from 'lodash';
import XModal from '../../../../common/ZNOComponents/XModal';
import XTextarea from '../../../../common/ZNOComponents/XTextarea';
import { GET_FONTS, TEXT_SRC } from '../../contants/apiUrl';
import x2jsInstance from '../../utils/xml2js';
import FontUrl from '../../components/FontUrl';
import FontSize from '../../components/FontSize';
import XSelect from '../../../../common/ZNOComponents/XSelect';
import XButton from '../../../../common/ZNOComponents/XButton';
import classNames from 'classnames';
import { elementTypes } from '../../contants/strings';
import { getPxByPt, getPtByPx } from '../../../../common/utils/math';
import { loadImg } from '../../../../common/utils/image';
import './index.scss';

class TextEditor extends Component {
  constructor(props) {
      super(props);
      const { currentSpread } = this.props;
      this.state = {
        text: '',
        families: null,
        fontFamily: '',
        fontStyle: '',
        fontSize: 23,
        fontColor: '',
        fontOptions: null,
        styleOptions: null,
        isDoneDisabled: true,
        currentSpread: currentSpread,
        colorOptions: [
          {
            label: 'Black',
            value: '0'
          },
          {
            label: 'Gray',
            value: '6712688'
          },
          {
            label: 'Light Gray',
            value: '13289166'
          },
          {
            label: 'White',
            value: '16711422'
          },
          {
            label: 'Cardinal',
            value: '10497843'
          },
          {
            label: 'Red',
            value: '16711680'
          },
          {
            label: 'Pink',
            value: '16042184'
          },
          {
            label: 'Orange',
            value: '15690240'
          },
          {
            label: 'Gold',
            value: '14202129'
          },
          {
            label: 'Yellow',
            value: '16776960'
          },
          {
            label: 'Green',
            value: '5679643'
          },
          {
            label: 'Navy',
            value: '13158'
          }
        ]
      }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.opened!==nextProps.opened) {
      if (nextProps.textOptions==null) {
        // 添加文本 重置选项
        this.resetState(this.state.families);
        this.setState({
          isDoneDisabled: true
        })
      } else {
        const { fontFamily, fontSize, color, text } = nextProps.textOptions;
        // 从font库中筛选出当前选择的font对象
        const fontOption = this.state.families.fontFamilies.fontFamily.filter(item=>{
          return (
            Array.isArray(item.font) ?
            (item.font.some(font=>{
              return font.fontFamily === fontFamily;
            })) :
            (item.font.fontFamily === fontFamily)
          )
        });
        // 根据筛选出的font对象生成用于react-select的对象数组
        const currentFont = fontOption.map(item=>{
          let fontStyle = [];
          if (Array.isArray(item.font)) {
            fontStyle = item.font.map(font=>{
             return {
               label: font.displayName,
               value: font.fontFamily,
               id: item.id,
               isDefault: font.isDefault ? true : false
             };
           });
         }else{
           fontStyle.push({
             label: item.font.displayName,
             value: item.font.fontFamily,
             id: item.id,
             isDefault: true
           });
         }
          return {
            value: item.displayName,
            label: item.displayName,
            id: item.id,
            fontStyle: fontStyle
          };
        });
        // 筛选出适用于react-select的当前fontStyle数组对象
        const currentStyle = currentFont[0].fontStyle.filter(style=>{
          return style.value === fontFamily;
        });
        // 计算出当前选择字号的px值
        const currentSize = Math.round(getPtByPx(fontSize));
        // 筛选出适用于react-select的当前fontColor数组对象
        const currentColor = this.state.colorOptions.filter(item=>{
          return item.value === color;
        });
        //应用选择的数据
        this.setTextValue(currentFont[0]);
        this.setState({
          text: text,
          fontStyle: currentStyle[0],
          fontSize: currentSize,
          fontColor: currentColor[0]
        });
        // 启用done按钮
        this.setState({
          isDoneDisabled: false
        })
      }
    }

    // currentSpread有更新时, 就只更新currentSpread数据
    if (!isEqual(this.props.currentSpread, nextProps.currentSpread)) {

      this.setState({
        currentSpread: nextProps.currentSpread
      });
    }
  }

  componentDidMount() {
    this.loadOptions();
  }

  resetState(families) {
    let defaultStyle;
    const fontOptions = families.fontFamilies.fontFamily.map(item=>{
      let fontStyle = [];
      if (Array.isArray(item.font)) {
        fontStyle = item.font.map(font=>{
         return {
           label: font.displayName,
           value: font.fontFamily,
           id: item.id,
           isDefault: font.isDefault ? true : false
         };
       });
     }else{
       fontStyle.push({
         label: item.font.displayName,
         value: item.font.fontFamily,
         id: item.id,
         isDefault: true
       });
     }
      return {
        value: item.displayName,
        label: item.displayName,
        id: item.id,
        fontStyle: fontStyle
      };
    });
    defaultStyle = fontOptions[0].fontStyle.filter(style=>{
      return style.isDefault ? true : false;
    });
    this.setState({
      families: families,
      fontFamily: fontOptions[0],
      styleOptions: fontOptions[0].fontStyle,
      fontStyle: defaultStyle[0],
      fontOptions: fontOptions,
      fontSize: 23,
      fontColor: this.state.colorOptions[0],
      text: ''
    });
  }

  loadOptions() {
    // 从xml获取fonts数据
    fetch(GET_FONTS)
      .then((response)=>{
        return response.text();
      }).then((response)=>{
        const families =  x2jsInstance.xml2js(response);
        this.resetState(families)
      });
      this.setState({
        fontColor: this.state.colorOptions[0]
      })
  }

  handleClosed() {
      const { onClosed } = this.props;
      onClosed();
  }

  onTextChanged(event) {
    var value = event.target.value;
    this.setState({
      text: value
    });
    // 禁用 / 启用Done按钮
    if(value.trim()){
      this.setState({
        isDoneDisabled: false
      });
    }else{
      this.setState({
        isDoneDisabled: true
      });
    }
  }

  setTextValue(value){
    let fontStyle = [];
    let defaultStyle;
    this.state.fontOptions.map(item=>{
      if (value.id === item.id) {
        if (Array.isArray(item.fontStyle)){
          fontStyle = item.fontStyle.map(fontStyle=>{
            if(fontStyle.isDefault){
              defaultStyle = fontStyle;
            }
            return {
               label: fontStyle.label,
               value: fontStyle.value,
               id: item.id,
               isDefault: fontStyle.isDefault
             };
           });
        }else{
          defaultStyle = fontStyle;
          fontStyle.push({
            label: item.fontStyle.label,
            value: item.fontStyle.value,
            id: item.id,
            isDefault: true
          });
        }
      }
    });
    this.setState({
      fontFamily: value,
      fontStyle: defaultStyle,
      styleOptions: fontStyle
    })
  }

  setStyleValue(value){
    this.setState({
      fontStyle: value
    })
  }

  setColorValue(value){
    this.setState({
      fontColor: value
    })
  }

  handleSliderChange(value){
    this.setState({
      fontSize: value
    })
  }

  handleSizeChange(value) {
    this.setState({
      fontSize: value
    })
  }

  handleDoneClick() {
    const { boundTextOptionsActions, boundProjectActions, textOptions, baseUrls } = this.props;
    const { text, fontStyle, fontColor, currentSpread } = this.state;
    const { pageSize } = currentSpread;
    const spreadId = currentSpread.spreadOptions.id;
    const fontSize = getPxByPt(this.state.fontSize);
    const fontFamily = fontStyle.value;
    const fontWeight = fontStyle.label;
    const color = fontColor.value;
    const textAlign = 'left';
    //添加文字
    if (textOptions===null) {
      const textUrl = template(TEXT_SRC)({
        fontBaseUrl: baseUrls.productBaseURL,
        text: encodeURIComponent(text),
        fontSize: encodeURIComponent(fontSize),
        fontColor: encodeURIComponent(color),
        fontFamily: encodeURIComponent(fontFamily),
        textAlign: encodeURIComponent(textAlign)
      });
      loadImg(textUrl).then((response)=> {
        const img = response.img;
        const width = img.width;
        const height = img.height;
        const x = 60;
        const y = 60;
        const px = x / pageSize.width;
        const py = y / pageSize.height;
        const pw = width / pageSize.width;
        const ph = height / pageSize.height;
        const rot = 0;
        const dep = 1;
        const elType = 'text';
        this.createElement({
          text,
          fontFamily,
          fontSize,
          color,
          fontWeight,
          textAlign,
          width,
          height,
          x,
          y,
          px,
          py,
          pw,
          ph,
          rot,
          dep,
          elType
        });
      });
    } else { // 编辑文字
      const { id } = textOptions;
      const textUrl = template(TEXT_SRC)({
        fontBaseUrl: baseUrls.productBaseURL,
        text: encodeURIComponent(text),
        fontSize: encodeURIComponent(fontSize),
        fontColor: encodeURIComponent(color),
        fontFamily: encodeURIComponent(fontFamily),
        textAlign: encodeURIComponent(textAlign)
      });
      loadImg(textUrl).then((response)=> {
        const img = response.img;
        const width = img.width;
        const height = img.height;
        const pw = width / pageSize.width;
        const ph = height / pageSize.height;
        boundProjectActions.updateElement(
          spreadId,
          id,
          {
            text,
            fontFamily,
            fontSize,
            color,
            fontWeight,
            width,
            height,
            pw,
            ph
          }
        )
      })
    }
    this.handleClosed();
  }

  /**
   * 在store上创建一个新的element
   */
  createElement(elementOptions, type = elementTypes.text) {
    const { boundProjectActions } = this.props;
    const currentSpread = this.state.currentSpread;
    const { id } = currentSpread.spreadOptions;
    const { text, fontFamily, fontSize, color, fontWeight, textAlign, width, height, x, y, px, py, pw, ph, rot, dep, elType } = elementOptions;
    console.log('currentSpread', currentSpread, elementOptions);

    boundProjectActions.createElement(id, {
      type,
      text,
      fontFamily,
      fontSize,
      color,
      fontWeight,
      textAlign,
      width,
      height,
      x,
      y,
      px,
      py,
      pw,
      ph,
      rot,
      dep,
      elType
    });
  }

  render() {
    const {opened,t} = this.props;
    // Done按钮是否禁用
    const DoneButtonClass = classNames('row buttons', {
      disabled: this.state.isDoneDisabled
    });
    return (
      <XModal
        className="texteditor-modal"
        onClosed={ this.handleClosed.bind(this) }
        opened={opened}
      >
        <div className="text-editor">
          <h3 className="title">
            { t('TEXT_EDITOR') }
          </h3>
          <div className="editor">
            <XTextarea onChanged={this.onTextChanged.bind(this)} value={this.state.text}/>
            <div className="row">
              <div className="col col-2">
                <label>{ t('FONT_FAMILY') }</label>
                <XSelect options={this.state.fontOptions}
                         onChanged={this.setTextValue.bind(this)}
                         value={this.state.fontFamily}
                         searchable={false}
                         optionComponent={FontUrl}/>
              </div>
              <div className="col col-2">
                <label className="right">{ t('FONT_STYLE') }</label>
                <XSelect options={this.state.styleOptions}
                         searchable={false}
                         onChanged={this.setStyleValue.bind(this)}
                         value={this.state.fontStyle} />
              </div>
            </div>
            <div className="row">
              <div className="col col-2">
                <label>{ t('FONT_SIZE') }</label>
                <FontSize value={this.state.fontSize}
                          handleSliderChange={this.handleSliderChange.bind(this)}
                          handleSizeChange={this.handleSizeChange.bind(this)} />
              </div>
              <div className="col col-2">
                <label className="right">{ t('FONT_COLOR') }</label>
                <XSelect options={this.state.colorOptions}
                           onChanged={this.setColorValue.bind(this)}
                           searchable={false}
                           value={this.state.fontColor}
                           />
              </div>
            </div>
            <div className={DoneButtonClass}>
              <XButton onClicked={this.handleDoneClick.bind(this)}>
                { t('DONE') }
              </XButton>
            </div>
          </div>
        </div>
      </XModal>
    )
  }
}

export default translate('TextEditor')(TextEditor);
