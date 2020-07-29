// 客户管理 > 服务中客户
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import SuperTable from '@components/SuperTable';
import Tag from '@components/Tag';
import FilterDropdown from '@components/FilterDropdown';
import { dictionary } from '../../../../utils';
import HeadSelect from './HeadSelect';
import HeadSearch from './HeadSearch';
import Operate from './Operate';
import Style from './style.less';

const pageSizeOptions = ['20', '50', '100'];
class InServiceTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...this.getColumns(props.columnSource, props.sorters),
    };
    this.columnsConfig = {
      customerName: {
        // 客户名称
        width: 272, // 18个汉字换行
        fixed: 'left',
        align: 'left',
        className: `f-ellipsis ${Style['m-customerName']}`,
        render: (text, record) => (
          <>
            {record.new ? <span className={Style['newCustomer-img']} /> : null}
            <span title={text}>{text}</span>
          </>
        ),
      },
      // 客户编码
      customerCode: {
        width: 150,
        sorter: true,
        onHeaderCell: () => ({
          // 处理antd table排序无法获取默认状态问题
          onMouseDown: () => {
            this.activeSortField = 'order';
          },
          // onClick: () => {
          //   this.activeSortField = 'order';
          // },
        }),
      },
      // 服务类型
      customerServiceRelationList: {
        // 服务类型
        render: (text) => (
          <div className={Style['m-serviceType']} title={text.map((item) => item.serviceTypeName)}>
            <Tag list={text.map((item) => item.serviceTypeName)} />
          </div>
        ),
      },
      // 统一社会信用代码
      unifiedSocialCreditCode: {
        width: 200,
      },
      // 纳税性质
      vatType: {
        title: () => {
          // 默认有纳税性质，从员工绩效跳转过来
          const {
            sorters: { vatType },
          } = this.props;
          // 不为空且不是全部
          const bool = vatType != null && vatType !== -1;
          const defaultSelectedKeys = bool ? [String(vatType)] : undefined;
          return (
            <FilterDropdown
              defaultSelectedKeys={defaultSelectedKeys}
              fieldName="纳税性质"
              list={[
                {
                  value: -1,
                  title: '全部',
                },
                {
                  value: 0,
                  title: '一般纳税人',
                },
                {
                  value: 1,
                  title: '小规模纳税人',
                },
              ]}
              menuClick={(data) => this.filter(data, 'vatType')}
            />
          );
        },
        className: 'f-pr',
        render: (text) => ['一般纳税人', '小规模纳税人'][text],
        width: 110,
      },
      // 行业类型
      industryType: {
        // 行业类型
        width: 170,
      },
      // 成品油企业 1是0否
      isProductOil: {
        width: 170,
        render: (text) => (text || text === 0) && ['否', '是'][text],
      },
      // 进出口企业 1是0否
      isForeignTrade: {
        width: 170,
        render: (text) => (text || text === 0) && ['否', '是'][text],
      },
      // 是否办理CA证书 1是0否
      isOpenCaCertificate: {
        width: 170,
        render: (text) => (text || text === 0) && ['否', '是'][text],
      },
      // 是否办理税盘 1是0否
      isOpenTaxPlate: {
        width: 170,
        render: (text) => (text || text === 0) && ['否', '是'][text],
      },
      // 申报类型（1零申报，0非零申报）
      taxType: {
        render: (text) => (text || text === 0) && ['非零申报', '零申报'][text],
      },
      // 申报周期1季报，2月报
      applyPeriod: {
        render: (text) => (text ? ['季报', '月报'][text - 1] : ''),
      },

      // 国税备案财务报表类型 财务报表类型1企业会计准则，2小企业会计准则，3企业会计制度,4民间非盈利组织会计制度
      financialStatementsType: {
        width: 270,
        render: (text) =>
          text
            ? ['企业会计准则', '小企业会计准则', '企业会计制度', '民间非盈利组织会计制度'][text - 1]
            : '',
      },

      // 注册登记类型
      registrationType: {
        width: 170,
        render: (text) => dictionary.registrationType.map[text],
      },
      // 法定代表人
      representative: {
        width: 170,
      },
      // 注册资本
      registeredCapital: {
        width: 80,
        align: 'right',
        render: (num) => (num >= 0 ? num : ''),
      },
      // 成立日期
      establishmentDate: {
        width: 170,
      },
      // 登记机关
      registrationAuthority: {
        width: 170,
      },
      // 记账状态
      accountingStatus: {
        title: () => (
          <FilterDropdown
            field="isCreate"
            fieldName="记账状态"
            list={[
              {
                value: -1,
                title: '全部',
              },
              {
                value: 0,
                title: '未建账',
              },
              {
                value: 1,
                title: '已建账',
              },
            ]}
            menuClick={(data) => this.filter(data, 'isCreate')}
          />
        ),
        className: 'f-pr',
        width: 150,
      },
      // 记账会计
      bookkeepingAccounting: {
        title: () => {
          const { bookeepers } = this.props;
          return <HeadSelect field="headbookkeep" fieldName="记账会计" searchList={bookeepers} />;
        },
      },
      // 开票员
      drawer: {
        title: () => {
          const { headDrawerList } = this.props;
          return <HeadSelect field="drawer" fieldName="开票员" searchList={headDrawerList} />;
        },
        className: 'theader-search',
      },
      // 专管员
      commissioner: {
        title: () => <HeadSearch field="commissioner" fieldName="专管员" />,
        className: 'theader-search',
      },
      // 创建时间
      createTime: {
        width: 120,
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const { columnSource, sorters } = this.props;
    if (nextProps.columnSource !== columnSource || nextProps.sorters !== sorters) {
      this.setState({
        ...this.getColumns(nextProps.columnSource, nextProps.sorters),
      });
    }
  }

  // 获取columns
  getColumns(columnSource, sorters) {
    const { order } = sorters;
    const { columnsConfig } = this;
    const showColumns = columnSource.filter((item) => item.selected);
    let x = 170 + 50;
    const customColum = showColumns.map((item, index) => {
      let option = {
        ...item,
        title: item.fieldName,
        dataIndex: item.fieldKey,
        align: 'center',
        width: 130,
        className: 'f-ellipsis',
        render: (text) => (
          <div className="f-ellipsis" title={text}>
            {text}
          </div>
        ),
        ...(columnsConfig[item.fieldKey] || {}),
      };
      // 固定列固定宽度,只有客户名称一列的时候，不固定列
      if (showColumns.length === 1) {
        delete option.fixed;
      }
      if (item.fieldKey === 'customerCode') {
        const sortOrder = ['customerCodeAsc', 'customerCodeDesc'].includes(order)
          ? { sortOrder: order === 'customerCodeDesc' ? 'descend' : 'ascend' }
          : { sortOrder: false };
        option = {
          ...option,
          sortField: 'order',
          ...sortOrder,
        };
      }
      // 非固定列要固定宽度,最后一列宽度自适应(不然会有间隙)
      if (index === showColumns.length - 1) {
        delete option.width;
      }
      x += option.width || 0;
      return option;
    });

    const columns = [
      {
        // 返回数据中没有这一栏，自己手动加上
        title: '序号',
        dataIndex: 'index',
        fixed: 'left',
        align: 'center',
        className: 'operate-cell',
        width: 60,
        render: (text, record, index) => index + 1,
      },
    ]
      .concat(customColum)
      .concat([
        {
          // 返回数据中没有这一栏，自己手动加上
          title: '操作',
          dataIndex: 'options',
          fixed: 'right',
          align: 'center',
          className: 'operate-cell',
          width: 170,
          render: (text, record) => <Operate record={record} />,
        },
      ]);
    x = x + 60 + 170;
    return {
      columns,
      x,
    };
  }

  // 头部纳税性质、记账状态等下拉筛选
  filter = ({ item }, field) => {
    const { dispatch } = this.props;
    const { value } = item.props.data;
    // 查询列表
    dispatch({
      type: '$serviceCustomerList',
      payload: {
        [field]: value,
      },
    });
  };

  // 计算table的scroll。为了保证table的scroll.x大于非固定列的宽度，否则会出现 列头与内容不对齐或出现列重复
  // calcScroll = (columns) => {
  //   const scroll = {};
  //   if (columns && columns.length !== 0) {
  //     const colWidthArr = columns.map((v) => v.width || 0);
  //     const sumWidth = colWidthArr.reduce((preValue, curValue) => preValue + curValue);
  //     scroll.x = sumWidth + 170 + 50;
  //   }
  //   return scroll;
  // };

  changeSelection = (selectedRowKeys, selectedRows) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        selectedRowKeys,
        selectedRows,
      },
    });
  };

  change = (pagination, filters, sorter) => {
    // 该回调会早于表头绑定的点击事件回调先执行，因此加定时器解决该问题
    // setTimeout(() => {
    const { dispatch, sorters } = this.props;
    const { current, pageSize } = pagination;
    const data = {
      current,
      pageSize,
      ...sorters,
    };
    if (this.activeSortField) {
      if (sorter.order) {
        data[this.activeSortField] =
          sorter.order === 'ascend' ? 'customerCodeAsc' : 'customerCodeDesc';
      } else {
        data[this.activeSortField] = undefined;
      }
    }
    dispatch({
      type: '$serviceCustomerList',
      payload: {
        ...data,
      },
    });
    // 缓存排序
    localStorage.setItem('CUSTOM_COLUMN_SORT', JSON.stringify({ order: data.order }));
    this.activeSortField = null;
    // });
  };

  render() {
    const {
      total,
      query,
      pageSize,
      current,
      totalData,
      importProgressVisible,
      selectedRowKeys,
      // loadings,
      sorters,
      ...rest
    } = this.props;
    // const columns = this.getColumns();
    const { x, columns } = this.state;
    // const scroll = this.calcScroll(columns);
    return (
      // <>
      //   {rest.dataSource.map((item) => (
      //     <div key={item.customerId}>{item.customerName}</div>
      //   ))}
      // </>
      <SuperTable
        className={Style['inservice-table']}
        onChange={this.change}
        pagination={{
          showSizeChanger: true,
          current,
          total,
          pageSize,
          pageSizeOptions,
          showTotal: (totalSize) => `共${totalSize}条`,
        }}
        locale={{
          emptyText: query.customerName ? `未找到与 "${query.customerName}"相关的客户` : '暂无数据',
        }}
        rowSelection={{
          selectedRowKeys,
          columnWidth: '40px',
          onChange: this.changeSelection,
        }}
        rowClassName={importProgressVisible ? 'tr-disabled' : ''}
        // loading={!!loadings.$serviceCustomerList || !!loadings.$getHeaderColumn}
        rowKey={(record) => record.customerId}
        scroll={{
          x,
        }}
        {...rest}
        columns={columns}
      />
    );
  }
}
export default connect(
  ({
    current,
    total,
    query,
    pageSize,
    dataSource,
    importProgressVisible,
    // loadings,
    columnSource,
    bookeepers,
    headDrawerList,
    selectedRowKeys,
    sorters,
  }) => ({
    current,
    total,
    query,
    pageSize,
    dataSource,
    // loadings,
    columnSource,
    importProgressVisible,
    bookeepers,
    headDrawerList,
    selectedRowKeys,
    sorters,
  }),
)(InServiceTable);
