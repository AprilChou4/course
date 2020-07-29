import React from 'react';
import { Table, Button, Form, Input, Select, InputNumber, DatePicker } from 'antd';
import { connect } from 'nuomi';
import moment from 'moment';

import './style.less';

const { Option } = Select;
const MAX_NUMBER = 999999999.99;

const ShareholderForm = ({ isEditing, form, shareholderList, dispatch }) => {
  // 新增一条股东信息
  function onAdd() {
    const resultList = [...shareholderList, {}];
    dispatch({
      type: 'updateState',
      payload: {
        shareholderList: resultList,
      },
    });
  }

  // 删除一条股东信息
  function onRemove(key) {
    const currentList = form.getFieldValue('shareholderList');
    const resultList = currentList.filter((it, index) => index !== key);
    form.resetFields();
    dispatch({
      type: 'updateState',
      payload: {
        shareholderList: resultList,
      },
    });
  }

  const { getFieldDecorator } = form;
  const columns = [
    {
      title: '股东名称',
      dataIndex: 'shareholder',
      key: 'shareholder',
      fixed: 'left',
      width: 260,
      render: (text, record, index) => {
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].shareholder`, {
              initialValue: record.shareholder,
            })(
              <Input
                placeholder={isEditing ? '请输入股东名称' : ''}
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '股东类型',
      dataIndex: 'shareholderType',
      key: 'shareholderType',
      width: 160,
      render: (text, record, index) => {
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].shareholderType`, {
              initialValue: record.shareholderType || undefined,
            })(
              <Select
                placeholder={isEditing ? '请选择股东类型' : ''}
                allowClear
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <Option value={1}>自然人</Option>
                <Option value={2}>法人</Option>
              </Select>,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '证照/证件类型',
      dataIndex: 'shareholderCertificateType',
      key: 'shareholderCertificateType',
      width: 158,
      render: (text, record, index) => {
        const options = [
          { value: 1, label: '身份证' },
          { value: 2, label: '护照' },
          { value: 3, label: '军官证' },
          { value: 4, label: '税务登记证' },
          { value: 5, label: '营业执照' },
          { value: 6, label: '组织机构代码' },
        ];
        let list = options;
        if (record.shareholderType === 1) {
          list = options.slice(0, 3);
        } else if (record.shareholderType === 2) {
          list = options.slice(3);
        }
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].shareholderCertificateType`, {
              initialValue: record.shareholderCertificateType || undefined,
            })(
              <Select
                placeholder={isEditing ? '请选择证照/证件类型' : ''}
                allowClear
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                {list.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '证件/证照号码',
      dataIndex: 'certificateNum',
      key: 'certificateNum',
      width: 158,
      render: (text, record, index) => {
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].certificateNum`, {
              initialValue: record.certificateNum,
            })(
              <Input
                placeholder={isEditing ? '请输入证件/证照号码' : ''}
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '认缴额',
      width: 132,
      dataIndex: 'subscriptionAmount',
      key: 'subscriptionAmount',
      render: (text, record, index) => {
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].subscriptionAmount`, {
              initialValue: record.subscriptionAmount,
            })(
              <InputNumber
                max={MAX_NUMBER}
                placeholder="请输入认缴额"
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '实缴额',
      dataIndex: 'reallyInvestmentAmount',
      key: 'reallyInvestmentAmount',
      width: 132,
      render: (text, record, index) => {
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].reallyInvestmentAmount`, {
              initialValue: record.reallyInvestmentAmount,
            })(
              <InputNumber
                max={MAX_NUMBER}
                placeholder="请输入实缴额"
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '认缴出资方式',
      dataIndex: 'capitalContributionsType',
      key: 'capitalContributionsType',
      width: 160,
      render: (text, record, index) => {
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].capitalContributionsType`, {
              initialValue: record.capitalContributionsType,
            })(
              <Select
                placeholder="认缴出资方式"
                allowClear
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <Option value="货币">货币</Option>
                <Option value="实物">实物</Option>
                <Option value="知识产权">知识产权</Option>
                <Option value="土地使用权">土地使用权</Option>
                <Option value="其他财产">其他财产</Option>
              </Select>,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '认缴出资',
      dataIndex: 'capitalContributionsAmount',
      key: 'capitalContributionsAmount',
      width: 132,
      render: (text, record, index) => {
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].capitalContributionsAmount`, {
              initialValue: record.capitalContributionsAmount,
            })(
              <InputNumber
                max={MAX_NUMBER}
                placeholder="请输入认缴出资"
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '认缴出资日期',
      dataIndex: 'capitalContributionsDate',
      key: 'capitalContributionsDate',
      width: 160,
      render: (text, record, index) => {
        const initialValue = record.capitalContributionsDate
          ? moment(record.capitalContributionsDate)
          : null;
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].capitalContributionsDate`, {
              initialValue,
            })(<DatePicker placeholder={isEditing ? '认缴出资日期' : ''} disabled={!isEditing} />)}
          </Form.Item>
        );
      },
    },
    {
      title: '实缴出资方式',
      dataIndex: 'reallyInvestType',
      key: 'reallyInvestType',
      width: 160,
      render: (text, record, index) => {
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].reallyInvestType`, {
              initialValue: record.reallyInvestType,
            })(
              <Select
                placeholder="实缴出资方式"
                allowClear
                disabled={!isEditing}
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
              >
                <Option value="货币">货币</Option>
                <Option value="实物">实物</Option>
                <Option value="知识产权">知识产权</Option>
                <Option value="土地使用权">土地使用权</Option>
                <Option value="其他财产">其他财产</Option>
              </Select>,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '实缴出资额',
      dataIndex: 'reallyInvestAmount',
      key: 'reallyInvestAmount',
      width: 132,
      render: (text, record, index) => {
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].reallyInvestAmount`, {
              initialValue: record.reallyInvestAmount,
            })(
              <InputNumber
                max={MAX_NUMBER}
                placeholder="请输入实缴出资额"
                autoComplete="off"
                disabled={!isEditing}
              />,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: '实缴出资日期',
      dataIndex: 'reallyInvestDate',
      key: 'reallyInvestDate',
      width: 160,
      render: (text, record, index) => {
        const initialValue = record.reallyInvestDate ? moment(record.reallyInvestDate) : null;
        return (
          <Form.Item>
            {getFieldDecorator(`shareholderList[${index}].reallyInvestDate`, {
              initialValue,
            })(<DatePicker placeholder={isEditing ? '实缴出资日期' : ''} disabled={!isEditing} />)}
          </Form.Item>
        );
      },
    },
    {
      title: '操作',
      width: 80,
      fixed: 'right',
      render: (text, record, index) => (
        <Button type="link" onClick={() => onRemove(index)} disabled={!isEditing}>
          删除
        </Button>
      ),
    },
  ];

  const dataSource = shareholderList.map((item, index) => ({ ...item, key: index }));
  return (
    <dl className="form-block">
      <dt>股东信息</dt>
      <dd>
        <div styleName="shareholder-table-wrap">
          <Table
            className="shareholder-table"
            bordered
            dataSource={dataSource}
            pagination={false}
            columns={columns}
            scroll={{ x: 2000 }}
          />
        </div>
        {isEditing && (
          <Button type="link" onClick={onAdd} styleName="add-btn">
            +新增
          </Button>
        )}
      </dd>
    </dl>
  );
};

const mapStateToProps = ({ isEditing, shareholderList }) => ({
  isEditing,
  shareholderList,
});

export default connect(
  mapStateToProps,
  null,
  null,
  { withRef: true },
)(
  Form.create({
    onValuesChange(props, changedFields, allFields) {
      const resultList = props.shareholderList.map((item, index) => {
        const field = allFields.shareholderList[index];
        return {
          ...item,
          ...field,
          capitalContributionsDate: field.capitalContributionsDate
            ? field.capitalContributionsDate.format('YYYY-MM-DD')
            : undefined,
          reallyInvestDate: field.reallyInvestDate
            ? field.reallyInvestDate.format('YYYY-MM-DD')
            : undefined,
        };
      });
      props.dispatch({
        type: 'updateState',
        payload: {
          shareholderList: resultList,
        },
      });
    },
  })(ShareholderForm),
);
