<template>
    <div class="page-container">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
            <el-breadcrumb-item
                class="bold"
                to="/mall/activity/list"
            >活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :rules="rules" ref="formDetail" size="small" label-width="180px" class="demo-form border flex">
			<el-col :span="8" class="flex-item">
			    <el-form-item label="活动名称：" prop="activityName">
			    	<template>{{ formDetail.activityName }}</template>
			    </el-form-item>
			    <el-form-item label="活动类型：" prop="activityType">
			    	<template>
			    		<div v-if="formDetail.activityType == 0">订单满减活动</div>
                        <div v-else>订单满赠活动</div>
				    </template>
			    </el-form-item>
			    <el-form-item label="优惠金额：" prop="couponSum" v-if="formDetail.activityType == 0">
		    		<template>{{ formDetail.couponSum }}</template>
			    </el-form-item>
			    <!-- <el-form-item label="参加活动商品：" prop="goodsIdList">
			    	<template>{{ formDetail.goodsIdList }}</template>
			    </el-form-item> -->
		    </el-col>
		    <el-col :span="15" :offset="1">
		    	<el-form-item label="活动时间：" prop="activityStartTime">
		    		<template>{{ dateTime(formDetail.activityStartTime) }}</template>
		    		<template><span>--</span></template>
		    		<template>{{ dateTime(formDetail.activityEndTime) }}</template>
			    </el-form-item>
			    <el-form-item label="订单需购满金额：" prop="orderRequireSum">
			    	<template>{{ formDetail.orderRequireSum }}</template>
			    </el-form-item>
			    <!-- <el-form-item label="可使用商品类别：" prop="goodCategoryIdList" v-if="formDetail.goodsIdList == '3'">
		    		<template>{{ formDetail.goodCategoryIdList }}</template>
			    </el-form-item>
			    <el-form-item label="医院：" prop="hospitalIdList" v-if="formDetail.goodsIdList == '4'">
		    		<template>{{ formDetail.hospitalIdList }}</template>
			    </el-form-item> -->
		    </el-col>
		</el-form>
		
		<div class="next">
			<el-tabs type="card">
				<el-tab-pane label="参与活动的商品">
					<el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline border" @submit.native.prevent>
					    <el-form-item label="商品ID：">
					        <el-input v-model="listQuery.id" placeholder="输入商品ID"></el-input>
					    </el-form-item>
					    <el-form-item label="商品名称：">
					        <el-input v-model="listQuery.goodsName" placeholder="输入商品名称"></el-input>
					    </el-form-item>
					    <el-form-item>
					        <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
					    </el-form-item>
					</el-form>
			        <el-table
			        	ref="multipleTable"
				        :data="tableData"
				        max-height="500"
				        stripe
				        tooltip-effect="dark"
				        style="width: 100%"
				        @selection-change="selectRow">
				        <!-- <el-table-column
					    	type="selection"
					    	width="40">
					    </el-table-column> -->
				        <el-table-column
				            prop="id"
				            label="商品ID"
				            align="center">
				        </el-table-column>
				        <el-table-column
				            prop="goosName"
				            label="商品名称"
				            align="center">
				        </el-table-column>
				        <el-table-column
				        	prop="goodsClass"
				            label="类别"
				            align="center">
				        </el-table-column>
				        <el-table-column
				        	prop="goodsCount"
				            label="库存"
				            align="center">
				        </el-table-column>
				        <el-table-column
				        	prop="number"
				            label="销售数量"
				            align="center">
				        </el-table-column>
					</el-table>
					<el-pagination
					    v-show="total > 0"
			            :page-size="listQuery.pageSize"
					    :pager-count="7"
					    layout="prev, pager, next"
					    :total="total"
			            :current-page="listQuery.pageNum + 1"
			            @current-change="changePage">
					</el-pagination>
				</el-tab-pane>
				<el-tab-pane label="赠品" v-if="formDetail.activityType == 1">
					<el-form :inline="true" :model="listQuery2" size="small" class="demo-form-inline border" @submit.native.prevent>
					    <el-form-item label="商品ID：">
					        <el-input v-model="listQuery2.id" placeholder="输入商品ID"></el-input>
					    </el-form-item>
					    <el-form-item label="商品名称：">
					        <el-input v-model="listQuery2.goodsName" placeholder="输入商品名称"></el-input>
					    </el-form-item>
					    <el-form-item>
					        <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search2">搜索</el-button>
					    </el-form-item>
					</el-form>
			        <el-table
			        	ref="multipleTable"
				        :data="tableData2"
				        max-height="500"
				        stripe
				        tooltip-effect="dark"
				        style="width: 100%"
				        @selection-change="selectRow2">
				        <!-- <el-table-column
					    	type="selection"
					    	width="40">
					    </el-table-column> -->
				        <el-table-column
				            prop="id"
				            label="商品ID"
				            align="center">
				        </el-table-column>
				        <el-table-column
				            prop="goosName"
				            label="商品名称"
				            align="center">
				        </el-table-column>
				        <el-table-column
				        	prop="goodsClass"
				            label="类别"
				            align="center">
				        </el-table-column>
				        <el-table-column
				        	prop="goodsCount"
				            label="库存"
				            align="center">
				        </el-table-column>
				        <el-table-column
				        	prop="number"
				            label="销售数量"
				            align="center">
				        </el-table-column>
					</el-table>
					<el-pagination
					    v-show="total > 0"
			            :page-size="listQuery2.pageSize"
					    :pager-count="7"
					    layout="prev, pager, next"
					    :total="total"
			            :current-page="listQuery2.pageNum + 1"
			            @current-change="changePage2">
					</el-pagination>
				</el-tab-pane>
			</el-tabs>
		</div>
    </div>
</template>

<style lang="scss" scoped>
.next{
	padding-top: 15px;
}
</style>

<script>
import { getActivityDetail } from '@/api/mall'
import { convertDate } from '@/utils'

export default {
    data() {
    	return {
    		formDetail: [],
	        rules: {
	        	activityName: [
	        		{ required: true }
	        	],
	        	activityType: [
	        		{ required: true }
	        	],
	        	orderRequireSum: [
	        		{ required: true }
	        	],
	        	goodsIdList: [
	        		{ required: true }
	        	],
	        	activityStartTime: [
	        		{ required: true }
	        	],
	        	activityEndTime: [
	        		{ required: true }
	        	],
	        	couponSum: [
	        		{ required: true }
	        	],
	        },
	        listQuery: {
	        	id: '',
	        	goodsName: '',
	        	pageNum: 0,
	        	pageSize: 20,
	        },
	        listQuery2: {
	        	id: '',
	        	goodsName: '',
	        	pageNum: 0,
	        	pageSize: 20,
	        },
	        tableData: [],
	        tableData2: [],
	        selectList: [],
	        selectList2: [],
	        listLoading: true,
	        submitLoading: false,
	        total: 0,
    	}
    },
    created() {
        let id = this.$route.params && this.$route.params.id;
        this.getDetail(id);
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
        selectRow (val) {
          this.selectList = val
        },
        selectRow2 (val) {
          this.selectList2 = val
        },
        getDetail(id) {
            getActivityDetail(id).then(res => {
                let data = res.data.data
                if(data != null){
	                this.formDetail = {
	                    id: data.resultActivity.id,
	                    activityName: data.resultActivity.activityName,
			        	activityType: data.resultActivity.activityType,
			        	orderRequireSum: data.resultActivity.orderRequireSum,
			        	activityStartTime: data.resultActivity.activityStartTime,
			        	activityEndTime: data.resultActivity.activityEndTime,
			        	couponSum: data.resultActivity.couponSum,
	                    dataRemoveType: 0
	                }
	                this.tableData = data.resultGoodsPojoList
	                this.tableData2 = data.resultGiftList
	            }
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1;
        },
        changePage2(val) {
            this.listQuery2.pageNum = val - 1;
        },
        search() {
            this.listQuery.pageNum = 0;
        },
        search2() {
            this.listQuery2.pageNum = 0;
        },
    }
}
</script>