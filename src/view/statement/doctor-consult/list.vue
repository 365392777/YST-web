<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">医生咨询报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            class="demo-form-inline border"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="姓名">
                <el-input v-model="listQuery.userName"></el-input>
            </el-form-item>
            <el-form-item label="账号">
                <el-input v-model="listQuery.mobilenum"></el-input>
            </el-form-item>
            <el-form-item label="医院">
                <el-input v-model="listQuery.hospital"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    @click="search"
                    type="primary"
                    icon="el-icon-search"
                    native-type="submit"
                >搜索</el-button>
            </el-form-item>
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
                prop="docid"
                label="账号ID"
                width="150"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="mobilenum"
                label="账号"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="username"
                label="姓名"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="deptname"
                label="科室"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="hospital"
                label="医院"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="200"
            >
                <template slot-scope="scope">
                    <router-link :to="'/statement/doctor-consult/detail/' + scope.row.docid ">
                        <el-button type="text">咨询详情</el-button>
                    </router-link>
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
import { getConsultDoctorList } from '@/api/statement'

export default {
    data() {
        return {
            listQuery: {
                userName: '',
                mobilenum: '',
                hospital: '',
                pageNum: 0,
                pageSize: 50
            },
            tableData: [],
            total: 0,
            listLoading: false
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getConsultDoctorList(this.listQuery).then(res => {
                const resData = res.data
                if (resData.code == '10001' || resData.code == 'NL_001') {
                    this.tableData = resData.data.pageData
                    this.total = resData.data.totalCount
                } else {
                    this.tableData = []
                    this.$message.error(resData.error)
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
    }
}
</script>
