// 成功/失败详情 > table
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import SuperTable from '@components/SuperTable';
import FilterDropdown from '../FilterDropdown';

class DtailTable extends PureComponent {
  // 是否已读/失败原因筛选
  filter = ({ key }) => {
    const {
      dispatch,
      tabType,
      isIgnore,
      detailQuery: { isRead, failedReasonCode, ...rest },
      detailInfo: { msgId, realSendTime },
    } = this.props;
    let isReadFilter = {};
    if (key !== '0') {
      isReadFilter = key === '1' ? { isRead: true } : { isRead: false };
    }
    let failedReasonFilter = {};
    if (key !== '0') {
      failedReasonFilter = { failedReasonCode: Number(key) };
    }
    const filterObj = tabType === '2' ? isReadFilter : failedReasonFilter;
    const isSuccess = tabType === '2';
    dispatch({
      type: '$getDetail',
      payload: {
        msgId,
        realSendTime,
        isSuccess,
        ...(tabType === '3' ? { isIgnore } : {}),
        ...rest,
        ...filterObj,
      },
    });
    dispatch({
      type: 'updateState',
      payload: {
        detailQuery: {
          ...rest,
          ...filterObj,
        },
      },
    });
  };

  getColumns = (tabType) => {
    const isRead = {
      // title: 'APP是否已读',
      title: () => (
        <FilterDropdown
          field="period"
          fieldName="是否已读"
          list={[
            {
              value: '0',
              title: '全部',
            },
            {
              value: '1',
              title: '是',
            },
            {
              value: '2',
              title: '否',
            },
          ]}
          menuClick={this.filter}
        />
      ),
      dataIndex: 'isRead',
      align: 'center',
      className: 'f-pr',
      width: 120,
      render: (value) => {
        const num = value ? 0 : 1;
        return ['是', '否'][num];
      },
    };

    const failReason = {
      title: () => (
        <FilterDropdown
          field="reason"
          fieldName="失败原因"
          list={[
            {
              value: '0',
              title: '全部',
            },
            {
              value: '1',
              title: '客户未授查账',
            },
            {
              value: '2',
              title: '客户停止服务',
            },
            {
              value: '3',
              title: '无发送权限',
            },
            {
              value: '4',
              title: '网络异常',
            },
          ]}
          menuClick={this.filter}
        />
      ),
      dataIndex: 'failedReason',
      align: 'center',
      className: 'f-pr',
      width: 120,
    };
    const columns = [
      {
        title: '发送对象',
        colSpan: 2,
        dataIndex: 'customerName',
        render: (value, record, index) => {
          return {
            children: value,
            props: {
              rowSpan: record.rowSpan,
              className: 'width-200',
            },
          };
        },
      },
      {
        title: '用户名',
        colSpan: 0,
        // width: 0,
        dataIndex: 'username',
        render: (value) => {
          return <div className="width-90">{value}</div>;
        },
      },
      {
        title: '消息内容',
        dataIndex: 'msgContent',
        className: 'th-center',
        width: 600,
        render: (value, record) => {
          return {
            children: value,
            props: {
              rowSpan: record.rowSpan,
            },
          };
        },
      },
      {
        ...(tabType === '2' ? isRead : failReason),
      },
    ];

    return columns;
  };

  selectChange = (selectedRowKeys, selectedRows) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        selectedRowKeys,
      },
    });
  };

  render() {
    // const { ...rest } = this.props;
    const {
      tabType,
      detailInfo: { customers },
      ...rest
    } = this.props;
    let data = [];
    customers &&
      customers.forEach((item) => {
        const { grantUsers, ...left } = item;
        grantUsers &&
          grantUsers.map((val, key) => {
            data = [...data, { ...left, ...val, rowSpan: key === 0 ? grantUsers.length : 0 }];
            return val;
          });
        return item;
      });
    const rowSelection =
      tabType === '3'
        ? {
            rowSelection: {
              cloumnWidth: '40px',
              // selectedRowKeys,
              onChange: this.selectChange,
            },
          }
        : {};
    return (
      <SuperTable
        {...rowSelection}
        pagination={false}
        rowKey={(record) => record.recordId}
        // scroll={{
        //     x:140
        // }}
        {...rest}
        columns={this.getColumns(tabType)}
        dataSource={data}
      />
    );
  }
}
export default connect(({ tabType, isIgnore, detailInfo, detailQuery }) => ({
  tabType,
  isIgnore,
  detailInfo,
  detailQuery,
}))(DtailTable);
