<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">患者用户</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            class="demo-form-inline border"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="账号ID">
                <el-input v-model="listQuery.patId" maxlength="10" v-num-digit="listQuery.patId" data-max-value="2147483647"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="listQuery.patientName"></el-input>
            </el-form-item>
            <el-form-item label="账号">
                <el-input v-model="listQuery.mobilenum"></el-input>
            </el-form-item>
            <el-form-item label="绑定医院">
                <el-input v-model="listQuery.boundHospital"></el-input>
            </el-form-item>
            <el-form-item label="注册时间">
                <el-date-picker
                    type="date"
                    placeholder="起始时间"
                    v-model="listQuery.registerStartTime"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerStartTime"
                ></el-date-picker>
                <template><span>-</span></template>
                <el-date-picker
                    type="date"
                    placeholder="结束时间"
                    v-model="listQuery.registerEndTime"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerEndTime"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">查询</el-button>
            </el-form-item>
        </el-form>
        <el-row type="flex" justify="end" :gutter="15">
			<el-col :span="24" class="align-right">
				<el-button type="danger" size="small" @click="handleProhibit" :disabled="selectList.length <= 0">禁用</el-button>
			</el-col>
		</el-row>
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
                width="40"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="id"
                label="账号ID"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="mobilenum"
                label="账号"
                min-width="120"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="hospital"
                label="绑定医院"
                align="center"
            >
            </el-table-column>
            <el-table-column
	            label="操作"
	            align="center"
                width="150"
	        >
	            <template slot-scope="scope">
	            	<router-link :to="'/user/patient/detail/' + scope.row.id ">
                        <el-button type="text">详情</el-button>
                    </router-link>
	            	<span class="line"></span>
                    <el-button type="text" class="red" v-show="scope.row.patientStatus == 1" @click="handleToggle(scope.row)">禁用</el-button>
                        <span><el-button type="text" class="red" v-show="scope.row.patientStatus == 0" @click="handleToggle(scope.row)">允许登录</el-button></span>
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

        <!-- 禁用/允许登录 -->
        <el-dialog 
            :title="textToggle[dialogStatus]"
            :visible.sync="toogleDialogFormVisible" 
            center
            :lock-scroll="false">
            <div class="dialogForm">
                <el-form size="small" :model="formToggle" ref="toggleForm" class="demo-form" @submit.native.prevent align="center">
                    <el-form-item prop="elaborate">
                        <template>{{ formToggle.elaborate }}</template>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" :loading="submitLoading" v-show="showSingle" @click="singleConfirm">确定</el-button>
                <el-button type="primary" size="small" :loading="submitLoading" v-show="showBatch" @click="batchConfirm">确定</el-button>
                <el-button size="small" :loading="submitLoading" @click="toogleDialogFormVisible = false">取消</el-button> 
            </div>  
        </el-dialog>
    </div>
</template>

<script>
import { getPatientList, getPatientStatus } from '@/api/user'

export default {
    data() {
        return {
            pickerStartTime: {          
                disabledDate: (time) => {
                    if (this.listQuery.registerEndTime) {
                        let date = new Date(this.listQuery.registerEndTime.replace(/-/g, '/'))
                        return time.getTime() > date || time.getTime() > Date.now()
                    } else {
                        return time.getTime() > Date.now()
                    }
                }
            },
            pickerEndTime: {
                disabledDate: (time) => {
                    let date = null
                    if (this.listQuery.registerStartTime) {
                        date = this.listQuery.registerStartTime.replace(/-/g, '/')
                        date = new Date(date)
                    }
                    return time.getTime() < date || time.getTime() > Date.now()
                }
            },
            listQuery: {
                patId: '',
                patientName: '',
                mobilenum: '',
                boundHospital: '',
                registerStartTime: '',
                registerEndTime: '',
                pageNum: 0,
                pageSize: 50
            },
            tableData: [],
            selectList: [],
            listLoading: true,
            submitLoading: false,
            total: 0,
            formToggle: {
                elaborate: ''
            },
            toogleDialogFormVisible: false,
            dialogStatus: '',
            textToggle: {
                prohibit: '禁用',
                login: '允许登录',
            },
            showSingle: false,
            showBatch: false,
            patientId: '',
            patientStatus: '',
            patientNoLogin: '',
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true;
            getPatientList(this.listQuery).then(res => {
                const data = res.data
                this.tableData = data.data.pageData
                this.total = data.data.totalCount
                this.listLoading = false
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getList()
        },
        search() {
            this.listQuery.pageNum = 0
            this.getList()
        },
        selectRow(value) {
            this.selectList = value
        },
        // 禁用
        handleToggle(row) {
            this.toogleDialogFormVisible = true
            this.showSingle = true
            this.showBatch = false
            this.patientId = [row.id]
            this.patientStatus = row.patientStatus == 1 ? 1 : 0

            if( this.patientStatus == 1){
                this.dialogStatus = 'prohibit'
                this.formToggle.elaborate = '确定禁止该患者用户登录？'
            }else{
                this.dialogStatus = 'login'
                this.formToggle.elaborate = '确定允许该患者用户登录？'
            }
        },
        handleProhibit() {
            this.patientId = []
            this.patientNoLogin = []
            for (let item of this.selectList) {
                this.patientId.push(item.id)
            }
            for (let item of this.selectList) {
                this.patientNoLogin.push(item.patientStatus)
            }
            if(this.patientId.length != 0){
                if (this.patientNoLogin.includes(0)) {
                    this.$confirm('所选患者用户已包含禁止登录，请重新选择', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                        center: true
                    }).then(() => {

                    }).catch(() => {

                    });
                }else{
                    this.dialogStatus = 'prohibit'
                    this.toogleDialogFormVisible = true
                    this.showSingle = false
                    this.showBatch = true
                    this.formToggle.elaborate = '确定禁止所选患者用户登录？'
                }

                if (this.patientNoLogin.includes(0) && this.patientId.length == 1) {
                    this.$confirm('所选患者用户已禁止登录，请重新选择', '提示', {
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
        // 单条确认
        singleConfirm() {
            if(this.patientStatus == 1){
                this.patientStatus = 0
                let data = {
                    patientId: this.patientId,
                    patientStatus: this.patientStatus
                }
                this.handleStatus(data)
            }else{
                this.patientStatus = 1
                let data = {
                    patientId: this.patientId,
                    patientStatus: this.patientStatus
                }
                this.handleStatus(data)
            }
            this.toogleDialogFormVisible = false
        },
        // 批量确认
        batchConfirm() {
            this.patientStatus = 0
            let data = {
                patientId: this.patientId,
                patientStatus: this.patientStatus
            }
            this.handleStatus(data)
            this.toogleDialogFormVisible = false
        },
        handleStatus(rquestData){
            getPatientStatus(rquestData).then(res=> {
                const data = res.data
                this.getList()
            })
        },
    }
}
</script>

