// 选择企业
import React from 'react';
import { Modal } from 'antd';
import { connect } from 'nuomi';
import CompanyList from './CompanyList'; // 企业列表

import Style from './style.less';

const ChooseCompany = ({ dispatch, chooseCompanyVisible }) => {
  // 关闭弹窗
  const onCancel = () => {
    dispatch({
      type: 'updateState',
      payload: {
        chooseCompanyVisible: false,
      },
    });
  };

  return (
    <Modal
      visible={chooseCompanyVisible}
      width={598}
      height={423}
      centered
      maskClosable={false}
      className={Style['m-chooseCompany']}
      footer={null}
      onCancel={onCancel}
    >
      <div className={Style['m-title']}>选择企业</div>
      <CompanyList />
    </Modal>
  );
};
export default connect(({ chooseCompanyVisible }) => ({ chooseCompanyVisible }))(ChooseCompany);
