// 发送失败
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import moment from 'moment';
import SuperTable from '@components/SuperTable';
import Operate from './Operate';
import { getSendObj } from '../../../public';
import Style from '../style.less';

const pageSizeOptions = ['100', '200', '300'];

@connect(({ current, total, pageSize, dataSource, loadings }) => ({
  current,
  total,
  pageSize,
  dataSource,
  loadings,
}))
class FailTable extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '消息主题',
        dataIndex: 'msgTitle',
        align: 'center',
        width: 130,
      },
      {
        title: '消息内容  ',
        dataIndex: 'msgContent',
        className: 'th-center',
        width: 260,
        render: (text) => (
          <div className="f-two-ellipsis" dangerouslySetInnerHTML={{ __html: text }} />
        ),
      },
      {
        title: '发送对象',
        dataIndex: 'customers',
        className: 'th-center',
        width: 180,
        render: (text, record) => {
          return <div className="f-two-ellipsis">{getSendObj(record.customers)}</div>;
        },
      },
      {
        title: '发送时点',
        dataIndex: 'realSendTime',
        align: 'center',
        width: 100,
        render: (text) => (
          <div className={`f-ma ${Style['width-80']}`}>
            {moment(text).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: 'cz',
        align: 'center',
        className: 'operate-cell',
        width: 140,
        render: (text, record) => <Operate record={record} />,
      },
    ];
  }

  // 切换分页
  change = (pagination, filters, sorter) => {
    const { dispatch, query } = this.props;
    const { current, pageSize, ...rest } = pagination;
    dispatch({
      type: '$getFailedList',
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

  render() {
    const { total, pageSize, current, loadings, ...rest } = this.props;
    // let { x } = this.state;
    return (
      <SuperTable
        className={Style['msgRecord-table']}
        pagination={{
          showSizeChanger: true,
          current,
          total,
          pageSize,
          pageSizeOptions,
          showTotal: (total) => `共${total}条`,
        }}
        locale={{
          emptyText:'暂无数据',
        }}
        onChange={this.change}
        loading={loadings.$getFailedList}
        rowKey={(record, index) => index}
        scroll={{
          x: 140,
        }}
        {...rest}
        columns={this.columns}
      />
    );
  }
}
export default connect(({ query }) => ({ query }))(FailTable);
