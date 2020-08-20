
记账项目中的请求模块封装方法，目标是

- 异步请求数据 0 判断，0 错误处理，代码量最少
- 写法最简洁
- 接口地址、请求类型与请求逻辑、数据流解耦，单独、简易维护
- 全局捕获 promise 错误，不用到处 try catch
- 可自定义配置 status 状态码对应执行函数
- 全局 loading 配置
- 默认返回 res.data 更方便处理数据，可配置返回所有

## 目标请求用法

```js
// services.js
export default util.createServices({
  getUsers: 'test/user/list:get',
  addUsers: 'test/user/add:post'
});

// effects.js
const getUsers = async (params) => {
  const users = await services.getUsers(params);
  // service 请求出错时一下代码不会执行，默认无需错误捕获
  this.setState({ users: users || [] })
};

// 默认不需要错误捕获，但有时可能也需要获取错误信息自定义操作
const getUsers = async (params) => {
  const res = await services.getUsers(params).catch(err=> {
     console.log(err)
  });
  
  // 或
  try{
    const res = await services.getUsers(params);
  }catch(err) {
    console.log(err)
  }
  
  // 此时捕获到错误，后续代码会执行，需要额外判断
  if(!res) return;
  
  this.setState({ users: users || [] })
};

```

- 可选 service 配置项

```js
const res = await services.getUsers(params, {
  // 默认 false，返回 res.data，为 true 时返回 res
  returnAll: true,
  // 请求显示全局 loading 提示
  loading: '请稍后...',
  // 自定义 status 对应业务逻辑
  status: {
    '^300': (res) => {
      message.error(res.message);
    },
    '30000000082': () => {
      // do something...
    },
  },
});
```


## createServices 函数

```js
const createServices = (services = {}) => {
  const requests = {};

  Object.entries(services).forEach((item) => {
    const [name, urlAndType] = item;

    const [url, initType] = urlAndType.split(':');
    // 默认 type 为 get
    const type = initType || 'get';

    requests[name] = async (data = {}, options = {}) => {
    
      const { loading, returnAll, ...otherOptions } = options;
      // 请求全局 loading 触发
      if (loading) {
        store.dispatch({
          type: 'account/_updateLoading',
          payload: {
            loading,
          },
        });
      }

      let res = null;
      let errRes = null;
      
      // 调用 request 模块
      res = await request({ url, data, type, ...otherOptions })
        .catch((err) => {
          errRes = err;
        })
        .finally(() => {
          if (loading) {
            store.dispatch({
              type: 'account/_updateLoading',
              payload: {
                loading: false,
              },
            });
          }
        });

      // 请求出错（404 或 res.status !== 200 等预先配置的错误类型）
      if (errRes) {
        // return reject 状态时可以中止 async 函数后续代码的执行，
        // 从而不用在 async 函数中做额外的错误处理
        return Promise.reject(errRes || '请求失败');
      }
        
      // 默认返回 res.data
      return returnAll ? res : res.data;
    };
  });

  return requests;
};
```

## request 采用 axios 实现

内部封装

1. 请求类型对应 content-type 

```js
const contentTypeConfig = {
  fd: 'multipart/form-data;charset=UTF-8',
  post: 'application/x-www-form-urlencoded; charset=UTF-8',
  json: 'application/json',
};
```
2. url 前后缀添加
3. 请求参数 encode
4. 请求错误处理

```js
// 省略 contentTypeConfig、method 具体配置

// axios
  const axiosConfig = {
    ...otherConfig,
    url: URL,
    method: method || type, // 适配其他 method
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      ...headers,
    },
    params: type === 'get' ? { ...querys, ...config.data } : querys, // 请求参数 url 参数
    withCredentials: true,
    transformRequest: [formatData],
  };

  let res = null;
  try {
    res = await axios.request(axiosConfig);
  } catch (err) {
    console.log('request error:', err);
  }
  // 处理 404 等请求本身错误
  if (!res) {
    message.error('请求失败');
    return Promise.reject('请求失败');
  }

  // 后端返回数据
  const resData = res.data;
  const { status } = resData;

  // 登录状态验证 intercept
  const testRes = intercept({ ...resData, url: URL });
  
  if (testRes === false) {
    return Promise.reject('请求失败');
  }

   // 自定义 status: customStatusConfig 执行,即 service 调用时传入的 status 配置
   // statusConfig 为默认 status 配置，一般配置 200 为成功，其他为失败
  const STATUS_CONFIG = customStatusConfig || statusConfig;
  const statusConfigKeys = Object.keys(STATUS_CONFIG);
  let statusFn = null;

  statusConfigKeys.forEach((key) => {
    if (new RegExp(key).test(`${status}`)) {
      statusFn = STATUS_CONFIG[key];
    }
  });

  // 执行 status 对应的自定义函数或配置的全局函数，如 错误提示
  if (statusFn) {
    statusFn(resData);
  }

  if (Number(status) !== 200) {
    return Promise.reject(resData);
  }

  return resData;
```


