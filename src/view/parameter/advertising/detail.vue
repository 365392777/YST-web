<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold" :to="{ path: '/parameter/advertising/list' }">广告管理</el-breadcrumb-item>
            <el-breadcrumb-item>查看广告</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="preview-container">
            <div class="detail-item">
                <div class="detail-item-title">广告位置</div>
                <div class="detail-item-content">{{ previewData.place }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">标题</div>
                <div class="detail-item-content">{{ previewData.head }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">图片</div>
                <div class="detail-item-content">
                    <div class="img preview-img">
                        <img :src="adImageUrl + previewData.image" class="preview-img" v-if="previewData.image">
                    </div>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">跳转类型</div>
                <div class="detail-item-content">{{ previewData.dispatcherType }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">排序</div>
                <div class="detail-item-content">{{ previewData.sort }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">编辑时间</div>
                <div class="detail-item-content">{{ dateTime(previewData.updateTime) }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title"></div>
                <div class="detail-item-content">
                    <router-link to="/parameter/advertising/list">
                        <el-button size="small">返回</el-button>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getAdvertisingDetail } from '@/api/parameter'
import { convertDate } from '@/utils'
import { adImageUrl } from '@/utils/dev'

export default {
    data() {
        return {
            previewData: {},
            adImageUrl,
        }
    },
    created() {
        let id = this.$route.params && this.$route.params.id
        this.getDetail(id)
    },
    computed: {
        imageView() {
            return 'data:image/*;base64,' + this.previewData.image
        },
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        }
    },
    methods: {
        getDetail(id) {
            getAdvertisingDetail(id).then(res => {
                let data = res.data
                this.previewData = data
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.preview-container {
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
        /*height: 80px;*/
        display: inline-block;
        margin-right: 20px;
    }
}
</style>
