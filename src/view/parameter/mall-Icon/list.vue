<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">商城图标</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table
            ref="multipleTable"
            :data="tableData"
            v-loading="listLoading"
            max-height="600"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
        >
            <el-table-column
                prop="id"
                label="编号"
                width="80"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="type"
                label="类型"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="图标"
                align="center"
            >
                <template slot-scope="scope">
                    <img :src="imgBase(scope.row.iconId)" class="image-preview">
                </template>
            </el-table-column>
            <el-table-column
                prop="sort"
                label="排序"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="scope">
                    <router-link :to="'/parameter/mall-icon/edit/' + scope.row.id ">
                        <el-button type="text">编辑</el-button>
                    </router-link>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<style lang="scss" scoped>
.page-container {
    padding: 15px 30px;
    .el-col-4 button {
        float: right;
    }
    .el-table {
        margin: 15px 0;
    }
    .el-table thead th,
    .el-table thead tr {
        background-color: #e4e7ed;
        color: #333;
    }
}
</style>

<script>
import { getMallIconList } from '@/api/parameter'

export default {
    data() {
        return {
            tableData: [],
            total: 0,
            listLoading: true,
        }
    },
    created() {
        this.getList()
    },
    computed: {
        imgBase() {
            return function(image) {
                return 'data:image/*;base64,' + image
            }
        },
    },
    methods: {
        getList() {
            this.listLoading = true
            getMallIconList(this.listQuery).then(res => {
                const data = res.data
                this.tableData = data
                this.listLoading = false
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getList()
        }
    }
}
</script>

<style lang="scss" scoped>
.image-preview {
    width: 50px;
    height: 50px;
    border-radius: 4px;
}
</style>
