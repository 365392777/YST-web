<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">客服信息管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button
            type="close"
            size="small"
            v-text="'返回'"
            v-if="dialogStatus == 'update' && this.previewData.id > 0"
            @click="handleBack"
        ></el-button>
        <el-button
            type="primary"
            size="small"
            v-text="textMap[dialogStatus]"
            :loading="submitLoading"
            @click="handleToggle"
        ></el-button>
        <div class="page-content">
            <div class="preview-container" v-if="dialogStatus == 'preview'">
                <div class="detail-item">
                    <div class="detail-item-title">微信二维码：</div>
                    <div class="detail-item-content">
                        <div class="img preview-img">
                            <img :src="getCustomerImage" class="preview-img" v-if="previewData.imageId">
                        </div>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-title">客服电话：</div>
                    <div class="detail-item-content">{{ previewData.mobile }}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-item-title">客服上班时间：</div>
                    <div class="detail-item-content">{{ previewData.workTime }}</div>
                </div>
            </div>
            <div class="customer-form-container clearfix" v-if="dialogStatus == 'update'">
                <el-form
                    ref="dataForm"
                    :rules="rules"
                    :model="formData"
                    label-position="right"
                    label-width="110px"
                    size="small"
                    style="width: 500px;"
                    class="fl"
                >
                    <el-form-item label="微信二维码">
                        <el-upload
                            class="avatar-uploader"
                            action="http://192.168.0.47:8080/paramOperate/tAdvertisementOPerate.int.do"
                            :http-request="upload"
                            :show-file-list="false"
                            :before-upload="beforeAvatarUpload"
                            :on-success="handleAvatarSuccess"
                            accept="image/jpeg,image/jpg,image/png"
                        >
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <i v-if="imageUrl" class="upload-delete-span el-icon-circle-close-outline" @click="handleDeleteImage"></i>
                    </el-form-item>
                    <el-form-item label="客服电话" prop="mobile">
                        <el-input
                            type="text"
                            v-model.trim="formData.mobile"
                            style="width: 300px;"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="客服上班时间" prop="workTime">
                        <el-input
                            type="text"
                            v-model.number="formData.workTime"
                            style="width: 300px;"
                        ></el-input>
                    </el-form-item>
                </el-form>
                <div class="example-container clearfix">
                    <div class="example-title fl">显示范例：</div>
                    <div class="example-content">
                        <div class="example-priview">
                            <div class="example-image"></div>
                            <br>
                            <span>微信扫描二维码</span>
                            <br>
                            <span>联系客服</span>
                            <br>
                            <span>客服电话：8888888</span>
                            <br>
                            <span>上班时间：周一至周五09:00~18:00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getCustomerService, saveCustomerService, saveCustomerImage } from '@/api/parameter'
import { customerImageUrl } from '@/utils/dev'
import { isValidPhone, isValidTel } from '@/utils/validate'

export default {
    data() {
        const validPhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入联系电话'))
            } else if (!isValidTel(value)) {
                callback(new Error('请输入正确的联系电话'))
            } else {
                callback()
            }
        }
        return {
            dialogStatus: 'preview',
            textMap: {
                update: '提交',
                preview: '编辑',
            },
            formData: {
                imageId: '',
                mobile: '',
                workTime: '',
            },
            previewData: {},
            rules: {
                // 'businessTime.startTime': [{required: true, message: '起始时间不能为空', trigger: 'blur' }],
                // 'businessTime.endTime': [{required: true, message: '结束时间不能为空', trigger: 'blur' }],
                mobile: [
                    { required: true, message: '客服电话不能为空' },
                    { validator: validPhone }
                ],
                workTime: [{ required: true, message: '客服上班时间不能为空', }]
            },
            submitLoading: false,
            imageUrl: '',
            imageForm: null,
            customerImageUrl,
        }
    },
    created() {
        this.getDetail()
    },
    computed: {
        getCustomerImage() {
            let image = ''
            if (this.previewData.imageId) {
                image = this.customerImageUrl + this.previewData.imageId
            }
            return image
        }
    },
    methods: {
        getDetail() {
            getCustomerService().then(res => {
                this.previewData = res.data.data
                if (this.previewData.id <= 0) {
                    this.dialogStatus = 'update'
                }
            })
        },
        handleToggle() {
            if (this.dialogStatus == 'preview') {
                this.dialogStatus = 'update'
                const p = this.previewData
                this.formData = {
                    id: p.id,
                    imageId: p.imageId,
                    mobile: p.mobile,
                    workTime: p.workTime,
                }
                this.imageUrl = ''
                if (p.imageId) {
                    this.imageUrl = this.customerImageUrl + p.imageId
                }
            } else if (this.dialogStatus == 'update') {
                this.handleBeforeSave()
            }
        },
        handleBack() {
            this.dialogStatus = 'preview'
        },
        upload(content) {
            const fd = new FormData()
            fd.append('multipartFile', content.file)
            this.imageForm = fd
            content.onSuccess({}, content.file)
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
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw)
        },
        handleDeleteImage() {
            this.formData.imageId = ''
            this.imageUrl = ''
            this.imageForm = null
        },
        handleBeforeSave() {
            this.submitLoading = true
            if (this.imageForm !== null) {
                saveCustomerImage(this.imageForm).then(res => {
                    this.formData.imageId = res.data.data.id
                    this.handleSave()
                })
            } else {
                this.handleSave()
            }
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    saveCustomerService(this.formData).then(res => {
                        const resData = res.data
                        if (resData.code == '10001') {
                            this.$message.success('保存成功')
                            this.getDetail()
                            this.handleBack()
                        } else {
                            this.$message.error(resData.error)
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
.page-content {
    padding-top: 20px;
    .preview-item {
        margin-bottom: 15px;
        height: 30px;
        line-height: 30px;
    }
    /deep/ {
        .el-form-item .el-form-item {
            margin-bottom: 0;
        }
    }
    .preview-container {
        .detail-item {
            margin-bottom: 20px;
            display: flex;
            .detail-item-title {
                text-align: right;
                display: inline-block;
                padding: 8px 0;
                width: 110px;
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
}
.avatar-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader /deep/ .el-upload:hover {
    border-color: #409EFF;
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
.upload-delete-span {
    position: absolute;
    left: 186px;
    top: 0;
    color: red;
    font-size: 26px;
    cursor: pointer;
    transition: opacity .3s;
}

.example-container {
    margin-left: 650px;
    .example-title {
        width: 120px;
        padding: 8px 0;
        display: inline-block;
        text-align: right;
    }
    .example-content {
        margin-left: 150px;
        .example-priview {
            border: 1px solid #dadada;
            padding: 20px;
            width: 280px;
            text-align: center;
            .example-image {
                width: 100px;
                height: 100px;
                margin-bottom: 10px;
                background: #dadada;
                border: 1px solid #dadada;
                display: inline-block;
            }
        }
    }
}
</style>
 