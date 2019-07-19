<template>
	<div>
		<el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline border" @submit.native.prevent>
	    	<el-form-item label="优惠券名称：">
		        <el-input v-model="listQuery.couponName" placeholder="输入优惠券名称"></el-input>
		    </el-form-item>
		    <el-form-item label="发放时间：">
		        <el-date-picker type="date" placeholder="选择起始时间" v-model="listQuery.startDateIssuan" value-format="yyyy-MM-dd" :picker-options="pickerDateIssuan0"></el-date-picker>
		        <template><span>-</span></template>
		        <el-date-picker type="date" placeholder="选择结束时间" v-model="listQuery.endDateIssuan" value-format="yyyy-MM-dd" :picker-options="pickerDateIssuan1"></el-date-picker>
		    </el-form-item>
		    <el-form-item label="生效时间：">
		        <el-date-picker type="date" placeholder="选择起始时间" v-model="listQuery.startDateUse" value-format="yyyy-MM-dd" :picker-options="pickerDateUse0"></el-date-picker>
		        <template><span>-</span></template>
		        <el-date-picker type="date" placeholder="选择结束时间" v-model="listQuery.endDateUse" value-format="yyyy-MM-dd" :picker-options="pickerDateUse1"></el-date-picker>
		    </el-form-item>
		    <el-form-item>
		        <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
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
	            width="40" 
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="id"
	            label="优惠券ID"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="couponName"
	            label="优惠券名称"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="discountMoney"
	            label="面额"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="fullMoney"
	            label="使用需满金额"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            label="使用开始日期"
	            min-width="160"
	            align="center">
	            <template slot-scope="scope">{{ dateTime(scope.row.startDateUse) }}</template>
	        </el-table-column>
	        <el-table-column
	            label="使用截至日期"
	            min-width="160"
	            align="center">
	            <template slot-scope="scope">{{ dateTime(scope.row.endDateUse) }}</template>
	        </el-table-column>
	        <el-table-column
	            label="操作"
	            align="center"
	            show-overflow-tooltip>
	            <template slot-scope="scope">
	            	<router-link :to="'/mall/coupons/edit/' + scope.row.id">编辑</router-link>
	            	<span class="line"></span>
	            	<router-link :to="'/mall/coupons/detail/' + scope.row.id">详情</router-link>
	            	<span class="line"></span>
	            	<el-button type="text" size="small" class="red" @click="handleDelete(scope.row)">删除</el-button>
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
import { getCouponList, deleteCoupon } from '@/api/mall'
import { convertDate } from '@/utils'

export default {
    data() {
		return {
			pickerDateIssuan0: {          
            	disabledDate: (time) => {
            		if (this.listQuery.endDateIssuan) {
                        let date = new Date(this.listQuery.endDateIssuan.replace(/-/g, '/'))
                        return time.getTime() > date || time.getTime() > Date.now()
                    } else {
						return time.getTime() > Date.now()
					}
            	}
    		},
    		pickerDateIssuan1: {
                disabledDate: (time) => {
                    let date = null
					if (this.listQuery.startDateIssuan) {
						date = this.listQuery.startDateIssuan.replace(/-/g, '/')
						date = new Date(date)
					}
                    return time.getTime() < date || time.getTime() > Date.now()
                }
            },
			pickerDateUse0: {          
            	disabledDate: (time) => {
            		if (this.listQuery.endDateUse) {
                        let date = new Date(this.listQuery.endDateUse.replace(/-/g, '/'))
                        return time.getTime() > date || time.getTime() > Date.now()
                    } else {
						return time.getTime() > Date.now()
					}
            	}
    		},
    		pickerDateUse1: {
                disabledDate: (time) => {
                    let date = null
					if (this.listQuery.startDateUse) {
						date = this.listQuery.startDateUse.replace(/-/g, '/')
						date = new Date(date)
					}
                    return time.getTime() < date || time.getTime() > Date.now()
                }
            },
			getRowKeys(row) {
	            return row.id;
	        },
			listQuery: {
	        	couponName: '',
	        	startDateIssuan: '',
	        	endDateIssuan: '',
	        	startDateUse: '',
	        	endDateUse: '',
	        	pageNum: 0,
	        	pageSize: 20,
	        	couponStatus: 2
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
            getCouponList(this.listQuery).then(res => {
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
	    // 新增
        add() {},
        // 删除
        handleDelete(row) {
        	let id = {}
        	let couponStatus = 3
            id = row.id
            deleteCoupon(id, couponStatus).then(res => {
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