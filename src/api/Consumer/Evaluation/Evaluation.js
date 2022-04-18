// 用户请求

import axios from "../../axios";


/**
 * 分页查询
 * @param query
 * @returns {*}
 */
export const evaluationByPage = (query)=>{
    return axios.request({
        url: '/comment/user/display',
        method:'post',
        data:query
    })
}

/**
 * 删除
 * @param query
 * @returns {*}
 */
export const delEvaluation = (query)=>{
    return axios.request({
        url: '/comment/user/delete',
        method:'post',
        data:query
    })
}
