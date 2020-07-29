// 系统消息 > 我的提问 > 详情
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'nuomi';
import moment from 'moment';
import { Spin, Descriptions } from 'antd';
import Content from '@components/Content';
import BackButton from '../BackButton';
import UploadImg from '../../UploadImg';

import Style from './style.less';

const { Head, Left } = Content;
const formatTime = (time) => moment(time).format('YYYY-MM-DD HH:mm:ss');
class SystemDetail extends PureComponent {
  componentDidMount() {
    const {
      dispatch,
      currRecord: { suggestId },
    } = this.props;
    dispatch({
      type: '$getQuesDetail',
      payload: {
        suggestId,
      },
    });
  }

  render() {
    // isReply 是否回复 0-未回复  1-已回复;  replyIsRead 回复是否已读 0-未读  1-已读
    const {
      quesDetail: {
        title,
        content,
        contact,
        filePath,
        replyUserName,
        replyContent,
        isReply,
        addTime,
        replyTime,
      },
      loadings,
    } = this.props;
    const fileArr = filePath ? filePath.split(';') : [];
    return (
      <Spin spinning={loadings.$getQuesDetail}>
        <div className={Style['ques-detail']}>
          <Head className="f-clearfix">
            <Left>
              <BackButton />
            </Left>
          </Head>

          <div className={Style['m-body']}>
            <Descriptions
              className={Style['m-cont']}
              title={
                <h3>
                  {title || '--'}
                  <small className="f-fr">{formatTime(addTime)}</small>
                </h3>
              }
              column={1}
            >
              <Descriptions.Item label="内容">{content || '--'}</Descriptions.Item>
              <Descriptions.Item label="图片">
                {fileArr.length
                  ? fileArr.map((item, index) => <UploadImg key={index} fileList={[item]} />)
                  : '--'}
              </Descriptions.Item>
              <Descriptions.Item label="联系方式">{contact || '--'}</Descriptions.Item>
            </Descriptions>
            {isReply === 1 && (
              <Descriptions
                title={
                  <h3>
                    回复：<small className="f-fr">{formatTime(replyTime)}</small>
                  </h3>
                }
                column={1}
                className={Style['m-reply']}
              >
                <Descriptions.Item label="回复内容">
                  {/* eslint-disable-next-line */}
                  <span dangerouslySetInnerHTML={{ __html: replyContent }}></span>
                </Descriptions.Item>
              </Descriptions>
            )}
          </div>
        </div>
      </Spin>
    );
  }
}
export default connect(({ loadings, quesDetail, currRecord }) => ({
  loadings,
  quesDetail,
  currRecord,
}))(SystemDetail);
