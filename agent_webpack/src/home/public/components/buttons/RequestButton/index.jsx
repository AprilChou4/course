import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';
import './style.less';

const RequestButton = ({ success, error, before, request, ...rest }) => {
  const [loading, setLoading] = useState(false);

  const req = async (data) => {
    try {
      const responseData = await request(data);
      success(responseData, data);
    } catch (res) {
      error(res, data, (param) => {
        setLoading(true);
        req(param);
      });
    } finally {
      setLoading(false);
    }
  };

  const onClick = async () => {
    setLoading(true);
    try {
      const data = await before();
      req(data);
    } catch (msg) {
      if (msg) {
        message.error(msg);
      }
      setLoading(false);
    }
  };

  return <Button type="primary" {...rest} onClick={onClick} loading={loading} />;
};

RequestButton.defaultProps = {
  /**
   * @function 请求成功回调
   * @param {Object} responseData 相应数据response.data
   * @param {Object} data before 方法返回的内容
   */
  success() {},
  /**
   * @function 请求失败回调
   * @param {Object} response 接口响应数据
   * @param {Object} data before 方法返回的内容
   * @param {Function} req 请求函数，可以在二次弹窗后继续请求
   */
  error() {},
  /**
   * @function 请求前处理，可以做拦截校验或者参数处理，可以返回promise
   */
  before() {},
  /**
   * @function 请求处理，返回promise
   * @param {Object} data before 方法返回的内容
   */
  request() {},
};

RequestButton.propTypes = {
  success: PropTypes.func,
  error: PropTypes.func,
  before: PropTypes.func,
  request: PropTypes.func,
};

export default RequestButton;
