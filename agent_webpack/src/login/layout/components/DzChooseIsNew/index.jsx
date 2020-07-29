// 云代账 > 选择加入公司/创建公司
import React, { useState } from 'react';
import { Card, List, message } from 'antd';
import { connect } from 'nuomi';
import BigButton from '../BigButton';

import Style from './style.less';

const { Meta } = Card;
const list = [
  {
    key: 0,
    title: '创建新公司',
    icon: '\ue68c',
  },
  {
    key: 1,
    title: '加入已有公司',
    icon: '\ue664',
  },
];
const DzStepTwo = ({ dispatch, selectedCompanyType, nextStepCallback }) => {
  // 选择产品
  const cardClick = (key) => {
    dispatch({
      type: 'updateState',
      payload: {
        selectedCompanyType: key,
        ...(key === 1 ? { joinSource: 0 } : {}),
      },
    });
  };

  // 下一步
  const nextStep = () => {
    if (selectedCompanyType === 2) {
      message.warning('请选择类型');
      return false;
    }
    nextStepCallback();
  };
  return (
    <>
      <List
        grid={{ gutter: 20, column: 2 }}
        dataSource={list}
        className={Style['m-choose']}
        renderItem={({ key, title, icon }) => (
          <List.Item className={key === selectedCompanyType && Style['m-checked']} key={key}>
            <Card
              hoverable
              onClick={() => cardClick(key)}
              cover={
                <>
                  {key === selectedCompanyType && (
                    <i className={`iconfont ${Style['m-icon']}`}>&#xec94;</i>
                  )}
                </>
              }
            >
              <Meta
                title={
                  <>
                    <i className={`iconfont ${Style['m-joinIcon']}`}>{icon}</i>
                    <p>{title}</p>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />
      <BigButton className={Style['m-nextBtn']} text="下一步" onClick={nextStep} />
    </>
  );
};
export default connect(({ selectedCompanyType }) => ({
  selectedCompanyType,
}))(DzStepTwo);
