<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
                to="/user/doctor/list"
            >医生用户</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="doctor-detail-container">
            <div class="detail-item">
                <div class="detail-item-title">注册时间：</div>
                <div class="detail-item-content">{{ dateTime(doctorData.createTime) }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">账号ID：</div>
                <div class="detail-item-content">{{ doctorData.id }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">账号：</div>
                <div class="detail-item-content">{{ doctorData.mobileNum }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">姓名：</div>
                <div class="detail-item-content">{{ doctorData.doctorName }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">性别：</div>
                <!-- <div class="detail-item-content" v-if="doctorData.gender = 0">男</div>
                <div class="detail-item-content" v-else>女</div> -->
                <div class="detail-item-content">{{ doctorData.gender }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">医院名称：</div>
                <!-- <div class="detail-item-content">{{ doctorData.hospitalId }}</div> -->
                <div class="detail-item-content">{{ doctorData.hospitalName }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">科室：</div>
                <!-- <div class="detail-item-content">{{ doctorData.departmentId }}</div> -->
                <div class="detail-item-content">{{ doctorData.department }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">职称：</div>
                <!-- <div class="detail-item-content" v-if="doctorData.professionalTitleId == 'D011-1'">主任医师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-2'">副主任医师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-3'">营养师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-4'">营养士</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-5'">副主任营养师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-6'">主任营养师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-7'">医师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-8'">主治医师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-9'">护士</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-10'">护师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-11'">主管护师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-12'">副主任护师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-13'">主任护师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-14'">药士</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-15'">药师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-16'">主管药师</div>
                <div class="detail-item-content" v-else-if="doctorData.professionalTitleId == 'D011-17'">副主任药师</div>
                <div class="detail-item-content" v-else="doctorData.professionalTitleId == 'D011-18'">主任药师</div> -->
                <!-- 职称 -->
                <!-- <div class="detail-item-content">{{ doctorData.professionalTitle}}</div> -->
                <div class="detail-item-content">{{ doctorData.doctorProfessionName}}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">工作证照：</div>
                <div class="detail-item-content">
                    <!-- <div class="img doctor-img" style="background-image: url(&quot;small.img&quot;)"></div> -->
                    <div class="img doctor-img" v-for="workPhoto in doctorData.workPhoto" :style="{ 'background-image': 'url(' + doctorImageUrl + workPhoto + ')' }">
                        <!-- <img :src="baseUrl + '/largeFile/image/liveChatImage/findById?id=' + doctorData.workPhoto"> -->
                    </div>
                </div>
            </div>
            <div class="detail-item" v-if="this.doctorData.doctorType == 0">
                <div class="detail-item-title"></div>
                <div class="detail-item-content">
                    <el-button type="primary" size="small" @click="handleYes">审核通过</el-button>
                    <el-button type="primary" size="small" @click="handleNo">审核不通过</el-button>
                </div>
            </div>
            <div class="detail-item" v-if="this.doctorData.doctorType == 1">
                <div class="detail-item-title"></div>
                <div class="detail-item-content">
                    <el-button type="danger" size="small" @click="handleProhibit">禁用</el-button>
                    <el-button type="danger" size="small" @click="handleLogin">允许登录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getDoctorDetail, getDoctorType, deleteDoctor, getDoctorLoginAllow } from '@/api/user'
import { convertDate } from '@/utils'
import { uploadImage } from '@/api/util'
import { baseUrl, doctorImageUrl } from '@/utils/dev'

export default {
    data() {
        return {
            doctorData: {},
            submitLoading: false,
            doctortype: '',
            doctorLoginAllow: '',
            baseUrl,
            doctorImageUrl,
        }
    },
    created() {
        let doctorsId = this.$route.params && this.$route.params.id;
        this.getDetail(doctorsId);
    },
    computed: {
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        },
        imageView() {
            return function(image) {
                return 'data:image/*;base64,' + image
            }
        }
    },
    methods: {
        getDetail(doctorsId) {
            getDoctorDetail(doctorsId).then(res => {
                console.log(res)
                let data = res.data.data
                console.log(data,'医生用户-详情')
                this.doctorData = data

                if(this.doctorData.workPhoto){
                    this.doctorData.workPhoto = this.doctorData.workPhoto.split(",")
                }
            })
        },
        // upload(content) {
        //     const fd = new FormData();
        //     fd.append('file', content.file);
        //     let progressLoad = (progressEvent) => {
        //         let p = progressEvent
        //         content.file.percent = progressEvent.loaded / progressEvent.total * 100
        //         content.onProgress(content.file)
        //     }
        //     uploadImage(fd, progressLoad).then(res => {
        //         if (res.data.success == 'true') {
        //             this.doctorData.workphoto = res.data.data
        //         }
        //     })
        // },
        // beforeAvatarUpload(file) {
        //     const isJPG = file.type === 'image/jpeg';
        //     const isLt2M = file.size / 1024 / 1024 < 20;

        //     if (!isJPG) {
        //         this.$message.error('上传头像图片只能是 JPG 格式!');
        //     }
        //     if (!isLt2M) {
        //         this.$message.error('上传头像图片大小不能超过 20MB!');
        //     }
        //     return isJPG && isLt2M;
        // },
        handleYes() {
            this.submitLoading = true
            this.doctortype = 1
            let data = {
                doctorsId: [this.doctorData.id],
                doctorType: this.doctortype
            }
            this.handleDoctorType(data)
            this.$router.replace({path: '/user/doctor/list'})
        },
        handleNo(){
            this.submitLoading = true
            // let deleteId = this.doctorData.id
            // deleteDoctor(deleteId).then(res => {
            //     const data = res.data
            //     if(data.flag == 'success') {
            //         this.$message({
            //             message: data.msg,
            //             type: 'success',
            //         })
            //         this.getList()
            //     } else {
            //         this.$message({
            //             message: data.msg,
            //             type: 'error',
            //         })
            //     }
            // })
            this.doctortype = 2
            let data = {
                doctorsId: [this.doctorData.id],
                doctorType: this.doctortype
            }
            this.handleDoctorType(data)
            this.$router.replace({path: '/user/doctor/list'})
        },
        handleDoctorType(rquestData) {
            getDoctorType(rquestData).then(res=> {
                const data = res.data;
            })
        },
        handleProhibit() {
            this.doctorLoginAllow = 0
            let data = {
                doctorsId: [this.doctorData.id],
                doctorLoginAllow: this.doctorLoginAllow
            }
            this.handleDoctorLoginAllow(data)
            this.$router.replace({path: '/user/doctor/list'})
        },
        handleLogin() {
            this.doctorLoginAllow = 1
            let data = {
                doctorsId: [this.doctorData.id],
                doctorLoginAllow: this.doctorLoginAllow
            }
            this.handleDoctorLoginAllow(data)
            this.$router.replace({path: '/user/doctor/list'})
        },
        handleDoctorLoginAllow(rquestData) {
            getDoctorLoginAllow(rquestData).then(res=> {
                const data = res.data;
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.doctor-detail-container {
    .detail-item {
        margin-bottom: 15px;
        display: flex;
        .detail-item-title {
            text-align: right;
            display: inline-block;
            padding: 8px 0;
            width: 80px;
        }
        .detail-item-content {
            padding: 8px 0;
        }
    }
    .doctor-img {
        width: 178px;
        height: 178px;
        display: inline-block;
        margin-right: 20px;
        border: 1px dashed #d9d9d9;
        vertical-align: top;
        img{
            width: 100%;
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
        display: block;
    }
}
</style>
