<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">医生用户</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs type="card">
            <el-tab-pane label="待审核">
                <audit-list></audit-list>
            </el-tab-pane>
            <el-tab-pane
                label="已审核"
                :lazy="true"
            >
                <audit-list :is-audit="true"></audit-list>
            </el-tab-pane>
            <el-tab-pane
                label="咨询评价"
                :lazy="true"
            >
                <consult-list></consult-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import auditList from './components/auditList'
import consultList from './components/consultList'

export default {
    components: { auditList, consultList }
}
</script>

