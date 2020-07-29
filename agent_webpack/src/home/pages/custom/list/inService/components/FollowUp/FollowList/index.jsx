// 客户跟进
import React, { Component } from 'react';
import { List, message, Spin } from 'antd';
import { connect } from 'nuomi';

import InfiniteScroll from 'react-infinite-scroller';
import Style from './style.less';

class FollowList extends Component {
  constructor(props) {
    super(props);
    this.scrollParentRef = null;
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: '$getFollowList',
    });
  }

  componentWillReceiveProps() {
    const { followCurrent } = this.props;
    if (followCurrent === 1) {
      this.scrollParentRef.scrollTop = 0;
    }
  }

  fetchData = (callback) => {
    const { dispatch, followCurrent } = this.props;
    dispatch({
      type: '$getFollowList',
      payload: {
        current: followCurrent + 1,
      },
    }).then((res) => {
      callback(res);
    });
  };

  handleInfiniteOnLoad = () => {
    const { dispatch, followList, followCurrent, followListTotal } = this.props;
    this.setState({
      loading: true,
    });
    if (followList.length >= followListTotal) {
      message.warning('已全部加载~');
      this.setState({
        loading: false,
      });
      dispatch({
        type: 'updateState',
        payload: {
          isFollowHasMore: false,
        },
      });
      return;
    }
    this.fetchData((res) => {
      const list = [...followList, ...res.list];
      dispatch({
        type: 'updateState',
        payload: {
          followList: list,
          followCurrent: followCurrent + 1,
        },
      });
      this.setState({
        loading: false,
      });
    });
  };

  // 删除跟进信息
  delFollowRecord = (item) => {
    const { dispatch } = this.props;
    dispatch({
      type: '$delFollow',
      payload: {
        customerFollowId: item.customerFollowId,
      },
    });
  };

  // 编辑跟进信息
  editFollowRecord = (item) => {
    const { dispatch, mentionInput } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        editFollowItem: item,
      },
    });
    mentionInput.current.onFocus();
  };

  render() {
    const { loading } = this.state;
    const { loadings, followList, isFollowHasMore } = this.props;
    return (
      <div className={Style['m-followUpList']} ref={(ref) => (this.scrollParentRef = ref)}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!loading && isFollowHasMore}
          useWindow={false}
        >
          <List
            loading={
              loadings.$getFollowList ||
              !!loadings.$delFollow ||
              !!loadings.$addFollow ||
              !!loadings.$updateFollow
            }
            dataSource={followList}
            renderItem={(item) => (
              <List.Item key={item.id}>
                <div style={{ width: '100%' }}>
                  <div className="f-clearfix">
                    <i className={`iconfont f-fl ${Style['m-icon']}`}>&#xec47;</i>
                    <span className={`f-fl ${Style['m-cont']}`}>{item.content}</span>
                    <span className={`f-fr ${Style['m-time']}`}>{item.operateTime}</span>
                  </div>
                  <span className={Style['m-addUserName']}>
                    <span>{item.operator}</span>
                    {item.edit ? (
                      <>
                        <a onClick={() => this.editFollowRecord(item)} className={Style['j-edit']}>
                          <i className="iconfont">&#xec48;</i>编辑
                        </a>
                        <a onClick={() => this.delFollowRecord(item)}>
                          <i className="iconfont">&#xec49;</i>删除
                        </a>
                      </>
                    ) : (
                      ''
                    )}
                  </span>
                </div>
              </List.Item>
            )}
          >
            {loading && isFollowHasMore && (
              <div className={Style['loading-container']}>
                <Spin />
              </div>
            )}
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}

export default connect(
  ({
    loadings,
    currRecord,
    followList,
    isFollowHasMore,
    followListTotal,
    followCurrent,
    mentionInput,
  }) => ({
    loadings,
    currRecord,
    followList,
    isFollowHasMore,
    followListTotal,
    followCurrent,
    mentionInput,
  }),
)(FollowList);
