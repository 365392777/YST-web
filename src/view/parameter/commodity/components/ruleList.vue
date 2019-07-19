<template>
    <div class="classify-container">
        <el-form
            :inline="true"
            :model="listQuery"
            style="width: 100%;"
            class="demo-form-inlin border clearfix"
            size="small"
            @submit.native.prevent
        >
            <el-form-item>
                <el-input v-model="listQuery.name" placeholder="输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search" native-type="submit">搜索</el-button>
            </el-form-item>
            <div class="fr">
                <el-form-item>
                    <router-link to="/parameter/commodity/add">
                        <el-button type="primary">新增</el-button>
                    </router-link>
                    <el-button type="danger" class="ml10" :disabled="selectList.length <= 0" @click="deleteSelect">删除</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-table
            :data="tableData"
            v-loading="listLoading"
            max-height="600"
            stripe
            tooltip-effect="dark"
            style="width: 100%;"
            @selection-change="selectRow"
        >
            <el-table-column
                type="selection"
                width="40"
                align="center"
            >
            </el-table-column>
            <el-table-column label="运费模版 ID" prop="id" align="center">
            </el-table-column>
            <el-table-column label="运费模版名称" prop="templateName" align="center">
            </el-table-column>
            <el-table-column label="计价方式" prop="valuationMethod" align="center">
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <router-link :to="'/parameter/commodity/edit/' + scope.row.id">
                        <el-button type="text">编辑</el-button>
                    </router-link>
                    <span class="line"></span>
                    <el-button type="text" class="red" @click="deleteRow(scope.row)">删除</el-button>
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
import { getRuleList, deleteRule } from '@/api/commodity'

export default {
    data() {
        return {
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                create: '新增供应商',
                update: '编辑供应商',
            },
            listQuery: {
                name: '',
                pageNum: 0,
                pageSize: 50,
            },
            tableData: [],
            listLoading: true,
            total: 0,
            selectList: [],
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getRuleList(this.listQuery).then(res => {
                const data = res.data
                if (data.code == '10001') {
                    this.tableData = data.data.pageData
                    this.total = data.data.totalCount
                }
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
        selectRow(value) {
            this.selectList = value
        },
        deleteSelect() {
            let data = []
            for (let item of this.selectList) {
                data.push(item.id)
            }
            this.deleteConfirm(data)
        },
        deleteRow(row) {
            let data = [row.id]
            this.deleteConfirm(data)
        },
        deleteConfirm(data) {
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
        handleDelete(ids) {
            deleteRule(ids).then(res => {
                const data = res.data
                if(data.code == '10001') {
                    this.$message({
                        message: data.error,
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
