
// 用户请求

import axios from "../axios";

/**
 * 编辑用户
 * @param query
 * @returns {*}
 */
export const exitAdmin = (query)=>{
    return axios.request({
        url: '/center/admin/updateAccount',
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
        url: '/center/admin/updatePswd',
        method:'post',
        data:query
    })
}

/**
 * 获取信息
 * @returns {AxiosPromise}
 */
export const getAdmin = ()=> {
    return axios.request({
        url: '/center/admin/display',
        method: 'get'
    })
}
