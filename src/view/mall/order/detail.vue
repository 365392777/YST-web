<template>
	<div class="page-container">
		<el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
	        <el-breadcrumb-item :to="{ path: '/mall/order/list' }">订单管理</el-breadcrumb-item>
	        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
		</el-breadcrumb>
		<el-row type="flex" class="row-bg" justify="end">
			<el-col :span="12" :offset="12" align="right">
				<el-button type="primary" size="small" @click="handlePrint()" v-if="this.formDetail.orderStaus == '待发货'">打印发货单</el-button>
				<el-button type="primary" size="small" @click="handleDeliver()" v-if="this.formDetail.orderStaus == '待发货'">发货</el-button>
				<!-- <el-button type="primary" size="small" @click="dialogProcess = true">审核</el-button> -->
			</el-col>
		</el-row>
		<!-- 取消订单 -->
		<!-- <div class="border">
			<div class="divide receive">
				<div class="title">取消订单信息</div>
				<el-form :inline="true" label-width="120px" class="demo-form-inline clearfix">
					<el-form-item label="订单类型：" prop="type">
				    	<template>{{ formDetail.type }}</template>
				    </el-form-item>
				    <el-form-item label="申请时间：" prop="date">
				    	<template>{{ formDetail.date }}</template>
				    </el-form-item>
				    <el-form-item label="取消原因：" prop="reason">
				    	<template>{{ formDetail.reason }}</template>
				    </el-form-item>
					<el-form-item label="状态：" prop="state">
				    	<template>{{ formDetail.state }}</template>
				    </el-form-item>
				</el-form>
			</div>
		</div> -->
		<!-- 售后订单 -->
		<!-- <div class="border">
			<div class="divide receive">
				<div class="title">售后订单信息</div>
				<el-form :inline="true" label-width="120px" class="demo-form-inline clearfix">
					<el-form-item label="订单类型：" prop="type">
				    	<template>{{ formDetail.type }}</template>
				    </el-form-item>
				    <el-form-item label="申请时间：" prop="date">
				    	<template>{{ formDetail.date }}</template>
				    </el-form-item>
				    <el-form-item label="申请原因：" prop="reason">
				    	<template>{{ formDetail.reason }}</template>
				    </el-form-item>
					<el-form-item label="状态：" prop="state">
				    	<template>{{ formDetail.state }}</template>
				    </el-form-item>
				</el-form>
			</div>
		</div> -->
		<!-- 已完成订单 -->
		<!-- <div class="border">
			<div class="divide receive">
				<div class="title">已完成订单信息</div>
				<el-form :inline="true" label-width="120px" class="demo-form-inline clearfix">
					<el-form-item label="订单类型：" prop="type">
				    	<template>{{ formDetail.type }}</template>
				    </el-form-item>
				    <el-form-item label="申请时间：" prop="date">
				    	<template>{{ formDetail.date }}</template>
				    </el-form-item>
				</el-form>
			</div>
		</div> -->
		<!-- 统一 -->
		<div class="border">
			<div class="divide">
				<div class="title">基本信息</div>
				<el-form :inline="true" :label-position="labelPosition" label-width="120px" class="demo-form-inline clearfix">
					<el-form-item label="订单号：" prop="orderNo">
				    	<template>{{ formDetail.orderNo }}</template>
				    </el-form-item>
				    <el-form-item label="用户帐号：" prop="patientPhone">
				    	<template>{{ formDetail.patientPhone }}</template>
				    </el-form-item>
				    <el-form-item label="应付金额：" prop="actualAmount">
				    	<template>{{ formDetail.actualAmount }}</template>
				    </el-form-item>
					<el-form-item label="订单状态：" prop="orderStaus">
				    	<template>{{ formDetail.orderStaus }}</template>
				    </el-form-item>
				    <el-form-item label="下单时间：" prop="createTime">
				    	<template>{{ dateTime(formDetail.createTime) }}</template>
				    </el-form-item>
				    <!-- <el-form-item label="支付时间：" prop="payTime">
				    	<template>
				    		<div v-if="formDetail.payTime == ''">{{ dateTime(formDetail.payTime) }}</div>
				    	</template>
				    </el-form-item> -->
				    <el-form-item label="支付方式：" prop="payWay">
				    	<template>{{ formDetail.payWay }}</template>
				    </el-form-item>
				    <el-form-item label="发票抬头：" prop="invoiceRisetype" v-if="formDetail.isInvoice == 0">
				    	<template>
				    		<div v-if="formDetail.invoiceRisetype == 0">个人</div>
				    		<div v-else>单位</div>
				    	</template>
				    </el-form-item>
				    <el-form-item label="纳税人识别号：" prop="taxpayerNum" v-if="formDetail.invoiceRisetype == 1">
				    	<template>{{ formDetail.taxpayerNum }}</template>
				    </el-form-item>
				</el-form>
			</div>
			<div class="divide receive">
				<div class="title">收货信息</div>
				<el-form :inline="true" :label-position="labelPosition" label-width="120px" class="demo-form-inline clearfix">
					<el-form-item label="收货人：" prop="receivingName">
				    	<template>{{ formDetail.receivingName }}</template>
				    </el-form-item>
				    <el-form-item label="联系方式：" prop="receivingPhone">
				    	<template>{{ formDetail.receivingPhone }}</template>
				    </el-form-item>
				    <el-form-item label="收货地址：" prop="receivingAddress">
				    	<template>{{ formDetail.receivingAddress }}</template>
				    </el-form-item>
					<!-- <el-form-item label="邮编：" prop="zipCode">
				    	<template>{{ formDetail.zipCode }}</template>
				    </el-form-item> -->
				    <el-form-item label="配送方式：" prop="logisticsCompany">
				    	<template>
				    		<div v-if="!formDetail.logisticsCompany">快递</div>
					    	<div v-else>{{ formDetail.logisticsCompany }}</div>
					    </template>
				    </el-form-item>
				    <!-- <el-form-item label="留言：" prop="remark">
				    	<template>{{ formDetail.remark }}</template>
				    </el-form-item> -->
				</el-form>
			</div>
			<div class="divide">
				<div class="title">商品信息</div>
				<el-table
				    :data="tableDetail"
				    border
				    style="width: 100%">
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
			            prop="specification"
			            label="商品规格"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="goodsCount"
			            label="数量"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="goodsAmount"
			            label="商品价格"
			            align="center">
			        </el-table-column>
			        <!-- <el-table-column
			            prop="disCountPrice"
			            label="折扣价"
			            align="center">
			        </el-table-column> -->
			        <el-table-column
			            prop="goodsSubtotal"
			            label="商品小计"
			            align="center"
			            show-overflow-tooltip>
			        </el-table-column>
				</el-table>
				<p class="total">订单总额：￥ {{ formDetail.orderAmount }}</p>
			</div>
			<div class="divide">
				<div class="title">费用信息</div>
				<el-form :inline="true" :label-position="labelPosition" label-width="120px" class="demo-form-inline clearfix">
					<el-form-item label="订单总额：" prop="orderAmount">
				    	<template>{{ formDetail.orderAmount }}</template>
				    </el-form-item>
				    <el-form-item label="运费：" prop="freight">
				    	<template>{{ formDetail.freight }}</template>
				    </el-form-item>
				    <el-form-item label="积分：" prop="integralExchenge">
				    	<template>{{ formDetail.integralExchenge }}</template>
				    </el-form-item>
					<el-form-item label="优惠券：" prop="disCountAmount">
				    	<template>{{ formDetail.disCountAmount }}</template>
				    </el-form-item>
				    <el-form-item label="活动：" prop="fullRedutionAmount">
				    	<template>{{ formDetail.fullRedutionAmount }}</template>
				    </el-form-item>
				    <el-form-item label="应付：" prop="actualAmount">
				    	<template>{{ formDetail.actualAmount }}</template>
				    </el-form-item>
				</el-form>
			</div>
			<div class="divide">
				<div class="title">操作记录</div>
				<el-table
				    :data="tableData"
				    border
				    style="width: 100%">
			        <el-table-column
			            prop="createUserName"
			            label="操作者"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            label="操作时间"
			            align="center">
			            <template slot-scope="scope">{{ dateTime(scope.row.createTime) }}</template>
			        </el-table-column>
			        <el-table-column
			            prop="remark"
			            label="描述"
			            align="center"
			            show-overflow-tooltip>
			        </el-table-column>
				</el-table>
			</div>
		</div>

		<!-- 打印 -->
		<el-dialog title="发货单" :visible.sync="dialogPrint" center :lock-scroll="false" width="60%">
			<div class="print-body dialogForm">
				<div class="flex">
					<div class="flex-item">
						<div class="title">订单详情</div>
						<el-form class="demo-form-inline">
							<el-form-item label="下单日期：" prop="createTime">
						    	<template>{{ dateTime(formDetail.createTime) }}</template>
						    </el-form-item>
						    <el-form-item label="订单号：" prop="orderNo">
						    	<template>{{ formDetail.orderNo }}</template>
						    </el-form-item>
						    <el-form-item label="支付方式：" prop="payWay">
						    	<template>{{ formDetail.payWay }}</template>
						    </el-form-item>
						    <!-- <el-form-item label="留言：" prop="remark">
						    	<template>{{ formDetail.remark }}</template>
						    </el-form-item> -->
						</el-form>
					</div>
					<div class="flex-item">
						<div class="title">收货信息</div>
						<el-form class="demo-form-inline">
							<el-form-item label="收件人：" prop="receivingName">
						    	<template>{{ formDetail.receivingName }}</template>
						    </el-form-item>
						    <el-form-item label="收货地址：" prop="receivingAddress">
						    	<template>{{ formDetail.receivingAddress }}</template>
						    </el-form-item>
							<!-- <el-form-item label="邮编：" prop="zipCode">
						    	<template>{{ formDetail.zipCode }}</template>
						    </el-form-item> -->
						</el-form>
					</div>
				</div>
			</div>
			<div class="print-body">
				<div class="title">商品信息</div>
				<el-table
				    :data="tableDetail"
				    style="width: 100%">
			        <el-table-column
			            prop="goodsName"
			            label="商品名称"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="specification"
			            label="商品规格"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="goodsCount"
			            label="数量"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="goodsAmount"
			            label="商品单价"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="goodsSubtotal"
			            label="商品小计"
			            align="center"
			            show-overflow-tooltip>
			        </el-table-column>
				</el-table>
				<p class="total">订单总额：￥ {{ formDetail.orderAmount }}</p>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="handlePrintInfo">打印</el-button> 
			</div> 
		</el-dialog>

		<!-- 发货 -->
		<el-dialog title="发货" :visible.sync="dialogDeliverGoods" center :lock-scroll="false" width="60%">
			<div class="print-body fill">
				<el-form :inline="true" :rules="rules" ref="ruleForm" :model="ruleForm" class="demo-ruleForm" size="small">
					<el-form-item label="物流公司" prop="logisticsCompany">
				        <el-select
                            v-model="ruleForm.logisticsCompany"
                            placeholder="请选择"
                            clearable
                        >
                            <el-option
                                v-for="item in logisticsList"
                                :key="item.dicSubval"
                                :label="item.dicSubname"
                                :value="item.dicSubname"
                            ></el-option>
                        </el-select>
				    </el-form-item>
				    <el-form-item label="快递单号" prop="courierNumber">
				        <el-input v-model="ruleForm.courierNumber" type="number"></el-input>
				    </el-form-item>
				</el-form>
			</div>
			<div class="print-body dialogForm">
				<div class="flex">
					<div class="flex-item">
						<div class="title">订单详情</div>
						<el-form :inline="true" class="demo-form-inline">
							<el-form-item label="下单日期：" prop="createTime">
						    	<template>{{ dateTime(formDetail.createTime) }}</template>
						    </el-form-item>
						    <el-form-item label="订单号：" prop="orderNo">
						    	<template>{{ formDetail.orderNo }}</template>
						    </el-form-item>
						    <el-form-item label="支付方式：" prop="payWay">
						    	<template>{{ formDetail.payWay }}</template>
						    </el-form-item>
						    <!-- <el-form-item label="留言：" prop="remark">
						    	<template>{{ formDetail.remark }}</template>
						    </el-form-item> -->
						</el-form>
					</div>
					<div class="flex-item">
						<div class="title">收货信息</div>
						<el-form :inline="true" class="demo-form-inline">
							<el-form-item label="收件人：" prop="receivingName">
						    	<template>{{ formDetail.receivingName }}</template>
						    </el-form-item>
						    <el-form-item label="收货地址：" prop="receivingAddress">
						    	<template>
						    		{{ formDetail.receivingAddress }}
						    	</template>
						    </el-form-item>
							<!-- <el-form-item label="邮编：" prop="zipCode">
						    	<template>{{ formDetail.zipCode }}</template>
						    </el-form-item> -->
						</el-form>
					</div>
				</div>
			</div>
			<div class="print-body">
				<div class="title">商品信息</div>
				<el-table
				    :data="tableDetail"
				    style="width: 100%">
			        <el-table-column
			            prop="goodsName"
			            label="商品名称"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="specification"
			            label="商品规格"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="goodsCount"
			            label="数量"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="goodsAmount"
			            label="商品单价"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="goodsSubtotal"
			            label="商品小计"
			            align="center"
			            show-overflow-tooltip>
			        </el-table-column>
				</el-table>
				<p class="total">订单总额：￥ {{ formDetail.orderAmount }}</p>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="handleStatus">发货</el-button> 
			</div> 
		</el-dialog>

		<!-- 审核 -->
		<el-dialog title="退货审核" :visible.sync="dialogProcess" center>
			<div class="dialogForm">
				<el-form ref="form" :model="formProcess" size="small">
					<el-form-item label="审核意见：">
					    <el-radio-group v-model="formProcess.yesOrNo">
					    	<el-radio label="同意退货"></el-radio>
					    	<el-radio label="不同意退货"></el-radio>
					    </el-radio-group>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="dialogProcess = false">确定</el-button> 
			</div> 
		</el-dialog>
		<div class="print-detail-list-info" style="display: none;">
			<div class="print-order-detail">
				<div class="print-order-header">
					<h2>发货单</h2>
				</div>
				<div class="print-order-body">
					<div class="print-order-info">
						<div class="print-order-detail-info">
							<h3>订单详情</h3>
							<div>下单日期：{{ dateTime(formDetail.createTime) }}</div>
							<div>订单号：{{ formDetail.orderNo }}</div>
							<div>支付方式：{{ formDetail.payWay }}</div>
						</div>
						<div class="print-receiving-info">
							<h3>收货信息</h3>
							<div>收件人：{{ formDetail.receivingName }}</div>
							<div>收货地址：{{ formDetail.receivingAddress }}</div>
						</div>
					</div>
					<div class="print-order-goods">
						<h3>商品信息</h3>
						<div class="print-table">
							<table cellspacing="0" cellpadding="0" border="0">
								<thead>
									<tr>
										<th>商品名称</th>
										<th>商品规格</th>
										<th>数量</th>
										<th>商品单价</th>
										<th>商品小计</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="(item, index) in tableDetail"
										:key="index"
									>
										<td>{{ item.goodsName }}</td>
										<td>{{ item.specification }}</td>
										<td>{{ item.goodsCount }}</td>
										<td>{{ item.goodsAmount }}</td>
										<td>{{ item.goodsSubtotal }}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<p class="total">订单总额：￥ {{ formDetail.orderAmount }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.border{
	margin-top: 15px;
	border: 1px solid #ccc;
    padding: 15px 15px 0;
    .title{
    	font-weight: bold;
    	margin-bottom: 10px;
    	font-size: 15px;
    }
    .divide{
    	margin-bottom: 15px;
    	border-bottom: 1px solid #ccc;
    	.el-form-item{
        	width: 33.3333%;
        	float: left;
        	margin-right: 0;
        	padding-right: 15px;
        	box-sizing: border-box;
        }
        .total{
        	text-align: right;
        	padding: 0 10px;
        }
    }
    .divide:last-child{
    	border: none;
    	margin-bottom: 0;
    }
    .receive .el-form-item{
		width: 50%;
    }
    .el-table,.total{
    	margin-bottom: 15px;
    }
    .el-table thead{
    	color: #333;
    }
    .el-table thead th,
	.el-table thead tr{
		background-color: #e4e7ed;
		color: #333;
	}
}
.el-dialog{
	.print-body{
		.title{
	    	font-weight: bold;
	    	margin-bottom: 10px;
	    	font-size: 15px;
	    }
	    .total{
	    	text-align: right;
	    	padding: 0 10px;
	    	margin-top: 15px;
	    }
	}
	.dialogForm{
		.flex-item{
			border: 1px solid #ccc;
			padding: 15px 15px 0;
			margin-bottom: 15px;
		}
		.flex-item + .flex-item{
			border-left: none;
		}
		.el-form-item{
			margin: 0;
			margin-right: 20px;
		}
		.el-form-item__label{
			padding: 0 !important;
		}
	}
	.fill{
		margin-bottom: 15px;
	}
}
.print-order-detail {
	color: #333;
	font-size: 14px;
	.print-order-header {
		h2 {
			text-align: center;
			margin-bottom: 20px;
		}
	}
	.print-order-info {
		display: flex;
		margin-bottom: 20px;
		.print-order-detail-info, .print-receiving-info {
			flex: 1;
			padding: 15px;
			border: 1px solid #666;
			h3, div {
				margin-bottom: 15px;
			}
		}
		.print-receiving-info {
			border-left: none;
		}
	}
	.print-order-goods {
		h3 {
			margin-bottom: 10px;
		}
		.print-table {
			margin: 15px 0;
			width: 100%;
			table {
				width: 100%;
				table-layout: fixed;
				border-collapse: separate;
				text-align: center;
				tr {
					background-color: #fff;
					td, th {
						border-bottom: 1px solid #666;
						padding: 12px;
						white-space: normal;
    					word-break: break-all;
					}
					th {
						border-top: 1px solid #666;
					}
				}
			}
		}
		p.total {
			text-align: right;
		}
	}
}
</style>

<script>
import { getGoodsOrderDetail, getGoodsOrderDeliver, exportOrders } from '@/api/mall'
import { convertDate, exportFile } from '@/utils'
import { getDicList } from '@/api/util'

export default {
    data() {
		return {
			labelPosition: 'right',
			formDetail: [],
			tableDetail: [],
			tableData: [],
			dialogPrint: false,
	        dialogDeliverGoods: false,
	        dialogProcess: false,
	        ruleForm: {},
	        logisticsList: [],
	        rules: {
	        	logisticsCompany: [
		            { required: true, message: '请选择', trigger: 'change' }
		        ],
	        	courierNumber: [
		            { required: true, message: '请输入正确的快递单号', trigger: 'blur' },
		            { min: 11, max: 30, message: '长度在 11 到 30 个字符', trigger: 'blur' }
	            ],
	        },
			formProcess: {
        		yesOrNo: '同意退货'
        	},
        	id: ''
		}
	},
	created() {
        let id = this.$route.params && this.$route.params.id;
        this.getDetail(id);
        this.getSelectList()
    },
    computed: {
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        }
    },
	methods: {
		getDetail(id) {
            getGoodsOrderDetail(id).then(res => {
                let data = res.data.data
                this.formDetail = {
                    id: data.orderBaseInfo.id,
                    patientPhone: data.orderBaseInfo.patientPhone,
                    createTime: data.orderBaseInfo.createTime,
                    orderNo: data.orderBaseInfo.orderNo,
                    orderStaus: data.orderBaseInfo.orderStaus,
                    payWay: data.orderBaseInfo.payWay,
                    remark: data.orderBaseInfo.remark,
                    receivingName: data.orderBaseInfo.receivingAddress.receivingName,
                    receivingPhone: data.orderBaseInfo.receivingAddress.receivingPhone,
                    receivingAddress: data.orderBaseInfo.receivingAddress.receivingProvince + data.orderBaseInfo.receivingAddress.receivingCity + data.orderBaseInfo.receivingAddress.receivingCounty + data.orderBaseInfo.receivingAddress.receivingDetail,
                    // zipCode: data.orderBaseInfo.zipCode,
                    actualAmount: data.orderBaseInfo.actualAmount,
                    orderAmount: data.orderBaseInfo.orderAmount,
                    freight: data.orderBaseInfo.freight,
                    integralExchenge: data.orderBaseInfo.integralExchenge,
                    disCountAmount: data.orderBaseInfo.disCountAmount,
                    payTime: data.orderBaseInfo.payTime,
                    isInvoice: data.orderBaseInfo.isInvoice,
                    invoiceRisetype: data.orderBaseInfo.invoice.invoiceRisetype,
                    taxpayerNum: data.orderBaseInfo.invoice.taxpayerNum,
                    logisticsCompany: data.orderBaseInfo.logisticsCompany,
                    fullRedutionAmount: data.orderBaseInfo.fullRedutionAmount,
                }
                this.ruleForm = {
                	id: data.orderBaseInfo.id,
                	logisticsCompany: data.orderBaseInfo.logisticsCompany,
                	logisticsCompanyCode: data.orderBaseInfo.logisticsCompany,
                	courierNumber: data.orderBaseInfo.courierNumber,
                	orderStatus: 1
                }
                this.tableDetail = data.orderDetails
                for(let item of this.tableDetail){
                	item.goodsSubtotal = item.goodsAmount * item.goodsCount
                }
                this.tableData = data.dealLog
            })
        },
        getSelectList() {
            getDicList('D010').then(res => {
                this.logisticsList = res.data
            })
        },
        handlePrint() {
        	this.dialogPrint = true
        	let id = this.formDetail.id
        	this.getDetail(id)
		},
		handlePrintInfo() {
			let context = document.querySelector('.print-detail-list-info')
			let copy = context.cloneNode(true)
			copy.style.display = 'block'
            document.body.appendChild(copy)
            window.print()
            document.body.removeChild(copy)	
		},
        handleDeliver() {
        	this.dialogDeliverGoods = true
        	let id = this.formDetail.id
        	this.getDetail(id)
        },
        handleStatus() {
        	this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                	let logisticsCompany = []
		        	for(let item of this.logisticsList){
		        		logisticsCompany.push(item.dicSubname)
		        	}
		        	var index = logisticsCompany.indexOf(this.ruleForm.logisticsCompany)
                	this.ruleForm.logisticsCompanyCode = this.logisticsList[index].dicSubval
                	getGoodsOrderDeliver(this.ruleForm).then(res=> {
		                const data = res.data;
                		this.$router.replace({path: '/mall/order/list'})
		            })
		            this.dialogDeliverGoods = false
                }
            })
        },
    }

}
</script>