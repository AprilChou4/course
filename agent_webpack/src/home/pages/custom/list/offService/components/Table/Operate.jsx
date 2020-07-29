import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import TextButton from '@components/TextButton';
import ShowConfirm from '@components/ShowConfirm';

class Operate extends PureComponent {
  // 删除
  delete = () => {
    const { dispatch, record } = this.props;
    ShowConfirm({
      title: '你确定要删除所选客户信息吗？',
      width: 282,
      onOk() {
        dispatch({
          type: '$deleteCustomer',
          payload: {
            record,
          },
        });
      },
    });
  };

  // 恢复服务
  recover = () => {
    const { dispatch, record } = this.props;
    const { customerId } = record;
    dispatch({
      type: '$renewCustomer',
      payload: {
        customerId,
        record,
      },
    });
  };

  render() {
    return (
      <span>
        <TextButton onClick={() => this.recover()}>恢复服务</TextButton>
        <TextButton onClick={this.delete}>删除</TextButton>
      </span>
    );
  }
}
export default connect()(Operate);
