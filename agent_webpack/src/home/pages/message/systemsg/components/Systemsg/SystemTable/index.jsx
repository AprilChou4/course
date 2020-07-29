// 系统消息>系统消息tab下table
import React, { PureComponent } from 'react';
import { connect, router } from 'nuomi';
import moment from 'moment';
import qs from 'qs';
import SuperTable from '@components/SuperTable';
import Style from './style.less';

const pageSizeOptions = ['100', '200', '300'];

@connect(({ current, total, pageSize, dataSource, loadings, query, selectedRowKeys }) => ({
  current,
  total,
  pageSize,
  dataSource,
  loadings,
  query,
  selectedRowKeys,
}))
class SystemTable extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '标题',
        dataIndex: 'title',
        className: 'th-center',
      },
      {
        title: '消息类别',
        dataIndex: 'type',
        className: 'th-center',
        align: 'center',
        width: 175,
        render: (text) => {
          // "消息类型", 0-系统消息 1-辅助核算提醒 2-固定资产提醒 3-外币核算提醒 4-待接收帐套提醒 5-帐套交接更新提醒 6-工作提醒（云代账到期提醒） 7-合同到期提醒 8-合同欠款提醒 9-派工消息 10-建议反馈消息提醒 11-客户跟进系统消息
          return [
            '系统消息',
            '辅助核算提醒',
            '固定资产提醒',
            '外币核算提醒',
            '待接收帐套提醒',
            '帐套交接更新提醒',
            '工作提醒（云代账到期提醒）',
            '合同到期提醒',
            '合同欠款提醒',
            '派工消息',
            '建议反馈消息提醒',
            '客户跟进系统消息',
            '企业认证状态更新',
          ][text];
        },
      },
      {
        title: '发布时间',
        dataIndex: 'addTime',
        align: 'center',
        width: 190,
        render: (text) => (
          <div className={`f-ma ${Style['width-132']}`}>
            {moment(text).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
    ];
  }

  // 切换分页
  change = (pagination, filters, sorter) => {
    const { dispatch, query } = this.props;
    const { current, pageSize, ...rest } = pagination;
    dispatch({
      type: '$getSystemsgList',
      payload: {
        current,
        pageSize,
        ...query,
      },
    });
    dispatch({
      type: 'updateState',
      payload: {
        ...pagination,
      },
    });
  };

  changeSelection = (selectedRowKeys, selectedRows) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  };

  clickRow = ({ noticeId }) => {
    router.location(`${router.location().pathname}?${qs.stringify({ type: 1, id: noticeId })}`);
  };

  render() {
    // isRead是否已读 0-未读  1-已读
    const { total, pageSize, current, totalData, selectedRowKeys, loadings, ...rest } = this.props;
    return (
      <SuperTable
        className={Style['systemsg-table']}
        pagination={{
          showSizeChanger: true,
          current,
          total,
          pageSize,
          pageSizeOptions,
          showTotal: (total) => `共${total}条`,
        }}
        rowClassName={(record) => (record.isRead === 0 ? Style['m-bold'] : '')}
        rowSelection={{
          columnWidth: '40px',
          selectedRowKeys,
          onChange: this.changeSelection,
        }}
        onRow={(record) => {
          return {
            onClick: (event) => {
              this.clickRow(record);
            }, // 点击行
          };
        }}
        onChange={this.change}
        loading={loadings.$getSystemsgList}
        rowKey={(record) => record.noticeId}
        scroll={{
          x: 140,
        }}
        {...rest}
        columns={this.columns}
      />
    );
  }
}
export default SystemTable;
