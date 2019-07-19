<template>
    <div class="audit-container">
        <el-form
            v-if="!isAudit"
            :inline="true"
            :model="listQuery"
            class="demo-form-inline border"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="账号ID">
                <el-input v-model.number="listQuery.id" maxlength="10" v-num-digit="listQuery.id" data-max-value="999999999"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="listQuery.userName"></el-input>
            </el-form-item>
            <el-form-item label="账号">
                <el-input v-model="listQuery.mobilenum"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-form
            v-if="isAudit"
            :inline="true"
            :model="listQuery"
            class="demo-form-inline border"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="账号ID">
                <el-input v-model="listQuery.id" maxlength="10" v-num-digit="listQuery.id" data-max-value="999999999"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="listQuery.userName"></el-input>
            </el-form-item>
            <el-form-item label="账号">
                <el-input v-model="listQuery.mobilenum"></el-input>
            </el-form-item>
            <el-form-item label="医院">
                <!-- <el-input v-model="listQuery.hospitalName"></el-input> -->
                <el-select v-model="listQuery.hospitalName" placeholder="请选择医院" @change="selectHospital" clearable>
                    <el-option
                        v-for="item in hospitalList"
                        :key="item.id"
                        :label="item.hospital"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="科室">
                <!-- <el-input v-model="listQuery.department"></el-input> -->
                <el-select v-model="listQuery.department" placeholder="请选择" @change="changeUpdate" clearable>
                    <el-option
                        v-for="item in departmentList"
                        :key="item.id"
                        :label="item.departmentName"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职称">
                <!-- <el-input v-model="listQuery.professionalTitle"></el-input> -->
                <el-select v-model="listQuery.professionalTitle" placeholder="请选择" @change="changeUpdate" clearable>
                    <el-option
                        v-for="item in professionalList"
                        :key="item.dicSubval"
                        :label="item.dicSubname"
                        :value="item.dicType + '-' + item.dicSubval"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-row type="flex" justify="end" :gutter="15">
            <el-col :span="24" class="align-right" v-if="!isAudit">
                <el-button type="primary" size="small" @click="handleBatch">批量审核</el-button>
            </el-col>
            <el-col :span="24" class="align-right" v-if="isAudit">
                <router-link to="/user/doctor/add">
                    <el-button type="primary" size="small">新增</el-button>
                </router-link>
                <el-button type="danger" class="ml10" size="small" @click="handleProhibit" :disabled="selectList.length <= 0">禁用</el-button>
            </el-col>
        </el-row>
        <el-table
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
                width="40"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="id"
                align="center"
                label="账号ID"
            >
            </el-table-column>
            <el-table-column
                prop="mobileNum"
                align="center"
                min-width="120"
                label="账号"
            >
            </el-table-column>
            <el-table-column
                prop="doctorName"
                align="center"
                label="姓名"
            >
            </el-table-column>
            <el-table-column
                prop="hospitalName"
                align="center"
                label="医院"
            >
            </el-table-column>
            <el-table-column
                prop="department"
                align="center"
                label="科室"
            >
            </el-table-column>
            <el-table-column
                prop="professionalTitle"
                align="center"
                label="职称"
            >
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="150"
            >
                <template slot-scope="scope" >
                    <div v-if="!isAudit">
                        <router-link :to="'/user/doctor/detail/' + scope.row.id">
                            <el-button type="text" >详情</el-button>
                        </router-link>
                        <span class="line"></span>
                        <el-button type="text" @click="handleSingle(scope.row)">审核</el-button>
                    </div>
                    <div v-if="isAudit">
                        <router-link :to="'/user/doctor/detail/' + scope.row.id">
                            <el-button type="text">详情</el-button>
                        </router-link>
                        <span class="line"></span>
                        <el-button type="text" class="red" v-show="scope.row.doctorLoginAllow == 1" @click="handleToggle(scope.row)">禁用</el-button>
                        <span><el-button type="text" class="red" v-show="scope.row.doctorLoginAllow == 0" @click="handleToggle(scope.row)">允许登录</el-button></span>
                    </div>
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

        <!-- 审核 -->
        <el-dialog 
            :title="textMap[dialogStatus]"
            :visible.sync="dialogFormVisible" 
            center
            width="60%" 
            :lock-scroll="false">
            <div class="dialogForm">
                <el-form size="small" :model="formData" ref="dataForm" class="demo-form" @submit.native.prevent align="center">
                    <el-form-item prop="elaborate">
                        <template>{{ formData.elaborate }}</template>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" :loading="submitLoading" @click="handleYes">审核通过</el-button>
                <el-button type="primary" size="small" :loading="submitLoading" @click="handleNo">审核不通过</el-button> 
            </div>  
        </el-dialog>

        <!-- 禁用/允许登录 -->
        <el-dialog 
            :title="textToggle[dialogStatus]"
            :visible.sync="toogleDialogFormVisible" 
            center
            width="30%" 
            :lock-scroll="false">
            <div class="dialogForm">
                <el-form size="small" :model="formToggle" ref="toggleForm" class="demo-form" @submit.native.prevent align="center">
                    <el-form-item prop="elaborate">
                        <template>{{ formToggle.elaborate }}</template>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" :loading="submitLoading" @click="handleConfirm">确定</el-button>
                <el-button size="small" :loading="submitLoading" @click="toogleDialogFormVisible = false">取消</el-button> 
            </div>  
        </el-dialog>
    </div>
</template>

<script>
import { getDoctorList, getDoctorDetail, getDoctorType, getDoctorLoginAllow, deleteDoctor, getDepartmentList, getProfessional } from '@/api/user'
import { findHospitals } from '@/api/mall'

const audit = {
    id: '',
    userName: '',
    mobilenum: '',
    doctorType: 0,
    listType: 0,
    pageNum: 0,
    pageSize: 50,
}

const audited ={
    id: '',
    userName: '',
    mobilenum: '',
    hospitalName: '',
    department: '',
    professionalTitle: '',
    doctorType: 1,
    listType: 1,
    pageNum: 0,
    pageSize: 50,
}
export default {
    props: {
        isAudit: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        return {
            listQuery: {},
            hospitalList: [],
            departmentList: [],
            professionalList: [],
            tableData: [],
            selectList: [],
            listLoading: true,
            submitLoading: false,
            total: 0,
            formData: {
                elaborate: '',
                id: 0,
            },
            formToggle: {
                elaborate: ''
            },
            dialogFormVisible: false,
            toogleDialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                single: '医生用户审核',
                batch: '医生用户批量审核',
            },
            textToggle: {
                prohibit: '禁用',
                login: '允许登录',
            },
            doctorsId: '',
            doctortype: '',
            doctorLoginAllow: '',
            doctorNoLogin: '',
        }
    },
    created() {
        if (this.isAudit) {
            this.listQuery = Object.assign(this.listQuery, audited)
            this.getHospitals()
            this.getProfessional()
        } else {
            this.listQuery = Object.assign(this.listQuery, audit)
        }
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getDoctorList(this.listQuery).then(res => {
                const data = res.data
                this.tableData = data.data.pageData
                this.total = data.data.totalCount
                this.listLoading = false
            })
        },
        getHospitals() {
            findHospitals().then(res => {
                const data = res.data
                this.hospitalList = data
            })
        },
        getProfessional(val) {
            getProfessional(val).then(res => {
                const data = res.data.data
                this.professionalList = data
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1;
            this.getList();
        },
        search() {
            this.listQuery.pageNum = 0;
            this.getList();
        },
        selectRow(val) {
            this.selectList = val;
            this.multipleSelection = val;
        },
        selectHospital() {
            let hospitalId = this.listQuery.hospitalName
            getDepartmentList(hospitalId).then(res => {
                const data = res.data.data.list
                this.departmentList = data
            })
            this.$forceUpdate()
        },
        changeUpdate() {
            this.$forceUpdate()
        },
        // 弹出框 
        // 审核
        handleSingle(row) {
            this.doctorsId = [row.id]
            this.doctortype = row.doctortype

            this.dialogStatus = 'single';
            this.dialogFormVisible = true;
            this.formData.elaborate = '请审核该用户的医生身份';
        },
        handleBatch() {
            this.doctorsId = []
            for (let item of this.selectList) {
                this.doctorsId.push(item.id)
            }
            // this.doctorsId = this.doctorsId.join(',')
            if(this.doctorsId.length != 0){
                this.dialogStatus = 'batch';
                this.dialogFormVisible = true;
                this.formData.elaborate = '请审核所选用户的医生身份';
            }else{
                this.$message({
                    message: '请先选择',
                    type: 'warning'
                })
            }
        },
        // 审核通过
        handleYes() {
            this.doctortype = 1
            let data = {
                doctorsId: this.doctorsId,
                doctorType: this.doctortype
            }
            this.handleDoctorType(data)
            this.dialogFormVisible = false
        },
        handleNo() {
            // let deleteId = this.doctorsId.join(',')
            // deleteDoctor(deleteId).then(res => {
            //     const data = res.data
            //     if(data.flag == 'success') {
            //         this.$message({
            //             message: data.msg,
            //             type: 'success',
            //         })
            //         this.getList()
            //     } else {
            //         this.$message({
            //             message: data.msg,
            //             type: 'error',
            //         })
            //     }
            // })
            this.doctortype = 2
            let data = {
                doctorsId: this.doctorsId,
                doctorType: this.doctortype
            }
            this.handleDoctorType(data)
            this.dialogFormVisible = false;
        },
        // 禁用
        handleProhibit() {
            if(this.selectList.length != 0){
                let doctorsId = []
                let doctorNoLogin = []
                for (let item of this.selectList) {
                    doctorsId.push(item.id)
                }
                for (let item of this.selectList) {
                    doctorNoLogin.push(item.doctorLoginAllow)
                }
                this.doctorsId = doctorsId
                this.doctorNoLogin = doctorNoLogin

                if (this.doctorNoLogin.includes(0)) {
                    this.$confirm('所选医生用户已包含禁止登录，请重新选择', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {

                    }).catch(() => {

                    })
                }else{
                    this.dialogStatus = 'prohibit';
                    this.toogleDialogFormVisible = true;
                    this.formToggle.elaborate = '确定禁止所选医生用户登录？';
                }

                if (this.doctorNoLogin.includes(0) && this.doctorsId.length == 1) {
                    this.$confirm('所选医生用户已禁止登录，请重新选择', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {

                    }).catch(() => {

                    })
                }

            }else{
                this.$message({
                    message: '请先选择',
                    type: 'warning'
                })
            }
        },
        handleDoctorType(rquestData) {
            getDoctorType(rquestData).then(res=> {
                const data = res.data;
                this.getList();
            })
        },

        handleToggle(row) {
            this.toogleDialogFormVisible = true;
            if(row.doctorLoginAllow == 1){
                this.dialogStatus = 'prohibit';
                this.formToggle.elaborate = '确定禁止该医生用户登录？';
            }else{
                this.dialogStatus = 'login';
                this.formToggle.elaborate = '确定允许该医生用户登录？';
            }
            this.doctorsId = [row.id]
            this.doctorLoginAllow = row.doctorLoginAllow == 1 ? 1 : 0
        },
        // 确认禁用
        handleConfirm() {
            if(this.formToggle.elaborate == '确定禁止所选医生用户登录？'){
                this.doctorLoginAllow = 0
                let data = {
                    doctorsId: this.doctorsId,
                    doctorLoginAllow: this.doctorLoginAllow
                }
                this.handleDoctorLoginAllow(data)
            }else{
                if(this.doctorLoginAllow == 1){
                    this.doctorLoginAllow = 0
                    let data = {
                        doctorsId: this.doctorsId,
                        doctorLoginAllow: this.doctorLoginAllow
                    }
                    this.handleDoctorLoginAllow(data)
                }else{
                    this.doctorLoginAllow = 1
                    let data = {
                        doctorsId: this.doctorsId,
                        doctorLoginAllow: this.doctorLoginAllow
                    }
                    this.handleDoctorLoginAllow(data)
                } 
            }
            this.toogleDialogFormVisible = false
        },
        handleDoctorLoginAllow(rquestData) {
            getDoctorLoginAllow(rquestData).then(res=> {
                const data = res.data;
                this.getList();
            })
        },
    }
}
</script>