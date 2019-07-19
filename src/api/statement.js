import request from '@/utils/request'

// 获取销售报表列表
export function getSalesDoctorList(data) {
    return request({
        url: '/tReportManagement/getSalesDoctorList',
        method: 'post',
        data,
    })
}

// 获取销售医生详情列表
export function getSalesDoctorDetail(doctorId) {
    return request({
        url: '/tReportManagement/getSalesDoctorDetail',
        method: 'post',
        data: {
            doctorId
        },
    })
}

// 获取销售医生详情数据列表
export function getSalesDoctorDetailList(data) {
    return request({
        url: '/tReportManagement/getDoctorSalesDetailsList',
        method: 'post',
        data,
    })
}

// 导出医生销售详情数据
export function exportDoctorSalesDetailList(doctorId, ids) {
    return request({
        url: '/tReportManagement/exportDoctorSalesDetailsList',
        method: 'post',
        data: {
            doctorId,
            ids,
        },
        responseType: 'blob'
    })
}

// 获取咨询医生列表
export function getConsultDoctorList(data) {
    return request({
        url: '/tReportManagement/getConsultationDoctorList',
        method: 'post',
        data,
    })
}

// 获取咨询医生详情列表
export function getConsultDoctorDetialList(data) {
    return request({
        url: '/tReportManagement/getDoctorConsultationDetailsList',
        method: 'post',
        data,
    })
}

// 导出医生咨询详情数据
export function exportDoctorConsultDetailList(doctorId, ids) {
    return request({
        url: '/tReportManagement/exportDoctorConsultationDetailsList',
        method: 'post',
        data: {
            doctorId,
            ids,
        },
        responseType: 'blob'
    })
}

// 获取商品销售报表
export function getCommoditySalesList(data) {
    return request({
        url: '/tReportManagement/getGoodsSalesList',
        method: 'post',
        data,
    })
}

// 导出商品销售记录
export function exportCommoditySalesList(ids) {
    return request({
        url: '/tReportManagement/exportGoodsSalesList',
        method: 'post',
        data: {
            ids,
        },
        responseType: 'blob'
    })
}
