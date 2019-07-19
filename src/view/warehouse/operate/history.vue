<template>
	<div class="page-container">
		<el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
		    <el-breadcrumb-item class="bold" :to="{ path: '/warehouse/operate/list' }">出入库管理</el-breadcrumb-item>
		    <el-breadcrumb-item>出入库记录</el-breadcrumb-item>
		</el-breadcrumb>
        <el-tabs type="card">
			<el-tab-pane label="出库记录">
				<out-record />
			</el-tab-pane>
			<el-tab-pane label="入库记录" :lazy="true">
				<in-record />
			</el-tab-pane>
		</el-tabs>
    </div>
</template>

<script>
import outRecord from './components/outRecord'
import inRecord from './components/inRecord'
export default {
	components: {
		outRecord,
		inRecord,
	}
}
</script>