// 图片预览弹窗
import React, { Component } from 'react';
import { Icon, Modal, message } from 'antd';
import { connect } from 'nuomi';
import { util } from 'nuijs';
import Carousel from '@components/Carousel';
import './style.less';

class ViewFileModal extends Component {
  state = {
    // 当前图片位置
    imgIndex: 0,
    // 当前模块的图片list
    fileListImg: [],
  };

  componentWillReceiveProps(nextP) {
    const { enclosureList, upType, editFileItem } = nextP;
    let imgIndex = 0;
    const fileListImg = enclosureList.filter(
      (item) =>
        item.enclosureClass === upType &&
        item.enclosurePath.indexOf('.docx') === -1 &&
        item.enclosurePath.indexOf('.pdf') === -1,
    );

    fileListImg.forEach((item, index) => {
      if (item.customerEnclosureId === editFileItem.customerEnclosureId) {
        imgIndex = index;
      }
    });
    this.setState({
      imgIndex,
      fileListImg,
    });
  }

  // 关闭弹窗
  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        previewFileVisible: false,
      },
    });
    this.setState({
      imgIndex: 0,
      fileListImg: [],
    });
  };

  // 下载附件
  downFile = ({ customerId, enclosureName, enclosurePath }) => {
    util.location(
      `${basePath}instead/v2/customer/enclosure/downloadFile.do?enclosurePath=${enclosurePath}&customerId=${customerId}&enclosureName=${enclosureName}`,
    );
  };

  // 上一页
  prevViewImg = () => {
    const { dispatch } = this.props;
    const { imgIndex, fileListImg } = this.state;
    const index = imgIndex - 1;
    const item = fileListImg[index];
    if (index === 0 || (index > 0 && index < fileListImg.length)) {
      dispatch({
        type: 'updateState',
        payload: {
          editFileItem: item,
        },
      });
    } else {
      message.warn('已经到头了！');
    }
  };

  // 下一页
  nextViewImg = () => {
    const { dispatch } = this.props;
    const { imgIndex, fileListImg } = this.state;
    const index = imgIndex + 1;
    const item = fileListImg[index];
    if (index < fileListImg.length) {
      dispatch({
        type: 'updateState',
        payload: {
          editFileItem: item,
        },
      });
    } else {
      message.warn('已经是最后一张了！');
    }
  };

  render() {
    const { previewFileVisible, editFileItem } = this.props;
    const { imgIndex, fileListImg } = this.state;
    const { enclosurePath } = editFileItem;
    return (
      <Modal
        footer={null}
        width={800}
        height={500}
        centered
        visible={previewFileVisible}
        destroyOnClose
        onCancel={this.cancel}
        wrapClassName="attach-viewimg-modal"
      >
        <div styleName="m-imgWrap" className="f-no-select">
          <h3>
            营业执照（{imgIndex + 1}/{fileListImg.length}）
          </h3>
          <div styleName="m-changeImg">
            <Carousel
              imageUrl={enclosurePath}
              fileList={fileListImg}
              getContent={({ zoom, rotate, curScale }) => (
                <div styleName="m-funcBtn">
                  <i className="iconfont" onClick={() => zoom()}>
                    &#xea33;
                  </i>
                  <span>{curScale}%</span>
                  <i className="iconfont" onClick={() => zoom(true)}>
                    &#xea35;
                  </i>
                  <i className="iconfont" title="旋转" onClick={() => rotate()}>
                    &#xea36;
                  </i>
                  <i onClick={() => this.downFile(editFileItem)} className="iconfont" title="下载">
                    &#xea34;
                  </i>
                </div>
              )}
            />
          </div>
          <Icon type="left-circle" onClick={() => this.prevViewImg()} />
          <Icon type="right-circle" onClick={() => this.nextViewImg()} />
        </div>
      </Modal>
    );
  }
}
ViewFileModal.defaultProps = {};
export default connect(({ previewFileVisible, upType, editFileItem, enclosureList }) => ({
  previewFileVisible,
  upType,
  enclosureList,
  editFileItem,
}))(ViewFileModal);
