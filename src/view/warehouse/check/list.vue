<template>
  <div class="page-container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
      <el-breadcrumb-item class="bold">库存盘点</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      :inline="true"
      :model="listQuery"
      ref="formCheck"
      size="small"
      class="demo-form-inline border"
      @submit.native.prevent
    >
      <el-form-item label="商品类别" prop="goodsCategoryId">
        <el-select v-model="listQuery.goodsCategoryId" clearable>
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.commodityName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="listQuery.goodsName" placeholder="输入商品名称"></el-input>
      </el-form-item>

      <!-- 供应商 -->
      <el-form-item label="供应商" prop="supplierId" v-if="isSelecShow">
        <el-select
          v-model="listQuery.supplierId"
          placeholder="请选择供应商"
          clearable
          class="search-width"
        >
          <el-option
            v-for="item in supplier"
            :key="item.id"
            :label="item.supplierName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search" native-type="submit">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="end" :gutter="15">
      <el-col :span="24" class="align-right">
        <el-button type="primary" size="small" @click="check" v-if="btnCheck == 0">开始盘点</el-button>
        <el-button type="primary" size="small" @click="check" v-show="btnCheck == 1">结束盘点</el-button>
        <el-button
          type="primary"
          v-if="btnCheck == 1"
          size="small"
          @click="handleSave"
          :disabled="selectList.length <= 0"
        >提交</el-button>
        <el-button type="primary" size="small" :disabled="selectList.length <= 0">导出</el-button>
        <el-button type="primary" size="small" @click="checkHistory">盘点记录</el-button>
      </el-col>
    </el-row>
    <el-table
      ref="multipleTable"
      :data="tableData"
      max-height="540"
      v-loading="listLoading"
      stripe
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="selectRow"
    >
      <el-table-column type="selection" width="40" align="center"></el-table-column>
      <el-table-column prop="id" label="编号" width="80px" align="center"></el-table-column>
      <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
      <!-- 供应商 -->
      <el-table-column prop="supplierName" label="供应商" align="center"></el-table-column>
      <el-table-column prop="goodsSpeName" label="规格" align="center"></el-table-column>
      <el-table-column prop="totalAmount" label="现有库存" align="center"></el-table-column>
      <el-table-column label="盘点数量" align="center">
        <template slot-scope="scope">
          <el-input
            v-model.number="scope.row.checkAmount"
            @input.native="computedProfitAndLoss($event, scope.row)"
            size="small"
            :disabled="btnCheck == 0"
            v-num-digit="scope.$index"
            data-form-model="tableData,checkAmount"
            maxlength="10"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="盈亏数量" align="center">
        <template slot-scope="scope">
          <span
            :class="{ 'green-text': scope.row.profitAndLoss < 0, 'red-text': scope.row.profitAndLoss > 0, '': scope.row.profitAndLoss == 0 }"
          >{{ scope.row.profitAndLoss }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" size="small" :disabled="btnCheck == 0"></el-input>
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

<script>
  import {
    getCheckList,
    updateStatus,
    saveCheck,
    getComodityClassList,
    currentUserOperate
  } from "@/api/stock";

  import {
    //    getComodityClassList,  // 获取商品分类列表
    getComoditySupplierList //请选择供应商,下拉选项搜索
  } from "@/api/util";

  export default {
    data() {
      return {
        btnCheck: 0,
        listQuery: {
          goodsCategoryId: "",
          goodsName: "",
          pageNum: 0,
          pageSize: 50,
          supplierId: "" //供应商id
        },
        listLoading: false,
        tableData: [],
        selectList: [],
        total: 0,
        classList: [],
        submitLoading: false,
        supplier: [] //  供应商数据
      };
    },
    created() {
      // 根据供应商显示自身对应的数据
      const supplierId = localStorage.getItem("supplierId");
      // console.log(supplierId,'supplierId供应商id')
      this.isSelecShow = supplierId === "" ? true : false;
      // this.listQuery.supperlyId = supplierId;
      this.listQuery.supplierId = supplierId;
      // console.log(this.listQuery,'供应商数据')
      this.handleCheckStatus();
      this.getList();
      this.getClassList();
      this.suppliers(); //供应商
    },
    methods: {
      getList() {
        this.listLoading = true;
        getCheckList(this.listQuery).then(res => {
          const data = res.data;
          if (data.code == "10001") {
            this.tableData = data.data.pageData;
            for (let item of this.tableData) {
              this.$set(item, "checkAmount", "");
              this.$set(item, "profitAndLoss", "");
              this.$set(item, "remark", "");
              item.currentTotalAmount = item.totalAmount;
            }
            this.total = data.data.totalCount;
            this.listLoading = false;
          }
        });
      },
      getClassList() {
        getComodityClassList().then(res => {
          this.classList = res.data;
        });
      },
      //获取供应商下拉列表
      suppliers() {
        // console.log("获取供应商")
        getComoditySupplierList().then(res => {
          // console.log(res)
          this.supplier = res.data.data.list;
          // console.log(this.supplier)
        });
      },
      handleCheckStatus() {
        currentUserOperate().then(res => {
          const resData = res.data;
          if (resData.code == "10001") {
            if (resData.data == 1) {
              this.btnCheck = 1;
            }
          }
        });
      },
      search() {
        this.listQuery.pageNum = 0;
        this.getList();
      },
      // 获取表格选中时的数据
      selectRow(val) {
        this.selectList = val;
      },
      check() {
        let status = this.btnCheck === 0 ? 1 : 0;
        updateStatus(status).then(res => {
          const resData = res.data;
          if (resData.code == "10001") {
            this.btnCheck = this.btnCheck === 0 ? 1 : 0;
            if (this.btnCheck == 0) {
              for (let item of this.tableData) {
                item.checkAmount = "";
                item.profitAndLoss = "";
                item.remark = "";
                item.currentTotalAmount = item.totalAmount;
              }
            }
          } else {
            this.$message.error(resData.error);
          }
        });
      },
      checkHistory() {
        this.$router.push({ path: "/warehouse/check/history" });
      },
      // 重置
      reset() {
        this.$refs.formCheck.resetFields();
        this.listQuery.pageNum = 0;
        this.getList();
      },
      changePage(val) {
        this.listQuery.pageNum = val - 1;
        this.getList();
      },
      computedProfitAndLoss($event, row) {
        if (row.checkAmount !== "") {
          console.log(1, row);
          console.log(row.checkAmount);
          console.log(row.totalAmount);
          row.profitAndLoss = Math.abs(row.checkAmount) - row.totalAmount;
          if (isNaN(row.profitAndLoss)) {
            row.profitAndLoss = "";
          }
        } else {
          row.profitAndLoss = "";
        }
      },
      validData() {
        let info = {
          error: false,
          message: "请输入勾选所需盘点的盘点数量"
        };
        for (let item of this.selectList) {
          if (item.checkAmount === "") {
            info.error = true;
            break;
          }
        }
        return info;
      },
      mergeData() {
        let data = [];
        for (let item of this.selectList) {
          let {
            goodsId,
            goodsSpeLoadId,
            currentTotalAmount,
            checkAmount,
            profitAndLoss,
            remark
          } = item;
          data.push({
            goodsId,
            goodsSpeLoadId,
            currentTotalAmount,
            checkAmount,
            profitAndLoss,
            remark
          });
        }
        return data;
      },
      handleSave() {
        let { error, message } = this.validData();
        if (error) {
          this.$message.error(message);
          return;
        }
        let requestData = this.mergeData();
        this.submitLoading = true;
        saveCheck(requestData)
          .then(res => {
            const resData = res.data;
            if (resData.code == "10001") {
              this.getList();
              this.$message.success(resData.error);
            } else {
              let msg = resData.error ? resData.error : "请求异常";
              this.$message.success(msg);
            }
            this.submitLoading = false;
          })
          .catch(err => {
            this.submitLoading = false;
          });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .red-text {
    color: red;
  }
  .green-text {
    color: #49cc90;
  }
</style>
