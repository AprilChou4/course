// 客户管理>建账
import React from 'react';
import { connect } from 'nuomi';
import ExcelFail from './ExcelFail';
import AccountModal from './AccountModal';

// class EstablishAccount extends Component {
//   // 取消
//   onCancel = () => {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'updateState',
//       payload: {
//         accountVisible: false,
//       },
//     });
//   };

//   render() {
//     const { accountVisible } = this.props;
//     return (
//       <>
//         {accountVisible && <AccountModal />}
//         <ExcelFail />
//       </>
//     );
//   }
// }
const EstablishAccount = ({ accountVisible }) => {
  return (
    <>
      {accountVisible && <AccountModal />}
      <ExcelFail />
    </>
  );
};
export default connect(({ accountVisible }) => ({ accountVisible }))(EstablishAccount);
