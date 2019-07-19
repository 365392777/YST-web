<template>
  <div class="user-container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
      <el-breadcrumb-item :to="{ path: '/system/user/list' }">后台用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{breadcrumbMap[isEdit]}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      ref="dataForm"
      :model="formData"
      :rules="rules"
      size="small"
      label-width="100px"
      class="border"
      @submit.native.prevent
    >
      <div style="margin-bottom: 10px;font-size: 15px;">基本信息</div>
      <el-form-item label="账号ID：" prop="id" v-if="isEdit">
        <template>
          <div v-show="toggleId">{{ formData.id }}</div>
        </template>
      </el-form-item>
      <el-form-item label="姓名：" prop="userName">
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="userLoginid">
        <el-input v-model="formData.userLoginid" placeholder="将作为登录账号" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item
        label="密码："
        v-if="!isEdit"
        prop="userLoginpassword"
        :rules="[{required: true, message: '请输入密码', trigger: 'blur'}]"
      >
        <el-input
          type="password"
          v-model="formData.userLoginpassword"
          placeholder="请输入密码"
          autocomplete="new-password"
        ></el-input>
      </el-form-item>

      <el-form-item label="供应商：" prop="supplierId">
        <el-select v-model="formData.supplierId" placeholder="请选择供应商" clearable>
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.supplierName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        v-if="formData.supplierId!=''"
        prop="email"
        label="邮箱："
        :rules="[
      { required: true, message: '请输入邮箱地址', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
    ]"
      >
        <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>

      <el-form-item label="状态：" prop="userStatus">
        <el-radio-group v-model="formData.userStatus">
          <el-radio label="0">可用</el-radio>
          <el-radio label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色类型：" prop="roles">
        <el-checkbox-group v-model="formData.roles">
          <el-checkbox
            v-for="item in tsysRoles"
            :key="item.id"
            :label="item.id"
            :value="item.id"
          >{{ item.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <!-- <el-form ref="form" :model="formPower" size="small" class="border formData" @submit.native.prevent>
			<div style="margin-bottom: 10px;font-size: 15px;">权限设置</div>
			<el-form-item>
		        <el-checkbox-group v-model="formData.shop">
		            <el-checkbox label="商城管理" name="role"></el-checkbox>
		            <el-checkbox label="订单管理" name="shop"></el-checkbox>
		            <el-checkbox label="商品管理" name="shop"></el-checkbox>
		            <el-checkbox label="活动管理" name="shop"></el-checkbox>
		            <el-checkbox label="商品评论" name="shop"></el-checkbox>
		        </el-checkbox-group>
		    </el-form-item>
		    <el-form-item>
		        <el-checkbox-group v-model="formData.integral">
		            <el-checkbox label="积分商城" name="integral"></el-checkbox>
		            <el-checkbox label="积分商品" name="integral"></el-checkbox>
		            <el-checkbox label="抽奖设置" name="integral"></el-checkbox>
		            <el-checkbox label="抽奖记录" name="integral"></el-checkbox>
		            <el-checkbox label="兑换记录" name="integral"></el-checkbox>
		        </el-checkbox-group>
		    </el-form-item>
		    <el-form-item>
		        <el-checkbox-group v-model="formData.warehouse">
		            <el-checkbox label="仓库管理" name="warehouse"></el-checkbox>
		            <el-checkbox label="出入库" name="warehouse"></el-checkbox>
		            <el-checkbox label="库存盘点" name="warehouse"></el-checkbox>
		        </el-checkbox-group>
		    </el-form-item>
		    <el-form-item>
		        <el-checkbox-group v-model="formData.universal">
		            <el-checkbox label="科普管理" name="universal"></el-checkbox>
		            <el-checkbox label="文章管理" name="universal"></el-checkbox>
		            <el-checkbox label="评论管理" name="universal"></el-checkbox>
		            <el-checkbox label="分类目录" name="universal"></el-checkbox>
		            <el-checkbox label="第三方文章管理" name="universal"></el-checkbox>
		        </el-checkbox-group>
		    </el-form-item>
		    <el-form-item>
		        <el-checkbox-group v-model="formData.user">
		            <el-checkbox label="用户管理" name="user"></el-checkbox>
		            <el-checkbox label="医生用户" name="user"></el-checkbox>
		            <el-checkbox label="患者用户" name="user"></el-checkbox>
		        </el-checkbox-group>
		    </el-form-item>
		    <el-form-item>
		        <el-checkbox-group v-model="formData.report">
		            <el-checkbox label="报表管理" name="report"></el-checkbox>
		            <el-checkbox label="医生销售报表" name="report"></el-checkbox>
		            <el-checkbox label="医生咨询报表" name="report"></el-checkbox>
		            <el-checkbox label="商品销售报表" name="report"></el-checkbox>
		            <el-checkbox label="积分商品交易报表" name="report"></el-checkbox>
		        </el-checkbox-group>
		    </el-form-item>
		    <el-form-item>
		        <el-checkbox-group v-model="formData.parameter">
		            <el-checkbox label="参数管理" name="parameter"></el-checkbox>
		            <el-checkbox label="医院管理" name="parameter"></el-checkbox>
		            <el-checkbox label="FSMP信息管理" name="parameter"></el-checkbox>
		            <el-checkbox label="商品参数管理" name="parameter"></el-checkbox>
		            <el-checkbox label="敏感词管理" name="parameter"></el-checkbox>
		            <el-checkbox label="仓库参数管理" name="parameter"></el-checkbox>
		            <el-checkbox label="其他参数" name="parameter"></el-checkbox>
		            <el-checkbox label="广告管理" name="parameter"></el-checkbox>
		            <el-checkbox label="商城图标" name="parameter"></el-checkbox>
		            <el-checkbox label="意见反馈" name="parameter"></el-checkbox>
		        </el-checkbox-group>
		    </el-form-item>
		    <el-form-item>
		        <el-checkbox-group v-model="formData.system">
		            <el-checkbox label="系统管理" name="system"></el-checkbox>
		            <el-checkbox label="后台用户管理" name="system"></el-checkbox>
		            <el-checkbox label="后台用户角色管理" name="system"></el-checkbox>
		        </el-checkbox-group>
		    </el-form-item>
    </el-form>-->

    <el-row class="clearfix">
      <el-col :sapn="24" align="center">
        <el-button type="primary" size="small" :loading="submitLoading" @click="handleSave">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .formData {
    .el-checkbox + .el-checkbox {
      margin-left: 0;
    }
    .el-checkbox {
      margin-right: 30px;
    }
    .el-checkbox:first-child .el-checkbox__label {
      font-weight: bold;
    }
  }
</style>

<script>
  import {
    getUserDetail,
    saveUser,
    getRoleList,
    getComoditySupplierList
  } from "@/api/system";
  import { isValidPhone } from "@/utils/validate";

  export default {
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const validPhone = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入手机号"));
        } else if (!isValidPhone(value)) {
          callback(new Error("请输入正确的手机号"));
        } else {
          callback();
        }
      };
      return {
        breadcrumbMap: {
          false: "新增用户",
          true: "编辑用户"
        },
        formData: {
          supplierId: "", //供应商id
          email: "", //邮箱
          userName: "",
          userLoginid: "",
          userStatus: "1",
          userLoginpassword: "",
          roles: [],
          dataRemoveType: 0
        },
        tsysRoles: [{ roleName: "" }],
        //供应商数据
        supplierList: [],
        // formPower: {
        // 	shop: [],
        // 	integral: [],
        // 	warehouse: [],
        // 	universal: [],
        // 	user: [],
        // 	report: [],
        // 	parameter: [],
        // 	system: []
        // },
        rules: {
          userName: [
            { required: true, message: "用户姓名不能为空", trigger: "blur" }
          ],
          userLoginid: [
            { required: true, message: "用户手机号不能为空", trigger: "blur" },
            { trigger: "blur", validator: validPhone }
          ],
          userStatus: [
            { required: true, message: "请选择用户状态", trigger: "blur" }
          ],
          roles: [
            { required: true, message: "请至少选择一个用户角色", trigger: "blur" }
          ]
        },
        submitLoading: false,
        toggleId: true
      };
    },
    created() {
      this.getSupplierList();
      console.log(this.isEdit);
      if (this.isEdit) {
        let id = this.$route.params && this.$route.params.id;
        this.getDetail(id);
      }else{
         this.getDetail(0);
      }
    },
    methods: {
      // 获取供应商列表
      getSupplierList() {
        getComoditySupplierList().then(res => {
          // console.log(res)
          const resData = res.data;
          if (resData.code == "10001") {
            this.supplierList = resData.data.list;
          }
        });
      },

      getList() {
        getRoleList(this.formData).then(res => {
          // console.log(res);
          const data = res.data;
        });
      },
      getDetail(id) {
        getUserDetail(id).then(res => {
          // console.log(res);
          const data = res.data;
          this.formData.id = 0;
          this.formData.userName = data.userName;
          this.formData.userLoginid = data.userPhone;
          this.formData.userStatus = data.userStatus==='可用'?'0':'1';
          this.formData.userLoginpassword = data.password;
          this.formData.email = data.email;
          this.formData.supplierId = data.supplierId==0?'':data.supplierId;
          this.formData.roles = data.roleList;
          this.tsysRoles = data.tsysRoles;
          if (data.roleList != null) {
            this.formData.id = data.userid;
            this.formData.roles = data.roleList.split(",");
            for (let i = 0; i < this.formData.roles.length; i++) {
              let item = this.formData.roles[i];
              this.formData.roles[i] = parseInt(item);
              if (item == "" || item == null || typeof item == undefined) {
                this.formData.roles.splice(i, 1);
                i = i - 1;
              }
            }
          } else {
            this.formData.roles = [];
          }
          if (this.formData.userLoginpassword == null) {
            this.formData.userLoginpassword = "";
          }

          if (this.formData.id == 0) {
            this.toggleId = false;
          }
        });
      },
      handleSave() {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            // console.log(this.formData);
            this.submitLoading = true;
            saveUser(this.formData)
              .then(res => {
                // console.log(res);
                const data = res.data;
                if (data.error != "") {
                  this.$message({
                    message: data.error,
                    type: "error"
                  });
                  return;
                }
                if (this.isEdit) {
                  this.$router.replace({ path: "/system/user/list" });
                  this.$message({
                    message: "修改成功",
                    type: "success"
                  });
                } else {
                  this.$router.replace({ path: "/system/user/list" });
                  this.$message({
                    message: "添加成功",
                    type: "success"
                  });

                  this.submitLoading = false;
                }
              })
              .catch(() => {
                this.$message({
                  message: "提交失败",
                  type: "error"
                });
                this.submitLoading = false;
              });
          }
        });
      }
    }
  };
</script>