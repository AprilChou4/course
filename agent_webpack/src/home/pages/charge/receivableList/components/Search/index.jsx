import React, { useEffect } from 'react';
import { Form, Checkbox, Select, Input, Row, Col } from 'antd';
import { connect } from 'nuomi';
import { SearchInput, MultiTreeSelect, ServiceItem, NumberInput } from '@components';
// import MultiTreeSelect from '@components/MultiTreeSelect';
// import ServiceItem from '@components/ServiceItem';
import dictionary from '../../../utils';
import './style.less';

const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};

const formItemStyle = {
  marginBottom: 4,
};

const checkboxItemStyle = {
  width: 90,
  marginTop: 6,
};

const wrapperStyle = {
  width: 432,
  padding: '20px 0',
};

// 人民币符号样式
const moneySignStyle = {
  color: '#323232',
};

const Search = ({ tableConditions, deptList, staffList, chargeItemList, dispatch }) => {
  const filterOption = (inputValue, { props: { children } }) => {
    const value = inputValue.trim();
    if (children.indexOf(value) !== -1) {
      return true;
    }
  };

  const onSearch = async (data, searchData) => {
    // 查询清空后，原来的条件没有清空
    const leftQuery = {
      current: tableConditions.current,
      pageSize: tableConditions.pageSize,
    };
    const { createBillDateMin, createBillDateMax } = tableConditions;
    if (createBillDateMin) {
      leftQuery.createBillDateMin = createBillDateMin;
    }
    if (createBillDateMax) {
      leftQuery.createBillDateMax = createBillDateMax;
    }
    dispatch({
      type: 'updateState',
      payload: {
        tableConditions: leftQuery,
      },
    });
    await dispatch({
      type: 'updateCondition',
      payload: data,
    });
  };

  const getSearchData = (data) => {
    const searchData = [];
    // 获取部门等树选中的名字
    /**
     *
     * @param {*array} treeData  树结构数据
     * @param {*array} matchArr  选中值的value数组
     * @param {*array} nameArr   返回的名称数组，默认值为[]
     */
    const getNames = (treeData, matchArr, nameArr = []) => {
      const treeArr = [...treeData];
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
    Object.keys(data).forEach((i) => {
      const value = data[i];
      if (value) {
        switch (i) {
          case 'receiveStatus':
            searchData.push({
              title: dictionary.receiveStatus.title,
              text: []
                .concat(value)
                .map(
                  (ele) => dictionary.receiveStatus.list.find((item) => item.value === ele).name,
                ),
            });
            break;
          case 'sourceBillTypes':
            searchData.push({
              title: dictionary.sourceBillType.title,
              text: []
                .concat(value)
                .map(
                  (ele) => dictionary.sourceBillType.list.find((item) => item.value === ele).name,
                ),
            });
            break;
          case 'serviceItemIds':
            searchData.push({
              title: '服务项目',
              text: []
                .concat(value)
                .map((ele) => chargeItemList.find((item) => item.chargingItemId === ele).itemName),
            });
            break;
          case 'customerName':
            searchData.push({
              title: '客户名称',
              text: value,
            });
            break;
          case 'receiveMoneyMax':
            searchData.push({
              title: '应收金额',
              text: value,
            });
            break;
          case 'receiveMoneyMin':
            searchData.push({
              title: '应收金额',
              text: value,
            });
            break;

          case 'deptId':
            searchData.push({
              title: '部门',
              text: getNames(deptList, [].concat(value)),
            });
            break;
          case 'businessStaffId':
            searchData.push({
              title: '业务员',
              text: []
                .concat(value)
                .map((ele) => staffList.find((item) => item.staffId === ele).realName),
            });
            break;
          case 'createBillStaffId':
            searchData.push({
              title: '制单人',
              text: []
                .concat(value)
                .map((ele) => staffList.find((item) => item.staffId === ele).realName),
            });
            break;
          case 'srbNo':
            searchData.push({
              title: '单据编号',
              text: value,
            });
            break;
          default:
            break;
        }
      }
    });
    return searchData;
  };

  const getValue = (searchData) => {
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
    return tableConditions.name;
  };

  const getContent = ({ getFieldDecorator, setFieldsValue }) => {
    return (
      <div style={wrapperStyle} styleName="m-search">
        {/* 收款状态 */}
        <Form.Item label={dictionary.receiveStatus.title} {...formItemLayout} style={formItemStyle}>
          {getFieldDecorator('receiveStatus', {
            initialValue: tableConditions.receiveStatus,
          })(
            <Checkbox.Group>
              {dictionary.receiveStatus.list.map(({ value, name }) => (
                <Checkbox style={checkboxItemStyle} key={value} value={value}>
                  {name}
                </Checkbox>
              ))}
            </Checkbox.Group>,
          )}
        </Form.Item>
        {/* 源单类型 */}
        <Form.Item
          label={dictionary.receiveSourceBillType.title}
          {...formItemLayout}
          style={{ marginBottom: 8 }}
        >
          {getFieldDecorator('sourceBillTypes', {
            initialValue: tableConditions.sourceBillTypes,
          })(
            <Checkbox.Group>
              {dictionary.receiveSourceBillType.list.map(({ value, name }) => (
                <Checkbox style={checkboxItemStyle} key={value} value={value}>
                  {name}
                </Checkbox>
              ))}
            </Checkbox.Group>,
          )}
        </Form.Item>
        <Form.Item label="服务项目" {...formItemLayout}>
          {getFieldDecorator('serviceItemIds', {
            initialValue: tableConditions.serviceItemIds,
          })(<ServiceItem allowClear />)}
        </Form.Item>
        <Form.Item label="客户名称" {...formItemLayout}>
          {getFieldDecorator('customerName', {
            initialValue: tableConditions.customerName,
          })(<Input placeholder="请输入客户名称" autoComplete="off" allowClear />)}
        </Form.Item>
        <Form.Item label="应收金额" {...formItemLayout}>
          <Row>
            <Col span={11}>
              <Form.Item styleName="m-innerItem">
                {getFieldDecorator('receiveMoneyMin', {
                  initialValue: tableConditions.receiveMoneyMin,
                })(
                  <NumberInput
                    prefix={<span style={moneySignStyle}>￥</span>}
                    placeholder="0.00"
                    allowClear
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={2} style={{ textAlign: 'center' }}>
              —
            </Col>
            <Col span={11}>
              <Form.Item styleName="m-innerItem">
                {getFieldDecorator('receiveMoneyMax', {
                  initialValue: tableConditions.receiveMoneyMax,
                })(
                  <NumberInput
                    prefix={<span style={moneySignStyle}>￥</span>}
                    placeholder="0.00"
                    allowClear
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label="部门" {...formItemLayout}>
          {getFieldDecorator('deptId', {
            initialValue: tableConditions.deptId,
          })(
            <MultiTreeSelect
              treeData={deptList}
              val="deptId"
              showMode={false}
              placeholder="请选择部门"
              multiple={false}
              treeCheckable={false}
              showSearch
              getPopupContainer={() => document.body}
            />,
          )}
        </Form.Item>
        <Form.Item label="业务员" {...formItemLayout}>
          {getFieldDecorator('businessStaffId', {
            initialValue: tableConditions.businessStaffId,
          })(
            <Select placeholder="请选择业务员" filterOption={filterOption} showSearch allowClear>
              {staffList.map((ele) => (
                <Select.Option key={ele.staffId} value={ele.staffId}>
                  {ele.realName}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="制单人" {...formItemLayout}>
          {getFieldDecorator('createBillStaffId', {
            initialValue: tableConditions.createBillStaffId,
          })(
            <Select placeholder="请选择制单人" filterOption={filterOption} showSearch allowClear>
              {staffList.map((ele) => (
                <Select.Option key={ele.staffId} value={ele.staffId}>
                  {ele.realName}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="单据编号" {...formItemLayout}>
          {getFieldDecorator('srbNo', {
            initialValue: tableConditions.srbNo,
          })(<Input placeholder="请输入单据编号" autoComplete="off" allowClear />)}
        </Form.Item>
      </div>
    );
  };

  useEffect(() => {
    dispatch({
      type: 'getSearchOptions',
    });
  }, [dispatch]);

  return (
    <SearchInput
      name="customerName"
      className="e-ml12"
      styleName="m-collectSearch"
      autoComplete="off"
      style={{ width: 320 }}
      placeholder="请输入客户名称"
      getValue={getValue}
      getContent={getContent}
      getSearchData={getSearchData}
      onSearch={onSearch}
    />
  );
};

export default connect(({ tableConditions, staffList, deptList, chargeItemList }) => ({
  tableConditions,
  staffList,
  deptList,
  chargeItemList,
}))(Search);
