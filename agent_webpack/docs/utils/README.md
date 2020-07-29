## 工具函数

## 请求

```js
createServices = (requests = {}) => {
  const services = {};
  for (const i in requests) {
    const req = requests[i];
    if (typeof req === 'function') {
      services[i] = (data = {}, options = {}) =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            data = req(data);
            if (data.status === 200) {
              resolve(data.data);
            } else {
              reject(data);
            }
          }, options.delay || 500);
        });
    } else {
      const temp = req.split(':');
      const url = temp[0];
      const type = temp[1] || 'get';
      services[i] = (data = {}, options = {}) =>
        new Promise((resolve, reject) => {
          request[type](
            url,
            data,
            {
              200: (res) => {
                resolve(res.data);
              },
            },
            null,
            null,
            options,
          )
            .done((res) => {
              const { status } = res;
              if (status !== 200) {
                reject(res);
              }
            })
            .error((res) => reject(res));
        });
    }
  }
  return services;
};
```
