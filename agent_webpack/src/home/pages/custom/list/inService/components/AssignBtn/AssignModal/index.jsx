// 派工弹窗
import React, { PureComponent } from 'react';
import { Modal, Spin } from 'antd';
import { connect } from 'nuomi';
import { trim } from 'lodash';
import ShowConfirm from '@components/ShowConfirm';
import AssignForm from './AssignForm';
import Style from './style.less';
import services from '../../../services';

class AssignModal extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: '$assignInitQuery',
    });
  }

  // 确定
  onOk = () => {
    const { dispatch, selectedRowKeys } = this.props;
    const {
      form: { validateFields },
    } = this.form.props;
    validateFields(async (err, values) => {
      if (!err) {
        const subData = { ...values };
        subData.customerIdList = selectedRowKeys;
        // 派工前校验派工是否存在已删除情况
        const {
          accountingAssistant,
          bookkeepingAccounting,
          customerConsultant,
          drawer,
          taxReportingAccounting,
        } = await services.checkAssign(subData);

        const isAssign =
          bookkeepingAccounting !== '' ||
          !!accountingAssistant.length ||
          !!taxReportingAccounting.length ||
          !!drawer.length ||
          !!customerConsultant.length;
        let tipTitle = trim(`${bookkeepingAccounting !== '' ? '记账会计/' : ''}
                              ${accountingAssistant.length ? '会计助理/' : ''}
                              ${taxReportingAccounting.length ? '报税会计/' : ''}
                              ${drawer.length ? '开票员/' : ''}
                              ${customerConsultant.length ? '客户顾问/' : ''}`);
        tipTitle = tipTitle.substring(0, tipTitle.length - 1);
        if (isAssign) {
          ShowConfirm({
            title: `${tipTitle}岗位已经存在派工，是否继续派工？`,
            // title: '记账会计/会计助理/报税会计/开票员/客户顾问岗位已经存在派工，是否继续派工？',
            onOk: () => {
              dispatch({
                type: '$assignCustomer',
                payload: subData,
              });
            },
            onCancel: () => {
              dispatch({
                type: 'updateState',
                payload: {
                  selectedRowKeys: [],
                  assignVisible: false,
                },
              });
            },
          });
        } else {
          dispatch({
            type: '$assignCustomer',
            payload: subData,
          });
        }
      }
    });
  };

  // 取消
  onCancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        assignVisible: false,
        selectedRowKeys: [],
        selectedRows: [],
      },
    });
  };

  render() {
    const { loadings, assignVisible } = this.props;
    return (
      <Modal
        title="指派客户"
        visible={assignVisible}
        width={680}
        maskClosable={false}
        centered
        onOk={this.onOk}
        onCancel={this.onCancel}
        destroyOnClose
        className={Style['m-assignModal']}
      >
        <Spin
          spinning={
            !!loadings.$assignCustomer ||
            !!loadings.$getAssignInfo ||
            !!loadings.$getRoletypeList ||
            !!loadings.$getBookkeep
          }
        >
          <AssignForm wrappedComponentRef={(el) => (this.form = el)} />
        </Spin>
      </Modal>
    );
  }
}
export default connect(({ loadings, assignVisible, selectedRowKeys }) => ({
  loadings,
  assignVisible,
  selectedRowKeys,
}))(AssignModal);
