<template>
    <div class="navbar clearfix">
        <div class="navbar-content">
            <div class="left-header">
                <span class="company-name">膳理易管理后台</span>
            </div>
            <div class="right-menu">
                <el-dropdown
                    class="avatar-container right-menu-item"
                    trigger="click"
                >
                    <div class="avatar-wrapper">
                        <span class="user-name">{{ userInfo.userName }}</span>
                        <i class="el-icon-caret-bottom" />
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <span
                                style="display:block;"
                                @click="editPass"
                            >修改密码</span>
                        </el-dropdown-item>
                        <el-dropdown-item divided>
                            <span
                                style="display:block;"
                                @click="logout"
                            >退出</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <el-dialog
            title="修改密码"
            :visible.sync="editPassDialog"
            width="800px"
            :close-on-click-modal="showDialogClose"
            :close-on-press-escape="showDialogClose"
            :show-close="showDialogClose"
            center
        >
            <div class="edit-pass-container">
                <div class="layout-right">
                    <el-steps
                        :active="active"
                        align-center
                        finish-status="success"
                    >
                        <el-step title="验证手机号"></el-step>
                        <el-step title="修改密码"></el-step>
                    </el-steps>
                    <div class="form-list">
                        <el-form
                            :model="backForm"
                            :rules="rules2"
                            ref="backForm"
                            label-width="100px"
                            v-show="loginFormShow == 1"
                            @submit.native.prevent
                        >
                            <el-form-item
                                label="手机号："
                                prop="phoneNumber"
                                :error="phoneNumberError"
                            >
                                <el-input
                                    v-model="backForm.phoneNumber"
                                    maxlength="11"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                label="验证码："
                                prop="identifyingcode"
                                :error="codeError"
                            >
                                <el-row>
                                    <el-col :span="13">
                                        <el-input
                                            v-model="backForm.identifyingCode"
                                            class="identifyingcode"
                                            maxlength="6"
                                        ></el-input>
                                    </el-col>
                                    <el-col
                                        :span="10"
                                        :offset="1"
                                    >
                                        <el-button
                                            type="primary"
                                            @click="sendCode"
                                            v-if="countDown <= 0"
                                        >获取验证码</el-button>
                                        <el-button
                                            disabled
                                            v-if="countDown > 0"
                                        >{{countDown}}秒后重新获取</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    class="login-button"
                                    type="primary"
                                    @click="getbackForm('backForm')"
                                >下一步</el-button>
                            </el-form-item>
                        </el-form>
                        <el-form
                            :model="setpasswordForm"
                            :rules="rules3"
                            ref="setpasswordForm"
                            label-width="100px"
                            v-show="loginFormShow == 2"
                            @submit.native.prevent
                        >
                            <el-form-item
                                label="新密码："
                                prop="password"
                            >
                                <el-input
                                    type="password"
                                    v-model="setpasswordForm.password"
                                ></el-input>
                            </el-form-item>
                            <el-form-item
                                label="重复密码："
                                prop="password2"
                            >
                                <el-input
                                    type="password"
                                    v-model="setpasswordForm.password2"
                                    class="identifyingcode"
                                ></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button
                                    class="login-button"
                                    type="primary"
                                    @click="resetPass"
                                >修改密码</el-button>
                            </el-form-item>
                        </el-form>
                        <div
                            class="edit-done-content"
                            v-if="loginFormShow == 3"
                        >
                            <i class="el-icon-circle-check edit-done-icon"></i>
                            <div class="done-content">
                                您已成功修改密码，请使用新密码重新登录！
                            </div>
                            <el-button
                                class="edit-done-btn"
                                type="primary"
                                @click="handleReturn"
                            >返回登录</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { sendEditCode, verifyEditCode, updatePass } from '@/api/util'
import { isValidPhone } from '@/utils/validate'

export default {
    data() {
        const validatePhone = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'))
            } else if (!isValidPhone(value)) {
                callback(new Error('请输入正确的手机号'))
            } else {
                callback()
            }
        }
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'))
            } else {
                if (this.setpasswordForm.password2 !== '') {
                    this.$refs.setpasswordForm.validateField('password2')
                }
                callback()
            }
        }
        const validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请重复输入密码'))
            } else if (value !== this.setpasswordForm.password) {
                callback(new Error('两次输入密码不一致'))
            } else {
                callback()
            }
        }
        return {
            editPassDialog: false,
            loginFormShow: 1,
            active: 0,
            countDown: 0,
            backForm: {
                phoneNumber: '',
                identifyingCode: ''
            },
            setpasswordForm: {
                password: '',
                password2: ''
            },
            rules2: {
                phoneNumber: [{ validator: validatePhone, trigger: 'blur' }],
                identifyingCode: [
                    { required: true, message: '请输入验证码', trigger: 'blur' }
                ]
            },
            rules3: {
                password: [{ validator: validatePass, trigger: 'blur' }],
                password2: [{ validator: validatePass2, trigger: 'blur' }]
            },
            authTimer: null,
            phoneNumberError: '',
            codeError: '',
            showDialogClose: true,
        }
    },
    computed: {
        ...mapState({
            userInfo: state => state.user.user
        })
    },
    methods: {
        editPass() {
            this.editPassDialog = true
            this.$nextTick(() => {
                this.$refs['backForm'].clearValidate()
            })
        },
        logout() {
            this.$store.dispatch('user/logOut').then(() => {
                // this.$router.push('/login')
                localStorage.removeItem('supplierId')
                location.reload()
            })
        },
        sendCode() {
            if (!isValidPhone(this.backForm.phoneNumber)) {
                this.phoneNumberError = '请输入手机号码'
                this.$message.error('请输入手机号码')
                return
            }
            sendEditCode(this.backForm.phoneNumber).then(res => {
                const resData = res.data
                if (resData.flag == '10001') {
                    this.$message.success(resData.data)
                    this.setCountDown()
                } else {
                    let msg = resData.msg ? resData.msg : '验证码发送失败'
                    this.$message.error(msg)
                }
            })
        },
        setCountDown() {
            const TIME_COUNT = 60
            if (!this.authTimer) {
                this.countDown = TIME_COUNT
                this.authTimer = setInterval(() => {
                    if (this.countDown > 0 && this.countDown <= TIME_COUNT) {
                        this.countDown--
                    } else {
                        clearInterval(this.authTimer)
                        this.authTimer = null
                    }
                }, 1000)
            }
        },
        //下一步
        getbackForm(backForm) {
            this.$refs[backForm].validate(valid => {
                if (valid) {
                    let { identifyingCode } = this.backForm
                    this.codeError = ''
                    verifyEditCode(identifyingCode).then(res => {
                        const resData = res.data
                        if (resData.flag == 'success') {
                            this.loginFormShow = 2
                            this.active = 1
                        } else {
                            this.codeError = resData.msg
                        }
                    })
                }
            })
        },
        resetPass() {
            this.$refs['setpasswordForm'].validate(valid => {
                if (valid) {
                    updatePass(this.setpasswordForm.password).then(res => {
                        const resData = res.data
                        if (resData.flag == 'success') {
                            this.$message.success('重置密码成功')
                            this.dialogVisible = true
                            this.showDialogClose = false
                            this.loginFormShow = 3
                            this.active = 2
                        } else {
                            this.$message.error('重置密码失败')
                        }
                    })
                }
            })
        },
        handleReturn() {
            this.logout()
            this.dialogVisible = false
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar-content {
    height: 50px;
    line-height: 50px;
    border-radius: 0;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
    .left-header {
        float: left;
        height: 100%;
        padding: 0 20px;
        .company-name {
            color: #333;
            font-size: 20px;
            font-weight: 700;
        }
    }
    .right-menu {
        float: right;
        height: 100%;
        &:focus {
            outline: none;
        }
        .right-menu-item {
            display: inline-block;
            margin: 0 8px;
        }
        .avatar-container {
            height: 35px;
            margin-right: 30px;
            cursor: pointer;
            .avatar-wrapper {
                position: relative;
                &:focus {
                    outline: none;
                }
                .user-name {
                    font-size: 18px;
                }
            }
        }
    }
}

.form-list {
    padding: 50px 200px 50px 150px;
    /deep/ {
        .el-input .el-input__inner {
            font-size: 14px;
            height: 40px;
            line-height: 40px;
        }
        .el-form-item {
            margin-bottom: 30px;
        }
        .el-form-item .el-form-item__content,
        .el-form-item .el-form-item__label {
            line-height: 40px;
        }
        .el-button {
            height: 40px;
            padding: 0;
            width: 100%;
        }
    }
}

.edit-done-content {
    padding-left: 30px;
}

.dialog-container,
.edit-done-content {
    text-align: center;
    .edit-done-icon {
        font-size: 100px;
        color: #67c23a;
    }
    .done-content {
        margin-top: 20px;
        font-size: 16px;
    }
    .edit-done-btn {
        margin-top: 50px;
        width: 250px;
    }
}
.dialog-footer {
    .return-btn {
        width: 250px;
    }
}
</style>
