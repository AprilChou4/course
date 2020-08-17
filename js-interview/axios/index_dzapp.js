import axios from 'axios'
import { Toast } from 'feart'

function generateReq(method) {
  return function request(url, params, config = { autoPrompt: true }) {
    let data = params
    if (method === 'get') {
      data = { params }
    }
    const { autoPrompt = true } = config
    delete config.autoPrompt
    url = url.startsWith('/') ? url : `/${url}`
    return axios[method](url, data, config)
      .then((response) => {
        const result = response.data
        // 成功
        if (result.status === 200) {
          return Promise.resolve(result.data)
        }
        // 登录失效
        if (result.status === 308) {
          // window.location.href = '/';
        }
        // 自行捕获错误，不弹窗
        if (autoPrompt) {
          Toast({
            message: result.message,
          })
        }
        return Promise.reject(result)
      })
      .catch((error) => {
        // 浏览器状态码status < 200 && status >= 300
        if (error.response) {
          Toast({
            message: error.response.statusText || error.response.data.error,
          })
        }
        return Promise.reject(error)
      })
  }
}

const instance = {
  get: generateReq('get'),
  post: generateReq('post'),
}

export default {
  install: (Vue) => {
    Object.defineProperty(Vue.prototype, '$request', { value: instance })
  },
}

// 使用
// const data = await this.$request.post('instead/v2/app/user/company/listCompany.do');
