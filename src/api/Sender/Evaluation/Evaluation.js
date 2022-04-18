// 用户请求

import axios from "../../axios";


/**
 * 分页查询
 * @param query
 * @returns {*}
 */
export const evaluationByPage = (query)=>{
    return axios.request({
        url: '/comment/sender/display',
        method:'post',
        data:query
    })
}

