<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">评论管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            size="small"
            class="demo-form-inline border"
            @submit.native.prevent
        >
            <el-form-item>
                <el-input
                    v-model="listQuery.keyWord"
                    placeholder="输入关键字"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="search"
                    icon="el-icon-search"
                    native-type="submit"
                >搜索</el-button>
            </el-form-item>
            <div class="fr">
                <el-form-item>
                    <el-button
                        type="danger"
                        @click="deleteSelect"
                        :disabled="selectList.length <= 0"
                    >删除</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="tableData"
            max-height="600"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="listLoading"
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
                label="文章评论 ID"
                width="150"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="head"
                label="标题"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="comment"
                label="评论内容"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="createUserName"
                label="评论用户账户号"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="展示"
                align="center"
            >
                <template slot-scope="scope">
                    <el-checkbox
                        :true-label="1"
                        :false-label="0"
                        v-model="scope.row.status"
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
    </div>
</template>

<script>
import { getCommentList, enableComment, deleteComment } from '@/api/popular-science'

export default {
    data() {
        return {
            listQuery: {
                keyWord: '',
                pageNum: 0,
                pageSize: 50
            },
            total: 0,
            tableData: [],
            selectList: [],
            listLoading: false,
            submitLoading: false
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getCommentList(this.listQuery).then(res => {
                const resData = res.data
                this.tableData = resData.data.pageData
                this.total = resData.data.totalCount
                this.listLoading = false
            })
        },
        search() {
            this.listQuery.pageNum = 0
            this.getList()
        },
        handleEnable(row) {
            enableComment(row.id, row.status).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.$message.success(resData.error)
                } else {
                    this.$message.error(resData.error)
                    this.getList()
                }
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getList()
        },
        selectRow(val) {
            this.selectList = val
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
            }).then(() => {
                this.handleDelete(data)
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // })
            })
        },
        handleDelete(data) {
            deleteComment(data).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.$message.success('删除成功')
                    this.getList()
                } else {
                    this.$message.error('删除失败')
                }
            })
        }
    }
}
</script>
