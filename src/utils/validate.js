/**
 * Created by guweimo on 19/01/17
 */

// 验证手机号码
export function isValidPhone(value) {
    let reg = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/
    return reg.test(value)
}

// 验证座机
export function isValidTel(value) {
    let reg = /^([0-9]{3,4}-)?[0-9]{7,8}$/
    return reg.test(value)
}
