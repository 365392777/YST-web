<template>
	<div class="page-container">
		<el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
		    <el-breadcrumb-item class="bold" :to="{ path: '/mall/activity/list' }">活动管理</el-breadcrumb-item>
		</el-breadcrumb>
        <el-tabs type="card">
			<el-tab-pane label="未开始">
				<not-activity/>
			</el-tab-pane>
			<el-tab-pane label="进行中" :lazy="true">
				<having-activity />
			</el-tab-pane>
			<el-tab-pane label="已结束" :lazy="true">
				<already-activity />
			</el-tab-pane>
		</el-tabs>
    </div>
</template>

<script>
import notActivity from './components/notActivity'
import havingActivity from './components/havingActivity'
import alreadyActivity from './components/alreadyActivity'
export default {
	components: {
		notActivity,
		havingActivity,
		alreadyActivity
	}
}
</script>