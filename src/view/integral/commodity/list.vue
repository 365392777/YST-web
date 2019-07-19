<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">积分商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            size="small"
            class="demo-form-inline border"
            @submit.native.prevent
        >
            <el-form-item label="商品类别">
                <el-select
                    v-model="listQuery.goodsCategoryId"
                    placeholder="请选择类别"
                    clearable
                    class="w200"
                >
                    <el-option
                        v-for="item in classList"
                        :key="item.id"
                        :label="item.commodityName"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否上架积分商城">
                <el-select
                    v-model="listQuery.putAwayStatus"
                    placeholder="请选择"
                    clearable
                    class="w200"
                >
                    <el-option
                        label="上架"
                        value="0"
                    ></el-option>
                    <el-option
                        label="下架"
                        value="1"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品名称">
                <el-input
                    v-model="listQuery.goodsName"
                    placeholder="输入商品名称"
                    class="w200"
                ></el-input>
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
                    @click="handleCreate"
                >新增商品</el-button>
                <el-button
                    type="danger"
                    @click="deleteSelect"
                    :disabled="selectList.length <= 0"
                >删除</el-button>
            </el-form-item>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="tableData"
            v-loading="listLoading"
            max-height="600"
            stripe
            :default-sort="{prop: 'number', order: 'descending'}"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="selectRow"
        >
            <el-table-column
                type="selection"
                width="45"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="id"
                label="商品ID"
                width="80"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="goosName"
                label="商品名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="goodsClass"
                label="类别"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="goodsCount"
                label="库存量"
                sortable
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="上架积分商城"
                align="center"
            >
                <template slot-scope="scope">
                    <el-checkbox
                        v-model="scope.row.putAwayStatus"
                        :true-label="'0'"
                        :false-label="'1'"
                        @change="handleEnable(scope.row, 'putAwayStatus')"
                    ></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-button type="text">预览</el-button>
                    <span class="line"></span>
                    <el-button
                        type="text"
                        class="red"
                        @click="deleteRow(scope.row)"
                    >删除</el-button>
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
        <el-dialog
            title="添加积分商品"
            :visible.sync="dialogVisible"
            center
            :lock-scroll="false"
            width="1150px"
        >
            <div class="dialogForm">
                <el-form
                    :inline="true"
                    :model="addListQuery"
                    size="small"
                    class="demo-form-inline border"
                    @submit.native.prevent
                >
                    <el-form-item label="商品类别">
                        <el-select
                            v-model="addListQuery.goodsCategoryId"
                            placeholder="请选择类别"
                            clearable
                            class="w200"
                        >
                            <el-option
                                v-for="item in classList"
                                :key="item.id"
                                :label="item.commodityName"
                                :value="item.id"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品名称">
                        <el-input
                            v-model="addListQuery.goodsName"
                            placeholder="输入商品名称"
                            class="w200"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button
                            type="primary"
                            icon="el-icon-search"
                            @click="addSearch"
                            native-type="submit"
                        >搜索</el-button>
                        <el-button
                            type="primary"
                            @click="addIntegral"
                            :disabled="selectGoodsList.length <= 0"
                            :loading="submitLoading"
                        >新增商品</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    ref="multipleTable"
                    :data="goodsList"
                    max-height="400"
                    stripe
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="selectGoodsRow"
                >
                    <el-table-column
                        type="selection"
                        width="45"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="id"
                        label="商品ID"
                        width="80"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="goosName"
                        label="商品名称"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="goodsClass"
                        label="类别"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="goodsCount"
                        label="库存量"
                        sortable
                        align="center"
                    >
                    </el-table-column>
                </el-table>
                <el-pagination
                    v-show="addListTotal > 0"
                    :page-size="addListQuery.pageSize"
                    :pager-count="7"
                    layout="prev, pager, next"
                    :total="addListTotal"
                    :current-page="addListQuery.pageNum + 1"
                    @current-change="changeGoodsPage"
                >
                </el-pagination>
            </div>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    size="small"
                    @click="dialogVisible = false"
                >关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    getIntegralGoodsList,
    addIntegralGoods,
    putAwayIntegralGoods,
    deleteIntegralGoods
} from '@/api/integral'
import { getGoodsList } from '@/api/mall'
import { getComodityClassList } from '@/api/util'

export default {
    data() {
        return {
            listQuery: {
                goodsCategoryId: '',
				integralMall: '0',
                goodsName: '',
                stricSelect: '',
                putAwayStatus: '',
				pageNum: 0,
				pageSize: 50,
            },
            addListQuery: {
                goodsCategoryId: '',
                integralMall: '',
                putAwayStatus: '',
                goodsName: '',
                stricSelect: '',
                pageNum: 0,
                pageSize: 10
            },
            tableData: [],
            selectList: [],
            classList: [],
            total: 0,
            listLoading: false,
            goodsListLoading: false,
            addListTotal: 0,
            dialogVisible: false,
            goodsList: [],
            submitLoading: false,
            selectGoodsList: [],
        }
    },
    created() {
        this.getList()
        this.getClassList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getGoodsList(this.listQuery).then(res => {
            	const data = res.data
            	if (data.code == '10001' || data.code == 'NL_001') {
            		this.tableData = data.data.pageData
            		this.total = data.data.totalCount
            		this.listLoading = false
            	} else {
                    this.$message.error(data.error)
                }
            })
        },
        getClassList() {
            getComodityClassList().then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.classList = resData.data
                }
            })
        },
        search() {
            this.listQuery.pageNum = 0
            this.getList()
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getList()
        },
        filterTag(value, row) {
            return row.usability === value
        },
        // 获取表格选中时的数据
        selectRow(val) {
            this.selectList = val
        },
        add() {
            this.$router.push({ path: '/mall/goods/add' })
        },
        handleEnable(row, type) {
            putAwayIntegralGoods(row.id).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.$message.success('操作成功')
                } else {
                    this.$message.error('操作失败')
                    this.getList()
                }
            })
        },
        deleteRow(row) {
            let data = []
            data.push(row.id)
            this.deleteConfirm(data)
        },
        deleteSelect() {
            let data = []
            for (let item of this.selectList) {
                data.push(item.id)
            }
            this.deleteConfirm(data)
        },
        deleteConfirm(data) {
            this.$confirm('此操作将删除信息, 确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            })
                .then(() => {
                    this.handleDelete(data)
                })
                .catch(() => {
                    // this.$message({
                    //     type: 'info',
                    //     message: '已取消删除'
                    // })
                })
        },
        handleDelete(requestData) {
            let ids = requestData.join(',')
            deleteIntegralGoods(ids).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    this.getList()
                } else {
                    this.$message({
                        message: data.msg,
                        type: 'error'
                    })
                }
            })
        },
        getGoods() {
            this.goodsListLoading = true
            getGoodsList(this.addListQuery).then(res => {
            	const data = res.data
            	if (data.code == '10001') {
            		this.goodsList = data.data.pageData
            		this.addListTotal = data.data.totalCount
            		this.goodsListLoading = false
            	}
            })
        },
        handleCreate() {
            this.addListQuery = {
                goodsCategoryId: '',
                integralMall: '',
                goodsName: '',
                stricSelect: '',
                pageNum: 0,
                pageSize: 10
            }
            this.dialogVisible = true
            this.getGoods()
        },
        addSearch() {
            this.addListQuery.pageNum = 0
            this.getGoods()
        },
        addIntegral() {
            let ids = []
            for(let item of this.selectGoodsList) {
                ids.push(item.id)
            }
            ids = ids.join(',')
            this.submitLoading = true
            addIntegralGoods(ids).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.$message.success('新增成功')
                    this.getList()
                } else {
                    this.$message.error(resData.error)
                }
                this.submitLoading = false
            }).catch(err => {
                this.submitLoading = false
            })
        },
        changeGoodsPage(val) {
            this.addListQuery.pageNum = val - 1
            this.getGoods()
        },
        selectGoodsRow(val) {
            this.selectGoodsList = val
        },
    }
}
</script>
