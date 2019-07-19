<template>
	<div>
		<el-form
			:inline="true"
			:model="listQuery"
			ref="formIn"
			size="small"
			class="demo-form-inline border"
			@submit.native.prevent
		>
		    <el-form-item label="商品名称" prop="goodsName">
		        <el-input v-model="listQuery.goodsName" placeholder="输入商品名称"></el-input>
		    </el-form-item>
		    <el-form-item label="入库时间" class="dateForm"  prop="startTime">
		        <el-date-picker
					type="date"
					placeholder="选择起始时间" v-model="listQuery.startTime"
					:picker-options="startOptions"
					value-format="yyyy-MM-dd"
				></el-date-picker>
		        <template><span>-</span></template>
		    </el-form-item>
		    <el-form-item prop="endTime">
		    	<el-date-picker
					type="date"
					placeholder="选择结束时间"
					v-model="listQuery.endTime"
					:picker-options="endOptions"
					value-format="yyyy-MM-dd"
				></el-date-picker>
		    </el-form-item>
		    <el-form-item label="操作者" prop="createUserName">
		        <el-input v-model="listQuery.createUserName" placeholder="输入入库操作者人姓名"></el-input>
		    </el-form-item>
		    <el-form-item>
		        <el-button type="primary" icon="el-icon-search" @click="search" native-type="submit">查询</el-button>
		        <el-button type="primary" @click="resetIn">重置</el-button>
		        <el-button type="primary" :disabled="selectList.length <= 0">导出</el-button>
		    </el-form-item>
		</el-form>
		<el-table
	        ref="multipleTable"
	        :data="tableData"
			v-loading="listLoading"
	        max-height="500"
	        stripe
	        tooltip-effect="dark"
	        style="width: 100%"
	        @selection-change="selectRow"
		>
	        <el-table-column
	            type="selection"
	            width="40" 
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="goodsName"
	            label="商品名称"
	            align="center">
	        </el-table-column>
	        <el-table-column
	        	prop="goodsSpeName"
	            label="规格"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="beforeTotalAmount"
	            label="入库前库存"
	            align="center">
	        </el-table-column>
	        <el-table-column
	        	prop="operateAmount"
	            label="入库数量"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="afterTotalAmount"
	            label="入库后库存"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            label="入库时间"
	            align="center"
			>
				<template slot-scope="scope">
                    <span>{{ dateTime(scope.row.createTime) }}</span>
                </template>
	        </el-table-column>
			<el-table-column
	            prop="remark"
	            label="备注"
	            align="center">
	        </el-table-column>
	        <el-table-column
	        	prop="createUserName"
	            label="入库人"
	            align="center">
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
	</div>
</template>

<script>
import { operateList } from '@/api/stock'
import { convertDate } from '@/utils'

export default {
	data() {
		return {
			listQuery: {
				type: 1,
	        	goodsName: '',
	        	startTime: '',
	        	endTime: '',
				createUserName: '',
				pageNum: 0,
				pageSize: 50,
	        },
			tableData: [],
			total: 0,
			selectList: [],
			listLoading: false,
			startOptions: {
                disabledDate: (time) => {
                    if (this.listQuery.endTime) {
						let date = new Date(this.listQuery.endTime.replace(/-/g, '/'))
                        return time.getTime() > date || time.getTime() > Date.now()
                    } else {
						return time.getTime() > Date.now()
					}
                }
            },
            endOptions: {
                disabledDate: (time) => {
                    let date = null
					if (this.listQuery.startTime) {
						date = this.listQuery.startTime.replace(/-/g, '/')
						date = new Date(date)
					}
                    return time.getTime() < date || time.getTime() > Date.now()
                }
            },
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
		getList() {
			this.listLoading = true
			operateList(this.listQuery).then(res => {
				const data = res.data
				if (data.code == '10001') {
					this.listLoading = false
					this.tableData = data.data.pageData
					this.total = data.data.totalCount
				}
			})
		},
		search() {
			this.listQuery.pageNum = 0
			this.getList()
		},
    	// 获取表格选中时的数据
        selectRow (val) {
          this.selectList = val
        },
        // 重置
        resetIn() {
			this.$refs.formIn.resetFields()
			this.listQuery.pageNum = 0
			this.getList()
		},
		changePage(val) {
			this.listQuery.pageNum = val - 1
			this.getList()
		},
    }
}
</script>