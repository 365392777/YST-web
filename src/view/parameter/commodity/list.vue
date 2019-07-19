<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">商品参数管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs type="card">
            <el-tab-pane label="商品分类">
                <classify-list />
            </el-tab-pane>
            <el-tab-pane label="商品品牌" :lazy="true">
                <brand-list />
            </el-tab-pane>
            <el-tab-pane label="商品供应商" :lazy="true">
                <supplier-list />
            </el-tab-pane>
            <el-tab-pane label="商品运费规则" :lazy="true">
                <rule-list />
            </el-tab-pane>
            <el-tab-pane label="商品规格模型" :lazy="true">
                <specification-list />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import classifyList from './components/classifyList'
import brandList from './components/brandList'
import supplierList from './components/supplierList'
import ruleList from './components/ruleList'
import specificationList from './components/specificationList'

export default {
    components: { 
        classifyList,
        brandList,
        supplierList,
        ruleList,
        specificationList
    }
}
</script>
