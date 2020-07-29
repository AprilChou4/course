// 图片验证码弹窗
import React, { useState, useCallback } from 'react';
import { Modal, Input, Form } from 'antd';

const ImgCodeModal = ({ visible, setImgCode, checkImgCode, sendCode, imgCodeUrl, form }) => {
  const { getFieldDecorator, validateFields } = form;
  const [imgUrl, setImgUrl] = useState(`${imgCodeUrl}?_=${new Date().getTime()}`);

  // 更新图片验证码
  const updateImgCode = useCallback(() => {
    setImgUrl(`${imgUrl}?_=${new Date().getTime()}`);
  });

  // 点击确定
  const onOk = () => {
    validateFields(async (err, values) => {
      if (!err) {
        const res = await checkImgCode(values);
        if (res.status === 200) {
          setImgCode(false);
          // 发送短信验证码
          sendCode(true, values.code);
        } else {
          updateImgCode();
        }
      }
    });
  };

  // 关闭弹窗
  const onCancel = () => {
    setImgCode(false);
  };

  return (
    <Modal
      visible={visible}
      width={382}
      title="请输入验证码"
      centered
      maskClosable={false}
      className="ui-imgCode"
      destroyOnClose
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form>
        <Form.Item>
          {getFieldDecorator('code', {
            initialValue: '',
            rules: [
              {
                required: true,
                message: '请输入图片验证码',
              },
              {
                max: 4,
                message: '请输入4位图片验证码',
              },
            ],
          })(<Input placeholder="请输入验证码" size="large" maxLength={4} autoComplete="off" />)}
          <a onClick={updateImgCode} className="m-img">
            <img src={imgUrl} alt="图片验证码" />
          </a>
        </Form.Item>
      </Form>
    </Modal>
  );
};
ImgCodeModal.defautProps = {
  // 图片验证码弹窗是否显示
  visible: false,
  /**
   * 显示/关闭弹窗
   * @param {*boolean} flag
   */
  setImgCode(flag) {},
  /**
   * 发送验证码
   * @param {*boolean} flag
   */
  sendCode(flag) {},
  // 图片验证码url
  imgCodeUrl: '',
  // 检验图片验证码
  checkImgCode() {},
};
export default Form.create()(ImgCodeModal);
