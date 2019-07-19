import request from '@/utils/request'

// 获取商品管理列表
export function getGoodsList(data) {
    return request({
        url: '/goodsManage/getTGoodsList.int.do',
        method: 'post',
        data,
    })
}

// 获取商品管理详情
export function getGoodsBaseDetail(id) {
    return request({
        url: '/goodsManage/getTGoodsDetail.int.do',
        method: 'post',
        data: {
            id
        },
    })
}

// 删除商品
export function deleteGoods(ids) {
    return request({
        url: '/goodsManage/tGoodsDelete.int.do',
        method: 'post',
        data: {
            ids
        },
    })
}

// 是否启用商品严选或积分商城（integralMall是积分商城，stricSelect是商品严选）
// export function enableIntegralMall({
//     id,
//     integralMall,
//     stricSelect
// }) {
//     return request({
//         url: '/goodsManage/tGoodsStrictAndIntegral.int.do',
//         method: 'post',
//         data: {
//             id,
//             integralMall,
//             stricSelect,
//         }
//     })
// }
export function enableIntegralMall({
    goodsId,
    putAwayStatus
}) {
    return request({
        url: '/goodsManage/integralMall.putAwayIntegralGoods',
        method: 'post',
        data: {
            goodsId,
            putAwayStatus
        }
    })
}
// upperSelf

// 是否启用商品上架
export function requesPutawaytMall(data) {
    return request({
        url: '/goodsManage/tgoodsUpperSelf',
        method: 'post',
         data
    })
}

// 保存商品基本信息
export function saveBasis(data,) {
    return request({
        url: '/goodsManage/tGoodsOPerate.int.do',
        method: 'post',
        data,
    })
}

// 获取商品规格
export function getGoodsSpecDetail(goodsId) {
    return request({
        url: '/goodsManage/getTGoodsSpeLoadDetail.int.do',
        method: 'post',
        data: {
            goodsId,
        }
    })
}

// 保存商品规格
export function saveGoodsSpec(data) {
    return request({
        url: '/goodsManage/tGoodsSpeLoadOPerate.int.do',
        method: 'post',
        data,
    })
}

// 保存单张商品图片
export function saveOneGoodsImage(data) {
    return request({
        url: '/imageRelationOperate/saveOneGoodsImage',
        method: 'post',
        data,
    })
}

// 获取商品图片
export function getGoodsImageList(goodsId) {
    return request({
        url: '/goodsManage/getTGoodsImagesRelList.int.do',
        method: 'post',
        data: {
            goodsId,
        }
    })
}

// 保存商品图片
export function saveGoodsImageList(goodsId, images, imgDelIds) {
    return request({
        url: '/goodsManage/tGoodsImagesRelsOPerate.int.do',
        method: 'post',
        data: {
            goodsId,
            images,
            imgDelIds,
        }
    })
}

// 获取商品积分折扣
export function getGoodsIntegralDetail(goodsId) {
    return request({
        url: '/goodsManage/getTGoodsIntegralRelDetail.int.do',
        method: 'post',
        data: {
            goodsId,
        }
    })
}
// 获取FSPM营养素信息
export function getGoodsNutrientInformation(goodsId) {
    return request({
        url: '/goodsManage/getTGoodsFsmpRelDetail',
        method: 'post',
        data: {
            goodsId,
        }
    })
}

// 保存商品积分折扣
export function saveGoodsIntegral(data) {
    return request({
        url: '/goodsManage/tGoodsIntegralRelOPerate.int.do',
        method: 'post',
        data,
    })
}

// 保存FSMP营养素信息
export function saveNutrientInfo(data) {
    return request({
        url: '/goodsManage/saveTGoodsFsmp',
        method: 'post',
        data,
    })
}


// 优惠券
// 根据状态或搜索框筛选优惠券
export function getCouponList(data) {
    return request({
        url: '/coupon/findAllByParameter',
        method: 'post',
        data,
    })
}

// 优惠券详情
export function getCouponDetail(id) {
    return request({
        url: '/coupon/getCouponDetails',
        method: 'post',
        data: { id },
    })
}

// 优惠券详情基本信息
export function saveCoupon(data) {
    return request({
        url: '/coupon/saveCoupon',
        method: 'post',
        data,
    })
}

// 优惠券 可使用商品类别
export function getAllTCommodity(data) {
    return request({
        url: '/commodityParameter/getAllTCommodityClass',
        method: 'post',
        data,
    })
}
// 优惠券 医院列表选择
export function findHospitals(data) {
    return request({
        url: '/paramOperate/findHospitalsByParameter',
        method: 'post',
        data,
    })
}

// 领取优惠券
export function getReceivedCoupon(data) {
    return request({
        url: '/coupon/receivedCoupon',
        method: 'post',
        data,
    })
}

// 手动发布或停止或删除优惠券
export function deleteCoupon(id, couponStatus) {
    return request({
        url: '/coupon/updateCouponStatus',
        method: 'post',
        data: { id, couponStatus },
    })
}

// 优惠券详情,筛查用户领取列表
export function getRecievedCoupon(data) {
    return request({
        url: '/coupon/queryRecievedCouponUsers',
        method: 'post',
        data,
    })
}

// 根据条件筛选商品库存等详情
export function findGoodsDetail(data) {
    return request({
        url: '/coupon/findGoodsDetailByparameter',
        method: 'post',
        data,
    })
}

// 商品评论
export function getCommentList(query) {
    return request({
        url: '/goodsComment/getAll',
        method: 'post',
        data: query,
    })
}

// 商品评论批量删除
export function deleteBatch(idList) {
    return request({
        url: '/goodsComment/batchDelete',
        method: 'post',
        data: { idList },
    })
}

// 商品评论单条删除
export function deleteById(commentId) {
    return request({
        url: '/goodsComment/deleteById',
        method: 'get',
        params: { commentId },
    })
}

// 商品评论详情
export function getCommentDetail(commentId) {
    return request({
        url: '/goodsComment/getById',
        method: 'get',
        params: { commentId },
    })
}

// 商品评论展示状态
export function updateComment(data) {
    return request({
        url: '/goodsComment/updateStatus',
        method: 'post',
        data,
    })
}

// 新增商品评论
export function addComment(data) {
    return request({
        url: '/goodsComment/addComment',
        method: 'post',
        data,
    })
}

// 订单管理
// 列表
export function getGoodsOrderList(data) {
    return request({
        url: '/tPatientOrder/getPatientOrderList',
        method: 'post',
        data,
    })
}

// 统计商品订单分类总数
export function getGoodsCategyCount() {
    return request({
        url: '/tPatientOrder/getOrderListCountByCategy',
        method: 'post',
    })
}
//更改售后状态
export function changeAfterSale(data) {
    return request({
        url: '/tappPatientOrders/orderServiceOne',
        method: 'post',
        data,
    })
}

// 获取商品供应商列表
export function getComoditySupplierList() {
    return request({
        url: '/commodityParameter/tCommoditySupplierList.int.do',
        method: 'post',
    })
}
// 列表详情
export function getGoodsOrderDetail(id) {
    return request({
        url: '/tPatientOrder/getGoodsOrderDetailOnSystem',
        method: 'post',
        data: { id },
    })
}

// 商品发货
export function getGoodsOrderDeliver(data) {
    return request({
        url: '/tPatientOrder/goodsOrderDeliver',
        method: 'post',
        data,
    })
}

// 查询物流更新信息
export function getLogisticsList(id) {
    return request({
        url: '/tappPatientOrders/getTPatLogisticsListOnSys',
        method: 'post',
        data: { id },
    })
}

// 导出订单
export function exportOrders(idList) {
    return request({
        url: '/tPatientOrder/exportOrders',
        method: 'post',
        data: { idList },
        responseType: 'blob'
    })
}
// 导出待发货订单
export function exportDeliveryOrder(orderNos) {
    return request({
        url: '/tPatientOrder/exportDeliveryOrder',
        method: 'post',
        data: { orderNos },
        responseType: 'blob'
    })
}

// 导出其他状态订单
export function exportCollectionOrder(orderNos, flag) {
    return request({
        url: '/tPatientOrder/exportCollectionOrder',
        method: 'post',
        data: { orderNos, flag },
        responseType: 'blob'
    })
}

// 活动管理
// 列表
export function getActivityList(query) {
    return request({
        url: '/activity/getActivityList',
        method: 'post',
        data: query,
    })
}

// 删除
export function deleteActivity(id) {
    return request({
        url: '/activity/deleteActivityById',
        method: 'post',
        params: { id },
    })
}

// 修改活动状态
export function updateActivityStatus(ids) {
    return request({
        url: '/activity/updateActivityStatus',
        method: 'post',
        data: { ids },
    })
}

// 新增活动
export function saveActivity(data) {
    return request({
        url: '/activity/addActivity',
        method: 'post',
        data,
    })
}

// 新增活动
export function getGoodsListForActivity(data) {
    return request({
        url: '/activity/getGoodsListForActivity',
        method: 'post',
        data,
    })
}

// 活动详情
export function getActivityDetail(id) {
    return request({
        url: '/activity/getActivityById',
        method: 'get',
        params: { id },
    })
}



