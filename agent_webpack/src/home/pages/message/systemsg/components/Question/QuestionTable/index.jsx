// 系统消息>我的tab下table
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
class QuestionTable extends PureComponent {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: '标题',
        dataIndex: 'title',
        className: 'th-center',
        width: 260,
        render: (text) => text || '--',
      },
      {
        title: '回复时间',
        dataIndex: 'replyTime',
        className: 'th-center',
        align: 'center',
        width: 100,
        render: (text) => (
          <div className={`f-ma ${Style['width-120']}`}>
            {text > 0 ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '--'}
          </div>
        ),
      },
      {
        title: '提交时间',
        dataIndex: 'addTime',
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
      type: '$getQuesList',
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

  clickRow = (record) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'updateState',
      payload: {
        displayType: 1,
        currRecord: record,
      },
    });
  };

  render() {
    const { total, pageSize, current, totalData, loadings, ...rest } = this.props;
    return (
      <SuperTable
        className={Style['ques-table']}
        pagination={{
          showSizeChanger: true,
          current,
          total,
          pageSize,
          pageSizeOptions,
          showTotal: (total) => `共${total}条`,
        }}
        onRow={(record) => {
          return {
            onClick: (event) => {
              this.clickRow(record);
            }, // 点击行
          };
        }}
        onChange={this.change}
        loading={loadings.$getQuesList}
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
export default connect(({ query }) => ({ query }))(QuestionTable);
