// 我们的优势
import React from 'react';
import { Row, Col, List, Card, Popover, Descriptions } from 'antd';
import Jpg1 from '@public/images/1.jpg';
import Jpg2 from '@public/images/2.jpg';
import Jpg3 from '@public/images/3.jpg';
import Jpg4 from '@public/images/4.jpg';
import Title from '../Title';
import Style from './style.less';

const { Meta } = Card;
const list = [
  {
    key: 1,
    imgUrl: Jpg1,
    title: '体验',
    des: '免费试用',
    subDes: '智能化财务新体验',
  },
  {
    key: 2,
    imgUrl: Jpg2,
    title: '操作',
    des: '操作灵活，页面友好',
    subDes: '高效易用，0学习成本',
  },
  {
    key: 3,
    imgUrl: Jpg3,
    title: '协作',
    des: '随时随地都能用',
    subDes: '无需安装，轻松协作',
  },
  {
    key: 4,
    imgUrl: Jpg4,
    title: '安全',
    des: '云端加密存储',
    subDes: '信息安全有保',
  },
];
const Advantage = () => {
  return (
    <>
      <Title>我们的优势</Title>
      <div className={Style['m-advantage']}>
        <div className={Style['l-wrap']}>
          <List
            grid={{ gutter: 24, column: 4 }}
            dataSource={list}
            renderItem={({ key, imgUrl, title, des, subDes }) => (
              <List.Item key={key}>
                <Card hoverable cover={<img alt={title} src={imgUrl} />}>
                  <Meta
                    title={title}
                    description={
                      <>
                        <div>{des}</div>
                        <div>{subDes}</div>
                      </>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default Advantage;
