import React, { Component, PropTypes } from 'react';
import ConfirmModal from '../../components/ConfirmModal';
import ImageEditModal from '../../../../common/ZNOComponents/XImageEditModal';

class MainContainer extends Component {

  constructor(props) {
    super(props);


    this.onImageEditModalCanceled = this.onImageEditModalCanceled.bind(this);
  }

  componentWillMount() {
    const {
      boundSpecActions,
      boundProjectActions,
      boundEnvActions,
      boundPriceActions,
      boundSystemActions,
      projectId,
      userId
    } = this.props;

    // 获取环境变量, 如各种接口的根路径
    boundEnvActions.getEnv().then(() => {
      boundSpecActions.getSpecData().then(() => {
        boundEnvActions.getUserInfo().then(() => {
          // if (projectId) {
          //   boundProjectActions.getProjectData(userId, projectId);
          // }

          // TODO need remove
          // boundSystemActions.showImageEditModal({
          //   imageEditApiTemplate: 'http://www.zno.com/imageBox/liveUpdateCropImage.ep?encImgId=<%=encImgId%>&px=<%=px%>&py=<%=py%>&pw=<%=pw%>&ph=<%=ph%>&width=<%=width%>&height=<%=height%>&rotation=<%=rotation%>',
          //   encImgId: 'KBz2bsxvCmKowdkVWocLnw%253D%253D',
          //   rotate: 90,
          //   aspectRatio: 1.49812734082397,
          //   crop: {
          //     cropLUX: 0,
          //     cropLUY: 0.19957031793381658,
          //     cropRLX: 1,
          //     cropRLY: 0.8004296820661834
          //   },
          //   onDoneClick: (encImgId, crop, rotate) => {
          //     alert('done');
          //   }
          // });

          // TODO need remove
          boundProjectActions.getProjectData(userId, projectId).then(() => {
            // boundProjectActions.createElement(
            //   'UNIQUE-0',
            //   {
            //     imageid: 64174819,
            //     x: 300,
            //     y: 400
            //   }
            // );
            // boundProjectActions.updateElement(
            //   'UNIQUE-0',
            //   'aaa',
            //   {
            //     imageid: 64174819,
            //     x: 500,
            //     y: 500
            //   }
            // );
            // boundProjectActions.deleteElement(
            //   'UNIQUE-0',
            //   'aaa'
            // );
          });
        });
      });
      // TODO modify the param
      boundPriceActions.getProductPrice("PR",['GP','5X5']);
    });
  }


  onImageEditModalCanceled() {
    const { boundSystemActions } = this.props;
    boundSystemActions.hideImageEditModal();
  }

  render() {
    const {
      children,
      className,
      confirmData,
      imageEditModalData,
      boundSystemActions
    } = this.props;

    return (
      <div className={className}>
        {children}

        <ConfirmModal
          isShow={confirmData.isShow}
          confirmMessage={confirmData.confirmMessage}
          okButtonText={confirmData.okButtonText}
          cancelButtonText={confirmData.cancelButtonText}
          onOkClick={confirmData.onOkClick}
          onCancelClick={confirmData.onCancelClick}
          onModalClose={boundSystemActions.hideConfirm}
        />

        <ImageEditModal {...imageEditModalData} onCancelClick={this.onImageEditModalCanceled.bind(this)}/>
      </div>
    );
  }
}

MainContainer.propTypes = {
  children: PropTypes.node.isRequired,
  boundSpecActions: PropTypes.object.isRequired,
  boundProjectActions: PropTypes.object.isRequired,
  boundEnvActions: PropTypes.object.isRequired,
  boundSystemActions: PropTypes.object.isRequired,
  userId: PropTypes.string,
  projectId: PropTypes.string,
  className: PropTypes.string,
  confirmData: PropTypes.object,
  imageEditModalData: PropTypes.object
};


export default MainContainer;
