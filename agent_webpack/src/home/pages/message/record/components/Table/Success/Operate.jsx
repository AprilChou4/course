import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import PropTypes from 'prop-types';
import TextButton from '@components/TextButton';
// import Authority from '@components/Authority';

class Operate extends PureComponent {
  // 详情
  detail = () => {
    const {
      dispatch,
      record: { msgId, realSendTime },
    } = this.props;
    dispatch({
      type: '$getDetail',
      payload: {
        msgId,
        realSendTime,
        isSuccess: true,
      },
    });
    dispatch({
      type: 'updateState',
      payload: {
        displayType: 1,
      },
    });
  };

  render() {
    return <TextButton onClick={this.detail}>详情</TextButton>;
  }
}
Operate.propTypes = {
  record: PropTypes.object,
};
export default connect()(Operate);
