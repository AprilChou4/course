import React, { Component } from 'react';

const prefix = ['t', 'msT', 'MozT', 'WebkitT'];

class VirtualTable extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.scrolling === true;
  }

  getTranslateYStyle() {
    const { table } = this.props;
    const { translateY, tableBodyScrollTop } = table;
    const style = {};
    prefix.forEach((pre) => {
      style[`${pre}ransform`] = `translateY(-${tableBodyScrollTop - translateY}px)`;
    });
    return style;
  }

  getRowKey(record) {
    const { rowKey } = this.props;
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey];
  }

  render() {
    const { columns, dataSource, rowHeight, style, table } = this.props;
    return (
      <div className="ant-supertable ant-virtual-table" style={style}>
        <table style={this.getTranslateYStyle()}>
          <tbody className="ant-table-tbody">
            {dataSource.map((record, index) => {
              return (
                <tr key={this.getRowKey(record)}>
                  {columns.map(({ dataIndex, align, width, render, className, colSpan, key }) => {
                    return (
                      <td
                        key={dataIndex || key}
                        style={{ height: rowHeight }}
                        width={width}
                        align={align}
                        className={className}
                      >
                        {render ? render(record[dataIndex], record, index) : record[dataIndex]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default VirtualTable;
