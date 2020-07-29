// 我们的优势
import React from 'react';
import { List, Card } from 'antd';
import Jpg1 from '@public/images/s1.jpg';
import Jpg2 from '@public/images/s2.jpg';
import Jpg3 from '@public/images/s3.jpg';
import Jpg4 from '@public/images/s4.jpg';
import Title from '../Title';
import Style from './style.less';

const { Meta } = Card;
const list = [
  {
    key: 1,
    imgUrl: Jpg1,
    title: '企业管理',
    des: ['维护企业信息、部门及员工，组织架构层层展示；多角色权限按需', '分配，为员工灵活赋权'],
    child: [
      {
        tag: 1,
        name: '企业信息',
        className: 'f-fl left',
      },
      {
        tag: 2,
        name: '组织架构',
      },
      {
        tag: 3,
        name: '组织架构',
        className: 'f-fr right',
      },
    ],
  },
  {
    key: 2,
    imgUrl: Jpg2,
    title: '员工管理',
    des: [
      '将客户指派员工，员工权责明确；多维度员工业绩展示，员工考核更透明；',
      '多员工同时操作，互不影响，提高成员协作效率',
    ],
    child: [
      {
        tag: 1,
        name: '任务指派',
        className: 'f-fl left',
      },
      {
        tag: 2,
        name: '员工绩效',
      },
      {
        tag: 3,
        name: '多用户',
        className: 'f-fr right',
      },
    ],
  },
  {
    key: 3,
    imgUrl: Jpg3,
    title: '客户管理',
    des: ['客户/合同随时录入，指派跟进清晰有序；收费进度及合同状态关联展示，', '统一管理更轻松'],
    child: [
      {
        tag: 1,
        name: '客户管理',
        className: 'f-fl left',
      },
      {
        tag: 2,
        name: '合同管理',
      },
      {
        tag: 3,
        name: '收费管理',
        className: 'f-fr right',
      },
    ],
  },
  {
    key: 4,
    imgUrl: Jpg4,
    title: 'APP端',
    des: [
      '企业随时查账、上传原始凭证、申请代开票，实时把控进度；会计及时',
      '入账开票。缩短沟通时效，留存线上记录；代账管理层随时随地协调沟',
      '通；代账会计在手机上也能工作。',
    ],
    child: [
      {
        tag: 1,
        name: '数据查询',
        className: 'f-fl left',
      },
      {
        tag: 2,
        name: '进度跟踪',
      },
      {
        tag: 3,
        name: '管理协调',
        className: 'e-ml32',
      },
      {
        tag: 4,
        name: '移动操作',
        className: 'f-fr right',
      },
    ],
  },
];
const System = () => {
  return (
    <div className={Style['m-system']}>
      <Title title="运营管理系统" subtitle="Operation Management System" />
      <div className={Style['l-wrap']}>
        <List
          grid={{ gutter: 24, column: 2 }}
          dataSource={list}
          renderItem={({ key, imgUrl, title, des, child }) => (
            <List.Item key={key}>
              <Card
                hoverable
                cover={
                  <>
                    <span className="m-mask" />
                    <img alt={title} src={imgUrl} />
                  </>
                }
              >
                <Meta
                  description={
                    <>
                      <div className="tree">
                        <div className="top">
                          <span className="m-item">
                            <em>{title}</em>
                            <s className="dot">
                              <i />
                              <b />
                            </s>
                          </span>
                        </div>
                        <div className="bottom f-clearfix">
                          {child &&
                            child.map(({ name, className, tag }) => (
                              <span className={`m-item ${className || ''}`} key={tag}>
                                <em>{name}</em>
                                <s className="dot">
                                  <i />
                                  <b />
                                </s>
                              </span>
                            ))}
                        </div>
                      </div>
                      <div className="m-section">
                        <i className="iconfont">&#xe6cf;</i>
                        {des.map((val, index) => (
                          <p key={index} className={index === 0 ? 'm-first' : ''}>
                            {val}
                          </p>
                        ))}
                      </div>
                    </>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default System;
