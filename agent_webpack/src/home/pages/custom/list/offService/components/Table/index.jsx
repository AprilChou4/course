// 发送失败
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import SuperTable from '@components/SuperTable';
import Operate from './Operate';
import Style from './style.less';

const pageSizeOptions = ['20', '50', '100'];

class OffServiceTable extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        width: 60,
        render: (text, record, index) => index + 1,
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        className: 'f-ellipsis',
        align: 'left',
        width: 272,
      },
      {
        title: '纳税性质',
        dataIndex: 'vatType',
        align: 'center',
        width: 130,
        render: (text) => ['一般纳税人', '小规模纳税人'][text],
      },
      {
        title: '记账会计',
        dataIndex: 'bookkeepingAccounting',
        align: 'center',
        width: 180,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        align: 'center',
        width: 170,
      },
      {
        title: '流失原因',
        dataIndex: 'stopReason',
        align: 'center',
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        className: 'f-ellipsis',
        align: 'center',
        width: 130,
      },
      {
        title: '停止服务时间',
        dataIndex: 'stopTime',
        align: 'center',
        width: 170,
      },
      {
        title: '操作',
        dataIndex: 'options',
        width: 150,
        align: 'center',
        className: 'operate-cell',
        fixed: 'right',
        render: (text, record) => <Operate record={record} />,
      },
    ];
  }

  calcScroll = (columns) => {
    // 计算table的scroll。为了保证table的scroll.x大于非固定列的宽度，否则会出现 列头与内容不对齐或出现列重复
    const scroll = {};
    if (columns && columns.length !== 0) {
      const colWidthArr = columns.map((v) => v.width || 0);
      const sumWidth = colWidthArr.reduce((preValue, curValue) => preValue + curValue);
      scroll.x = sumWidth + 170 + 50;
    }
    return scroll;
  };

  change = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { current, pageSize } = pagination;
    const data = {
      current,
      pageSize,
    };

    dispatch({
      type: '$stopCustomerList',
      payload: {
        ...data,
      },
    });
  };

  render() {
    const { query, total, pageSize, current, totalData, loadings, ...rest } = this.props;
    const scroll = this.calcScroll(this.columns);
    return (
      <SuperTable
        className={Style['msgRecord-table']}
        pagination={{
          showSizeChanger: true,
          current,
          total,
          pageSize,
          pageSizeOptions,
          showTotal: (totalSize) => `共${totalSize}条`,
        }}
        onChange={this.change}
        locale={{
          emptyText: query.customerName ? `未找到与 "${query.customerName}"相关的客户` : '暂无数据',
        }}
        rowKey={(record, index) => index}
        scroll={scroll}
        {...rest}
        columns={this.columns}
      />
    );
  }
}
export default connect(
  ({ query, current, total, pageSize, dataSource, loadings, columnSource }) => ({
    query,
    current,
    total,
    pageSize,
    dataSource,
    loadings,
    columnSource,
  }),
)(OffServiceTable);
