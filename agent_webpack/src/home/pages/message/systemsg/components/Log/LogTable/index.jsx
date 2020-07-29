// 系统消息>系统消息tab下table
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import moment from 'moment';
import SuperTable from '@components/SuperTable';
import Style from './style.less';

const pageSizeOptions = ['100', '200', '300'];

@connect(({ current, total, pageSize, dataSource, loadings }) => ({
  current,
  total,
  pageSize,
  dataSource,
  loadings,
}))
class LogTable extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '操作对象',
        dataIndex: 'operateObject',
        width: 260,
        align: 'center',
      },
      {
        title: '操作内容',
        dataIndex: 'operateContent',
        className: 'th-center',
        width: 130,
        render: (text) => text,
      },
      {
        title: '操作平台',
        dataIndex: 'operatePlatform',
        className: 'th-center',
        align: 'center',
        width: 130,
        render: (text) => {
          return ['管理平台', '记账平台'][text - 1];
        },
      },
      {
        title: '操作人',
        dataIndex: 'operateUser',
        className: 'th-center',
        align: 'center',
        width: 130,
        render: (text) => text,
      },
      {
        title: '发布时间',
        dataIndex: 'operateTime',
        align: 'center',
        width: 100,
        render: (text) => (
          <div className={`f-ma ${Style['width-120']}`}>
            {text > 0 ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'}
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
      type: '$getLogList',
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

  changeSelection = () => {};

  clickRow = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        displayType: 1,
      },
    });
  };

  render() {
    const { total, pageSize, current, totalData, loadings, ...rest } = this.props;
    return (
      <SuperTable
        className={Style['log-table']}
        pagination={{
          showSizeChanger: true,
          current,
          total,
          pageSize,
          pageSizeOptions,
          showTotal: (total) => `共${total}条`,
        }}
        onChange={this.change}
        loading={loadings.$getLogList}
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
export default connect(({ query }) => ({ query }))(LogTable);
