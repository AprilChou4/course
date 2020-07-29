// 第三方导入弹窗 > 选择新增客户弹窗 > 导入进度
import React, { Component } from 'react';
import { Progress, Button } from 'antd';
import { connect } from 'nuomi';
import Style from './style.less';

class ProgressItem extends Component {
  componentDidMount() {
    this.setPercent();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // 获取导入进度
  setPercent = async () => {
    const { dispatch } = this.props;
    dispatch({
      type: '$getTaskStatus',
    });
  };

  // 关闭
  close = () => {
    const { dispatch } = this.props;
    dispatch({
      type: '$deleteBatchImportTask',
    });
    dispatch({
      type: '$serviceCustomerList',
    });
  };

  // 导入结果
  result = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateState',
      payload: {
        importResultVisible: true,
      },
    });
  };

  render() {
    const { thirdProgressPercent, thirdProgressStatus } = this.props;
    return (
      <div className={Style['m-importProgress']}>
        <div className="f-fl">
          <Progress percent={thirdProgressPercent} status="normal" />
          {/* <p className={Style['m-text']}>
            {
              [
                <span>
                  总共创建<em>11</em>个客户，已经创建<em>11</em>个客户，剩于<em>11</em>个客户建账中
                </span>,
                <span>
                  总共创建<em>11</em>个客户，已经创建<em>11</em>个客户，剩于<em>11</em>
                  个客户建账失败
                </span>,
                <span>
                  恭喜您，数据导入成功！总共创建<em>11</em>个客户
                </span>,
              ][thirdProgressStatus]
            }
          </p> */}
        </div>
        <div className={`f-fr ${Style['m-btngroup']}`}>
          {thirdProgressStatus === 1 || thirdProgressStatus === 2 ? (
            <Button type="primary" size="small" ghost className="e-mr8" onClick={this.close}>
              {thirdProgressStatus === 2 ? '完成' : '关闭'}
            </Button>
          ) : (
            ''
          )}
          {thirdProgressStatus === 1 && (
            <Button type="primary" size="small" onClick={this.result}>
              导入结果
            </Button>
          )}
        </div>
      </div>
    );
  }
}
export default connect(({ thirdProgressPercent, thirdProgressStatus }) => ({
  thirdProgressPercent,
  thirdProgressStatus,
}))(ProgressItem);
