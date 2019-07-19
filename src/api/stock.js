import request from '@/utils/request'

// 获取出入库列表
export function getStatistics(data) {
    return request({
        url: '/stock/findStockStatistics',
        method: 'post',
        data,
    })
}

// 获取出入库历史列表
export function operateList(data) {
    return request({
        url: '/stock/findOperateRecords',
        method: 'post',
        data,
    })
}

// 出入库操作
export function saveOperate(type, jsonArray) {
    return request({
        url: '/stock/stockOperate',
        method: 'post',
        data: {
            type,
            jsonArray,
        },
    })
}

// 获取所有的库位
export function getStockLocation() {
    return request({
        url: '/paramOperate/findAllStockLocations',
        method: 'post',
    })
}

// 根据条件获取库位 （出库）
export function getOutStockLocation(goodsId, goodsSpeLoadId) {
    return request({
        url: '/paramOperate/findStockLocationsByParameter',
        method: 'post',
        data: {
            goodsId,
            goodsSpeLoadId,
        },
    })
}

// 获取出库库存
export function getOutStockAmount({goodsId, goodsSpeLoadId, stId}
    ) {
    return request({
        url: '/stock/queryStockAmount',
        method: 'post',
        data: {
            goodsId,
            goodsSpeLoadId,
            stId,
        },
    })
}

// 获取盘点列表
export function getCheckList(data) {
    return request({
        url: '/stock/showStockList',
        method: 'post',
        data,
    })
}

// 获取商品分类列表
export function getComodityClassList() {
    return request({
        url: '/commodityParameter/getAllTCommodityClass',
        method: 'post',
    })
}

// 获取盘点历史列表
export function getCheckHistoryList(data) {
    return request({
        url: '/stock/findCheckRecords',
        method: 'post',
        data,
    })
}

// 保存盘点
export function saveCheck(jsonArray) {
    return request({
        url: '/stock/stockCheck',
        method: 'post',
        data: {
            jsonArray
        },
    })
}

// 更新状态 (0 结束盘点， 1开始盘点)
export function updateStatus(status) {
    return request({
        url: '/stock/updateCheckStatus',
        method: 'post',
        data: {
            status
        },
    })
}

// 当前用户操作盘点
export function currentUserOperate() {
    return request({
        url: '/stock/getCheckStatusDetail',
        method: 'post',
    })
}
