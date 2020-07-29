// 建账 > excel账套
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { util } from 'nuijs';
import { Form, Row, Col, Input, message, Select, Button } from 'antd';
import { dictionary, judgeVatType } from '@pages/custom/utils';
import { parentIndustry } from '@utils/industry';
import ImportFileIcon from '../../ImportFileIcon';
import SubjectTemplate from '../SubjectTemplate'; // 会计科目
import importStatus from '../ImportStatus';
import Bookeeper from '../../Bookeeper';
import Style from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    sm: { span: 6 },
  },
  wrapperCol: {
    sm: { span: 18 },
  },
};
const layout = {
  labelCol: {
    sm: { span: 3 },
  },
  wrapperCol: {
    sm: { span: 21 },
  },
};
@Form.create({
  onValuesChange(props, changedFields) {
    const { industryTypeParent } = changedFields;
    if (industryTypeParent) {
      props.form.resetFields(['kjkm']);
    }
    // if (vatType || vatType === 0) {
    props.dispatch({
      type: 'updateState',
      payload: {
        currRecord: { ...props.currRecord, ...changedFields },
      },
    });
    // }
  },
})
class ExcelAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      fileName: '', // 文件名称
    };
  }

  // 保存excel建账
  save = () => {
    const {
      form: { validateFields },
      dispatch,
    } = this.props;
    const { fileList } = this.state;
    validateFields(async (err, values) => {
      if (!err) {
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('file', file);
        });
        const subData = { ...values };
        Object.keys(subData).forEach((item) => {
          if (item !== 'file') {
            formData.append(item, subData[item]);
          }
        });
        dispatch({
          type: '$createExcelAccount',
          payload: formData,
        }).then((res) => {
          if (res.status === 200) {
            const { taskId } = res.data;
            importStatus({
              subtitle: '文件正在上传',
              msg: '当前文件上传进度为',
              taskId,
              success: () => {
                dispatch({
                  type: 'updateState',
                  payload: {
                    accountVisible: false,
                  },
                });
                dispatch({
                  type: '$serviceCustomerList',
                });
              },
            });
          } else if (res.status === 300) {
            if (res.data) {
              dispatch({
                type: 'updateState',
                payload: {
                  accountVisible: false,
                  excelFailVisible: true,
                  excelFailPath: res.data.path,
                  excelFailData: subData,
                },
              });
            }
            message.error(res.message);
          } else {
            message.error(res.message);
          }
        });
      }
    });
  };

  cancel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        accountVisible: false,
      },
    });
  };

  // 下载模板
  downExcel = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields((err, values) => {
      const data = { ...values };
      let param = '';
      Object.keys(data).forEach((item) => {
        if (item !== 'file' && item !== 'kjkm') {
          param += `${item}=${data[item]}&`;
        }
      });
      param = encodeURI(param.substring(0, param.length - 1));
      util.location(`${basePath}jz/cloud/forwardInterface/exportTemplate.do?${param}`, '_blank');
    });
  };

  render() {
    const {
      form,
      currRecord: { bookkeepingAccounting, customerId, vatType, customerName, industryTypeParent },
    } = this.props;
    const { getFieldDecorator } = form;
    const { isVatType, kjkmInitValue } = judgeVatType(vatType, industryTypeParent);
    const { fileList, fileName } = this.state;
    // // 会计科目默认值  当纳税性质为空时，默认小企业会计准则-小规模纳税人(4) 当纳税性质有值时，默认小企业会计准则-纳税性质值(0,4)
    // const isVatType = (vatType || vatType === 0) && vatType !== -1; // 纳税性质是否存在(一般纳税人为0)
    // const kjkmInitValue = isVatType ? [0, 4][vatType] : 4;

    return (
      <Form {...formItemLayout}>
        {getFieldDecorator('creator', {
          initialValue: bookkeepingAccounting,
        })(<Input type="hidden" />)}
        {getFieldDecorator('accId', {
          initialValue: customerId,
        })(<Input type="hidden" />)}
        <FormItem label="账套名称" {...layout}>
          {getFieldDecorator('accountName', {
            initialValue: customerName || '',
            rules: [
              {
                required: true,
                message: '请输入账套名称',
              },
            ],
          })(<Input placeholder="请输入账套名称" maxLength={30} autoComplete="off" />)}
        </FormItem>
        <Row gutter={12}>
          <Col span={12}>
            <FormItem label="纳税性质">
              {getFieldDecorator('vatType', {
                initialValue: isVatType ? vatType : 1,
                rules: [
                  {
                    required: true,
                    message: '请选择纳税性质',
                  },
                ],
              })(
                <Select placeholder="请选择纳税性质">
                  {dictionary.taxType.list.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="行业类型">
              {getFieldDecorator('industryTypeParent', {
                initialValue: industryTypeParent,
              })(
                <Select
                  placeholder="请选择行业类型"
                  allowClear
                  showSearch
                  filterOption={(inputValue, option) => {
                    return option.props.value.indexOf(inputValue) > -1;
                  }}
                >
                  {parentIndustry.map((item) => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <FormItem label="会计科目">
              {getFieldDecorator('kjkm', {
                initialValue: kjkmInitValue,
                rules: [
                  {
                    required: true,
                    message: '请选择会计科目',
                  },
                ],
              })(
                <SubjectTemplate
                  type="3"
                  form={form}
                  vatType={isVatType ? vatType : 1}
                  industryTypeParent={industryTypeParent}
                  accounting="accountType"
                />,
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <Form.Item label="记账会计">
              {getFieldDecorator('creator', {
                initialValue: bookkeepingAccounting || undefined,
                rules: [
                  {
                    required: true,
                    message: '请选择记账会计',
                  },
                ],
              })(<Bookeeper />)}
            </Form.Item>
          </Col>
        </Row>

        {/* <FormItem label="核算类型" {...layout}>
          <Checkbox.Group options={options} onChange={this.onChange} />
        </FormItem>
        <div className={Style['m-state']}>
          <h3>导入Excel模板</h3>
          <div>
            为确保导入数据的准确性，请根据模板格式导入哦！
            <a onClick={this.downExcel}>下载Excel建账模板.xls</a>
          </div>
        </div> */}

        <FormItem
          label=""
          wrapperCol={{
            sm: { span: 24 },
          }}
          className={Style['m-fileItem']}
        >
          {getFieldDecorator('file', {
            initialValue: fileName,
            rules: [
              {
                required: true,
                message: '请选择文件',
              },
            ],
          })(
            <ImportFileIcon
              fileName={fileName}
              fileList={fileList}
              setData={(data) => this.setState(data)}
              form={form}
              downExcel={this.downExcel}
            />,
          )}
        </FormItem>
        <div className="f-tac">
          <Button className="e-mr12" onClick={this.cancel}>
            取消
          </Button>
          <Button type="primary" onClick={this.save}>
            保存
          </Button>
        </div>
      </Form>
    );
  }
}
export default connect(({ currRecord }) => ({ currRecord }))(ExcelAccount);
