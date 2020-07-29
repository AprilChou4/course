import React, { useRef, useCallback, useEffect } from 'react';
import { Form, Icon } from 'antd';
import { get } from '@utils';
import classNames from 'classnames';
import AntdTable from '../table/AntdTable';
import TableRow from './TableRow';
import TableCell from './TableCell';
import { UI_FORM_TABLE } from './utils';

/* eslint-disable no-param-reassign */

import './style.less';

const FormTable = ({
  form,
  columns,
  rowKey,
  dataSource,
  getForm,
  onAddTr,
  onDeleteTr,
  onAddIcon,
  onDelIcon,
  className,
  ...rest
}) => {
  const newDataSource = useRef([]);

  useEffect(() => {
    newDataSource.current = dataSource;
  }, [dataSource]);

  const preButton = {
    width: 30,
    dataIndex: 'handle',
    className: 'ui-form-table-pre-handle',
    onCell: (record, rowIndex) => {
      return {
        record,
        rowIndex,
        blank: true,
      };
    },
    render(text, record, index) {
      const addProps = onAddIcon(record, index) || {};
      const delProps = onDelIcon(record, index) || {};

      return (
        <div className="table-cell-toggle">
          <Icon
            type="plus-circle"
            {...addProps}
            className={classNames('ui-form-table-icon', addProps.className)}
            onClick={() => onAddTr(record, index)}
          />
          <Icon
            type="close-circle"
            {...delProps}
            className={classNames('ui-form-table-icon', delProps.className)}
            onClick={() => onDeleteTr(record, index)}
          />
        </div>
      );
    },
  };

  // 插入 增加/刪除行操作列
  const finnalColumns = [
    preButton,
    ...columns.map((it) => {
      return {
        ...it,
        onCell: (record, rowIndex) => {
          return {
            ...it,
            record,
            rowIndex,
            form,
            rowKey,
          };
        },
        onHeaderCell: ({ asterisk }) => {
          return {
            className: asterisk ? 'ui-form-table-th-required' : '',
          };
        },
      };
    }),
  ];

  /**
   * 覆盖antd的getFieldsValue
   * @param {Number|Array} rowIndexs 传入某一行获取该行内容
   * @return {Object|Array} 传入单行索引返回对象
   * e.g. form.getFieldsValue() 获取所有
   * e.g. form.getFieldsValue(1) 第二行
   */
  const getFieldsValue = useCallback(
    (rowIndexs) => {
      const indexArr = Array.isArray(rowIndexs) ? rowIndexs : [rowIndexs];
      const values = form.getFieldValue(UI_FORM_TABLE);
      // console.log('Debug: values', values);
      // console.log('Debug: newDataSource', newDataSource);
      const keys = newDataSource.current.map((it) => it[rowKey]);
      // console.log('Debug: keys', keys);
      const list = keys.map((k) => values[k]);
      const ret = indexArr.map((k) => list[k]);
      if (rowIndexs !== undefined) {
        return Array.isArray(rowIndexs) ? ret : ret[0];
      }
      return list;
    },
    [form, rowKey],
  );

  /**
   * 覆盖antd的getFieldValue
   * @param {Number} index 行索引
   * @param {String} fieldName 字段名
   * e.g. form.getFieldValue(`${record.id}.count`)
   */
  const getFieldValue = useCallback(
    (index, fieldName) => {
      // console.log(index, newDataSource.current[index]);
      const key = get(newDataSource.current[index], rowKey);
      return form.getFieldValue(`${UI_FORM_TABLE}.${key}.${fieldName}`);
    },
    [form, rowKey],
  );

  /**
   * 覆盖antd的setFieldsValue
   * @param {Object} fieldName 字段名 约定需要加上rowKey值
   * @param {Function} callback 回调
   * e.g.
   * form.setFieldsValue({
   *   [`${record.id}.count`]: XXX
   * })
   */
  const setFieldsValue = useCallback(
    (fieldNameObj, callback) => {
      const obj = {};
      Object.keys(fieldNameObj).forEach(
        // eslint-disable-next-line
        (key) => (obj[`${UI_FORM_TABLE}.${key}`] = fieldNameObj[key]),
      );
      // console.log('form-table debugger:', obj);
      form.setFieldsValue(obj, callback);
    },
    [form],
  );

  /**
   * 覆盖antd的validateFields
   * todo: 校验行
   * @param {*} callback
   */
  const validateFields = useCallback(
    (rowIndexs, callback) => {
      let fieldNames = [];
      if (typeof rowIndexs === 'function') {
        callback = rowIndexs;
        rowIndexs = undefined;
      } else {
        const keys = Object.keys(getFieldsValue(0));
        rowIndexs.forEach((idx) => {
          const k = newDataSource.current[idx][rowKey];
          keys.forEach((dataIndex) => {
            fieldNames.push(`${UI_FORM_TABLE}.${k}.${dataIndex}`);
          });
        });
      }
      fieldNames = fieldNames.length ? fieldNames : undefined;
      form.validateFields(fieldNames, (err) => {
        // console.log(err);
        callback(err, getFieldsValue(rowIndexs));
      });
    },
    [form, getFieldsValue, rowKey],
  );

  const resetFields = useCallback(
    (index) => {
      // console.log(index, newDataSource.current[index]);
      const k = get(newDataSource.current[index], rowKey);
      const keys = Object.keys(getFieldsValue(0));
      let fieldNames = [];
      keys.forEach((dataIndex) => {
        fieldNames.push(`${UI_FORM_TABLE}.${k}.${dataIndex}`);
      });
      fieldNames = fieldNames.length ? fieldNames : undefined;
      form.resetFields(fieldNames);
    },
    [form, getFieldsValue, rowKey],
  );

  const tableForm = useRef({
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
    validateFields,
    resetFields,
  });

  const components = {
    body: {
      row: TableRow,
      cell: TableCell,
    },
  };

  useEffect(() => {
    // 外面获取form
    getForm(tableForm.current);
  }, [getForm, tableForm]);

  return (
    <Form style={{ height: '100%' }}>
      <AntdTable
        scroll={{ y: true }}
        type="editable"
        className={`ui-form-table ${className}`}
        components={components}
        columns={finnalColumns}
        bordered
        dataSource={dataSource}
        rowKey={rowKey}
        {...rest}
      />
    </Form>
  );
};

FormTable.defaultProps = {
  onAddTr() {},
  onDeleteTr() {},
  getForm() {},
  onAddIcon() {},
  onDelIcon() {},
};

export default Form.create()(FormTable);
