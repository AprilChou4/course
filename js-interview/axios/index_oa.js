// 调用 ajax.post('notice/user/getNoticeTypeList.do', { companyId });
import axios from 'axios'
import qs from 'qs'

// 统一url前缀
axios.defaults.baseURL = '/oa'
// 添加请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

function isObject(obj) {
  return (
    obj &&
    typeof obj === 'object' &&
    Object.prototype.toString.call(obj) !== '[object Array]'
  )
}

function format(data) {
  if (!isObject(data)) {
    return {
      code: 200,
      data,
      message: '',
    }
  }

  if ((data.code || data.message) && data.data) {
    return data
  }

  return {
    code: 200,
    data,
    message: '',
  }
}

axios.interceptors.response.use(
  (res) => {
    if (res.data === 'loseSession') {
      window.location.href =
        'https://u.jss.com.cn/Contents/usercenter/allow/login/login.jsp?redirecturl=oa'
      return {}
    }
    const resData = format(res.data || {})
    const code = String(resData.code)

    if (code !== '200') {
      return {
        _failed: true,
        ...resData,
      }
    }

    return {
      _failed: false,
      ...resData,
    }
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

export default {
  // 老框架里的请求方式，form表单的方式传值
  post(url, data) {
    return axios({
      method: 'post', // 请求协议
      url, // 请求的地址
      data: qs.stringify(data), // post 请求的数据
      timeout: 30000, // 超时时间, 单位毫秒
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
    })
  },
  get(url, params) {
    return axios({
      method: 'get',
      url: url + '?_=' + new Date().getTime(),
      params, // get 请求时带的参数
      timeout: 30000,
      // headers: {
      //   'X-Requested-With': 'XMLHttpRequest',
      // },
    })
  },
  jsonPost(url, data) {
    return axios({
      method: 'post', // 请求协议
      url, // 请求的地址
      data, // post 请求的数据
      timeout: 30000, // 超时时间, 单位毫秒
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    })
  },
  formDataPost(url, data) {
    return axios({
      method: 'post', // 请求协议
      url, // 请求的地址
      data, // post 请求的数据
      contentType: false, // 注意这里应设为false
      processData: false,
      timeout: 30000, // 超时时间, 单位毫秒
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
    })
  },
  SSOGet(url) {
    return axios({
      method: 'get',
      url,
      dataType: 'jsonp',
      async: false,
      jsonp: 'callback',
      jsonpCallback: 'user_lbn_jsonpResponse',
    })
  },
}
