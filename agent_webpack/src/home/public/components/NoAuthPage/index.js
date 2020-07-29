import React, { PureComponent } from 'react';
import './style.less';

class NoAuthPage extends PureComponent {
  render() {
    return (
      <div className="ui-noAuthPage">
        <p>您暂无当前页面的查看权限，如需操作请联系公司管理员</p>
      </div>
    );
  }
}
export default NoAuthPage;
