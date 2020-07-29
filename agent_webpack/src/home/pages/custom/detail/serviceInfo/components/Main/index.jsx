import React, { Component } from 'react';
import { connect, router } from 'nuomi';

import { Form, Input, Select, Button } from 'antd';
import Title from '@components/Title';
import { InputLimit } from '@components/InputLimit';
import MultiTreeSelect from '@components/MultiTreeSelect';
import ServiceType from '@components/ServiceType';
import postMessageRouter from '@utils/postMessage';
import Bookeeper from '../../../../list/inService/components/Bookeeper';
import Contact from '../Contact';
import Style from './style.less';
import BottomBtns from '../../../layout/components/BottomBtns';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
@Form.create({
  onValuesChange(props, changedFields, allFields) {
    props.dispatch({
      type: 'updateState',
      payload: {
        serviceInfoDetail: {
          ...props.serviceInfoDetail,
          ...allFields,
        },
        isContChange: true,
      },
    });
  },
})
class Main extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const {
      query: { isEdit },
    } = router.location();
    dispatch({
      type: 'updateState',
      payload: {
        isEdit: !!Number(isEdit),
      },
    });
  }

  // 改变客户来源
  changeCustomerSource = (value) => {
    const { dispatch, serviceInfoDetail } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        serviceInfoDetail: {
          ...serviceInfoDetail,
          customerSource: value,
        },
      },
    });
  };

  changeTicketType = (value) => {
    const { dispatch, serviceInfoDetail } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        serviceInfoDetail: {
          ...serviceInfoDetail,
          ticketType: value,
        },
      },
    });
  };

  // 改变服务类型
  changeServiceType = (checkedValue, checkedObj) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        customerServiceRelationList: checkedObj,
      },
    });
  };

  // 保存
  save = () => {
    const {
      dispatch,
      form: { validateFieldsAndScroll },
    } = this.props;
    validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: '$updateServiceInfo',
        });
      }
    });
  };

  // 编辑
  edit = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        isEdit: true,
      },
    });
  };

  // 取消
  cancel = () => {
    const {
      query: { isAlone },
    } = router.location();
    if (isAlone === '1') {
      window.parent.postMessage('close', '*');
    } else {
      postMessageRouter({
        type: 'agentAccount/routerLocation',
        payload: {
          url: '/custom/list/',
        },
      });
    }
  };

  render() {
    const {
      isEdit,
      form,
      loadings,
      serviceTypeList,
      allEmployeeList,
      staffList,
      customerServiceRelationList,
      customerLevelList,
      customerSourceList,
      ticketTypeList,
      accountAssistant,
      taxReporter,
      drawerList,
      customAdviser,
      serviceInfoDetail,
    } = this.props;
    const { getFieldDecorator } = form;
    const {
      customerLevel,
      documentNum,
      customerSource,
      customerSourceRelationInfo,
      ticketType,
      ticketPicker,
      ticketObtainAddress,
      bookkeepingAccounting,
      accountingAssistant,
      taxReportingAccounting,
      drawer,
      customerConsultant,
      remark,
      isCreate,
      hasInvoice,
    } = serviceInfoDetail;
    const isDisabled = { disabled: !isEdit };
    return (
      <div className="custom-form-wrap">
        <Form className={Style['edit-serviceInfo']}>
          <Title title="基础信息" />
          <div className="form-row">
            <FormItem label="客户等级">
              {getFieldDecorator('customerLevel', {
                initialValue: customerLevel || undefined,
              })(
                <Select
                  placeholder={isEdit ? '请选择客户等级' : '-'}
                  {...isDisabled}
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                >
                  {customerLevelList.map((ele) => (
                    <Option key={ele.value} value={ele.value}>
                      {ele.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="档案号">
              {getFieldDecorator('documentNum', {
                initialValue: documentNum,
              })(
                <InputLimit
                  placeholder={isEdit ? '请输入档案号' : '-'}
                  {...isDisabled}
                  autoComplete="off"
                  maxLength={20}
                />,
              )}
            </FormItem>
          </div>
          <div className="form-row">
            <div className={Style['form-extra']}>
              <FormItem label="客户来源">
                {getFieldDecorator('customerSource', {
                  initialValue: customerSource || undefined,
                })(
                  <Select
                    placeholder={isEdit ? '请选择客户来源' : '-'}
                    {...isDisabled}
                    onChange={this.changeCustomerSource}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {customerSourceList.map((ele) => (
                      <Option key={ele.value} value={ele.value}>
                        {ele.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              {[1, 2].includes(customerSource) && (
                <div className={Style['m-extraItem']}>
                  <FormItem label={customerSource === 1 ? '接单人' : '推荐人'}>
                    {getFieldDecorator('customerSourceRelationInfo', {
                      initialValue: customerSourceRelationInfo || undefined,
                    })(
                      <Select
                        placeholder={
                          isEdit ? `请选择${customerSource === 1 ? '接单人' : '推荐人'}}` : '-'
                        }
                        {...isDisabled}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      >
                        {staffList.map((ele) => (
                          <Option key={ele.staffId} value={ele.staffId}>
                            {ele.realName}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                </div>
              )}
            </div>
            <div className={Style['form-extra']}>
              <FormItem label="取票方式">
                {getFieldDecorator('ticketType', {
                  initialValue:
                    (ticketType && ticketType !== -1) || ticketType === 0 ? ticketType : undefined,
                })(
                  <Select
                    placeholder={isEdit ? '请选择取票方式' : '-'}
                    {...isDisabled}
                    onChange={this.changeTicketType}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  >
                    {ticketTypeList.map((ele) => (
                      <Option key={ele.value} value={ele.value}>
                        {ele.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </FormItem>
              {ticketType === 0 && (
                <div className={Style['m-extraItem']}>
                  <FormItem label="取票人">
                    {getFieldDecorator('ticketPicker', {
                      initialValue: ticketPicker || undefined,
                    })(
                      <Select placeholder={isEdit ? '请选择取票人' : '-'} {...isDisabled}>
                        {staffList.map((ele) => (
                          <Option key={ele.staffId} value={ele.staffId}>
                            {ele.realName}
                          </Option>
                        ))}
                      </Select>,
                    )}
                  </FormItem>
                  <FormItem label="取票地址">
                    {getFieldDecorator('ticketObtainAddress', {
                      initialValue: ticketObtainAddress,
                    })(
                      <Input
                        placeholder={isEdit ? '请输入取票地址' : '-'}
                        {...isDisabled}
                        autoComplete="off"
                      />,
                    )}
                  </FormItem>
                </div>
              )}
            </div>
          </div>
          <div className="form-row" />
          <div className="form-row form-row-long">
            {getFieldDecorator('customerServiceRelationList', {
              initialValue: customerServiceRelationList,
            })(<Input type="hidden" />)}
            <FormItem label="服务类型">
              {getFieldDecorator('serviceType', {
                initialValue: customerServiceRelationList.map(
                  (item) => item.companyServiceTypeValue,
                ),
                rules: [
                  {
                    required: true,
                    message: '请选择服务类型',
                  },
                ],
              })(
                <ServiceType
                  serviceTypeList={serviceTypeList}
                  onCheckBox={this.changeServiceType}
                  isCreate={isCreate}
                  hasInvoice={hasInvoice}
                  {...isDisabled}
                />,
              )}
            </FormItem>
          </div>
          <Title title="派工信息" />
          <div className="form-row">
            <FormItem label="记账会计">
              {getFieldDecorator('bookkeepingAccounting', {
                initialValue: bookkeepingAccounting || undefined,
                rules: [
                  {
                    required: isCreate === 1,
                    message: '请选择记账会计',
                  },
                ],
              })(<Bookeeper {...isDisabled} placeholder={isEdit ? '请选择记账会计' : '-'} />)}
            </FormItem>
            <FormItem label="会计助理">
              {getFieldDecorator('accountingAssistant', {
                initialValue: accountingAssistant || undefined,
              })(
                <MultiTreeSelect
                  treeData={accountAssistant}
                  allEmployeeList={allEmployeeList}
                  searchPlaceholder={isEdit ? '请选择会计助理' : '-'}
                  {...isDisabled}
                />,
              )}
            </FormItem>
          </div>
          <div className="form-row">
            <FormItem label="报税会计">
              {getFieldDecorator('taxReportingAccounting', {
                initialValue: taxReportingAccounting || undefined,
              })(
                <MultiTreeSelect
                  treeData={taxReporter}
                  allEmployeeList={allEmployeeList}
                  searchPlaceholder={isEdit ? '请选择报税会计' : '-'}
                  {...isDisabled}
                />,
              )}
            </FormItem>
            <FormItem label="开票员">
              {getFieldDecorator('drawer', {
                initialValue: drawer || undefined,
              })(
                <MultiTreeSelect
                  treeData={drawerList}
                  allEmployeeList={allEmployeeList}
                  searchPlaceholder={isEdit ? '请选择开票员' : '-'}
                  {...isDisabled}
                />,
              )}
            </FormItem>
          </div>
          <div className="form-row">
            <FormItem label="客户顾问">
              {getFieldDecorator('customerConsultant', {
                initialValue: customerConsultant || undefined,
              })(
                <MultiTreeSelect
                  treeData={customAdviser}
                  allEmployeeList={allEmployeeList}
                  searchPlaceholder={isEdit ? '请选择客户顾问' : '-'}
                  {...isDisabled}
                />,
              )}
            </FormItem>
          </div>
          <Title title="联系人信息" />
          <Contact form={form} />
          <Title title="备注" />
          <div className="form-row form-row-long">
            <FormItem label="备注">
              {getFieldDecorator('remark', {
                initialValue: remark,
              })(
                <TextArea
                  placeholder={isEdit ? '请输入备注' : '-'}
                  {...isDisabled}
                  autoComplete="off"
                />,
              )}
            </FormItem>
          </div>
          <BottomBtns
            isEditing={isEdit}
            onCancle={this.cancel}
            onSave={this.save}
            onEdit={this.edit}
          />
        </Form>
      </div>
    );
  }
}
export default connect(
  ({
    isEdit,
    loadings,
    customerLevelList,
    customerSourceList,
    ticketTypeList,
    serviceTypeList,
    customerServiceRelationList,
    accountAssistant,
    taxReporter,
    drawerList,
    staffList,
    allEmployeeList,
    customAdviser,
    serviceInfoDetail,
  }) => ({
    isEdit,
    loadings,
    customerLevelList,
    customerSourceList,
    ticketTypeList,
    serviceTypeList,
    customerServiceRelationList,
    accountAssistant,
    taxReporter,
    drawerList,
    staffList,
    allEmployeeList,
    customAdviser,
    serviceInfoDetail,
  }),
)(Main);
