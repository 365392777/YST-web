<template>
<!-- 商品管理-添加商品 -->
	<div class="page-container">
		<el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
		    <el-breadcrumb-item class="bold" :to="{ path: '/mall/goods/list' }">商品管理</el-breadcrumb-item>
		    <el-breadcrumb-item>新增商品</el-breadcrumb-item>
		</el-breadcrumb>
        <el-tabs v-model="activeName" type="card" @click.native="validBase">
<!-- 商品基本信息 -->
			<el-tab-pane label="商品基本信息" name="base">
				<!-- 接受子组件传递过来的FsmpStatus状态值-控制Fsmp营养素信息组件显示隐藏 -->
				<base-info @handleFsmpStatus='handleFsmpStatus' :base-id.sync="baseId" />
			</el-tab-pane>
<!-- 商品规格 -->
			<el-tab-pane label="商品规格" name="spec" :lazy="true" :disabled="baseId == ''">
				<spec-list :base-id="baseId" />
			</el-tab-pane>
			<el-tab-pane label="商品图片" name="picture" :lazy="true" :disabled="baseId == ''" >
				<picture-list :base-id="baseId" />
			</el-tab-pane>
			
			<el-tab-pane label="积分折扣" name="integral" :lazy="true" :disabled="baseId == ''">
				<integral-discount :base-id="baseId" />
			</el-tab-pane>
			
			<!-- FSMP营养素信息 nutrient-->
			<el-tab-pane label="FSMP营养素信息" name="nutrient" :lazy="true" v-if="FsmpStatus=='1'? false:true" :disabled="baseId == ''"> 
				<!-- nutrient营养素信息  组件 -->
				<nutrient :base-id="baseId"  />
			</el-tab-pane>

			<!-- <el-tab-pane label="价格和医院" :lazy="true" >
				<price-hospital />
			</el-tab-pane> -->
		</el-tabs>
    </div>
</template>

<script>
import baseInfo from './components/baseInfo'
import specList from './components/specList'
import pictureList from './components/pictureList'
import integralDiscount from './components/integralDiscount'
import priceHospital from './components/priceHospital'
	//  FSMP营养素信息 nutrient
import nutrient from './components/nutrient'
export default {
	components: {
		baseInfo,
		specList,
		pictureList,
		integralDiscount,
		priceHospital,
		// 注册FSMP营养素信息组件
		nutrient
	},
	data() {
		return {
			activeName: 'base',
			baseId: '',
			FsmpStatus:'',//FSMP营养素信息组件的状态,是否隐藏,当勾选上了 是否FSMP 中的是的值为0,才渲染 FSMP营养素信息组件
		}
	},
	mounted () {
		//获取本地存储数据
		this.FsmpStatus=localStorage.getItem('FsmpStatus')
		console.log(this.FsmpStatus,'我是页面加载的时候')
	},
	methods: {
		// hack
		validBase(event) {
			let target = event.target
			if (target.id.indexOf('tab-') != -1 && target.id.indexOf('base') == -1 && this.baseId == '') {
				this.$message.error('请先填写商品基本信息并保存')
			}
		},
		// 父组件定义接受子组件的状态值
		handleFsmpStatus(FsmpStatus){
			// console.log(FsmpStatus,'我是付组件传递+++++++')
			this.FsmpStatus=FsmpStatus //控制营养Fsmp信息组件显示隐藏,如果选是/显示,如果否则隐藏
		}
	}
}
</script>

<style lang="scss" scoped>
.page-container /deep/ {
	.el-tabs__item.is-disabled {
		color: #303133;
		cursor: pointer;
		&:hover {
			color: #409EFF;
			cursor: pointer;
		}
	}
}
</style>
