import React from 'react';
import { isNumber } from 'lodash';

const FormTableFooter = ({ columns }) => {
  return (
    <table>
      <tbody>
        <tr>
          <td width="30" />
          {columns.map((it, index) => (
            <td
              key={it.dataIndex}
              width={it.width}
              align={index === 0 ? 'left' : 'right'}
              style={{ paddingRight: 19 }}
            >
              {isNumber(it.total) ? it.total.toFixed(2) : it.total}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default FormTableFooter;
