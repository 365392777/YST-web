<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold" :to="{ path: '/parameter/feedback/list' }">意见反馈</el-breadcrumb-item>
            <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="feedback-detail-container">
            <div class="detail-item">
                <div class="detail-item-title">内容</div>
                <div class="detail-item-content">{{ detailData.feedBackContent }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">用户</div>
                <div class="detail-item-content">{{ detailData.userPhone }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">图片</div>
                <div class="detail-item-content">
                    <!-- <div class="img preview-img" style="background-image: url(&quot;small.img&quot;);"></div> -->
                    <div class="img preview-img" v-for="feedBackImage in detailData.feedBackImage" :style="{ 'background-image': 'url(' + feedBackImageUrl + feedBackImage + ')' }" v-if="detailData.feedBackImage">
                        <!-- <img :src="feedBackImageUrl + detailData.feedBackImage" v-if="detailData.feedBackImage"> -->
                    </div>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">反馈时间</div>
                <div class="detail-item-content">{{ dateTime(detailData.createTime) }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">跟进状态</div>
                <div class="detail-item-content">{{ detailData.dealStatus }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">跟进</div>
                <div class="detail-item-content">{{ detailData.dealContent }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title"></div>
                <div class="detail-item-content">
                    <router-link to="/parameter/feedback/list">
                        <el-button size="small" >返回</el-button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getFeedbackDetail } from '@/api/parameter'
import { convertDate } from '@/utils'
import { feedBackImageUrl } from '@/utils/dev'

export default {
    data() {
        return {
            detailData: {},
            feedBackImageUrl,
        }
    },
    created() {
        let id = this.$route.params && this.$route.params.id
        this.getDetail(id)
    },
    computed: {
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        },
        imgBase() {
            return function(image) {
                return 'data:image/*;base64,' + image
            }
        },
    },
    methods: {
        getDetail(id) {
            getFeedbackDetail(id, 'detail').then(res => {
                this.detailData = res.data.data

                if(this.detailData.feedBackImage){
                    this.detailData.feedBackImage = this.detailData.feedBackImage.split(",")
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.feedback-detail-container {
    .detail-item {
        margin-bottom: 20px;
        display: flex;
        .detail-item-title {
            text-align: right;
            display: inline-block;
            padding: 8px 12px 8px 0;
            width: 80px;
            font-weight: bold;
        }
        .detail-item-content {
            padding: 8px 0;
        }
    }
    .preview-img {
        width: 178px;
        height: 178px;
        display: inline-block;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        margin-right: 20px;
        img{
            width: 100%;
        }
    }
}
</style>
