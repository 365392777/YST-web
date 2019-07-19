<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">抽奖记录</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tabs type="card">
            <el-tab-pane label="待发货">
                <shipping-list></shipping-list>
            </el-tab-pane>
            <el-tab-pane
                label="已发货"
                :lazy="true"
            >
                <shipped-list></shipped-list>
            </el-tab-pane>
            <el-tab-pane
                label="其他"
                :lazy="true"
            >
                <other-list></other-list>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ShippingList from './components/ShippingList'
import ShippedList from './components/ShippedList'
import OtherList from './components/OtherList'

export default {
    components: { 
        ShippingList,
        ShippedList,
        OtherList,
    }
}
</script>
