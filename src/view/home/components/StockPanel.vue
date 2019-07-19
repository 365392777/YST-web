<template>
    <div class="stock-panel-container">
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
                        <i class="home-icon icon-stock-warning"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.stockEaryWarningGoodsAmount }}
                        </div>
                        <div class="card-panel-text">库存预警商品</div>
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
                        <i class="home-icon icon-safety-warning"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.safetyEaryWaringGoodsAmount }}
                        </div>
                        <div class="card-panel-text">安全预警商品</div>
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
                        <i class="home-icon icon-out-stock"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.yesterdayStockOut }}
                        </div>
                        <div class="card-panel-text">昨日出库量</div>
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
                        <i class="home-icon icon-put-stock"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.yesterdayStockIn }}
                        </div>
                        <div class="card-panel-text">昨日入库量</div>
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
.icon-stock-warning {
    background-image: url('../../../assets/home/stock-warning.png');
}
.icon-safety-warning {
    background-image: url('../../../assets/home/safety-warning.png');
}
.icon-goods-total {
    background-image: url('../../../assets/home/goods-total.png');
}
.icon-out-stock {
    background-image: url('../../../assets/home/out-stock.png');
}
.icon-put-stock {
    background-image: url('../../../assets/home/put-stock.png');
}
</style>
