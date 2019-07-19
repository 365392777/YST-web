import request from '@/utils/request'

// 获取积分商品列表
export function getIntegralGoodsList(data) {
    return request({
        url: '/goodsManage/integralMall.getIntegralGoodList',
        method: 'post',
        data
    })
}

// 添加积分商品
export function addIntegralGoods(ids) {
    return request({
        url: '/goodsManage/integralMall.addIntegralGoods',
        method: 'post',
        data: {
            ids,
        }
    })
}

// 上下架积分商品列表
export function putAwayIntegralGoods(goodsId) {
    return request({
        url: '/goodsManage/integralMall.putAwayIntegralGoods',
        method: 'post',
        data: {
            goodsId,
        }
    })
}

// 删除积分商品
export function deleteIntegralGoods(ids) {
    return request({
        url: '/goodsManage/integralMall.deleteIntegralGoods',
        method: 'post',
        data: {
            ids,
        }
    })
}

// 获取抽奖设置列表
export function getLotterySetList(params) {
    return request({
        url: '/lottery/getAll',
        method: 'get',
        params
    })
}

// 获取抽奖设置详情
export function getLotterySetDetail(lotteryId) {
    return request({
        url: '/lottery/getOneById',
        method: 'get',
        params: {
            lotteryId,
        }
    })
}

// 保存抽奖设置
export function saveLotterySet(data) {
    return request({
        url: '/lottery/lotteryOprate',
        method: 'post',
        data,
    })
}

// 删除抽奖设置
export function deleteLotterySet(ids) {
    return request({
        url: '/lottery/deleteBatchById',
        method: 'post',
        data: {
            ids
        }
    })
}

// 是否启动抽奖设置
export function enableLotterySet(lotteryId) {
    return request({
        url: '/lottery/updateLotteryStatus',
        method: 'post',
        data: {
            lotteryId
        }
    })
}

// 获取抽奖记录
export function getLotteryRecordList(data) {
    return request({
        url: '/lotteryRecord/getAll',
        method: 'post',
        data
    })
}

// 获取抽奖详情
export function getLotteryRecordDetail(lotteryRecordId) {
    return request({
        url: '/lotteryRecord/getOneById',
        method: 'get',
        params: {
            lotteryRecordId,
        }
    })
}

// 获取兑换记录列表
export function getExchangeList(data) {
    return request({
        url: '/integralExchangeRecord/getAll',
        method: 'post',
        data
    })
}

// 获取兑换记录详情
export function getExchangeDetail(id) {
    return request({
        url: '/integralExchangeRecord/background.getOneRecordById',
        method: 'get',
        params: {
            id
        }
    })
}

// 兑换记录发货
export function shippedExchange(data) {
    return request({
        url: '/integralExchangeRecord/addOrUpdateOprate',
        method: 'post',
        data,
    })
}
