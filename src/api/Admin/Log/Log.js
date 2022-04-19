// 用户请求

import axios from "../../axios";

/**
 * 分页查询
 * @param query
 * @returns {*}
 */
export const logByPage = (query)=>{
    return axios.request({
        url: '/orderLog/display',
        method:'post',
        data:query
    })
}
