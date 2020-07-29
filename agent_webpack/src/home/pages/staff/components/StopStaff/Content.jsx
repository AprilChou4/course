import React, { useCallback, useMemo } from 'react';
import { dictionary } from '@pages/staff/utils';
import { Iconfont, LinkButton, AntdTable } from '@components';
import { get, postMessage as postMessageRouter } from '@utils';
import styles from './style.less';

const customAssigntypes = [
  '',
  'bookkeepingAccounting',
  'accountingAssistant',
  'drawer',
  'taxReportingAccounting',
  'customerConsultant',
];

const Content = ({ data }) => {
  const assignStatistics = useMemo(() => get(data, 'assignStatistics', []), [data]);
  const realName = useMemo(() => get(data, 'record.realName', ''), [data]);

  const handleAssignClick = useCallback(
    (record) => {
      const { roleType } = record;
      window.clientParams = {
        [customAssigntypes[roleType]]: [get(data, 'record.staffId', '')],
      };
      postMessageRouter({
        type: 'agentAccount/routerLocation',
        payload: {
          url: '/custom/list',
        },
      });
    },
    [data],
  );

  // 传给父组件
  // useImperativeHandle(ref, () => ({}), []);
  const columns = useMemo(
    () => [
      {
        title: '',
        dataIndex: 'index',
        align: 'center',
        width: 30,
        render: (text, record, index) => index + 1,
      },
      {
        title: '任务类型',
        dataIndex: 'roleType',
        align: 'center',
        render: (text) => dictionary.assignType.map[text] || '-',
      },
      {
        title: '任务数',
        dataIndex: 'count',
        align: 'center',
        width: 160,
        render: (text, record) => (
          <LinkButton onClick={() => handleAssignClick(record)}>{text}</LinkButton>
        ),
      },
    ],
    [handleAssignClick],
  );

  return (
    <>
      <div className={styles.title}>
        <span className={styles.titleHead}>
          <Iconfont code="&#xeaa1;" />
          温馨提示：
        </span>
        <span>员工 {realName} 存在派工以下派工任务，请重新派工再进行停用。</span>
      </div>
      <div className={styles.content}>
        <AntdTable
          bordered
          rowKey="roleType"
          emptyType="default"
          pagination={false}
          scroll={{ y: true }}
          columns={columns}
          dataSource={assignStatistics}
        />
        <div className={styles.footerTip}>
          <span className="c-warning">注：点击任务数，前往客户管理进行派工！</span>
        </div>
      </div>
    </>
  );
};

export default Content;
