<template>
  <div class="page-container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
      <el-breadcrumb-item class="bold">仓库参数管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      :inline="true"
      :model="listQuery"
      class="demo-form-inline border"
      size="small"
      @submit.native.prevent
    >
      <el-form-item>
        <el-input v-model="listQuery.name" placeholder="输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="search" type="primary" icon="el-icon-search" native-type="submit">搜索</el-button>
      </el-form-item>
      <div class="fr">
        <el-form-item>
          <el-button @click="handleCreate" type="primary">新增库位</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      max-height="600"
      stripe
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column prop="id" label="库位" width="120" align="center"></el-table-column>
      <el-table-column prop="name" label="仓库名称" align="center"></el-table-column>
      <el-table-column prop="updateUser" label="创建人" align="center"></el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ dateTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
          <span class="line"></span>
          <el-button type="text" @click="handleDelete(scope.row)" class="red">删除</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" center width="30%">
      <div class="dialog-container">
        <el-form
          size="small"
          ref="dataForm"
          :rules="rules"
          :model="formData"
          label-position="right"
          label-width="80px"
          @submit.native.prevent
        >
          <el-form-item label="库位名称" prop="name" :error="nameError">
            <el-input v-model.trim="formData.name"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
  .page-container {
    padding: 15px 30px;
    .el-col-4 button {
      float: right;
    }
    .el-table {
      margin: 15px 0;
    }
    .el-table thead th,
    .el-table thead tr {
      background-color: #e4e7ed;
      color: #333;
    }
  }
</style>

<script>
  import {
    getStorageList,
    saveStorage,
    getStorageDetail,
    deleteStorage
  } from "@/api/parameter";
  import { convertDate } from "@/utils";

  export default {
    data() {
      return {
        listQuery: {
          name: "",
          pageNum: 0,
          pageSize: 50
        },
        tableData: [],
        dialogFormVisible: false,
        dialogStatus: "",
        textMap: {
          create: "新增库位",
          update: "编辑库位"
        },
        formData: {
          name: ""
        },
        rules: {
          name: [{ required: true, message: "库位不能为空", trigger: "blur" }]
        },
        listLoading: true,
        submitLoading: false,
        total: 0,
        nameError: ""
      };
    },
    created() {
      this.getList();
    },
    computed: {
      dateTime() {
        return function(date) {
          return convertDate(date);
        };
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        getStorageList(this.listQuery).then(res => {
          const data = res.data;
          this.tableData = data.pageData;
          this.total = data.totalCount;
          this.listLoading = false;
        });
      },
      search() {
        this.listQuery.pageNum = 0;
        this.getList();
      },
      changePage(val) {
        this.listQuery.pageNum = val - 1;
        this.getList();
      },
      resetFormData() {
        this.formData = {
          name: ""
        };
      },
      handleCreate() {
        this.resetFormData();
        this.dialogStatus = "create";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      handleUpdate(row) {
        this.getDetail(row.id);
        this.dialogStatus = "update";
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      getDetail(id) {
        getStorageDetail(id).then(res => {
          this.formData = {
            id,
            dataRemoveType: 0,
            name: res.data.name
          };
        });
      },
      handleSave() {
        // console.log("添加");
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            this.submitLoading = true;
            this.nameError = "";
            saveStorage(this.formData)
              .then(res => {
                console.log(res);
                const data = res.data;
                if (data.error != "") {
                  const message = data.error;
                  this.$message({
                    message,
                    type: "error"
                  });
                  return;
                }
                this.dialogFormVisible = false;
                let isCreate = this.dialogStatus == "create";
                let message = isCreate ? "添加成功" : "修改成功";
                if (isCreate) {
                  this.listQuery.pageNum = 0;
                }
                this.getList();
                this.$message({
                  message,
                  type: "success"
                });

                this.submitLoading = false;
              })
              .catch(() => {
                this.submitLoading = false;
                this.$message({
                  message: "提交失败",
                  type: "error"
                });
              });
          }
        });
      },
      handleDelete(row) {
        let ids = [row.id];
        this.$confirm("此操作将删除信息, 确定删除？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            deleteStorage(ids).then(res => {
              const data = res.data;
              if (data.flag == "success") {
                this.$message({
                  message: data.msg,
                  type: "success"
                });
                this.getList();
              } else {
                this.$message({
                  message: data.msg,
                  type: "error"
                });
              }
            });
          })
          .catch(() => {
            // this.$message({
            //     type: 'info',
            //     message: '已取消删除'
            // })
          });
      }
    }
  };
</script>
