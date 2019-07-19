<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
                :to="{ path: '/user/doctor/list' }"
            >医生用户</el-breadcrumb-item>
            <el-breadcrumb-item>咨询评价</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="detail-doctor-info">
            <div class="doctor-info-item">
                姓名：<span v-text="detailData.doctorName"></span>
            </div>
            <div class="doctor-info-item">
                医院：<span v-text="detailData.hospitalName"></span>
            </div>
            <div class="doctor-info-item">
                科室：<span v-text="detailData.department"></span>
            </div>
            <div class="doctor-info-item">
                职称：
                <span v-text="detailData.professionalTitle"></span>
            </div>
        </div>
        <el-form
            :inline="true"
            :model="listQuery"
            class="demo-form-inline border clearfix"
            size="small"
        >
            <el-form-item label="时间">
                <el-date-picker
                    type="date"
                    placeholder="起始时间"
                    v-model="listQuery.startTime"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerStartTime"
                ></el-date-picker>
                <template><span>-</span></template>
                <el-date-picker
                    type="date"
                    placeholder="结束时间"
                    v-model="listQuery.endTime"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerEndTime"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="评分">
                <el-select v-model="listQuery.scoreItem" placeholder="请选择" clearable>
                    <el-option
                        v-for="item in scoreList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="search"
                >查询</el-button>
            </el-form-item>
            <el-form-item class="fr">
                <el-button type="primary">导出</el-button>
            </el-form-item>
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
                prop="createUserName"
                label="姓名"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="userPhone"
                label="账号"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="评价时间"
                min-width="160"
                align="center"
            >
                <template slot-scope="scope">{{ dateTime(scope.row.createTime) }}</template>
            </el-table-column>
            <el-table-column
                label="评价内容"
                align="center"
            >
                <template slot-scope="scope">
                    <p class="ellipsis">{{ scope.row.evaluationContext }}</p>
                </template>
            </el-table-column>
            <el-table-column
                prop="score"
                label="评分"
                align="center"
            >
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleDetail(scope.row)">评价详情</el-button>
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
            title="咨询评价详情"
            :visible.sync="dialogFormVisible"
            center
        >
            <div class="dialog-container">
                <div class="detail-content">
                    <div class="detail-section">
                        <div class="detail-item">
                            姓名：{{ evaluateDate.patientName }}
                        </div>
                        <div class="detail-item">
                            账号：{{ evaluateDate.patientPhone }}
                        </div>
                    </div>
                    <div class="detail-section">
                        <div class="detail-item">
                            评价时间：{{ dateTime(evaluateDate.createTime) }}
                        </div>
                        <div class="detail-item">
                            评分：{{ evaluateDate.score }}分
                        </div>
                    </div>
                    <div class="detail-section">
                        <div class="detail-item-left">
                            评价内容：
                        </div>
                        <div class="detail-item-right">
                            {{ evaluateDate.context }}
                        </div>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getDoctorDetail, getDoctorConsultation, getValuateDetail } from '@/api/user'
import { convertDate } from '@/utils'

export default {
    data() {
        return {
            pickerStartTime: {          
                disabledDate: (time) => {
                    if (this.listQuery.endTime) {
                        let date = new Date(this.listQuery.endTime.replace(/-/g, '/'))
                        return time.getTime() > date || time.getTime() > Date.now()
                    } else {
                        return time.getTime() > Date.now()
                    }
                }
            },
            pickerEndTime: {
                disabledDate: (time) => {
                    let date = null
                    if (this.listQuery.startTime) {
                        date = this.listQuery.startTime.replace(/-/g, '/')
                        date = new Date(date)
                    }
                    return time.getTime() < date || time.getTime() > Date.now()
                }
            },
            dialogFormVisible: false,
            detailData: {
                id: '',
                doctorName: '',
                department: '',
                hospitalName: '',
                professionalTitle: '',
            },
            listQuery: {
                doctorId: '',
                startTime: '',
                endTime: '',
                scoreItem: '',
                score: 0,
                pageNum: 0,
                pageSize: 50,
            },
            scoreList: [
                {
                    value: 1,
                    label: '1'
                },
                {
                    value: 2,
                    label: '2'
                },
                {
                    value: 3,
                    label: '3'
                },
                {
                    value: 4,
                    label: '4'
                },
                {
                    value: 5,
                    label: '5'
                }
            ],
            tableData: [],
            selectList: [],
            listLoading: true,
            submitLoading: false,
            total: 0,
            evaluateDate: [],
            doctorsId: '',
        }
    },
    created() {
        this.doctorsId = this.$route.params && this.$route.params.id
        this.listQuery.doctorId = this.doctorsId
        this.getDoctorDetail(this.doctorsId)
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
        getDoctorDetail(doctorsId) {
            getDoctorDetail(doctorsId).then(res => {
                let data = res.data.data
                this.detailData = {
                    doctorsId: data.id,
                    doctorName: data.doctorName,
                    hospitalName: data.hospitalName,
                    department: data.department,
                    professionalTitle: data.professionalTitle
                }
            })
        },
        getList() {
            this.listLoading = true
            getDoctorConsultation(this.listQuery).then(res => {
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
            if(!this.listQuery.scoreItem){
                this.listQuery.score = 0
            }else{
                this.listQuery.score = this.listQuery.scoreItem
            }
            this.getList();
        },
        selectRow(val) {
            this.selectList = val;
        },
        handleDetail(row) {
            this.getDetail(row.id)
            this.dialogFormVisible = true
        },
        getDetail(valuateId) {
            getValuateDetail(valuateId).then(res => {
                let data = res.data.data
                this.evaluateDate = data
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
.dialog-container {
    .detail-content {
        padding: 0 40px;
        .detail-section {
            display: flex;
            padding: 15px 0;
            .detail-item {
                flex: 1;
            }
            .detail-item-left {
                min-width: 70px;
            }
        }
    }
}
</style>

