/*
添加拦截器:
拦截reques请求
拦截uploadFile文件上传

TODO:
1. 非http开头需拼接地址
2. 请求超时
3. 添加小程序端请求头标识
4. 添加token请求头标识
*/

import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 拦截器:
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1. 非http开头需拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 2. 请求超时
    options.timeout = 10000
    // 3. 添加小程序端请求头标识
    options.header = {
      'source-client': 'miniapp',
    }
    // 4. 添加token请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
    console.log(options)
  },
}

// 修正拼写错误
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

/* 封装请求方法
@param UniApp.RequestOptions
返回Promise
@eturns Promise
1.返回Promise对象
2.请求成功
  2.1提取核心数据res.data
  2.2添加类型，支持泛型
3.请求失败
  3.1网络错误->提示用户换网络
  3.2其他错误->根据后端错误信息轻提示
  3.3网络错误、其他错误->统一提示

*/

interface Data<T> {
  code: string
  msg: string
  result: T
}

// 确保这里正确导出 http 函数
//添加类型，支持泛型
export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success: (res) => {
        resolve(res.data as Data<T>)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
