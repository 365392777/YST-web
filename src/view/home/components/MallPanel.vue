<template>
    <div class="mall-panel-container">
        <el-row
            :gutter="40"
            class="panel-group"
        >
            <el-col
                :xs="12"
                :sm="12"
                :lg="6"
                class="card-panel-col"
            >
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper">
                        <i class="home-icon icon-pending-order"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.ordersAmount }}
                        </div>
                        <div class="card-panel-text">待处理订单</div>
                    </div>
                </div>
            </el-col>
            <el-col
                :xs="12"
                :sm="12"
                :lg="6"
                class="card-panel-col"
            >
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper">
                        <i class="home-icon icon-pending-assessment"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.tGoodsCommentsAmount }}
                        </div>
                        <div class="card-panel-text">待审商品评价</div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-row
            :gutter="40"
            class="panel-group"
        >
            <el-col
                :xs="12"
                :sm="12"
                :lg="6"
                class="card-panel-col"
            >
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper">
                        <i class="home-icon icon-goods-total"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.totalGoodsAmount }}
                        </div>
                        <div class="card-panel-text">商品总数</div>
                    </div>
                </div>
            </el-col>
            <el-col
                :xs="12"
                :sm="12"
                :lg="6"
                class="card-panel-col"
            >
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper">
                        <i class="home-icon icon-order-total"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.yesterdayOrders }}
                        </div>
                        <div class="card-panel-text">昨日订单总数</div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    props: {
        homeData: {
            type: Object,
            default: {}
        }
    }
}
</script>

<style lang="scss" scoped>
.icon-pending-order {
    background-image: url('../../../assets/home/pending-order.png');
}
.icon-pending-assessment {
    background-image: url('../../../assets/home/pending-assessment.png');
}
.icon-goods-total {
    background-image: url('../../../assets/home/goods-total.png');
}
.icon-order-total {
    background-image: url('../../../assets/home/order-total.png');
}
</style>
