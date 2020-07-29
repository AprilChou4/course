import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Table } from 'antd';
import './style.less';

class SuperTable extends PureComponent {
  constructor(props) {
    super(props);
    this.table = React.createRef();
    this.state = {
      y: 0,
    };
  }

  componentDidMount() {
    // 绑定窗口大小改变事件以自适应表格
    window.addEventListener(
      'resize',
      (this.resize = () => {
        // 函数防抖
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.setHeight();
        }, 100);
      }),
    );
    this.setHeight();
  }

  // 之前是放在componentWillReceiveProps中，第一次渲染的时候dataSource为空pagination不存在，导致高度计算错误
  componentDidUpdate(nextProps) {
    if (
      nextProps.dataSource !== this.props.dataSource ||
      nextProps.pagination !== this.props.pagination ||
      nextProps.title !== this.props.title ||
      nextProps.footer !== this.props.footer
    ) {
      this.setHeight();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  setHeight() {
    const table = ReactDOM.findDOMNode(this.table.current);
    const title = table.querySelector('.ant-table-title');
    const thead = table.querySelector('.ant-table-thead');
    const pagination = table.querySelector('.ant-table-pagination');
    const footer = table.querySelector('.ant-table-footer');
    let y = table.parentNode.offsetHeight;
    // 头部高度
    if (title) {
      y -= title.offsetHeight;
    }
    // 表头高度
    if (thead) {
      y -= thead.offsetHeight;
    }
    // 分页高度
    if (pagination) {
      y -= pagination.offsetHeight + 24;
    }
    // 底部高度
    if (footer) {
      y -= footer.offsetHeight;
    }
    this.setState({
      y,
    });
  }

  render() {
    const { className, scroll, ...rest } = this.props;
    const { y } = this.state;
    return (
      <Table
        className={`ant-supertable ${className || ''}`}
        bordered
        {...rest}
        scroll={{
          x: scroll ? scroll.x : 0,
          y,
        }}
        ref={this.table}
      />
    );
  }
}

export default SuperTable;
