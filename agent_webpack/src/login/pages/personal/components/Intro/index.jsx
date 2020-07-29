// 我们的优势
import React from 'react';
import { Row, Col, List, Card, Avatar, Popover, Descriptions } from 'antd';
import Img1 from '@public/images/c1.png';
import Img2 from '@public/images/c2.png';
import Img3 from '@public/images/c3.png';
import Style from './style.less';

const { Meta } = Card;
const list = [
  {
    key: 1,
    imgUrl: Img1,
    placement: 'right',
    title: '界面美观、操作简便、易上手',
    des: [
      '智能化操作界面，根据用户需要，展示相应的模块功能',
      '抛弃复杂的操作流程，简化账务处理，给您多样化的智能操作体验',
      '采用互联网思维，让软件更简单，“0”学习成本，让您“一看就会”',
    ],
  },
  {
    key: 2,
    imgUrl: Img2,
    placement: 'left',
    title: '基础功能免费',
    des: [
      '便捷的凭证录入、账簿多样化联查，总账、明细账、',
      '余额表均可由汇总到明细录、由明细到凭证查询',
      '三大报表数据实时生成， 现金流量表无需设置现金流自动取数',
      '期末严谨的数据检查，确保您的数据无忧',
    ],
  },
  {
    key: 3,
    imgUrl: Img3,
    placement: 'right',
    title: '多样化的增值功能，提升财务效率',
    des: [
      '线下财务软件转换，精确高效地迁移您的原财务数据',
      '提供客户、供应商、部门、员工、存货、项目六类辅助核算，',
      '启用辅助核算增加辅助核算余额表和明细账，丰富您的账务数据统计查询',
      '支持外币核算，自动汇兑损益结算',
      '通过原始凭证功能，可以自动识别您的进销项发票，一键生成凭证',
      '启用智能凭证，通过摘要带出凭证，提升您的账务处理效率',
    ],
  },
];
const Intro = () => {
  return (
    <>
      <div className={Style['m-intro']}>
        <List
          grid={{ gutter: 24, column: 1 }}
          dataSource={list}
          renderItem={({ key, imgUrl, placement, title, des }) => (
            <List.Item className={Style[`m-bgimg${key}`]} key={key}>
              <div className={Style['l-wrap']}>
                <List.Item.Meta
                  description={
                    <div className={`f-clearfix ${Style[`m-${placement}`]}`}>
                      {placement === 'left' && <img src={imgUrl} alt="" />}

                      <div className={`${Style['m-des']} ${Style[`m-des${key}`]}`}>
                        <h3>{title}</h3>
                        {des.map((val, index) => (
                          <p key={index}>{val}</p>
                        ))}
                      </div>

                      {placement === 'right' && <img src={imgUrl} alt="" />}
                    </div>
                  }
                />
              </div>
            </List.Item>
          )}
        />
      </div>
      {/* </div> */}
    </>
  );
};

export default Intro;
