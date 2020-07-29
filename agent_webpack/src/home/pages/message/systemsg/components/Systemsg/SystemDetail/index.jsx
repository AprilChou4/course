// 系统消息 > 详情
import React from 'react';
import { connect } from 'nuomi';
import Content from '@components/Content';
import BackButton from '../BackButton';
import Style from './style.less';

const { Head, Left } = Content;

const SystemDetail = ({ currSysMsgDetail: { content, title } }) => {
  return (
    <div className={Style['system-detail']}>
      <Head className="f-clearfix">
        <Left>
          <BackButton />
        </Left>
        <h3>{title}</h3>
      </Head>
      {/* eslint-disable-next-line */}
      <div className={Style['m-cont']} dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  );
};
export default connect(({ currSysMsgDetail }) => ({ currSysMsgDetail }))(SystemDetail);
