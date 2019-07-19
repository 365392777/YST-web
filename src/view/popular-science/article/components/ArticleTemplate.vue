<template>
    <div class="article-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
                :to="{ path: '/popular-science/article/list' }"
            >
                文章管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{ breadcrumbMap[isEdit] }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :model="formData"
            :rules="rules"
            ref="dataForm"
            label-position="right"
            size="small"
            label-width="150px"
            @submit.native.prevent
        >
            <el-form-item label="标题" prop="head">
                <el-input
                    v-model="formData.head"
                    maxlength="30"
                    placeholder="不超过30字"
                ></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
                <el-input v-model="formData.author" maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="label">
                <el-input
                    v-model="formData.label"
                    placeholder="不超过5个标签，多个标签以逗号隔开"
                ></el-input>
            </el-form-item>
            <el-form-item label="封面" prop="image">
                <el-upload
                    class="avatar-uploader"
                    action="http://192.168.0.47:8080/paramOperate/tAdvertisementOPerate.int.do"
                    :http-request="upload"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    accept="image/jpeg,image/jpg,image/png"
                >
                    <img
                        v-if="formData.image"
                        :src="imageView"
                        class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="分类目录" prop="categoryId">
                <el-select v-model="formData.categoryId">
                    <el-option
                        v-for="item in categoryList"
                        :key="item.id"
                        :value="item.id"
                        :label="item.category"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="阅读本文获取积分数" prop="integral">
                <el-input
                    v-model.number="formData.integral"
                    v-num-digit="formData.integral"
                ></el-input>
            </el-form-item>
            <el-form-item label="虚拟阅读数" prop="readings">
                <el-input
                    v-model.number="formData.readings"
                    v-num-digit="formData.readings"
                ></el-input>
            </el-form-item>
            <el-form-item label="虚拟点赞数" prop="likes">
                <el-input
                    v-model.number="formData.likes"
                    v-num-digit="formData.likes"
                ></el-input>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <wang-editor
                    ref="editor"
                    @input="updateContent"
                    :value="formData.content"
                ></wang-editor>
            </el-form-item>
            <el-form-item>
                <router-link to="/popular-science/article/list">
                    <el-button>返回</el-button>
                </router-link>
                <el-button type="primary" class="ml20" @click="handleSave">
                    确定
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import WangEditor from '@/components/WangEditor'
import { uploadImage } from '@/api/util'
import { addArticle, getCategoryList, getArticleDetail } from '@/api/popular-science'

export default {
    components: { WangEditor },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            breadcrumbMap: {
                false: '新增文章',
                true: '编辑文章'
            },
            formData: {
                head: '',
                author: '',
                label: '',
                image: '',
                categoryId: null,
                integral: '',
                readings: '',
                likes: '',
                content: '',
            },
            rules: {
                head: [{ required: true, message: '请输入标题' }],
                author: [{ required: true, message: '请输入作者' }],
                label: [{ required: true, message: '请输入标签' }],
                image: [{ required: true, message: '请上传图片' }],
                categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
                content: [{ required: true, message: '请输入内容' }],
            },
            submitLoading: false,
            categoryList: [],
        }
    },
    created() {
        this.getCategory()
        if (this.isEdit) {
            let id = this.$route.params && this.$route.params.id
            this.getDetail(id)
        }
    },
    computed: {
        imageView() {
            return 'data:image/png;base64,' + this.formData.image
        }
    },
    methods: {
        getCategory() {
            let data = {
                id: 0,
                category: '',
            }
            getCategoryList(data).then(res => {
                const resData = res.data
                this.categoryList = resData.data
            })
        },
        getDetail(id) {
            getArticleDetail(id).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    const data = resData.data
                    this.formData = {
                        id,
                        head: data.head,
                        author: data.author,
                        label: data.label,
                        image: data.image,
                        categoryId: data.categoryId,
                        integral: data.integral,
                        readings: data.readings,
                        likes: data.likes,
                        content: data.content,
                        recommend: data.recommend,
                        status: data.status
                    }
                    this.$refs.editor.setEditorContent(this.formData.content)
                } else {
                    this.$message.error('获取失败')
                }
            })
        },
        upload(content) {
            const fd = new FormData()
            fd.append('file', content.file)
            let progressLoad = progressEvent => {
                let p = progressEvent
                content.file.percent =
                    (progressEvent.loaded / progressEvent.total) * 100
                content.onProgress(content.file)
            }
            uploadImage(fd, progressLoad).then(res => {
                if (res.data.success == 'true') {
                    this.formData.image = res.data.data
                }
            })
        },
        beforeAvatarUpload(file) {
            const isImage = /^image\/(jpeg|png|jpg)$/.test(file.type)
            const isLtM = file.size / 1024 / 1024 < 3

            if (!isImage) {
                this.$message.error('上传头像图片只能是 JPG 和 PNG 格式!')
            }
            if (!isLtM) {
                this.$message.error('上传图片大小不能超过 3MB!')
            }
            return isImage && isLtM
        },
        updateContent(val) {
            this.formData.content = val
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.submitLoading = true
                    addArticle(this.formData).then(res => {
                        const resData = res.data
                        if (resData.code == '10001') {
                            let message = !this.isEdit ? '新增成功' : '修改成功'
                            this.$message.success(message)
                            this.$router.replace('/popular-science/article/list')
                        }
                        this.submitLoading = false
                    }).catch(err => {
                        this.submitLoading = false
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.article-container /deep/ .el-form-item {
    margin-bottom: 22px;
}

.avatar-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader /deep/ .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
