// 完善名字和选择地区
import React, { useState, useEffect } from 'react';
import { Form, Input, AutoComplete } from 'antd';
import { connect } from 'nuomi';
import AreaCascader from '@components/AreaCascader'; // 地区组件
import { constant } from '@public/script';
import services from '@login/layout/services';
import { useDebouncedCallback } from 'use-debounce';
import PhoneNum from '../PhoneNum';

const AutoOption = AutoComplete.Option;
const FormItem = Form.Item;
const NameAndArea = ({
  isShowCompanyName,
  isShowTaxNum,
  isShowRealName,
  isShowArea,
  isValidateFirm,
  isShowPhoneNum,
  phoneNum,
  isValidatePhone,
  isWarnHint,
  dispatch,
  form,
  selectedCompanyType,
}) => {
  const [firmList, setFirmList] = useState([]); // 公司列表
  const [dataSource, setDataSource] = useState([]); // 下拉选项
  const [userInfoByPhone, setUserInfoByPhone] = useState({}); // 根据手机或税号获取的用户信息
  const { realName, areaCode, areaName, userType, username } = userInfoByPhone;
  const { getFieldDecorator, setFieldsValue } = form;
  useEffect(() => {
    // 根据手机号获取获取诺诺用户信息
    dispatch({
      type: '$getUserInfoByPhone',
      payload: {
        phoneNum,
      },
    }).then((res) => {
      // res = {
      //   areaCode: '',
      //   phoneNum: '13244441117',
      //   realName: '13244441117',
      //   remoteId: '011be6cfaba840b2b52cafea5bb1c299',
      //   userId: '',
      //   userType: 1,
      //   username: 'nuonuo11179u',
      // };
      setUserInfoByPhone(res);
    });
  }, [dispatch, phoneNum]);

  // 公司名称选择
  const firmSelect = (value, option) => {
    const {
      firmdata: { companyId },
    } = option.props;
    setFieldsValue({
      companyId,
    });
  };

  // 公司名称输入查询
  const [firmSearch] = useDebouncedCallback(async (value) => {
    if (!value) {
      return false;
    }
    const data = await services.getCompanyByName({
      companyName: value,
    });
    const options =
      data &&
      data.map((item, index) => (
        <AutoOption key={index} firmdata={item} value={item.companyName}>
          {item.companyName}
        </AutoOption>
      ));
    setFirmList(data);
    setDataSource(options);
  }, 300);

  // 检验公司名称
  const validatorFirm = async (rule, value, callback) => {
    let isExist = false;
    firmList.some((item) => {
      if (item.companyName === value) {
        setFieldsValue({
          companyId: item.companyId,
        });
        isExist = true;
        return false;
      }
    });
    if (!isExist) {
      callback('该公司名称不存在');
    } else {
      callback();
    }
  };
  const getCompany = () =>
    isValidateFirm ? (
      <AutoComplete
        size="large"
        dataSource={dataSource}
        onSelect={firmSelect}
        onSearch={firmSearch}
      >
        <Input
          placeholder={selectedCompanyType === 0 ? '请输入公司名称' : '请输入需要加入的公司名称'}
          autoComplete="off"
          prefix={<span>公司名称</span>}
        />
      </AutoComplete>
    ) : (
      <Input
        placeholder="请输入公司名称"
        autoComplete="off"
        prefix={<span>公司名称</span>}
        size="large"
      />
    );
  return (
    <>
      {isShowCompanyName && (
        <>
          {getFieldDecorator('companyId', {
            initialValue: '',
          })(<Input type="hidden" />)}

          <FormItem hasFeedback>
            {getFieldDecorator('companyName', {
              initialValue: '',
              ...constant.VALIDATE_TRIGGER_ONBLUR,
              rules: [
                {
                  required: true,
                  message: `请输入公司名称`,
                },
                isValidateFirm && {
                  validator: validatorFirm,
                },
              ],
            })(getCompany())}
          </FormItem>
        </>
      )}
      {userType === 1 && (
        <>
          {getFieldDecorator('userType', {
            initialValue: userType,
          })(<Input type="hidden" />)}
          <FormItem hasFeedback>
            {getFieldDecorator('username', {
              initialValue: username,
            })(
              <Input
                placeholder="请输入税号"
                size="large"
                autoComplete="off"
                prefix={<span>税号</span>}
                disabled
              />,
            )}
          </FormItem>
        </>
      )}

      {isShowPhoneNum && userType !== 1 && (
        <PhoneNum
          form={form}
          disabled
          defaultValue={phoneNum}
          isValidatePhone={isValidatePhone}
          isWarnHint={isWarnHint}
        />
      )}
      {isShowRealName && (
        <FormItem hasFeedback>
          {getFieldDecorator('realName', {
            initialValue: realName || '',
            ...constant.VALIDATE_TRIGGER_ONBLUR,
            rules: [
              {
                required: true,
                message: `请输入姓名`,
              },
              {
                max: 15,
                message: `请输入15位内字符的姓名`,
              },
            ],
          })(
            <Input
              placeholder="请输入姓名"
              size="large"
              autoComplete="off"
              maxLength={15}
              prefix={<span>姓名</span>}
            />,
          )}
        </FormItem>
      )}

      {isShowArea && (
        <FormItem hasFeedback>
          {getFieldDecorator('area', {
            initialValue: areaCode ? { areaName, areaCode } : '',
            rules: [
              {
                required: true,
                message: '请选择所在地',
              },
            ],
          })(
            <AreaCascader
              placement="bottom"
              placeholder="请选择所在地"
              size="large"
              prefix={<span>所在地</span>}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
            />,
          )}
        </FormItem>
      )}
    </>
  );
};

NameAndArea.defaultProps = {
  // 是否显示公司名称
  isShowCompanyName: true,
  // 是否校验公司名称
  isValidateFirm: true,
  // 是否显示税号
  // isShowTaxNum: false,
  // 是否显示姓名
  isShowRealName: true,
  // 是否显示手机号
  isShowPhoneNum: false,
  // 是否需要验证手机号码
  isValidatePhone: true,
  // 是否显示手机Warnhint
  isWarnHint: true,
  // 手机号码
  phoneNum: '',
  // 是否显示地区
  isShowArea: true,
};
export default connect(({ selectedCompanyType, versionType }) => ({
  selectedCompanyType,
  versionType,
}))(NameAndArea);
