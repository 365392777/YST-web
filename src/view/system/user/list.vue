<template>
  <div class="page-container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
      <el-breadcrumb-item class="bold" :to="{ path: '/system/user/list' }">后台用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      :inline="true"
      :model="listQuery"
      size="small"
      class="demo-form-inline border"
      label-width="80px"
      @submit.native.prevent
    >
      <el-form-item label="账号ID：">
        <el-input v-model="listQuery.userId" placeholder="账号ID" maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="姓名：">
        <el-input v-model="listQuery.userName" placeholder="姓名"></el-input>
      </el-form-item>
      <br>
      <el-form-item label="电话：">
        <el-input v-model="listQuery.userPhone" placeholder="电话"></el-input>
      </el-form-item>
      <el-form-item label="角色：">
        <el-select v-model="listQuery.roleId" placeholder="请选择" clearable>
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.role_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-row type="flex" :gutter="15">
      <el-col :span="24">
        <el-button type="primary" size="small" @click="add">添加</el-button>
        <el-button type="primary" size="small" :disabled="selectList.length <= 0">导出</el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="selectList.length <= 0"
          @click="prohibit"
        >禁用</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      max-height="500"
      stripe
      tooltip-effect="dark"
      style="width: 100%"
      v-loading="listLoading"
      @selection-change="selectRow"
    >
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="userid" label="账号ID" align="center"></el-table-column>
      <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
      <el-table-column prop="userPhone" label="电话" min-width="120" align="center"></el-table-column>
      <el-table-column prop="roleList" label="角色" align="center"></el-table-column>
      <el-table-column label="时间" min-width="160" align="center">
        <template slot-scope="scope">{{ dateTime(scope.row.createTime) }}</template>
      </el-table-column>
      <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="userStatus" label="状态" align="center"></el-table-column>
      <el-table-column label="操作" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <router-link :to="'/system/user/edit/' + scope.row.userid">
            <el-button type="text">修改</el-button>
          </router-link>
          <span class="line"></span>
          <!-- <el-button type="text" :class="scope.row.usability === '禁用' ? '' : 'red'">{{ scope.row.usability }}</el-button> -->
          <el-button
            type="text"
            v-show="scope.row.userStatus==='可用'"
            @click="showToggle(scope.row)"
          >禁用</el-button>
          <el-button
            type="text"
            class="red"
            v-show="scope.row.userStatus==='禁用'"
            @click="showToggle(scope.row)"
          >解禁</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-show="total > 0"
      :page-size="listQuery.pageSize"
      :pager-count="7"
      layout="prev, pager, next"
      :total="total"
      :current-page="listQuery.pageNum + 1"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<style lang="scss" scoped>
  .page-container {
    padding: 15px 30px;
    .el-table {
      margin: 15px 0;
    }
    .el-table thead th,
    .el-table thead tr {
      background-color: #e4e7ed;
      color: #333;
    }
    .el-table tr td {
      .line {
        height: 20px;
        border-left: 1px solid #333;
        margin: 0 6px;
      }
      .el-button + .el-button {
        margin: 0;
      }
    }
  }
</style>

<script>
  import {
    getUserList,
    deleteUser,
    modifyUserProhibit,
    getAllRole
  } from "@/api/system";
  import { convertDate } from "@/utils";

  export default {
    data() {
      return {
        listQuery: {
          pageNum: 0,
          pageSize: 50,
          roleId: "",
          userId: "",
          userName: "",
          userPhone: ""
        },
        roleList: [],
        tableData: [],
        selectList: [],
        listLoading: true,
        submitLoading: false,
        total: 0
      };
    },
    created() {
      this.getList();
      this.getAllRoleList();
    },
    computed: {
      dateTime() {
        return function(date) {
          return convertDate(date);
        };
      }
    },
    methods: {
      // 获取表格选中时的数据
      selectRow(val) {
        this.selectList = val;
      },
      getList() {
        this.listLoading = true;
        getUserList(this.listQuery).then(res => {
          const data = res.data;
          this.tableData = data.data.pageData;
          this.tableData.map(v => {
            if( v.supplierName==''){
               v.supplierName="-"
            }
          });
          // console.log(this.tableData);
          this.total = data.data.totalCount;
          this.listLoading = false;
        });
      },
      changePage(val) {
        this.listQuery.pageNum = val - 1;
        this.getList();
      },
      search() {
        this.listQuery.pageNum = 0;
        this.getList();
      },
      add() {
        this.$router.push({ path: "/system/user/add" });
      },
      showToggle(row) {
        let ids = [row.userid];
        let status = row.userStatus == "禁用" ? "0" : "1";
        let data = {
          ids,
          status
        };
        this.handleProhibit(data);
      },
      prohibit() {
        let data = {};
        let ids = [];
        let statusList = [];
        for (let item of this.selectList) {
          ids.push(item.userid);
        }
        for (let item of this.selectList) {
          statusList.push(item.userStatus);
        }
        if (statusList.includes("禁用")) {
          this.$confirm("所选用户已包含禁用状态，请重新选择", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {})
            .catch(() => {});
        } else {
          data.ids = ids;
          data.status = "1";
          this.handleProhibit(data);
        }

        if (statusList.includes("禁用") && ids.length == 1) {
          this.$confirm("所选用户已禁用，请重新选择", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {})
            .catch(() => {});
        }
      },
      handleProhibit(rquestData) {
        modifyUserProhibit(rquestData).then(res => {
          const data = res.data;
          this.getList();
        });
      },
      getAllRoleList() {
        getAllRole().then(res => {
          const data = res.data.data;
          this.roleList = data;
        });
      }
    }
  };
</script>