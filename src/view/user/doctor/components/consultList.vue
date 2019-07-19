<template>
    <div class="audit-container">
        <el-form
            :inline="true"
            :model="listQuery"
            class="demo-form-inline border"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="账号ID">
                <el-input v-model="listQuery.id" maxlength="10" v-num-digit="listQuery.id" data-max-value="2147483647"></el-input>
            </el-form-item>
            <el-form-item label="姓名">
                <el-input v-model="listQuery.userName"></el-input>
            </el-form-item>
            <el-form-item label="账号">
                <el-input v-model="listQuery.mobilenum"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
            </el-form-item>
        </el-form>
        <!-- <el-row type="flex" justify="end" :gutter="15">
			<el-col :span="24" class="align-right">
				<el-button type="primary" size="small">批量审核</el-button>
			</el-col>
		</el-row> -->
        <el-table
            :inline="true"
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
                width="40"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="id"
                align="center"
                label="账号ID"
            >
            </el-table-column>
            <el-table-column
                prop="mobileNum"
                align="center"
                min-width="120"
                label="账号"
            >
            </el-table-column>
            <el-table-column
                prop="doctorName"
                align="center"
                label="姓名"
            >
            </el-table-column>
            <el-table-column
                prop="hospitalName"
                align="center"
                label="医院"
            >
            </el-table-column>
            <el-table-column
                prop="department"
                align="center"
                label="科室"
            >
            </el-table-column>
            <el-table-column
                prop="professionalTitle"
                align="center"
                label="职称"
            >
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
            >
                <template slot-scope="scope" >
                    <router-link :to="'/user/doctor/consult/' + scope.row.id">
                        <el-button type="text">咨询评价</el-button>
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
import { getDoctorList, getDoctorDetail } from '@/api/user'

// const audit = {
//     id: '',
//     userName: '',
//     mobilenum: '',
//     doctortype: 0,
//     pageNum: 0,
//     pageSize: 50,
// }

// const audited ={
//     id: '',
//     userName: '',
//     mobilenum: '',
//     hospitalName: '',
//     department: '',
//     professionalTitle: '',
//     doctortype: 1,
//     pageNum: 0,
//     pageSize: 50,
// }
export default {
    data() {
        return {
            listQuery: {
                id: '',
                userName: '',
                mobilenum: '',
                // doctorType: 1,
                listType: 2,
                // doctorLoginAllow: 1,
                pageNum: 0,
                pageSize: 50,
            },
            tableData: [],
            selectList: [],
            listLoading: true,
            submitLoading: false,
            total: 0,
        }
    },
    created() {
        this.getList();
    },
    methods: {
        selectRow(value) {
            this.selectList = val;
        },
        getList() {
            this.listLoading = true
            getDoctorList(this.listQuery).then(res => {
                const data = res.data
                this.tableData = data.data.pageData
                this.total = data.data.totalCount
                this.listLoading = false
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1;
            this.getList();
        },
        search() {
            this.listQuery.pageNum = 0;
            this.getList();
        },
    }
}
</script>

