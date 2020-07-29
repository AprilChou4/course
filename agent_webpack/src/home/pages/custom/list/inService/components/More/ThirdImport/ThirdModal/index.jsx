// 第三方导入
import React, { useCallback, useState, useEffect } from 'react';
import { Modal, Input, Select, message, Form } from 'antd';
import { connect } from 'nuomi';
import { trim } from 'lodash';
import SelectCustom from '../SelectCustom';
import Style from './style.less';
import services from '../../../../services';

const FormItem = Form.Item;
const { Option } = Select;
const { Password } = Input;
const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 19 },
  },
};

const ThirdModal = (props) => {
  const {
    dispatch,
    thirdImportVisible,
    selectCustomVisible,
    form: { getFieldDecorator, validateFields },
  } = props;
  const [softList, setSoftList] = useState([]);
  const [selectCustomList, setSelectCustomList] = useState([]);
  const [softwareInfo, setSoftwareInfo] = useState({});

  // 获取软件类型
  useEffect(() => {
    dispatch({
      type: '$getBatchImportWebType',
    }).then((res) => {
      setSoftList(res);
    });
  }, [dispatch]);

  // 确定
  const onOk = () => {
    validateFields(async (errors, values) => {
      if (errors) {
        return false;
      }
      try {
        const data = await services.getInfoByAccount({
          ...values,
          code: trim(values.code),
        });

        setSelectCustomList(data);
        dispatch({
          type: 'updateState',
          payload: {
            thirdImportVisible: false,
            selectCustomVisible: true,
          },
        });
      } catch (err) {
        message.error(err.message);
      }
    });
  };

  // 取消
  const onCancel = useCallback(() => {
    dispatch({
      type: 'updateState',
      payload: {
        thirdImportVisible: false,
        selectCustomVisible: false,
      },
    });
  }, [dispatch]);

  // 改变软件
  const changeSoft = (value, option) => {
    const { children } = option.props;
    setSoftwareInfo({
      ...softwareInfo,
      name: children,
      type: value,
    });
  };
  return (
    <>
      {thirdImportVisible && (
        <Modal
          title="选择登录软件"
          visible={thirdImportVisible}
          width={460}
          className={Style['m-thirdImport']}
          onOk={onOk}
          onCancel={onCancel}
          destroyOnClose
          maskClosable={false}
          centered
        >
          <div className={Style['m-hint']}>
            <i className="iconfont">&#xeaa1;</i>
            温馨提示：需要转换目前支持的软件，请先联系管理人员
          </div>
          <Form {...formItemLayout}>
            <FormItem label="软件名称">
              {getFieldDecorator('type', {
                initialValue: undefined,
                rules: [
                  {
                    required: true,
                    message: '请选择软件',
                  },
                ],
              })(
                <Select onChange={changeSoft} placeholder="请选择">
                  {softList.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            <FormItem label="账号">
              {getFieldDecorator('code', {
                initialValue: '',
              })(<Input placeholder="请输入账号" autoComplete="off" />)}
            </FormItem>
            <FormItem label="密码">
              {getFieldDecorator('password', {
                initialValue: '',
              })(<Password placeholder="请输入密码" autoComplete="off" password="false" />)}
            </FormItem>
          </Form>
        </Modal>
      )}
      {selectCustomVisible && (
        <SelectCustom softwareInfo={softwareInfo} dataSource={selectCustomList} />
      )}
    </>
  );
  // }
};
export default connect(({ thirdImportVisible, selectCustomVisible }) => ({
  thirdImportVisible,
  selectCustomVisible,
}))(Form.create()(ThirdModal));
