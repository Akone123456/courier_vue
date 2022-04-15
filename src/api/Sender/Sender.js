// 用户请求

import axios from "../axios";

/**
 * 编辑用户
 * @param query
 * @returns {*}
 */
export const exitSender = (query)=>{
    return axios.request({
        url: '/center/sender/updateAccount',
        method:'post',
        data:query
    })
}

/**
 *  修改密码
 * @param query
 * @returns {AxiosPromise}
 */
export const changePwd = (query)=>{
    return axios.request({
        url: '/center/sender/updatePswd',
        method:'post',
        data:query
    })
}

/**
 * 获取信息
 * @returns {AxiosPromise}
 */
export const getSender = ()=> {
    return axios.request({
        url: '/center/sender/display',
        method: 'get'
    })
}
