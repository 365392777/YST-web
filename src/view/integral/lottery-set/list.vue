<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">抽奖设置</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            size="small"
            class="demo-form-inline border clearfix"
            @submit.native.prevent
        >
            <el-form-item label="抽奖名称">
                <el-input
                    v-model="listQuery.lotteryName"
                    placeholder="输入抽奖名称"
                ></el-input>
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
                    <router-link to="/integral/lottery-set/add">
                        <el-button type="primary">新增</el-button>
                    </router-link>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="danger"
                        @click="deleteSelect"
                    >删除</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :data="tableData"
            max-height="600"
            stripe
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
                prop="lotteryId"
                label="抽奖 ID"
                width="150"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="lotteryName"
                label="抽奖名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="开启抽奖"
                align="center"
            >
                <template slot-scope="scope">
                    <el-checkbox
                        v-model="scope.row.lotteryStatus"
                        :true-label="1"
                        :false-label="0"
                        @change="handleEnable(scope.row)"
                    ></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="scope">
                    <router-link :to="'/integral/lottery-set/edit/' + scope.row.lotteryId">
                        <el-button type="text">编辑</el-button>
                    </router-link>
                    <span class="line"></span>
                    <el-button
                        type="text"
                        @click="deleteRow(scope.row)"
                        class="red"
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
    </div>
</template>

<script>
import {
    getLotterySetList,
    enableLotterySet,
    deleteLotterySet
} from '@/api/integral'

export default {
    data() {
        return {
            listQuery: {
                lotteryName: '',
                pageNum: 0,
                pageSize: 50
            },
            tableData: [],
            total: 0,
            listLoading: false,
            selectList: [],
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getLotterySetList(this.listQuery).then(res => {
                const data = res.data
                this.tableData = data.data.pageData
                this.total = data.data.totalCount
                this.listLoading = false
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
        selectRow(val) {
            this.selectList = val
        },
        // 开启抽奖
        handleEnable(row) {
            enableLotterySet(row.lotteryId).then(res => {
                const resData = res.data
                console.log(resData,'开启抽奖')
                if (resData.code == '10001') {
                    this.$message.success('操作成功')
                } else {
                    this.$message.error(res.error)
                    this.getList()
                }
            }).catch(err => {
                this.getList()
            })
        },
        deleteRow(row) {
            let data = []
            data.push(row.lotteryId)
            this.deleteConfirm(data)
        },
        deleteSelect() {
            let data = []
            for (let item of this.selectList) {
                data.push(item.lotteryId)
            }
            this.deleteConfirm(data)
        },
        deleteConfirm(data) {
            data = data.join(',')
            this.$confirm('此操作将删除信息, 确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                this.handleDelete(data)
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // })
            })
        },
        handleDelete(requestData) {
            deleteLotterySet(requestData).then(res => {
                const data = res.data
                if(data.code == '10001') {
                    this.$message({
                        message: '删除成功',
                        type: 'success',
                    })
                    this.getList()
                } else {
                    this.$message({
                        message: data.error,
                        type: 'error',
                    })
                }
            })
        },
    }
}
</script>
