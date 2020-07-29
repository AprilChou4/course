/**
 * 批量结账 btn，结账结果，结账进度
 */
import React, { Component } from 'react';
import { Button, message } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'nuomi';
import { ShowConfirm, Authority } from '@components';
import CheckoutRes from './CheckoutRes';
import ProcessModal from '../ProcessModal';
import style from '../style/style.less';

class CheckOutButton extends Component {
  static propTypes = {
    selectedRowKeys: PropTypes.array, // 选中的账套 id
    startDate: PropTypes.string,
  };

  state = {
    process: 0,
    resData: {},
    isResVisible: false,
    isShowProcess: false,
  };

  validateAcc = (keys = []) => {
    const { selectedRows } = this.props;

    if (keys.length === 0) {
      message.warning('请先选择账套');
      return false;
    }
    if (keys.length > 100) {
      message.warning('为保证系统效率，请选择100个以内账套，建议您分批操作~');
      return false;
    }

    const disableCheckRows = selectedRows.filter((item) => item.check_status == '3');
    if (disableCheckRows.length > 0) {
      message.error(`已选账套中包含${disableCheckRows.length}个高风险账套，不能进行结账`);
      return false;
    }
    return true;
  };

  onClick = async () => {
    const { selectedRowKeys, startDate, dispatch } = this.props;
    if (!this.validateAcc(selectedRowKeys)) return;

    this.params = { currentDate: startDate, accountIdList: selectedRowKeys };
    const data = await dispatch({
      type: 'beforeCheck',
      payload: this.params,
    });
    if (!data) return;

    this.confirmReview(data);
  };

  confirmReview = (msg = '选中账套共 X 个，其中YYYY年MM月待结账账套共 X 个') => {
    ShowConfirm({
      title: '确定对这些账套批量结账？',
      content: (
        <div>
          <p>{msg}</p>
          <div className={style['acc-checkout-info']}>请确定无其他用户正在操作这些账套</div>
        </div>
      ),
      onOk: this.onCheck,
    });
  };

  onCheck = async () => {
    const { dispatch } = this.props;
    const data = await dispatch({
      type: 'checkOut',
      payload: this.params,
    });
    if (!data) return;

    this.getProcess();
    // 显示虚拟进度条
    this.setState({ isShowProcess: true }, () => this.setNiceProcess());
  };

  // 轮询获取进度
  getProcess = async () => {
    const { dispatch } = this.props;
    const data = await dispatch({
      type: 'checkOutProcess',
      payload: this.params,
    });
    if (!data) return;

    const { batchCheckOutStatus, batchCheckOutResult } = data || {};
    if (batchCheckOutStatus) {
      // 结账结束
      const { failList, checkOutMsg, failNum } = batchCheckOutResult;
      this.setState({ process: 100 }, () => {
        setTimeout(() => {
          this.setState({ isShowProcess: false });
        }, 100);
      });

      if (failNum === 0) {
        message.success(checkOutMsg);
      } else {
        this.setState({
          resData: batchCheckOutResult,
          isResVisible: true,
        });
      }

      dispatch({
        type: 'updateMainDatas',
      });
    } else {
      setTimeout(() => {
        this.getProcess();
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

  onCloseResModal = () => this.setState({ isResVisible: false });

  render() {
    const { isResVisible, resData, process, isShowProcess } = this.state;
    return (
      <>
        <Authority code="185">
          <Button className="e-ml12" type="primary" onClick={this.onClick}>
            批量结账
          </Button>
        </Authority>

        <CheckoutRes data={resData} visible={isResVisible} onCancel={this.onCloseResModal} />

        <ProcessModal process={process} isShowProcess={isShowProcess} />
      </>
    );
  }
}

export default connect(({ selectedRowKeys, startDate, selectedRows }) => ({
  selectedRowKeys,
  startDate,
  selectedRows,
}))(CheckOutButton);
