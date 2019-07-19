<template>
    <div class="lottery-set-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
                :to="{ path: '/integral/lottery-set/list' }"
            >抽奖设置</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadcrumbMap[isEdit]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="formData"
            style="width: 100%;"
            class="demo-form-inlin border clearfix"
            size="small"
            @submit.native.prevent
        >
            <el-row>
                <el-col :span="9">
                    <el-form-item label="抽奖名称">
                        <el-input placeholder="输入抽奖名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col
                    :span="9"
                    :offset="1"
                >
                    <el-form-item label="消耗积分">
                        <el-input placeholder="输入消耗积分"></el-input> 积分/次
                    </el-form-item>
                </el-col>
                <el-col
                    :span="4"
                    :offset="1"
                >
                    <el-button
                        type="primary"
                        @click="handleCreate"
                    >新增商品</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="tableData"
            max-height="600"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
        >
            <el-table-column
                label="序号"
                type="index"
                width="80"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="goosName"
                label="奖品"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="数量"
                align="center"
            >
                <template slot-scope="scope">
                    <el-input
                        v-model.number="scope.row.number"
                        v-num-digit="scope.$index"
                        data-form-model="tableData,number"
                        data-nonzero
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column
                label="中奖概率"
                align="center"
            >
                <template slot-scope="scope">
                    <el-input
                        v-model.number="scope.row.probability"
                        v-num-digit="scope.$index"
                        data-form-model="tableData,probability"
                        data-dotrange="{0,8}"
                        data-max-value="1"
                    ></el-input>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                show-overflow-tooltip
            >
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        class="red"
                        @click="handleDelete(scope.$index)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="新增奖品"
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
                            @click="addLottery"
                            :disabled="selectGoodsList.length <= 0"
                        >保存</el-button>
                    </el-form-item>
                </el-form>
                <el-table
                    ref="multipleTable"
                    :data="goodsList"
                    max-height="400"
                    v-loading="goodsListLoading"
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
                        label="商品 ID"
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
import { getLotterySetDetail, saveLotterySet } from '@/api/integral'
import { getGoodsList } from '@/api/mall'
import { getComodityClassList } from '@/api/util'

const thankInfo = {
    id: '/',
    goosName: '谢谢参与',
    goodsClass: '/',
    goodsCount: '/'
}
const integralInfo = {
    id: '/',
    goosName: '积分',
    goodsClass: '/',
    goodsCount: '/'
}

export default {
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {
                name: '',
                brand: '',
                note: '',
                content: '',
                dataRemoveType: 0
            },
            addListQuery: {
                goodsCategoryId: '',
                integralMall: '',
                goodsName: '',
                stricSelect: '',
                putAwayStatus: '',
                pageNum: 0,
                pageSize: 15
            },
            breadcrumbMap: {
                false: '新增抽奖',
                true: '编辑抽奖'
            },
            submitLoading: false,
            tableData: [],
            classList: [],
            total: 0,
            listLoading: false,
            goodsListLoading: false,
            addListTotal: 0,
            dialogVisible: false,
            goodsList: [],
            selectGoodsList: []
        }
    },
    created() {
        this.getClassList()
        if (this.isEdit) {
            let id = this.$route.params && this.$route.params.id
            this.getDetail(id)
        }
    },
    methods: {
        getDetail(id) {
            getLotterySetDetail(id).then(res => {})
        },
        getClassList() {
            getComodityClassList().then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.classList = resData.data
                }
            })
        },
        getGoods() {
            this.goodsListLoading = true
            getGoodsList(this.addListQuery).then(res => {
                const data = res.data
                if (data.code == '10001') {
                    this.goodsList = data.data.pageData

                    this.goodsList.unshift(thankInfo)
                    this.goodsList.unshift(integralInfo)
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
                putAwayStatus: '',
                pageNum: 0,
                pageSize: 15
            }
            this.dialogVisible = true
            this.getGoods()
        },
        addSearch() {
            this.addListQuery.pageNum = 0
            this.getGoods()
        },
        addLottery() {
            if (this.tableData.length + this.selectGoodsList.length > 8) {
                this.$message.error('奖品不能超过8个')
                return
            }
            for (let item of this.selectGoodsList) {
                let data = Object.assign({}, item)
                data.number = ''
                data.probability = ''
                this.tableData.push(data)
            }
            this.dialogVisible = false
        },
        changeGoodsPage(val) {
            this.addListQuery.pageNum = val - 1
            this.getGoods()
        },
        selectGoodsRow(val) {
            this.selectGoodsList = val
        },
        handleDelete(index) {
            this.tableData.splice(index, 1)
        },
        validData() {
            let result = {
                isValid: true,
                message: ''
            }
            let num = 0

            for (let item of this.tableData) {
                if (item.number == '' || item.probability == '') {
                    result.isValid = false
                    result.message = '请输入所有奖品的数量和中奖概率'
                    break
                }
            }

            if (result.isValid && num != 1) {
                result.isValid = false
                result.message = '奖品的中奖概率全部加起来需要等于1'
            }

            return result
        },
        handleSave() {
            let errInfo = this.validData()
            if (!errInfo.isValid) {
                this.$message.error(errInfo.message)
                return
            }

            saveLotterySet(this.tableData).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.$message.success('保存成功')
                    this.$router.replace('/integral/lottery-set/list')
                } else {
                    this.$message.error(resData.error)
                }
            })
        }
    }
}
</script>
