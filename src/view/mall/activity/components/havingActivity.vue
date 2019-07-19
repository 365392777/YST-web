<template>
	<div>
		<el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline border" @submit.native.prevent>
	    	<el-form-item label="活动名称：">
		        <el-input v-model="listQuery.activityName" placeholder="输入活动名称"></el-input>
		    </el-form-item>
		    <el-form-item label="发布时间：">
		        <el-date-picker type="date" placeholder="选择起始时间" v-model="listQuery.startDateIssuan" value-format="yyyy-MM-dd" :picker-options="issuanTime"></el-date-picker>
		    </el-form-item>
		    <el-form-item label="活动时间：">
		        <el-date-picker type="date" placeholder="选择起始时间" v-model="listQuery.startTime" value-format="yyyy-MM-dd" :picker-options="pickerStartTime"></el-date-picker>
		        <template><span>-</span></template>
		        <el-date-picker type="date" placeholder="选择结束时间" v-model="listQuery.endTime" value-format="yyyy-MM-dd" :picker-options="pickerEndTime"></el-date-picker>
		    </el-form-item>
		    <el-form-item>
		        <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
		        <el-button type="primary" @click="handleStatus">结束活动</el-button>
		    </el-form-item>
		</el-form>
		<el-table
			ref="multipleTable"
	        :data="tableData"
	        :row-key="getRowKeys"
	        max-height="600"
	        stripe
	        tooltip-effect="dark"
	        style="width: 100%"
	        v-loading="listLoading"
	        @selection-change="selectRow">
	        <el-table-column
		    	type="selection"
		    	:reserve-selection="true"
		    	width="40">
		    </el-table-column>
	        <el-table-column
	            prop="id"
	            label="活动ID"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="activityName"
	            label="活动名称"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            label="活动类型"
	            align="center">
	            <template slot-scope="scope">
	            	<div v-if="scope.row.activityType == 0">订单满减活动</div>
	            	<div v-else>订单满赠活动</div>
	            </template>
	        </el-table-column>
	        <el-table-column
	            label="发布时间"
	            min-width="160"
	            align="center">
				<template slot-scope="scope">{{ dateTime(scope.row.createTime) }}</template>
	        </el-table-column>
	        <el-table-column
	            label="活动时间"
	            min-width="160"
	            align="center">
	            <template slot-scope="scope">{{ dateTime(scope.row.activityStartTime) }}</template>
	        </el-table-column>
	        <el-table-column
	            prop="createUserName"
	            label="发布者"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            label="操作"
	            align="center"
	            show-overflow-tooltip>
	            <template slot-scope="scope">
	            	<router-link :to="'/mall/activity/detail/' + scope.row.id">详情</router-link>
	            	<span class="line"></span>
	            	<el-button type="text" size="small" class="red" @click="handleRowStatus(scope.row)">结束活动</el-button>
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
            @current-change="changePage">
		</el-pagination>

		<!-- 结束活动 -->
        <el-dialog 
            :visible.sync="dialogFormVisible" 
            center
            :lock-scroll="false">
            <div class="dialogForm">
                <el-form size="small" :model="formData" ref="dataForm" class="demo-form" @submit.native.prevent align="center">
                    <el-form-item prop="elaborate">
                        <template>{{ formData.elaborate }}</template>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" :loading="submitLoading" @click="handleYes">是</el-button>
                <el-button type="primary" size="small" @click="dialogFormVisible = false">否</el-button> 
            </div>  
        </el-dialog>
	</div>
</template>

<style lang="scss" scoped>
.el-table{
	.el-button{
		font-size: 14px;
	}
}
</style>

<script>
import { getActivityList, updateActivityStatus } from '@/api/mall'
import { convertDate } from '@/utils'

export default {
    data() {
		return {
			issuanTime: {
				disabledDate: (time) => {
                    if (this.listQuery.startDateIssuan) {
                        let date = new Date(this.listQuery.startDateIssuan.replace(/-/g, '/'))
                        return time.getTime() > date || time.getTime() > Date.now()
                    } else {
						return time.getTime() > Date.now()
					}
                }
			},
			pickerStartTime: {
                disabledDate: (time) => {
                    if (this.listQuery.endTime != '') {
                        return time.getTime() > new Date(this.listQuery.endTime).getTime()
                    }
                }
            },
            pickerEndTime: {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.listQuery.startTime).getTime()
                }
            },
			getRowKeys(row) {
	            return row.id;
	        },
			listQuery: {
	        	activityName: '',
	        	startTime: '',
	        	endTime: '',
	        	activityStatus: 1,
	        	pageNum: 0,
	        	pageSize: 20,
	        },
	        tableData: [],
	        selectList: [],
	        dialogFormVisible: false,
	        formData: {
	        	elaborate: '是否提前结束活动？'
	        },
	        listLoading: true,
            submitLoading: false,
            total: 0,
            id: ''
		}
	},
	created() {
        this.getList()
    },
    computed: {
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        }
    },
	methods: {
	    // 获取表格选中时的数据
	    selectRow (rows) {
	        this.selectList = rows;
            this.select_id = [];
            if (rows) {
                rows.forEach(row => {
                    if (row) {
                        this.select_id.push(row.id);
                    }
                });
            }
	    },
	    getList() {
            this.listLoading = true
            getActivityList(this.listQuery).then(res => {
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
        handleRowStatus(row) {
        	this.dialogFormVisible = true
        	this.id = [row.id]
        },
        handleStatus() {
        	this.id = []
        	for (let item of this.selectList) {
                this.id.push(item.id)
            }
            if(this.id.length != 0){
				this.dialogFormVisible = true
            }else{
            	this.$message({
                    message: '请先选择',
                    type: 'warning'
                })
            }
        },
        handleYes() {
        	updateActivityStatus(this.id).then(res => {
                const data = res.data
                if(data.flag == 'success') {
                    this.$message({
                        message: data.msg,
                        type: 'success',
                    })
                    this.dialogFormVisible = false
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