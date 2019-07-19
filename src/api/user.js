import request from '@/utils/request'
// 医生
// 医生列表查询
export function getDoctorList(query) {
    return request({
        url: '/app/dot/doctors/search',
        method: 'post',
        data: query,
    })
}

// 审核
export function getDoctorType(data) {
    return request({
        url: '/app/dot/doctors/setDoctorType',
        method: 'post',
        data,
    })
}

// 禁用
export function getDoctorLoginAllow(data) {
    return request({
        url: '/app/dot/doctors/setDoctorLoginAllow',
        method: 'post',
        data,
    })
}

// 医生详情
export function getDoctorDetail(doctorsId) {
    return request({
        url: '/app/dot/doctors/searchOneById',
        method: 'get',
        params: { doctorsId },
    })
}

// 创建医生信息
export function saveDoctor(data) {
    return request({
        url: '/app/dot/doctors/create',
        method: 'post',
        data,
    })
}

// 获取所有的医生职称
export function getProfessional(data) {
    return request({
        url: '/app/dot/doctors/getAllprofessional',
        method: 'post',
        data,
    })
}

// 根据省市区编码获取医院
export function getHospitalList(data) {
    return request({
        url: '/app/dot/doctors/background.getHospitalList',
        method: 'post',
        data,
    })
}

// 删除医生
export function deleteDoctor(deleteId) {
    return request({
        url: '/app/dot/doctors/remove',
        method: 'post',
        data: { deleteId },
    })
}

// 更新医生
export function updateDoctor(data) {
    return request({
        url: '/app/dot/doctors/update',
        method: 'post',
        data,
    })
}

// 医生登录
export function loginDoctor(id) {
    return request({
        url: '/app/dot/doctors/login',
        method: 'post',
        data: { id },
    })
}

// 医生登出
export function loginoutDoctor(id) {
    return request({
        url: '/app/dot/doctors/loginout',
        method: 'post',
        data: { id },
    })
}

// 医生评价列表
export function getDoctorConsultation(query) {
    return request({
        url: '/app/dot/doctors/getConsultationByDoctorIdAndParams',
        method: 'post',
        data: query,
    })
}

// 医生评价详情
export function getValuateDetail(valuateId) {
    return request({
        url: '/app/dot/doctors/getValuateDetailById',
        method: 'post',
        params: { valuateId },
    })
}

// 获取指定医院下的所有科室
export function getDepartmentList(hospitalId) {
    return request({
        url: '/paramOperate/getDepartmentList',
        method: 'post',
        data: { hospitalId },
    })
}

// 患者列表
export function getPatientList(query) {
    return request({
        url: '/app/pat/patient/searchListByParams',
        method: 'post',
        data: query,
    })
}

// 患者详情
export function getPatientDetail(id) {
    return request({
        url: '/app/pat/patient/searchPatientById',
        method: 'post',
        data: { id },
    })
}

// 患者禁用
export function getPatientStatus(data) {
    return request({
        url: '/app/pat/patient/setPatientStatus',
        method: 'post',
        data,
    })
}