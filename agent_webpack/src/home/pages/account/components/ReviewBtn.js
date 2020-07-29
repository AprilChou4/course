/* eslint-disable no-param-reassign */
/**
 * 批量审核
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, message, Modal } from 'antd';
import { connect } from 'nuomi';
import { request } from '@utils';
import { ShowConfirm, Authority } from '@components';
import { BATCH_REVIEW_PROCESS_URL, BATCH_REVIEW_URL, BEFORE_BATCH_REVIEW_URL } from '../apis';
import ProcessModal from './ProcessModal';
import ConfirmIcon from './ConfirmIcon';

class ReviewButton extends Component {
  static propTypes = {
    selectedRowKeys: PropTypes.array,
    startDate: PropTypes.string,
  };

  state = {
    process: 0,
    isShowProcess: false,
  };

  validateAcc = (account = [], rows = []) => {
    const len = account.length;
    if (len === 0) {
      message.warning('请先选择账套');
      return false;
    }
    if (len > 100) {
      message.warning('为保证系统效率，请选择100个以内账套，建议您分批操作~');
      return false;
    }
    account = rows
      .filter((data) => data.schedule === 5 && !data.status)
      .map((data) => data.accountId);
    if (!account.length) {
      message.warning('当前选择账套中没有待审核账套');
      return false;
    }
    return account;
  };

  onClick = async () => {
    const { selectedRowKeys, selectedRows, startDate, dispatch } = this.props;
    const accIds = this.validateAcc(selectedRowKeys, selectedRows);
    if (!accIds) {
      return;
    }

    this.params = { currentDate: startDate, accountIdList: selectedRowKeys };
    const data = await dispatch({
      type: 'beforeReview',
      payload: this.params,
    });
    if (!data) return;

    this.confirmReview(data);
  };

  confirmReview = (msg) => {
    ShowConfirm({
      title: '确定对这些账套批量审核？',
      content: msg,
      onOk: this.onReview,
    });
  };

  onReview = async () => {
    const { dispatch } = this.props;
    const data = await dispatch({
      type: 'review',
      payload: this.params,
    });
    if (!data) return;

    this.getPreviewProcess();
  };

  getPreviewProcess = async () => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'reviewProcess',
      payload: this.params,
    });

    if (res && res.data.batchReviewStatus) {
      // 审核结束
      message.success(res.data.batchReviewMsg);

      this.setState({ process: 100 }, () => {
        setTimeout(() => {
          this.setState({ isShowProcess: false });
        }, 100);
      });

      dispatch({
        type: 'updateMainDatas',
        payload: true,
      });
    } else {
      // 未结束
      setTimeout(() => {
        this.getPreviewProcess();
      }, 1000);
    }
  };

  setNiceProcess = () => {
    let { process } = this.state;
    const add = Math.ceil(Math.random() * 10);
    process += add;

    process = process > 98 ? 98 : process;
    this.setState({ process });
    setTimeout(() => {
      this.setNiceProcess();
    }, 500);
  };

  render() {
    const { process, isShowProcess } = this.state;
    return (
      <>
        <Button className="e-ml12" type="primary" onClick={this.onClick}>
          批量审核
        </Button>
        {/* <ProcessModal process={process} isShowProcess={isShowProcess} /> */}
      </>
    );
  }
}

export default connect(({ selectedRowKeys, selectedRows, startDate }) => ({
  selectedRowKeys,
  startDate,
  selectedRows,
}))(ReviewButton);
