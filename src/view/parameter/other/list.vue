<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">其他参数</el-breadcrumb-item>
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
                <div class="preview-item">
                    <span>剩余药量提醒：</span><span>{{ previewData.remindOfAmount }}%</span>
                </div>
                <!-- <div class="preview-item">
                    <span>客服上班时间：</span><span>{{ previewData.serviceHours }}</span>
                </div> -->
                <div class="preview-item">
                    <span>每天文章获取积分上限：</span><span>{{ previewData.integrationUpper }}积分</span>
                </div>
                <div class="preview-item">
                    <span>阅读文章获取积分停留时间：</span><span>{{ previewData.stayOfIntegral }}{{ stayUnitValue }}</span>
                </div>
                <div class="preview-item">
                    <span>签到获得积分：</span><span>{{ previewData.checkInPoints }}积分</span>
                </div>
                <div class="preview-item">
                    <span>积分兑换比例：</span><span>{{ previewData.integralConvRatio }}积分=1元 RMB</span>
                </div>
                <!-- 自动收货 -->
                <div class="preview-item">
                    <span>发货后</span><span>{{ previewData.autoDelivery }}天自动收货</span>
                </div>
            </div>
            <el-form v-if="dialogStatus == 'update'"
                ref="dataForm"
                :rules="rules"
                :model="formData"
                label-position="right"
                label-width="190px"
                size="small"
                style="width: 500px;"
            >
                <el-form-item label="剩余药量提醒" prop="remindOfAmount">
                    <el-input
                        type="text"
                        v-model.number="formData.remindOfAmount"
                        style="width: 55px;"
                        v-num-digit="formData.remindOfAmount"
                    ></el-input> %
                </el-form-item>
                <!-- <el-form-item label="客服上班时间">
                    <el-col :span="11">
                        <el-form-item prop="businessTime.startTime">
                            <el-time-picker
                                style="width: 100%;"
                                placeholder="起始时间"
                                v-model="formData.businessTime.startTime"
                                format="HH:mm"
                                value-format="HH:mm"
                                :picker-options="{
                                    selectableRange: `00:00:00 -${formData.businessTime.endTime ? formData.businessTime.endTime+':00' : '23:59:00'}`
                                }"
                            >
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="2" style="text-align: center;">
                        -
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="businessTime.endTime">
                            <el-time-picker
                                style="width: 100%;"
                                placeholder="结束时间"
                                v-model="formData.businessTime.endTime"
                                format="HH:mm"
                                value-format="HH:mm"
                                :picker-options="{
                                    selectableRange: `${formData.businessTime.startTime ? formData.businessTime.startTime+':00' : '00:00:00'} - '23:59:00'`
                                }"
                            >
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item> -->
                <el-form-item label="每天文章获取积分上限" prop="integrationUpper">
                    <el-input
                        v-model.number="formData.integrationUpper"
                        placeholder="请输入文章获取积分上限"
                        v-num-digit="formData.integrationUpper"
                    ></el-input>
                </el-form-item>
                <el-form-item label="阅读文章获取积分停留时间" prop="stayOfIntegral">
                    <el-input v-model.number="formData.stayOfIntegral" style="width: 55px;"></el-input>
                    <el-select v-model="formData.stayOfIntegralUnit" style="width: 100px;">
                        <el-option :value="0" :label="'秒'"></el-option>
                        <el-option :value="1" :label="'分'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="签到获得积分" prop="checkInPoints">
                    <el-input
                        v-model.number="formData.checkInPoints"
                        style="width: 195px;"
                        placeholder="请输入签到获得积分数"
                        v-num-digit="formData.checkInPoints"
                    ></el-input>
                </el-form-item>

                <el-form-item label="积分兑换比例" prop="integralConvRatio">
                    <el-input
                        v-model.number="formData.integralConvRatio"
                        style="width: 80px;"
                        v-num-digit="formData.integralConvRatio"
                    ></el-input> <span>积分 = 元 RMB</span>
                </el-form-item>
            <!-- autoDelivery 发货 -->
                <el-form-item label="发货" prop="autoDelivery">
                    <el-input
                        v-model.number="formData.autoDelivery"
                        style="width: 80px;"
                        v-num-digit="formData.autoDelivery"
                    ></el-input> <span>天后自动发货</span>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
import { getOtherDetail, saveOther } from '@/api/parameter'

const stayUnit = {
    0: '秒',
    1: '分'
}

export default {
    data() {
        const checkData = (rule, value, callback, message) => {
            if (!value && value !== 0) {
                return callback(new Error(`${message}不能为空`))
            }
            if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'))
            } else {
                if (value < 0) {
                    callback(new Error('不能小于0'))
                } else if (value > 1000000) {
                    callback(new Error('不能大于10000000'))
                } else {
                    callback()
                }
            }
        }
        const checkRemindOfAmount = (rule, value, callback) => {
            checkData(rule, value, callback, '剩余药量提醒')
        }
        const checkIntegrationUpper = (rule, value, callback) => {
            checkData(rule, value, callback, '每天文章获取积分上限')
        }
        const checkStayOfIntegral = (rule, value, callback) => {
            checkData(rule, value, callback, '阅读文章获取积分停留时间')
        }
        const checkCheckInPoints = (rule, value, callback) => {
            checkData(rule, value, callback, '签到获得积分')
        }
        const checkIntegralConvRatio = (rule, value, callback) => {
            if (!value && value !== 0) {
                return callback(new Error('积分兑换比例不能为空'))
            }
            if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'))
            } else {
                if (value < 1 || value > 10000) {
                    callback(new Error('不能小于1，大于10000'))
                } else {
                    callback()
                }
            }
        }
        // 自动收货
        const checkautoDelivery = (rule, value, callback) => {
            if (!value && value !== 0) {
                return callback(new Error('不输入则自动收货,只能输入正整数'))
            }
            if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'))
            } else {
                if (value < 1 || value > 365) {
                    callback(new Error('不能小于1，大于365'))
                } else {
                    callback()
                }
            }
        }
        return {
            dialogStatus: 'preview',
            textMap: {
                update: '提交',
                preview: '编辑'
            },
            formData: {
                remindOfAmount: '',
                businessTime: {
                    startTime: '',
                    endTime: '',
                },
                stayOfIntegral: '',
                stayOfIntegralUnit: '',
                integrationUpper: '',
                checkInPoints: '',
                integralConvRatio: '',
                autoDelivery:''//收货
            },
            previewData: {},
            rules: {
                remindOfAmount: [ { validator: checkRemindOfAmount } ],
                // 'businessTime.startTime': [{required: true, message: '起始时间不能为空', trigger: 'blur' }],
                // 'businessTime.endTime': [{required: true, message: '结束时间不能为空', trigger: 'blur' }],
                integrationUpper: [{validator: checkIntegrationUpper}],
                stayOfIntegral: [{ validator: checkStayOfIntegral }],
                checkInPoints: [{ validator: checkCheckInPoints }],
                integralConvRatio: [ {validator: checkIntegralConvRatio} ],
                autoDelivery: [ {validator: checkautoDelivery} ], //收货
            },
            submitLoading: false,
        }
    },
    created() {
        this.getDetail()
    },
    computed: {
        stayUnitValue() {
            return stayUnit[this.previewData.stayOfIntegralUnit]
        }
    },
    methods: {
        getDetail() {
            getOtherDetail().then(res => {
                this.previewData = res.data
                if (this.previewData.id <= 0) {
                    this.dialogStatus = 'update'
                }
            })
        },
        handleToggle() {
            if (this.dialogStatus == 'preview') {
            // console.log('编辑')
                this.resolveData()
                this.dialogStatus = 'update'
            } else if (this.dialogStatus == 'update') {
            // console.log('提交')
                // this.dialogStatus = 'preview'
                this.handleSave()
            }
        },
        handleBack() {
            this.dialogStatus = 'preview'
        },
        resolveData() {
            let timeArr = this.previewData.serviceHours.split(' - ')
            let startTime = timeArr[0]
            let endTime = timeArr[1]
            this.formData = {
                id: this.previewData.id,
                remindOfAmount: this.previewData.remindOfAmount,
                businessTime: {
                    startTime,
                    endTime,
                },
                stayOfIntegral: this.previewData.stayOfIntegral,
                stayOfIntegralUnit: this.previewData.stayOfIntegralUnit,
                integrationUpper: this.previewData.integrationUpper,
                checkInPoints: this.previewData.checkInPoints,
                integralConvRatio: this.previewData.integralConvRatio,
                autoDelivery: this.previewData.autoDelivery, //收货
            }
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.submitLoading = true
                    let serviceHours = this.formData.businessTime.startTime + ' - ' + this.formData.businessTime.endTime
                    let requestData = {
                        id: this.formData.id,
                        dataRemoveType: 0,
                        remindOfAmount: this.formData.remindOfAmount,
                        serviceHours,
                        integrationUpper: this.formData.integrationUpper,
                        stayOfIntegral: this.formData.stayOfIntegral,
                        stayOfIntegralUnit: this.formData.stayOfIntegralUnit,
                        checkInPoints: this.formData.checkInPoints,
                        integralConvRatio: this.formData.integralConvRatio,
                        autoDelivery: this.formData.autoDelivery,//收货
                    }
                    saveOther(requestData).then(res => {
                        console.log(res)
                        const data = res.data
                        if (data.code == 'success') {
                            let message = '修改成功'
                            this.$message({
                                message,
                                type: 'success'
                            })
                            this.getDetail()
                            this.dialogStatus = 'preview'
                        } else {
                            this.$message.error(data.msg)
                        }
                        this.submitLoading = false
                    }).catch(() => {
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
}
</style>

