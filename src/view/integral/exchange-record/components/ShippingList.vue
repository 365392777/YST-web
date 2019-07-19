<template>
    <div class="shipping-list-container">
        <el-form
            :inline="true"
            :model="listQuery"
            style="width: 100%;"
            class="demo-form-inlin border clearfix"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="商品名称">
                <el-input
                    v-model="listQuery.goodsName"
                    placeholder="请输入商品名称"
                ></el-input>
            </el-form-item>
            <el-form-item label="抽奖时间">
                <el-date-picker
                    class="w200"
                    type="date"
                    placeholder="起始时间"
                    v-model="listQuery.startTime"
                    :picker-options="startOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
                <template><span>-</span></template>
                <el-date-picker
                    class="w200"
                    type="date"
                    placeholder="结束时间"
                    v-model="listQuery.endTime"
                    :picker-options="endOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                    @click="search"
                    type="primary"
                    icon="el-icon-search"
                    native-type="submit"
                >搜索</el-button>
            </el-form-item>
            <div class="fr">
                <el-form-item>
                    <el-button type="primary">导出列表</el-button>
                    <el-button type="primary">导出出库单</el-button>
                </el-form-item>
            </div>
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
                prop="exchangeNum"
                label="兑换号"
                width="150"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="prizeGoodsName"
                label="兑换商品"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="prizeCount"
                label="数量"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="integralCount"
                label="兑换积分"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="兑换时间"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ dateTime(scope.row.exTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="userNum"
                label="用户账号"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-button type="text">详情</el-button>
                    <span class="line"></span>
                    <el-button type="text">打印发货单</el-button>
                    <span class="line"></span>
                    <el-button
                        type="text"
                        @click="deleteRow(scope.row)"
                    >发货</el-button>
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
            title="兑换商品详细信息"
            :visible.sync="dialogDetailVisible"
            center
        >
            <div class="dialog-container">
                <div class="lottery-item">
                    <h3>兑换信息</h3>
                    <el-row
                        class="lottery-content"
                        :gutter="20"
                    >
                        <el-col :span="8">
                            兑换号：2002402315043015031
                        </el-col>
                        <el-col :span="8">
                            兑换时间：2018-01-01 13：18：25
                        </el-col>
                        <el-col :span="8">
                            用户账号：130xxxxxxxx
                        </el-col>
                    </el-row>
                </div>
                <div class="lottery-item">
                    <h3>收货信息</h3>
                    <el-row
                        class="lottery-content"
                        :gutter="20"
                    >
                        <el-col :span="12">
                            收货人：xxxxx
                        </el-col>
                        <el-col :span="12">
                            联系方式：130xxxxxxxx
                        </el-col>
                    </el-row>
                    <el-row
                        class="lottery-content"
                        :gutter="20"
                    >
                        <el-col :span="12">
                            收货地址：广东省 广州市 越秀区 中山二路 102号
                        </el-col>
                        <el-col :span="12">
                            邮编：510000
                        </el-col>
                    </el-row>
                </div>
                <div class="lottery-item">
                    <h3>商品信息</h3>
                    <el-row
                        class="lottery-content"
                        :gutter="20"
                    >
                        <el-col :span="8">
                            抽奖号：2002402315043015031
                        </el-col>
                        <el-col :span="8">
                            抽奖时间：2018-01-01 13：18：25
                        </el-col>
                        <el-col :span="8">
                            抽奖账号：130xxxxxxxx
                        </el-col>
                    </el-row>
                </div>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    size="small"
                    @click="dialogDetailVisible = false"
                >取 消</el-button>
                <el-button
                    size="small"
                    type="primary"
                >打印发货单</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="兑换商品详细信息"
            :visible.sync="dialogShippedVisible"
            center
        >
            <div class="dialog-container">
                <div class="lottery-item no-padding-bottom">
                    <el-form
                        size="small"
                        label-position="right"
                        label-width="80px"
                    >
                        <el-row
                            class="lottery-content no-padding-top"
                            :gutter="20"
                        >
                            <el-col :span="12">
                                <el-form-item label="物流公司">
                                    <el-select>
                                        <el-option>1</el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="快递单号">
                                    <el-input></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
                <div class="lottery-item">
                    <h3>兑换信息</h3>
                    <el-row
                        class="lottery-content"
                        :gutter="20"
                    >
                        <el-col :span="8">
                            兑换号：2002402315043015031
                        </el-col>
                        <el-col :span="8">
                            兑换时间：2018-01-01 13：18：25
                        </el-col>
                        <el-col :span="8">
                            用户账号：130xxxxxxxx
                        </el-col>
                    </el-row>
                </div>
                <div class="lottery-item">
                    <h3>收货信息</h3>
                    <el-row
                        class="lottery-content"
                        :gutter="20"
                    >
                        <el-col :span="12">
                            收货人：xxxxx
                        </el-col>
                        <el-col :span="12">
                            联系方式：130xxxxxxxx
                        </el-col>
                    </el-row>
                    <el-row
                        class="lottery-content"
                        :gutter="20"
                    >
                        <el-col :span="12">
                            收货地址：广东省 广州市 越秀区 中山二路 102号
                        </el-col>
                        <el-col :span="12">
                            邮编：510000
                        </el-col>
                    </el-row>
                </div>
                <div class="lottery-item">
                    <h3>商品信息</h3>
                    <el-row
                        class="lottery-content"
                        :gutter="20"
                    >
                        <el-col :span="8">
                            抽奖号：2002402315043015031
                        </el-col>
                        <el-col :span="8">
                            抽奖时间：2018-01-01 13：18：25
                        </el-col>
                        <el-col :span="8">
                            抽奖账号：130xxxxxxxx
                        </el-col>
                    </el-row>
                </div>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    size="small"
                    @click="dialogDetailVisible = false"
                >取 消</el-button>
                <el-button
                    size="small"
                    type="primary"
                >发货</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getExchangeList, getExchangeDetail } from '@/api/integral'
import { convertDate } from '@/utils'

export default {
    data() {
        return {
            listQuery: {
                goodsName: '',
                startTime: '',
                endTime: '',
                sendOutStatus: 0,
                sendOutStartTime: '',
                sendOutEndTime: '',
                pageNum: 0,
                pageSize: 50,
            },
            tableData: [],
            total: 0,
            listLoading: true,
            selectList: [],
            submitLoading: false,
            dialogDetailVisible: false,
            dialogShippedVisible: false,
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
            getExchangeList(this.listQuery).then(res => {
                const data = res.data
                if (data.code == '10001') {
                    this.tableData = data.data.pageData
                    this.total = data.data.totalCount
                }
                this.listLoading = false
            })
        },
        getDetail(id) {
            getExchangeDetail(id).then(res => {
                const data = res.data
                this.formData = {
                    id,
                    dataRemoveType: 0,
                    brandName: data.brandName
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
        selectRow(value) {
            this.selectList = value
        },
        handleDetail() {
            this.dialogDetailVisible = true
        },
        handleShipped() {
            this.dialogShippedVisible = true
        }
    }
}
</script>

<style lang="scss" scoped>
.dialog-container {
    border: 1px solid #dadada;
    padding: 20px;
    border-radius: 4px;
}
.lottery-item {
    padding-bottom: 20px;
    padding-top: 20px;
    border-bottom: 1px solid #dadada;
    &.no-padding-bottom {
        padding-bottom: 0;
    }
    &:first-child {
        padding-top: 0;
    }
    &:last-child {
        border-bottom: 0;
    }
    .lottery-content {
        padding-left: 20px;
        padding-top: 20px;
        &.no-padding-top {
            padding-top: 0;
            padding-bottom: 0;
        }
    }
}
</style>
