<template>
    <div class="role-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item :to="{ path: '/system/role/list' }">后台用户角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadcrumbMap[isEdit]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            ref="dataForm"
            :model="formData"
            size="small"
            label-width="110px"
            class="demo-ruleFor border"
            @submit.native.prevent
        >
            <div style="margin-bottom: 10px;font-size: 15px;">角色基本信息</div>
            <el-form-item
                label="添加时间："
                prop="createTime"
                v-if="isEdit"
            >
                <template>{{ dateTime(formData.createTime) }}</template>
            </el-form-item>
            <el-form-item
                label="添加人："
                prop="createUserName"
                v-if="isEdit"
            >
                <template>{{ formData.createUserName }}</template>
            </el-form-item>
            <el-form-item
                label="角色类型："
                :rules="[
			        { required: true, message: '角色类型不能为空'}
			    ]"
                prop="roleName"
            >
                <el-input v-model="formData.roleName"></el-input>
            </el-form-item>
        </el-form>
        <el-form
            ref="form"
            size="small"
            class="border formPower"
            @submit.native.prevent
        >
            <div style="margin-bottom: 10px;font-size: 15px;">默认权限设置</div>
            <el-form-item
                v-for="role in roleList"
                :key="role.menuId"
            >
                <el-checkbox
                    :label="role.menuId"
                    name="role"
                    :indeterminate="indeterminateList[role.menuId]"
                    v-model="moduleModel[role.menuId]"
                    @change="moduleSelect($event, role)"
                    class="bold-font"
                >{{role.menuName}}</el-checkbox>
                <el-checkbox-group
                    v-model="formData.menus"
                    @change="handleCheckedRole($event, role)"
                    class="child-checkbox-group"
                >
                    <div class="child-checkbox-item"
                        v-for="childRole in role.childMenus"
                        :key="childRole.menuId"
                    >
                        <el-checkbox
                            :label="childRole.menuId"
                        >{{childRole.menuName}}</el-checkbox>
                    </div>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <el-row class="clearfix">
            <el-col
                :sapn="24"
                align="center"
            >
                <el-button
                    size="small"
                    type="primary"
                    :loading="submitLoading"
                    @click="handleSave"
                >保存</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getRoleList, getRoleDetail, saveRole } from '@/api/system'
import { convertDate } from '@/utils'
import { getAllMenu } from '@/api/system'

export default {
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            breadcrumbMap: {
                false: '添加角色',
                true: '编辑角色'
            },
            formData: {
                roleName: '',
                menus: [],
                dataRemoveType: 0
            },
            listLoading: true,
            submitLoading: false,
            roleList: [],
            indeterminateList: {},
            moduleModel: {},
            homeMenuInfo: {}
        }
    },
    computed: {
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        }
    },
    created() {
        this.getMenuList()
        if (this.isEdit) {
            let id = this.$route.params && this.$route.params.id
            this.getDetail(id)
        }
    },
    methods: {
        getMenuList() {
            getAllMenu().then(res => {
                const resData = res.data
                this.roleList = resData.list
                for (let i = 0; i < this.roleList.length; i++) {
                    let item = this.roleList[i]
                    if (item.menuName == '首页') {
                        this.homeMenuInfo = {...item}
                        this.roleList.splice(i, 1)
                        break
                    }
                }
                
                this.indeterminateList = {}
                this.moduleModel = {}
                this.roleList.map(item => {
                    this.$set(this.moduleModel, item.menuId, false)
                    this.$set(this.indeterminateList, item.menuId, false)
                })

            })
        },
        getDetail(id) {
            getRoleDetail(id).then(res => {
                const data = res.data
                this.formData.id = data.roleId
                this.formData.roleName = data.roleName
                this.formData.menus = data.menuList
                this.formData.createTime = data.creatTime
                this.formData.createUserName = data.createUserName
                this.formData.menus = this.formData.menus.replace(/,$/, '')
                this.formData.menus = this.formData.menus.split(',')
                
                for (let item of this.roleList) {
                    this.handleCheckedRole(this.formData.menus, item)
                }
            })
        },
        moduleSelect(value, role) {
            let menus = this.formData.menus
            for (let item of role.childMenus) {
                let childIdIndex = menus.indexOf(item.menuId)
                if (value && childIdIndex == -1) {
                    menus.push(item.menuId)
                } else if (!value && childIdIndex > -1) {
                    menus.splice(childIdIndex, 1)
                }
            }

            let parentIdIndex = menus.indexOf(role.menuId)
            if (value && parentIdIndex == -1) {
                menus.push(role.menuId)
            } else if (!value && parentIdIndex > -1) {
                menus.splice(parentIdIndex, 1)
            }

            this.indeterminateList[role.menuId] = false
        },
        handleCheckedRole(value, parent) {
            let hasRole = false
            let hasNum = 0
            let menus = this.formData.menus

            for (let item of parent.childMenus) {
                if (menus.indexOf(item.menuId) > -1) {
                    hasNum ++
                    hasRole = true
                }
            }

            let parentRoleIndex = menus.indexOf(parent.menuId)
            if (hasRole && parentRoleIndex == -1) {
                menus.push(parent.menuId)
            } else if (!hasRole && parentRoleIndex > -1) {
                menus.splice(parentRoleIndex, 1)
            }

            this.moduleModel[parent.menuId] = hasNum === parent.childMenus.length
            this.indeterminateList[parent.menuId] = hasNum > 0 && hasNum < parent.childMenus.length
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    if (this.formData.menus.indexOf(this.homeMenuInfo.menuId) == -1) {
                        this.formData.menus.push(this.homeMenuInfo.menuId)
                    }
                    let formData = {
                        id: this.formData.id,
                        menus: this.formData.menus,
                        dataRemoveType: 0,
                        roleName: this.formData.roleName,
                    }
                    this.submitLoading = true
                    saveRole(formData).then(res => {
                        const data = res.data
                        if (data.code == '10001') {
                            let message = this.isEdit ? '修改成功' : '添加成功'
                            this.$router.replace({
                                path: '/system/role/list'
                            })
                            this.$message({
                                message,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: data.error,
                                type: 'error'
                            })
                        }
                        this.submitLoading = false
                    }).catch(() => {
                        this.$message({
                            message: '保存失败',
                            type: 'error'
                        })
                        this.submitLoading = false
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.formPower {
    .el-checkbox + .el-checkbox {
        margin-left: 0;
    }
    .el-checkbox {
        margin-right: 30px;
    }
    .el-checkbox:first-child .el-checkbox__label {
        font-weight: bold;
    }
}
.bold-font {
    font-weight: bold;
}
.child-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    margin-left: 20px;
    .child-checkbox-item {
        width: 200px;
    }
}
</style>
