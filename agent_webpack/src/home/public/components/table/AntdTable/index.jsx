/**
 * 对Antd.Table进行简化
 * 需要横向滚动条时，scroll.x要传true
 * 需要纵向滚动条时，scroll.y要穿true
 */
import React, { forwardRef, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import useComponentSize from '@rehooks/component-size';
import classnames from 'classnames';
import { Table } from 'antd';
import { get } from '@utils';
import './style.less';

const AntdTable = forwardRef(
  (
    {
      rowKey,
      columns,
      columnAutoMinWidth,
      dataSource,
      pagination,
      title,
      footer,
      scroll = {},
      locale = {},
      emptyType,
      type,
      className,
      ...restProps
    },
    ref,
  ) => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const wrapperRef = useRef(null);
    const wrapperSize = useComponentSize(wrapperRef);

    const getHeight = useCallback(() => {
      if (!wrapperRef.current) return;
      const container = wrapperRef.current;
      // 之所以没有用useMeasure就是因为useMeasure提供的ref找不到下级dom
      const $title = container.querySelector('.ant-table-title');
      const $thead = container.querySelector('.ant-table-thead');
      const $pagination = container.querySelector('.ant-table-pagination');
      const $footer = container.querySelector('.ant-table-footer');
      const $tbody = container.querySelector('.ant-table-tbody');
      const tbodyHeight = $tbody.offsetHeight;

      // 容器高度减去title、thead、pagination、footer的高度，就是表格的滚动高度，即scroll.y
      let y = wrapperSize.height || 0;
      if ($title) {
        y -= $title.offsetHeight;
      }
      if ($thead) {
        y -= $thead.offsetHeight;
      }
      if ($pagination) {
        y -= $pagination.offsetHeight;
      }
      if ($footer) {
        y -= $footer.offsetHeight;
      }

      // 当可用高度大于表格的实际高度时，不设置 scroll.y ，避免出现无用的纵向滚动条
      setHeight(y > tbodyHeight ? 0 : y);
    }, [wrapperSize.height]);

    // 是否有水平滚动，有的话会始终显示横向滚动条框（当存在固定列或者scroll.x有值的时候，为true）
    const hasHorizontalScroll = useMemo(
      () => get(scroll, 'x') || columns.some(({ fixed }) => !!fixed),
      [columns, scroll],
    );

    const getWidth = useCallback(() => {
      // 当没有水平滚动时，把横向滚动屏蔽
      if (!wrapperRef.current || !hasHorizontalScroll) {
        setWidth(0);
        return;
      }
      const calcX = columns.reduce(
        (acc, cur) => acc + (cur.width || cur.minWidth || columnAutoMinWidth),
        0,
      );
      // 先注释了，由于antd的bug，当存在固定列时，如果不设置scroll.x纵向滚动条会有问题
      // 当可用宽度大于表格的实际宽度时，不设置 scroll.x ，避免出现无用的横向滚动条
      // if (!(calcX > wrapperRef.current.querySelector('.ant-table-tbody').offsetWidth)) {
      //   console.log('bbbb');
      //   setWidth(0);
      //   return;
      // }
      setWidth(calcX);
    }, [columnAutoMinWidth, columns, hasHorizontalScroll]);

    useEffect(() => {
      scroll.y === true && getHeight();
    }, [dataSource, pagination, title, footer, getHeight, scroll.y]);

    useEffect(() => {
      getWidth();
    }, [wrapperSize, getWidth]);

    const paginations = useMemo(
      () =>
        pagination
          ? {
              size: 'large',
              current: 1,
              pageSize: 20,
              pageSizeOptions: ['20', '50', '100'],
              showSizeChanger: true,
              hideOnSinglePage: false,
              showTotal: (total) => `共${total}条`,
              ...pagination,
            }
          : false,
      [pagination],
    );

    const rowKeys = useMemo(
      () => (typeof rowKey === 'string' ? (record, index) => record[rowKey] || index : rowKey),
      [rowKey],
    );

    return (
      <div className="antd-table-container" ref={wrapperRef}>
        <Table
          tableLayout="fixed"
          title={title}
          footer={footer}
          columns={columns}
          pagination={paginations}
          dataSource={dataSource}
          locale={
            emptyType === 'default'
              ? locale
              : { emptyText: '暂无数据', filterReset: '清空', ...locale }
          }
          {...restProps}
          ref={ref}
          rowKey={rowKeys}
          className={classnames(
            'antd-table',
            `antd-table-emptyType-${emptyType}`,
            { [`antd-table-${type}`]: type },
            className,
          )}
          scroll={{ x: width, y: scroll.y === true ? height : scroll.y }}
        />
      </div>
    );
  },
);

AntdTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  columnAutoMinWidth: PropTypes.number, // 未设置宽度的列的最小宽度
  emptyType: PropTypes.string, // 数据为空时的背景图片类型，default是默认图片，customized是UI给的图片
};

AntdTable.defaultProps = {
  columns: [],
  columnAutoMinWidth: 150,
  emptyType: 'customized',
};

export default AntdTable;
