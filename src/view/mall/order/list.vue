<template>
  <div class="page-container">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
      <el-breadcrumb-item class="bold" :to="{ path: '/mall/order/list' }">订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane name="allOrders" :label="'全部订单（' + menuData.allCount + '）'" v-if="isSelecShow">
        <all-goods ref="allOrders"/>
      </el-tab-pane>
      <el-tab-pane name="awaitPay" :label="'代付款订单（' + menuData.standbyOrder + '）'" v-if="isSelecShow">
        <await-pay ref="awaitPay"/>
      </el-tab-pane>
      <el-tab-pane name="deliver" :label="'待发货订单（' + menuData.deliver + '）'">
        <deliver-goods ref="deliver"/>
      </el-tab-pane>
      <el-tab-pane name="receiving" :label="'待收货订单（' + menuData.receiving + '）'" :lazy="true">
        <receiving-goods ref="receiving"/>
      </el-tab-pane>
      <el-tab-pane name="cancle" :label="'取消订单（' + menuData.cancle + '）'" :lazy="true" v-if="isSelecShow">
        <cancle-list ref="cancle"/>
      </el-tab-pane>
      <el-tab-pane name="already" :label="'已完成订单（' + menuData.already + '）'" :lazy="true">
        <already-list ref="already"/>
      </el-tab-pane>
      <el-tab-pane name="salesOrder" :label="'售后订单（' + menuData.serviceOrder + '）'" :lazy="true">
        <sales-order ref="salesOrder"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import deliverGoods from "./components/deliverGoods";
  import receivingGoods from "./components/receivingGoods";
  import cancleList from "./components/cancleList";
  import afterSale from "./components/afterSale";
  import alreadyList from "./components/alreadyList";
  import allGoods from "./components/allGoods";
  import awaitPay from "./components/awaitPay";
  import salesOrder from "./components/salesOrder";
  import { getGoodsCategyCount } from "@/api/mall";

  export default {
    components: {
      deliverGoods,
      receivingGoods,
      cancleList,
      afterSale,
			alreadyList,
			allGoods,
			awaitPay,
			salesOrder
    },
    data() {
      return {
        menuData: {
          deliver: "",
          receiving: "",
          cancle: "",
					already: "",
					allCount:"",
					serviceOrder:"",
					standbyOrder:"",
        },
        activeName: "deliver",
         //(供应商)隐藏
        isSelecShow: false
      };
    },
    created() {
      const supplierId = localStorage.getItem("supplierId");
      this.isSelecShow = supplierId === "" ? true : false;
      this.getGoodsCategyCount();
    },
    methods: {
      handleClick(tab, event) {
        // if (this.$refs[tab.name]) {
        // 	this.$refs[tab.name].getList()
        // }
				
        // 加载后执行
        this.$nextTick(() => {
          this.$refs[tab.name].getList();
          this.getGoodsCategyCount();
        });
      },
      getGoodsCategyCount() {
        getGoodsCategyCount().then(res => {
					// console.log(res)
          const data = res.data.data;
          this.menuData = {
            deliver: data.standbyOrder,
            receiving: data.pendingOrder,
            cancle: data.cancleOrder,
            already: data.finishOrder,
            allCount: data.allCount,
            serviceOrder: data.serviceOrder,
            standbyOrder: data.standbyOrder,
          };

          if (this.menuData.deliver > 999) {
            this.menuData.deliver = 999 + "+";
          }
          if (this.menuData.receiving > 999) {
            this.menuData.receiving = 999 + "+";
          }
          if (this.menuData.cancle > 999) {
            this.menuData.cancle = 999 + "+";
          }
          if (this.menuData.already > 999) {
            this.menuData.already = 999 + "+";
          }
          if (this.menuData.allCount > 999) {
            this.menuData.allCount = 999 + "+";
          }
          if (this.menuData.serviceOrder > 999) {
            this.menuData.serviceOrder = 999 + "+";
          }
          if (this.menuData.standbyOrder > 999) {
            this.menuData.standbyOrder = 999 + "+";
          }
        });
      }
    }
  };
</script>