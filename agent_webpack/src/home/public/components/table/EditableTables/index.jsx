import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Icon, Table } from 'antd';
import AntdTable from '../AntdTable';
import LinkButton from '../../buttons/LinkButton';
import EditableFormRow, { EditableContext } from './EditableFormRow';
import EditableCell from './EditableCell';
// import SuperTable from '../../SuperTable';
import './style.less';

class EditableTables extends React.Component {
  constructor(props) {
    super(props);

    this.tableRef = React.createRef(null);
  }

  state = {
    // 是否编辑过数据，未编辑时不保存
    isChange: false,
    activeTd: { id: '', dataIndex: '' },
    prevTd: { id: '', dataIndex: '' },
  };

  componentDidMount() {
    this.isUnmount = false;

    document.addEventListener('mouseup', this.onBlurTable, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onBlurTable, false);
    this.isUnmount = true;
  }

  setActiveTd = (value = { id: '', dataIndex: '' }) => this.setState({ activeTd: value });

  activePrevTd = () => {
    const { prevTd } = this.state;
    this.setActiveTd(prevTd);
  };

  activeLastTr = (dataIndex) => {
    const { dataSource, idName } = this.props;
    const lastIndex = dataSource.length - 1;
    const dataIndexs = this.getEditDataIndex(lastIndex);

    this.setActiveTd({
      id: dataSource[dataSource.length - 1][idName],
      dataIndex: dataIndex || dataIndexs[0],
    });
  };

  // 当前编辑中的 td
  // 上一个编辑过的 td，切换到下一个 td 时根据需要保存上一个 tr 的数据
  setPrevTd = (value) => !this.isUnmount && this.setState({ prevTd: value });

  /**
   * 需要在 点击 td 的 toggleEdit 后执行 onBlurTable
   */
  onBlurTable = (e) => {
    const { ignoreIdEqual } = e;
    setTimeout(() => {
      const { activeTd, prevTd, isChange } = this.state;
      const { onSaveTr, dataSource, idName } = this.props;
      const currentId = activeTd.id;
      const prevId = prevTd.id;

      if (!prevId) return;

      // 点击空白处或其他编辑行
      const isNotEqualId = ignoreIdEqual || currentId !== prevId;
      if (prevId && (!currentId || isNotEqualId) && isChange) {
        const record = dataSource.filter((item) => item[idName] === prevId)[0];

        onSaveTr(record, e);
        this.setIsChange(false);
      }
      // 保存一次数据，清空上一次数据
      this.setPrevTd({ id: '', dataIndex: '' });
    }, 0);
  };

  setIsChange = (value) => !this.isUnmount && this.setState({ isChange: value });

  getAllColumns = () => {
    const { columns } = this.props;
    // 读取 columns 可能有的 children columns
    const allColumns = [];

    for (let i = 0; i < columns.length; i += 1) {
      const col = columns[i];
      if (col.children) {
        col.children.forEach((c) => allColumns.push(c));
      } else {
        allColumns.push(col);
      }
    }
    return allColumns;
  };

  // 获取当前行中可编辑的列字段
  getEditDataIndex = (trIndex) => {
    const { enableEditTr, dataSource } = this.props;

    // 可编辑列字段
    const editableTdIndex = [];

    // 读取 columns 可能有的 children columns
    const allColumns = this.getAllColumns();

    allColumns.forEach((col) => {
      // 个别列虽然定义了可编辑，但在某一行中可能在判断回调函数中禁止了编辑，需要排除
      let isEdit = !enableEditTr;

      if (enableEditTr) {
        isEdit = enableEditTr(dataSource[trIndex], trIndex, col.dataIndex);
      }

      if (col.editable && isEdit) {
        editableTdIndex.push(col.dataIndex);
      }
    });

    return editableTdIndex;
  };

  // 移动到下一个 td
  toNextTd = (immedActiveTd) => {
    const { dataSource, idName } = this.props;
    const { activeTd } = this.state;
    let newActiveTd = {};

    const targetActiveTd = immedActiveTd || activeTd;

    // 当前编辑中的列 index
    const currentTrIndex = dataSource.findIndex((item) => item[idName] === targetActiveTd.id);

    // columns 中定义的可以编辑的列字段
    const editableTdIndex = this.getEditDataIndex(currentTrIndex);

    // 当前编辑中的 td 字段
    const tdIndex = editableTdIndex.findIndex((item) => item === targetActiveTd.dataIndex);

    const maxTdIndex = editableTdIndex.length - 1;

    // 编辑行在一行内移动
    if (tdIndex < maxTdIndex) {
      // const newTdDataIndex = editableTdIndex[tdIndex + 1];
      // const record = dataSource.find((item) => item[idName] === activeTd.id);
      // const isEditTd = enableEditTr(record, i, newTdDataIndex);

      newActiveTd = {
        dataIndex: editableTdIndex[tdIndex + 1],
        id: targetActiveTd.id,
      };

      // 临时保存数据
      this.setPrevTd(targetActiveTd);
      this.setActiveTd(newActiveTd);
    } else {
      // 激活下一行时，需要保存数据到服务器
      // TODO: 下一行不可编辑时，toNext 失效，需计算可编辑 ids
      newActiveTd = {
        dataIndex: editableTdIndex[0],
        id: dataSource[currentTrIndex + 1] ? dataSource[currentTrIndex + 1][idName] : '',
      };

      this.setPrevTd(targetActiveTd);
      this.setActiveTd(newActiveTd);
      setTimeout(() => {
        this.onBlurTable({ ignoreIdEqual: true });
      }, 0);
    }
  };

  testFuncOrStr = (prop, record, i) => {
    if (!prop) return false;
    if (typeof prop === 'function') {
      return prop(record, i);
    }
    return prop;
  };

  render() {
    const {
      columns,
      idName,
      dataSource,
      onTdChange,
      onSaveTr,
      onDeleteTr,
      onAddTr,
      enableEditTr,
      showDeleteIcon,
      showAddIcon,
      className,
      setActiveTd: customSetTd, // 外部接口设置编辑 td
      isBigData,
      disabled,
      disabledEdit,
      hideInputBorder,
      alwaysSaveInput,
      ...tableProps
    } = this.props;

    if (!idName) {
      console.error(
        '请注意：idName 为可编辑表格必须属性，一般设置为 dataSource 数据唯一 id 或其他每行不重复字段',
      );
    }

    const { activeTd } = this.state;

    const eventProps = {
      toNextTd: this.toNextTd,
      setActiveTd: this.setActiveTd,
      onTdChange,
      onSaveTr,
      enableEditTr,
      setPrevTd: this.setPrevTd,
      setIsChange: this.setIsChange,
    };

    const isDisabledEdit = disabled || disabledEdit;

    // 编辑单元格添加 props
    const editTdCol = (col, index) => {
      return {
        ...col,
        onCell: (record, i) => {
          const isEnableEdit =
            (enableEditTr ? enableEditTr(record, i, col.dataIndex) : true) &&
            col.editable &&
            !isDisabledEdit;

          return {
            record, // 表格行数据
            isEnableEdit,
            dataIndex: col.dataIndex,
            title: col.title,
            inputType: col.inputType,
            editRender: col.editRender,
            maxlength: col.maxlength || col.maxLength, // 编辑允许最大长度
            required: col.required, // 是否必填
            isSelfBlur: col.isSelfBlur, // 是否通过 blur 编辑元素来判断编辑完成，特用于 datePicker 组件
            isSelfEnter: col.isSelfEnter, // 是否默认通过 enter 键跳转下一单元格
            eventProps,
            hideInputBorder,
            Context: EditableContext,
            index,
            idName,
            activeTd,
            disabled,
            alwaysSaveInput,
            onDoubleClick: col.onDoubleClick,
          };
        },
      };
    };

    const newColumns = columns.map((col, index) => {
      let { children } = col || {};
      // 分组表头单独修改其 childre 编辑熟悉
      if (children) {
        children = children.map((c, i) => {
          return editTdCol(c, index + i);
        });
      }

      return editTdCol({ ...col, children }, index);
    });

    // SuperTable 处理 删除、新增 icon，暂用 calc，有问题替换
    // const isShowPreIcon = isBigData && (showAddIcon || showDeleteIcon) && dataSource.length > 0;
    const isShowPreIcon = showAddIcon || showDeleteIcon;
    const columnsRes = isShowPreIcon
      ? [
          {
            type: 'pre',
            width: 30,
            dataIndex: 'delete',
            className: 'table-cell-pre',
            align: 'center',
            fixed: newColumns[0].fixed,
            render: (text, record, i) => {
              const isShowDelete = this.testFuncOrStr(showDeleteIcon, record, i) && !isDisabledEdit;
              const isShowAdd = this.testFuncOrStr(showAddIcon, record, i) && !isDisabledEdit;

              return (
                <>
                  {(isShowDelete || isShowAdd) && (
                    <div className="table-cell-toggle">
                      {isShowAdd && (
                        <LinkButton
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            // 大数据渲染情况 i 并不是真实 index
                            onAddTr(record);
                          }}
                        >
                          <Icon type="plus-circle" />
                        </LinkButton>
                      )}
                      {isShowDelete && (
                        <LinkButton
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onDeleteTr(record);
                          }}
                        >
                          <Icon type="close-circle" />
                        </LinkButton>
                      )}
                    </div>
                  )}
                </>
              );
            },
          },
          ...newColumns,
        ]
      : newColumns;

    // const TableComponent = isBigData ? SuperTable : Table;

    return (
      <AntdTable
        ref={this.tableRef}
        components={{
          body: {
            row: EditableFormRow,
            cell: EditableCell,
          },
        }}
        dataSource={dataSource}
        {...tableProps}
        className={classnames('antd-table-editables', className, {
          'left-move-ant-table': isShowPreIcon,
        })}
        columns={columnsRes}
      />
    );
  }
}

EditableTables.defaultProps = {
  onTdChange: () => {}, // 单元格数据保存
  onSaveTr: () => {}, // 单元格数据保存
  onDeleteTr: () => {}, // 单元格数据保存
  showDeleteIcon: false, // 是否显示行首删除 icon，return true 显示，默认为false
  showAddIcon: false, // 是否显示行首删除 icon，return true 显示，默认为false
  setActiveTd: () => {}, // 设置编辑状态的单元格
  // enableEditTr: true,
  isBigData: true, // 是否支持大数据渲染优化 暂时只能为true
  disabled: false, // 禁止编辑、新增、操作选取 td 内容，鼠标 hover 显示禁用指针
  disabledEdit: false, // 禁止编辑、新增
  hideInputBorder: false,
  alwaysSaveInput: false,
};

EditableTables.propTypes = {
  idName: PropTypes.string.isRequired,
  isBigData: PropTypes.bool,
  onTdChange: PropTypes.func, // 单元格数据保存
  onSaveTr: PropTypes.func, // 单元格数据保存
  onDeleteTr: PropTypes.func, // 单元格数据保存
  // 是否显示行首删除 icon，return true 显示，默认为false
  showDeleteIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  // 是否显示行首删除 icon，return true 显示，默认为false
  showAddIcon: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
  setActiveTd: PropTypes.func, // 设置编辑状态的单元格
  disabled: PropTypes.bool,
  disabledEdit: PropTypes.bool,
  hideInputBorder: PropTypes.bool, // 是否显示全部输入框的模拟边框
  alwaysSaveInput: PropTypes.bool, // 是否总是保存 input value,默认false，判断没输入时不触发保存事件
};

export default EditableTables;
