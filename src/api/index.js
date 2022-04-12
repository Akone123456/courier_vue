import http from './request'



//管理员登录=====================================http://localhost:8088/admin/loginByPassword
export const login = query => http({
  url: '/admin/login',
  method: 'post',
  params: {
    ...query
  }

})
//配送员登录-密码登录
export const sendereLoginByPassword = query => http({
  url: '/admin/sender/loginByPassword',
  method: 'post',
  params: {
    ...query
  }

})
//配送员登录-验证码登录
export const sendereLoginByCode = query => http({
  url: '/admin/sender/loginByCode',
  method: 'post',
  params: {
    ...query
  }

})

//发送短信验证码
export const sendSms = query => http({
  url: '/sendSms',
  method: 'get',
  params: {
    ...query
  }

})

//普通用户注册
export const addUserinfo = query => http({
  url: '/admin/userinfo/save',
  method: 'get',
  params: {
    ...query
  }

})
//验证账号唯一性
export const valiUserName = query => http({
  url: '/admin/userinfo/valiUserName',
  method: 'get',
  params: {
    ...query
  }

})
//普通用户-短信登录
export const userinfoLoginByCode = query => http({
  url: '/admin/userinfo/loginByCode',
  method: 'post',
  params: {
    ...query
  }

})
//普通用户-账号密码登录
export const userinfoLoginByPassword = query => http({
  url: '/admin/userinfo/loginByPassword',
  method: 'post',
  params: {
    ...query
  }

})
//普通用户-人脸识别登录
export const faceMatch = query => http({
  url: '/admin/userinfo/faceMatch',
  method: 'post',
  params: {
    ...query
  }
})

//采集人脸
export const addFaceData = query => http({
  url: '/admin/userinfo/addFaceData',
  method: 'post',
  params: {
    ...query
  }
})
//修改用户基本信息
export const updateUser = query => http({
  url: '/admin/userinfo/update',
  method: 'post',
  params: {
    ...query
  }
})

//修改管理员密码
export const AdminUpdateUpass = query => http({
    url: '/admin/updateUpass',
    method: 'post',
    params: {
        ...query
    }

})
//修改配送员密码
export const EmpUpdateUpass = query => http({
    url: '/admin/sender/updateUpass',
    method: 'post',
    params: {
        ...query
    }

})
//修改普通用户密码
export const UserUpdateUpass = query => http({
    url: '/admin/userinfo/updateUpass',
    method: 'post',
    params: {
        ...query
    }

})




//查询配送员
export const adminSenderPage = query => http({
  url: '/admin/sender/page',
  method: 'get',
  params: {
    ...query
  }
})
//编码必须唯一
export const adminSenderexistsUno = query => http({
  url: '/admin/sender/existesUno',
  method: 'get',
  params: {
    ...query
  }
})
//添加配送员
export const adminAddSender = query => http({
  url: '/admin/sender/add',
  method: 'post',
  params: {
    ...query
  }
})
//删除配送员
export const adminDeleteSender = query => http({
  url: '/admin/sender/delete',
  method: 'get',
  params: {
    ...query
  }
})


//启用禁用配送员
export const adminChaneStateSender = query => http({
  url: '/admin/sender/update',
  method: 'post',
  params: {
    ...query
  }
})

//初始化配送员密码
export const adminInitUpassSender = query => http({
  url: '/admin/sender/initUpass',
  method: 'post',
  params: {
    ...query
  }
})

//普通用户管理
export const adminUsersPage = query => http({
  url: '/admin/userinfo/page',
  method: 'get',
  params: {
    ...query
  }
})


