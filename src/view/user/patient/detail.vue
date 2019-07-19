<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
                :to="{ path: '/user/patient/list' }"
            >患者用户</el-breadcrumb-item>
            <el-breadcrumb-item>详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="patient-detail-container">
            <div class="detail-item">
                <div class="detail-item-title">注册时间：</div>
                <div class="detail-item-content">{{ dateTime(patientData.registrationtime) }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">账号ID：</div>
                <div class="detail-item-content">{{ patientData.patientid }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">账号：</div>
                <div class="detail-item-content">{{ patientData.patientnum }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">姓名：</div>
                <div class="detail-item-content">{{ patientData.patientname }}</div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title">绑定医院：</div>
                <div class="detail-item-content">
                    <div>
                        {{ patientData.hospitalName }}
                    </div>
                </div>
            </div>
            <div class="detail-item">
                <div class="detail-item-title"></div>
                <div class="detail-item-content">
                    <el-button size="small" type="danger" @click="handleProhibit">禁止登录</el-button>
                    <el-button size="small" type="danger" @click="handleLogin">允许登录</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getPatientDetail, getPatientStatus } from '@/api/user'
import { convertDate } from '@/utils'

export default {
    data() {
        return {
            patientData: {
                registrationtime: '',
                patientid: '',
                patientnum: '',
                patientname: '',
                hospitalName: '',
            },
            submitLoading: false,
            patientId: '',
            patientStatus: ''
        }
    },
    computed: {
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        },
    },
    created() {
        let id = this.$route.params && this.$route.params.id;
        this.getDetail(id);
    },
    methods: {
        getDetail(id) {
            getPatientDetail(id).then(res => {
                let data = res.data.data
                this.patientData = {
                    registrationtime: data.patientData[0].registrationtime,
                    patientid: data.patientData[0].patientid,
                    patientnum: data.patientData[0].patientnum,
                    patientname: data.patientData[0].patientname,
                    hosDataList: data.hosDataList
                }
                if(!this.patientData.hosDataList.length){
                    this.patientData.hospitalName = ''
                }else{
                    let hospitalName = ''
                    for(let item of this.patientData.hosDataList) {
                        if (hospitalName == '') {
                            hospitalName = item.hospitalName
                        } else {
                            hospitalName += '，' + item.hospitalName
                        }
                    }
                    this.patientData.hospitalName = hospitalName
                }
            })
        },
        handleProhibit() {
            this.submitLoading = true
            this.patientId = [this.patientData.patientid]
            this.patientStatus = 0
            let data = {
                patientId: this.patientId,
                patientStatus: this.patientStatus
            }
            getPatientStatus(data).then(res => {
                this.$router.replace({path: '/user/patient/list'})
            })
        },
        handleLogin() {
            this.submitLoading = true
            this.patientId = [this.patientData.patientid]
            this.patientStatus = 1
            let data = {
                patientId: this.patientId,
                patientStatus: this.patientStatus
            }
            getPatientStatus(data).then(res => {
                this.$router.replace({path: '/user/patient/list'})
            })
        },
    }
}
</script>


<style lang="scss" scoped>
.patient-detail-container {
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
    .preview-img {
        width: 140px;
        height: 70px;
        display: inline-block;
        margin-right: 20px;
    }
}
</style>
