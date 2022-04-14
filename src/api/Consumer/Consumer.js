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
        url: '/center/user/updatePswd',
        method:'post',
        data:query
    })
}

