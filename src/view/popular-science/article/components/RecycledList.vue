<template>
    <div class="recycled-container">
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
                        type="primary"
                        @click="retractDrafts"
                        :disabled="selectList.length <= 0"
                    >移回草稿箱</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="danger"
                        @click="deleteSelect"
                        :disabled="selectList.length <= 0"
                    >彻底删除</el-button>
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
                label="文章 ID"
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
                prop="category"
                label="分类"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="author"
                label="作者"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="publisher"
                label="发布者"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="推荐"
                align="center"
            >
                <template slot-scope="scope">
                    <el-checkbox
                        :true-label="1"
                        :false-label="0"
                        v-model="scope.row.recommend"
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
                    <!-- <el-button
                        type="text"
                        @click="handleUpdate(scope.row)"
                    >编辑</el-button>
                    <span class="line"></span> -->
                    <el-button
                        type="text"
                        class="red"
                        @click="deleteRow(scope.row)"
                    >彻底删除</el-button>
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
    getArticleList,
    updateArtStatus,
    udpateRecommend
} from '@/api/popular-science'

export default {
    data() {
        return {
            listQuery: {
                keyWord: '',
                status: 2,
                pageNum: 0,
                pageSize: 50
            },
            total: 0,
            tableData: [],
            selectList: [],
            listLoading: false,
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getArticleList(this.listQuery).then(res => {
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
            udpateRecommend(row.id, row.recommend).then(res => {
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
        retractDrafts() {
            let data = []
            for (let item of this.selectList) {
                data.push(item.id)
            }

            updateArtStatus(data, 0).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.$message.success('操作成功')
                } else {
                    this.$message.error('操作失败')
                }
                this.getList()
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
            updateArtStatus(data, 3).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.$message.success('删除成功')
                } else {
                    this.$message.error('删除失败')
                }
                this.getList()
            })
        },
    }
}
</script>
