import request from '@/utils/request'

// 医院列表
export function getHospitalList(query) {
    return request({
        url: '/paramOperate/getHospitalList.int.do',
        method: 'post',
        data: query,
    })
}

// 添加或更新医院信息
export function saveHospital(data) {
    return request({
        url: '/paramOperate/tHospitalOPerate.int.do',
        method: 'post',
        data,
    })
}

// 获取医院信息
export function getHospitalDetail(id) {
    return request({
        url: '/paramOperate/getHospitalDetail.int.do',
        method: 'post',
        data: { id },
    })
}

// 删除医院信息
export function deleteHospital(ids) {
    return request({
        url: '/paramOperate/tHospitalDelete.int.do',
        method: 'post',
        data: { ids },
    })
}

// 是否启用医院
export function enableHospital(ids, status) {
    return request({
        url: '/paramOperate/tHospitalEnable.int.do',
        method: 'post',
        data: { ids, status }
    })
}

// fsmp列表
export function getFsmpList(data) {
    return request({
        url: '/paramOperate/getTFSMPList.int.do',
        method: 'post',
        data,
    })
}

// 添加或更新fsmp信息
export function saveFsmp(data) {
    return request({
        url: '/paramOperate/tTFSMPOPerate.int.do',
        method: 'post',
        data,
    })
}

// 获取fsmp详情
export function getFsmpDetail(id) {
    return request({
        url: '/paramOperate/getTFSMPDetail.int.do',
        method: 'post',
        data: { id },
    }) 
}

// 删除fsmp
export function deleteFsmp(ids) {
    return request({
        url: '/paramOperate/tTFSMPDelete.int.do',
        method: 'post',
        data: { ids },
    })
}

// 导入fsmp
export function importFsmp(data) {
    return request({
        url: '/paramOperate/tFsmpImport.int.do',
        method: 'post',
        data,
    })
}

// 敏感词列表
export function getSensitiveList(query) {
    return request({
        url: '/paramOperate/getSensitiveWordsList.int.do',
        method: 'post',
        data: query,
    })
}

// 敏感词详情
export function getSensitiveDetail(id) {
    return request({
        url: '/paramOperate/getTSensitiveWordsDetail.int.do',
        method: 'post',
        data: { id },
    })
}

// 导入敏感词
export function importSensitive(data) {
    return request({
        url: '/paramOperate/tSensitiveWordsImport.int.do',
        method: 'post',
        data,
    })
}

// 添加或更新敏感词
export function saveSensitive(data) {
    return request({
        url: '/paramOperate/tSensitiveWordsOPerate.int.do',
        method: 'post',
        data,
    })
}

// 删除敏感词
export function deleteSensitive(ids) {
    return request({
        url: '/paramOperate/tSensitiveWordsDelete.int.do',
        method: 'post',
        data: { ids },
    })
}

// 获取仓库库位列表
export function getStorageList(data) {
    return request({
        url: '/paramOperate/getTStockLocationList.int.do',
        method: 'post',
        data,
    }) 
}

// 添加或更新仓库库位信息
export function saveStorage(data) {
    return request({
        url: '/paramOperate/tStockLocationOPerate.int.do',
        method: 'post',
        data,
    }) 
}

// 获取仓库库位详情
export function getStorageDetail(id) {
    return request({
        url: '/paramOperate/getTStockLocationDetail.int.do',
        method: 'post',
        data: { id },
    }) 
}

// 删除仓库库位
export function deleteStorage(ids) {
    return request({
        url: '/paramOperate/tStockLocationDelete.int.do',
        method: 'post',
        data: { ids },
    })
}

// 查看其他参数详情
export function getOtherDetail() {
    return request({
        url: '/paramOperate/getTOtherParamDetail.int.do',
        method: 'post',
    })
}

// 保存其他参数信息
export function saveOther(data) {
    return request({
        url: '/paramOperate/tOtherParamOPerate.int.do',
        method: 'post',
        data,
    })
}

// 获取广告列表
export function getAdvertisingList(data) {
    return request({
        url: '/paramOperate/getTAdvertisementList.int.do',
        method: 'post',
        data,
    })
}

// 保存广告信息
export function saveAdvertising(data) {
    return request({
        url: '/paramOperate/tAdvertisementOPerate.int.do',
        method: 'post',
        data,
    })
}

// 获取广告详情
export function getAdvertisingDetail(id) {
    return request({
        url: '/paramOperate/getTAdvertisementDetail.int.do',
        method: 'post',
        data: { id },
    })
}

// 删除广告
export function deleteAdvertising(ids) {
    return request({
        url: '/paramOperate/tAdvertisementDelete.int.do',
        method: 'post',
        data: { ids },
    })
}

// 保存后台单张广告图片
export function saveOneCommomImage(data) {
    return request({
        url: '/imageRelationOperate/saveOneCommomImage',
        method: 'post',
        data,
    })
}

// 获取商城图标列表
export function getMallIconList(data) {
    return request({
        url: '/paramOperate/getTMallIconList.int.do',
        method: 'post',
        data,
    })
}

// 保存商城图标信息
export function saveMallIcon(data) {
    return request({
        url: '/paramOperate/tMallIconOPerate.int.do',
        method: 'post',
        data,
    })
}

// 获取商城图标详情
export function getMallIconDetail(id) {
    return request({
        url: '/paramOperate/getTMallIconDetail.int.do',
        method: 'post',
        data: { id },
    })
}

// 获取意见反馈列表
export function getFeedbackList(data) {
    return request({
        url: '/paramOperate/getTFeedbackList.int.do',
        method: 'post',
        data,
    })
}

// 跟进反馈意见
export function dealFeedback(data) {
    return request({
        url: '/paramOperate/dealTFeedback.int.do',
        method: 'post',
        data,
    })
}

// 获取反馈意见
export function getFeedbackDetail(id, flag) {
    return request({
        url: '/paramOperate/getTFeedbackDetail.int.do',
        method: 'post',
        data: { id, flag },
    })
}

// 删除反馈意见
export function deleteFeedback(ids) {
    return request({
        url: '/paramOperate/deleteTFeedback.int.do',
        method: 'post',
        data: { ids },
    })
}

// 获取客服信息
export function getCustomerService() {
    return request({
        url: '/paramOperate/getTSysCustomerSer.int.do',
        method: 'get',
    })
}

// 保存客服信息
export function saveCustomerService(data) {
    return request({
        url: '/paramOperate/tSysCustomerSerOperate.int.do',
        method: 'post',
        data,
    })
}

// 保存客服信息二维码
export function saveCustomerImage(data) {
    return request({
        url: '/imageRelationOperate/saveCommomImage',
        method: 'post',
        data,
    })
}
