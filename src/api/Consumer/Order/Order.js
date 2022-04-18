// 用户请求

import axios from "../../axios";

/**
 * 分页查询
 * @param query
 * @returns {*}
 */
export const orderByPage = (query)=>{
    return axios.request({
        url: '/order/user',
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
        url: 'order/user/delete',
        method:'post',
        data:query
    })
}

/**
 * 增加订单
 * @param query
 * @returns {*}
 */
export const addOrder = (query)=>{
    return axios.request({
        url: '/order/placeOrder',
        method:'post',
        data:query
    })
}

/**
 * 修改订单
 * @param query
 * @param query1
 * @returns {*}
 */
export const exitOrder = (query,query1)=>{
    return axios.request({
        url: '/order/cancel/'+query+'/'+query1,
        method:'get',
    })
}

/**
 * 根据用户id和地址id获取单个订单
 * @param query
 * @returns {*}
 */
export const getOrderById = (query)=>{
    return axios.request({
        url: '/order/single',
        method:'post',
        data:query
    })
}

/**
 * 评价
 * @param query
 * @returns {*}
 */
export const commentSender = (query)=>{
    return axios.request({
        url: '/comment/sender',
        method:'post',
        data:query
    })
}




