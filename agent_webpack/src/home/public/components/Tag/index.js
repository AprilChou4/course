// 服务类型图标
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import './style.less';

class SeviceTag extends PureComponent {
  render() {
    const { list } = this.props;
    return (
      <div>
        {list.map((val, index) => {
          let name = '';
          let color = '';
          switch (val) {
            case '代理记账':
              name = '账';
              color = '#008CFF';
              break;
            case '工商注册':
              name = '商';
              color = '#59D49E';
              break;
            case '代理开票':
              name = '代';
              color = '#EC4343';
              break;
            case '代理申报':
              name = '报';
              color = '#926DFC';
              break;
            default:
              name = val.substring(0, 1);
              color = '#F6A327';
          }
          return (
            name && (
              <Tag className="ui-tag" key={index} color={color}>
                {name}
              </Tag>
            )
          );
        })}
      </div>
    );
  }
}
Tag.defaultProps = {
  list: [],
};
Tag.propTypes = {
  list: PropTypes.array,
};
export default SeviceTag;
