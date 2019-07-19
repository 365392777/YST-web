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
      <el-form-item label="发货时间：">
        <el-date-picker
          type="date"
          placeholder="选择起始时间"
          v-model="listQuery.operateTimeStart"
          value-format="yyyy-MM-dd"
          :picker-options="pickerStartTime"
        ></el-date-picker>
        <template>
          <span>-</span>
        </template>
        <el-date-picker
          type="date"
          placeholder="选择结束时间"
          v-model="listQuery.operateTimeEnd"
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
        <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
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
            <th>收货信息</th>
            <th>供应商</th>
            <th>实付金额</th>
            <th>支付方式</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody v-for="(tableData, index) in orders" :key="index">
          <tr>
            <td colspan="8" class="info">
              <el-checkbox v-model="items[index].selected"></el-checkbox>
              <span>营养建议编号：{{tableData.order.suggestNo}}</span>
              <span>订单号：{{ tableData.order.orderNo }}</span>
              <span>物流公司：{{ tableData.order.logisticsCompany }}</span>
              <span>快递单号：{{ tableData.order.courierNumber }}</span>
              <span>发货时间：{{ dateTime(tableData.order.updateTime) }}</span>
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
            <td width="320px">
              <div class="address">
                地址：
                {{ tableData.order.receivingAddress.receivingProvince }}
                {{ tableData.order.receivingAddress.receivingCity }}
                {{ tableData.order.receivingAddress.receivingCounty }}
                {{ tableData.order.receivingAddress.receivingDetail }}
              </div>
              <div class="name">收货人：{{ tableData.order.receivingAddress.receivingName }}</div>
              <div class="phone">联系电话：{{ tableData.order.receivingAddress.receivingPhone }}</div>
            </td>
            <td>{{tableData.orderDetails[0].supplierName }}</td>
            <td>{{ tableData.order.actualAmount }}</td>
            <td>{{ tableData.order.payWay }}</td>
            <td>
              <el-button class="outline" @click="handleDetail(index)">查看详情</el-button>
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

    <!-- 订单详情 -->
    <el-dialog title="订单详情" :visible.sync="dialogDetail" center :lock-scroll="false" width="60%">
      <el-tabs type="card">
        <el-tab-pane label="订单信息">
          <div class="print-body dialogForm">
            <div class="flex">
              <div class="flex-item">
                <div class="title">订单详情</div>
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="下单日期：" prop="createTime">
                    <template>{{ dateTime(formDetail.createTime) }}</template>
                  </el-form-item>
                  <el-form-item label="订单号：" prop="orderNo">
                    <template>{{ formDetail.orderNo }}</template>
                  </el-form-item>
                  <el-form-item label="支付方式：" prop="payWay">
                    <template>{{ formDetail.payWay }}</template>
                  </el-form-item>
                  <!-- <el-form-item label="留言：" prop="remark">
								    	<template>{{ formDetail.remark }}</template>
                  </el-form-item>-->
                </el-form>
              </div>
              <div class="flex-item">
                <div class="title">收货信息</div>
                <el-form :inline="true" class="demo-form-inline">
                  <el-form-item label="收件人：" prop="receivingName">
                    <template>{{ formDetail.receivingName }}</template>
                  </el-form-item>
                  <el-form-item label="收货地址：" prop="receivingAddress">
                    <template>{{ formDetail.receivingAddress }}</template>
                  </el-form-item>
                  <!-- <el-form-item label="邮编：" prop="zipCode">
								    	<template>{{ formDetail.zipCode }}</template>
                  </el-form-item>-->
                </el-form>
              </div>
            </div>
          </div>
          <div class="print-body">
            <div class="title">商品信息</div>
            <el-table :data="tablePrint" style="width: 100%">
              <el-table-column prop="goodsName" label="商品名称" align="center"></el-table-column>
              <el-table-column prop="specification" label="商品规格" align="center"></el-table-column>
              <el-table-column prop="goodsCount" label="数量" align="center"></el-table-column>
              <el-table-column prop="goodsAmount" label="商品单价" align="center"></el-table-column>
              <el-table-column
                prop="goodsSubtotal"
                label="商品小计"
                align="center"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
            <p class="total">订单总额：￥ {{ formDetail.orderAmount }}</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="支付信息">
          <div class="print-body dialogPay">
            <el-form :inline="true" class="demo-form-inline border clearfix">
              <el-form-item label="订单总额：" prop="orderAmount">
                <template>{{ formDetail.orderAmount }}</template>
              </el-form-item>
              <el-form-item label="运费：" prop="freight">
                <template>{{ formDetail.freight }}</template>
              </el-form-item>
              <el-form-item label="积分：" prop="integralExchenge">
                <template>{{ formDetail.integralExchenge }}</template>
              </el-form-item>
              <el-form-item label="优惠券：" prop="disCountAmount">
                <template>{{ formDetail.disCountAmount }}</template>
              </el-form-item>
              <el-form-item label="活动：" prop="activity">
                <template>{{ formDetail.activity }}</template>
              </el-form-item>
              <el-form-item label="应付：" prop="actualAmount">
                <template>{{ formDetail.actualAmount }}</template>
              </el-form-item>
              <el-form-item label="实付金额：" prop="actualAmount">
                <template>{{ formDetail.actualAmount }}</template>
              </el-form-item>
              <el-form-item label="支付方式：" prop="payWay">
                <template>{{ formDetail.payWay }}</template>
              </el-form-item>
              <!-- <el-form-item label="支付时间：" prop="payTime">
						    	<template>
						    		<div v-if="formDetail.payTime == ''">{{ dateTime(formDetail.payTime) }}</div>
						    	</template>
              </el-form-item>-->
              <!-- <el-form-item label="发票类型：" prop="invoice">
						    	<template>{{ formDetail.invoice }}</template>
              </el-form-item>-->
              <el-form-item label="发票抬头：" prop="invoiceRisetype" v-if="formDetail.isInvoice == 0">
                <template>
                  <div v-if="formDetail.invoiceRisetype == 0">个人</div>
                  <div v-else>单位</div>
                </template>
              </el-form-item>
              <el-form-item
                label="纳税人识别码："
                prop="taxpayerNum"
                v-if="formDetail.invoiceRisetype == 1"
              >
                <template>{{ formDetail.taxpayerNum }}</template>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="物流信息">
          <div class="print-body dialogDelivery">
            <el-form :inline="true" class="demo-form-inline">
              <el-form-item label="物流公司：" prop="logisticsCompany">
                <template>{{ formDetail.logisticsCompany }}</template>
              </el-form-item>
              <el-form-item label="快递单号：" prop="courierNumber">
                <template>{{ formDetail.courierNumber }}</template>
              </el-form-item>
              <el-form-item label="发货人：" prop="updateUser">
                <template>{{ formDetail.updateUser }}</template>
              </el-form-item>
              <el-form-item label="发货时间：" prop="createTime">
                <template>{{ dateTime(formDetail.createTime) }}</template>
              </el-form-item>
            </el-form>
            <div class="border">
              <el-row v-for="item in logisticsList" :key="item.id">
                <el-col :span="24">
                  <em></em>
                  <span>{{ dateTime(item.time) }}</span>
                  <span>{{ item.context }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogDetail = false">关闭</el-button>
      </div>
    </el-dialog>
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
      line-height: 24px;
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
    max-height: 80vh;
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
    getGoodsOrderDetail,
    getGoodsOrderDeliver,
    getLogisticsList,
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
            if (this.listQuery.operateTimeEnd) {
              let date = new Date(
                this.listQuery.operateTimeEnd.replace(/-/g, "/")
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
            if (this.listQuery.operateTimeStart) {
              date = this.listQuery.operateTimeStart.replace(/-/g, "/");
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
          orderStatus: 1,
          pageNum: 0,
          pageSize: 10
        },
        //供应商数据
        supplierList: [],
        orders: [],
        // 待收货
        tableData: [],
        tableDetail: [],
        // 弹出框
        dialogDetail: false,
        formDetail: [],
        tablePrint: [],
        logisticsList: [],
        listLoading: false,
        submitLoading: false,
        total: 0,
        goodsImageUrl,
        //显示/隐藏供应商下拉框
        isSelecShow: false
      };
    },
    created() {
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
        getGoodsOrderList(this.listQuery).then(res => {
          const data = res.data.data;
          this.orders = data.pageData || [];
          for (let item of this.orders) {
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
      handleDetail(index) {
        let id = this.orders[index].order.id;
        this.getDetail(id);
        this.getLogisticsDetail(id);
        this.dialogDetail = true;
      },
      getDetail(id) {
        getGoodsOrderDetail(id).then(res => {
          const data = res.data.data;
          this.formDetail = {
            updateUser: data.orderBaseInfo.updateUser,
            createTime: data.orderBaseInfo.createTime,
            orderNo: data.orderBaseInfo.orderNo,
            payWay: data.orderBaseInfo.payWay,
            remark: data.orderBaseInfo.remark,
            receivingName: data.orderBaseInfo.receivingAddress.receivingName,
            receivingAddress:
              data.orderBaseInfo.receivingAddress.receivingProvince +
              data.orderBaseInfo.receivingAddress.receivingCity +
              data.orderBaseInfo.receivingAddress.receivingCounty +
              data.orderBaseInfo.receivingAddress.receivingDetail,
            zipCode: data.orderBaseInfo.zipCode,
            actualAmount: data.orderBaseInfo.actualAmount,
            orderAmount: data.orderBaseInfo.orderAmount,
            freight: data.orderBaseInfo.freight,
            integralExchenge: data.orderBaseInfo.integralExchenge,
            disCountAmount: data.orderBaseInfo.disCountAmount,
            payTime: data.orderBaseInfo.payTime,
            invoice: data.orderBaseInfo.invoice,
            isInvoice: data.orderBaseInfo.isInvoice,
            invoiceRisetype: data.orderBaseInfo.invoice.invoiceRisetype,
            taxpayerNum: data.orderBaseInfo.invoice.taxpayerNum,
            logisticsCompany: data.orderBaseInfo.logisticsCompany,
            courierNumber: data.orderBaseInfo.courierNumber
          };
          this.tablePrint = data.orderDetails;
          for (let item of this.tablePrint) {
            item.goodsSubtotal = item.goodsAmount * item.goodsCount;
          }
        });
      },
      getLogisticsDetail(id) {
        getLogisticsList(id).then(res => {
          const data = res.data.data;
          this.logisticsList = data.list;
        });
      },
      handleExport() {
        let orderNos = [];
        let updateTime = [];
        for (var i = 0; i < this.items.length; i++) {
          if (this.items[i].selected) {
            for (var j = 0; j < this.orders.length; j++) {
              if (i == j) {
                orderNos.push(this.orders[j].order.orderNo);
                updateTime.push(
                  this.orders[j].order.updateTime.replace(/-|\s|:|\//g, "")
                );
              }
            }
          }
        }
        // 排序
        var max;
        for (var i = 0; i < updateTime.length; i++) {
          for (var k = i; k < updateTime.length; k++) {
            if (updateTime[i] < updateTime[k]) {
              max = updateTime[k];
              updateTime[k] = updateTime[i];
              updateTime[i] = max;
            }
          }
        }
        // 去重
        Array.from(new Set(updateTime));
        if (orderNos.length != 0) {
          let maxTime = updateTime[0];
          let minTime = updateTime[updateTime.length - 1];
          let newTime = minTime + "-" + maxTime;
          let flag = 1;
          if (minTime == maxTime) {
            let newTime = maxTime;
            exportCollectionOrder(orderNos, flag).then(res => {
              const resData = res.data;
              let fileName = `待收货${newTime}.xls`;
              exportFile(resData, fileName);
            });
          } else {
            exportCollectionOrder(orderNos, flag).then(res => {
              const resData = res.data;
              let fileName = `待收货${newTime}.xls`;
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