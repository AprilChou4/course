import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import classnames from 'classnames';
import { router } from 'nuomi';
import util from '../../utils/util';
import Table from './Table';
// import VirtualTable from './VirtualTable';
import './style.less';

const prefix = ['', '-ms-', '-moz-', '-webkit-'];

class SuperTable extends PureComponent {
  constructor(...args) {
    super(...args);
    // 记忆宽度
    this.isNoDataClassName = '';
    this.remenber = {};
    // 记忆带id的宽度
    this.remenberId = {};
    this.state = {
      y: 0,
      columns: this.getColumns(this.props),
      dataSource: [],
      virtualTableStyle: {},
    };
    this.tableRef = React.createRef();
    this.emptyCellRef = React.createRef();
    this.VirtualTableRef = React.createRef();
    // 当前表格外层容器
    this.tableWrapper = null;
    // 事件集合
    this.events = [];
    // 表格显示状态
    this.tableVisible = {};
    // 存储表格滚动容器dom和真实容器dom
    this.table = {
      middle: {},
      left: {},
      right: {},
    };
    // 表格滚动容器选择器
    this.selector = {
      middle: '.ant-table-scroll .ant-table-body',
      left: '.ant-table-fixed-left .ant-table-body-inner',
      right: '.ant-table-fixed-right .ant-table-body-inner',
    };
    // 表格偏移量
    this.translateY = 0;
    // 可视区域展示数量
    this.visibleAreaRowCount = 0;
    // 是否调用scrollTop和scrollTo方法进行滚动标记
    this.scrollFlag = false;
    // 拖拽相关
    this.drag = null;
  }

  componentDidMount() {
    // 导航缩小放大切换
    if (document.getElementById('collapsedId')) {
      this.bind(document.getElementById('collapsedId'), 'click', () => {
        setTimeout(() => {
          this.computedColumns();
        }, 200);
      });
    }
    // eslint-disable-next-line react/no-find-dom-node
    this.tableWrapper = ReactDOM.findDOMNode(this.tableRef.current);
    const { userAgent } = navigator;
    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1) {
      this.isNoDataClassName = 'isChromeClass';
    }
    this.bindResize();
    setTimeout(() => {
      const { pathname } = router.location();
      // 防止切换路由导致表格布局错乱问题
      this.unListener = router.listener((location) => {
        if (pathname === location.pathname) {
          // 优化性能问题，高度不变化，不计算
          if (this.setYHeight()) {
            this.computeVisibleAreaDataSource();
          }
        }
      });
      this.computedColumns();
    });
  }

  /* eslint-disable react/sort-comp */
  /* eslint-disable camelcase */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { columns: oldColumns } = this.props;
    // 当columns有改变或者rowSelection有改变
    if (oldColumns !== nextProps.columns || this.compareRowSelection(nextProps, this.props)) {
      if (oldColumns.length !== nextProps.columns.length) {
        this.remenberWidth(null);
      }
      const columns = this.getColumns(nextProps);
      this.setState({ columns }, () => {
        if (
          nextProps.dragCell &&
          (!this.computed || this.compareColumnsDiff(nextProps.columns, oldColumns))
        ) {
          this.computedColumns(columns);
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { dataSource, setRecalculate } = this.props;

    // setRecalculate 传参重新计算高度（表格头部高度变化等）不等于上一次传参就计算
    // 防止页面加载出来时高度计算错误问题
    if (dataSource.length && (!this.setY || this.setRecalculate !== setRecalculate)) {
      this.setY = true;
      this.setRecalculate = setRecalculate;
      this.setYHeight();
    }
    // 当dataSource有改变
    if (dataSource !== prevProps.dataSource) {
      this.computeVisibleAreaDataSource();
    }
  }

  componentWillUnmount() {
    // window.document.getElementById('collapsedId').removeEventListener('click', () => {}, false);
    this.unListener && this.unListener();
    this.unbind();
  }

  // eslint-disable-next-line class-methods-use-this
  createContainer(body) {
    const table = body.firstChild;
    const container = document.createElement('div');
    container.className = 'ant-table-body-container';
    body.appendChild(container);
    container.appendChild(table);
    return container;
  }

  querySelector(type) {
    return this.tableWrapper.querySelector(this.selector[type]);
  }

  create() {
    const status = this.getTableStatus();
    Object.keys(status).forEach((i) => {
      const table = this.table[i];
      if (status[i] === 'add') {
        table.body = this.querySelector(i);
        if (table.body) {
          table.container = this.createContainer(table.body);
          if (i === 'middle') {
            this.tableBodyScrollTop = table.body.scrollTop;
            this.bind(table.body, 'scroll', () => {
              if (this.tableBodyScrollTop !== table.body.scrollTop) {
                this.tableBodyScrollTop = table.body.scrollTop;
                this.scrollHandle();
              }
            });
          }
        }
      } else {
        if (i === 'middle' && table.body) {
          this.unbind(table.body, 'scroll');
        }
        this.table[i] = {};
      }
    });
    this.setContainerHeight();
  }

  // eslint-disable-next-line react/sort-comp
  setContainerHeight() {
    const { rowHeight, dataSource } = this.props;
    const minHeight = `${dataSource.length * rowHeight}px`;
    Object.keys(this.table).forEach((i) => {
      const { container } = this.table[i];
      if (container) {
        container.style.minHeight = minHeight;
      }
    });
  }

  computeVisibleAreaCount() {
    const { rowHeight, rowCount } = this.props;
    const { y } = this.state;
    this.visibleAreaRowCount = Math.max(Math.ceil(y / rowHeight), rowCount);
  }

  computeVisibleAreaDataSource() {
    this.computeVisibleAreaCount();
    this.setDataSource();
  }

  getDataSource(dataSource) {
    const { rowHeight, filterVisibleDataSource } = this.props;
    const index = Math.floor(parseFloat(this.translateY) / rowHeight);
    const visibleDataSource = dataSource.slice(index, this.visibleAreaRowCount + index);
    if (filterVisibleDataSource) {
      return filterVisibleDataSource(visibleDataSource);
    }
    return visibleDataSource;
  }

  setDataSource(state, cb) {
    const { dataSource, bottomScrollBar, noLazyLoading } = this.props;
    const visibleDataSource = noLazyLoading ? dataSource : this.getDataSource(dataSource);
    this.setState({ dataSource: visibleDataSource, ...state }, () => {
      if (state !== null) {
        this.create();
        // 移动横向滚动条到表格页面底部（ant-table-body height === max-height)
        dataSource.length > 0 && bottomScrollBar && this.setScrollBarToBottom();
      }
      cb && cb();
    });
  }

  setScrollBarToBottom() {
    const { tableWrapper } = this;
    const { y } = this.state;
    const body = tableWrapper.querySelector('.ant-table-body');
    body.style.height = `${y}px`;
  }

  getTableStatus() {
    const status = {};
    // middle表示中间滚动区域表格
    // left表示左侧固定区域表格
    // right表示右侧固定区域表格
    const tableVisible = {
      middle: true,
    };
    const tableVisibleTemp = this.tableVisible;
    const { columns } = this.state;
    if (columns) {
      const { length } = columns;
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < length; i++) {
        const col = columns[i];
        if (tableVisible.left && tableVisible.right) {
          break;
        }
        if (col.fixed === true || col.fixed === 'left') {
          tableVisible.left = true;
        } else if (col.fixed === 'right') {
          tableVisible.right = true;
        }
      }
    }
    Object.keys(tableVisible).forEach((i) => {
      if (tableVisibleTemp[i] === undefined) {
        // 需要添加容器以及事件
        status[i] = 'add';
      }
      delete tableVisibleTemp[i];
    });
    Object.keys(tableVisibleTemp).forEach((i) => {
      // 需要移除容器以及事件
      status[i] = 'remove';
    });
    this.tableVisible = tableVisible;
    return status;
  }

  setYHeight() {
    const { tableWrapper } = this;
    const title = tableWrapper.querySelector('.ant-table-title');
    const thead = tableWrapper.querySelector('.ant-table-scroll .ant-table-thead');
    const pagination = tableWrapper.querySelector('.ant-table-pagination');
    const footer = tableWrapper.querySelector('.ant-table-footer');
    let y = tableWrapper.parentNode.offsetHeight;

    // 表格高度根据父元素高度自适应增加
    let wraperMaxHeight = tableWrapper.parentNode.style.maxHeight;
    if (wraperMaxHeight) {
      // eslint-disable-next-line prefer-destructuring
      wraperMaxHeight = wraperMaxHeight.split('px')[0];
      y = wraperMaxHeight;
    }

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
      y -= pagination.offsetHeight;
    }
    // 底部高度
    if (footer) {
      y -= footer.offsetHeight;
    }

    const { y: oldY } = this.state;
    // eslint-disable-next-line no-self-compare
    if (oldY !== y && y === y) {
      this.setState({ y });
      return true;
    }
  }

  getRowKey(rowData) {
    const { rowKey } = this.props;
    if (typeof rowKey === 'function') {
      return rowKey(rowData);
    }
    return rowData[rowKey];
  }

  selectAllRow(dataSource, e) {
    const { rowSelection } = this.props;
    const { onChange, onSelectAll } = rowSelection;
    const { checked } = e.target;
    if (onChange) {
      onChange(
        checked ? dataSource.map((ele) => this.getRowKey(ele)) : [],
        checked ? dataSource : [],
      );
    }
    if (onSelectAll) {
      onSelectAll(checked, checked ? dataSource : [], dataSource);
    }
  }

  selectRow(record, e) {
    const { checked } = e.target;
    const { dataSource, rowSelection } = this.props;
    const { onChange, onSelect, selectedRowKeys: oldSelectedRowKeys } = rowSelection;
    let tempSelectedRowKeys = [];
    if (checked) {
      tempSelectedRowKeys = oldSelectedRowKeys.concat(this.getRowKey(record));
    } else {
      tempSelectedRowKeys = oldSelectedRowKeys.filter((key) => key !== this.getRowKey(record));
    }
    const selectedRows = dataSource.filter((ele) =>
      tempSelectedRowKeys.includes(this.getRowKey(ele)),
    );
    const selectedRowKeys = selectedRows.map((ele) => this.getRowKey(ele));
    if (onChange) {
      onChange(selectedRowKeys, selectedRows, record);
    }
    if (onSelect) {
      onSelect(record, checked, selectedRows, e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  filterDisabledDataSource(dataSource, getCheckboxProps) {
    if (getCheckboxProps) {
      return dataSource.filter((ele) => {
        const props = getCheckboxProps(ele);
        if (props && props.disabled) {
          return false;
        }
        return true;
      });
    }
    return [].concat(dataSource);
  }

  getSelectionCol(rowSelection) {
    if (rowSelection) {
      const { columnWidth, columnTitle, fixed, type, align } = rowSelection;
      const { columns } = this.props;
      return {
        width: columnWidth || 50,
        dataIndex: type || 'checkbox',
        fixed: fixed !== undefined ? fixed : (columns[0] || {}).fixed,
        align: align || 'center',
        dragCell: false,
        title: () => {
          const {
            rowSelection: { selectedRowKeys, getCheckboxProps, rowSpan },
          } = this.props;
          let { dataSource } = this.props;
          dataSource = this.filterDisabledDataSource(dataSource, getCheckboxProps);
          // 复选框合并后全选按钮问题修复
          const visibleDataSource = rowSpan
            ? this.getDataSource(dataSource).filter((ele) => ele.rowSpan !== 0)
            : dataSource;
          const checked =
            visibleDataSource.length && selectedRowKeys.length === visibleDataSource.length;
          return (
            <Checkbox
              disabled={!visibleDataSource.length}
              checked={checked}
              indeterminate={!!(selectedRowKeys.length && !checked)}
              onChange={this.selectAllRow.bind(this, visibleDataSource)}
            >
              {columnTitle}
            </Checkbox>
          );
        },
        render: (text, record) => {
          const {
            rowSelection: { selectedRowKeys, getCheckboxProps },
          } = this.props;
          const props = getCheckboxProps ? getCheckboxProps(record) : undefined;
          const checked = selectedRowKeys.includes(this.getRowKey(record));
          const data = {
            children: (
              <Checkbox {...props} checked={checked} onChange={this.selectRow.bind(this, record)} />
            ),
          };
          if (rowSelection.rowSpan) {
            data.props = {
              rowSpan: record.rowSpan,
            };
          }
          return data;
        },
      };
    }
  }

  updateColumns(columns, cb) {
    return columns.map((ele) => {
      const { children } = ele;
      if (children && children.length) {
        this.updateColumns(children, cb);
      }
      cb(ele);
      return ele;
    });
  }

  // 获取可拖拽的列
  getDragColumns(columns, columnList = []) {
    columns.forEach((ele) => {
      const { children, dragCell } = ele;
      if (children && children.length) {
        this.getDragColumns(children, columnList);
      }
      // 排除没有设置可拖拽的列
      else if (dragCell !== false) {
        columnList.push(ele);
      }
    });
    return columnList;
  }

  storageWidth(...args) {
    const { id, dragCell } = this.props;
    if (util.storeForUser('enableStorageColumnWidth') === '1') {
      const [key, width] = args;
      if (id && dragCell) {
        const storageData = util.store(id) || {};
        const size = args.length;
        if (size === 1) {
          return storageData[key];
        }
        if (size > 1) {
          storageData[key] = width || 0;
          util.store(id, storageData);
        }
        return storageData;
      }
    }
    return {};
  }

  remenberWidth(...args) {
    const { id, dragCell } = this.props;
    const [key, width] = args;
    if (dragCell) {
      if (id && !this.remenberId[id]) {
        this.remenberId[id] = {};
      }
      const remenberData = id ? this.remenberId[id] : this.remenber;
      if (key === null) {
        Object.keys(remenberData).forEach((k) => {
          delete remenberData[k];
        });
      } else {
        const size = args.length;
        if (size === 1) {
          return remenberData[key];
        }
        if (size > 1) {
          remenberData[key] = width || 0;
        }
      }
      return remenberData;
    }
    return {};
  }

  // 比较拖拽列发生变化
  compareColumnsDiff(nextColumns, currentColumns) {
    const nextDragColumns = this.getDragColumns(nextColumns);
    const dragColumns = this.getDragColumns(currentColumns);
    if (nextDragColumns.length !== dragColumns.length) {
      return true;
    }
    return !!nextDragColumns.find(
      ({ dataIndex }, i) => !dragColumns[i] || dragColumns[i].dataIndex !== dataIndex,
    );
  }

  computedColumns(cols) {
    const { minWidthCount } = this.props;
    const { current } = this.emptyCellRef;
    const { columns: stateCols } = this.state;
    const columns = cols || stateCols;
    if (current) {
      const storageData = this.storageWidth();
      const dragColumns = this.getDragColumns(columns).filter(
        // 排除存储的列
        ({ dataIndex }) => storageData[dataIndex] === undefined,
      );
      if (dragColumns.length) {
        const { container } = this.table.middle;
        if (container) {
          const { offsetWidth: containerWidth } = container;
          const { offsetWidth: tableWidth } = container.firstChild;
          const { offsetWidth: width } = current;
          const diff = containerWidth - tableWidth;
          const result = diff < 0 ? diff : width;
          if (minWidthCount && containerWidth < minWidthCount) {
            return false;
          }
          if (result !== 0) {
            // 得出平均值
            const averageWidth = result / dragColumns.length;
            let spillover = 0;
            dragColumns.forEach((ele, key) => {
              const newWidth = ele.width + averageWidth;
              if (newWidth < ele.minWidth) {
                // eslint-disable-next-line no-param-reassign
                ele.width = ele.minWidth;
              } else {
                // eslint-disable-next-line no-param-reassign
                ele.width = Math.floor(newWidth); // 向下取整为了防止出现滚动条
                spillover += Number(`0.${newWidth.toString().split('.')[1] || 0}`);
              }
              if (dragColumns.length - 1 === key) {
                // eslint-disable-next-line no-param-reassign
                ele.width += spillover;
              }
              this.remenberWidth(ele.dataIndex, ele.width);
            });
            this.computed = true;
            this.setState({ columns: [...columns] });
          }
        }
      }
    }
  }

  bindDrag(dataIndex, dragLine) {
    this.bind(dragLine, 'mousedown', (e) => {
      e.preventDefault();
      const { auxiliaryLine, table } = this.drag;
      const { columns } = this.state;
      const dragColumns = this.getDragColumns(columns);
      const column = dragColumns.find((ele) => ele.dataIndex === dataIndex);
      if (column) {
        this.drag.downX = e.pageX;
        this.drag.isMove = true;
        this.drag.column = column;
        this.drag.left = e.pageX - table.getBoundingClientRect().left;
        auxiliaryLine.style.height = `${this.tableWrapper.offsetHeight}px`;
        auxiliaryLine.style.display = 'block';
        auxiliaryLine.style.left = `${this.drag.left}px`;
      }
    });
    // 只绑定一次
    if (!this.drag) {
      // 创建拖拽时的辅助线
      const auxiliaryLine = document.createElement('div');
      const table = this.tableWrapper.querySelector('.ant-table');
      auxiliaryLine.className = 'dragtable-auxiliary-line';
      table.appendChild(auxiliaryLine);
      this.drag = {
        // 是否可移动
        isMove: false,
        // 鼠标按下时的位置
        downX: 0,
        // 鼠标移动时的位置
        moveX: 0,
        // 辅助线定位
        left: 0,
        // 表格dom
        table,
        // 拖拽辅助线dom
        auxiliaryLine,
        // 拖拽的列
        column: null,
      };
      // 移动
      this.bind(document, 'mousemove', (e) => {
        if (this.drag.isMove) {
          // 防止出现选中文字问题
          e.preventDefault();
          this.drag.moveX = e.pageX;
          const { downX, moveX, left } = this.drag;
          // 移动辅助线
          auxiliaryLine.style.left = `${left + (moveX - downX)}px`;
        }
      });
      // 松开鼠标
      this.bind(document, 'mouseup', (e) => {
        if (this.drag.isMove) {
          auxiliaryLine.style.display = 'none';
          this.drag.isMove = false;
          const { downX, moveX, column } = this.drag;
          // 松开位置不是按下时的位置，才进行计算
          if (e.pageX !== downX) {
            const { columns } = this.state;
            const { width, minWidth } = column;
            // 必须设置宽度
            if (width) {
              const { draglast } = this.props;
              let newWidth = width + (moveX - downX);
              if (minWidth !== undefined && newWidth < minWidth) {
                newWidth = minWidth;
              }
              column.width = newWidth;
              // localStorage存储
              this.storageWidth(column.dataIndex, column.width);
              // 当前实例存储
              this.remenberWidth(column.dataIndex, column.width);
              if (draglast) {
                const { container } = this.table.middle;
                const { offsetWidth: tableWidth } = container;
                let tieWidth = 0;
                let lastcol;
                columns.forEach((v) => {
                  if (v.draglast && v.dragCell === false) {
                    lastcol = v;
                  } else {
                    tieWidth += v.width || 0;
                  }
                });
                const lastWidth = tableWidth - tieWidth;
                if (lastWidth < lastcol.draglast) {
                  lastcol.width = lastcol.draglast;
                } else {
                  lastcol.width = lastWidth;
                }
              }
              this.setState({
                columns: [...columns],
              });
            }
          }
        }
      });
    }
  }

  getColumns({ dragCell, columns, rowSelection }) {
    const selectionCol = this.getSelectionCol(rowSelection);
    let newColumns = columns.map((v) => ({ ...v }));
    if (selectionCol) {
      const [firstCol, ...rest] = columns;
      if (firstCol && firstCol.type === 'pre') {
        if (this.isNoDataClassName.indexOf('isChromeClass')) {
          this.isNoDataClassName = 'isChromeClass hasFixedLeft';
        } else {
          this.isNoDataClassName = 'hasFixedLeft';
        }
        newColumns = [{ ...firstCol, dragCell: false, fixed: 'left' }, selectionCol, ...rest];
      } else {
        newColumns = [selectionCol, ...columns];
      }
    }
    if (dragCell) {
      const storageData = this.storageWidth();
      const remenberData = this.remenberWidth();
      newColumns = this.updateColumns(newColumns, (col) => {
        const { onHeaderCell, dragCell: colDragCell, children, dataIndex } = col;

        // 将列宽更新为存储的列宽
        if (colDragCell !== false && (!children || !children.length)) {
          const storageColumnWidth = storageData[dataIndex];
          const rememberColumnWidth = remenberData[dataIndex];
          if (storageColumnWidth !== undefined) {
            // eslint-disable-next-line no-param-reassign
            col.width = storageColumnWidth;
          } else if (rememberColumnWidth !== undefined) {
            // eslint-disable-next-line no-param-reassign
            col.width = rememberColumnWidth;
          }
        }

        let headerCell = null;
        if (onHeaderCell) {
          headerCell = onHeaderCell(col);
        }

        // eslint-disable-next-line no-param-reassign
        col.onHeaderCell = () => {
          return {
            ...headerCell,
            onMouseEnter: (e) => {
              if (headerCell && headerCell.onMouseEnter) {
                headerCell.onMouseEnter(e);
              }
              // 含有dataIndex才可以拖拽，属性中dragCell设置为false可以取消该列拖拽
              if (col.dataIndex && col.dragCell !== false) {
                if (!e.target.generateDragLine) {
                  e.target.generateDragLine = true;
                  const dragLine = document.createElement('b');
                  dragLine.className = 'dragtable-drag-line';
                  e.target.appendChild(dragLine);
                  this.bindDrag(col.dataIndex, dragLine);
                }
              }
            },
          };
        };
      });

      const emptyCell = {
        dataIndex: 'dragtable-empty-cell',
        className: 'dragtable-empty-cell',
        dragCell: false,
        title: <div ref={this.emptyCellRef} className="dragtable-empty-div" />,
      };

      // 如果右边有固定列，将空列插入到固定列与非固定列之间，否则直接添加到末尾
      const findData = newColumns.find(({ fixed }, i) => {
        if (fixed === 'right') {
          newColumns = newColumns.slice(0, i).concat(emptyCell, newColumns.slice(i));
          return true;
        }
        return false;
      });
      if (!findData) {
        newColumns.push(emptyCell);
      }
    }
    return newColumns;
  }

  setTranslateY(dom) {
    const { translateY } = this;
    if (dom) {
      prefix.forEach((pre) => {
        // eslint-disable-next-line no-param-reassign
        dom.style[`${pre}transform`] = `translateY(${translateY}px)`;
      });
    }
  }

  getVirtualTableStyle() {
    const { top: wrapperTop } = this.tableWrapper.getBoundingClientRect();
    const { body, container } = this.table.middle;
    const { top: tableTop, height } = body.getBoundingClientRect();
    const { width } = container.getBoundingClientRect();
    const style = {
      top: tableTop - wrapperTop,
      width,
      height,
    };
    return style;
  }

  scrollHandle() {
    const scrollTop = this.tableBodyScrollTop;
    const { rowHeight, onScroll, noLazyLoading } = this.props;
    if (noLazyLoading) {
      return;
    }
    // const { scrolling } = this.state;
    // const { current } = this.VirtualTableRef;
    // if (current && !this.VirtualTable) {
    //   // eslint-disable-next-line react/no-find-dom-node
    //   this.VirtualTable = ReactDOM.findDOMNode(current);
    // }
    // if (!scrolling) {
    //   if (this.VirtualTable) {
    //     Object.keys(this.table).forEach((type) => {
    //       this.table[type].container && (this.table[type].container.firstChild.style.opacity = '0');
    //     });
    //     this.VirtualTable.style.display = 'block';
    //   }
    //   this.setState({
    //     scrolling: true,
    //     virtualTableStyle: this.getVirtualTableStyle(),
    //   });
    // } else {
    //   clearTimeout(this.scrollTimer);
    //   this.scrollTimer = setTimeout(() => {
    //     this.setState(
    //       {
    //         scrolling: false,
    //       },
    //       () => {
    //         if (this.VirtualTable) {
    //           Object.keys(this.table).forEach((type) => {
    //             this.table[type].container &&
    //               (this.table[type].container.firstChild.style.opacity = '1');
    //           });
    //           this.VirtualTable.style.display = 'none';
    //         }
    //       },
    //     );
    //   }, 300);
    // }

    this.translateY = Math.floor(parseFloat(scrollTop / rowHeight)) * rowHeight;
    Object.keys(this.table).forEach((i) => {
      const { container } = this.table[i];
      if (container) {
        this.setTranslateY(container.firstChild);
      }
    });
    this.setDataSource(null, () => {
      if (onScroll) {
        onScroll(scrollTop, this.scrollFlag);
      }
      this.scrollFlag = false;
    });
  }

  bind(elem, event, callback) {
    elem.addEventListener(event, callback);
    this.events.push({
      elem,
      event,
      callback,
    });
  }

  unbind(elem, event, callback) {
    if (!arguments.length) {
      this.events.forEach(({ elem: ele, event: e, callback: cb }) => {
        ele.removeEventListener(e, cb);
      });
    } else {
      this.events = this.events.filter((item) => {
        if (elem === item.elem && event === item.event) {
          elem.removeEventListener(event, callback || item.callback);
          return false;
        }
        return true;
      });
    }
  }

  bindResize() {
    // 绑定窗口大小改变事件以自适应表格
    let { clientWidth, clientHeight } = document.documentElement;
    this.bind(window, 'resize', () => {
      if (this.tableWrapper.offsetHeight) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.setYHeight();
          const {
            clientWidth: newClientWidth,
            clientHeight: newClientHeight,
          } = document.documentElement;
          // 高度变化才进行数据行计算
          if (clientHeight !== newClientHeight) {
            clientHeight = newClientHeight;
            this.computeVisibleAreaDataSource();
          }
          // 宽度变化才进行列计算
          if (clientWidth !== newClientWidth) {
            clientWidth = newClientWidth;
            this.computedColumns();
          }
        }, 100);
      }
    });
  }

  rowClassName(record, index) {
    // eslint-disable-next-line no-unused-vars
    const { rowClassName, rowSelection } = this.props;
    const classNames = [];
    // 注释原因：#111772 ie 下全选后会每个 td 都设置该 class，bc-color 为 #fafafa，一片灰色
    // if (rowSelection && rowSelection.selectedRowKeys) {
    //   if (rowSelection.selectedRowKeys.includes(this.getRowKey(record))) {
    //     // classNames.push('ant-table-row-selected');
    //   }
    // }
    if (rowClassName) {
      classNames.push(rowClassName(record, index) || '');
    }
    return classNames.join(' ');
  }

  /**
   * @param {Number} top 滚动高度
   */
  scrollTop(top) {
    const { body } = this.table.middle;
    if (body && typeof top === 'number') {
      this.scrollFlag = true;
      body.scrollTop = top;
    }
  }

  /**
   * @param {Number, Function} index 滚动位置
   */
  scrollTo(index) {
    const { dataSource, rowHeight } = this.props;

    if (typeof index === 'number') {
      let toIndex = index;
      if (toIndex < 0) {
        toIndex = dataSource.length + toIndex;
      }
      this.scrollTop(rowHeight * toIndex);
    } else if (typeof index === 'function') {
      const toIndex = dataSource.findIndex((ele, i) => index(ele, i));
      if (toIndex !== -1) {
        this.scrollTop(rowHeight * toIndex);
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  compareRowSelection(nextProps, prevProps) {
    if (
      (!prevProps.rowSelection && nextProps.rowSelection) ||
      (prevProps.rowSelection && !nextProps.rowSelection) ||
      (prevProps.rowSelection &&
        nextProps.rowSelection &&
        (prevProps.rowSelection.columnWidth !== nextProps.rowSelection.columnWidth ||
          prevProps.rowSelection.type !== nextProps.rowSelection.type ||
          prevProps.rowSelection.fixed !== nextProps.rowSelection.fixed ||
          prevProps.rowSelection.selectedRowKeys !== nextProps.rowSelection.selectedRowKeys))
    ) {
      return true;
    }
  }

  render() {
    const { scroll, rowSelection, className, id, dragCell, ...rest } = this.props;
    const { dataSource, columns, y, scrolling, virtualTableStyle } = this.state;
    const { rowKey, rowHeight } = this.props;
    const props = {
      ...rest,
      ref: this.tableRef,
      className: classnames(
        'ant-supertable',
        className,
        dragCell ? 'dragtable' : '',
        this.isNoDataClassName,
      ),
      rowClassName: this.rowClassName.bind(this),
      columns,
      dataSource,
      scrolling,
      scroll: { x: scroll ? scroll.x : null, y },
    };
    return <Table table={this} {...props} />;
    // return (
    //   <div className="ant-supertable-wrapper">
    //     <Table table={this} {...props} />
    //     {scrolling !== undefined && (
    //       <VirtualTable
    //         table={this}
    //         scrolling={scrolling}
    //         style={virtualTableStyle}
    //         ref={this.VirtualTableRef}
    //         rowKey={rowKey}
    //         rowHeight={rowHeight}
    //         columns={columns}
    //         dataSource={dataSource}
    //       />
    //     )}
    //   </div>
    // );
  }
}

SuperTable.defaultProps = {
  // 最小高度
  rowHeight: 36,
  // 最小展示行数量
  rowCount: 20,
  /**
   * @function 滚动回调
   * @param {Number} scrollTop 滚动高度
   * @param {Boolean} scrollFlag 是否是scrollTop或者scrollTo方法进行滚动
   */
  onScroll() {},
  /**
   * @function 过滤处理可视区域数据
   * @param {Array} visibleDataSource 可视区域数据
   */
  filterVisibleDataSource: null,
  dataSource: [],
  columns: [],
  rowKey: 'key',
  // 表格唯一标识符，记忆列用
  id: '',
  // 表格列是否可以拖拽
  dragCell: false,
  bottomScrollBar: false, // 是否移动横向滚动条到页面底部
};

SuperTable.propTypes = {
  rowHeight: PropTypes.number,
  rowCount: PropTypes.number,
  onScroll: PropTypes.func,
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  id: PropTypes.string,
  dragCell: PropTypes.bool,
  filterVisibleDataSource: PropTypes.func,
  bottomScrollBar: PropTypes.bool,
};

export default SuperTable;
