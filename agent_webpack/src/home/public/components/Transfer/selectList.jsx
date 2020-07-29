import React, { Component } from 'react';
import PureRenderMixin from 'rc-util/lib/PureRenderMixin';
import { List } from 'react-virtualized';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Checkbox } from 'antd';
import { debounce } from 'lodash';
import Item from './item';
import Search from './search';
import { prefixCls } from './constants';

function noop() {}

function isRenderResultPlainObject(result) {
  return (
    result &&
    !React.isValidElement(result) &&
    Object.prototype.toString.call(result) === '[object Object]'
  );
}

export default class SelectList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: '',
      dataSource: [],
    };
    this.handleFilterWithDebounce = debounce(this.handleFilter.bind(this), 200);
  }

  componentWillMount() {
    const { dataSource } = this.props;
    this.setState({
      dataSource,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { dataSource } = this.props;
    const { filter } = this.state;
    if (nextProps.dataSource !== dataSource) {
      if (filter !== '') {
        this.handleFilter(nextProps.dataSource, filter);
      } else {
        this.setState({
          dataSource: nextProps.dataSource,
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (PureRenderMixin.shouldComponentUpdate.apply(this, nextProps, nextState)) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    /**
     * 有时会是冗余，但每次调用forceUpdateGrid都是确保正确更新的最简单方法
     */
    this.list.forceUpdateGrid();
  }

  handleFilter = (dataSource, filter) => {
    const showItems = [];
    dataSource.map((item) => {
      if (!this.matchFilter(filter, item)) {
        return null;
      }
      showItems.push(item);
      return item;
    });
    this.setState(
      {
        dataSource: showItems,
      },
      () => {
        /* TODO: 可以滚动到用户正在查看的位置 */
        this.list.scrollToRow(0);
      },
    );
  };

  getCheckStatus = () => {
    const { selectedKeys } = this.props;
    const { dataSource } = this.state;
    if (selectedKeys.length === 0) {
      return 'none';
    }
    if (dataSource.every((item) => item.disabled || selectedKeys.indexOf(item.key) >= 0)) {
      return 'all';
    }
    return 'part';
  };

  handleSelect = (selectedItem) => {
    const { selectedKeys, handleSelect } = this.props;
    const hoder = [...selectedKeys];
    const index = hoder.indexOf(selectedItem.key);
    if (index > -1) {
      hoder.splice(index, 1);
    } else {
      hoder.push(selectedItem.key);
    }
    handleSelect(hoder);
  };

  handleSelectAll = (checkAll) => {
    const { dataSource } = this.state;
    const { selectedKeys, handleSelect } = this.props;
    const hoder = [...selectedKeys];
    let index;
    if (!checkAll) {
      dataSource.map((item) => {
        if (!item.disabled && hoder.indexOf(item.key) < 0) {
          hoder.push(item.key);
        }
        return item;
      });
    } else {
      dataSource.map((item) => {
        index = hoder.indexOf(item.key);
        if (index > -1) {
          hoder.splice(index, 1);
        }
        return item;
      });
    }
    handleSelect(hoder);
  };

  handleFilterWapper = (e) => {
    const { dataSource } = this.props;
    const { value } = e.target;
    this.handleFilterWithDebounce(dataSource, value);
    this.setState({
      filter: value,
    });
  };

  matchFilter = (filter, item) => {
    const { filterOption } = this.props;
    if (filterOption) {
      return filterOption(filter, item);
    }
    const { renderedText } = this.renderItem(item);
    return renderedText.indexOf(filter) >= 0;
  };

  handleClear = () => {
    const { dataSource } = this.props;
    this.setState({
      dataSource,
      filter: '',
    });
  };

  rowRenderer = ({ _key, index, _isScrolling, _isVisible, _parent, style }) => {
    const { rowKey, selectedKeys } = this.props;
    const { dataSource } = this.state;
    const item = dataSource[index] || {};
    const { renderedText, renderedEl } = this.renderItem(item);
    const checked = selectedKeys.indexOf(item.key) >= 0;
    const itemPrefixCls = `${prefixCls}-list`;

    if (rowKey) {
      item.key = rowKey(item);
    }

    return (
      <Item
        key={item.key}
        item={item}
        checked={checked}
        style={style}
        renderedText={renderedText}
        renderedEl={renderedEl}
        disabled={item.disabled}
        onClick={this.handleSelect}
        prefixCls={itemPrefixCls}
      />
    );
  };

  renderItem = (item) => {
    const { render = noop } = this.props;
    const renderResult = render(item);
    const isRenderResultPlain = isRenderResultPlainObject(renderResult);
    return {
      renderedText: isRenderResultPlain ? renderResult.value : renderResult,
      renderedEl: isRenderResultPlain ? renderResult.label : renderResult,
    };
  };

  render() {
    const {
      footer,
      showSearch,
      showHeader,
      rowHeight,
      selectedKeys,
      itemUnit,
      itemsUnit,
      titleText,
      style,
      notFoundContent,
      searchPlaceholder,
    } = this.props;
    const { dataSource, filter } = this.state;

    const className = classNames({
      [`${prefixCls}-list`]: true,
    });

    const footerDom = footer(Object.assign({}, this.props));

    const listFooter = footerDom ? (
      <div className={`${prefixCls}-list-footer`}>{footerDom}</div>
    ) : null;

    const checkStatus = this.getCheckStatus();
    const checkedAll = checkStatus === 'all';
    const checkAllCheckbox = (
      <Checkbox
        checked={checkedAll}
        indeterminate={checkStatus === 'part'}
        onChange={() => this.handleSelectAll(checkedAll)}
      />
    );
    const unit = dataSource.length > 1 ? itemsUnit : itemUnit;

    // height is not 100%, so there should minus 2px of the boder of transfer-list
    let bodyHeight = style.height - 2;
    bodyHeight = showHeader ? bodyHeight - 33 : bodyHeight;
    bodyHeight = showSearch ? bodyHeight - 38 : bodyHeight;
    bodyHeight = listFooter !== null ? bodyHeight - 32 : bodyHeight;

    const header = showHeader ? (
      <div className={`${prefixCls}-list-header`}>
        {checkAllCheckbox}
        <span className={`${prefixCls}-list-header-selected`}>
          <span>
            {(selectedKeys.length > 0 ? `${selectedKeys.length}/` : '') + dataSource.length} {unit}
          </span>
          <span className={`${prefixCls}-list-header-title`}>{titleText}</span>
        </span>
      </div>
    ) : null;

    const search = showSearch ? (
      <Search
        value={filter}
        onChange={this.handleFilterWapper}
        handleClear={this.handleClear}
        prefixCls={`${prefixCls}-list-search`}
        placeholder={searchPlaceholder}
      />
    ) : null;

    return (
      <div className={className} style={style}>
        {header}
        {search}
        <List
          ref={(list) => {
            this.list = list;
          }}
          height={dataSource.length === 0 ? 0 : bodyHeight}
          rowCount={dataSource.length}
          rowHeight={rowHeight}
          rowRenderer={this.rowRenderer}
          width={1}
          className={`${prefixCls}-list-virtualized`}
        />
        {dataSource.length === 0 && (
          <div
            className={`${prefixCls}-list-body-not-found`}
            style={{
              height: `${bodyHeight}px`,
              lineHeight: `${bodyHeight}px`,
            }}
          >
            {notFoundContent}
          </div>
        )}
        {listFooter}
      </div>
    );
  }
}

SelectList.defaultProps = {
  filterOption: undefined,
  footer: noop,
  showSearch: false,
  showHeader: true,
  itemUnit: '',
  itemsUnit: '',
  titleText: '',
  style: {
    width: 200,
    height: 300,
  },
  notFoundContent: 'Not Found',
  searchPlaceholder: 'Search here',
  rowKey: undefined,
};

SelectList.propTypes = {
  render: PropTypes.func.isRequired,
  dataSource: PropTypes.array.isRequired,
  selectedKeys: PropTypes.array.isRequired,
  handleSelect: PropTypes.func.isRequired,
  filterOption: PropTypes.func,
  footer: PropTypes.func,
  showSearch: PropTypes.bool,
  showHeader: PropTypes.bool,
  itemUnit: PropTypes.string,
  itemsUnit: PropTypes.string,
  titleText: PropTypes.string,
  rowHeight: PropTypes.number.isRequired,
  style: PropTypes.shape({
    height: PropTypes.number.isRequired, // 只支持 number，不支持 %
    width: PropTypes.any,
  }),
  notFoundContent: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  rowKey: PropTypes.func,
};
