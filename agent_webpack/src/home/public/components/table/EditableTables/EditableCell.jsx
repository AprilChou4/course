import React from 'react';
import moment from 'moment';
import { Form } from 'antd';
import util from 'util';

import AntdInput from '../../input/AntdInput';

const { Item: FormItem } = Form;

class EditableCell extends React.Component {
  constructor(props) {
    super(props);
    this.input = React.createRef(null);
    this.td = React.createRef(null);
  }

  componentDidMount() {
    this.setFocus();
  }

  componentDidUpdate() {
    this.setFocus();
    const { dataIndex, record } = this.props;
    const { form } = this;
    // console.log('this.props', this.props);
    // record中的值改变时，更新form
    // if (form && form.getFieldValue(dataIndex) !== record[dataIndex]) {
    //   form.setFieldsValue({
    //     [dataIndex]: record[dataIndex],
    //   });
    // }
  }

  setFocus = () => {
    if (
      this.isEditing &&
      this.editable &&
      this.input &&
      this.input.current &&
      this.input.current.focus
    ) {
      this.input.current.focus();
      // TODO: 文本 select
      // if (this.input.current.select) {
      //   this.input.current.select();
      // }

      // if (this.input.current.inputNumberRef) {
      //   console.log('select');
      //   this.input.current.inputNumberRef.input.select();
      // }
    }
  };

  toggleEdit = () => {
    const { dataIndex, record, eventProps, idName } = this.props;
    // 点击 select row
    if (!record) {
      return;
    }

    let newActiveTd = {};
    if (this.isEditing) {
      return;
    }

    newActiveTd = {
      id: record[idName],
      dataIndex,
    };

    eventProps.setActiveTd(newActiveTd);
  };

  save = (cb) => {
    const { dataIndex, record, eventProps, alwaysSaveInput } = this.props;
    if (!record || !this.form) return;

    const formValues = this.form.getFieldsValue();
    //  console.log('save', values, dataIndex, values[dataIndex], record[dataIndex]);

    if (alwaysSaveInput || formValues[dataIndex] !== record[dataIndex]) {
      eventProps.onTdChange({ ...record, ...formValues }, formValues, record, { dataIndex });
      // 标记为已改变
      eventProps.setIsChange(true);
    }
    cb && cb();
    if (Object.values(formValues).some(Boolean)) {
      this.form.validateFields((error, values) => {
        // if (error) {
        // }
        // 临时保存数据
        // const [key] = Object.keys(values);
        // 科学计数法转换
        // if (typeof values[key] === 'number') {
        //   values[key] = util.getFullNum(values[key]);
        // }
        // values[key] = values[key] || '';
      });
    }
  };

  // td onBlur，用于点击同行不同 td 时保存编辑中 td 的数据
  onBlur = () => {
    const { activeTd, eventProps } = this.props;
    this.save(() => {
      eventProps.setActiveTd({ id: '', dataIndex: '' });
      eventProps.setPrevTd(activeTd);
    });
  };

  onKeyDown = (e) => {
    const { eventProps } = this.props;
    // enter 时自动切换下一单元格
    if (e.keyCode === 13 || e.keyCode === 9) {
      e.preventDefault && e.preventDefault();
      this.save();
      eventProps && eventProps.toNextTd();
    }
  };

  render() {
    const {
      activeTd,
      title,
      dispatch,
      isEnableEdit,
      dataIndex,
      record,
      Context,
      index,
      editRender,
      // 输入值最大长度
      maxlength,
      required,
      idName, // 行 id
      eventProps,
      isShowDelete,
      isShowAdd,
      isEditTr,
      inputType,
      isSelfBlur,
      isSelfEnter,
      className,
      disabled,
      hideInputBorder,
      alwaysSaveInput,
      ...restProps
    } = this.props;

    this.editable = isEnableEdit;
    this.isEditing =
      record && activeTd && activeTd.id === record[idName] && activeTd.dataIndex === dataIndex;

    const editEleProps = {
      ref: this.input,
      // val: dataIndex && record ? record[dataIndex] : undefined,
    };

    if (isSelfBlur) {
      editEleProps.onBlur = this.onBlur;
    }

    const saveAndToNext = () => {
      this.save();
      eventProps.toNextTd(activeTd);
    };

    if (inputType === 'date' || inputType === 'custom') {
      editEleProps.saveAndToNext = saveAndToNext;
      editEleProps.save = this.save;
      editEleProps.setActiveTd = eventProps.setActiveTd;
    }

    const EditElement = editRender ? (
      editRender(editEleProps, record)
    ) : (
      <AntdInput className="input" {...editEleProps} />
    );

    // const maxRule = maxlength
    //   ? {
    //       max: maxlength,
    //       message: `最大长度为${maxlength}`,
    //     }
    //   : null;

    const requiredRule = required ? { required, message: `${title}不可为空` } : {};

    const rules = [];
    // if (maxlength) {
    //   rules.push(maxRule);
    // }
    if (required) {
      rules.push(requiredRule);
    }

    const tdProps = {
      ...restProps,
      className: `${className} ${disabled ? 'disabled' : ''}`,
      onClick: this.toggleEdit,
      ref: this.td,
    };

    if (!isSelfEnter) {
      tdProps.onKeyDown = this.onKeyDown;
    }

    if (!isSelfBlur) {
      // 在 td 处理了 onBlur 是防止按回车键无法正常处理 input 的onBlur
      tdProps.onBlur = this.onBlur;
    }

    return (
      <td {...tdProps}>
        {this.editable ? (
          <Context.Consumer>
            {(form) => {
              this.form = form;
              // return this.isEditing ? (
              return (
                <FormItem className="edit-table-formitem">
                  {form.getFieldDecorator(dataIndex, {
                    initialValue:
                      inputType === 'date' ? moment(record[dataIndex]) : record[dataIndex],
                    rules,
                  })(EditElement)}
                </FormItem>
              );
              // ) : (
              //   <div className={!hideInputBorder ? 'text-wrap-always' : 'text-wrap'}>
              //     {restProps.children}
              //   </div>
              // );
            }}
          </Context.Consumer>
        ) : (
          restProps.children
        )}
      </td>
    );
  }
}

export default EditableCell;
