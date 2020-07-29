import React, { useEffect } from 'react';
import { Form, Checkbox, Select } from 'antd';
import { connect } from 'nuomi';
import pubData from 'data';
import SearchInput from '@components/SearchInput';
import { dictionary, role } from '../../utils';
import './style.less';

// const operator = {
//   field: 'operator',
//   name: '记账会计',
// };

// const creator = {
//   field: 'creator',
//   name: '主管会计',
// };

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

const doubleCheckboxItemStyle = {
  width: 180,
};

const wrapperStyle = {
  width: 480,
};

const Search = ({ query, creators, operators, dispatch }) => {
  const filterOption = (inputValue, { props: { children } }) => {
    const value = inputValue.trim();
    if (children.indexOf(value) !== -1) {
      return true;
    }
  };

  const onSearch = async (data, searchData) => {
    if (Object.keys(data).length) {
      if (!searchData.length) {
        if (data.name !== undefined) {
          data.status = query.status;
        } else {
          data.name = query.name;
        }
      }
    }
    await dispatch({
      type: 'setQuery',
      payload: data,
    });
    dispatch({
      type: 'query',
      payload: true,
    });
  };

  const getSearchData = (data) => {
    const searchData = [];
    for (const i in data) {
      if (i !== 'status') {
        const value = data[i];
        if (value && value.length) {
          switch (i) {
            case 'creator':
              searchData.push({
                title: '主管会计',
                text: []
                  .concat(value)
                  .map((ele) => creators.find((item) => item.staffId === ele).realName),
              });
              break;
            case 'operator':
              searchData.push({
                title: '记账会计',
                text: []
                  .concat(value)
                  .map((ele) => operators.find((item) => item.staffId === ele).realName),
              });
              break;
            default:
              const source = dictionary[i];
              searchData.push({
                title: source.title,
                text: value.map((ele) => source.map[ele]),
              });
          }
        }
      }
    }
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
    return query.name;
  };

  const getContent = ({ getFieldDecorator }) => {
    return (
      <div style={wrapperStyle}>
        <div styleName="search-input-popover-title">
          {getFieldDecorator('status', {
            initialValue: query.status,
            valuePropName: 'checked',
          })(<Checkbox>展示已停止服务客户</Checkbox>)}
        </div>
        <Form.Item label={dictionary.schedules.title} {...formItemLayout} style={formItemStyle}>
          {getFieldDecorator('schedules', {
            initialValue: query.schedules,
          })(
            <Checkbox.Group>
              {dictionary.schedules.list.map(({ value, name }) => (
                <Checkbox style={checkboxItemStyle} key={value} value={value}>
                  {name}
                </Checkbox>
              ))}
            </Checkbox.Group>,
          )}
        </Form.Item>
        <Form.Item label={dictionary.taxType.title} {...formItemLayout}>
          {getFieldDecorator('taxType', {
            initialValue: query.taxType,
          })(
            <Checkbox.Group>
              {dictionary.taxType.list.map(({ value, name }) => (
                <Checkbox style={doubleCheckboxItemStyle} key={value} value={value}>
                  {name}
                </Checkbox>
              ))}
            </Checkbox.Group>,
          )}
        </Form.Item>
        <Form.Item label="记账会计" {...formItemLayout}>
          {getFieldDecorator('creator', {
            initialValue: query.creator,
          })(
            <Select
              style={{ width: 337 }}
              placeholder="请选择记账会计"
              filterOption={filterOption}
              mode="multiple"
            >
              {creators.map((ele) => (
                <Select.Option key={ele.staffId} value={ele.staffId}>
                  {ele.realName}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label="会计助理" {...formItemLayout}>
          {getFieldDecorator('operator', {
            initialValue: query.operator,
          })(
            <Select
              style={{ width: 337 }}
              placeholder="请选择会计助理"
              filterOption={filterOption}
              mode="multiple"
            >
              {operators.map((ele) => (
                <Select.Option key={ele.staffId} value={ele.staffId}>
                  {ele.realName}
                </Select.Option>
              ))}
            </Select>,
          )}
        </Form.Item>
        <Form.Item label={dictionary.reviewStatus.title} {...formItemLayout} style={formItemStyle}>
          {getFieldDecorator('reviewStatus', {
            initialValue: query.reviewStatus,
          })(
            <Checkbox.Group>
              {dictionary.reviewStatus.list.map(({ value, name }) => (
                <Checkbox style={doubleCheckboxItemStyle} key={value} value={value}>
                  {name}
                </Checkbox>
              ))}
            </Checkbox.Group>,
          )}
        </Form.Item>
        <Form.Item label={dictionary.isCheckOut.title} {...formItemLayout} style={formItemStyle}>
          {getFieldDecorator('isCheckOut', {
            initialValue: query.isCheckOut,
          })(
            <Checkbox.Group>
              {dictionary.isCheckOut.list.map(({ value, name }) => (
                <Checkbox style={doubleCheckboxItemStyle} key={value} value={value}>
                  {name}
                </Checkbox>
              ))}
            </Checkbox.Group>,
          )}
        </Form.Item>
        <Form.Item label={dictionary.businessPattern.title} {...formItemLayout}>
          {getFieldDecorator('businessPattern', {
            initialValue: query.businessPattern,
          })(
            <Checkbox.Group>
              {dictionary.businessPattern.list.map(({ value, name }) => (
                <Checkbox style={doubleCheckboxItemStyle} key={value} value={value}>
                  {name}
                </Checkbox>
              ))}
            </Checkbox.Group>,
          )}
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
      name="name"
      className="e-ml12"
      autoComplete="off"
      style={{ width: 320 }}
      placeholder="请输入账套名称"
      getValue={getValue}
      getContent={getContent}
      getSearchData={getSearchData}
      onSearch={onSearch}
    />
  );
};

export default connect(({ query, operators, creators }) => ({
  query,
  operators,
  creators,
}))(Search);
