<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
                :to="{ path: '/user/doctor/list' }"
            >医生用户</el-breadcrumb-item>
            <el-breadcrumb-item>新增医生用户</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :model="formData"
            ref="dataForm"
            label-position="right"
            label-width="80px"
            size="small"
            :rules="rules"
        >
            <!-- <el-form-item label="创建时间">
                {{ dateTime(formData.createTime) }}
            </el-form-item> -->
            <el-form-item label="创建者">
                {{ formData.createUserName }}
            </el-form-item>
            <!-- <el-form-item label="账号ID">
                {{ formData.id }}
            </el-form-item> -->
            <el-form-item label="账号" prop="mobileNum">
                <el-input
                    v-model="formData.mobileNum"
                    placeholder="请输入11位手机号码"
                    maxlength="11"
                ></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="doctorName">
                <el-input v-model="formData.doctorName"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="formData.gender">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="医院">
                <el-col :span="3">
                    <el-form-item prop="provincel">
                        <el-select v-model="formData.provincel" placeholder="请选择省份" @change="selectProvince" clearable>
                            <el-option 
                                v-for="item in provinceList"
                                :key="item.areaCode"
                                :label="item.areaName"
                                :value="item.areaCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item prop="city">
                        <el-select v-model="formData.city" placeholder="请选择市" @change="selectCity" clearable>
                            <el-option
                                v-for="item in cityList"
                                :key="item.areaName"
                                :label="item.areaName"
                                :value="item.areaCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    <el-form-item prop="area">
                        <el-select v-model="formData.area" placeholder="请选择区/县" @change="selectArea" clearable>
                            <el-option
                                v-for="item in areaList"
                                :key="item.areaName"
                                :label="item.areaName"
                                :value="item.areaCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item prop="hospitalId">
                        <el-select v-model="formData.hospitalId" placeholder="请选择医院" @change="selectHospital" clearable>
                            <el-option
                                v-for="item in hospitalList"
                                :key="item.hospitalId"
                                :label="item.hospitalName"
                                :value="item.hospitalId"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="科室" prop="department">
                <!-- <el-input v-model="formData.department"></el-input> -->
                <el-select v-model="formData.department" placeholder="请选择" clearable>
                    <el-option
                        v-for="item in departmentList"
                        :key="item.id"
                        :label="item.departmentName"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="职称" prop="professionalTitle">
                <el-select v-model="formData.professionalTitle" placeholder="请选择" clearable>
                    <el-option
                        v-for="item in professionalList"
                        :key="item.dicSubval"
                        :label="item.dicSubname"
                        :value="item.dicSubval"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item align="center">
                <el-button type="primary" @click="handleSubmit">提交</el-button>
                <router-link to="/user/doctor/list">
                    <el-button class="ml20">返回</el-button>
                </router-link>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getDoctorDetail, saveDoctor, getProfessional, getHospitalList, getDepartmentList } from '@/api/user';
import { getProvince, getArea } from '@/api/util';
import { convertDate } from '@/utils'
import { isValidPhone, isValidTel } from '@/utils/validate'

export default {
    data() {
        const validPhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入联系电话'))
            } else if (!isValidPhone(value) && !isValidTel(value)) {
                callback(new Error('请输入正确的联系电话'))
            } else {
                callback()
            }
        }
        return {
            formData: {
                mobileNum: '',
                doctorName: '',
                gender: '',
                provincel: '',
                city: '',
                area: '',
                hospitalId: '',
                department: '',
                professionalTitle: '',
                doctorType: 0,
                dataRemoveType: 0
            },
            rules: {
                mobileNum: [
                    { required: true, message: '请输入11位手机号码', trigger: 'blur' },
                    { trigger: 'blur', validator: validPhone }
                ],
                doctorName: { required: true, message: '请输入姓名', trigger: 'blur' },
                gender: { required: true, message: '请选择性别', trigger: 'blur' },
                hospitalId: { required: true, message: '请选择医院', trigger: 'blur' },
                department: { required: true, message: '请选择科室', trigger: 'blur' },
                professionalTitle: { required: true, message: '请选择职称', trigger: 'blur' }
            },
            provinceList: [],
            cityList: [],
            areaList: [],
            hospitalList: [],
            departmentList: [],
            professionalList: [],
            submitLoading: false,
        }
    },
    created() {
        this.getProvinceList();
        this.getProfessional();
    },
    computed: {
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        }
    },
    methods: {
        getProvinceList() {
            getProvince().then(res => {
                this.provinceList = res.data
            })
        },
        selectProvince(val) {
            this.formData.city = ''
            this.formData.area = ''
            this.formData.hospitalId = ''
            this.cityList = []
            this.areaList = []
            this.hospitalList = []
            if (val) {
                getArea(val).then(res => {
                    this.cityList = res.data
                })
            }
        },
        selectCity(val) {
            this.formData.area = ''
            this.formData.hospitalId = ''
            this.areaList = []
            this.hospitalList = []
            if (val) {
                getArea(val).then(res => {
                    this.areaList = res.data
                })
            }
        },
        selectArea() {
            this.formData.hospitalId = ''
            let data = {
                province: this.formData.provincel,
                city: this.formData.city,
                district: this.formData.area,
            }
            this.hospitalList = []
            if (this.formData.area) {
                getHospitalList(data).then(res => {
                    const data = res.data.data
                    this.hospitalList = data
                })
            }
        },
        selectHospital() {
            let hospitalId = this.formData.hospitalId
            getDepartmentList(hospitalId).then(res => {
                const data = res.data.data.list
                this.departmentList = data
            })
        },
        getProfessional() {
            getProfessional().then(res => {
                const data = res.data.data
                this.professionalList = data
            })
        },
        getDetail(doctorsId) {
            getDoctorDetail(doctorsId).then(res => {
                const data = res.data.data;
                this.formData = {
                    mobileNum: data.loginaccount,
                    doctorName: data.username,
                    gender: data.gender,
                    provincel: data.provincel,
                    city: data.city,
                    area: data.area,
                    hospitalId: data.hospitalId,
                    department: data.departmentId,
                    professionalTitle: data.professionalTitleId,
                    doctorType: data.doctortype,
                    dataRemoveType: 0
                }
            })
        },
        handleSubmit() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    for (let item of this.professionalList) {
                        if (item.dicSubval == this.formData.professionalTitle) {
                            this.formData.professionalTitle = item
                            break
                        }
                    }
                    this.submitLoading = true
                    saveDoctor(this.formData).then(res => {
                        const data = res.data;
                        if (data.flag == 'success') {
                            let message = '添加成功'
                            this.$router.replace({path: '/user/doctor/list'})
                            this.$message({
                                message,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: data.msg,
                                type: 'error'
                            })
                        }
                        this.submitLoading = false
                    }).catch(() => {
                        this.$message({
                            message: '保存失败',
                            type: 'error'
                        })
                        this.submitLoading = false
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.preview-img {
    width:  178px;
    height: 178px;
    display: inline-block;
    border: 1px dashed #d9d9d9;
    margin-right: 20px;
}
</style>
