import request from '@/utils/request'
// 用户管理
// 查看用户详情数据
export function getUserDetail(id) {
    return request({
        url: '/sysOperate/getSysUserDetail.int.do',
        method: 'post',
        data: { id },
    })
}

// 用户数据列表查询
export function getUserList(query) {
    return request({
        url: '/sysOperate/getSysUserList.int.do',
        method: 'post',
        data: query,
    })
}

// 获取商品供应商列表
export function getComoditySupplierList() {
    return request({
        url: '/commodityParameter/tCommoditySupplierList.int.do',
        method: 'post',
    })
}
// 增或改用户
export function saveUser(data) {
    return request({
        url: '/sysOperate/sysUserOperate.int.do',
        method: 'post',
        data,
    })
}

// 删除用户
export function deleteUser(ids) {
    return request({
        url: '/sysOperate/tSysUserDelete.int.do',
        method: 'post',
        data: { ids },
    })
}

// 禁用或解禁用户
export function modifyUserProhibit(data) {
    return request({
        url: '/sysOperate/tSysUserProhibit.int.do',
        method: 'post',
        data,
    })
}

// 获取所有角色信息
export function getAllRole() {
    return request({
        url: '/sysOperate/getAllRoleData',
        method: 'post',
    })
}

// 角色管理
// 查看用户角色详情数据
export function getRoleDetail(id) {
    return request({
        url: '/sysOperate/getSysRoleDetail.int.do',
        method: 'post',
        data: { id }
    })
}

// 查看用户角色数据列表
export function getRoleList(query) {
    return request({
        url: '/sysOperate/getSysRoleList.int.do',
        method: 'post',
        data: query
    })
}

// 增或改用户角色数据
export function saveRole(data) {
    return request({
        url: '/sysOperate/sysRoleOperate.int.do',
        method: 'post',
        data,
    })
}

// 删除用户角色
export function deleteRole(id) {
    return request({
        url: '/sysOperate/tSysRoleDelete.int.do',
        method: 'post',
        data: { id }
    })
}

// 获取所有菜单
export function getAllMenu() {
    return request({
        url: '/sysOperate/buildAllMenuTree.int.do',
        method: 'post',
    })
}

// 常见问题
// 查看常见问题信息详情
export function getCommonProblemDetail(id) {
    return request({
        url: '/sysOperate/getSysCommonProblemDetail.int.do',
        method: 'post',
        data: { id },
    })
}

// 常见问题信息列表查询
export function getCommonProblemList(query) {
    return request({
        url: '/sysOperate/getSysCommonProblemList.int.do',
        method: 'post',
        data: query
    })
}

// 增或改常见问题信息操作
export function saveCommonProblem(data) {
    return request({
        url: '/sysOperate/sysCommonProblemOperate.int.do',
        method: 'post',
        data,
    })
}

// 删除常见问题操作
export function deleteCommonProblem(ids) {
    return request({
        url: '/sysOperate/tSysCommonProblemDelete.int.do',
        method: 'post',
        data: { ids }
    })
}

// 操作日志
// 操作日志列表查询
export function getDealLogList(query) {
    return request({
        url: '/sysOperate/getSysDealLogList.int.do',
        method: 'post',
        data: query
    })
}

// 查看日志详情
export function getDealLogDetail(id) {
    return request({
        url: '/sysOperate/getTSysDealLogDetail.int.do',
        method: 'post',
        data: { id },
    })
}

// 查看声明信息（服务协议与隐私、声明）详情
export function getStatemnetDetail(statementPort, statementType) {
    return request({
        url: '/sysOperate/getSysStatemnetDetail.int.do',
        method: 'post',
        data: { statementPort, statementType },
    })
}

// 增或改声明信息（服务协议与隐私、声明）操作
export function saveStatemnet(data) {
    return request({
        url: '/sysOperate/sysStatementOperate.int.do',
        method: 'post',
        data,
    })
}

