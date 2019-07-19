<template>
	<div>
		<el-tabs v-model="tab" class="tabChild" @tab-click="switchTab">
		    <el-tab-pane label="医生端" name="doctor">
				<el-row class="row-group">
					<el-button type="close" size="small" @click="handleBack" v-if="doctorStatus == 'update' && doctorFormData.id">返回</el-button>
					<el-button type="primary" size="small" @click="changeDoctorState">
						{{doctorTextMap[doctorStatus]}}
					</el-button>
				</el-row>
				<div v-if="doctorStatus == 'preview'" v-html="doctorFormData.statementContext" class="editor-preview">
				</div>
				<div v-if="doctorStatus == 'update'">
					<wang-editor ref="editor" @input="updateDoctorContent" :value="doctorFormData.statementContext"></wang-editor>
				</div>
			</el-tab-pane>
		    <el-tab-pane label="患者端" name="patient">
				<el-row class="row-group">
					<el-button type="close" size="small" @click="handleBack" v-if="patientStatus == 'update' && patientFormData.id">返回</el-button>
					<el-button type="primary" size="small" @click="changePatientState">
						{{patientTextMap[patientStatus]}}
					</el-button>
				</el-row>
				<div v-if="patientStatus == 'preview'" v-html="patientFormData.statementContext" class="editor-preview">
				</div>
				<div v-if="patientStatus == 'update'">
					<wang-editor ref="editor" @input="updatePatientContent" :value="patientFormData.statementContext"></wang-editor>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<style lang="scss" scoped>
.secondTab{
	.statement{
		position: relative;
		// .el-button{
		// 	position: absolute;
		// 	right: 0;
		// 	top: 5px;
		// }
	}
	.row-group {
		padding-bottom: 20px;
		text-align: right;
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
import { getStatemnetDetail, saveStatemnet } from '@/api/system'

export default {
	components: { WangEditor },
    data() {
        return {
			tab: 'doctor',
			currentTab: 'doctor',
			doctorFormData: {
				statementContext: '',
				dataRemoveType: 0,
				statementPort: '0',
				statementType: '1',
			},
			patientFormData: {
				statementContext: '',
				dataRemoveType: 0,
				statementPort: '1',
				statementType: '1',
			},
			doctorStatus: 'preview',
			doctorTextMap: {
				update: '保存',
                preview: '重新编辑'
			},
			patientStatus: 'preview',
			patientTextMap: {
				update: '保存',
                preview: '重新编辑'
			}
        };
    },
    created() {
        this.getDetail('0')
    },
    methods: {
        edit() {
        	this.$router.push({path: '/system/info/edit'})
		},
		getDetail(port) {
            getStatemnetDetail(port, '1').then(res => {
            	if (port == '0') {
            		this.doctorFormData.statementContext = res.data.statementContext ? res.data.statementContext : ''
	                if (res.data.id <= 0) {
	                    this.doctorStatus = 'update'
	                } else {
	                	this.doctorFormData.id = res.data.id
	                }	
            	} else {
            		this.patientFormData.statementContext = res.data.statementContext ? res.data.statementContext : ''
	                if (!res.data.id || res.data.id <= 0) {
	                    this.patientStatus = 'update'
	                } else {
	                	this.patientFormData.id = res.data.id
	                }
            	}
                
            })
        },
        switchTab() {
			if (this.currentTab != this.tab && this.tab == 'patient') {
				this.doctorStatus = 'preview'
			} else if (this.currentTab != this.tab && this.tab == 'doctor') {
				this.patientStatus = 'preview'
			}
        	if (this.tab == 'patient') {
        		this.getDetail('1')
        	}
		},
		handleBack() {
			this.doctorStatus = 'preview'
			this.patientStatus = 'preview'
		},
		changeDoctorState() {
			if (this.doctorStatus == 'preview') {
				this.doctorStatus = 'update'
			} else if (this.doctorStatus == 'update') {
				this.doctorStatus = 'preview'
				this.handleSubmit('0')
			}
		},
		changePatientState() {
			if (this.patientStatus == 'preview') {
				this.patientStatus = 'update'
			} else if (this.patientStatus == 'update') {
				this.patientStatus = 'preview'
				this.handleSubmit('1')
			}
		},
		handleSubmit(port) {
			let data = null
			if (port == '0') {
				data = this.doctorFormData
			} else {
				data = this.patientFormData
			}
			saveStatemnet(data).then(res =>{
				const data = res.data
				if (data.flag == 'success') {
					this.$message.success('操作成功')
					this.getDetail(port)
				} else {
					this.$message.error(data.msg)
				}
			})
		},
		updateDoctorContent(val) {
			this.doctorFormData.statementContext = val
		},
		updatePatientContent(val) {
			this.patientFormData.statementContext = val
		},
    }
};
</script>