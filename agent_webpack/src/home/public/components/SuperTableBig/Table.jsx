import React, { Component } from 'react';
import { Table as AntdTable } from 'antd';
// import { connect } from 'nuomi';

class Table extends Component {
  shouldComponentUpdate(nextProps) {
    return !nextProps.scrolling;
  }

  render() {
    const { scrolling, ...props } = this.props;
    return <AntdTable {...props} />;
  }
}

// export default Table;
export default Table;
