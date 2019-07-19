import request from '@/utils/request'

// 获取商品分类列表
export function getClassifyList(data) {
    return request({
        url: '/commodityParameter/getTCommodityClassList.int.do',
        method: 'post',
        data,
    })
}

// 保存商品分类
export function saveClassify(data) {
    return request({
        url: '/commodityParameter/tcommodityClasssOPerate.int.do',
        method: 'post',
        data,
    })
}

// 获取商品分类详情
export function getClassifyDetail(id) {
    return request({
        url: '/commodityParameter/getTCommodityClassDetail.int.do',
        method: 'post',
        data: {
            id
        },
    })
}

// 删除商品分类
export function deleteClassify(ids) {
    return request({
        url: '/commodityParameter/tCommodityClassDelete.int.do',
        method: 'post',
        data: {
            ids
        },
    })
}

// 是否启用商品分类
export function enableClassify(id, commodityStatus) {
    return request({
        url: '/commodityParameter/tCommodityClassUse.int.do',
        method: 'post',
        data: {
            id,
            commodityStatus
        }
    })
}

// 获取商品品牌列表
export function getBrandList(data) {
    return request({
        url: '/commodityParameter/getTCommodityBrandList.int.do',
        method: 'post',
        data,
    })
}

// 保存商品品牌
export function saveBrand(data) {
    return request({
        url: '/commodityParameter/tCommodityBrandOPerate.int.do',
        method: 'post',
        data,
    })
}

// 获取商品品牌详情
export function getBrandDetail(id) {
    return request({
        url: '/commodityParameter/getTCommodityBrandDetail.int.do',
        method: 'post',
        data: {
            id
        },
    })
}

// 删除商品品牌
export function deleteBrand(ids) {
    return request({
        url: '/commodityParameter/tCommodityBrandDelete.int.do',
        method: 'post',
        data: {
            ids
        },
    })
}

// 获取商品供应商列表
export function getSupplierList(data) {
    return request({
        url: '/commodityParameter/getTCommoditySupplierList.int.do',
        method: 'post',
        data,
    })
}

// 保存商品供应商
export function saveSupplier(data) {
    return request({
        url: '/commodityParameter/tCommoditySupplierOPerate.int.do',
        method: 'post',
        data,
    })
}

// 获取商品供应商详情
export function getSupplierDetail(id) {
    return request({
        url: '/commodityParameter/getTCommoditySupplierDetail.int.do',
        method: 'post',
        data: {
            id
        },
    })
}

// 删除商品供应商
export function deleteSupplier(ids) {
    return request({
        url: '/commodityParameter/tCommoditySupplierDelete.int.do',
        method: 'post',
        data: {
            ids
        },
    })
}

// 获取商品运费规则列表
export function getRuleList(data) {
    return request({
        url: '/commodityParameter/getTFreightTemplateList.int.do',
        method: 'post',
        data,
    })
}

// 保存商品运费规则
export function saveRule(data) {
    return request({
        url: '/commodityParameter/tFreightTemplateOPerate.int.do',
        method: 'post',
        data,
    })
}

// 获取商品运费规则详情
export function getRuleDetail(id) {
    return request({
        url: '/commodityParameter/getTFreightTemplateDetail.int.do',
        method: 'post',
        data: {
            id
        },
    })
}

// 删除商品运费规则
export function deleteRule(ids) {
    return request({
        url: '/commodityParameter/tFreightTemplateDelete.int.do',
        method: 'post',
        data: {
            ids
        },
    })
}

// 获取商品规格模型列表
export function getSpecificationList(data) {
    return request({
        url: '/commodityParameter/getTSpecificationModelList.int.do',
        method: 'post',
        data,
    })
}

// 保存商品规格模型
export function saveSpecification(data) {
    return request({
        url: '/commodityParameter/tSpecificationModelOPerate.int.do',
        method: 'post',
        data,
    })
}

// 获取商品规格模型详情
export function getSpecificationDetail(id) {
    return request({
        url: '/commodityParameter/getTSpecificationModelDetail.int.do',
        method: 'post',
        data: {
            id
        },
    })
}

// 删除商品规格模型
export function deleteSpecification(id) {
    return request({
        url: '/commodityParameter/tSpecificationModelDelete.int.do',
        method: 'post',
        data: {
            id
        },
    })
}
