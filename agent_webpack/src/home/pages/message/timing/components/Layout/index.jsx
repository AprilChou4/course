import React from 'react';
import { connect, router, withNuomi } from 'nuomi';
import { Table, Button, Input } from 'antd';

const Layout = ({ dataSource, loadings, dispatch, searchContent, nuomiProps }) => {
  const handleBtn1Click = () => {
    dispatch({
      type: 'initData',
    });
    router.location('/message/timing', ({ store }) => {
      store.dispatch({
        type: 'updateState',
        payload: {
          searchContent: '4396',
        },
      });
    });
  };

  const handleBtn2Click = () => {
    dispatch({
      type: 'updateLoading',
      payload: {
        loading1: true,
      },
    });
  };

  const handleBtn3Click = () => {
    dispatch({
      type: 'updateLoading',
      payload: {
        loading1: false,
      },
    });
  };

  const onChange = (e) => {
    dispatch({
      type: 'updateState',
      payload: {
        searchContent: e.target.value,
      },
    });
  };

  const tableProps = {
    dataSource,
    columns: [
      {
        title: 'id',
        dataIndex: 'id',
      },
    ],
    rowKey: 'id',
    loading: loadings.$getList,
  };

  return (
    <>
      <div style={{ padding: 10 }}>
        <Button type="primary" onClick={handleBtn1Click}>
          primary
        </Button>
        <Button type="primary" disabled>
          primary disabled
        </Button>
        <Button type="highlight">highlight</Button>
        <Button disabled type="highlight">
          highlight disabled
        </Button>
        <Button onClick={handleBtn2Click}>default</Button>
        <Button disabled>default disabled</Button>
        <Button type="link" onClick={handleBtn3Click}>
          link
        </Button>
        <Button type="link" disabled>
          link disabled
        </Button>
        <Button ghost>ghost</Button>
        <Button ghost disabled>
          ghost disabled
        </Button>
      </div>
      <div>
        <p>上一次value(自定义hook)：{previousValue}</p>
        <Input.Search
          enterButton
          value={searchContent}
          onChange={onChange}
          style={{ width: 300 }}
        />
      </div>
      <Table {...tableProps} />
    </>
  );
};

export default connect(({ dataSource, searchContent, loadings }) => ({
  dataSource,
  searchContent,
  loadings,
}))(withNuomi(Layout));
