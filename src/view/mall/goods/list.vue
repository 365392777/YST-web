<template>
  <div class="page-container">
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      class="page-breadcrumb"
    >
      <el-breadcrumb-item
        class="bold"
        :to="{ path: '/mall/goods/list' }"
      >商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form
      :inline="true"
      :model="listQuery"
      size="small"
      class="demo-form-inline border"
      @submit.native.prevent
    >
      <el-form-item label="商品类别">
        <el-select
          v-model="listQuery.goodsCategoryId"
          placeholder="请选择类别"
          clearable
          class="search-width"
        >
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.commodityName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 供应商 -->
      <el-form-item label="供应商" v-if="isSelecShow">
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

      <el-form-item label="积分商城">
        <el-select
          v-model="listQuery.integralMall"
          placeholder="请选择"
          clearable
          class="search-width"
        >
          <el-option
            label="是"
            value="0"
          ></el-option>
          <el-option
            label="否"
            value="1"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="严选">
                <el-select
                    v-model="listQuery.stricSelect"
                    placeholder="请选择"
					clearable
                    class="search-width"
                >
                    <el-option label="是" value="0"></el-option>
                    <el-option label="否" value="1"></el-option>
                </el-select>
            </el-form-item> -->
      <el-form-item label="商品名称">
        <el-input
          v-model="listQuery.goodsName"
          placeholder="输入商品名称"
          class="search-width"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          @click="search"
          native-type="submit"
        >搜索</el-button>
        <el-button
          type="primary"
          @click="add"
        >新增商品</el-button>

        <el-button
          type="danger"
          @click="deleteSelect"
          :disabled="selectList.length <= 0"
        >删除商品</el-button>
        <!-- 获取多选数据的长度,如果长度为2以上,那么为多选,则显示上架按钮 -->
        <el-button
          type="primary"
          @click="putaway"
          :disabled="selectList.length <= 0"
           v-if="isSelecShow"
        >上架</el-button>

      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      v-loading="listLoading"
      max-height="600"
      stripe
      :default-sort="{prop: 'number', order: 'descending'}"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="selectRow"
    >
      <!-- 多选按钮 -->
      <el-table-column
        type="selection"
        width="40"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="商品ID"
        width="80"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="goosName"
        label="商品名称"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="goodsClass"
        label="类别"
        align="center"
      >
      </el-table-column>
      <!-- 供应商 -->
      <el-table-column
        prop="supplierName"
        label="供应商"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="goodsCount"
        label="库存量"
        sortable
        align="center"
      >
      </el-table-column>
      <!-- <el-table-column
                label="严选"
                align="center"
            >
                <template slot-scope="scope">
                    <el-checkbox
                        v-model="scope.row.stricSelect"
                        :true-label="'0'"
                        :false-label="'1'"
                        @change="handleEnable(scope.row, 'stricSelect')"
                    ></el-checkbox>
                </template>
            </el-table-column> -->
      <!-- 是否上架  isPutaway ,当勾选上架商品才能在前段显示-->
      <el-table-column
        label="是否上架"
        align="center"
        v-if="isSelecShow"
      >
      <!--  是否上架的 单个多选 -->
        <template slot-scope="scope">
          <!-- 根据条件来禁用多选框  :disabled='scope.row.isHaveLoad==="false"' -->
          <el-checkbox
            v-model="scope.row.uppperSelf"
            :true-label="'0'"
            :false-label="'1'"
            @change="handleisPutaway(scope.row, 'uppperSelf',scope.row.uppperSelf,scope.row.isHaveLoad)"
          ></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column
        label="积分商城"
        align="center"
      >
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.putAwayStatus"
            :true-label="'0'"
            :false-label="'1'"
            @change="handleEnable(scope.row, 'putAwayStatus',scope.row. putAwayStatus)"
          ></el-checkbox>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <!-- <el-button type="text">预览</el-button>
                    <span class="line"></span> -->
          <router-link :to="'/mall/goods/edit/' + scope.row.id">
            <el-button type="text">编辑</el-button>
          </router-link>
          <span class="line"></span>
          <el-button
            type="text"
            class="red"
            @click="deleteRow(scope.row)"
          >删除</el-button>
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
    >
    </el-pagination>
  </div>
</template>

<script>
  import {
    getGoodsList,
    enableIntegralMall,
    deleteGoods,
    requesPutawaytMall,// 是否上架

  } from '@/api/mall'
  import {
    getComodityClassList,  // 获取商品分类列表
    getComoditySupplierList  //请选择供应商,下拉选项搜索
  } from '@/api/util'

  export default {
    data() {
      return {
        listQuery: {
          goodsCategoryId: '',
          integralMall: '',//积分商城
          putAwayStatus: '',//上下架积分商城
          goodsName: '',
          stricSelect: '',
          pageNum: 0,
          pageSize: 20,
          uppperSelf: '',  //   是否上架状态值
          supplierId: '' //  供应商
        },
        tableData: [],
        selectList: [],
        total: 0,
        classList: [], //获取商品分类列表
        listLoading: false,
        goodIds: [],// 是否上架
        supplier: [], //  供应商数据
        isSelecShow: false,//显示/隐藏供应商下拉框
        isHaveLoad:[]//商品规格状态
      }
    },
    created() {
      //获取本地供应商登陆的的id
      const supplierId = localStorage.getItem("supplierId");
      //根据供应商id来判断,是不是供应商,如果是的话那么就显示,如果不是则隐藏供应商选项 
      this.isSelecShow = supplierId === "" ? true : false;
      this.listQuery.supplierId = supplierId;
      this.getList()
      this.getClassList()
      this.suppliers()  //获取供应商数据
    },
    methods: {
      getList() {
        this.listLoading = true
        getGoodsList(this.listQuery).then(res => {
          const data = res.data
          if (data.code == '10001' || data.code == 'NL_001') {
            //tableData 获取页面渲染的数据
            this.tableData = data.data.pageData
            for (let item of this.tableData) {
              if (item.goodsCount == null) {
                item.goodsCount = 0
              }
            }
            this.total = data.data.totalCount
            this.listLoading = false
          }
        })
      },
      // 获取商品分类列表
      getClassList() {
        getComodityClassList().then(res => {
          const resData = res.data
          if (resData.code == '10001') {
            this.classList = resData.data
          }
        })
      },
      //获取供应商下拉列表
      suppliers() {
        getComoditySupplierList().then(res => {
          this.supplier = res.data.data.list
        })
      },
      search() {
        this.listQuery.pageNum = 0
        this.getList()
      },
      changePage(val) {
        this.listQuery.pageNum = val - 1
        this.getList()
      },
      submit() { },
      filterTag(value, row) {
        return row.usability === value
      },
      // 获取表格选中时的数据
      selectRow(val) {
        //获取多选数据的长度,如果长度为2以上,那么为多选,则显示上架按钮
        this.selectList = val
      },
      add() {
        this.$router.push({ path: '/mall/goods/add' })
      },
      // 积分商城多选按钮
      handleEnable(row, type,putAwayStatus) {
        let requestData = {
          goodsId: row.id,
          putAwayStatus:putAwayStatus
        }
        requestData[type] = row[type]
        enableIntegralMall(requestData).then(res => {
          const resData = res.data
          if (resData.code == '10001') {
            this.$message.success('操作成功')
            //0是上架,1是下架
          } else {
            this.$message.error('操作失败')
            this.getList()
          }
        })
      },
      // 是否上架复选按钮
      handleisPutaway(row, type,uppperSelf,isHaveLoad) {
        if(isHaveLoad==='true'){
          let data = {
          goodIds: [row.id],
          upperSelf: uppperSelf
        }
        data[type] = row[type]
        requesPutawaytMall(data).then(res => {
          const resData = res.data
          if (resData.code == '10001') {
            this.$message.success('操作成功')
          } else {
            this.$message.error('操作失败')
            this.getList()
          }
        })
     }else{
          this.$message({
          message: '此商品无商品规格,不允许上架,请完善!',
          type: 'warning'
        });
        this.getList()
     }
 },
       // 点击上架按钮
      handleCheckisPutaway(type,row) {
        let dataId = []
        for (let item of row) {
          if(item.isHaveLoad=='true'){
              dataId.push(item.id)//获取多选当前行id
        let data = {
          goodIds: dataId,
          upperSelf:type
        }
        data[type] = row[type]
         requesPutawaytMall(data).then(res => {
          const resData = res.data
          if (resData.code == '10001') {
            this.$message.success('操作成功')
            this.getList()
          } else {
            this.$message.error('操作失败')
            this.getList()
          }
        })
     }else{
         this.$message.error('操作失败,所选商品存在未填写的商品规格')
          this.getList()
     }
  }
},

      deleteRow(row) {
        let data = []
        data.push(row.id)
        this.deleteConfirm(data)
      },
      deleteSelect() {
        let data = []
        for (let item of this.selectList) {
          data.push(item.id)
        }
        this.deleteConfirm(data)
      },
      // 是否上架按钮
      putaway() {
        this.$confirm('是否将选中商品上架？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          this.handleCheckisPutaway(0,this.selectList)
        }).catch(() => {
          // this.$message({
          //     type: 'info',
          //     message: '已取消上架'
          // })
        })
      },
      deleteConfirm(data) {
        this.$confirm('此操作将删除信息, 确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true,
        }).then(() => {
          this.handleDelete(data)
        }).catch(() => {
          // this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          // })
        })
      },
      handleDelete(requestData) {
        deleteGoods(requestData).then(res => {
          const data = res.data
          if (data.flag == 'success') {
            this.$message({
              message: data.msg,
              type: 'success',
            })
            this.getList()
          } else {
            this.$message({
              message: data.msg,
              type: 'error',
            })
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .search-width {
    width: 200px;
  }
</style>

