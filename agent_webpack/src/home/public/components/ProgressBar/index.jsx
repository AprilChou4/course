// 带提示信息的进度条
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'antd';
import './style.less';

class ProgressBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      percent: 0, // 进度条的值
    };
  }

  componentDidMount() {
    this.setPercent();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  //
  setPercent = () => {
    const { fig } = this.props;
    const { percent } = this.state;
    if (fig) {
      this.setState({
        percent: 100,
      });
      return false;
    }
    if (percent < 99) {
      this.setState({
        percent: percent + 1,
      });
      this.timer = setTimeout(() => {
        this.setPercent();
      }, 50);
    }
  };

  render() {
    const { percent } = this.state;
    const { subtitle, msg } = this.props;
    return (
      <div className="ui-progressBar">
        <div className="line-1">
          {subtitle}
          <span className="dot-box">
            ... <i className="dot-cover" />
          </span>
        </div>
        <Progress
          percent={percent}
          showInfo={false}
          strokeWidth={16}
          // strokeColor={{
          //   from: '#108ee9',
          //   to: '#87d068',
          // }}
          // strokeColor={{
          //   from: '#00C0FF',
          //   to: '#008CFF',
          // }}
        />
        <div className="line-3">
          {msg}
          <span className="rate">{percent}%</span>
          ...请耐心等待
        </div>
      </div>
    );
  }
}
ProgressBar.propTypes = {
  // 进度条名称
  subtitle: PropTypes.string,
  // 进度条提示信息名称
  msg: PropTypes.string,
  // fig=是否完成
};
export default ProgressBar;
