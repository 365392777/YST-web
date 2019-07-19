<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
                :to="{ path: '/warehouse/check/list' }"
            >库存盘点</el-breadcrumb-item>
            <el-breadcrumb-item>盘点记录</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            ref="formCheck"
            size="small"
            class="demo-form-inline border"
			@submit.native.prevent
        >
            <el-form-item label="商品类别" prop="goodsCategoryId">
                <el-select v-model="listQuery.goodsCategoryId" clearable>
                    <el-option
						v-for="item in classList"
						:key="item.id"
						:label="item.commodityName"
						:value="item.id"
					></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="商品名称"
				prop="goodsName"
            >
                <el-input
                    v-model="listQuery.goodsName"
                    placeholder="输入商品名称"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="盘点时间："
                class="dateForm"
				prop="startTime"
            >
                <el-date-picker
                    type="date"
                    placeholder="选择起始时间"
                    v-model="listQuery.startTime"
					:picker-options="startOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
                <template><span>-</span></template>
            </el-form-item>
            <el-form-item
				prop="endTime"
			>
                <el-date-picker
                    type="date"
                    placeholder="选择结束时间"
                    v-model="listQuery.endTime"
					:picker-options="endOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="search"
					native-type="submit"
                >搜索</el-button>
                <el-button
                    type="primary"
                    @click="reset"
                >重置</el-button>
                <el-button
                    type="primary"
					:disabled="selectList.length <= 0"
                >导出</el-button>
            </el-form-item>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="tableData"
			v-loading="listLoading"
            max-height="540"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="selectRow"
        >
            <el-table-column
                type="selection"
                width="40"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="盘点时间"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ dateTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="goodsName"
                label="商品名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="goodsSpeName"
                label="规格"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="beforeCheckAmount"
                label="盘点前库存"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="checkAmount"
                label="盘点数量"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="profitAndLoss"
                label="盈亏数量"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="createUserName"
                label="盘点人"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注"
                align="center"
                show-overflow-tooltip
            >
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
import { getCheckHistoryList, getComodityClassList } from '@/api/stock'
import { convertDate } from '@/utils'

export default {
    data() {
        return {
            btnCheck: 0,
            listQuery: {
                goodsCategoryId: '',
                goodsName: '',
                startTime: '',
				endTime: '',
				pageNum: 0,
				pageSize: 50,
            },
            tableData: [],
			selectList: [],
			listLoading: false,
			total: 0,
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
            classList: [],
        }
	},
	created() {
        this.getList()
        this.getClassList()
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
			getCheckHistoryList(this.listQuery).then(res => {
				const data = res.data
				if (data.code == '10001') {
					this.tableData = data.data.pageData
					this.total = data.data.totalCount
					this.listLoading = false
				}
			})
        },
        getClassList() {
			getComodityClassList().then(res => {
				this.classList = res.data
			})
		},
		search() {
			this.listQuery.pageNum = 0
			this.getList()
		},
        // 获取表格选中时的数据
        selectRow(val) {
            this.selectList = val
        },
        //重置
        reset() {
			this.$refs.formCheck.resetFields()
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
