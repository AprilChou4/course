// 建账 > 第三方建账 > 线上财务软件
import React, { Component } from 'react';
import { connect } from 'nuomi';
import { Form, Row, Col, Button, Input, Select } from 'antd';
import { dictionary, judgeVatType } from '@pages/custom/utils';
import { parentIndustry } from '@utils/industry';
import { trim } from 'lodash';
import SubjectTemplate from '../../SubjectTemplate';
import Bookeeper from '../../../Bookeeper';
import services from '../../../../services';
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
class Online extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currStep: 1, // 1=上一步 2=下一步
      softTypeList: [], // 软件类型
      accountList: [], // 账套列表
      prevInfo: {}, // 上一步数据，包括账号、密码、软件类型
    };
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    const softTypeList = await services.getImportWebType();
    const QIMINGXING_USERINFO = localStorage.getItem('QIMINGXING_USERINFO');
    const userid = window.top.curUserId;
    const info = QIMINGXING_USERINFO ? JSON.parse(QIMINGXING_USERINFO)[userid] : '';
    if (info) {
      // const info = JSON.parse(QIMINGXING_USERINFO)[userid];
      let accountList = [];
      dispatch({
        type: '$getInfoByAccount',
        payload: info,
      }).then((res) => {
        accountList = res || [];
        this.setState({
          softTypeList,
          currStep: 2,
          prevInfo: info,
          accountList,
        });
      });
    } else {
      this.setState({
        softTypeList,
      });
    }
  }

  // 下一步
  next = () => {
    const {
      dispatch,
      form: { validateFields },
    } = this.props;
    validateFields(async (errors, values) => {
      const param = { ...values, code: trim(values.code), password: trim(values.password) };
      let data = [];
      dispatch({
        type: '$getInfoByAccount',
        payload: param,
      }).then((res) => {
        data = res;
        this.setState({
          currStep: 2,
          accountList: data,
          prevInfo: values,
        });
      });
      let userinfo = localStorage.getItem('QIMINGXING_USERINFO');
      const userid = window.top.curUserId;
      const temp = {};
      if (!userinfo) {
        temp[userid] = param;
        userinfo = temp;
      } else {
        try {
          userinfo = JSON.parse(userinfo);
          userinfo[userid] = param;
        } catch (e) {
          temp[userid] = param;
          userinfo = temp;
        }
      }
      localStorage.setItem('QIMINGXING_USERINFO', JSON.stringify(userinfo));
    });
  };

  // 上一步
  prev = () => {
    this.setState({
      currStep: 1,
    });
  };

  // 保存
  save = () => {
    const {
      dispatch,
      form: { validateFields },
      currRecord: { customerId },
    } = this.props;
    const { prevInfo } = this.state;
    validateFields(async (err, values) => {
      if (!err) {
        const subData = { ...values, ...prevInfo, accId: customerId };
        subData.industryTypeParent = subData.industryTypeParent || '';
        // const { taskId } = await services.onlineImportAccount(subData);
        dispatch({
          type: '$onlineImportAccount',
          payload: {
            ...subData,
          },
        }).then((res) => {
          if (res) {
            const { taskId } = res;
            importStatus({
              subtitle: '正在读取远程数据',
              msg: '当前读取进度为',
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
          }
        });
      }
    });
  };

  render() {
    const {
      form,
      currRecord: { bookkeepingAccounting, vatType, industryTypeParent },
    } = this.props;
    const { getFieldDecorator } = form;
    const { isVatType, kjkmInitValue } = judgeVatType(vatType, industryTypeParent);
    const { currStep, softTypeList, accountList, prevInfo } = this.state;
    return (
      <>
        {currStep === 1 ? (
          <>
            <FormItem label="软件名称" {...layout}>
              {getFieldDecorator('type', {
                initialValue: prevInfo.type || undefined,
              })(
                <Select placeholder="请选择软件名称">
                  {softTypeList.map((item) => (
                    <Option value={item.id} key={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <Row gutter={12}>
              <Col span={12}>
                <FormItem label="账号">
                  {getFieldDecorator('code', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '请输入账号',
                      },
                    ],
                  })(<Input placeholder="请输入账号" autoComplete="off" allowClear />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="密码">
                  {getFieldDecorator('password', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '请输入密码',
                      },
                    ],
                  })(<Input.Password placeholder="请输入密码" password="false" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <FormItem label="&nbsp;" colon={false} {...layout}>
                <span className={Style['m-hint']}>
                  温馨提示：需要转换目前支持的软件，请先联系运维人员
                </span>
              </FormItem>
            </Row>
            <div className="f-tac">
              <Button type="primary" onClick={this.next}>
                下一步
              </Button>
            </div>
          </>
        ) : (
          <>
            <FormItem label="账号信息" {...layout}>
              {prevInfo.code}
              <Button type="primary" ghost className="f-fr" onClick={this.prev}>
                切换账号
              </Button>
            </FormItem>
            <FormItem label="账套列表" {...layout}>
              {getFieldDecorator('id', {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                    message: '请选择账套',
                  },
                ],
              })(
                <Select
                  placeholder="请选择软件名称"
                  showSearch
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {accountList &&
                    accountList.map((item) => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>,
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
              <Button type="primary" ghost className="e-mr12" onClick={this.prev}>
                上一步
              </Button>
              <Button type="primary" onClick={this.save}>
                开始建账
              </Button>
            </div>
          </>
        )}
      </>
    );
  }
}
export default connect(({ currRecord }) => ({ currRecord }))(Online);
