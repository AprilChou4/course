import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import { Table } from 'antd';

const renderContent = (value, row, index) => {
  const obj = {
    children: value,
    props: {},
  };
  // if (index === 4) {
  //   obj.props.colSpan = 0;
  // }
  return obj;
};

const columns = [
  {
    title: '公司名称',
    dataIndex: 'customerName',
    width: 300,
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
    title: '发送对象',
    dataIndex: 'username',
    render: renderContent,
  },
];
class TargetTable extends PureComponent {
  render() {
    const {
      selectedRowKeys,
      currRecord: { customers },
      displayType,
    } = this.props;
    let data = [];
    customers &&
      customers.map((item) => {
        const { grantUsers, ...rest } = item;
        grantUsers &&
          grantUsers.map((val, key) => {
            if (
              displayType === 0 ||
              (displayType === 1 && selectedRowKeys.includes(val.recordId))
            ) {
              data = [...data, { ...rest, ...val, rowSpan: key === 0 ? grantUsers.length : 0 }];
            }
            return val;
          });
        return item;
      });
    return (
      <Table
        rowKey={(record, index) => index}
        showHeader={false}
        pagination={false}
        columns={columns}
        dataSource={data}
        bordered
      />
    );
  }
}
export default connect(({ selectedRowKeys, currRecord, displayType }) => ({
  selectedRowKeys,
  currRecord,
  displayType,
}))(TargetTable);
