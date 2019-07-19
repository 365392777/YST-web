<template>
	<div class="page-container">
		<el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
		    <el-breadcrumb-item class="bold" :to="{ path: '/mall/coupons/list' }">优惠券管理</el-breadcrumb-item>
		</el-breadcrumb>
        <el-tabs type="card" @tab-click="handleSwitch">
			<el-tab-pane label="待发放">
				<waiting-list ref="childData" />
			</el-tab-pane>
			<el-tab-pane label="已发放" :lazy="true">
				<already-list ref="childData" />
			</el-tab-pane>
			<el-tab-pane label="已过期" :lazy="true">
				<overdue-list ref="childData" />
			</el-tab-pane>
		</el-tabs>
    </div>
</template>

<script>
import waitingList from './components/waitingList'
import alreadyList from './components/alreadyList'
import overdueList from './components/overdueList'
export default {
	components: {
		waitingList,
		alreadyList,
		overdueList
	},
	methods: {
		handleSwitch() {
			// console.log(this.$refs.childData.total)
		}
	}
}
</script>