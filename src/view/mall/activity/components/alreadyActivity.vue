<template>
	<div>
		<el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline border" @submit.native.prevent>
	    	<el-form-item label="活动名称：">
		        <el-input v-model="listQuery.activityName" placeholder="输入活动名称"></el-input>
		    </el-form-item>
		    <el-form-item label="发布时间：">
		        <el-date-picker type="date" placeholder="选择起始时间" v-model="listQuery.createTime" value-format="yyyy-MM-dd" :picker-options="issuanTime"></el-date-picker>
		    </el-form-item>
		    <el-form-item label="活动时间：">
		        <el-date-picker type="date" placeholder="选择起始时间" v-model="listQuery.startTime" value-format="yyyy-MM-dd" :picker-options="pickerStartTime"></el-date-picker>
		        <template><span>-</span></template>
		        <el-date-picker type="date" placeholder="选择结束时间" v-model="listQuery.endTime" value-format="yyyy-MM-dd" :picker-options="pickerEndTime"></el-date-picker>
		    </el-form-item>
		    <el-form-item>
		        <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
		    </el-form-item>
		</el-form>
		<el-table
	        :data="tableData"
	        max-height="600"
	        stripe
	        tooltip-effect="dark"
	        style="width: 100%"
	        v-loading="listLoading"
	        @selection-change="selectRow">
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
import { getActivityList } from '@/api/mall'
import { convertDate } from '@/utils'

export default {
    data() {
		return {
			issuanTime: {
				disabledDate: (time) => {
					return time.getTime() > Date.now()
                }
			},
			pickerStartTime: {
                disabledDate: (time) => {
                    if (this.listQuery.endTime) {
                        let date = new Date(this.listQuery.endTime.replace(/-/g, '/'))
                        return time.getTime() > date || time.getTime() > Date.now()
                    } else {
						return time.getTime() > Date.now()
					}
                }
            },
            pickerEndTime: {
                disabledDate: (time) => {
                    let date = null
					if (this.listQuery.startTime) {
						date = this.listQuery.startTime.replace(/-/g, '/')
						date = new Date(date)
					}
                    return time.getTime() < date || time.getTime() > Date.now()
                }
            },
			listQuery: {
	        	activityName: '',
	        	createTime: '',
	        	startTime: '',
	        	endTime: '',
	        	activityStatus: 2,
	        	pageNum: 0,
	        	pageSize: 20,
	        },
	        tableData: [],
	        selectList: [],
	        listLoading: true,
            submitLoading: false,
            total: 0,
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
	    selectRow (val) {
	      this.selectList = val;
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
            this.listQuery.pageNum = val - 1;
            this.getList();
        },
        search() {
            this.listQuery.pageNum = 0;
            this.getList();
        },
    }
}
</script>