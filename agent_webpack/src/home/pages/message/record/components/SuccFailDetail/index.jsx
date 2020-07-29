// 发送成功/发送失败 > 详情
import React, { PureComponent } from 'react';
import { connect } from 'nuomi';
import moment from 'moment';
import { Descriptions, Divider, Spin } from 'antd';
import Content from '@components/Content';
import Authority from '@components/Authority';
import BackButton from '../BackButton';
import ResendBtn from '../ResendBtn';
import DetailSearch from '../DetailSearch';
import DetailTable from '../DetailTable';

import Style from './style.less';

const { Head, Left, Right, Body } = Content;
const formatTime = (time) => moment(time).format('YYYY-MM-DD HH:mm:ss');

class SuccDetail extends PureComponent {
  render() {
    const {
      loadings,
      detailInfo: {
        msgId,
        msgTitle,
        sendTime,
        realSendTime,
        operateTime,
        operator,
        msgSendType,
        customers,
      },
    } = this.props;
    const isTiming = msgSendType > 0
    return (
      <div className={Style['msgrecord-detail']}>
        <BackButton />
        <Spin spinning={loadings.$getDetail}>
          <Descriptions title={`消息主题：${msgTitle}`}>
            {isTiming && <Descriptions.Item label="设置发送时点">{sendTime}</Descriptions.Item>}
            <Descriptions.Item label="实际发送时点" span={isTiming ? 2 : 1}>
              {formatTime(realSendTime)}
            </Descriptions.Item>
            {isTiming && (
              <Descriptions.Item label="操作时点">{formatTime(operateTime)}</Descriptions.Item>
            )}
            <Descriptions.Item label="操作人">{operator}</Descriptions.Item>
          </Descriptions>
        </Spin>
        <Divider />
        <Head className="f-clearfix">
          <Left>
            <DetailSearch />
          </Left>
          <Right>
            <Authority code="551">
              <ResendBtn />
            </Authority>
          </Right>
        </Head>
        <Body>
          <DetailTable />
        </Body>
      </div>
    );
  }
}
export default connect(({ detailInfo, loadings }) => ({ detailInfo, loadings }))(SuccDetail);
