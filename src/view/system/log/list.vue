<template>
    <div class="page-container">
    	<el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
		    <el-breadcrumb-item class="bold" :to="{ path: '/system/log/list' }">操作日志</el-breadcrumb-item>
		</el-breadcrumb>
    	<el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline border" @submit.native.prevent>
		    <!-- <el-form-item label="角色ID" prop="dealId">
		        <el-input v-model="listQuery.dealId" placeholder="请输入ID"></el-input>
		    </el-form-item> -->
		    <el-form-item label="账号" prop="userLoginId">
		        <el-input v-model="listQuery.userLoginId" placeholder="请输入账号"></el-input>
		    </el-form-item>
		    <el-form-item label="描述" prop="dealDesc">
		        <el-input v-model="listQuery.dealDesc" placeholder="请输入描述"></el-input>
		    </el-form-item>
		    <el-form-item label="时间" prop="dealTimeStart" class="dateForm">
		        <el-date-picker type="date" placeholder="起始时间" value-format="yyyy-MM-dd" v-model="listQuery.dealTimeStart" :picker-options="pickerStartime"></el-date-picker>
		        <template><span>-</span></template>
		    </el-form-item>
		    <el-form-item prop="dealTimeEnd">
		    	<el-date-picker type="date" placeholder="结束时间" value-format="yyyy-MM-dd" v-model="listQuery.dealTimeEnd" :picker-options="pickerEndTime"></el-date-picker>
		    </el-form-item>
		    <el-form-item>
		        <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
		    </el-form-item>
		</el-form>
        <el-table
	        ref="multipleTable"
	        :data="tableData"
	        max-height="600"
	        stripe
	        tooltip-effect="dark"
	        style="width: 100%"
	        v-loading="listLoading"
	        @selection-change="selectRow">
	        <el-table-column
	            type="selection"
	            width="40" 
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="dealId"
	            label="日志ID"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="userLoginId"
	            label="账号"
	            min-width="120"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="dealDesc"
	            label="描述"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="dealClass"
	            label="地址"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="dealMethod"
	            label="接口"
	            align="center">
            </el-table-column>
            <el-table-column
	            label="结果"
	            align="center">
	            <template slot-scope="scope">
	            	<div v-if="scope.row.dealStatus">成功</div>
	            	<div v-else>失败</div>
	            </template>
            </el-table-column>
	        <el-table-column
	            label="时间"
	            min-width="160"
	            align="center">
	            <template slot-scope="scope">{{ dateTime(scope.row.dealTime) }}</template>
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
.page-container{
	padding: 15px 30px;
	.el-col-4 button{
		float: right;
	}
	.el-table{
		margin: 15px 0;
	}
	.el-table thead th,
	.el-table thead tr{
		background-color: #e4e7ed;
		color: #333;
	}
}
</style>

<script>
import { getDealLogList, getDealLogDetail } from '@/api/system';
import { convertDate } from '@/utils';

export default {
    data() {
      return {
      	pickerStartime: {          
            disabledDate: (time) => {
                if (this.listQuery.dealTimeEnd) {
                    let date = new Date(this.listQuery.dealTimeEnd.replace(/-/g, '/'))
                    return time.getTime() > date || time.getTime() > Date.now()
                } else {
					return time.getTime() > Date.now()
				}
            }
        },
        pickerEndTime: {
            disabledDate: (time) => {
                let date = null
				if (this.listQuery.dealTimeStart) {
					date = this.listQuery.dealTimeStart.replace(/-/g, '/')
					date = new Date(date)
				}
                return time.getTime() < date || time.getTime() > Date.now()
            }
        },
      	listQuery: {
        	userLoginId: '',
        	dealId: '',
        	dealDesc: '',
        	dealTimeStart: '',
        	dealTimeEnd: '',
        	pageNum: 0,
        	pageSize: 20
        },
        tableData: [],
        selectList: [],
        total: 0,
        listLoading: true,
      }
    },
    created() {
        this.getList();
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
            this.listLoading = true;
            getDealLogList(this.listQuery).then(res => {
                const data = res.data.data;
                this.tableData = data.pageData;
                this.total = data.totalCount;
                this.listLoading = false;
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