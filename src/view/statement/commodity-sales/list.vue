<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">商品销售报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            class="demo-form-inline border"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="类别">
                <el-select
                    v-model="listQuery.goodsCategory"
                    clearable
                >
                    <el-option
                        v-for="item in classList"
                        :key="item.id"
                        :label="item.commodityName"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品名">
                <el-input v-model="listQuery.goodsName"></el-input>
            </el-form-item>
            <el-form-item label="商品 ID">
                <el-input v-model="listQuery.goodsId" maxlength="10"></el-input>
            </el-form-item>
            <!-- <el-form-item label="医院">
                <el-input v-model="listQuery.hospital"></el-input>
            </el-form-item> -->
            
            <!-- <el-form-item label="供应商">
                <el-input v-model="listQuery.goodsSupplier"></el-input>
            </el-form-item> -->

            <!-- 供应商 -->
            <el-form-item label="供应商" v-if="isSelecShow" >
                <el-select
                v-model="listQuery.goodsSupplier"
                placeholder="请选择供应商"
                clearable
                class="search-width"
                >
                <el-option
                    v-for="item in supplier"
                    :key="item.id"
                    :label="item.supplierName"
                    :value="item.supplierName"
                ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="时间">
                <el-date-picker
                    type="date"
                    placeholder="起始时间"
                    v-model="listQuery.startTime"
                    :picker-options="startOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
                <template><span>-</span></template>
                <el-date-picker
                    type="date"
                    placeholder="结束时间"
                    v-model="listQuery.endTime"
                    :picker-options="endOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                    @click="search"
                    type="primary"
                    icon="el-icon-search"
                    native-type="submit"
                >搜索</el-button>
            </el-form-item>
        </el-form>
        <el-row
            type="flex"
            justify="end"
            :gutter="15"
        >
            <el-col
                :span="24"
                class="align-right"
            >
                <el-button
                    type="primary"
                    size="small"
                    :disabled="selectList.length <= 0"
                    @click="handleExport"
                >导出</el-button>
            </el-col>
        </el-row>
        <el-table
            ref="multipleTable"
            :data="tableData"
            max-height="600"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
        >
            <el-table-column
                prop="goodsid"
                label="商品ID"
                width="80"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="goodsname"
                label="商品名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="suppliername"
                label="供应商"
                align="center"
            >
            </el-table-column>
            <!-- <el-table-column
                prop="hospital"
                label="医院名称"
                align="center"
            >
            </el-table-column> -->
            <el-table-column
                prop="updatetime"
                label="时间"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="goodsamount"
                label="出售价格"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="goodscount"
                label="数量"
                align="center"
            >
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
import { getCommoditySalesList, exportCommoditySalesList } from '@/api/statement'
import { 
     getComodityClassList,  // 获取商品分类列表
    getComoditySupplierList } from '@/api/util'

import { exportFile } from '@/utils'

export default {
    data() {
        return {
            listQuery: {
                hospital: '',
                goodsCategoryId: 99,
                goodsCategory: '',
                goodsId: '',
                goodsName: '',
                goodsSupplier:'',
                startTime: '',
                endTime: '',
                pageNum: 0,
                pageSize: 50,
                supplierId: '' //  供应商id
            },
            tableData: [],
            total: 0,
            listLoading: false,
            selectList: [],
            supplier:[], //  供应商数据
            startOptions: {
                disabledDate: time => {
                    if (this.listQuery.endTime) {
                        let date = new Date(
                            this.listQuery.endTime.replace(/-/g, '/')
                        )
                        return (
                            time.getTime() > date || time.getTime() > Date.now()
                        )
                    } else {
                        return time.getTime() > Date.now()
                    }
                }
            },
            endOptions: {
                disabledDate: time => {
                    let date = null
                    if (this.listQuery.startTime) {
                        date = this.listQuery.startTime.replace(/-/g, '/')
                        date = new Date(date)
                    }
                    return time.getTime() < date || time.getTime() > Date.now()
                }
            },
            classList: []
        }
    },
    created() {
          // 根据供应商显示自身对应的数据
        const supplierId = localStorage.getItem("supplierId");
        // console.log(supplierId,'supplierId供应商id')
        this.isSelecShow = supplierId === "" ? true : false;
        // this.listQuery.supperlyId = supplierId;
        this.listQuery.supplierId = supplierId;
        // console.log(this.listQuery,'供应商数据')
        this.getList()
        this.getClassList()
         this.suppliers()  //供应商
    },
    methods: {
        getList() {
            this.listLoading = true
            getCommoditySalesList(this.listQuery).then(res => {
                const resData = res.data
                this.tableData = resData.data.pageData
                this.total = resData.data.totalCount
                this.listLoading = false
            })
        },
        getClassList() {
            getComodityClassList().then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.classList = resData.data
                } else {
                    this.classList = []
                }
            })
        },
              //获取供应商下拉列表
      suppliers(){
        // console.log("获取供应商")
        getComoditySupplierList().then(res=>{
          console.log(res)
          this.supplier=res.data.data.list
          // console.log(this.supplier)
        })
      },
        search() {
            this.listQuery.pageNum = 0
            if(!this.listQuery.goodsCategory){
                this.listQuery.goodsCategoryId = 99
            }else{
                this.listQuery.goodsCategoryId = this.listQuery.goodsCategory
            }
            this.getList()
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getList()
        },
        selectRow(value) {
            this.selectList = value
        },
        handleExport() {
            let ids = []
            for (let item of this.selectList) {
                ids.push(item.id)
            }
            exportCommoditySalesList(ids).then(res => {
                const resData = res.data
                let fileName = `商品销售报表.xls`
                exportFile(resData, fileName)
            })
        },
    }
}
</script>
