// 用户请求

import axios from "../axios";

/**
 * 编辑用户
 * @param query
 * @returns {*}
 */
export const exitUser = (query)=>{
    return axios.request({
        url: '/center/user/updateAccount',
        method:'post',
        data:query
    })
}

/**
 *
 * @param query
 * @returns {AxiosPromise}
 */
export const changePwd = (query)=>{
    return axios.request({
        url: '/center/user/updatepswd',
        method:'post',
        data:query
    })
}

/**
 * 获取信息
 * @returns {AxiosPromise}
 */
export const getUser = (query)=> {
    return axios.request({
        url: 'center/user/display/'+query,
        method: 'get'
    })
}

