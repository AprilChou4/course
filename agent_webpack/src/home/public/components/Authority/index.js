import React, { PureComponent } from 'react';
import data from 'data';

const authoritys = data.get('authority');

class Authority extends PureComponent {
  render() {
    const { code, children } = this.props;
    if (code === true || authoritys[code]) {
      return children;
    }
    return null;
  }
}

Authority.defaultProps = {
  code: true,
};

export default Authority;
