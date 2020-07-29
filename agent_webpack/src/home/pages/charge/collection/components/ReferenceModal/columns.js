import moment from 'moment';

// 表格列
export default [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 73,
    render(text) {
      return text + 1;
    },
  },
  {
    title: '应收日期',
    dataIndex: 'shouldReceiveDate',
    key: 'shouldReceiveDate',
    align: 'center',
    render(text) {
      return moment(text, 'X').format('YYYY-MM-D');
    },
  },
  {
    title: '摘要',
    dataIndex: 'remark',
    key: 'remark',
    align: 'center',
    width: 184,
    ellipsis: true,
  },
  {
    title: '应收金额',
    dataIndex: 'shouldReceiveMoney',
    key: 'shouldReceiveMoney',
    align: 'center',
    render(text) {
      return text;
    },
  },
  {
    title: '已收金额',
    dataIndex: 'receivedMoney',
    key: 'receivedMoney',
    align: 'center',
    render(text) {
      return text;
    },
  },
  {
    title: '未收金额',
    dataIndex: 'unReceivedMoney',
    key: 'unReceivedMoney',
    align: 'center',
    render(text) {
      return text;
    },
  },
];
