import React, { PureComponent, Component } from 'react';
import { Form, Spin } from 'antd';
import { connect } from 'nuomi';
import SearchInput from '@components/SearchInput';
import MultiTreeSelect from '@components/MultiTreeSelect';
import ServiceType from '../ServiceType';
import Bookeeper from '../Bookeeper';

const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

const wrapperStyle = {
  width: 420,
  paddingTop: 18,
};

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
    inputValue: '',
  };
  }

  componentWillReceiveProps(nextP) {
    const { query } = this.props;
    // if (query !== nextP.query) {
    this.setState({
      inputValue: this.getValue(this.getSearchData(nextP.query, nextP)),
    });
    // }
  }

  onSearch = (data, searchData) => {
    const { dispatch, query } = this.props;
    const queryParam = searchData.length
      ? {
          ...query,
          ...data,
        }
      : { ...data };
    dispatch({
      type: 'updateState',
      payload: {
        query: queryParam,
      },
    });
    dispatch({
      type: '$serviceCustomerList',
      payload: {
        ...queryParam,
        current: 1,
      },
    });
  };

  // 获取搜索值，填充至输入框
  getSearchData = (data, nextP) => {
    const {
      deptList,
      bookeepers,
      serviceTypeList,
      accountAssistant,
      taxReporter,
      drawerList,
      customAdviser,
      allEmployeeList,
    } = nextP || this.props;
    const searchData = [];
    // 获取会计助理、报税会计等树选中的名字
    /**
     *
     * @param {*array} treeData  树结构数据
     * @param {*array} matchArr  选中值的value数组
     * @param {*array} nameArr   返回的名称数组，默认值为[]
     */
    const getNames = (treeData, matchArr, nameArr = [], flag = true) => {
      const treeArr = [...treeData];
      // 处理在树结构中没有的数据，因角色变换等原因导致
      flag &&
        matchArr &&
        matchArr.forEach((v) => {
          if (JSON.stringify(treeData).indexOf(v) === -1) {
            allEmployeeList.forEach(({ realName, staffId }) => {
              if (staffId === v) {
                treeArr[0] &&
                  treeArr[0].children &&
                  treeArr[0].children.push({
                    name: realName,
                    code: staffId,
                    value: staffId,
                    children: [],
                    style: { display: 'none' },
                  });
              }
            });
          }
        });
      treeArr.forEach((item) => {
        if (item.children && item.children.length) {
          getNames(item.children, matchArr, nameArr, false);
        }
        // 部门对应的字段是deptId
        if (matchArr.includes(item.value) || matchArr.includes(item.deptId)) {
          nameArr.push(item.name);
        }
      });
      return nameArr.join(',');
    };
    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (value && value.length) {
        switch (key) {
          case 'serviceTypeValue':
            searchData.push({
              title: '服务类型',
              text: []
                .concat(value)
                .map(
                  (ele) =>
                    serviceTypeList.find((item) => item.companyServiceTypeValue === ele)
                      .companyServiceTypeName,
                ),
            });
            break;
          case 'deptIds':
            searchData.push({
              title: '部门',
              text: getNames(deptList, [].concat(value)),
            });
            break;
          case 'bookkeepingAccounting': {
            const bookeepersArr = [...bookeepers];
            value &&
              value.forEach((v) => {
                if (JSON.stringify(bookeepers).indexOf(v) === -1) {
                  allEmployeeList.forEach(({ realName, staffId }) => {
                    if (staffId === v) {
                      bookeepersArr.push({
                        realName,
                        staffId,
                      });
                    }
                  });
                }
              });
            searchData.push({
              title: '记账会计',
              text: []
                .concat(value)
                .map(
                  (ele) =>
                    bookeepersArr.find((item) => item.staffId === ele) &&
                    bookeepersArr.find((item) => item.staffId === ele).realName,
                ),
            });
            break;
          }

          case 'accountingAssistant':
            searchData.push({
              title: '会计助理',
              text: getNames(accountAssistant, [].concat(value)),
            });
            break;
          case 'taxReportingAccounting':
            searchData.push({
              title: '报税会计',
              text: getNames(taxReporter, [].concat(value)),
            });
            break;
          case 'drawer':
            searchData.push({
              title: '开票员',
              text: getNames(drawerList, [].concat(value)),
            });
            break;
          case 'customerConsultant':
            searchData.push({
              title: '客户顾问',
              text: getNames(customAdviser, [].concat(value)),
            });
            break;
          default:
            break;
        }
      }
    });
    return searchData;
  };

  getValue = (searchData) => {
    const values = [];
    if (searchData.length) {
      searchData.forEach((ele) => {
        const text = Array.isArray(ele.text) ? ele.text.join('、') : ele.text;
        if (text) {
          values.push(`${ele.title}：${text}`);
        }
      });
      return values.join('；');
    }
    // return name;
  };

  getContent = ({ getFieldDecorator }) => {
    const {
      deptList,
      serviceTypeList,
      accountAssistant,
      allEmployeeList,
      taxReporter,
      drawerList,
      customAdviser,
      query,
    } = this.props;
    return (
      <div style={wrapperStyle}>
        <Form.Item label="服务类型" {...formItemLayout}>
          {getFieldDecorator('serviceTypeValue', {
            initialValue: query.serviceTypeValue,
          })(<ServiceType isLink={false} serviceTypeList={serviceTypeList} />)}
        </Form.Item>
        <Form.Item label="按照部门" {...formItemLayout}>
          {getFieldDecorator('deptIds', {
            initialValue: query.deptIds || [],
          })(
            <MultiTreeSelect
              treeData={deptList}
              val="deptId"
              showMode={false}
              searchPlaceholder="请选择部门"
            />,
          )}
        </Form.Item>
        <Form.Item label="记账会计" {...formItemLayout}>
          {getFieldDecorator('bookkeepingAccounting', {
            initialValue: query.bookkeepingAccounting,
          })(<Bookeeper mode="multiple" />)}
        </Form.Item>
        <Form.Item label="会计助理" {...formItemLayout}>
          {getFieldDecorator('accountingAssistant', {
            initialValue: query.accountingAssistant,
          })(
            <MultiTreeSelect
              treeData={accountAssistant}
              allEmployeeList={allEmployeeList}
              searchPlaceholder="请选择会计助理"
            />,
          )}
        </Form.Item>
        <Form.Item label="报税会计" {...formItemLayout}>
          {getFieldDecorator('taxReportingAccounting', {
            initialValue: query.taxReportingAccounting,
          })(<MultiTreeSelect treeData={taxReporter} searchPlaceholder="请选择报税会计" />)}
        </Form.Item>
        <Form.Item label="开票员" {...formItemLayout}>
          {getFieldDecorator('drawer', {
            initialValue: query.drawer,
          })(<MultiTreeSelect treeData={drawerList} searchPlaceholder="请选择开票员" />)}
        </Form.Item>
        <Form.Item label="客户顾问" {...formItemLayout}>
          {getFieldDecorator('customerConsultant', {
            initialValue: query.customerConsultant,
          })(<MultiTreeSelect treeData={customAdviser} searchPlaceholder="请选择客户顾问" />)}
        </Form.Item>
      </div>
    );
  };

  moreChange = (visible, form) => {
    if (!visible) {
      return false;
    }
    form.resetFields();
  };

  render() {
    const { inputValue } = this.state;
    return (
      <SearchInput
        name="customerName"
        autoComplete="off"
        style={{ width: 350 }}
        placeholder="请输入客户名称/客户编码搜索"
        // getValue={inputValue}
        value={inputValue}
        getValue={this.getValue}
        getContent={this.getContent}
        getSearchData={this.getSearchData}
        onSearch={this.onSearch}
        moreChange={this.moreChange}
        defaultValue={inputValue}
      />
    );
  }
}

export default connect(
  ({
    deptList,
    bookeepers,
    query,
    accountAssistant,
    taxReporter,
    drawerList,
    customAdviser,
    serviceTypeList,
    allEmployeeList,
  }) => ({
    deptList,
    bookeepers,
    query,
    accountAssistant,
    taxReporter,
    drawerList,
    customAdviser,
    serviceTypeList,
    allEmployeeList,
  }),
)(Search);
