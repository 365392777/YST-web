<template>
    <div class="page-container">
        <mall-panel :home-data="homeData" v-if="homeData.authorityMap.hasMallAuthority"></mall-panel>
        <article-panel :home-data="homeData" v-if="homeData.authorityMap.hasArticleAuthority"></article-panel>
        <stock-panel :home-data="homeData" v-if="homeData.authorityMap.hasWarehouseAuthority"></stock-panel>
       <user-panel :home-data="homeData" v-if="homeData.authorityMap.hasSystemAuthority"></user-panel> 
    </div>
</template>

<script>
import { homeStatistical } from '@/api/util'
import MallPanel from './components/MallPanel'
import ArticlePanel from './components/ArticlePanel'
import StockPanel from './components/StockPanel'
import UserPanel from './components/UserPanel'

export default {
    components: {
        MallPanel,
        ArticlePanel,
        StockPanel,
        UserPanel
    },
    data() {
        return {
            homeData: {}
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            homeStatistical().then(res => {
                const resData = res.data
                console.log(resData,'123')
                if (resData.flag == 'success') {
                    this.homeData = resData.data
                    console.log(this.homeData.authorityMap,'456')
                    console.log(this.homeData.authorityMap.hasMallAuthority);
                }
            })
        },
    }
}
</script>


<style lang="scss" scoped>
.page-container {
    background-color: #f0f2f5;
    padding: 32px;
    min-height: calc(100vh - 50px);
    /deep/ {
        .panel-group {
            margin-top: 18px;
            .card-panel-col {
                margin-bottom: 32px;
            }
            .card-panel {
                height: 158px;
                font-size: 12px;
                position: relative;
                overflow: hidden;
                color: #666;
                background: #fff;
                box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
                border-color: rgba(0, 0, 0, 0.05);
                .card-panel-icon-wrapper {
                    float: left;
                    margin: 14px 0 14px 14px;
                    // padding: 16px;
                    transition: all 0.38s ease-out;
                    border-radius: 6px;
                }
                .card-panel-icon {
                    float: left;
                    font-size: 48px;
                }
                .home-icon {
                    height: 130px;
                    width: 130px;
                    display: block;
                    background-repeat: no-repeat;
                }
                .card-panel-description {
                    float: right;
                    font-weight: bold;
                    margin: 50px 26px;
                    margin-left: 0px;
                    .card-panel-text {
                        line-height: 18px;
                        color: rgba(0, 0, 0, 0.45);
                        font-size: 16px;
                        margin-top: 12px;
                        text-align: right;
                    }
                    .card-panel-num {
                        text-align: right;
                        font-size: 20px;
                    }
                }
            }
        }
    }
}
</style>
