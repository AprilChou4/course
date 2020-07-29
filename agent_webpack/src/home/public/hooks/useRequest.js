import React, { useState, useEffect } from 'react';

/**
 * 自定义hook
 * 组件内请求数据
 *
 * @param {*} initValue
 * @param {*} { request } request - 请求函数 promise，如 services.getList({type: 1});
 * @returns
 */
const useRequest = (initValue, { service, params } = { params: {} }) => {
  const [data, setData] = useState(initValue);

  useEffect(() => {
    const fetchData = async () => {
      const res = await service(params);
      setData(res || null);
    };
    fetchData();
  }, [params, service]);

  return [data, setData];
};

export default useRequest;
