import React, { Component, PropTypes } from 'react';
import { merge, isEqual } from 'lodash';
import XFileUpload from '../../../../common/ZNOComponents/XFileUpload';
import XButton from '../../../../common/ZNOComponents/XButton';
import { translate } from 'react-translate';
import ListTab from '../ListTab';
import SortAndFilter from '../SortAndFilter';
import ImageList from '../ImageList';
import './index.scss';

class SideBar extends Component {
  constructor(props) {
    super(props);

    const { imageArray } = this.props;

    this.state = {
      selectedSize: null,
      sortBy: '',
      isChecked: false,
      imageArray
    };
  }

  onToggleHideUsed(isChecked) {
    const { imageArray } = this.props;
    this.setState({
      isChecked: isChecked
    });

    if (isChecked) {
      const newImages = this.state.imageArray.filter(item=> {
        return item.usedCount === 0;
      });
      this.setState({
        imageArray: newImages
      })
    } else {
      this.setState({
        imageArray: imageArray
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.imageArray, nextProps.imageArray) ||
      !isEqual(this.props.imageUsedCountMap, nextProps.imageUsedCountMap)) {

      const newImages = this.checkUsageCount(merge([], nextProps.imageArray), nextProps.imageUsedCountMap);
      newImages.sort((a, b) => {
        return a[this.state.sortBy] > b[this.state.sortBy];
      });

      if (this.state.isChecked) {
        const nonUsedImages = newImages.filter((item) => {
          return item.usedCount === 0;
        });
        this.setState({
          imageArray: nonUsedImages
        });
      } else {
        this.setState({
          imageArray: newImages
        });
      }
    }
  }

  /**
   * 设置图片的使用次数.
   * @param imageArr 图片数组
   * @param imageUsedCountMap 包含使用次数的对象.
   */
  checkUsageCount(imageArr, imageUsedCountMap) {
    if (imageArr && imageArr.length) {
      imageArr.forEach((v) => {
        const count = imageUsedCountMap && imageUsedCountMap[v.id] ? imageUsedCountMap[v.id] : 0;
        v.usedCount = count;
      });
    }

    return imageArr;
  }

  onSorted(param) {
    const { imageArray } = this.props;
    console.log('param', param);
    const { value } = param;
    this.setState({
      sortBy: value
    });

    const newImages = merge([], imageArray);
    newImages.sort((a, b) => {
      return a[value] > b[value];
    });

    if (this.state.isChecked) {
      const nonUsedImages = newImages.filter(item=> {
        return item.usedCount === 0;
      });
      this.setState({
        imageArray: nonUsedImages
      })
    } else {
      this.setState({
        imageArray: newImages
      });
    }
  }

  render() {
    const { boundUploadedImagesActions, boundProjectActions, toggleModal, t, baseUrls } = this.props;

    return (
      <aside className="side-bar">

        <ListTab className="list-tab">
          { t('IMAGES') }
        </ListTab>

        <XFileUpload
          className="add-photo"
          boundUploadedImagesActions={ boundUploadedImagesActions }
          toggleModal={ toggleModal }
          multiple="multiple"
        >
          { t('ADD_PHOTO') }
        </XFileUpload>
        <SortAndFilter onSorted={this.onSorted.bind(this)}
                       onToggleHideUsed={this.onToggleHideUsed.bind(this)}
        />
        <ImageList
          uploadedImages={this.state.imageArray}
          baseUrls={baseUrls}
          boundUploadedImagesActions={ boundUploadedImagesActions }
          boundProjectActions={ boundProjectActions }
        />
      </aside>
    );
  }
}

export default translate('SideBar')(SideBar);

