<template>
    <div class="shipped-list-container">
        <el-form
            :inline="true"
            :model="listQuery"
            style="width: 100%;"
            class="demo-form-inlin border clearfix"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="抽奖结果">
                <el-select
                    v-model="listQuery.goodsName"
                    placeholder="请选择抽奖结果"
                    clearable
                    class="w200"
                >
                    <el-option label="积分" value="积分"></el-option>
                    <el-option label="谢谢参与" value="谢谢参与"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="抽奖时间">
                <el-date-picker
                    class="w200"
                    type="date"
                    placeholder="起始时间"
                    v-model="listQuery.lotteryStartTime"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
                <template><span>-</span></template>
                <el-date-picker
                    class="w200"
                    type="date"
                    placeholder="结束时间"
                    v-model="listQuery.lotteryEndTime"
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
                    <el-button
                        type="primary"
                        @click="handleDetail"
                        :disabled="selectList.length <= 0"
                    >导出</el-button>
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
                prop="lotteryRecordNum"
                label="抽奖号"
                width="150"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="goodsName"
                label="中奖商品"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="lotteryRecordNum"
                label="数量"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="抽奖时间"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ dateTime(scope.row.lotteryTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="lotteryUserNum"
                label="抽奖账号"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="handleDetail(scope.row)"
                    >详情</el-button>
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
            title="抽奖 - 详情"
            :visible.sync="dialogShippedVisible"
            center
        >
            <div class="dialog-container">
                <div class="lottery-item">
                    <h3>抽奖信息</h3>
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
                <div class="lottery-item">
                    <h3>奖品信息</h3>
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
    </div>
</template>

<script>
import { getLotteryRecordList, getLotteryRecordDetail } from '@/api/integral'
import { convertDate } from '@/utils'

export default {
    data() {
        return {
            listQuery: {
                goodsName: '',
                lotteryStartTime: '',
                lotteryEndTime: '',
                sendOutStartTime: '',
                sendOutEndTime: '',
                sendOutStatus: 2,
                pageNum: 0,
                pageSize: 50,
            },
            tableData: [],
            total: 0,
            listLoading: true,
            selectList: [],
            submitLoading: false,
            dialogDetailVisible: false,
            dialogShippedVisible: false
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
            getLotteryRecordList(this.listQuery).then(res => {
                const data = res.data
                if (data.code == '10001') {
                    this.tableData = data.data.pageData
                    this.total = data.data.totalCount
                }
                this.listLoading = false
            })
        },
        getDetail(id) {
            getLotteryRecordDetail(id).then(res => {
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
