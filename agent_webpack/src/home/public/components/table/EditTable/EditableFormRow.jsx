/* eslint-disable react/jsx-props-no-spreading */
import React, { createContext } from 'react';
import { Form } from 'antd';

export const EditableContext = createContext();

const EditableFormRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr style={{ position: 'relative' }} {...props} />
  </EditableContext.Provider>
);

export default Form.create()(EditableFormRow);
