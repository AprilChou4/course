// 建账 > 第三方建账 > 线下财务软件
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { Form, Row, Col, Button, Input, Progress, message, Select } from 'antd';
import { dictionary, judgeVatType } from '@pages/custom/utils';
import ShowConfirm from '@components/ShowConfirm';
import { parentIndustry } from '@utils/industry';
import SubjectTemplate from '../../SubjectTemplate';
import Bookeeper from '../../../Bookeeper';
import ImportFile from '../../../ImportFile';
import importStatus from '../../ImportStatus';
import Style from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const layout = {
  labelCol: {
    sm: { span: 3 },
  },
  wrapperCol: {
    sm: { span: 21 },
  },
};
class OffLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [], // 文件列
      fileName: '', // 文件名称
    };
  }

  componentDidMount() {}

  failModal = () => {
    ShowConfirm({
      width: 420,
      icon: null,
      type: 'warning',
      // okButtonProps: { type: null },
      className: Style['m-failModal'],
      content: (
        <div>
          <div>
            <i className="iconfont">&#xe64b;</i>文件数据处理失败
          </div>
          <Progress percent={0} strokeWidth={16} />
          <div>
            抱歉，您导入的账套数据处理失败，失败原因为“文件数据处理失败”,请检查文件或联系管理员
          </div>
        </div>
      ),
    });
  };

  // 保存
  save = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    const { fileList } = this.state;
    validateFields(async (err, values) => {
      if (!err) {
        const formData = new FormData();
        fileList.forEach((file) => {
          formData.append('file', file);
        });
        Object.keys(values).forEach((item) => {
          if (item !== 'file') {
            formData.append(item, values[item]);
          }
        });
        dispatch({
          type: '$offlineImportAccount',
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
              error: () => {
                this.failModal();
              },
            });
          } else if (res.status === 504) {
            message.error('导入文件过大，系统转后台执行任务，请稍后重新刷新页面查看');
          } else {
            message.error(res.message);
          }
        });
      }
    });
  };

  render() {
    const {
      form,
      currRecord: { customerId, bookkeepingAccounting, vatType, industryTypeParent },
    } = this.props;
    const { getFieldDecorator } = form;
    const { isVatType, kjkmInitValue } = judgeVatType(vatType, industryTypeParent);
    const { fileName, fileList } = this.state;
    return (
      <>
        {getFieldDecorator('accId', {
          initialValue: customerId,
        })(<Input type="hidden" />)}
        <FormItem label="导入模板" {...layout} className={Style['m-file']}>
          {getFieldDecorator('file', {
            initialValue: fileName,
            rules: [
              {
                required: true,
                message: '请选择文件',
              },
            ],
          })(
            <ImportFile
              fileName={fileName}
              fileList={fileList}
              setData={(data) => this.setState(data)}
              form={form}
            />,
          )}
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
                initialValue: industryTypeParent || undefined,
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
                // 系统预置和客户自定的value不一样
                initialValue: kjkmInitValue,
                rules: [
                  {
                    required: true,
                    message: '请选择会计科目',
                  },
                ],
              })(
                <SubjectTemplate
                  type="2"
                  form={form}
                  vatType={isVatType ? vatType : 1}
                  industryTypeParent={industryTypeParent}
                  accounting="accounting" // 会计科目值对应名称
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
        <div className="f-tac">
          <Button type="primary" onClick={this.save}>
            开始建账
          </Button>
        </div>
      </>
    );
  }
}
export default connect(({ currRecord }) => ({
  currRecord,
}))(OffLine);
