// 新增客户按钮
import React, { PureComponent } from 'react';
import { Button, Divider } from 'antd';
import { connect } from 'nuomi';
import Authority from '@components/Authority';
import AddCustomModal from './AddCustomModal';
import Import from '../Import';
import Style from './style.less';

class AddCustomBtn extends PureComponent {
  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        customVisible: true,
      },
    });
  };

  render() {
    const { customVisible, importProgressVisible } = this.props;
    const isDisabled = importProgressVisible ? { disabled: true } : {};
    return (
      <>
        <Authority code="4">
          <a className={Style['m-addBtn']} {...isDisabled}>
            <Button type="primary" onClick={this.add}>
              新增客户
            </Button>
            <Divider type="vertical" className={Style['m-divider']} />
            <Import />
          </a>
        </Authority>
        {customVisible && <AddCustomModal />}
      </>
    );
  }
}
export default connect(({ customVisible, importProgressVisible }) => ({
  customVisible,
  importProgressVisible,
}))(AddCustomBtn);
