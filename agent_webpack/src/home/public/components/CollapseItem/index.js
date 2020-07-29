// 收起、展开伸缩框
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'antd';
import './style.less';

const { Panel } = Collapse;

class CollapseItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeKey: [],
    };
  }

  changePanel = (key) => {
    this.setState({
      activeKey: key,
    });
  };

  render() {
    const { activeKey } = this.state;
    const { getContent, className, ...rest } = this.props;
    return (
      <Collapse className={`ui-collapse ${className}`} onChange={this.changePanel}>
        <Panel
          header="展示"
          showArrow={false}
          extra={
            <a className="ui-blue">
              {activeKey.length ? '收起' : '详情'}
              <i className="iconfont">&#xe714;</i>
            </a>
          }
          {...rest}
        >
          {getContent()}
        </Panel>
      </Collapse>
    );
  }
}

CollapseItem.defaultProps = {
  /**
   * @func 获取更多功能内容
   * @return {React Node}
   */
  getContent() {},
};

CollapseItem.propTypes = {
  getContent: PropTypes.func,
};
export default CollapseItem;
