// 云记账注册 > 第四步>注册成功/开通成功、注册代账>加入公司
import React, { useState, useEffect } from 'react';
import { Descriptions } from 'antd';
import { connect } from 'nuomi';
import sso from '@login/public/sso';
import Style from './style.less';

const SuccessHint = ({
  title = '提交成功',
  smallTitle = '',
  upInfo,
  dispatch,
  successReturnInfo,
}) => {
  const { realName, areaName, phoneNum } = upInfo;
  const [count, setCount] = useState(5); // 倒计时剩余时间

  useEffect(() => {
    if (!smallTitle) {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            sso(successReturnInfo, dispatch);
            dispatch({
              type: 'updateState',
              payload: {
                // 重置注册
                registerVisible: false,
                registerStep: 1,
                phoneNumInfo: {},
                selectedCompanyType: 2,
                // 重置完善信息
                completeInfoVisible: false,
                completeStep: 1,
                completeInfo: {},
                successReturnInfo: {},
              },
            });
            return 0;
          }
          return --prev;
        });
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [dispatch, smallTitle, successReturnInfo]);
  return (
    <div className={Style['m-success']}>
      <div className={`f-clearfix ${Style['m-hint']}`}>
        <i className="iconfont f-fl">&#xec94;</i>
        <div className="f-fl">
          <h3>{title}</h3>
          <span className={Style['m-state']}>
            {smallTitle || (
              <>
                将在<em>{count}</em>秒后自动跳转登陆
              </>
            )}
          </span>
        </div>
      </div>
      <div className={Style['m-tip']}>
        <Descriptions title={null} column={1}>
          <Descriptions.Item label="姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名">
            {realName}
          </Descriptions.Item>
          <Descriptions.Item label="所&nbsp;&nbsp;在&nbsp;地">{areaName || '--'}</Descriptions.Item>
          <Descriptions.Item label="登录账号">{phoneNum}</Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};
SuccessHint.defaultProps = {
  // 标题
  title: '',
  // 小标题
  smallTitle: '',
  // 开通/注册信息
  upInfo: {},
};
export default connect(({ successReturnInfo }) => ({ successReturnInfo }))(SuccessHint);
