import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import pubData from 'data';
import { SuperTable } from '@components';
import Operate from './Operate';
import { dictionary, openUrl, role, storeForUser } from '../../utils';
import Total from './Total';
import EditAccount from '../EditAccount';
import './style.less';

const pageSizeOptions = ['20', '50', '100'];

const showTotal = (total) => `共${total}页`;

const GREEN = '#59D49E';
const RED = '#f00';

const Cell = (props) => {
  const { title, children, color, open, onClick } = props;
  const style = {};
  if (color) {
    style.color = color;
  }
  return (
    <span className="table-cell" title={title} style={style}>
      {open !== undefined ? (
        <a className={open !== false ? 'table-cell-edit' : 'table-cell-normal'} onClick={onClick}>
          {children}
        </a>
      ) : (
        children
      )}
    </span>
  );
};

const colors = {
  '0': RED,
  '1': GREEN,
};

const colors2 = {
  '1': GREEN,
  '2': '#FF6400',
  '3': RED,
};

class Table extends PureComponent {
  constructor(props) {
    super(props);
    const {
      sorters: { sort },
    } = this.props;
    this.columns = [
      {
        title: '编号',
        dataIndex: 'index',
        align: 'center',
        width: 55,
      },
      {
        title: '账套名称',
        dataIndex: 'accountName',
        className: 'th-center accountName',
        width: 300,
        render: (text, data) => (
          <>
            {!!data.isNew && <span className="newCustomer-img" />}
            <span className="f-db f-pr" style={{ paddingRight: this.getPaddingRight(data) }}>
              <Cell title={text} open={false} onClick={() => openUrl(data, 'home')}>
                {text}
              </Cell>
              <em className="f-pa" style={{ right: 0, top: 7 }}>
                {!!data.isLocking && (
                  <i className="iconfont e-ml8" style={{ color: '#FAC420' }} title="已锁定">
                    &#xeb1f;
                  </i>
                )}
                {!!data.transfer && <i className="icon-jiao e-ml8" title="交接中" />}
              </em>
            </span>
          </>
        ),
      },
      {
        title: '客户名称',
        dataIndex: 'customerName',
        className: 'th-center',
        width: 200,
      },
      {
        title: '账套进度',
        dataIndex: 'schedule',
        width: 100,
        align: 'center',
        render: (text, record) => {
          const { enabledReview } = this.props;
          let path = '';
          // 如果返回的是"未结账"，且未开启审核，且已有凭证，就显示“待结账”
          const realValue = text === 5 && !enabledReview && record.voucherCount > 0 ? 6 : text;
          // 待审核（已停用账套不能审核）
          if (realValue === 5 && enabledReview && !record.status) {
            path = 'voucher/list?verifyStatus=0';
          }
          // 待结账
          else if (realValue === 6 && !record.status) {
            path = 'terminal/checkout';
          }
          return (
            <Cell
              color={realValue === 7 ? GREEN : ''}
              open={path ? true : undefined}
              onClick={() => openUrl(record, path)}
            >
              {dictionary.schedules.map[realValue] || '未建账'}
            </Cell>
          );
        },
      },
      {
        title: '纳税性质',
        dataIndex: 'vatType',
        className: 'th-center',
        align: 'center',
        width: 120,
        render: (text) => <Cell>{dictionary.taxType.map[text]}</Cell>,
      },
      {
        title: '增值税申报类型',
        dataIndex: 'taxType',
        className: 'th-center',
        align: 'center',
        width: 120,
        render: (text) => <Cell>{text === 0 ? '非零申报' : text === 1 ? '零申报' : '-'}</Cell>,
      },
      {
        title: '结账状态',
        dataIndex: 'isCheckOut',
        width: 100,
        align: 'center',
        render: (text) => (
          <Cell color={colors[text]}>{dictionary.isCheckOut.map[text] || '未开始'}</Cell>
        ),
      },
      {
        title: '审核状态',
        dataIndex: 'reviewStatus',
        width: 100,
        align: 'center',
        render: (text) => {
          return <Cell color={colors[text]}>{dictionary.reviewStatus.map[text] || '未开始'}</Cell>;
        },
      },
      {
        title: '建账期间',
        dataIndex: 'createPeriod',
        sortField: 'sort',
        align: 'center',
        sorter: true,
        defaultSortOrder: 'descend',
        ...([0, 1].includes(sort) ? { sortOrder: sort === 0 ? 'descend' : 'ascend' } : {}),
        width: 100,
        onHeaderCell: (col) => ({
          // 处理antd table排序无法获取默认状态问题
          onClick: (e) => {
            this.activeSortField = 'sort';
          },
        }),
        render: (text) => <Cell>{text}</Cell>,
      },
      {
        title: '当前账期',
        dataIndex: 'currentPeriod',
        align: 'center',
        width: 100,
        render: (text) => <Cell>{text}</Cell>,
      },
    ];

    // if (role === 0 || role === 1) {
    this.columns.push({
      title: '会计助理',
      dataIndex: 'accountingAssistant',
      className: 'th-center',
      width: 160,
      render: (text) => <Cell title={text}>{text}</Cell>,
    });
    // }

    // if (role !== 1 || pubData.get('userInfo_type') === '2') {
    this.columns.push({
      title: '记账会计',
      dataIndex: 'bookkeepingAccounting',
      className: 'th-center',
      width: 160,
      render: (text) => <Cell title={text}>{text}</Cell>,
    });
    // }

    if (role !== 3) {
      this.columns.push({
        title: '风险检测',
        dataIndex: 'checkStatus',
        align: 'center',
        width: 100,
        render: (text) => (
          <Cell color={colors2[text]}>{dictionary.checkStatus.map[text] || '未开始'}</Cell>
        ),
      });
    }

    this.state = {
      // isShowEditModal: false,
      // editId: null,
      // vatType: '',
      ...this.getColData(this.props.columnSource),
    };
    this.activeSortField = null;
  }

  getPaddingRight = (data) => {
    let value = 0;
    if (data.isLocking) {
      value += 24;
    }
    if (data.transfer) {
      value += 24;
    }
    return value;
  };

  getColData(columnSource) {
    const { sorters } = this.props;
    const { sortByCode } = sorters;
    let columns = [];
    let x = 140;
    const operateCol = {
      title: '操作',
      fixed: 'right',
      width: role !== 3 ? 170 : 130,
      align: 'center',
      className: 'operate-cell',
      dataIndex: 'operate',
      render: (text, data) => <Operate data={data} onEdit={this.onEdit} />,
    };
    const source = columnSource.filter((ele) => ele.selected !== false);

    x += operateCol.width;

    source.forEach((ele) => {
      const col = this.columns.find((i) => i.title === ele.key);
      if (ele.type) {
        col.dataIndex = ele.type;
      }
      if (col) {
        columns.push(col);
      }
    });

    const lastIndex = columns.length - 1;

    const sortOrder = [0, 1].includes(sortByCode)
      ? { sortOrder: sortByCode === 0 ? 'descend' : 'ascend' }
      : { sortOrder: false };
    columns = columns.map((ele, i) => {
      if (ele.title === '编号') {
        // 序号
        if (ele.dataIndex === 'index') {
          ele = {
            ...ele,
            width: 55,
            sorter: false,
          };
        }
        // 客户编码
        else {
          ele = {
            ...ele,
            width: 120,
            sortField: 'sortByCode',
            sorter: true,
            ...sortOrder,
            // defaultSortOrder:'descend',
            onHeaderCell: (col) => ({
              // 处理antd table排序无法获取默认状态问题
              onClick: (e) => {
                this.activeSortField = 'sortByCode';
              },
            }),
          };
        }
      }
      // 前五列固定（需求已经废弃）
      // if (columns.length > 4 && i < 4) {
      //   ele = {
      //     ...ele,
      //     fixed: 'left',
      //   };
      // }
      // 最后一列不能设置宽度
      if (i === lastIndex) {
        ele = {
          ...ele,
          width: 'auto',
        };
      }
      x += ele.width > 0 ? ele.width : 0;
      return ele;
    });

    columns.push(operateCol);

    return {
      columns,
      x,
    };
  }

  onRow = (data) => {
    return {
      onDoubleClick: () => {
        openUrl(data);
      },
    };
  };

  componentWillReceiveProps(nextProps) {
    const { columnSource } = nextProps;
    if (columnSource !== this.props.columnSource) {
      this.setState(this.getColData(columnSource));
    }
  }

  selectionChange = (selectedRowKeys, selectedRows) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  };

  tableTitle = () => {
    return <Total />;
  };

  change = (pagination, filters, sorter) => {
    const { dispatch } = this.props;
    const { columns } = this.state;
    storeForUser('account_table_pagesize', pagination.pageSize);
    // 该回调会早于表头绑定的点击事件回调先执行，因此加定时器解决该问题
    setTimeout(() => {
      const { sorters } = this.props;
      const data = {
        ...pagination,
        sorters,
      };
      if (this.activeSortField) {
        this.activeSortField === 'sort' ? delete data.sorters.sortByCode : delete data.sorters.sort;
        data.sorters[this.activeSortField] = sorter.order
          ? sorter.order === 'ascend'
            ? 1
            : 0
          : undefined;
        this.columns = columns.map((ele) => {
          if (ele.sortField === this.activeSortField) {
            ele.sortOrder = sorter.order || false;
          } else {
            ele.sortOrder = false;
          }
          return ele;
        });
      }
      this.setState(this.getColData(this.props.columnSource));
      dispatch({
        type: 'updateState',
        payload: data,
      });
      dispatch({
        type: 'query',
      });
      // 缓存排序
      localStorage.setItem('ACCOUNT_COLUMN_SORT', JSON.stringify(data.sorters));
      this.activeSortField = null;
    });
  };

  // 编辑账套
  onEdit = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateEditAccount',
      payload: {
        visible: true,
        record,
      },
    });
  };

  render() {
    const {
      selectedRowKeys,
      total,
      pageSize,
      current,
      sorters,
      columnSource,
      totalData,
      enabledReview,
      ...rest
    } = this.props;
    let { columns, x } = this.state;

    // 不允许审核时隐藏 审核状态 列
    if (!enabledReview) {
      columns = columns.filter((item) => item.title !== '审核状态');
    }
    return (
      <>
        <SuperTable
          title={this.tableTitle}
          styleName="account-table"
          rowSelection={{
            columnWidth: '40px',
            selectedRowKeys,
            onChange: this.selectionChange,
          }}
          locale={{
            emptyText: '暂无数据',
          }}
          onRow={this.onRow}
          onChange={this.change}
          pagination={{
            showSizeChanger: true,
            current,
            total,
            pageSize,
            pageSizeOptions,
            showTotal: (total) => `共${total}条`,
          }}
          scroll={{
            x,
          }}
          {...rest}
          columns={columns}
        />
        <EditAccount />
      </>
    );
  }
}

export default connect(
  ({
    columnSource,
    current,
    total,
    pageSize,
    loading,
    dataSource,
    sorters,
    selectedRowKeys,
    enabledReview,
  }) => ({
    columnSource,
    current,
    total,
    pageSize,
    loading,
    dataSource,
    sorters,
    selectedRowKeys,
    enabledReview,
  }),
)(Table);
