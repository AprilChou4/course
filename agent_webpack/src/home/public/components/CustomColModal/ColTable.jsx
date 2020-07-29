import React, { Component } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';

let dragingIndex = -1;

class BodyRow extends React.Component {
  render() {
    const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
    const style = { ...restProps.style, cursor: 'move' };

    let { className } = restProps;
    if (isOver) {
      if (restProps.index > dragingIndex) {
        className += ' drop-over-downward';
      }
      if (restProps.index < dragingIndex) {
        className += ' drop-over-upward';
      }
    }

    return connectDragSource(
      connectDropTarget(<tr {...restProps} className={className} style={style} />),
    );
  }
}

// 拖动开始时触发的事件
const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

//  组件放下时触发的事件
const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Time to actually perform the action
    props.moveRow(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))(
  DragSource('row', rowSource, (connect) => ({
    connectDragSource: connect.dragSource(),
  }))(BodyRow),
);

// const columnSource = [
//   {
//     key: '1',
//     name: '纳税性质',
//   },
//   {
//     key: '2',
//     name: '行业类型',
//   },
//   {
//     key: '3',
//     name: '常用联系人',
//   },
// ];
class DragSortingTable extends Component {
  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      // 所有可选列数据
      data: props.columnData,
      selectedRowKeys: props.columnData.filter((ele) => ele.selected).map((ele) => ele.fieldName),
    };
  }

  componentWillReceiveProps(nextProps) {
    const { columnData } = this.props;

    if (nextProps.columnData !== columnData) {
      this.setState({
        data: nextProps.columnData,
      });
    }
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];
    if (hoverIndex === 0 || dragIndex === 0) return;
    this.setState(
      update(this.state, {
        data: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
        },
      }),
      () => {
        this.saveCol();
      },
    );
  };

  // 复选框改变/拖拽/保存列
  saveCol = () => {
    const { data, selectedRowKeys } = this.state;
    const { saveColumnSource } = this.props;
    saveColumnSource(
      data.map((ele, index) => {
        const selected = selectedRowKeys.includes(ele.fieldName);
        return { ...ele, selected, sort: index + 1 };
      }),
    );
  };

  render() {
    const { data, selectedRowKeys } = this.state;
    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 100,
        render: (text, record, index) => index + 1,
      },
      {
        title: '可选信息',
        dataIndex: 'fieldName',
        key: 'fieldName',
        width: 300,
      },
    ];
    return (
      <Table
        bordered
        columns={columns}
        dataSource={data}
        components={this.components}
        rowKey={(record) => record.fieldName}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            this.setState({ selectedRowKeys }, () => {
              this.saveCol();
            });
          },
          getCheckboxProps: (record) => {
            return {
              disabled: record.fieldKey === 'customerName',
              name: record.fieldKey,
            };
          },
        }}
        scroll={{ y: 410 }}
        pagination={false}
        // size="middle"
        onRow={(record, index) => ({
          index,
          moveRow: this.moveRow,
        })}
      />
    );
  }
}
DragSortingTable.defaultProps = {
  columnData: [],
};
DragSortingTable.propTypes = {
  /**
   * 保存自定义列数据
   * @param {Array} *data 自定义列数据
   */
  saveColumnSource: PropTypes.func.isRequired,
  columnData: PropTypes.array,
};
const CustomCol = DragDropContext(HTML5Backend)(DragSortingTable);
export default CustomCol;
