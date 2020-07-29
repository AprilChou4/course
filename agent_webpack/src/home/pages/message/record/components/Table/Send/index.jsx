// 消息记录>定时发送
import React, { PureComponent, Fragment } from 'react';
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
class SendTable extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '消息主题',
        dataIndex: 'msgTitle',
        align: 'center',
        width: 130,
        render: (text) => (
          <div>
            <i className={`iconfont ${Style['m-icon']}`}>&#xec8b;</i>
            {text}
          </div>
        ),
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
        render: (text, record) => (
          <div className="f-two-ellipsis">{getSendObj(record.customers)}</div>
        ),
      },
      {
        title: '发送时点',
        dataIndex: 'sendTime',
        align: 'center',
        width: 100,
        render: (text) => <div className={`f-ma ${Style['width-80']}`}>{text}</div>,
      },
      {
        title: '操作时点',
        dataIndex: 'operateTime',
        align: 'center',
        width: 100,
        render: (text) => (
          <div className={`f-ma ${Style['width-80']}`}>
            {moment(text).format('YYYY-MM-DD HH:mm:ss')}
          </div>
        ),
      },
      {
        title: '操作人',
        dataIndex: 'operateUsername',
        align: 'center',
        width: 100,
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
    // util.storeForUser('account_table_pagesize', pagination.pageSize);
    // 该回调会早于表头绑定的点击事件回调先执行，因此加定时器解决该问题
    // setTimeout(() => {
    const { dispatch, query } = this.props;
    const { current, pageSize, ...rest } = pagination;
    dispatch({
      type: '$getTimingList',
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
    const { total, pageSize, current, totalData, loadings, ...rest } = this.props;
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
        loading={loadings.$getTimingList}
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
export default connect(({ query }) => ({ query }))(SendTable);
