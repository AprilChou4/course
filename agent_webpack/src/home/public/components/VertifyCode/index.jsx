// 短信验证码
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Button } from 'antd';
import { constant } from '@public/script';
import ImgCodeModal from './ImgCodeModal';
import './style.less';

let timer = null;
const VertifyCode = ({
  time,
  imgCodeUrl,
  isHasImgCode,
  checkImgCode,
  className,
  isNeedCheckMobile,
  form,
  // checkMobile,
  sendMobileCode,
  ...rest
}) => {
  const [isDisabled, setDisabled] = useState(false); // 按钮是否可点击
  const [count, setCount] = useState(time); // 倒计时剩余时间
  const [imgVisible, setImgCode] = useState(false); // 图片验证码弹窗是否显示
  const { getFieldDecorator, isFieldTouched, validateFields, getFieldError } = form;

  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, []);
  /**
   * 发送验证码
   * @param {*} flag 是否显示图片验证码弹窗
   */
  const sendCode = async (flag, code) => {
    let isChecked = false;
    if (isNeedCheckMobile) {
      isChecked = isFieldTouched('phoneNum') && !getFieldError('phoneNum');
      !isFieldTouched('phoneNum') && validateFields(['phoneNum']);
    } else {
      isChecked = true;
    }

    // const isChecked = checkMobile();
    if (!isChecked) {
      return false;
    }
    if (flag) {
      setDisabled(true);
      // 发送短信验证码，返回值300=发送失败,请求验证码过于频繁
      const res = await sendMobileCode(code);
      if (res.status !== 200) {
        setDisabled(false);
        return false;
      }
      timer = setInterval(() => {
        setCount((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            setDisabled(false);
            return time;
          }
          return --prev;
        });
      }, 1000);
    } else {
      setImgCode(true);
    }
  };
  return (
    <Form.Item className={`ui-vertifyCode ${className || ''}`}>
      {imgVisible && isHasImgCode && (
        <ImgCodeModal
          visible={imgVisible}
          setImgCode={setImgCode}
          sendCode={sendCode}
          imgCodeUrl={imgCodeUrl}
          checkImgCode={checkImgCode}
        />
      )}
      {getFieldDecorator('code', {
        initialValue: '',
        ...constant.VALIDATE_TRIGGER_ONBLUR,
        rules: [
          {
            required: true,
            message: '请输入短信验证码',
          },
          {
            len: 6,
            message: '请输入6位短信验证码',
          },
        ],
      })(
        <Input
          placeholder="请输入验证码"
          size="large"
          autoComplete="off"
          prefix={<span>验证码</span>}
          maxLength={6}
          {...rest}
        />,
      )}

      <Button
        type="primary"
        size="large"
        onClick={() => sendCode(false)}
        disabled={isDisabled}
        className="m-sendCode"
      >
        {isDisabled ? `${count}s重新发送` : '发送验证码'}
      </Button>
    </Form.Item>
  );
};
VertifyCode.defaultProps = {
  // 倒计时时间 默认60秒
  time: 60,
  // 图片验证码路径
  imgCodeUrl: '',
  // 是否有图片验证码弹窗
  isHasImgCode: false,
  /**
   * 检验图片验证码
   * @param {*object } data  图片验证码参数
   * return boolean
   */
  checkImgCode(data) {},
  /**
  //  * 发送验证码前--验证手机号码是否输入
  //  * return boolean
  //  */
  // checkMobile() {},
  /**
   * 发送短信验证码
   * @param {*} code 图片验证码(后端双重验证)
   */
  sendMobileCode(code) {},
  // 判断手机号是否需要校验
  isNeedCheckMobile: true,
};
VertifyCode.propTypes = {
  time: PropTypes.number,
  imgCodeUrl: PropTypes.string,
  isHasImgCode: PropTypes.bool,
  // checkMobile: PropTypes.func,
  checkImgCode: PropTypes.func,
  sendMobileCode: PropTypes.func,
};
export default VertifyCode;
