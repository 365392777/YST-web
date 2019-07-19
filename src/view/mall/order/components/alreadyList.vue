<template>
  <div>
    <el-form
      :inline="true"
      :model="listQuery"
      size="small"
      class="demo-form-inline border"
      @submit.native.prevent
    >
      <el-form-item label="营养建议编号：">
        <el-input v-model="listQuery.suggestNo" placeholder></el-input>
      </el-form-item>
      <el-form-item label="订单号：">
        <el-input v-model="listQuery.orderNo" placeholder></el-input>
      </el-form-item>
      <el-form-item label="下单时间：">
        <el-date-picker
          type="date"
          placeholder="选择起始时间"
          v-model="listQuery.createTimeStart"
          value-format="yyyy-MM-dd"
          :picker-options="pickerStartTime"
        ></el-date-picker>
        <template>
          <span>-</span>
        </template>
        <el-date-picker
          type="date"
          placeholder="选择结束时间"
          v-model="listQuery.ordecreateTimeEnd"
          value-format="yyyy-MM-dd"
          :picker-options="pickerEndTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="供应商：" prop="supplierId" v-if="isSelecShow">
        <el-select v-model="listQuery.supplierId" placeholder="请选择" clearable>
          <el-option
            v-for="item in supplierList"
            :key="item.id"
            :label="item.supplierName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="primary" @click="handleExport">导出订单</el-button>
      </el-form-item>
    </el-form>
    <div class="orderTable">
      <table border v-loading="listLoading">
        <thead>
          <tr>
            <th class="align-left">
              <el-checkbox v-model="allSelected"></el-checkbox>商品信息
            </th>
            <th width="80px">单价</th>
            <th width="80px">数量</th>
            <th>供应商</th>
            <th>实付金额</th>
            <th>支付方式</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody v-for="(tableData, index) in orders" :key="index">
          <tr>
            <td colspan="8" class="info">
              <el-checkbox v-model="items[index].selected"></el-checkbox>
              <span>营养建议编号：{{tableData.order.suggestNo}}</span>
              <span>订单号：{{ tableData.order.orderNo }}</span>
              <span>下单时间：{{ dateTime(tableData.order.createTime) }}</span>
                <span>下单用户ID：{{ tableData.order.patientId }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="3" class="padding-none">
              <table>
                <tbody>
                  <tr v-for="tableDetail in tableData.orderDetails" :key="tableDetail.detailId">
                    <td width="100px">
                      <img class="orderImg" :src="goodsImageUrl +tableDetail.images[0]" alt>
                    </td>
                    <td>
                      <div class="title">{{ tableDetail.goodsName }}</div>
                      <div class="standard">{{ tableDetail.specification }}</div>
                      <div class="orderId">{{ tableDetail.goodsId }}</div>
                    </td>
                    <td width="80px" class="nowrap">{{ tableDetail.goodsAmount }}</td>
                    <td width="80px" class="nowrap">x {{ tableDetail.goodsCount }}</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td>{{tableData.orderDetails[0].supplierName }}</td>
            <td>{{ tableData.order.actualAmount }}</td>
            <td>{{ tableData.order.payWay }}</td>
            <td>{{ tableData.order.orderStaus }}</td>
            <td>
              <router-link :to="'/mall/order/detail/' + tableData.order.id">查看详情</router-link>
            </td>
          </tr>
        </tbody>
        <tbody v-if="orders.length == 0">
          <tr>
            <td colspan="8">
              <span style="color: #909399;">暂无数据</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
  table {
    width: 100%;
    box-sizing: border-box;
  }
  .orderTable {
    text-align: center;
    max-height: 600px;
    overflow: auto;
    thead th,
    thead tr {
      background-color: #e4e7ed;
      color: #333;
    }
    td,
    th {
      padding: 12px 10px;
      table {
        margin: 0;
        tr + tr {
          border-top: 1px solid grey;
        }
        td:first-child {
          padding-right: 0;
        }
        div {
          white-space: nowrap;
        }
      }
      a,
      .line {
        display: inline-block;
        vertical-align: middle;
      }
      .line {
        height: 20px;
        border-left: 1px solid #333;
        margin: 0 6px;
      }
    }
    .padding-none {
      padding: 0;
    }
    .el-checkbox {
      margin-right: 5px;
    }
    input {
      vertical-align: middle;
    }
    div {
      text-align: left;
    }
    div + div {
      margin-top: 10px;
    }
    .info {
      text-align: left;
      span + span {
        margin-left: 15px;
      }
    }
    .orderImg {
      width: 90px;
      height: 90px;
      border: 1px dashed #d9d9d9;
      display: none;
      img {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
    }
    .orderImg:first-child {
      display: inline-block;
    }
    .nowrap {
      white-space: nowrap;
    }
  }
  .el-dialog {
    .print-body {
      .title {
        font-weight: bold;
        margin-bottom: 10px;
        font-size: 15px;
      }
      .total {
        text-align: right;
        padding: 0 10px;
        margin-top: 15px;
      }
      .el-form-item {
        margin: 0;
        margin-right: 20px;
      }
    }
    .dialogForm {
      .flex-item {
        border: 1px solid #ccc;
        padding: 15px 15px 0;
        margin-bottom: 15px;
      }
      .flex-item + .flex-item {
        border-left: none;
      }
    }
    .fill {
      margin-bottom: 20px;
    }
    .dialogPay {
      .el-form-item {
        float: left;
        width: 33.3333%;
        margin-right: 0;
      }
    }
    .dialogDelivery {
      .el-form {
        margin-bottom: 15px;
      }
      .el-row {
        margin-bottom: 15px;
        em {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #ccc;
          display: inline-block;
          vertical-align: middle;
        }
        span {
          display: inline-block;
          vertical-align: middle;
          margin-left: 5px;
        }
      }
      .el-row:first-child {
        color: #ff9933;
        em {
          background-color: #ff9933;
        }
      }
    }
  }
</style>

<script>
  import {
    getGoodsOrderList,
    exportCollectionOrder,
    getComoditySupplierList
  } from "@/api/mall";
  import { convertDate, exportFile } from "@/utils";
  import { goodsImageUrl } from "@/utils/dev";

  function getItems() {
    var items = [];
    for (var i = 0; i < 10; i++) {
      items.push({
        selected: false
      });
    }
    return items;
  }
  const ITEMS = getItems();

  export default {
    data() {
      return {
        pickerStartTime: {
          disabledDate: time => {
            if (this.listQuery.ordecreateTimeEnd) {
              let date = new Date(
                this.listQuery.ordecreateTimeEnd.replace(/-/g, "/")
              );
              return time.getTime() > date || time.getTime() > Date.now();
            } else {
              return time.getTime() > Date.now();
            }
          }
        },
        pickerEndTime: {
          disabledDate: time => {
            let date = null;
            if (this.listQuery.createTimeStart) {
              date = this.listQuery.createTimeStart.replace(/-/g, "/");
              date = new Date(date);
            }
            return time.getTime() < date || time.getTime() > Date.now();
          }
        },
        items: ITEMS,
        listQuery: {
          suggestNo: "", //营养编号
          supplierId: "", //供应商id
          orderNo: "",
          createTimeStart: "",
          ordecreateTimeEnd: "",
          operateTimeStart: "",
          operateTimeEnd: "",
          orderStatus: 4,
          pageNum: 0,
          pageSize: 10
        },
        //供应商数据
        supplierList: [],
        orders: [],
        tableData: [],
        tableDetail: [],
        listLoading: false,
        submitLoading: false,
        total: 0,
        goodsImageUrl,
        //显示/隐藏供应商下拉框
        isSelecShow: false,
      };
    },
    created() {
      // 根据供应商显示自身对应的数据
      const supplierId = localStorage.getItem("supplierId");
      this.isSelecShow = supplierId === "" ? true : false;
      this.listQuery.supplierId = supplierId;
      this.getList();
    },
    computed: {
      dateTime() {
        return function(date) {
          return convertDate(date);
        };
      },
      imageBase() {
        return function(image) {
          return "data:image/*;base64," + image;
        };
      },
      allSelected: {
        get: function() {
          return this.items.reduce(function(prev, curr) {
            return prev && curr.selected;
          }, true);
        },
        set: function(newValue) {
          this.items.forEach(function(item) {
            item.selected = newValue;
          });
        }
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        console.log(this.listQuery)

        getGoodsOrderList(this.listQuery).then(res => {
          // console.log(res);
          const data = res.data.data;
          this.orders = data.pageData || [];
          for (let item of this.orders) {
            // console.log(item.orderDetails)
            let oderDetails = item.orderDetails;
            for (let detailItem of oderDetails) {
              let images = detailItem.images;
              detailItem.images = [];
              if (images) {
                images = images.split(",");
                detailItem.images = images;
              }
            }
          }
          this.total = data.totalCount;
          this.listLoading = false;
        });

        // 获取供应商列表
        getComoditySupplierList().then(res => {
          // console.log(res)
          const resData = res.data;
          if (resData.code == "10001") {
            this.supplierList = resData.data.list;
          }
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
      handleExport() {
        let orderNos = [];
        let createTime = [];
        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i].selected) {
            for (var j = 0; j < this.orders.length; j++) {
              if (i == j) {
                orderNos.push(this.orders[j].order.orderNo);
                createTime.push(
                  this.orders[j].order.createTime.replace(/-|\s|:|\//g, "")
                );
              }
            }
          }
        }
        // 排序
        var max;
        for (var i = 0; i < createTime.length; i++) {
          for (var k = i; k < createTime.length; k++) {
            if (createTime[i] < createTime[k]) {
              max = createTime[k];
              createTime[k] = createTime[i];
              createTime[i] = max;
            }
          }
        }
        // 去重
        Array.from(new Set(createTime));
        if (orderNos.length != 0) {
          let maxTime = createTime[0];
          let minTime = createTime[createTime.length - 1];
          let newTime = minTime + "-" + maxTime;
          let flag = 4;
          if (minTime == maxTime) {
            let newTime = maxTime;
            exportCollectionOrder(orderNos, flag).then(res => {
              const resData = res.data;
              let fileName = `已完成订单${newTime}.xls`;
              exportFile(resData, fileName);
            });
          } else {
            exportCollectionOrder(orderNos, flag).then(res => {
              const resData = res.data;
              let fileName = `已完成订单${newTime}.xls`;
              exportFile(resData, fileName);
            });
          }
        } else {
          this.$message({
            message: "请先选择",
            type: "warning"
          });
        }
      }
    }
  };
</script>