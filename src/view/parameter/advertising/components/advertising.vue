<template>
    <div class="advertising-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold" :to="{ path: '/parameter/advertising/list' }">广告管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadcrumbMap[isEdit]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form 
            :model="formData"
            :rules="rules"
            ref="dataForm"
            label-position="right"
            size="small"
            label-width="80px"
            style="width: 500px;"
            @submit.native.prevent
        >
            <el-form-item label="广告位置" prop="place">
                <el-select v-model="formData.place">
                    <el-option
                        v-for="item in placeList"
                        :key="item.dicSubval"
                        :label="item.dicSubname"
                        :value="item.dicSubval"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题" prop="head">
                <el-input v-model.trim="formData.head"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="image">
                <el-upload
                    class="avatar-uploader"
                    action=""
                    :http-request="upload"
                    list-type="picture-card"
                    :file-list="fileList"
                    :on-remove="handleRemove"
                    :on-success="handleSuccess"
                    :before-upload="beforeAvatarUpload"
                    accept="image/jpeg,image/jpg,image/png"
                >
                    <img v-if="formData.image" :src="adImageUrl + formData.image" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="跳转类型" prop="dispatcherType">
                <el-select v-model="formData.dispatcherType" @change="changeDispatcherType('change')">
                    <el-option
                        v-for="item in dispatcherTypeList"
                        :key="item.dicSubval"
                        :label="item.dicSubname"
                        :value="item.dicSubval"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item
                label="跳转信息"
                prop="dispatcher"
                v-if="formData.dispatcherType == '1'"
                :rules="[
                    { required: true, validator: checkDispatcher }
                ]"
                :error="dispatcherError"
            >
                <el-input
                    v-model.trim="formData.dispatcher"
                    placeholder="请输入网址，例如：http://www.baidu.com"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="跳转信息"
                prop="dispatcher"
                v-if="formData.dispatcherType == '2' || formData.dispatcherType == '3'"
                :rules="[
                    { required: true, message: `请输入${dispatcherInfo}ID` }
                ]"
                :error="dispatcherError"
            >
                <el-input
                    v-model.number="formData.dispatcher"
                    v-num-digit="formData.dispatcher"
                    data-nonzero
                    :placeholder="'请输入' + dispatcherInfo + 'ID'"
                ></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input
                    v-model.number="formData.sort"
                    v-num-digit="formData.sort"
                    data-nonzero
                ></el-input>
            </el-form-item>
            <el-form-item>
                <router-link to="/parameter/advertising/list">
                    <el-button>返回</el-button>
                </router-link>
                <el-button type="primary" class="ml20" @click="handleSave">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    getAdvertisingDetail,
    saveAdvertising
} from '@/api/parameter'
import { getDicList, uploadImage } from '@/api/util'
import { getStore } from '@/utils'
import { adImageUrl } from '@/utils/dev'
import request from '@/utils/request'

export default {
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        const checkSort = (rule, value, callback) => {
            if (!value && value !== 0) {
                return callback(new Error('排序不能为空'))
            }
            if (/^[1-9]\d*$/.test(value) == false) {
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
                place: '',
                head: '',
                image: '',
                dispatcherType: '',
                dispatcher: '',
                sort: '',
            },
            breadcrumbMap: {
                false: '新增广告',
                true: '编辑广告',
            },
            placeList: [],
            dispatcherTypeList: [],
            rules: {
                place: [{required: true, message: '广告位置不能为空'}],
                head: [{required: true, message: '标题不能为空'}],
                // image: [{required: true, message: '图片不能为空'}],
                dispatcherType: [{required: true, message: '跳转类型不能为空'}],
                // sort: [{ required: true, validator: checkSort, trigger: 'change' }],
            },
            submitLoading: false,
            dispatcherInfo: '',
            dispatcherError: '',
            fileList: [],
            images: '',
            deleteImages: [],
            adImageUrl,
        }
    },
    created() {
        this.getSelectList()
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
        checkDispatcher(rule, value, callback) {
            let reg = /^((https|http|ftp|rtsp|mms){0,1}(:\/\/){0,1})www\.(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
            if (!value && value !== 0) {
                return callback(new Error('请输入网址'))
            }
            if (reg.test(value) == false) {
                callback(new Error('请输入正确的网址'))
            } else {
                callback()
            }
        },
        getDetail(id) {
            getAdvertisingDetail(id).then(res => {
                let data = res.data
                this.formData = {
                    id: data.id,
                    dataRemoveType: 0,
                    place: data.place,
                    head: data.head,
                    image: data.image,
                    dispatcherType: data.dispatcherType,
                    dispatcher: data.dispatcher,
                    sort: data.sort,
                }
                for (let item of this.placeList) {
                    if (item.dicSubname == this.formData.place) {
                        this.formData.place = item.dicSubval
                        break
                    }
                }
                for (let item of this.dispatcherTypeList) {
                    if (item.dicSubname == this.formData.dispatcherType) {
                        this.formData.dispatcherType = item.dicSubval
                        break
                    }
                }
                this.changeDispatcherType()
            })
        },
        getSelectList() {
            getDicList('D002').then(res => {
                this.placeList = res.data
            })
            getDicList('D003').then(res => {
                this.dispatcherTypeList = res.data
            })
        },
        upload(content) {
            const fd = new FormData()
            fd.append('file', content.file)
            const baseFile = new FormData()
            baseFile.append('multipartFile', content.file)
            let id = this.baseId
            if (this.isEdit) {
                id = this.id
            }
            baseFile.append('relId', id)

            let progressLoad = (progressEvent) => {
                let p = progressEvent
                content.file.percent = progressEvent.loaded / progressEvent.total * 100
                content.onProgress(content.file)
            }
            uploadImage(fd, progressLoad).then(res => {
                if (res.data.success == 'true') {
                    let data = {
                        url: res.data,
                        baseFile
                    }
                    content.onSuccess(data)
                } else {
                    content.onError('上传图片失败')
                }
            }).catch(err => {
                content.onError('上传图片失败')
            })
        },
        handleRemove(file, fileList) {
            let index = this.fileList.indexOf(file)
            if (file.requestId) {
                this.deleteImages.push(parseInt(file.requestId))
            }
            this.fileList.splice(index, 1)
        },
        handleSuccess(res, file, fileList) {
            let url = res.url
            file.baseFile = res.baseFile
            this.fileList = fileList
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
        changeDispatcherType(type) {
            let dispatcherType = this.formData.dispatcherType
            if (dispatcherType == '2') {
                this.dispatcherInfo = '商品'
            } else if (dispatcherType == '3') {
                this.dispatcherInfo = '积分'
            }
            if (type == 'change') {
                this.formData.dispatcher = ''
                this.$refs['dataForm'].clearValidate('dispatcher')
            }
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if(valid) {
                    this.submitLoading = true
                    let data = []
                    let indexList = []
                    this.submitLoading = true

                    for (let i = 0; i < this.fileList.length; i++) {
                        let item = this.fileList[i]
                        if (item.baseFile) {
                            let post = request.post('/imageRelationOperate/saveOneCommomImage', item.baseFile)
                            data.push(post)
                            indexList.push(i)
                        }
                    }

                    request.all(data).then(request.spread((...resList) => {
                        for (let i = 0; i < resList.length; i++) {
                            let resData = resList[i].data.data
                            let index = indexList[i]
                            this.fileList[index].requestId = resData.id
                        }
                        this.saveImages()
                    }))
                }
            })
        },
        saveImages() {
            this.images = ''
            let id = this.baseId
            if (this.isEdit) {
                id = this.id
            }
            for (let item of this.fileList) {
                this.images = parseInt(item.requestId)           
            }
            this.formData.image = this.images
            saveAdvertising(this.formData).then(res => {
                const data = res.data
                this.submitLoading = false
                if (data.flag == 'success') {
                    let message = this.isEdit ? '修改成功' : '新增成功'
                    this.$router.replace({path: '/parameter/advertising/list'})
                    this.$message({
                        message,
                        type: 'success'
                    })
                } else {
                    let message = this.isEdit ? '修改失败' : '新增失败'
                    this.$message.error(message)
                }
            }).catch(() => {
                this.submitLoading = false
                let message = this.isEdit ? '修改失败' : '新增失败'
                this.$message.error(message)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.avatar-uploader /deep/ {
    width: 148px;
    height: 148px;
    overflow: hidden;
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
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
}
.avatar {
    width: 148px;
    height: 148px;
    display: block;
}
</style>
