// request.js
import axios from 'axios'
import QS from 'qs'; //如果是form表单需要通过qs模块进行序列化数据
// 一些请求的基本配置
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,// 接口的域名地址
    // timeout: 5000,
    headers: {"Content-Type": "application/x-www-form-urlencoded;charset=utf-8"}//form表单格式
    // headers: {"Content-Type": "application/json;charset=utf-8"}//json格式
})

// 输出方法
export default function request(option) {
    return new Promise((resolve, reject) => {
        const options = {
            url: option.url,
            method: option.method,
            params: option.params ,
            responseType: option.responseType || '',
            data:QS.stringify(Object.assign(option.params)),
            timeout: option.timeout || 15000
        }
        if(option.method === 'get'){//判断请求方式
            delete options.data;
        }else{
            delete options.params;
        }
        if (option.headers) {
            options.headers = option.headers;
        }
        service(options)
            .then(
                res => {
                    resolve(res);
                },
                res => {
                    if (option.reject) {
                        reject(res);
                    }
                })
            .catch(error => {
                reject()
                console.error(error)
            })
    })
}
