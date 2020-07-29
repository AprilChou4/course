import React, { useMemo } from 'react';
import { Table } from 'antd';

function Content({
  data: {
    submitData: {
      accountList,
      companyData: { realName },
    },
  },
}) {
  const dataSource = useMemo(
    () =>
      accountList.map(({ key, label }) => ({
        key,
        realName,
        accountName: label,
      })),
    [accountList, realName],
  );
  const columns = useMemo(
    () => [
      {
        title: '接收人',
        dataIndex: 'realName',
        width: '40%',
        align: 'center',
        render: (value, row, index) => ({
          children: value,
          props: {
            rowSpan: index === 0 ? dataSource.length : 0,
          },
        }),
      },
      {
        title: '账套',
        dataIndex: 'accountName',
        align: 'center',
      },
    ],
    [dataSource.length],
  );
  // TODO: 表格高度没处理
  return (
    <>
      <p className="t-bold">
        你确定要移交以下账套么？
        <br />
        移交成功后，您将无权使用该账套！
      </p>
      <Table bordered size="middle" columns={columns} dataSource={dataSource} pagination={false} />
    </>
  );
}

export default Content;
