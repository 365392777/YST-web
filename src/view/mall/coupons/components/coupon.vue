<template>
    <div class="page-container">
    	<el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
		    <el-breadcrumb-item class="bold" :to="{ path: '/mall/coupons/list' }">优惠券管理</el-breadcrumb-item>
		    <el-breadcrumb-item>{{breadcrumbMap[isEdit]}}</el-breadcrumb-item>
		</el-breadcrumb>
    	<el-row type="flex" justify="end" :gutter="15">
			<el-col :span="24" class="align-right">
				<el-button type="primary" size="small" @click="saveAndGrant">保存并发放</el-button>
				<el-button type="primary" size="small" @click="handleSave">仅保存</el-button>
			</el-col>
		</el-row>
		<el-form :model="formData" :rules="rules" ref="dataForm" size="small" label-width="180px" class="demo-form border clearfix">
			<el-col :span="11">
			    <el-form-item label="优惠券名称：" prop="couponName">
	        		<el-input v-model="formData.couponName"></el-input>
			    </el-form-item>
			    <el-form-item label="面额（元）：" prop="discountMoney">
			        <el-input v-model="formData.discountMoney" type="number"></el-input>
			    </el-form-item>
			    <el-form-item label="发放开始日期：" prop="startDateIssuan">
			        <el-date-picker type="date" placeholder="请选择日期" v-model="formData.startDateIssuan" value-format="yyyy-MM-dd" :picker-options="pickerDateIssuan0"></el-date-picker>
			    </el-form-item>
			    <el-form-item label="使用开始日期：" prop="startDateUse">
			        <el-date-picker type="date" placeholder="请选择日期" v-model="formData.startDateUse" value-format="yyyy-MM-dd" :picker-options="pickerDateUse0"></el-date-picker>
			    </el-form-item>
			    <el-form-item label="发放数量：" prop="issuanCount">
			        <el-input v-model="formData.issuanCount" type="number"></el-input>
			    </el-form-item>
			    <!-- <el-form-item label="可使用商品：" prop="scope">
			        <el-select v-model="formData.scope" placeholder="请选择" class="flex" @change="goodsCouponChange" clearable>
					    <el-option 
						    v-for="item in scopeList" 
						    :key="item.dicSubval" 
						    :label="item.dicSubname" 
						    :value="item.dicSubval"
					    >
					    </el-option>
				    </el-select>
			    </el-form-item> -->
		    </el-col>
		    <el-col :span="12" :offset="1">
		    	<el-form-item>
	    			<el-input style="visibility: hidden;"></el-input>
			    </el-form-item>
		    	<el-form-item label="使用需满金额（元）：" prop="fullMoney">
	    			<el-input v-model="formData.fullMoney" type="number"></el-input>
			    </el-form-item>
			    <el-form-item label="发放截止日期：" prop="endDateIssuan">
			        <el-date-picker type="date" placeholder="请选择日期" v-model="formData.endDateIssuan" value-format="yyyy-MM-dd" :picker-options="pickerDateIssuan1"></el-date-picker>
			    </el-form-item>
			    <el-form-item label="使用截止日期：" prop="endDateUse">
			        <el-date-picker type="date" placeholder="请选择日期" v-model="formData.endDateUse" value-format="yyyy-MM-dd" :picker-options="pickerDateUse1"></el-date-picker>
			    </el-form-item>
			    <el-form-item label="每账号可领取数量：" prop="perAcceptCount">
		        	<el-input v-model="formData.perAcceptCount" type="number"></el-input>
			    </el-form-item>
			    <!-- <el-form-item label="可使用商品类别：" prop="goodsCategory" v-if="formData.scope == 3">
			    	<div 
			    		class="flex"
			    		v-for="(item, index) in goodsCategoryArray"
			    		:key="item.key"
		    		>
				        <el-select v-model="formData.goodsCategory" placeholder="请选择" class="flex-item" @change="categoryChange" clearable>
				            <el-option 
							    v-for="item in category" 
							    :key="item.id" 
							    :label="item.commodityName" 
							    :value="item.id"
						    >
						    </el-option>
				        </el-select>
				        <i class="el-icon-circle-plus-outline" @click="addItemGoodsCategory(index)"></i>
			    		<i class="el-icon-remove-outline red" v-if="goodsCategoryArray.length > 1" @click="deleteItemGoodsCategory(index)"></i>
			        </div>
			    </el-form-item>
			    <el-form-item label="请选择医院：" prop="hospital" v-if="formData.scope == 4">
			    	<div 
			    		class="flex"
			    		v-for="(item, index) in hospitalArray"
			    		:key="item.key"
		    		>
			    		<el-select v-model="formData.hospital" placeholder="请选择" class="flex-item" @change="hospitalChange" clearable>
				            <el-option 
							    v-for="item in hospitals" 
							    :key="item.id" 
							    :label="item.hospital" 
							    :value="item.id"
						    >
						    </el-option>
				        </el-select>
				        <i class="el-icon-circle-plus-outline" @click="addItemHospital(index)"></i>
			        	<i class="el-icon-remove-outline red" v-if="hospitalArray.length > 1" @click="deleteItemHospital(index)"></i>
			    	</div>
		    	</el-form-item> -->
		    </el-col>
		</el-form>
		<div class="step">
			<el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline border" @submit.native.prevent>
			    <el-form-item label="输入商品ID：">
			        <el-input v-model="listQuery.goodsId" placeholder="输入商品ID"></el-input>
			    </el-form-item>
			    <el-form-item label="商品名称：">
			        <el-input v-model="listQuery.goodsName" placeholder="输入商品名称"></el-input>
			    </el-form-item>
			    <el-form-item label="可使用商品类别：" prop="goodsCategory">
			        <el-select v-model="listQuery.goodsCategory" placeholder="请选择" class="flex-item" @change="categoryChange" clearable>
			            <el-option 
						    v-for="item in category" 
						    :key="item.id" 
						    :label="item.commodityName" 
						    :value="item.id"
					    >
					    </el-option>
			        </el-select>
			    </el-form-item>
			    <el-form-item>
			        <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">查询</el-button>
			    </el-form-item>
			    <!-- <el-form-item>
			        <el-button type="primary" @click="">新增商品</el-button>
			        <el-button type="danger" @click="">删除商品</el-button>
			    </el-form-item> -->
			</el-form>
	        <el-table
		        ref="multipleTable"
		        :data="tableData"
		        :row-key="getRowKeys"
		        max-height="500"
		        stripe
		        highlight-current-row
		        tooltip-effect="dark"
		        style="width: 100%"
		        v-loading="listLoading"
		        @selection-change="selectRow">
		        <el-table-column
		            type="selection"
		            :reserve-selection="true"
		            width="40"
		            align="center">
		        </el-table-column>
		        <el-table-column
		            prop="goodsId"
		            label="商品ID"
		            width="80" 
		            align="center">
		        </el-table-column>
		        <el-table-column
		            prop="goodsName"
		            label="商品名称"
		            align="center">
		        </el-table-column>
		        <el-table-column
		            prop="commodityName"
		            label="类别"
		            align="center">
		        </el-table-column>
		        <el-table-column
		            prop="totalAmount"
		            label="库存量"
		            align="center">
		        </el-table-column>
		        <el-table-column
		            label="操作"
		            align="center"
		            show-overflow-tooltip>
		            <template slot-scope="scope">
		            	<el-button type="text" class="red" @click="delRow(scope.$index, tableData)">删除</el-button>	
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
            @current-change="changePage">
		</el-pagination>
    </div>
</template>

<style lang="scss" scoped>
.align-right {
    text-align: right;
    margin-bottom: 15px;
}
.flex{
	align-items: center;
}
.demo-form{
	.el-form-item{
		margin-bottom: 20px;
		.el-date-editor{
			width: 100%;
		}
		i{
			font-size: 24px;
			margin-left: 6px;
			cursor: pointer;
		}
		.flex + .flex{
			margin-top: 10px;
		}
	}
}
.step{
	padding-top: 15px;
}
</style>

<script>
import { getCouponDetail, getAllTCommodity, findHospitals, saveCoupon, findGoodsDetail } from '@/api/mall'
import { convertDate } from '@/utils'

export default {
	props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
    	return {
    		breadcrumbMap: {
                false: '新增',
                true: '编辑',
            },
            pickerDateIssuan0: {
                disabledDate: (time) => {
                    if (this.formData.endDateIssuan != '') {
                        return time.getTime() > new Date(this.formData.endDateIssuan).getTime()
            		}else{
                        return time.getTime() < Date.now() - 8.64e7
                    } 
            	}
            },
            pickerDateUse0: {
            	disabledDate: (time) => {
            		if (this.formData.endDateUse != '') {
                        return time.getTime() > new Date(this.formData.endDateUse).getTime()
            		}else{
                        return time.getTime() < Date.now() - 8.64e7
                    } 
            	}
            },
            pickerDateIssuan1: {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.formData.startDateIssuan).getTime()
                }
            },
            pickerDateUse1: {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.formData.startDateUse).getTime()
                }
            },
            getRowKeys(row) {
	            return row.id;
	        },
    		formData: {
    			id: '',
	        	couponName: '',
	        	discountMoney: '',
	        	startDateIssuan: '',
	        	startDateUse: '',
	        	issuanCount: '',
	        	fullMoney: '',
	        	endDateIssuan: '',
	        	endDateUse: '',
	        	perAcceptCount: '',
	        	couponStatus: 0,
	        	goodsList: [
	        		{
	        			goodsId: '',
	        			categoryId: ''
	    			}
	        	],
	        },
	        scopeList: [
		        {
		        	dicSubval: 1,
		        	dicSubname: '所有商品'
		        }, {
		        	dicSubval: 2,
		        	dicSubname: '指定商品'
		        }, {
		        	dicSubval: 3,
		        	dicSubname: '指定类别'
		        }, {
		        	dicSubval: 4,
		        	dicSubname: '指定医院上架的商品'
		        }
	        ],
	        goodsCategoryArray: [
	        	{
	        		goodsCategory: '',
	        	}
	        ],
	        category: [],
	        hospitalArray: [
	        	{
	        		hospital: '',
	        	}
	        ],
	        hospitals: [],
	        rules: {
	        	couponName: [
	        		{ required: true, message: '请输入优惠券名称', trigger: 'blur' }
	        	],
	        	discountMoney: [
	        		{ required: true, message: '请输入面额', trigger: 'blur' }
	        	],
	        	startDateIssuan: [
	        		{ required: true, message: '请选择发放开始日期', trigger: 'blur' }
	        	],
	        	startDateUse: [
	        		{ required: true, message: '请选择使用开始日期', trigger: 'blur' }
	        	],
	        	issuanCount: [
	        		{ required: true, message: '请输入发放数量', trigger: 'blur' }
	        	],
	        	scope: [
	        		{ required: true, message: '请选择可使用商品', trigger: 'blur' }
	        	],
	        	hospital: [
	        		{ required: true, message: '请选择医院', trigger: 'blur' }
	        	],
	        	fullMoney: [
	        		{ required: true, message: '请输入使用需满金额', trigger: 'blur' }
	        	],
	        	endDateIssuan: [
	        		{ required: true, message: '请选择发放截止日期', trigger: 'blur' }
	        	],
	        	endDateUse: [
	        		{ required: true, message: '请选择使用截止日期', trigger: 'blur' }
	        	],
	        	perAcceptCount: [
	        		{ required: true, message: '请输入每账号可领取数量', trigger: 'blur' }
	        	],
	        	goodsCategory: [
	        		{ required: true, message: '请选择可使用商品类别', trigger: 'blur' }
	        	]
	        },
	        listQuery: {
	        	goodsId: '',
	        	goodsName: '',
	        	goodsCategory: '',
	        	pageNum: 0,
	        	pageSize: 3,
	        },
	        tableData: [],
	        selectList: [],
	        listLoading: true,
            submitLoading: false,
            total: 0,
    	}
    },
    created() {
    	if (this.isEdit) {
	        let id = this.$route.params && this.$route.params.id
	        this.getDetail(id)
	    }
        this.getAllTCommodity()
        this.getHospitals()
        this.getGoodsList()
    },
    computed: {
    	dateTime() {
    		return function(date) {
    			return convertDate(date)
    		}
    	}
    },
    methods: {
	    // goodsCouponChange() {
		   //  if(this.formData.scope == 1){
		   //  	for(let i = 0; i < this.tableData.length; i++){
		   //  		this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true)
		   //  	}
		   //  }else{
		   //  	this.$refs.multipleTable.clearSelection()
		   //  }
	    // },
	    categoryChange() {
     //    	for(let i = 0; i < this.tableData.length; i++){
     //    		if(this.listQuery.goodsCategory == this.tableData[i].categoryId){
					// this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true)
     //    		}else{
     //    			this.$refs.multipleTable.clearSelection()
     //    		}
	    // 	}
	    },
	    // hospitalChange() {
	    // 	let hospitalIdList = []
	    // 	for(let i = 0; i < this.formData.hospital.length; i++){
		   //  	hospitalIdList.push(this.formData.hospital[i])
		   //  }
		   //  hospitalIdList.push(this.formData.hospital)
		   //  this.formData.hospitalList = hospitalIdList
	    // },
    	// 获取表格选中时的数据
        selectRow (rows) {
        	this.select_id = [];
            if (rows) {
                rows.forEach(row => {
                    if (row) {
                        this.select_id.push(row.id);
                    }
                });
            }

        	this.selectList = rows
        	this.formData.goodsList = []
        	for(let i = 0; i < this.selectList.length; i++){
        		this.formData.goodsList.push({
        			goodsId: this.selectList[i].goodsId,
        			categoryId: this.selectList[i].categoryId,
        		})
        		// this.formData.goodsList = JSON.stringify(this.formData.goodsList)
        	}
        },
        // 删除行
        delRow(index, rows) {
	        rows.splice(index, 1)
	    },
	    addItemGoodsCategory(index) {
        	this.goodsCategoryArray.push({
                goodsCategory: '',
            })
        },
        deleteItemGoodsCategory(index) {
        	this.goodsCategoryArray.splice(index, 1)
        },
        addItemHospital(index) {
        	this.hospitalArray.push({
                hospital: '',
            })
        },
        deleteItemHospital(index) {
        	this.hospitalArray.splice(index, 1)
        },
	    getDetail(id) {
	    	getCouponDetail(id).then(res => {
                const data = res.data.data
                this.formData = {
                    id: data.resultMap.id,
                    couponName: data.resultMap.couponName,
                    discountMoney: data.resultMap.discountMoney,
                    startDateIssuan: data.resultMap.startDateIssuan,
                    startDateUse: data.resultMap.startDateUse,
                    issuanCount: data.resultMap.issuanCount,
                    fullMoney: data.resultMap.fullMoney,
                    endDateIssuan: data.resultMap.endDateIssuan,
                    endDateUse: data.resultMap.endDateUse,
                    perAcceptCount: data.resultMap.perAcceptCount,
                    couponStatus: data.resultMap.couponStatus,
                    goodsList: data.couponGoodsRelList,
                    dataRemoveType: 0,
                }
            })
	    },
	    getAllTCommodity() {
	    	getAllTCommodity().then(res => {
            	let data = res.data
            	this.category = data
            })
	    },
	    getHospitals() {
	    	findHospitals().then(res => {
            	let data = res.data
            	this.hospitals = data
            })
	    },
	    getGoodsList() {
	    	this.listLoading = true
	    	findGoodsDetail(this.listQuery).then(res =>{
	    		const data = res.data
	    		if (data.flag == 'success') {
		    		this.tableData = data.data.pageData
					this.total = data.data.totalCount
					this.listLoading = false

					if (this.isEdit) {
						if(this.formData.goodsList){
							let goodsId = []
							for (let item of this.tableData) {
								goodsId.push(item.goodsId)
							}
							setTimeout(() => {
								for(let item of this.formData.goodsList) {
									let index = goodsId.indexOf(item.goodsId)
									if (index > -1) {
										this.$refs.multipleTable.toggleRowSelection(this.tableData[index], true)
									}
								}
							}, 0)
			            }
			        }
				}
	    	})
	    },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getGoodsList()
        },
	    search() {
	    	this.listQuery.pageNum = 0
            this.getGoodsList()
	    },
	    saveAndGrant() {
	    	this.$refs['dataForm'].validate(valid => {
                if (valid) {
		        	this.formData.couponStatus = 1
		            saveCoupon(this.formData).then(res => {
		                const data = res.data
		                if (data.flag == 'success') {
		                    let message = this.isEdit ? '编辑成功' : '添加成功'
		                    this.$router.replace({path: '/mall/coupons/list'})
		                    this.$message({
		                        message,
		                        type: 'success'
		                    })
		                } else {
		                	this.$message({
		                        message: data.msg,
		                        type: 'error'
		                    })
		                }
		                this.submitLoading = false
		            }).catch(() => {
		                this.$message({
		                    message: '提交失败',
		                    type: 'error'
		                })
		                this.submitLoading = false
		            })
	            }
            })
	    },
	    handleSave() {
	    	this.$refs['dataForm'].validate(valid => {
                if (valid) {
			    	saveCoupon(this.formData).then(res => {
		                const data = res.data
		                if (data.flag == 'success') {
		                    let message = this.isEdit ? '编辑成功' : '添加成功'
		                    this.$router.replace({path: '/mall/coupons/list'})
		                    this.$message({
		                        message,
		                        type: 'success'
		                    })
		                } else {
		                	this.$message({
		                        message: data.msg,
		                        type: 'error'
		                    })
		                }
		                this.submitLoading = false
		            }).catch(() => {
		                this.$message({
		                    message: '提交失败',
		                    type: 'error'
		                })
		                this.submitLoading = false
		            })
	            }
            })
	    }
    }
}
</script>