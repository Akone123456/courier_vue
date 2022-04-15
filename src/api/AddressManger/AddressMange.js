// 用户请求

import axios from "../axios";

/**
 * 分页查询
 * @param query
 * @returns {*}
 */
export const addressByPage = (query)=>{
    return axios.request({
        url: '/address/display',
        method:'post',
        data:query
    })
}

/**
 * 增加地址
 * @param query
 * @returns {*}
 */
export const addAddress = (query)=>{
    return axios.request({
        url: '/address/add',
        method:'post',
        data:query
    })
}

/**
 * 修改地址
 * @param query
 * @returns {*}
 */
export const exitAddress = (query)=>{
    return axios.request({
        url: '/address/update',
        method:'post',
        data:query
    })
}

/**
 * 删除地址
 * @param query
 * @returns {*}
 */
export const delAddress = (query)=>{
    return axios.request({
        url: '/address/delete',
        method:'post',
        data:query
    })
}


