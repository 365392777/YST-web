import request from '@/utils/request'

export function loginByUserid(userLoginid, userLoginpassword) {
    const data = {
        userLoginid,
        userLoginpassword
    }
    return request({
        url: '/sysOperate/userLogin.int.do',
        method: 'post',
        data,
    })
}

export function getCurrentUserInfo() {
    return request({
        url: '/sysOperate/getCurrentUserInfo.int.do',
        method: 'post',
    })
}

export function loginOut() {
    return request({
        url: '/sysOperate/loginOut.int.do',
        method: 'post',
    })
}
