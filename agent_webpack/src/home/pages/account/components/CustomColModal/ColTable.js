/**
 * 自定义显示列
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Radio } from 'antd';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { connect } from 'nuomi';

const RadioGroup = Radio.Group;
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

const rowSource = {
  beginDrag(props) {
    dragingIndex = props.index;
    return {
      index: props.index,
    };
  },
};

const rowTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // 第一、二行不允许拖动，且固定序号
    if (dragIndex < 2 || hoverIndex < 2) {
      return;
    }

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

@connect(({ columnSource, enabledReview }) => ({
  columnSource,
  enabledReview,
}))
class DragSortingTable extends React.PureComponent {
  static propTypes = {
    saveData: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    let { columnSource, enabledReview } = props;
    // 不允许审核时隐藏 审核状态 列
    if (!enabledReview) {
      columnSource = columnSource.filter((item) => item.key !== '审核状态');
    }
    this.state = {
      // 所有可选列数据
      data: columnSource,
      selectedRowKeys: columnSource.filter((ele) => ele.selected !== false).map((ele) => ele.key),
    };
  }

  componentDidMount() {
    this.saveCol();
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  saveCol = () => {
    const { data, selectedRowKeys } = this.state;
    this.props.saveData(
      data.map((ele) => {
        const selected = selectedRowKeys.includes(ele.key);
        return { ...ele, selected };
      }),
    );
  };

  moveRow = (dragIndex, hoverIndex) => {
    const { data } = this.state;
    const dragRow = data[dragIndex];

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

  onNumberChange = (e) => {
    const { value } = e.target;
    const { data } = this.state;
    this.setState(
      {
        data: data.map((i) => {
          if (i.key === '编号') {
            i = { ...i, type: value };
          }
          return i;
        }),
      },
      () => {
        this.saveCol();
      },
    );
  };

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys }, () => {
          this.saveCol();
        });
      },
      getCheckboxProps: (record) => ({
        disabled: record.key === '账套名称',
        name: record.key,
      }),
    };

    const columns = [
      {
        title: '序号',
        dataIndex: 'index',
        width: 100,
        render: (text, record) => record.index + 1,
      },
      {
        title: '可选信息',
        width: 300,
        dataIndex: 'key',
        render: (text, record) => {
          const { type, key } = record;
          if (type) {
            return (
              <div>
                编号：
                <RadioGroup onChange={this.onNumberChange} defaultValue={type}>
                  <Radio value="index">建账顺序</Radio>
                  <Radio value="customerCode">客户编码</Radio>
                </RadioGroup>
              </div>
            );
          }
          return text;
        },
      },
    ];

    const dataSource = this.state.data.map((item, i) => ({ ...item, index: i }));

    return (
      <Table
        columns={columns}
        dataSource={dataSource}
        components={this.components}
        rowSelection={rowSelection}
        pagination={false}
        size="middle"
        scroll={{ y: 360 }}
        bordered
        className="table-md-td-36"
        onRow={(record, index) => ({
          index,
          moveRow: this.moveRow,
        })}
      />
    );
  }
}

const CustomCol = DragDropContext(HTML5Backend)(DragSortingTable);

export default CustomCol;
