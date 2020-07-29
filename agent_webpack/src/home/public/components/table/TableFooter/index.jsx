import React from 'react';
import { isNumber } from 'lodash';
import './style.less';

const TableFooter = ({ columns, className }) => {
  return (
    <table className={className}>
      <tbody>
        <tr>
          {columns.map((item) => {
            const style = {
              ...(item.align ? { textAlign: item.align } : {}),
              ...(item.totalStyle || {}),
            };
            return (
              <td key={item.dataIndex} width={item.width} style={style}>
                {isNumber(item.total) ? item.total.toFixed(2) : item.total}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
};

export default TableFooter;
