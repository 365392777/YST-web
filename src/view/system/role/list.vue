<template>
    <div class="page-container">
    	<el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
		    <el-breadcrumb-item class="bold" :to="{ path: '/system/role/list' }">后台用户角色管理</el-breadcrumb-item>
		</el-breadcrumb>
    	<el-row type="flex" justify="end" :gutter="15">
			<el-col :span="24" class="align-right">
				<el-button type="primary" size="small" @click="add">添加角色</el-button>
			</el-col>
		</el-row>
		<el-form
            :inline="true"
            :model="listQuery"
            size="small"
            class="demo-form-inline"
            @submit.native.prevent
        ></el-form>
        <el-table
	        ref="multipleTable"
	        :data="tableData"
	        max-height="600"
	        stripe
	        tooltip-effect="dark"
	        style="width: 100%"
	        v-loading="listLoading"
	    >
	        <el-table-column
	            prop="roleId"
	            label="角色ID"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="roleName"
	            label="角色类型"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            label="添加时间"
	            min-width="160"
	            align="center">
	            <template slot-scope="scope">{{ dateTime(scope.row.creatTime) }}</template>
	        </el-table-column>
	        <el-table-column
	            prop="createUserName"
	            label="添加人"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="userCount"
	            label="账号数量"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            label="操作"
	            align="center"
	            show-overflow-tooltip>
	            <template slot-scope="scope">
	            	<router-link :to="'/system/role/edit/' + scope.row.roleId">
						<el-button type="text">修改</el-button>
					</router-link>
	            	<span class="line"></span>
	            	<el-button type="text" class="red" @click="handleDelete(scope.row)">删除</el-button>
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
.page-container{
	padding: 15px 30px;
	.el-col-4 .el-button{
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
	.el-table tr td{
		.line{
			height: 20px;
			border-left: 1px solid #333;
			margin: 0 6px;
		}
	}
}
</style>

<script>
import { getRoleList, deleteRole } from '@/api/system';
import { convertDate } from '@/utils';
	
export default {
    data() {
      return {
      	listQuery: {
            pageNum: 0,
            pageSize: 20,
        },
        tableData: [],
        selectlistRow: [],
        listLoading: true,
        total: 0,
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
        this.getList();
    },
    methods: {
	    // 获取表格选中时的数据
        selectRow (val) {
          this.selectlistRow = val
        },
        add() {
		    this.$router.push({path: '/system/role/add'})
	    },
        getList() {
            this.listLoading = true
            getRoleList(this.listQuery).then(res => {
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
        handleDelete(row) {
        	let id = {};
            id = row.roleId
            deleteRole(id).then(res => {
                const data = res.data;
                if(data.flag == 'success') {
                    this.$message({
                        message: data.msg,
                        type: 'success',
                    })
                    this.getList();
                } else {
                    this.$message({
                        message: data.msg,
                        type: 'error',
                    })
                }
            })
        },
    }
}
</script>