// 四种证件类型tab标签
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import UploadFile from '../UploadFile';
import Style from './style.less';

class AttachItem extends PureComponent {
  // 切换tab
  changeTab = (key) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'updateState',
      payload: {
        tabType: key,
      },
    });
  };

  render() {
    const { fileList, upType, itemTitle } = this.props;
    return (
      <dl className={Style['m-infoBlock']}>
        <dt>{itemTitle}</dt>
        <dd>
          <UploadFile fileList={fileList} upType={upType} />
        </dd>
      </dl>
    );
  }
}
AttachItem.defaultProps = {
  // 模块标题
  itemTitle: '',
  // 文件列表
  fileList: [],
  // 文件类型
  upType: '',
};

AttachItem.propTypes = {
  itemTitle: PropTypes.string,
  fileList: PropTypes.array,
  upType: PropTypes.number,
};
export default AttachItem;
