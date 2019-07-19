<template>
    <div class="page-container">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
            <el-breadcrumb-item class="bold" :to="{ path: '/mall/activity/list' }">活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadcrumbMap[isEdit]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row type="flex" class="row-bg" justify="end">
            <el-col :span="12" :offset="12" align="right">
                <el-button type="primary" size="small" @click="handleSave">保存</el-button>
            </el-col>
        </el-row>
        <el-form :model="formDetail" :rules="rules" :inline="true" ref="dataForm" size="small" label-width="150px" class="demo-form-inline border clearfix formDetail">
            <el-form-item label="活动名称：" prop="activityName">
                <el-input v-model="formDetail.activityName" placeholder="输入活动名称"></el-input>
            </el-form-item>
            <el-form-item label="活动类型：" prop="activityType">
                <el-select v-model="formDetail.activityType" placeholder="请选择" clearable>
                    <el-option label="订单满减活动" :value="0"></el-option>
                    <el-option label="订单满赠活动" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="活动时间：" prop="activityStartTime" class="fullWidth">
                <el-date-picker type="date" placeholder="选择起始时间" v-model="formDetail.activityStartTime" value-format="yyyy-MM-dd" :picker-options="pickerStartTime"></el-date-picker>
                <template><span>--</span></template>
                <el-date-picker type="date" placeholder="选择结束时间" v-model="formDetail.activityEndTime" value-format="yyyy-MM-dd" :picker-options="pickerEndTime"></el-date-picker>
            </el-form-item>
            <el-form-item label="订单需购满金额：" prop="orderRequireSum">
                <el-input v-model="formDetail.orderRequireSum" placeholder="输入订单需购满金额" type="number"></el-input>
            </el-form-item>
            <el-form-item label="优惠金额：" prop="couponSum" v-if="formDetail.activityType == 0">
                <el-input v-model="formDetail.couponSum" placeholder="输入优惠金额" type="number"></el-input>
            </el-form-item>
            <!-- <el-form-item label="参加活动商品：" prop="goodsActive">
                <el-select v-model="formDetail.goodsActive" placeholder="请选择" @change="goodsActiveChange" clearable>
                    <el-option 
	                    v-for="item in scopeList" 
	                    :key="item.dicSubval" 
	                    :label="item.dicSubname" 
	                    :value="item.dicSubval"
                    >
                    </el-option>
                </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="可使用商品类别：" prop="goodsCategory" v-if="formDetail.goodsActive == 3">
                <div 
	                class="flex" 
	                v-for="(item, index) in goodsCategoryArray" 
	                :key="item.key"
                >
                    <el-select v-model="formDetail.goodsCategory" placeholder="请选择" class="flex-item" @change="categoryChange" clearable>
                        <el-option 
	                        v-for="item in categoryList" 
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
            <el-form-item label="请选择医院：" prop="hospital" v-if="formDetail.goodsActive == 4">
                <div 
	                class="flex" 
	                v-for="(item, index) in hospitalArray" 
	                :key="item.key"
                >
                    <el-select v-model="formDetail.hospital" placeholder="请选择" class="flex-item" @change="hospitalChange" clearable>
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
        </el-form>
        <div class="step">
            <el-tabs type="card">
                <el-tab-pane label="参与活动的商品">
                    <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline border" @submit.native.prevent>
                        <el-form-item label="商品ID：">
                            <el-input v-model="listQuery.goodId" placeholder="输入商品ID"></el-input>
                        </el-form-item>
                        <el-form-item label="商品名称：">
                            <el-input v-model="listQuery.goodName" placeholder="输入商品名称"></el-input>
                        </el-form-item>
                        <el-form-item label="可使用商品类别：" prop="scope">
		                    <el-select v-model="listQuery.scope" placeholder="请选择" @change="categoryChange" clearable>
		                        <el-option 
			                        v-for="item in categoryList" 
			                        :key="item.id" 
			                        :label="item.commodityName" 
			                        :value="item.id"
		                        >
		                        </el-option>
		                    </el-select>
		            	</el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table 
	                    ref="multipleTable" 
	                    :data="tableData"
                        :row-key="getRowKey1"
	                    max-height="500" 
	                    stripe 
	                    tooltip-effect="dark" 
	                    style="width: 100%"
	                    @selection-change="selectRow"
                    >
                        <el-table-column type="selection" :reserve-selection="true" width="40">
                        </el-table-column>
                        <el-table-column prop="id" label="商品ID" align="center">
                        </el-table-column>
                        <el-table-column prop="goosName" label="商品名称" align="center">
                        </el-table-column>
                        <el-table-column prop="goodsClass" label="类别" align="center">
                        </el-table-column>
                        <el-table-column prop="goodsCount" label="库存" align="center">
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
                </el-tab-pane>
                <el-tab-pane label="赠品" v-if="formDetail.activityType == 1">
                    <el-form :inline="true" :model="listQuery2" size="small" class="demo-form-inline border" @submit.native.prevent>
                        <el-form-item label="商品ID：">
                            <el-input v-model="listQuery2.goodId" placeholder="输入商品ID"></el-input>
                        </el-form-item>
                        <el-form-item label="商品名称：">
                            <el-input v-model="listQuery2.goodName" placeholder="输入商品名称"></el-input>
                        </el-form-item>
                        <el-form-item label="可使用商品类别：" prop="scope">
		                    <el-select v-model="listQuery2.scope" placeholder="请选择" @change="categoryChange2" clearable>
		                        <el-option 
			                        v-for="item in categoryList" 
			                        :key="item.id" 
			                        :label="item.commodityName" 
			                        :value="item.id"
		                        >
		                        </el-option>
		                    </el-select>
		            	</el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search2">搜索</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table 
	                    ref="multipleTable2" 
	                    :data="tableData2"
                        :row-key="getRowKey2"
	                    max-height="500" 
	                    stripe 
	                    tooltip-effect="dark" 
	                    style="width: 100%" 
	                    @selection-change="selectRow2"
                    >
                        <el-table-column type="selection" :reserve-selection="true" width="40">
                        </el-table-column>
                        <el-table-column prop="id" label="商品ID" align="center">
                        </el-table-column>
                        <el-table-column prop="goosName" label="商品名称" align="center">
                        </el-table-column>
                        <el-table-column prop="goodsClass" label="类别" align="center">
                        </el-table-column>
                        <el-table-column prop="goodsCount" label="库存" align="center">
                        </el-table-column>
                    </el-table>
                    <el-pagination 
                    	v-show="total > 0" 
                    	:page-size="listQuery2.pageSize" 
                    	:pager-count="7" 
                    	layout="prev, pager, next" 
                    	:total="total" 
                    	:current-page="listQuery2.pageNum + 1" 
                    	@current-change="changePage2"
                	>
                    </el-pagination>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.formDetail {
    .el-form-item {
        width: 48%;
        margin-bottom: 20px;

        i {
            font-size: 24px;
            margin-left: 6px;
            cursor: pointer;
            line-height: 32px;
        }

        .flex+.flex {
            margin-top: 10px !important;
        }

        .flex:first-child i.el-icon-remove-outline {
            display: none !important;
        }
    }

    .fullWidth {
        width: 100%;
    }
}

.step {
    padding-top: 15px;
}

@media screen and (max-width: 1260px) {
    .formDetail {
        .el-form-item {
            width: 100%;
        }
    }
}

</style>
<script>
import { getActivityDetail, getAllTCommodity, findHospitals, getGoodsListForActivity, saveActivity } from '@/api/mall'
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
                false: '新增活动',
                true: '编辑活动',
            },
            pickerStartTime: {
                disabledDate: (time) => {
                    if (this.formDetail.activityEndTime != '') {
                        return time.getTime() > new Date(this.formDetail.activityEndTime).getTime()
                    } else {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                }
            },
            pickerEndTime: {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.formDetail.activityStartTime).getTime()
                }
            },
            getRowKey1(row) {
                return row.id;
            },
			getRowKey2(row) {
			    return row.id
			},
            formDetail: {
                activityName: '',
                activityType: '',
                activityStartTime: '',
                activityEndTime: '',
                orderRequireSum: '',
                categoryIdList: [],
                goodsIdList: [],
                couponSum: '',
                giftList: [],
                scope: '',
                activityStatus: 0,
            },
            goodsIdList: [
    			{
        			id: '',
        			categoryId: ''
    			}
            ],
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
            categoryList: [],
            hospitalArray: [{
                hospital: '',
            }],
            hospitals: [],
            rules: {
                activityName: [
                    { required: true }
                ],
                activityType: [
                    { required: true }
                ],
                activityStartTime: [
                    { required: true }
                ],
                activityEndTime: [
                    { required: true }
                ],
                orderRequireSum: [
                    { required: true }
                ],
                goodsActive: [
                    { required: true, trigger: 'change' }
                ],
                hospital: [
                    { required: true, trigger: 'change' }
                ],
                couponSum: [
                    { required: true }
                ],
                goodsCategory: [
                    { required: true, trigger: 'change' }
                ],
            },
            listQuery: {
                goodsId: '',
                goodName: '',
                pageNum: 0,
                pageSize: 50,
                categoryIdList: [],
                scope: '',
            },
            listQuery2: {
                goodsId: '',
                goodName: '',
                pageNum: 0,
                pageSize: 50,
                categoryIdList: [],
                scope: '',
            },
            tableData: [],
            tableData2: [],
            selectList: [],
            selectList2: [],
            listLoading: true,
            submitLoading: false,
            total: 0,
            tableList: [],
            tableList2: [],
        }
    },
    created() {
        if (this.isEdit) {
            let id = this.$route.params && this.$route.params.id
            this.getDetail(id)
        }
        this.getAllTCommodity()
        // this.getHospitals()
        this.getGoodsList()
        this.getGoodsList2()
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
			let goodsId = []
        	for(let i = 0; i < this.selectList.length; i++){
        		goodsId.push(this.selectList[i].id)
        	}
		    this.formDetail.goodsIdList = goodsId
            
        },
        selectRow2(val) {
            this.selectList2 = val
        	let giftId = []
        	for(let i = 0; i < this.selectList2.length; i++){
        		giftId.push(this.selectList2[i].id)
        	}
		    this.formDetail.giftList = giftId
        },
        getDetail(id) {
            getActivityDetail(id).then(res => {
                let data = res.data.data
                if(data != null){
                   this.formDetail = {
                        id: data.resultActivity.id,
                        activityName: data.resultActivity.activityName,
                        activityType: data.resultActivity.activityType,
                        activityStartTime: data.resultActivity.activityStartTime,
                        activityEndTime: data.resultActivity.activityStartTime,
                        orderRequireSum: data.resultActivity.orderRequireSum,
                        couponSum: data.resultActivity.couponSum,
                        activityStatus: data.resultActivity.activityStatus,
                        goodsIdList: data.resultGoodsPojoList,
                        giftList: data.resultGiftList,
                        dataRemoveType: 0
                    } 
                }
                
            })
        },
        getGoodsList() {
            this.listLoading = true
            getGoodsListForActivity(this.listQuery).then(res => {
                const data = res.data
                this.tableData = data.data.pageData
                this.total = data.data.totalCount
                this.listLoading = false

                if(this.formDetail.goodsIdList){
					let goodsId = []
					for (let item of this.tableData) {
						goodsId.push(item.id)
					}
					setTimeout(() => {
						for(let item of this.formDetail.goodsIdList) {
							let index = goodsId.indexOf(item.id)
							if (index > -1) {
								this.$refs.multipleTable.toggleRowSelection(this.tableData[index], true)
							}
						}
					}, 0)
	            }
				
            })
        },
        getGoodsList2() {
            this.listLoading = true
            getGoodsListForActivity(this.listQuery2).then(res => {
                const data = res.data
                this.tableData2 = data.data.pageData
                this.total = data.data.totalCount
                this.listLoading = false

                if(this.formDetail.giftList){
                	let gift = []
					for (let item of this.tableData2) {
						gift.push(item.id)
					}
					setTimeout(() => {
						for(let item of this.formDetail.giftList) {
							let index = gift.indexOf(item.id)
							if (index > -1) {
								this.$refs.multipleTable2.toggleRowSelection(this.tableData2[index], true)
							}
						}
					}, 0)
                }
				
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getGoodsList()
        },
        changePage2(val) {
            this.listQuery2.pageNum = val - 1
            this.getGoodsList2()
        },
        search() {
            this.listQuery.pageNum = 0
            this.getGoodsList()
        },
        search2() {
            this.listQuery2.pageNum = 0
            this.getGoodsList2()
        },
        // goodsActiveChange() {
        //     let value = this.formDetail.goodsActive
        //     if (value == 1) {
        //         for (let i = 0; i < this.tableData.length; i++) {
        //             this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true);
        //         }
        //     } else {
        //         this.$refs.multipleTable.clearSelection();
        //     }
        // },
        toggleSelection(rows) {
        	if (rows) {
        		rows.forEach(row => {
        			this.$refs.multipleTable.toggleRowSelection(row);
        		});
        	} else {
        		this.$refs.multipleTable.clearSelection();
        	}
        },
        categoryChange() {
        	// if(this.tableData){
        	// 	for (let i = 0; i < this.tableData.length; i++) {
	        //         if (this.listQuery.scope == this.tableData[i].goodsCategaryId) {
	        //             this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true)
         //                console.log(this.tableData[i].id)
	        //         } else {
	        //             this.$refs.multipleTable.clearSelection();
	        //         }
	        //     }
         //    }
        },
        categoryChange2() {
        	// if(this.tableData2){
        	// 	for (let j = 0; j < this.tableData2.length; j++) {
	        //         if (this.listQuery2.scope == this.tableData2[j].goodsCategaryId) {
	        //             this.$refs.multipleTable2.toggleRowSelection(this.tableData2[j], true)
	        //         } else {
	        //             this.$refs.multipleTable2.clearSelection();
	        //         }
	        //     }
        	// }
        },
     //    hospitalChange() {
	    // 	let hospitalList = []
	    // 	for(let i = 0; i < this.formDetail.hospital.length; i++){
		   //  	hospitalIdList.push(this.formDetail.hospital[i])
		   //  }
		   //  hospitalList.push(this.formDetail.hospital)
		   //  this.formDetail.hospitalIdList = hospitalList
	    // },
        // addItemGoodsCategory(index) {
        //     this.goodsCategoryArray.push({
        //         goodsCategory: '',
        //     })
        // },
        // deleteItemGoodsCategory(index) {
        //     this.goodsCategoryArray.splice(index, 1)
        // },
        // addItemHospital(index) {
        //     this.hospitalArray.push({
        //         hospital: '',
        //     })
        // },
        // deleteItemHospital(index) {
        //     this.hospitalArray.splice(index, 1)
        // },
        getAllTCommodity() {
            getAllTCommodity().then(res => {
                let data = res.data
                this.categoryList = data
            })
        },
        // getHospitals() {
        //     findHospitals().then(res => {
        //         let data = res.data
        //         this.hospitals = data;
        //     })
        // },
        handleSave() {
        	if(this.formDetail.goodsIdList.length == 0){
                this.$message({
                    message: '请选择商品',
                    type: 'warning'
                })
        	}else{
	            this.$refs['dataForm'].validate(valid => {
	                if (valid) {
	                    saveActivity(this.formDetail).then(res => {
	                        const data = res.data
	                        if (data.code == '10001') {
	                            let message = this.isEdit ? '编辑成功' : '添加成功'
	                            this.$router.replace({ path: '/mall/activity/list' })
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
}

</script>
