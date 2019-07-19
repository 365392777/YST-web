<template>
<!-- 商品管理-编辑商品 -->
	<div class="page-container">
		<el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
		    <el-breadcrumb-item class="bold" :to="{ path: '/mall/goods/list' }">商品管理</el-breadcrumb-item>
		    <el-breadcrumb-item>编辑商品</el-breadcrumb-item>
		</el-breadcrumb>
        <el-tabs type="card">
					<!-- 商品基本信息 -->
			<el-tab-pane label="商品基本信息">
				<base-info  @handleFsmpStatus='handleFsmpStatus' @isFsmpStatus='isFsmpStatus' @isFsmps='isFsmps' :is-edit="true" />
			</el-tab-pane>
			<!-- 商品规格 -->
			<el-tab-pane label="商品规格" :lazy="true">
				<spec-list :is-edit="true" />
			</el-tab-pane>
			<el-tab-pane label="商品图片" :lazy="true">
				<picture-list :is-edit="true" />
			</el-tab-pane>
			<el-tab-pane label="积分折扣" :lazy="true">
				<integral-discount :is-edit="true" />
			</el-tab-pane>
			<el-tab-pane label="FSMP营养素信息" :lazy="true" v-if="isFsmpshow=='1'? false:true" >
				<nutrient :is-edit="true" />
			</el-tab-pane>
			<!-- <el-tab-pane label="价格和医院" :lazy="true">
				<price-hospital :is-edit="true" />
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
import nutrient from './components/nutrient'

export default {
	components: {
		baseInfo,
		specList,
		pictureList,
		integralDiscount,
		priceHospital,
		nutrient
	},
	data() {
		return {
				FsmpStatus:'',//FSMP营养素信息组件的状态,是否隐藏,当勾选上了 是否FSMP 中的是的值为0,才渲染 FSMP营养素信息组件
				isFsmpshow:'',//FSMP营养素信息组件的状态,是否隐藏,当勾选上了 是否FSMP 中的是的值为0,才渲染 FSMP营养素信息组件
		}
	},

	methods: {
		// 父组件定义接受baseInfo子组件的状态值
		handleFsmpStatus(FsmpStatus){
			this.FsmpStatus=FsmpStatus //控制营养Fsmp信息组件显示隐藏,如果选是/显示,如果否则隐藏
		},	// 父组件定义接受baseInfo子组件的状态值
	   isFsmpStatus(FsmpStatu){
				console.log(FsmpStatu,'我是编辑页的父组件')
				this.isFsmpshow=FsmpStatu
      },	// 父组件定义接受baseInfo子组件的状态值
	   isFsmps(isFsmps){
				// console.log(isFsmps,'-----?')
				if(isFsmps=='是'){
					this.isFsmpshow=0
				}else{
					this.isFsmpshow=1
				}
      }
	},

}
</script>