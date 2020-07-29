// 客户管理>建账
import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Tabs, Spin } from 'antd';
import { connect } from 'nuomi';
import NewAccount from '../NewAccount';
import ThirdAccount from '../ThirdAccount';
import ExcelAccount from '../ExcelAccount';
import OtherAccount from '../OtherAccount';

const { TabPane } = Tabs;
const AccountModal = ({ dispatch, loadings, currRecord, accountVisible }) => {
  const [accountTabKey, setAccountTabKey] = useState('1');
  // 获取账套信息
  useEffect(() => {
    dispatch({
      type: '$getAccountInfo',
      payload: {
        customerId: currRecord.customerId,
      },
    });
  }, [currRecord.customerId, dispatch]);

  // 取消
  const onCancel = useCallback(() => {
    dispatch({
      type: 'updateState',
      payload: {
        accountVisible: false,
      },
    });
  }, [dispatch]);

  // 切换页签
  const changeTab = useCallback((key) => {
    setAccountTabKey(key);
  }, []);

  return (
    <Modal
      title={null}
      width={748}
      centered
      footer={null}
      className="ui-tab-modal"
      maskClosable={false}
      visible={accountVisible}
      onCancel={onCancel}
    >
      <Spin
        spinning={
          !!loadings.$getAccountInfo ||
          !!loadings.$checkCustomer ||
          !!loadings.$querySubjectTemplateList ||
          !!loadings.$getBookkeep ||
          !!loadings.$createNewAccount ||
          !!loadings.$offlineImportAccount ||
          !!loadings.$onlineImportAccount ||
          !!loadings.$createExcelAccount ||
          !!loadings.$copyAccount
        }
      >
        <Tabs defaultActiveKey="1" animated={false} activeKey={accountTabKey} onChange={changeTab}>
          <TabPane tab="新建账套" key="1">
            {accountTabKey === '1' && <NewAccount />}
          </TabPane>
          <TabPane tab="导入第三方" key="2">
            {accountTabKey === '2' && <ThirdAccount />}
          </TabPane>
          <TabPane tab="Excel建账" key="3">
            {accountTabKey === '3' && <ExcelAccount />}
          </TabPane>
          <TabPane tab="其他方式" key="4">
            {accountTabKey === '4' && <OtherAccount />}
          </TabPane>
        </Tabs>
      </Spin>
    </Modal>
  );
};
export default connect(({ loadings, currRecord, accountVisible }) => ({
  loadings,
  currRecord,
  accountVisible,
}))(AccountModal);
