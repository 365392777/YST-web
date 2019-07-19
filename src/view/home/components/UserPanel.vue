<template>
    <div class="user-panel-container">
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
                        <i class="home-icon icon-patient-user"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.totalPatientAmount }}
                        </div>
                        <div class="card-panel-text">患者用户数量</div>
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
                        <i class="home-icon icon-doctor-user"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.totalDoctorAmount }}
                        </div>
                        <div class="card-panel-text">医生用户数量</div>
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
                        <i class="home-icon icon-certified-doctor"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                             {{ homeData.noIdentityDoctorAmount }}
                        </div>
                        <div class="card-panel-text">待认证医生用户</div>
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
                        <i class="home-icon icon-new-patient"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.yesterdayNewPatient }}
                        </div>
                        <div class="card-panel-text">昨日新增患者用户</div>
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
                        <i class="home-icon icon-new-doctor"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-num">
                            {{ homeData.yesterdayNewDoctor }}
                        </div>
                        <div class="card-panel-text">昨日新增医生用户</div>
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
.icon-patient-user {
    background-image: url('../../../assets/home/patient-user.png');
}
.icon-doctor-user {
    background-image: url('../../../assets/home/doctor-user.png');
}
.icon-certified-doctor {
    background-image: url('../../../assets/home/certified-doctor.png');
}
.icon-new-patient {
    background-image: url('../../../assets/home/new-patient.png');
}
.icon-new-doctor {
    background-image: url('../../../assets/home/new-doctor.png');
}
</style>
