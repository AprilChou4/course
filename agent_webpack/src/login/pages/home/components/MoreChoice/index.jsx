// 更多选择
import React from 'react';
import { Row, Col, Card, Popover, Descriptions } from 'antd';

import CloudIcon from '@public/images/ico-cloud-100.png';
import InsteadIcon from '@public/images/ico-instead-100.png';
import WisdomIcon from '@public/images/ico-wisdom-100.png';
import Title from '../Title';
import Style from './style.less';

const { Meta } = Card;
const list = [
  {
    key: 1,
    icon: CloudIcon,
    title: '诺诺云记账',
    des: [
      '专注于中小微企业应用的在线财务软件',
      '有网就能记 、 简单易用、快速上手、自由组合增值功能',
    ],
    suitable: '中小微企业会计、兼职会计等',
    funcs:
      '包含凭证录入、自动生成账簿报表、期末结转等基础功能，以及智能凭证、科目辅助核算、固定资产管理、原始凭证管理、外币核算等超多增值功能',
    way: '单用户操作',
    solve: '定制个性化模块财务记账软件',
    // charge: '基础功能免费，增值功能按模块收费',
    placement: 'bottomLeft',
  },
  {
    key: 2,
    icon: InsteadIcon,
    title: '诺诺云代账',
    des: ['为财税服务机构提供一站式解决方案', '集中管理客户及员工、记账开票税务工具高效易用'],
    suitable: '代账公司、会计师事务所、财务公司等',
    funcs:
      '包含公司运营管理系统，如客户管理、客户合同及收费管理、员工绩效管理、部门与员工架构等。包含账务处理平台、发票代开平台以及报税平台等全套财税处理工具',
    way: '同一公司下的多用户协同',
    solve: '为账务、税务、发票、客户管理、员工管理等提供一整套解决方案',
    // charge: '试用期后整体收费',
    placement: 'bottom',
  },
  {
    key: 3,
    icon: WisdomIcon,
    title: '智汇算',
    des: ['为小规模纳税人和代账公司快速生成申报表', '并能在局端申报前检测财税风险'],
    suitable: '代账公司、会计师事务所、财务公司等',
    funcs:
      '包含公司运营管理系统，如客户管理、客户合同及收费管理、员工绩效管理、部门与员工架构等。包含账务处理平台、发票代开平台以及报税平台等全套财税处理工具',
    way: '同一公司下的多用户协同',
    solve: '为账务、税务、发票、客户管理、员工管理等提供一整套解决方案',
    // charge: '试用期后整体收费',
    placement: 'bottomRight',
  },
];
const MoreChoice = () => {
  return (
    <>
      <Title>更多的选择</Title>
      <div className={Style['m-choose']}>
        <Row className={Style['l-wrap']}>
          {list.map(
            ({ key, icon, title, name, des, suitable, funcs, placement, way, solve, charge }) => (
              <Col span={8} key={key}>
                <Card
                  cover={
                    <Popover
                      content={
                        <div className={Style['m-cont']}>
                          <Descriptions title={title} column={2} colon={false}>
                            <Descriptions.Item label="适用对象">
                              <span className={Style['m-suitable']}>{suitable}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label="协作方式">{way}</Descriptions.Item>
                            <Descriptions.Item label="支持功能">{funcs}</Descriptions.Item>
                            <Descriptions.Item label="解决问题">{solve}</Descriptions.Item>
                            {/* <Descriptions.Item label="收费模式">{charge}</Descriptions.Item> */}
                          </Descriptions>
                        </div>
                      }
                      title={null}
                      placement={placement}
                      // trigger="click"
                      getPopupContainer={(triggerNode) => triggerNode.parentElement}
                    >
                      <img alt={title} src={icon} />
                    </Popover>
                  }
                >
                  <Meta
                    title={title}
                    description={
                      <div>
                        {des.map((item, index) => (
                          <p key={index}>{item}</p>
                        ))}
                      </div>
                    }
                  />
                </Card>
              </Col>
            ),
          )}
        </Row>
      </div>
    </>
  );
};

export default MoreChoice;
