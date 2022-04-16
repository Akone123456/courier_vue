// 用户请求

import axios from "../../axios";

/**
 * 分页查询
 * @param query
 * @returns {*}
 */
export const orderByPage = (query)=>{
    return axios.request({
        url: '/order/sender',
        method:'post',
        data:query
    })
}

/**
 * 配送，或者完成订单
 * @param query
 * @returns {*}
 */
export const receiveOrder = (query)=>{
    return axios.request({
        url: '/order/receiveOrder',
        method:'post',
        data:query
    })
}

/**
 * 删除订单
 * @param query
 * @returns {*}
 */
export const delOrder = (query)=>{
    return axios.request({
        url: '/order/sender/delete',
        method:'post',
        data:query
    })
}


