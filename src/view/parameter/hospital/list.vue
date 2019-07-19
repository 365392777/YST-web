<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
            >医院管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            size="small"
            class="demo-form-inline border"
            @submit.native.prevent
        >
            <el-form-item>
                <el-input
                    v-model="listQuery.name"
                    placeholder="输入关键字"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button 
                    type="primary" 
                    @click="search"
                    icon="el-icon-search"
                    native-type="submit"
                >搜索</el-button>
            </el-form-item>
            <div class="fr">
                <el-form-item>
                    <el-button type="primary" @click="handleCreate">新增医院</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="deleteSelect" :disabled="selectList.length <= 0">删除</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="tableData"
            max-height="600"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="listLoading"
            @selection-change="selectRow"
        >
            <el-table-column
	            type="selection"
	            width="45" 
	            align="center">
	        </el-table-column>
            <el-table-column
                prop="id"
                label="医院ID"
                width="150"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="hospital"
                label="医院名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="address"
                label="医院所在城市"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="level"
                label="医院级别"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="启用"
                align="center"
            >
                <template slot-scope="scope">
                    <el-checkbox 
                        :true-label="'0'"
                        :false-label="'1'"
                        v-model="scope.row.status"
                        @change="enable(scope.row)"
                    ></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="scope">
	            	<el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
	            	<span class="line"></span>
	            	<el-button type="text" class="red" @click="deleteRow(scope.row)">删除</el-button>	
	            </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-show="total > 0"
            :page-size="listQuery.pageSize"
            :pager-count="7"
            layout="prev, pager, next"
            :total="total"
            :current-page="listQuery.pageNum + 1"
            @current-change="changePage"
        >
        </el-pagination>
        <el-dialog
            :title="textMap[dialogStatus]"
            :visible.sync="dialogFormVisible"
            center
            width="700px"
        >
            <div class="dialog-container">
                <el-form ref="dataForm" 
                    size="small"
                    :rules="rules"
                    :model="formData"
                    label-position="right"
                    label-width="120px"
                    @submit.native.prevent
                >
                    <el-form-item label="医院名称" prop="hospital">
                        <el-input v-model.trim="formData.hospital"></el-input>
                    </el-form-item>
                    <el-form-item label="所在城市" required>
                        <el-row class="item-city">
                            <div class="fl item-width">
                                <el-form-item prop="province" class="no-margin-bottom">
                                    <el-select v-model="formData.province" placeholder="请选择省份" @change="selectProvince">
                                        <el-option 
                                            v-for="item in provinceList"
                                            :key="item.areaCode"
                                            :label="item.areaName"
                                            :value="item.areaCode"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="fl item-width ml25">
                                <el-form-item prop="city" class="no-margin-bottom">
                                    <el-select v-model="formData.city" placeholder="请选择市" @change="selectCity">
                                        <el-option
                                            v-for="item in cityList"
                                            :key="item.areaName"
                                            :label="item.areaName"
                                            :value="item.areaCode"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="fl item-width ml25">
                                <el-form-item prop="district" class="no-margin-bottom">
                                    <el-select v-model="formData.district" placeholder="请选择区/县">
                                        <el-option
                                            v-for="item in districtList"
                                            :key="item.areaName"
                                            :label="item.areaName"
                                            :value="item.areaCode"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="医院等级" prop="levelId">
                        <el-select v-model="formData.levelId" class="item-width">
                            <el-option
                                v-for="item in levelList"
                                :key="item.dicSubval"
                                :label="item.dicSubname"
                                :value="item.dicSubval"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="科室"
                        prop="departmentList"
                        :error="departmentListError"
                    >
                        <div class="department-flex">
                            <div
                                class="department-item"
                                v-for="(item, index) in formData.departmentList"
                                :key="index"
                            >
                                <el-button class="text-btn">{{ item.value }}</el-button>
                                <el-button
                                    type="text"
                                    icon="el-icon-circle-close-outline"
                                    class="delete-department"
                                    @click="deleteDepartment(index)"
                                ></el-button>
                            </div>
                        </div>
                        <div>
                            <el-input
                                class="department-input"
                                v-model.trim="department"
                                placeholder="输入科室后，点击回车提交"
                                @keyup.enter.native="addDepartment"
                            ></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="启用">
                        <el-checkbox
                            v-model="formData.hpStatus"
                            :true-label="'0'"
                            :false-label="'1'"
                        ></el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                <el-button :loading="submitLoading" size="small" type="primary" @click="handleSave">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getHospitalList,
    saveHospital,
    getHospitalDetail,
    deleteHospital,
    enableHospital
} from '@/api/parameter'
import { getProvince, getArea, getDicList } from '@/api/util'

export default {
    data() {
        const validDepartment = (rule, value, callback) => {
            if (value.length == 0) {
                callback(new Error('请输入科室'))
            } else {
                callback()
            }
        }
        return {
            listQuery: {
                name: '',
                pageNum: 0,
                pageSize: 50,
            },
            total: 0,
            tableData: [],
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑医院信息',
                create: '新增医院信息',
            },
            formData: {
                hospitalId: 0,
                hospital: '',
                province: '',
                city: '',
                district: '',
                levelId: '',
                hpStatus: '0',
                departmentList: [],
                departmentNameList: [],
                departmentDeleteIdList: [],
            },
            provinceList: [],
            districtList: [],
            cityList: [],
            levelList: [],
            selectList: [],
            rules: {
                hospital: [{required: true, message: '医院名称不能为空', trigger: 'change'}],
                province: [{required: true, message: '省份不能为空', trigger: 'change'}],
                city: [{required: true, message: '市不能为空', trigger: 'change'}],
                district: [{required: true, message: '区或县不能为空', trigger: 'change'}],
                levelId: [{required: true, message: '医院等级不能为空', trigger: 'change'}],
                departmentList: [{ required: true, validator: validDepartment, trigger: 'blur' }],
            },
            listLoading: true,
            submitLoading: false,
            department: '',
            departmentListError: '',
        }
    },
    created() {
        this.getList()
        this.getProvinceList()
        this.getLevelList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getHospitalList(this.listQuery).then(res => {
                const data = res.data
                this.tableData = data.data.pageData
                this.total = data.data.totalCount
                this.listLoading = false
            })
        },
        getProvinceList() {
            getProvince().then(res => {
                this.provinceList = res.data
            })
        },
        getLevelList() {
            getDicList('D001').then(res => {
                this.levelList = res.data
            })
        },
        resetFormData() {
            this.formData = {
                hospitalId: 0,
                hospital: '',
                province: '',
                city: '',
                district: '',
                levelId: '',
                hpStatus: '0',
                departmentList: [],
                departmentNameList: [],
                departmentDeleteIdList: [],
            }
            this.department = ''
        },
        search() {
            this.listQuery.pageNum = 0
            this.getList()
        },
        enable(row) {
            let ids = [row.id]
            enableHospital(ids, row.status).then(res => {
                const data = res.data
                if (data.flag == 'success') {
                    this.$message.success('操作成功')
                } else {
                    this.$message.error('操作失败')
                    this.getList()
                }
            })
        },
        handleCreate() {
            this.resetFormData()
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleUpdate(row) {
            this.getDetail(row.id)
            this.department = ''
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        getDetail(id) {
            getHospitalDetail(id).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    let data = resData.data.hospitalDetail
                    this.formData = {
                        hospitalId: id,
                        dataRemoveType: 0,
                        hospital: data.hospital,
                        province: data.province,
                        city: data.city,
                        district: data.district,
                        levelId: data.levelId,
                        hpStatus: data.hpStatus,
                        departmentList: [],
                        departmentNameList: [],
                        departmentDeleteIdList: [],
                    }
                    getArea(this.formData.province).then(res => {
                        this.cityList = res.data
                    })
                    getArea(this.formData.city).then(res => {
                        this.districtList = res.data
                    })
                    
                    let departmentList = resData.data.departmentList
                    for (let item of departmentList) {
                        let departmentItem = {
                            id: item.id,
                            value: item.departmentName
                        }
                        this.formData.departmentList.push(departmentItem)
                    }
                } else {
                    this.$message.error(resData.error)
                }
            })
        },
        selectProvince(val) {
            this.formData.city = ''
            this.formData.district = ''
            getArea(val).then(res => {
                this.cityList = res.data
            })
        },
        selectCity(val) {
            getArea(val).then(res => {
                this.districtList = res.data
            })
        },
        addDepartment() {
            if (this.department == '') {
                return
            }
            let isValid = true
            for(let item of this.formData.departmentList) {
                if (item.value == this.department.trim()) {
                    isValid = false
                    break
                }
            }
            this.departmentListError = ''
            if (!isValid) {
                this.departmentListError = '已存在该科室'
                return
            }
            let departmentItem = {
                key: Date.now(),
                value: this.department,
            }
            this.formData.departmentList.push(departmentItem)
            this.department = ''
        },
        deleteDepartment(index) {
            let departmentList = this.formData.departmentList
            if (departmentList[index].id) {
                this.formData.departmentDeleteIdList.push(departmentList[index].id)
            }
            departmentList.splice(index, 1)
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    let departmentList = []
                    for (let item of this.formData.departmentList) {
                        departmentList.push(item.value)
                    }
                    this.formData.departmentNameList = departmentList

                    this.submitLoading = true
                    saveHospital(this.formData).then(res => {
                        const data = res.data
                        if (data.flag == 'success') {
                            this.dialogFormVisible = false
                            let isCreate = this.dialogStatus == 'create'
                            let message = isCreate ? '添加成功' : '修改成功'
                            if (isCreate) {
                                this.listQuery.pageNum = 0
                            }
                            this.getList()
                            this.$message({
                                message,
                                type: 'success'
                            })
                            this.submitLoading = false
                        } else {
                            this.submitLoading = false
                            this.$message({
                                message: data.msg,
                                type: 'error'
                            })
                        }
                    }).catch(err => {
                        this.submitLoading = false
                    })
                }
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getList()
        },
        selectRow(val) {
            this.selectList = val
        },
        deleteRow(row) {
            let data = []
            data.push(row.id)
            this.deleteConfirm(data)
        },
        deleteSelect() {
            let data = []
            for (let item of this.selectList) {
                data.push(item.id)
            }
            this.deleteConfirm(data)
        },
        deleteConfirm(data) {
            this.$confirm('此操作将删除信息, 确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                this.handleDelete(data)
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // })
            })
        },
        handleDelete(data) {
            deleteHospital(data).then(res => {
                const data = res.data
                if(data.flag == 'success') {
                    this.$message({
                        message: data.msg,
                        type: 'success',
                    })
                    this.getList()
                } else {
                    this.$message({
                        message: data.msg,
                        type: 'error',
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page-container {
    .item-city /deep/ {
        .el-form-item {
            margin-bottom: 0;
            margin-right: 0;
        }
    }
    .item-width {
        width: 160px;
    }
    .ml25 {
        margin-left: 25px;
    }
    .department-flex {
        display: flex;
        flex-wrap: wrap;
        .department-item {
            display: inline-block;
            margin-bottom: 10px;
            position: relative;
            &:not(:first-child) {
                margin-left: 20px;
            }
            .delete-department {
                font-size: 20px;
                position: absolute;
                right: -9px;
                top: -9px;
                font-size: 20px;
                padding: 0;
                color: #f56c6c;
                &:hover {
                    color: #f78989;
                }
                &:active {
                    color: #dd6161;
                }
            }
        }
        .text-btn {
            &:active,
            &:hover,
            &:focus {
                color: #606266;
                outline: 0;
                background: #fff;
                border: 1px solid #dcdfe6;
            }
        }
    }
    /deep/ {
        .el-form-item.is-success {
                .el-input__inner {
                border-color: #dcdfe6;
            }
        }
    }
}
</style>
