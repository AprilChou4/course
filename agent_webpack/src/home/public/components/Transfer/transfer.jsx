import React, { Component } from 'react';
import PureRenderMixin from 'rc-util/lib/PureRenderMixin';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import 'core-js/fn/array/includes';
import SelectList from './selectList';
import Operation from './operation';
import { prefixCls } from './constants';

function noop() {}

export default class Transfer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      leftSource: [],
      rightSrouce: [],
      sourceSelectedKeys: [],
      targetSelectedKeys: [],
    };
  }

  componentWillMount() {
    this.initStateByProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource, targetKeys, selectedKeys } = this.props;
    if (
      nextProps.dataSource !== dataSource ||
      nextProps.targetKeys !== targetKeys ||
      nextProps.selectedKeys !== selectedKeys
    ) {
      this.initStateByProps(nextProps, true);
    }
  }

  shouldComponentUpdate(...args) {
    return PureRenderMixin.shouldComponentUpdate.apply(this, args);
  }

  getSelectedKeysName = (direction) => {
    return direction === 'left' ? 'sourceSelectedKeys' : 'targetSelectedKeys';
  };

  initStateByProps = (props, update) => {
    const {
      sourceSelectedKeys: oldSourceSelectedKeys,
      targetSelectedKeys: oldTargetSelectedKeys,
    } = this.state;
    const leftSource = [];
    const rightSrouce = new Array(props.targetKeys.length);
    const sourceSelectedKeys = [];
    const targetSelectedKeys = [];

    props.dataSource.forEach((item) => {
      if (props.rowKey) {
        item.key = props.rowKey(item); // eslint-disable-line
      }

      // rightSource should be ordered by targetKeys
      // leftSource should be ordered by dataSource
      const indexOfKey = props.targetKeys.indexOf(item.key);
      if (indexOfKey !== -1) {
        rightSrouce[indexOfKey] = item;
      } else {
        leftSource.push(item);
      }

      if (!props.selectedKeys && update) {
        // fitler not exist keys
        if (oldSourceSelectedKeys.includes(item.key) && !props.targetKeys.includes(item.key)) {
          sourceSelectedKeys.push(item.key);
        }
        if (oldTargetSelectedKeys.includes(item.key) && props.targetKeys.includes(item.key)) {
          targetSelectedKeys.push(item.key);
        }
      }
    });

    if (props.selectedKeys) {
      props.selectedKeys.forEach((key) => {
        if (props.targetKeys.includes(key)) {
          targetSelectedKeys.push(key);
        } else {
          sourceSelectedKeys.push(key);
        }
      });
    }

    this.setState({
      leftSource,
      rightSrouce,
      sourceSelectedKeys,
      targetSelectedKeys,
    });
  };

  handleSelect = (direction, selectedKeys) => {
    const { oldSelectedKeys, onSelectChange } = this.props;
    const { sourceSelectedKeys, targetSelectedKeys } = this.state;

    const leftKeys = direction === 'left' ? selectedKeys : sourceSelectedKeys;
    const rightKeys = direction === 'right' ? selectedKeys : targetSelectedKeys;

    if (onSelectChange) {
      onSelectChange(leftKeys, rightKeys);
    }

    if (!oldSelectedKeys) {
      this.setState({
        sourceSelectedKeys: leftKeys,
        targetSelectedKeys: rightKeys,
      });
    }
  };

  moveTo = (direction) => {
    const { targetKeys = [], dataSource = [], onChange } = this.props;
    const { sourceSelectedKeys, targetSelectedKeys } = this.state;
    const moveKeys = direction === 'right' ? sourceSelectedKeys : targetSelectedKeys;

    const newMoveKeys = [];
    // disable key can be selected in props, so there should fitler disabled keys
    dataSource.forEach((item) => {
      if (!item.disabled && moveKeys.includes(item.key)) {
        newMoveKeys.push(item.key);
      }
    });
    // move items to target box
    const newTargetKeys =
      direction === 'right'
        ? newMoveKeys.concat(targetKeys)
        : targetKeys.filter((targetKey) => newMoveKeys.indexOf(targetKey) === -1);
    // empty checked keys
    const oppositeDirection = direction === 'right' ? 'left' : 'right';
    this.setState({
      [this.getSelectedKeysName(oppositeDirection)]: [],
    });
    this.handleSelect(oppositeDirection, []);
    if (onChange) {
      onChange(newTargetKeys, direction, newMoveKeys);
    }
  };

  moveToLeft = () => {
    this.moveTo('left');
  };

  moveToRight = () => {
    this.moveTo('right');
  };

  render() {
    const {
      titles,
      className,
      filterOption,
      showSearch,
      footer,
      notFoundContent,
      searchPlaceholder,
      render,
      rowHeight,
      listStyle,
      operations,
    } = this.props;
    const { sourceSelectedKeys, targetSelectedKeys, leftSource, rightSrouce } = this.state;
    const leftActive = targetSelectedKeys.length > 0;
    const rightActive = sourceSelectedKeys.length > 0;

    const cls = classNames(
      {
        [`${prefixCls}`]: true,
      },
      className,
    );

    return (
      <div className={cls}>
        <SelectList
          dataSource={leftSource}
          render={render}
          selectedKeys={sourceSelectedKeys}
          handleSelect={(selectedKeys) => this.handleSelect('left', selectedKeys)}
          showSearch={showSearch}
          filterOption={filterOption}
          itemsUnit="items"
          itemUnit="item"
          titleText={titles[0]}
          rowHeight={rowHeight}
          style={listStyle}
          footer={footer}
          notFoundContent={notFoundContent}
          searchPlaceholder={searchPlaceholder}
        />
        <Operation
          className={`${prefixCls}-operation`}
          leftActive={leftActive}
          rightActive={rightActive}
          moveToLeft={this.moveToLeft}
          moveToRight={this.moveToRight}
          leftArrowText={operations[0]}
          rightArrowText={operations[1]}
        />
        <SelectList
          dataSource={rightSrouce}
          render={render}
          selectedKeys={targetSelectedKeys}
          handleSelect={(selectedKeys) => this.handleSelect('right', selectedKeys)}
          showSearch={showSearch}
          filterOption={filterOption}
          itemsUnit="items"
          itemUnit="item"
          titleText={titles[1]}
          rowHeight={rowHeight}
          style={listStyle}
          footer={footer}
          notFoundContent={notFoundContent}
          searchPlaceholder={searchPlaceholder}
        />
      </div>
    );
  }
}

Transfer.defaultProps = {
  dataSource: [],
  selectedKeys: undefined,
  onSelectChange: undefined,
  titles: ['', ''],
  className: undefined,
  filterOption: undefined,
  listStyle: {
    width: 200,
    height: 300,
  },
  operations: ['', ''],
  showSearch: false,
  footer: noop,
  notFoundContent: 'Not Found',
  searchPlaceholder: 'Search here',
  rowKey: undefined,
  onChange: undefined,
};

Transfer.propTypes = {
  dataSource: PropTypes.array,
  render: PropTypes.func.isRequired,
  targetKeys: PropTypes.array.isRequired,
  selectedKeys: PropTypes.array,
  onChange: PropTypes.func,
  onSelectChange: PropTypes.func,
  listStyle: PropTypes.shape({
    height: PropTypes.number.isRequired, // 只支持 number，不支持 %
    width: PropTypes.any,
  }),
  className: PropTypes.string,
  titles: PropTypes.array,
  operations: PropTypes.array,
  showSearch: PropTypes.bool,
  filterOption: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  notFoundContent: PropTypes.string,
  rowHeight: PropTypes.number.isRequired,
  footer: PropTypes.func,
  rowKey: PropTypes.func, // eslint-disable-line
};
