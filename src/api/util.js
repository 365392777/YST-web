import request from '@/utils/request'

// 首页
export function homeStatistical() {
    return request({
        url: '/homePage/statisticalData',
        method: 'post',
        data: {}
    })
}

// 重置密码发送验证码
export function sendIdentifyingCode(phoneNumber) {
    return request({
        url: '/sysUserAccount/sendIdentifyingCode',
        method: 'post',
        data: {
            phoneNumber
        },
    })
}

// 验证验证码
export function verifyIdentifyingCode(phoneNumber, identifyingCode) {
    return request({
        url: '/sysUserAccount/verifyIdentifyingCode',
        method: 'post',
        data: {
            phoneNumber,
            identifyingCode,
        },
    })
}

// 重置密码
export function resetPassword(phoneNumber, password) {
    return request({
        url: '/sysUserAccount/resetPassword',
        method: 'post',
        data: {
            phoneNumber,
            password,
        },
    })
}
// 修改密码发送验证码
export function sendEditCode(phoneNumber) {
    return request({
        url: '/homePage/sendIdentifyingCode',
        method: 'post',
        data: {
            phoneNumber
        }
    })
}

// 修改密码发送验证码
export function verifyEditCode(identifyingCode) {
    return request({
        url: '/homePage/verifyIdentifyingCode',
        method: 'post',
        data: {
            identifyingCode
        }
    })
}

// 修改密码发送验证码
export function updatePass(password) {
    return request({
        url: '/homePage/updatePassword',
        method: 'post',
        data: {
            password
        }
    })
}

// 查询字典列表
export function getDicList(dicType) {
    return request({
        url: '/paramOperate/getTSysSecondDicList.int.do',
        method: 'post',
        data: {
            dicType
        }
    })
}

// 获取省级信息列表
export function getProvince() {
    return request({
        url: '/paramOperate/getProvinceList.int.do',
        method: 'post',
    })
}

// 根据区域上级编码获取所有的下级数据信息列表
export function getArea(code) {
    return request({
        url: '/paramOperate/getAreaListByCode.int.do',
        method: 'post',
        data: {
            code
        }
    })
}

// 处理广告图片
export function uploadImage(data, progressCallback) {
    return request({
        url: '/paramOperate/getTAdvertisementImage.int.do',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress(progressEvent) {
            progressCallback && progressCallback(progressEvent)
        },
        data: data,
    })
}

// 获取菜单树
export function getMenus() {
    return request({
        url: '/sysOperate/buildMenuTree.int.do',
        method: 'post'
    })
}

// 获取商品分类列表
export function getComodityClassList() {
    return request({
        url: '/commodityParameter/tCommodityClassList.int.do',
        method: 'post',
    })
}

// 获取商品品牌列表
export function getComodityBrandList() {
    return request({
        url: '/commodityParameter/tCommodityBrandList.int.do',
        method: 'post',
    })
}

// 获取商品运费规则列表
export function getComodityFreightList() {
    return request({
        url: '/commodityParameter/tFreightTemplateList.int.do',
        method: 'post',
    })
}

// 获取商品供应商列表
export function getComoditySupplierList() {
    return request({
        url: '/commodityParameter/tCommoditySupplierList.int.do',
        method: 'post',
    })
}

// 获取图片
export function getImageData(id) {
    return request({
        url: '/largeFile/image/liveChatImage/findById',
        method: 'get',
        params: {
            id,
        }
    })
}

// 保存图片
export function saveImageData(data) {
    return {
        url: '/largeFile/image/liveChatImage/saveOne',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        onUploadProgress(progressEvent) {
            progressCallback && progressCallback(progressEvent)
        },
        data: data,
    }
}
