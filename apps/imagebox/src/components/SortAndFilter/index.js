import React, { Component, PropTypes } from 'react';
import { translate } from "react-translate";
import './index.scss';


class SortAndFilter extends Component{
  constructor(props){
    super(props);

      this.state = {
        value: 'uploadTime'
      }
  }

  handleOptionChange(event){
    const value = event.target.value;
    console.log(value,"was selected");
    this.setState({value: value});

    const { onSorted } = this.props;
    onSorted({value});
  }

  handleHideUsedToggle(event){
    const {onToggleHideUsed} = this.props;
    const isChecked = event.target.checked;
    onToggleHideUsed(isChecked);
  }

    render(){
      const { t } = this.props;
      return(
        <div className="upload-hide">
          <div className="t-left">
            <select className="upload-time" value={this.state.value} onChange={this.handleOptionChange.bind(this)} >
              <option value="uploadTime" >
                { t('UPLOAD_TIME') }
              </option>
              <option value="createTime" >
                { t('CREATION_TIME') }
              </option>
              <option value="name" >
                { t('IMAGE_TITLE') }
              </option>
            </select>

          </div>
          <div className="t-right">
            <input type="checkbox" id="hideUsed" onChange={this.handleHideUsedToggle.bind(this)} />
              <label htmlFor="hideUsed" className="hide-used">
                { t('HIDE_USED') }
              </label>
          </div>
        </div>

        );
    }
}


export default translate('SortAndFilter')(SortAndFilter);
