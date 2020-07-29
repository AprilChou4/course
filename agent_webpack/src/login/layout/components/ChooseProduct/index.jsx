// 选择注册产品(云记账/云代账)
import React, { useState } from 'react';
import { Card, List, Checkbox } from 'antd';
import propTypes from 'prop-types';
import { connect } from 'nuomi';
import BigButton from '../BigButton';
import ProtocolModal from './ProtocolModal';

import Style from './style.less';

const { Meta } = Card;
const list = [
  {
    key: 0,
    title: '云记账',
    description: ['适用于中小微企业会计或个', '人兼职会计，包含在线财务', '处理系统'],
  },
  {
    key: 1,
    title: '云代账',
    description: [
      '适用于代理财税业务的代账',
      '公司/事务所/财务公司等',
      '包含企业运营管理系统和全',
      '套财税处理工具',
    ],
  },
];
const ChooseProduct = ({ dispatch, versionType, nextStepCallback }) => {
  const [isProductCheck, setPruduct] = useState(versionType !== 2); // 是否选中产品 下一步按钮是否禁用状态
  const [checked, setChecked] = useState(true); // 是否已阅读
  // 选择产品
  const cardClick = (key) => {
    setPruduct(true);
    dispatch({
      type: 'updateState',
      payload: {
        versionType: key,
      },
    });
  };

  // 阅读协议
  const changeProtocol = (e) => {
    setChecked(e.target.checked);
  };

  // 下一步
  const nextStep = () => {
    if (versionType === 2) {
      return false;
    }
    nextStepCallback();
  };
  return (
    <>
      <List
        grid={{ gutter: 20, column: 2 }}
        dataSource={list}
        className={Style['m-productList']}
        renderItem={({ key, title, description }) => (
          <List.Item className={key === versionType && Style['m-checked']} key={key}>
            <Card
              hoverable
              onClick={() => cardClick(key)}
              cover={
                key === versionType && <i className={`iconfont ${Style['m-icon']}`}>&#xec94;</i>
              }
            >
              <Meta
                title={title}
                description={description.map((val, index) => (
                  <p key={index}>{val}</p>
                ))}
              />
            </Card>
          </List.Item>
        )}
      />
      <Checkbox onChange={changeProtocol} className={Style['m-checkbox']} checked={checked}>
        我已经阅读并同意
      </Checkbox>
      <ProtocolModal
        type={0}
        title="诺诺网注册协议"
        visibleName="protocolVisible"
        setChecked={setChecked}
      />
      、
      <ProtocolModal
        type={1}
        title="隐私权保存声明"
        visibleName="privacyVisible"
        setChecked={setChecked}
      />
      <BigButton
        className={Style['m-nextBtn']}
        text="下一步"
        disabled={!(isProductCheck && checked)}
        onClick={nextStep}
      />
    </>
  );
};
ChooseProduct.defaultProps = {
  // 点击下一步回调
  nextStepCallback() {},
};
ChooseProduct.propTypes = {
  nextStepCallback: propTypes.func,
};
export default connect(({ versionType }) => ({
  versionType,
}))(ChooseProduct);
