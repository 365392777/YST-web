<template>
	<div>
		<el-tabs v-model="tab" class="tabChild">
		    <el-tab-pane label="医生端" name="doctor">
		    	<el-form :inline="true" :model="doctorList" size="small" class="demo-form-inline border flex" @submit.native.prevent>
				    <el-form-item label="问题名称：">
				        <el-input v-model="doctorList.problemName" placeholder="输入关键字"></el-input>
				    </el-form-item>
				    <el-form-item>
				    	<el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
				    </el-form-item>
				    <el-form-item class="flex-item">
				        <el-button type="primary" @click="handleCreate">新增</el-button>
				        <el-button type="danger" @click="deleteSelect" :disabled="selectList.length <= 0">删除</el-button>
				    </el-form-item>
				</el-form>
		        <el-table
			        ref="multipleTable"
			        :data="tableData"
			        max-height="500"
			        stripe
			        tooltip-effect="dark"
			        style="width: 100%"
			        v-loading="listLoading"
			        @selection-change="selectRow">
			        <el-table-column
			            type="selection"
			            width="45" 
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="id"
			            label="问题ID"
			            width="80" 
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="problemName"
			            label="问题名称"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            label="操作"
			            align="center"
			            width="100"
			            show-overflow-tooltip>
			            <template slot-scope="scope">
			            	<el-button type="text" size="small" @click="handleUpdate(scope.row)">修改</el-button>
			            	<span class="line"></span>
			            	<el-button type="text" size="small" @click="handleDelete(scope.row)" class="red">删除</el-button>
			            </template>
			        </el-table-column>
				</el-table>
				<el-pagination
				    v-show="total > 0"
            		:page-size="doctorList.pageSize"
				    :pager-count="7"
				    layout="prev, pager, next"
				    :total="total"
		            :current-page="doctorList.pageNum + 1"
		            @current-change="changePage">
				</el-pagination>
		    </el-tab-pane>
		    <el-tab-pane label="患者端" name="patient">
		    	<el-form :inline="true" :model="patientList" size="small" class="demo-form-inline border flex" @submit.native.prevent>
				    <el-form-item label="问题名称：">
				        <el-input v-model="patientList.problemName" placeholder="输入关键字"></el-input>
				    </el-form-item>
				    <el-form-item>
				    	<el-button type="primary" icon="el-icon-search" native-type="submit" @click="search2">搜索</el-button>
				    </el-form-item>
				    <el-form-item class="flex-item">
				        <el-button type="primary" @click="handleCreate2">新增</el-button>
				        <el-button type="danger" @click="deleteSelect2" :disabled="selectList2.length <= 0">删除</el-button>
				    </el-form-item>
				</el-form>
		        <el-table
			        ref="multipleTable"
			        :data="tableData2"
			        max-height="500"
			        stripe
			        tooltip-effect="dark"
			        style="width: 100%"
			        v-loading="listLoading"
			        @selection-change="selectRow2">
			        <el-table-column
			            type="selection"
			            width="45" 
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="id"
			            label="问题ID"
			            width="80" 
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="problemName"
			            label="问题名称"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            label="操作"
			            align="center"
			            width="100"
			            show-overflow-tooltip>
			            <template slot-scope="scope">
			            	<el-button type="text" size="small" @click="handleUpdate2(scope.row)">修改</el-button>
			            	<span class="line"></span>
			            	<el-button type="text" size="small" @click="handleDelete2(scope.row)" class="red">删除</el-button>
			            </template>
			        </el-table-column>
				</el-table>
				<el-pagination
				    v-show="total > 0"
            		:page-size="patientList.pageSize"
				    :pager-count="7"
				    layout="prev, pager, next"
				    :total="total"
		            :current-page="patientList.pageNum + 1"
		            @current-change="changePage2">
				</el-pagination>
		    </el-tab-pane>
		</el-tabs>

		<!-- 医生新增/编辑 -->
		<el-dialog 
			:title="textMap[doctorStatus]"
            :visible.sync="doctorDialogFormVisible" 
			center
			width="60%" 
			:lock-scroll="false">
			<div class="dialogForm">
				<el-form :rules="dialogRules" size="small" :model="formData" ref="dataForm" class="demo-form" label-width="100px" @submit.native.prevent>
					<el-form-item label="问题名称：" prop="problemName">
				    	<el-input placeholder="请输入问题名称" v-model="formData.problemName"></el-input>
				    </el-form-item>
				    <el-form-item label="问题详解：" prop="problemDetil">
				    	<!-- <el-input type="textarea" :rows="5" v-model="formData.problemDetil"></el-input> -->
						<wang-editor ref="editorDoctor" @input="updateProblemContent" :value="formData.problemDetil"></wang-editor>
				    </el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" :loading="submitLoading" @click="handleSubmit">提交</el-button> 
			</div> 	
		</el-dialog>

		<!-- 患者新增/编辑 -->
		<el-dialog 
			:title="textMap[patientStatus]"
            :visible.sync="patientDialogFormVisible" 
			center
			width="60%" 
			:lock-scroll="false">
			<div class="dialogForm">
				<el-form :rules="dialogRules" size="small" :model="formData2" ref="dataForm2" class="demo-form" label-width="100px" @submit.native.prevent>
					<el-form-item label="问题名称：" prop="problemName">
				    	<el-input placeholder="请输入问题名称" v-model="formData2.problemName"></el-input>
				    </el-form-item>
				    <el-form-item label="问题详解：" prop="problemDetil">
						<wang-editor ref="editorPatient" @input="updateProblemContent2" :value="formData2.problemDetil"></wang-editor>
				    </el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" :loading="submitLoading" @click="handleSubmit2">提交</el-button> 
			</div> 	
		</el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.secondTab{
	.statement{
		position: relative;
		.el-button{
			position: absolute;
			right: 0;
			top: 5px;
		}
	}
	.el-form .flex-item{
		margin-right: 0;
		text-align: right;
	}
	.el-table{
		margin: 15px 0;
	}
	.el-table thead th,
	.el-table thead tr{
		background-color: #e4e7ed;
		color: #333;
	}
	.el-table tr td{
		a,.line{
			display: inline-block;
			vertical-align: middle;
		}
		.line{
			height: 20px;
			border-left: 1px solid #333;
			margin: 0 6px;
		}
	}
}
.secondTab>.el-tabs__header .el-tabs__item.is-active{
	border-bottom-color: #e4e7ed;
	background-color: #e4e7ed;
	color: #303133;
}
</style>

<script>
import WangEditor from '@/components/WangEditor'

import { getCommonProblemDetail, getCommonProblemList, saveCommonProblem, deleteCommonProblem } from '@/api/system'

export default {
	components: { WangEditor },
    data() {
        return {
        	tab: 'doctor',
        	doctorList: {
	        	problemName: '',
	        	pageNum: 0,
				pageSize: 20,
				problemPort: '0',
	        },
	        patientList: {
	        	problemName: '',
	        	pageNum: 0,
				pageSize: 20,
				problemPort: '1',
	        },
        	tableData: [],
        	tableData2: [],
	        selectList: [],
	        selectList2: [],
	        listLoading: true,
	        submitLoading: false,
	        total: 0,
	        // 弹出框
	        doctorDialogFormVisible: false,
	        patientDialogFormVisible: false,
            doctorStatus: '',
            patientStatus: '',
            textMap: {
                create: '新增问题',
                update: '编辑问题',
            },
            formData: {
            	id: '',
	        	problemName: '',
	        	problemDetil: '',
	        	problemPort: '0',
	        	dataRemoveType: 0,
	        },
	        formData2: {
            	id: '',
	        	problemName: '',
	        	problemDetil: '',
	        	problemPort: '1',
	        	dataRemoveType: 0,
	        },
            dialogRules: {
	        	problemName: [
	        		{ required: true, message: '请输入问题名称', trigger: 'change' }
	        	],
	        	problemDetil: [
	        		{ required: true, message: '请输入问题详解', trigger: 'change' }
	        	]
	        },
        }
    },
    created() {
        this.getList()
        this.getList2()
    },
    methods: {
        // 获取表格选中时的数据
        selectRow (val) {
        	this.selectList = val
        },
        selectRow2 (val) {
        	this.selectList2 = val
        },
        updateProblemContent(val) {
        	this.formData.problemDetil = val
        },
        updateProblemContent2(val) {
        	this.formData2.problemDetil = val
        },
        getList() {
            this.listLoading = true
            getCommonProblemList(this.doctorList).then(res => {
            	const data = res.data
                this.tableData = data.data.pageData
                this.total = data.totalCount
                this.listLoading = false
            })
        },
        getList2() {
            this.listLoading = true
            getCommonProblemList(this.patientList).then(res => {
            	const data = res.data
                this.tableData2 = data.data.pageData
                this.total = data.totalCount
                this.listLoading = false
            })
        },
        changePage(val) {
            this.doctorList.pageNum = val - 1
            this.getList()
        },
        changePage2(val) {
            this.patientList.pageNum = val - 1
            this.getList2()
        },
        search() {
            this.doctorList.pageNum = 0
            this.getList()
        },
        search2() {
            this.patientList.pageNum = 0
            this.getList2()
        },
	    // 弹出框
        handleUpdate(row) {
            this.getDetail(row.id)
            this.doctorStatus = 'update'
            this.doctorDialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
            
        },
        handleUpdate2(row) {
            this.getDetail2(row.id)
            this.patientStatus = 'update'
            this.patientDialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm2'].clearValidate()
            })
        },
        getDetail(id) {
            getCommonProblemDetail(id).then(res => {
                const data = res.data
                this.formData = {
                    id: data.id,
                    dataRemoveType: 0,
                    problemName: data.problemName,
                    problemDetil: data.problemDetil,
                    problemPort: data.problemPort,
				}
				this.$refs.editorDoctor.setEditorContent(this.formData.problemDetil)
            })
        },
        getDetail2(id) {
            getCommonProblemDetail(id).then(res => {
                const data = res.data
                this.formData2 = {
                    id: data.id,
                    dataRemoveType: 0,
                    problemName: data.problemName,
                    problemDetil: data.problemDetil,
                    problemPort: data.problemPort,
				}
				this.$refs.editorPatient.setEditorContent(this.formData2.problemDetil)
            })
        },
        resetFormData() {
            this.formData = {
				problemPort: '0',
                problemName: '',
	        	problemDetil: ''
            }
        },
        resetFormData2() {
            this.formData2 = {
				problemPort: '1',
                problemName: '',
	        	problemDetil: ''
            }
        },
		handleCreate() {
            this.resetFormData()
            this.doctorStatus = 'create'
            this.doctorDialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleCreate2() {
            this.resetFormData2()
            this.patientStatus = 'create'
            this.patientDialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm2'].clearValidate()
            })
        },
        deleteSelect() {
            let data = []
            for (let item of this.selectList) {
                data.push(item.id)
            }
            this.handleDelete(data)
        },
        deleteSelect2() {
            let data = []
            for (let item of this.selectList2) {
                data.push(item.id)
            }
            this.handleDelete2(data)
        },
        // 删除
        handleDelete(row) {
        	let ids = []
            ids.push(row.id)
            deleteCommonProblem(ids).then(res => {
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
        },
        handleDelete2(row) {
        	let ids = []
            ids.push(row.id)
            deleteCommonProblem(ids).then(res => {
                const data = res.data
                if(data.flag == 'success') {
                    this.$message({
                        message: data.msg,
                        type: 'success',
                    })
                    this.getList2()
                } else {
                    this.$message({
                        message: data.msg,
                        type: 'error',
                    })
                }
            })
        },
        handleSubmit() {
        	this.$refs['dataForm'].validate(valid => {
                if (valid) {
                	this.submitLoading = true
                    saveCommonProblem(this.formData).then(res => {
                        const data = res.data
                        if (data.flag == 'success') {
                            this.doctorDialogFormVisible = false
                            let isCreate = this.doctorStatus == 'create'
                            let message = isCreate ? '添加成功' : '修改成功'
                            if (isCreate) {
                                this.doctorList.pageNum = 0
                            }
                            this.getList()
                            this.$message({
                                message,
                                type: 'success'
                            })
                            this.submitLoading = false
                        } else {
                            this.$message({
	                            message: data.msg,
	                            type: 'error'
	                        })
                        }
                        this.submitLoading = false
                    }).catch(() => {
                        this.submitLoading = false
                        this.$message({
                            message: '提交失败',
                            type: 'error'
                        })
                    })
                }
            })
        },
        handleSubmit2() {
        	this.$refs['dataForm2'].validate(valid => {
                if (valid) {
                	this.submitLoading = true
                    saveCommonProblem(this.formData2).then(res => {
                        const data = res.data
                        if (data.flag == 'success') {
                            this.patientDialogFormVisible = false
                            let isCreate = this.patientStatus == 'create'
                            let message = isCreate ? '添加成功' : '修改成功'
                            if (isCreate) {
                                this.patientList.pageNum = 0
                            }
                            this.getList2()
                            this.$message({
                                message,
                                type: 'success'
                            })
                            this.submitLoading = false
                        } else {
                            this.$message({
	                            message: data.msg,
	                            type: 'error'
	                        })
                        }
                        this.submitLoading = false
                    }).catch(() => {
                        this.submitLoading = false
                        this.$message({
                            message: '提交失败',
                            type: 'error'
                        })
                    })
                }
            })
        }
    }
}
</script>