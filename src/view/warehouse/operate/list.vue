<template>
    <div class="page-container">
    	<el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
		    <el-breadcrumb-item class="bold">出入库管理</el-breadcrumb-item>
		</el-breadcrumb>
        <el-form 
			:inline="true"
			:model="listQuery"
			ref="form"
			size="small"
			class="demo-form-inline border"
			@submit.native.prevent
		>
		    <el-form-item label="编号" prop="ids">
		        <el-input
					v-model="listQuery.ids"
					placeholder="输入编号"
					maxlength="10"
					v-num-digit="listQuery.ids"
					data-max-value="2147483647"
				></el-input>
		    </el-form-item>
		    <el-form-item label="商品名称" prop="goodsName">
		        <el-input v-model="listQuery.goodsName" placeholder="输入商品名称关键字"></el-input>
		    </el-form-item>

		    <el-form-item label="生产厂家" prop="supplier">
		        <el-input v-model="listQuery.supplier" placeholder="输入生产厂家关键字"></el-input>
		    </el-form-item>

			<!-- 出入库供应商 -->
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
		        <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
		        <el-button type="primary" @click="reset">重置</el-button>
		    </el-form-item>
		</el-form>
		<el-row type="flex" justify="end" :gutter="15">
			<el-col :span="24" class="align-right">
				<el-button type="primary" size="small" @click="setSelectOutData" :disabled="selectList.length <= 0">出库</el-button>
				<el-button type="primary" size="small" @click="setSelectInData" :disabled="selectList.length <= 0">入库</el-button>
				<el-button type="primary" size="small" :disabled="selectList.length <= 0">导出</el-button>
				<el-button type="primary" size="small" @click="history">历史记录</el-button>
			</el-col>
		</el-row>
        <el-table
	        ref="multipleTable"
	        :data="tableData"
			v-loading="listLoading"
	        max-height="560"
	        stripe
	        tooltip-effect="dark"
	        style="width: 100%"
			@selection-change="selectRow"
		>
	        <el-table-column
	            type="selection"
	            width="40" 
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="id"
	            label="编号"
	            width="80px"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="goodsName"
	            label="商品名称"
	            align="center">
	        </el-table-column>
	        <el-table-column
	        	prop="goodsSpeName"
	            label="规格"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            prop="supplierName"
	            label="生产厂家"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            label="现有库存"
	            align="center"
			>
				<template slot-scope="scope">
					<span>{{scope.row.totalAmount}}</span>
					<span :class="{
						'arrow-green': getStockWarning(scope.row).color == 'green',
						'arrow-red': getStockWarning(scope.row).color == 'red'
					}">{{getStockWarning(scope.row).arrow}}</span>
				</template>
	        </el-table-column>
	        <el-table-column
	        	prop="inTotal"
	            label="总入库量"
	            align="center">
	        </el-table-column>
	        <el-table-column
	        	prop="outTotal"
	            label="总出库量"
	            align="center">
	        </el-table-column>
	        <el-table-column
	            label="操作"
	            align="center"
	            show-overflow-tooltip>
	            <template slot-scope="scope">
	            	<el-button type="text" @click="setOutData(scope.row)">出库</el-button>
	            	<span class="line"></span>
	            	<el-button type="text" @click="setInData(scope.row)">入库</el-button>
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
		
		<!-- 商品出库 -->
		<el-dialog title="商品出库" :visible.sync="dialogOut" center :lock-scroll="false" width="1150px">
			<div class="dialogForm">
				<el-table
			        ref="multipleTable"
			        :data="operateList"
			        max-height="400"
			        stripe
			        tooltip-effect="dark"
			        style="width: 100%"
				>
			        <el-table-column
			            prop="id"
			            label="编号"
			            width="80px"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="goodsName"
			            label="商品名称"
			            align="center">
			        </el-table-column>
			        <el-table-column
			        	prop="goodsSpeName"
			            label="规格"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            label="库位"
			            align="center">
			            <template slot-scope="scope">
			            	<el-select
								v-model="scope.row.stId"
								size="small"
								placeholder="请选择"
								@visible-change="clickSelect($event, scope.row)"
								@change="changeOutStock($event, scope.row)"
							>
			            		<el-option
									v-for="item in outStockList[scope.row.id]"
									:key="item.id"
									:label="item.name"
									:value="item.id"
								></el-option>
			            	</el-select>
			            </template>
			        </el-table-column>
			        <el-table-column
			            prop="currentTotalAmount"
			            label="现有库存"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            label="出库量"
			            align="center">
			            <template slot-scope="scope">
			            	<el-input
								v-model.number="scope.row.operateAmount"
								size="small"
								v-num-digit="scope.$index"
								data-form-model="operateList,operateAmount"
								data-nonzero
							></el-input>
			            </template>
			        </el-table-column>
					<el-table-column
			            label="备注"
			            align="center">
			            <template slot-scope="scope">
			            	<el-input v-model="scope.row.remark"  size="small"></el-input>
			            </template>
			        </el-table-column>
			        <el-table-column
			            label="操作"
			            align="center"
			            show-overflow-tooltip>
			            <template slot-scope="scope">
			            	<el-button
								type="text"
								size="small"
								class="red"
								@click="delRow(scope.$index, tableOut)"
								v-if="operateList.length > 1"
							>删除</el-button>
			            </template>
			        </el-table-column>
				</el-table>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="dialogOut = false">关闭</el-button>
				<el-button type="primary" size="small" @click="handleSave('0')" :disabled="submitLoading">提交</el-button> 
			</div> 
		</el-dialog>

		<!-- 商品入库 -->
		<el-dialog title="商品入库" :visible.sync="dialogIn" center :lock-scroll="false" width="1150px">
			<div class="dialogForm">
				<el-table
			        ref="multipleTable"
			        :data="operateList"
			        max-height="400"
			        stripe
			        tooltip-effect="dark"
			        style="width: 100%"
				>
			        <el-table-column
			            prop="id"
			            label="编号"
			            width="80px"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="goodsName"
			            label="商品名称"
			            align="center">
			        </el-table-column>
			        <el-table-column
			        	prop="goodsSpeName"
			            label="规格"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            prop="totalAmount"
			            label="现有库存"
			            align="center">
			        </el-table-column>
			        <el-table-column
			            label="入库量"
			            align="center"
					>
			            <template slot-scope="scope">
			            	<el-input
								v-model.number="scope.row.operateAmount"
								size="small"
								v-num-digit="scope.$index"
								data-form-model="operateList,operateAmount"
								data-nonzero
							></el-input>
			            </template>
			        </el-table-column>
			        <el-table-column
			            label="入库库位"
			            align="center">
			            <template slot-scope="scope">
			            	<el-select v-model="scope.row.stId" size="small" placeholder="请选择">
			            		<el-option
									v-for="item in inStockList"
									:key="item.id"
									:label="item.name"
									:value="item.id"
								></el-option>
			            	</el-select>
			            </template>
			        </el-table-column>
					<el-table-column
			            label="备注"
			            align="center">
			            <template slot-scope="scope">
			            	<el-input v-model="scope.row.remark"  size="small"></el-input>
			            </template>
			        </el-table-column>
			        <el-table-column
			            label="操作"
			            align="center"
			            show-overflow-tooltip>
			            <template slot-scope="scope">
			            	<el-button
								type="text"
								size="small"
								class="red"
								@click="delRow(scope.$index, tableIn)"
								v-if="operateList.length > 1"
							>删除</el-button>
			            </template>
			        </el-table-column>
				</el-table>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="dialogIn = false">关闭</el-button>
				<el-button type="primary" size="small" @click="handleSave('1')" :disabled="submitLoading">提交</el-button> 
			</div> 
		</el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.dialogForm{
	.el-button{
		font-size: 14px;
	}
}
</style>

<script>
import {
	getStatistics,
	getStockLocation,
	getOutStockLocation,
	saveOperate,
	getOutStockAmount
} from '@/api/stock'

  import {
   getComodityClassList,  // 获取商品分类列表
  getComoditySupplierList  //请选择供应商,下拉选项搜索
	 } from '@/api/util'
	 
export default {
	data() {
		return {
			listQuery: {
				ids: '',
				goodsName: '',
				supplier: '',
				supplierId:'',// 供应商id
				pageNum: 0,
				pageSize: 50,
			},
			tableData: [],
			total: 0,
			listLoading: false,
			dialogOut: false,
			dialogIn: false,
			tableOut: [],
			tableIn: [],
			selectList: [],
			operateList: [],
			inStockList: [],
			submitLoading: false,
			outStockList: {},
			supplier:[] //  供应商数据
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
		this.getInList()
		this.getClassList() // 获取商品分类列表
    this.suppliers()  //供应商
	},
	computed: {
		getStockWarning() {
			return (item) => {
				let result = {
					arrow: '',
					color: '',
				}
				if (item.stockEaryWarning > 0 && item.inTotal > 0 && item.totalAmount <= item.stockEaryWarning) {
					result.arrow = '↓'
					result.color = 'green'
				} else if (item.safetyEaryWarning > 0 && item.inTotal > 0 && item.totalAmount >= item.safetyEaryWarning) {
					result.arrow = '↑'
					result.color = 'red'
				}

				return result
			}
		},
	},
	methods: {
		getList() {
			this.listLoading = true
			getStatistics(this.listQuery).then(res => {
				const data = res.data
				if (data.code == '10001') {
					this.tableData = data.data.pageData
					this.total = data.data.totalCount
					this.listLoading = false
				}
			})
		},
		getInList() {
			getStockLocation().then(res => {
				this.inStockList = res.data
			})
		},
		      // 获取商品分类列表
      getClassList() {
        getComodityClassList().then(res => {
          // console.log(res)
          const resData = res.data
          if (resData.code == '10001') {
            this.classList = resData.data
          }
        })
      },
      //获取供应商下拉列表
      suppliers(){
        // console.log("获取供应商")
        getComoditySupplierList().then(res=>{
          // console.log(res)
          this.supplier=res.data.data.list
          // console.log(this.supplier)
        })
      },
		search() {
			this.listQuery.pageNum = 0
			this.getList()
		},
		// 删除行
		delRow(index) {
			this.operateList.splice(index, 1);
		},
		history() {
			this.$router.push({path: '/warehouse/operate/history'})
		},
		// 重置
		reset() {
			this.$refs.form.resetFields()
			this.listQuery.pageNum = 0
			this.getList()
		},
		changePage(val) {
			this.listQuery.pageNum = val - 1
			this.getList()
		},
		selectRow(value) {
			this.selectList = value
		},
		mergeStockData(listData) {
			this.operateList = []
			for (let item of listData) {
				let data = Object.assign({}, item)
				data.stId = ''
				data.currentTotalAmount = data.totalAmount
				data.operateAmount = ''
				data.remark = ''
				this.operateList.push(data)
			}
		},
		setInData(row) {
			if (this.inStockList.length <= 0) {
				this.getInList()
			}
			let data = [row]
			this.mergeStockData(data)

			this.dialogIn = true
		},
		setSelectInData() {
			if (this.inStockList.length <= 0) {
				this.getInList()
			}
			this.mergeStockData(this.selectList)

			this.dialogIn = true
		},
		handleOutData() {
			this.outStockList = {}
			for (let item of this.operateList) {
				item.currentTotalAmount = ''
				this.$set(this.outStockList, item.id, [])
			}
		},
		setOutData(row) {
			let data = [row]
			this.mergeStockData(data)

			this.handleOutData()

			this.dialogOut = true
		},
		setSelectOutData() {
			this.mergeStockData(this.selectList)

			this.handleOutData()

			this.dialogOut = true
		},
		clickSelect(show, row) {
			if (show && this.outStockList[row.id].length <= 0) {
				getOutStockLocation(row.goodsId, row.goodsSpeLoadId).then(res => {
					this.outStockList[row.id] = res.data
				})
			}
		},
		changeOutStock(val, row) {
			getOutStockAmount(row).then(res => {
				const resData = res.data
				if (resData.code == '10001') {
					row.currentTotalAmount = resData.data
				} else {
					let message = resData.error == '' ? '请求异常' : resData.error
					this.$message.error(message)
				}
			})
		},
		validData(type) {
			let info = {
				error: false,
				message: '',
			}
			let name = '入库'
			if (type == '0') {
				name = '出库'
			}
			info.message = `请输入${name}量，选择库位`
			for(let item of this.operateList) {
				if (!item.stId || !item.operateAmount) {
					info.error = true
					break
				} else if (type == '0' && item.currentTotalAmount < item.operateAmount) {
					info.error = true
					info.message = '出库量不可超过现有库存'
					break
				}
			}
			return info
		},
		mergeRquestData() {
			let data = []
			for (let item of this.operateList) {
				let { goodsId, goodsSpeLoadId, stId, currentTotalAmount, operateAmount, remark } = item
				let obj = {
					goodsId,
					goodsSpeLoadId,
					stId,
					currentTotalAmount,
					operateAmount,
					remark,
				}
				data.push(obj)
			}
			return data
		},
		handleSave(type) {
			let { error, message } = this.validData(type)
			if (error) {
				this.$message.error(message)
				return false
			}
			let requestData = this.mergeRquestData()
			let dialog = type == '0' ? 'Out' : 'In'
			this.submitLoading = true

			saveOperate(parseInt(type), requestData).then(res => {
				const resData = res.data
				if (resData.code == '10001') {
					this.$message.success('保存成功')
					this[`dialog${dialog}`] = false
					this.getList()
					this.submitLoading = false
				} else {
					let msg = resData.error == '' ? '保存失败' : resData.error
					this.$message.error(msg)
					this.submitLoading = false
				}
			}).catch(err => {
				this.$message.error('保存失败')
				this.submitLoading = false
			})
		},
	}
}
</script>
