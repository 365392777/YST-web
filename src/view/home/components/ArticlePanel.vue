<template>
    <div class="article-panel-container">
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
                        <i class="home-icon icon-article-total"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.totalArtAmount }}
                        </div>
                        <div class="card-panel-text">文章总数</div>
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
                        <i class="home-icon icon-drafts"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.draftArtAmount }}
                        </div>
                        <div class="card-panel-text">草稿箱</div>
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
                        <i class="home-icon icon-pending-article-comment"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.pendingArtCommmentAmount }}
                        </div>
                        <div class="card-panel-text">待审文章评论</div>
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
                        <i class="home-icon icon-history-visit"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.totalArtVisits }}
                        </div>
                        <div class="card-panel-text">历史访问量</div>
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
                        <i class="home-icon icon-yesterday-visit"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.yesterdayArtVisits }}
                        </div>
                        <div class="card-panel-text">昨日访问量</div>
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
.icon-article-total {
    background-image: url('../../../assets/home/article-total.png');
}
.icon-drafts {
    background-image: url('../../../assets/home/drafts.png');
}
.icon-pending-article-comment {
    background-image: url('../../../assets/home/pending-article-comment.png');
}
.icon-history-visit {
    background-image: url('../../../assets/home/history-visit.png');
}
.icon-yesterday-visit {
    background-image: url('../../../assets/home/yesterday-visit.png');
}
</style>
