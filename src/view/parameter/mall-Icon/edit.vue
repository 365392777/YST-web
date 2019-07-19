<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold" :to="{ path: '/parameter/mall-Icon/list' }">商城图标</el-breadcrumb-item>
            <el-breadcrumb-item>编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form 
            size="small"
            :rules="rules"
            ref="dataForm"
            :model="formData"
            label-position="right"
            label-width="80px"
            style="width: 50%;"
        >
            <el-form-item label="类型" prop="type">
                <el-select v-model="formData.type">
                    <el-option
                        v-for="item in typeList"
                        :key="item.dicSubval"
                        :label="item.dicSubname"
                        :value="item.dicSubval"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model.trim="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="iconId">
                <el-upload
                    class="avatar-uploader"
                    action="http://192.168.0.47:8080/paramOperate/tAdvertisementOPerate.int.do"
                    :http-request="upload"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                    accept="image/jpeg,image/jpg,image/png"
                >
                    <img v-if="formData.iconId" :src="imageView" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input
                    v-model.number="formData.sort"
                    v-num-digit="formData.sort"
                    data-nonzero
                ></el-input>
            </el-form-item>
            <el-form-item>
                <router-link to="/parameter/mall-icon/list">
                    <el-button>返回</el-button>
                </router-link>
                <el-button class="ml20" :disabled="submitLoading" type="primary" @click="handleSave">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { saveMallIcon, getMallIconDetail } from '@/api/parameter'
import { getDicList, uploadImage } from '@/api/util'

export default {
    data() {
        const checkSort = (rule, value, callback) => {
            if (!value && value !== 0) {
                return callback(new Error('排序不能为空'))
            }
            if (/^[1-9]\d*$/.test(value) == false && value != 0) {
                callback(new Error('请输入整数'))
            } else {
                
                if (value < 0) {
                    callback(new Error('不能小于0'))
                } else if (value > Number.MAX_VALUE - 1) {
                    callback(new Error(`不能大于${Number.MAX_VALUE - 1}`))
                } else {
                    callback()
                }
            }
        }
        return {
            formData: {
                type: '',
                name: '',
                iconId: '',
                sort: '',
            },
            typeList: [],
            rules: {
                type: [{required: true, message: '类型不能为空'}],
                name: [{required: true, message: '名称不能为空'}],
                iconId: [{required: true, message: '图标不能为空'}],
                sort: [{required: true, validator: checkSort, trigger: 'blur' }],
            },
            submitLoading: false,
        }
    },
    created() {
        this.getSelectList()
        let id = this.$route.params && this.$route.params.id
        this.getDetail(id)
    },
    computed: {
        imageView() {
            return 'data:image/png;base64,' + this.formData.iconId
        }
    },
    methods: {
        getDetail(id) {
            getMallIconDetail(id).then(res => {
                let data = res.data
                this.formData = {
                    id: data.id,
                    dataRemoveType: 0,
                    type: data.type,
                    name: data.name,
                    iconId: data.iconId,
                    sort: data.sort,
                }
            })
        },
        getSelectList() {
            getDicList('D004').then(res => {
                this.typeList = res.data
            })
        },
        upload(content) {
            const fd = new FormData()
            fd.append('file', content.file)
            let progressLoad = (progressEvent) => {
                let p = progressEvent
                content.file.percent = progressEvent.loaded / progressEvent.total * 100
                content.onProgress(content.file)
            }
            uploadImage(fd, progressLoad).then(res => {
                if (res.data.success == 'true') {
                    this.formData.iconId = res.data.data
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
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if(valid) {
                    this.submitLoading = true
                    saveMallIcon(this.formData).then(res => {
                        const data = res.data
                        this.submitLoading = false
                        if (data.flag == 'success') {
                            let message = '修改成功'
                            this.$router.replace({path: '/parameter/mall-icon/list'})
                            this.$message({
                                message,
                                type: 'success'
                            })
                        } else {
                            let message = '修改失败'
                            this.$message.error(message)
                        }
                    }).catch(() => {
                        this.submitLoading = false
                        let message = '修改失败'
                        this.$message.error(message)
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
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
</style>
