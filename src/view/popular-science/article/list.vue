<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">文章管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs type="card">
            <el-tab-pane label="已发布">
                <published-list></published-list>
            </el-tab-pane>
            <el-tab-pane
                label="草稿箱"
                :lazy="true"
            >
                <drafts-list></drafts-list>
            </el-tab-pane>
            <el-tab-pane
                label="回收站"
                :lazy="true"
            >
                <recycled-list></recycled-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import PublishedList from './components/PublishedList'
import DraftsList from './components/DraftsList'
import RecycledList from './components/RecycledList'

export default {
    components: {
        PublishedList,
        DraftsList,
        RecycledList
    },
}
</script>
