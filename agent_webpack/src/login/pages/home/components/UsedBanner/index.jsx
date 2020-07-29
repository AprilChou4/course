// 他们都在用banner
import React from 'react';
import { Carousel } from 'antd';
import Jpg1 from '@public/images/used/1.jpg';
import Jpg2 from '@public/images/used/2.jpg';
import Jpg3 from '@public/images/used/3.jpg';
import Jpg4 from '@public/images/used/4.jpg';
import Jpg5 from '@public/images/used/5.jpg';
import Jpg6 from '@public/images/used/6.jpg';
import Title from '../Title';
import Style from './style.less';

const UsedBanner = () => {
  const list = [
    {
      key: 1,
      imgUrl: Jpg1,
      companyName: '德波税务服务有限公司',
      name: '蔡晓楠',
      job: '税务客座教授',
      intro:
        '云代账是一款功能丰富、使用方便的产品。我公司使用了云代账这款产品之后，借助云代账平台管理更加规范、精细，工作效率得到了很大提升，在日益竞争激烈的市场中，帮助我们公司稳定前行。同时，也增加了我们用户良好的体验，通过该平台手机App可以授权企业查账，税费、发票代开等功能，实现了协同应用，是一款不错的产品。',
    },
    {
      key: 2,
      imgUrl: Jpg2,
      companyName: '浙江富春江会计师事务所有限公司',
      name: '蒋炜',
      job: '高级合伙人，副所长',
      intro:
        '云代账是一款实现了有网就能做的移动办公平台，向企业提供新建账套、凭证录入、账本登记等一系列基础财务处理功能，通过其便捷式的扫描发票、金税盘的数据衔接导入，大大提高工作效率。让企业负责人实现手机APP随时掌握了解财务信息、税费情况，实现线上传递开票信息等一站式服务。云代账软件界面简洁，但功能强大，数据云端自动备份，安全方便。',
    },
    {
      key: 3,
      imgUrl: Jpg3,
      companyName: '湖南金龟子财税服务有限公司',
      name: '聂进',
      job: '法人代表',
      intro:
        '云代账有很好用的记账功能，我们公司在云代账平台上面建了几百个账套，员工普遍感觉使用简单容易上手；另外，作为老板要管理客户的合同和员工的工作进度，有了云代账平台可以很好的管理和监控。感谢航天信息公司给我们提供了这么好的代账平台，航天信息作为财税产品领域的行家里手，我们还有很大的合作空间。',
    },
    {
      key: 4,
      imgUrl: Jpg4,
      companyName: '焦作速成税务服务有限公司',
      name: '李豫',
      job: '中国总会计师协会会员、河南省财务联盟理事',
      intro:
        '云代账本着互联网思维设计开发，摒弃了原有财务软件复杂冗余的部分功能，让繁复琐碎的记账工作变得流程化、细致化，开创了“有网就能记”的先河。特别是移动APP的上线，让记账工作不再受时间、地点和设备的限制，更加贴近现代财务工作的需求。并且云代账界面清新简洁，各种功能分类明确，便于查找和打印，让人一目了然，省时省力！我会把云代账这个好帮手推荐给更多的同行！',
    },
    {
      key: 5,
      imgUrl: Jpg5,
      companyName: '长沙市新同财务咨询有限公司',
      name: '刘玲',
      job: '法人代表',
      intro:
        '自从使用了云代账以后，对代账客户的管理变得简单多了，同时，对内部员工的工作分配及工作进展也能全面掌握。云代账平台不但是一款简单易用的记账工具，更是一款像我们这种财税代理企业的管理工具。',
    },
    {
      key: 6,
      imgUrl: Jpg6,
      companyName: '杭州博微企业管理有限公司',
      name: '郑建',
      job: '法人代表',
      intro:
        '诺诺云记账真正做到了高效、便捷、安全。有网有电脑就可办公，代账工作时间安排更自由高效随时查看所有数据，解决了以往单点模式在办公与数据查询上的弊端；所有数据输入、输出及不同模块间切换都非常方便，员工工作效率提升30%左右。客户直接在APP端查看企业账务情况，及时掌握自身企业发展状况，非常便利。希望爱信诺研发出更多好产品提升财务人员的工作品质。',
    },
  ];
  return (
    <>
      <Title>他们都在用</Title>
      <Carousel autoplay dots={false} className={Style['m-usedBanner']}>
        {list.map(({ key, imgUrl, companyName, name, job, intro }, index) => (
          <div key={key}>
            <div className={Style['m-item']}>
              <img src={imgUrl} className="f-fl" alt={intro} />
              <dl className="f-fl">
                <dt className="f-fs13">{companyName}</dt>
                <dd>
                  - {name}
                  <em>{job}</em>
                </dd>
                <dd className={Style['m-intro']}>{intro}</dd>
              </dl>
              <img
                src={index + 1 < list.length ? list[index + 1].imgUrl : list[0].imgUrl}
                className={`f-fr ${Style['m-rightImg']}`}
                alt={index + 1 < list.length ? list[index + 1].intro : list[0].intro}
              />
            </div>
          </div>
        ))}
      </Carousel>
    </>
  );
};

export default UsedBanner;
