<template>
    <div class="page-container">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
            <el-breadcrumb-item class="bold" :to="{ path: '/mall/coupons/list' }">优惠券管理</el-breadcrumb-item>
            <el-breadcrumb-item>优惠券详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :rules="rules" ref="formDetail" size="small" label-width="180px" class="demo-form border flex">
            <el-col :span="11" class="flex-item">
                <el-form-item label="优惠券名称：" prop="couponName">
                    <template>{{ formDetail.couponName }}</template>
                </el-form-item>
                <el-form-item label="面额（元）：" prop="discountMoney">
                    <template>{{ formDetail.discountMoney }}</template>
                </el-form-item>
                <el-form-item label="发放开始日期：" prop="startDateIssuan">
                    <template>{{ dateTime(formDetail.startDateIssuan) }}</template>
                </el-form-item>
                <el-form-item label="使用开始日期：" prop="startDateUse">
                    <template>{{ dateTime(formDetail.startDateUse) }}</template>
                </el-form-item>
                <el-form-item label="发放数量：" prop="issuanCount">
                    <template>{{ formDetail.issuanCount }}</template>
                </el-form-item>
                <!-- <el-form-item label="可使用商品：" prop="scope">
                    <template>{{ formDetail.scope }}</template>
                </el-form-item> -->
            </el-col>
            <el-col :span="12" :offset="1">
                <el-form-item label="优惠券类型：" prop="couponStatus">
                    <template>
                        <div v-if="formDetail.couponStatus == 0">待发放</div>
                        <div v-else-if="formDetail.couponStatus == 1">已发放</div>
                        <div v-else>已过期</div>
                    </template>
                </el-form-item>
                <el-form-item label="使用需满金额（元）：" prop="fullMoney">
                    <template>{{ formDetail.fullMoney }}</template>
                </el-form-item>
                <el-form-item label="发放截止日期：" prop="endDateIssuan">
                    <template>{{ dateTime(formDetail.endDateIssuan) }}</template>
                </el-form-item>
                <el-form-item label="使用截止日期：" prop="endDateUse">
                    <template>{{ dateTime(formDetail.endDateUse) }}</template>
                </el-form-item>
                <el-form-item label="每账号可领取数量：" prop="perAcceptCount">
                    <template>{{ formDetail.perAcceptCount }}</template>
                </el-form-item>
                <!-- <el-form-item label="可使用商品类别：" prop="goodsCategory" v-if="this.formDetail.scope == 3">
                    <template>
			    		<span v-for="item in tCommodityClassList">
					    	{{ item.commodityName }}
					    </span>
			    	</template>
                </el-form-item>
                <el-form-item label="医院：" prop="hospital" v-if="this.formDetail.scope == 4">
                    <template>
                        <span v-for="item in hospitalList">
						    {{ item.hospital }}
						</span>
                    </template>
                </el-form-item> -->
            </el-col>
        </el-form>
        <div class="step">
            <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline border" @submit.native.prevent>
                <el-form-item label="用户ID：">
                    <el-input v-model="listQuery.patientId" placeholder="输入优惠券ID"></el-input>
                </el-form-item>
                <el-form-item label="用户账号：">
                    <el-input v-model="listQuery.loginaccount" placeholder="输入用户账号"></el-input>
                </el-form-item>
                <el-form-item label="领取时间：">
                    <el-date-picker type="date" placeholder="选择起始时间" v-model="listQuery.startTime" value-format="yyyy-MM-dd" :picker-options="pickerStartTime"></el-date-picker>
                    <template><span>-</span></template>
                    <el-date-picker type="date" placeholder="选择结束时间" v-model="listQuery.endTime" value-format="yyyy-MM-dd" :picker-options="pickerEndTime"></el-date-picker>
                </el-form-item>
                <el-form-item label="是否使用：">
                    <el-select v-model="listQuery.status" clearable>
                        <el-option label="全部" :value="-1"></el-option>
                        <el-option label="已使用" :value="1"></el-option>
                        <el-option label="未使用" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" max-height="500" stripe tooltip-effect="dark" style="width: 100%" @selection-change="selectRow">
                <el-table-column prop="patientId" label="用户ID" align="center">
                </el-table-column>
                <el-table-column prop="loginaccount" label="用户账号" align="center">
                </el-table-column>
                <el-table-column label="领取/发放时间" min-width="160" align="center">
                    <template slot-scope="scope">{{ dateTime(scope.row.receivedDate) }}</template>
                </el-table-column>
                <el-table-column label="使用时间" min-width="160" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 0 || scope.row.status == 2 ">未使用</div>
                        <div v-else>{{ dateTime(scope.row.usedDate) }}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
<style lang="scss" scoped>
.align-right {
    text-align: right;
    margin-bottom: 15px;
}

.flex {
    align-items: center;
}

.demo-form {
    .el-form-item {
        margin-bottom: 20px;

        .el-date-editor {
            width: 100%;
        }

        i {
            font-size: 24px;
            margin-left: 6px;
            cursor: pointer;
        }

        .flex+.flex {
            margin-top: 10px;
        }
    }
}

.step {
    padding-top: 15px;
}

</style>
<script>
import { getCouponDetail, getRecievedCoupon } from '@/api/mall'
import { convertDate } from '@/utils'

export default {
    data() {
        return {
            pickerStartTime: {          
                disabledDate: (time) => {
                    if (this.listQuery.endTime != '') {
                        return time.getTime() > new Date(this.listQuery.endTime).getTime()
                    }
                }
            },
            pickerEndTime: {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.listQuery.startTime).getTime()
                }
            },
            formDetail: {
                id: '',
                couponName: '',
                discountMoney: '',
                startDateIssuan: '',
                startDateUse: '',
                issuanCount: '',
                couponStatus: '',
                fullMoney: '',
                endDateIssuan: '',
                endDateUse: '',
                perAcceptCount: '',
            },
            tCommodityClassList: [
            	{ commodityName: '' }
            ],
            hospitalList: [
                { hospital: '' }
            ],
            rules: {
                couponName: [
                    { required: true }
                ],
                discountMoney: [
                    { required: true }
                ],
                startDateIssuan: [
                    { required: true }
                ],
                startDateUse: [
                    { required: true }
                ],
                issuanCount: [
                    { required: true }
                ],
                scope: [
                    { required: true }
                ],
                couponStatus: [
                    { required: true }
                ],
                fullMoney: [
                    { required: true }
                ],
                endDateIssuan: [
                    { required: true }
                ],
                endDateUse: [
                    { required: true }
                ],
                perAcceptCount: [
                    { required: true }
                ],
                goodsCategory: [
                    { required: true }
                ],
                hospital: [
                    { required: true }
                ],
            },
            listQuery: {
                couponId: '',
                patientId: '',
                loginaccount: '',
                startTime: '',
                endTime: '',
                status: '',
                pageNum: 0,
                pageSize: 50,
            },
            tableData: [],
            selectList: [],
            listLoading: true,
            submitLoading: false,
            total: 0,
            id: ''
        }
    },
    created() {
        let id = this.$route.params && this.$route.params.id;
        this.getDetail(id);
        this.getCouponList();
    },
    computed: {
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        }
    },
    methods: {
        // 获取表格选中时的数据
        selectRow(val) {
            this.selectList = val
        },
        getDetail(id) {
            getCouponDetail(id).then(res => {
                let data = res.data.data
                this.formDetail = data.resultMap
            })
        },
        getCouponList() {
            this.listLoading = true
            let id = this.$route.params && this.$route.params.id;
            this.listQuery.couponId = id
            getRecievedCoupon(this.listQuery).then(res => {
                const data = res.data
                this.tableData = data.data.pageData
                this.total = data.data.totalCount
                this.listLoading = false
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getCouponList()
        },
        search() {
            this.listQuery.pageNum = 0;
            this.getCouponList()
        }
    }
}

</script>
