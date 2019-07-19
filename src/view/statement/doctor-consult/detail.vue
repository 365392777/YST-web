<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
                :to="{ path: '/statement/doctor-consult/list' }"
            >医生咨询报表</el-breadcrumb-item>
            <el-breadcrumb-item>咨询详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="detail-doctor-info">
            <div class="doctor-info-item">
                账号ID：<span v-text="detailData.id"></span>
            </div>
            <div class="doctor-info-item">
                账号：<span v-text="detailData.mobilenum"></span>
            </div>
            <div class="doctor-info-item">
                姓名：<span v-text="detailData.name"></span>
            </div>
            <div class="doctor-info-item">
                科室：<span v-text="detailData.department"></span>
            </div>
            <div class="doctor-info-item">
                医院：<span v-text="detailData.hospital"></span>
            </div>
        </div>
        <el-form
            :inline="true"
            :model="listQuery"
            class="demo-form-inline border clearfix"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="时间">
                <el-date-picker
                    type="date"
                    placeholder="起始时间"
                    v-model="listQuery.startTime"
                    :picker-options="startOptions"
					value-format="yyyy-MM-dd"
                ></el-date-picker>
                <template><span>-</span></template>
                <el-date-picker
                    type="date"
                    placeholder="结束时间"
                    v-model="listQuery.endTime"
                    :picker-options="endOptions"
					value-format="yyyy-MM-dd"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="search"
                    native-type="submit"
                >查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
                <el-button
                    type="primary"
                    :disabled="selectList.length <= 0"
                    @click="handleExport"
                >导出</el-button>
            </el-form-item>
        </el-form>
        <el-table
            ref="multipleTable"
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
                prop="createtime"
                label="咨询时间"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="patientid"
                label="用户 ID"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="msgcount"
                label="咨询时长（min）"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="isfsmp"
                label="FSMP使用建议"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="isbuy"
                label="用户购买"
                align="center"
            >
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
    getSalesDoctorDetail,
    getConsultDoctorDetialList,
    exportDoctorConsultDetailList
} from '@/api/statement'
import { exportFile } from '@/utils'

export default {
    data() {
        return {
            detailData: {},
            listQuery: {
                doctorId: 0,
                startTime: '',
                endTime: '',
                pageNum: 0,
                pageSize: 50,
            },
            tableData: [],
            total: 0,
            listLoading: false,
            selectList: [],
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
        this.listQuery.doctorId = this.$route.params && this.$route.params.id
        this.getDetail()
        this.getList()
    },
    methods: {
        getDetail() {
            getSalesDoctorDetail(this.listQuery.doctorId).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.detailData = resData.data
                } else {
                    this.$message.error(resData.error)
                }
            })
        },
        getList() {
            this.listLoading = true
            getConsultDoctorDetialList(this.listQuery).then(res => {
                const resData = res.data
                if (resData.code == '10001' || resData.code == 'NL_001') {
                    this.tableData = resData.data.pageData
                    this.total = resData.data.totalCount
                } else {
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
        selectRow(value) {
            this.selectList = value
        },
        handleExport() {
            let ids = []
            for (let item of this.selectList) {
                ids.push(item.msgid)
            }
            exportDoctorConsultDetailList(this.listQuery.doctorId, ids).then(res => {
                const resData = res.data
                let fileName = `${this.detailData.name}医生咨询报表.xls`
                exportFile(resData, fileName)
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.detail-doctor-info {
    border: 1px solid #ccc;
    padding: 15px;
    margin: 20px 0;
    display: flex;
    .doctor-info-item {
        flex: 1;
    }
}
</style>
