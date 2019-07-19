<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold" :to="{ path: '/parameter/feedback/list' }">意见反馈</el-breadcrumb-item>
            <el-breadcrumb-item>跟进</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            size="small"
            :model="formData"
            label-position="right"
            label-width="80px"
            style="width: 50%;"
            ref="dataForm"
            :rules="rules"
            @submit.native.prevent
        >
            <el-form-item label="内容">
                {{ detailData.feedBackContent }}
            </el-form-item>
            <el-form-item label="用户">
                {{ detailData.userPhone }}
            </el-form-item>
            <el-form-item label="图片">
                <!-- <div class="img preview-img" style="background-image: url(&quot;small.img&quot;);"></div> -->
                <div class="img preview-img" v-for="feedBackImage in detailData.feedBackImage" :style="{ 'background-image': 'url(' + feedBackImageUrl + feedBackImage + ')' }" v-if="detailData.feedBackImage"></div>
            </el-form-item>
            <el-form-item label="反馈时间">
                {{ dateTime(detailData.createTime) }}
            </el-form-item>
            <el-form-item label="跟进状态" prop="dealStatus">
                <el-select v-model="formData.dealStatus">
                    <el-option
                        v-for="item in dealStatusList"
                        :key="item.dicSubval"
                        :label="item.dicSubname"
                        :value="item.dicSubval"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="跟进" prop="dealContent">
                <el-input type="textarea" :rows="6" v-model="formData.dealContent"></el-input>
            </el-form-item>
            <el-form-item>
                <router-link to="/parameter/feedback/list">
                    <el-button>返回</el-button>
                </router-link>
                <el-button type="primary" class="ml20" @click="handleSave">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getFeedbackDetail, dealFeedback } from '@/api/parameter'
import { getDicList } from '@/api/util'
import { convertDate } from '@/utils'
import { feedBackImageUrl } from '@/utils/dev'

export default {
    data() {
        return {
            formData: {
                id: '',
                dataRemoveType: 0,
                dealStatus: '',
                dealContent: '',
            },
            detailData: {},
            dealStatusList: [],
            rules: {
                dealStatus: [{required: true, message: '请选择跟进状态', trigger: 'blur'}],
                dealContent: [{required: true, message: '跟进内容不能为空', trigger: 'blur'}]
            },
            submitLoading: false,
            feedBackImageUrl,
        }
    },
    created() {
        let id = this.$route.params && this.$route.params.id
        this.getDetail(id)
        this.getSelectList()
    },
    computed: {
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        }
    },
    methods: {
        getDetail(id) {
            getFeedbackDetail(id, 'deal').then(res => {
                this.detailData = res.data.data
                this.formData = {
                    id: res.data.data.id,
                    dataRemoveType: 0,
                    dealStatus: res.data.data.dealStatus,
                    dealContent: res.data.data.dealContent,
                }
            })
        },
        getSelectList() {
            getDicList('D005').then(res => {
                this.dealStatusList = res.data
            })
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.submitLoading = true
                    dealFeedback(this.formData).then(res => {
                        const data = res.data
                        if (data.flag == 'success') {
                            this.$message.success('提交成功')
                            this.$router.replace('/parameter/feedback/list')
                        }
                        this.submitLoading = false
                    }).catch(() => {
                        this.submitLoading = false
                    })
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.preview-img {
    width: 178px;
    height: 178px;
    display: inline-block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    margin-right: 20px;
}
</style>
