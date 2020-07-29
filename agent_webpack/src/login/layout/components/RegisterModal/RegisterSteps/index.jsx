// 注册步骤条
import React from 'react';
import { Steps } from 'antd';
import Style from './style.less';

const { Step } = Steps;
const RegisterSteps = ({ current }) => {
  const steps = [
    {
      title: '1',
      content: '选择类型',
    },
    {
      title: '2',
      content: '完善信息',
    },
    {
      title: '3',
      content: '提交成功',
    },
  ];
  return (
    <Steps current={current} className={Style['m-step']}>
      {steps.map((item) => (
        <Step key={item.title} title={item.content} />
      ))}
    </Steps>
  );
};
RegisterSteps.defaultProps = {
  // 当前步骤
  current: 0,
};
export default RegisterSteps;
