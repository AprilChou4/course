/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Table, Modal, Button } from 'antd';
import style from '../style/style.less';
import './style.less';

const CheckoutRes = ({ data, onCancel, visible }) => {
  const { failList, checkOutMsg, successNum, failNum, totalNum } = data || {};

  const getPageCfg = (id) => ({
    导入数据中含有表外科目: `/platform.html?id=${id}#!/setting/subject-manage`,
    科目期初余额试算不平衡: `/platform.html?id=${id}#!/setting/initial-balance`,
    资产负债表不平衡: `/platform.html?id=${id}#!/sheet/asset-liabilities`,
    未结转损益: `/platform.html?id=${id}#!/terminal/carryover`,
    本年利润科目有余额: `/platform.html?id=${id}#!/terminal/carryover`,
    存在未审核凭证: `/platform.html?id=${id}#!/voucher/list?verifyStatus=0`,
  });

  const renderAccList = (record) =>
    record.accountList.map((item, i) => {
      return (
        <a
          key={i}
          className={style['a-link-line']}
          target="_blank"
          href={getPageCfg(item.accountId)[record.failReason]}
        >
          {item.accountName}
        </a>
      );
    });

  const columns = [
    {
      title: '账套名称',
      dataIndex: 'accountList',
      render: (text, record) => renderAccList(record),
      width: 100,
    },
    {
      title: '失败原因',
      dataIndex: 'failReason',
      width: 100,
    },
  ];

  return (
    <Modal
      title="批量结账结果"
      visible={visible}
      maskClosable={false}
      onCancel={onCancel}
      onOk={onCancel}
      width={520}
      footer={<Button onClick={onCancel}>关闭</Button>}
    >
      <div styleName="check-res-info-wrap">
        <Icon type="exclamation-circle" theme="filled" style={{ color: '#F6A327' }} />
        <span styleName="check-res-info">
          本次共结账 {totalNum} 个账套，成功 {successNum} 个，
          <span styleName="check-res-info-error">失败 {failNum} 个</span>
          ，失败原因如下：
        </span>
      </div>
      <Table
        columns={columns}
        size="middle"
        dataSource={data.failList || []}
        pagination={false}
        scroll={{ y: 300 }}
        rowKey={(record, i) => i}
        bordered
        className={style['table-md-td-40']}
      />
    </Modal>
  );
};

CheckoutRes.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  data: PropTypes.object,
};

export default CheckoutRes;
