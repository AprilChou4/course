// 我们的优势
import React from 'react';
import { List, Card } from 'antd';
import Title from '../Title';
import Style from './style.less';

const { Meta } = Card;
const list = [
  {
    key: 1,
    icon: '\ue689',
    title: '记账平台',
    funcs: '基础功能 / 增值功能 / 记账进度',
    des: [
      '录凭证出报表、期初初始化期末结转结账等基',
      '础功能。智能凭证、辅助核算、原始凭证、固',
      '定资产等强化功能。随时掌控各客户记账进度',
    ],
  },
  {
    key: 2,
    icon: '\ue68b',
    title: '报税平台',
    funcs: '税种展示 / 报税金额 / 报税进度',
    des: ['展示各客户的报税税种、报税金额及逐月的报', '税状态；报税进度一目了然、及时把控'],
  },
  {
    key: 3,
    icon: '\ue68a',
    title: '代开平台',
    funcs: '申请单复核 / 一键开票 / 数据统计',
    des: [
      '对客户提交的代开票申请进行复核；申请单复',
      '核通过后下传至开票机，一键开票；开票数据',
      '统计维度完整，任务量清晰明确',
    ],
  },
];
const Platform = () => {
  return (
    <div className={Style['m-platform']}>
      <Title title="财税处理平台" subtitle="Financial And Tax Processing Platform" />
      <div className={Style['l-wrap']}>
        <List
          grid={{ gutter: 24, column: 3 }}
          dataSource={list}
          renderItem={({ key, funcs, title, icon, des }) => (
            <List.Item key={key}>
              <Card hoverable cover={<i className="iconfont">{icon}</i>}>
                <Meta
                  title={
                    <>
                      <p>{title}</p>
                      <p>{funcs}</p>
                    </>
                  }
                  description={des.map((val, index) => (
                    <p key={index}>{val}</p>
                  ))}
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Platform;
