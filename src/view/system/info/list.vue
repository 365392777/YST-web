<template>
	<div class="page-container">
		<el-tabs v-model="tabType" type="card" class="secondTab" @tab-click="handleClick">
		    <el-tab-pane label="服务协议与隐私声明" name="agreement" class="statement">
		    	<agreement-list ref="agreement" />
		    </el-tab-pane>
		    <el-tab-pane label="常见问题" name="problem" :lazy="true">
		    	<problem-list ref="problem" />
		    </el-tab-pane>
		    <el-tab-pane label="声明" name="statement" :lazy="true" class="statement">
		    	<statement-list ref="statement" />
		    </el-tab-pane>
		</el-tabs>
		
	</div>
</template>

<script>
import agreementList from './components/agreementList'
import problemList from './components/problemList'
import statementList from './components/statementList'
export default {
    data() {
        return {
			tabType: 'agreement',
			currentTab: 'agreement'
        };
    },
    methods: {
        handleClick(tab, event) {
			if (this.currentTab != this.tabType && this.$refs[this.currentTab].handleBack) {
				this.$refs[this.currentTab].handleBack()
			}
			this.currentTab = this.tabType
        },
    },
    components: {
		agreementList,
		problemList,
		statementList
	}
};
</script>