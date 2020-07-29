/* eslint-disable max-classes-per-file */
import React, { Component } from 'react';
import { Table, Input, Form, Pagination } from 'antd';
import PropTypes from 'prop-types';
import './style.less';
import inputLimits from './config';

function isIE9() {
  const { userAgent } = window.navigator;
  const IEReg = new RegExp('MSIE (\\d+\\.\\d+);');
  IEReg.test(userAgent);
  const IEVersionNum = parseFloat(RegExp.$1);
  return IEVersionNum === 9;
}

function fomatFloat(src, pos = 2) {
  const value = Math.round(src * 10 ** pos) / 10 ** pos;
  const num = pos;
  let a;
  let i;
  a = value.toString();
  const b = a.indexOf('.');
  const c = a.length;
  if (num === 0) {
    if (b !== -1) {
      a = a.substring(0, b);
    }
  } else if (b === -1) {
    a += '.';
    for (i = 1; i <= num; i += 1) {
      a += '0';
    }
  } else {
    // 有小数点，超出位数自动截取，否则补0
    a = a.substring(0, b + num + 1);
    for (i = c; i <= b + num; i += 1) {
      a += '0';
    }
  }
  return a;
}

function theadInit(col, tabsname, callback, inputType, inputrules, editMode) {
  if (col.children) {
    const children1 = col.children.map((child1) => {
      return theadInit(child1, tabsname, callback, inputType, inputrules, editMode);
    });
    return {
      ...col,
      nobackground: col.nobackground,
      children: children1,
    };
  }
  return {
    ...col,
    onCell: (record) => ({
      record,
      inputrules,
      editMode,
      editable: editMode ? col.editable : editMode,
      inputType: col.inputType || inputType,
      unusable: col.unusable,
      nobackground: col.nobackground,
      dataIndex: col.dataIndex,
      showTips: col.showTips,
      handleSave: callback,
      bh: tabsname,
    }),
  };
}

function calculate(dataIndex) {
  // const obj = e.target.value ? parseFloat(e.target.value) : 0;
  switch (dataIndex) {
    default:
      break;
  }
}

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

EditableRow.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldError: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
    resetFields: PropTypes.func.isRequired,
    isFieldTouched: PropTypes.func.isRequired,
  }).isRequired,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
EditableRow.defaultProps = {
  index: null,
};

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editing: false };
  }

  componentDidMount() {
    const { editable } = this.props;
    if (editable) {
      document.addEventListener('mousedown', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    const { editable } = this.props;
    if (editable) {
      document.removeEventListener('mousedown', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const { editing } = this.state;
    const editingChange = !editing;
    this.setState({ editing: editingChange }, () => {
      if (editingChange) {
        this.input.focus();
      }
    });
  };

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  };

  save = () => {
    const { record, handleSave, bh } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({
        tableName: bh,
        rowData: record,
        colKey: Object.keys(values)[0],
        value: String(values[Object.keys(values)[0]]),
      });
    });
  };

  render() {
    let isNull = false;
    const { editing } = this.state;
    const FormItem = Form.Item;
    const {
      editable, // 是否可编辑
      dataIndex, // 列名（索引）
      bh, // 表名
      record, // 行数据
      index, // index
      handleSave, // 失焦事件
      unusable, // 不可编辑单元格
      nobackground, // 无底色
      other, // 备用字段
      inputType, // 输入类型 text number
      decimalLen, // 小数点长度
      style,
      className,
      showTips, // 显示hover提示
      inputrules,
      editMode,
      ...restProps
    } = this.props;

    if (record[dataIndex] === undefined || record[dataIndex] === null) {
      isNull = true;
    }
    // 不可以编辑
    let newClass = className;
    if (!editable || record.hc === null) {
      if (editMode) {
        newClass += ' notEdit';
      }
    }
    if (record[dataIndex] === undefined || record[dataIndex] === null) {
      if (editMode) {
        newClass += ' notEdit';
      }
      isNull = true;
    }

    if (unusable !== undefined) {
      if (unusable.includes(Number(record.hc))) {
        if (editMode) {
          newClass += ' notEdit';
        }
      }
    }

    if (nobackground !== undefined) {
      if (nobackground.includes(Number(record.hc))) {
        newClass += ' nobackground';
      }
    }

    let initialData = '';
    if (record) {
      if (['string', 'nonnegativeInteger', 'naturalsInteger'].includes(inputType)) {
        initialData = record[dataIndex];
      } else {
        initialData = fomatFloat(record[dataIndex]) === '0.00' ? '' : fomatFloat(record[dataIndex]);
      }
    }

    return (
      <td
        ref={(node) => {
          this.cell = node;
          return this.cell;
        }}
        {...restProps}
        className={newClass}
        style={{
          ...style,
          position: 'relative',
        }}
      >
        {editable && newClass === className ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return editing ? (
                <FormItem style={{ margin: ' -19px 0px 0px 0px', height: '20px' }}>
                  {form.getFieldDecorator(dataIndex, {
                    validateTrigger: ['onBlur'],
                    rules: [
                      {
                        required: false,
                        message: '',
                      },
                    ],
                    getValueFromEvent: (event) => {
                      return inputLimits(
                        event.target.value,
                        bh,
                        dataIndex,
                        record.hc,
                        inputType,
                        inputrules,
                      );
                    },
                    initialValue: isNull ? '' : initialData,
                  })(
                    <Input
                      ref={(node) => {
                        this.input = node;
                        return this.input;
                      }}
                      onPressEnter={this.save}
                      style={{
                        height: '26px',
                        paddingLeft: '4px',
                        paddingRight: '4px',
                        marginTop: '6px',
                      }}
                      onBlur={(v) => calculate(dataIndex, v)}
                    />,
                  )}
                </FormItem>
              ) : (
                <div
                  className="editable-cell-value-wrap"
                  style={
                    showTips && !isNull
                      ? { height: '20px', overflow: 'hidden' }
                      : { height: '20px' }
                  }
                  onClick={this.toggleEdit}
                  title={showTips && !isNull ? initialData : ''}
                >
                  {restProps.children}
                </div>
              );
            }}
          </EditableContext.Consumer>
        ) : (
          <div>{restProps.children}</div>
        )}
      </td>
    );
  }
}

EditableCell.propTypes = {
  editable: PropTypes.bool,
  dataIndex: PropTypes.string,
  record: PropTypes.shape({
    lookElder: PropTypes.number,
    hc: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  handleSave: PropTypes.func,
  index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unusable: PropTypes.arrayOf(PropTypes.number),
  nobackground: PropTypes.arrayOf(PropTypes.number),
  style: PropTypes.objectOf(PropTypes.string),
  className: PropTypes.string,
  inputType: PropTypes.string,
  decimalLen: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  other: PropTypes.string,
  bh: PropTypes.string,
  showTips: PropTypes.bool,
  inputrules: PropTypes.func,
  // editMode: PropTypes.bool.isRequired,
};
EditableCell.defaultProps = {
  editable: false,
  dataIndex: '',
  index: null,
  handleSave: () => {},
  className: '',
  bh: '',
  style: {},
  unusable: [],
  nobackground: [],
  record: {},
  inputType: 'naturalsDecimal',
  other: '',
  showTips: false,
  inputrules: null,
  decimalLen: 2,
};

class TaxTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.doubleClick = this.doubleClick.bind(this);
    this.jjsrfootBody = null;
    this.jjsrtableBody = null;
    this.jjsrHeader = null;
    this.jjsrFooter = null;
  }

  componentDidMount() {
    this.scroll(this.props);
  }

  componentWillUnmount() {
    const { total } = this.props;
    if (total) {
      if (this.jjsrfootBody) {
        this.jjsrfootBody.removeEventListener('scroll', this.jjsrfootBodyFn);
      }
      if (this.jjsrtableBody) {
        this.jjsrtableBody.removeEventListener('scroll', this.jjsrtableBodyFn);
      }
      if (this.jjsrHeader) {
        this.jjsrHeader.removeEventListener('scroll', this.jjsrHeaderFn);
      }
      if (this.jjsrFooter) {
        this.jjsrFooter.removeEventListener('scroll', this.jjsrFooterFn);
      }
      this.jjsrfootBodyFn = null;
      this.jjsrtableBodyFn = null;
      this.jjsrHeaderFn = null;
      this.jjsrFooterFn = null;
      this.jjsrfootBody = null;
      this.jjsrtableBody = null;
      this.jjsrHeader = null;
      this.jjsrFooter = null;
    }
  }

  scroll = (props) => {
    // alert(8888);
    const { tableName } = props;
    // 监听滚动
    this.jjsrfootBody = document.querySelector(
      `.table-total.${tableName}-table .ant-table-scroll .ant-table-body`,
    );
    this.jjsrtableBody = document.querySelector(
      `.mainTable.${tableName}-table .ant-table-scroll .ant-table-body`,
    );
    this.jjsrHeader = document.querySelector(
      `.mainTable.${tableName}-table .ant-table-scroll .ant-table-header`,
    );
    this.jjsrFooter = document.querySelector(
      `.table-total.${tableName}-table .ant-table-scroll .ant-table-header`,
    );
    this.jjsrfootBodyFn = () => {
      if (this.jjsrHeader) {
        this.jjsrHeader.scrollLeft = this.jjsrfootBody.scrollLeft;
      }
      if (this.jjsrFooter) {
        this.jjsrFooter.scrollLeft = this.jjsrfootBody.scrollLeft;
      }
      if (this.jjsrtableBody) {
        this.jjsrtableBody.scrollLeft = this.jjsrfootBody.scrollLeft;
      }
    };
    this.jjsrtableBodyFn = () => {
      if (this.jjsrHeader) {
        this.jjsrHeader.scrollLeft = this.jjsrtableBody.scrollLeft;
      }
      if (this.jjsrFooter) {
        this.jjsrFooter.scrollLeft = this.jjsrtableBody.scrollLeft;
      }
      if (this.jjsrfootBody) {
        this.jjsrfootBody.scrollLeft = this.jjsrtableBody.scrollLeft;
      }
    };
    this.jjsrHeaderFn = () => {
      if (this.jjsrFooter) {
        this.jjsrFooter.scrollLeft = this.jjsrHeader.scrollLeft;
      }
      if (this.jjsrfootBody) {
        this.jjsrfootBody.scrollLeft = this.jjsrHeader.scrollLeft;
      }
      if (this.jjsrtableBody) {
        this.jjsrtableBody.scrollLeft = this.jjsrHeader.scrollLeft;
      }
    };
    this.jjsrFooterFn = () => {
      if (this.jjsrHeader) {
        this.jjsrHeader.scrollLeft = this.jjsrFooter.scrollLeft;
      }
      if (this.jjsrfootBody) {
        this.jjsrfootBody.scrollLeft = this.jjsrFooter.scrollLeft;
      }
      if (this.jjsrtableBody) {
        this.jjsrtableBody.scrollLeft = this.jjsrFooter.scrollLeft;
      }
    };
    if (this.jjsrfootBody) {
      this.jjsrfootBody.addEventListener('scroll', this.jjsrfootBodyFn);
    }
    if (this.jjsrtableBody) {
      this.jjsrtableBody.addEventListener('scroll', this.jjsrtableBodyFn);
    }
    if (this.jjsrHeader) {
      this.jjsrHeader.addEventListener('scroll', this.jjsrHeaderFn);
    }
    if (this.jjsrFooter) {
      this.jjsrFooter.addEventListener('scroll', this.jjsrFooterFn);
    }
  };

  doubleClick(record) {
    const { doubleClick, onDoubleClickEvent } = this.props;
    if (doubleClick) {
      onDoubleClickEvent(record);
    }
  }

  scroll(total) {}

  render() {
    const {
      tableBodyMinWidth,
      tableBodyHeight,
      totalColumns,
      total,
      className,
      dataSource,
      columns,
      tableName,
      onBlurEvent,
      bordered,
      inputType,
      inputrules,
      loading,
      disabled,
      editMode,
      smallHeader,
      pagination,
      ...rest
    } = this.props;
    const nodataClass =
      window.navigator.userAgent.indexOf('Chrome') > -1
        ? 'nodata-table-total-bt7'
        : 'nodata-table-total-bt20';
    const havedataClass =
      window.navigator.userAgent.indexOf('Chrome') > -1
        ? 'havedata-table-total-bt7'
        : 'havedata-table-total-bt20';

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const showColumns = columns.map((col) => {
      return theadInit(col, tableName, onBlurEvent, inputType, inputrules, editMode);
    });
    return (
      <div
        className=" ant-taxtable"
        // style={{ position: 'relative', height: `${tableBodyHeight}px` }}
      >
        <div
          style={{
            position: 'relative',
            height: `${tableBodyHeight + 80}px`,
            overflowY: 'hidden',
          }}
        >
          <Table
            style={{ width: '100%' }}
            {...rest}
            bordered={bordered}
            columns={showColumns}
            pagination={false}
            loading={loading || disabled}
            components={components}
            dataSource={dataSource}
            className={`
            ${className} TaxTable mainTable padBtm ${tableName}-table
            ${total &&
              (window.navigator.userAgent.indexOf('Chrome') > -1
                ? 'table-body-mt7'
                : 'table-body-mt17')}
            ${disabled && 'table-disabled'}
            ${isIE9() && 'ie9-table'}
            nostripe
            ${smallHeader && 'small-theader'}
          `}
            scroll={{ x: tableBodyMinWidth, y: tableBodyHeight }}
            onRow={(record) => ({
              onDoubleClick: this.doubleClick.bind(this, record),
            })}
          />

          <Table
            loading={loading || disabled}
            className={`table-total TaxTable-total ${tableName}-table  ${!total && 'TaxTable-none '}
                    ${
                      window.navigator.userAgent.indexOf('Chrome') > -1
                        ? 'table-total-bt7'
                        : 'table-total-bt20'
                    }
                    ${dataSource.length <= 0 ? nodataClass : havedataClass}
                    ${disabled && 'table-disabled'} ${isIE9() && 'ie9-table'}
                    `}
            columns={totalColumns}
            bordered={bordered}
            dataSource={dataSource.length > 0 ? [{ key: 'totalColumns' }] : []}
            pagination={false}
            scroll={{ x: 'hidden', y: 'auto' }}
            style={{ width: '100%', overflowY: 'hidden' }}
          />
        </div>
        {dataSource.length > 0 && pagination && <Pagination {...pagination} />}
      </div>
    );
  }
}

TaxTable.propTypes = {
  tableBodyMinWidth: PropTypes.number, // 表格最小宽度
  tableBodyHeight: PropTypes.number, // 表格高度
  totalColumns: PropTypes.arrayOf(PropTypes.object), // 合计表
  total: PropTypes.bool, // 开启or关闭合计
  onDoubleClickEvent: PropTypes.func, // 行双击事件
  doubleClick: PropTypes.bool, // 开启or关闭行双击事件
  onBlurEvent: PropTypes.func, // 失焦事件
  className: PropTypes.string, // 样式
  dataSource: PropTypes.arrayOf(PropTypes.object).isRequired, // 表格内容
  columns: PropTypes.arrayOf(PropTypes.object).isRequired, // 表头
  tableName: PropTypes.string, // 表名
  inputType: PropTypes.string, // 输入限制
  inputrules: PropTypes.func, // 自定义输入规则
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  bordered: PropTypes.bool,
  editMode: PropTypes.bool,
  smallHeader: PropTypes.bool,
};
TaxTable.defaultProps = {
  total: false,
  loading: false,
  doubleClick: false,
  onBlurEvent: () => {},
  inputrules: null,
  className: '',
  tableBodyHeight: null,
  tableBodyMinWidth: null,
  onDoubleClickEvent: () => {},
  totalColumns: [],
  tableName: 'default',
  disabled: false,
  editMode: false,
  smallHeader: false,
  bordered: true,
  inputType: 'naturalsDecimal',
};
export default TaxTable;
