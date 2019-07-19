<template>
	<div class="spec-container">
		<div class="flexBox">
			<el-row class="flex">
				<el-col :span="4">商品规格模型</el-col>
				<el-col class="flex-item">
					<el-select
                        v-model="formData.modelId"
                        size="small"
                        placeholder=""
                        @change="changeModel"
                        :disabled="banChangeModel"
                    >
                        <el-option
                            v-for="item in modelList"
                            :key="item.id"
                            :label="item.speModelName"
                            :value="item.id"
                        ></el-option>
                    </el-select>
			        <el-button type="text" size="small" @click="handleUpdate" :disabled="formData.modelId == '' || banChangeModel">编辑</el-button>
			        <span class="line"></span>
			        <el-button type="text" size="small" @click="handleCreate" :disabled="banChangeModel">新增</el-button>
				</el-col>
			</el-row>
			<el-row class="flex">
                <el-col :span="24">商品规格</el-col>
            </el-row>
            <el-row
                class="flex"
                v-for="item in specifications"
                :key="item.specification.id"
            >
                <el-col :span="4">{{ item.specification.speName }}</el-col>
                <el-col class="flex-item">
                    <el-button
                        size="small"
                        v-for="valueItem in item.values"
                        :class="{active: valueItem.choose}"
                        @click="toggleItem(valueItem, item.specification)"
                        :key="valueItem.id"
                        :disabled="banChangeSpec(valueItem, item.values)"
                    >{{valueItem.speValue}}</el-button>
                </el-col>
            </el-row>
            <el-row class="flex" v-if="specifications.length <= 0">
                <el-col :span="24" class="no-spec-data">无规格</el-col>
            </el-row>
		</div>
        <div class="spec-table" v-if="specFromData.length > 0">
            <el-table
                :data="specFromData"
                border
                style="width: 100%;"
            >
                <el-table-column
                    v-for="item in selectSpecAttr"
                    :key="item.id"
                    :label="item.name"
                    align="center"
                >
                    <template slot-scope="scope">
                        {{ scope.row[item.index] }}
                    </template>
                </el-table-column>
                <el-table-column
                    label="含量"
                    align="center"
                    width="250"
                >
                    <template slot-scope="scope">
                        <el-col :span="15">
                            <el-input
                                v-model.number="scope.row.netWeight"
                                size="small"
                                data-nonzero
                                :ref="'netWeight'+scope.$index"
                                @input.native="inputLimit($event, scope.row, 'netWeight', $refs['netWeight' + scope.$index])"
                            ></el-input>
                        </el-col>
                        <el-col :span="8" :offset="1">
                            <el-select
                                v-model="scope.row.netWeightUnit"
                                size="small"
                            >
                                <el-option
                                    v-for="item in weightUnitList"
                                    :key="item.dicSubval"
                                    :label="item.dicSubname"
                                    :value="item.dicSubval"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </template>
                </el-table-column>
                <el-table-column
                    label="售价（元）"
                    align="center"
                    width="120"
                >
                    <template slot-scope="scope">
                        <el-input
                            v-model.number="scope.row.markprice"
                            size="small"
                            :ref="'markPrice'+scope.$index"
                            data-dotrange="{0,2}"
                            @input.native="inputLimit($event, scope.row, 'markprice', $refs['markPrice' + scope.$index])"
                        ></el-input>
                    </template>
                </el-table-column>
                <!-- <el-table-column
                    label="库存"
                    align="center"
                    width="120"
                >
                    <template slot-scope="scope">
                        <el-input
                            v-model.number="scope.row.goodsStock"
                            size="small"
                            v-num-digit="scope.$index"
                            data-form-model="specFromData,goodsStock"
                            data-nonzero
                            @keyup.native="test(scope.row)"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="库位"
                    align="center"
                    width="120"
                >
                    <template slot-scope="scope">
                        <el-select
                            v-model="scope.row.stId"
                            size="small"
                        >
                            <el-option
                                v-for="item in stockList"
                                :key="item.id"
                                :value="item.id"
                                :label="item.name"
                            ></el-option>
                        </el-select>
                    </template>
                </el-table-column> -->
                <el-table-column
                    label="库存预警"
                    align="center"
                    width="120"
                >
                    <template slot-scope="scope">
                        <el-input
                            v-model.number="scope.row.stockEaryWarning"
                            size="small"
                            data-nonzero
                            :ref="'stockEaryWarning' + scope.$index"
                            @input.native="inputLimit($event, scope.row, 'stockEaryWarning', $refs['stockEaryWarning' + scope.$index])"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    label="安全预警"
                    align="center"
                    width="120"
                >
                    <template slot-scope="scope">
                        <el-input
                            v-model.number="scope.row.safetyEaryWaring"
                            size="small"
                            data-nonzero
                            :ref="'safetyEaryWaring' + scope.$index"
                            @input.native="inputLimit($event, scope.row, 'safetyEaryWaring', $refs['safetyEaryWaring' + scope.$index])"
                        ></el-input>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="mt20">
            <router-link to="/mall/goods/list">
                <el-button size="small">返回</el-button>
            </router-link>
			<el-button type="primary" size="small" class="ml20" @click="handleSave" :loading="submitLoading">提交</el-button>
		</div>
        <spec-dialog
            :dialog-form-visible.sync="dialogFormVisible"
            :dialog-status="dialogStatus"
            :spec-data="specData"
            @call-back="dialogCallBack"
        ></spec-dialog>
	</div>
</template>

<script>
import SpecDialog  from '@/components/SpecDialog'
import {
    saveSpecification,
    getSpecificationDetail,// 获取商品规格模型详情
} from '@/api/commodity'
import { getGoodsSpecDetail, saveGoodsSpec  } from '@/api/mall'
import { getDicList } from '@/api/util'
import { getStockLocation } from '@/api/stock'
import inputLimit from '@/mixins/inputLimit'

const addObj = {
    name: '',
    sort: '',
    valueList: [
        {
            value: '',
            dataRemoveType: 0,
        }
    ],
    dataRemoveType: 0,
}

export default {
    components: { SpecDialog },
    mixins: [inputLimit],
    props: {
        baseId: {
            default: '',
        },
        isEdit: {
            type: Boolean,
            default: false,
        },
    },
    data() {
		return {
			modal: '',
	        // 弹出框
	        dialogFormVisible: false,
            dialogStatus: '',
            formData: {
                modelId: '',
                goodsId: '',
                list: [],
            },
            modelList: [],
            vallList: [],//'商品含量-售价-库存-安全预警-值'
            weightUnitList: [],
            specifications: [],
            specData: {},
            goodsId: '',
            specList: {},
            selectSpec: [],
            resData: {},
            specFromData: [],
            selectSpecAttr: {},
            stockList: [],
            submitLoading: false,
		}
    },
    created() {
        let id = this.$route.params && this.$route.params.id
        this.goodsId = id || this.baseId
        this.getDetail(id)// 获取商品规格
        this.getSelectList()
    },
    computed: {
        // 如果有选中的商品规格,则解禁编辑按钮
        banChangeModel() {
            let result = false
            for (let item of this.vallList) {
                if (item.goodsStock != null && item.goodsStock > 0) {
                    result = true
                    break
                }
            }
            return result
        },
    },
    methods: {
        getDetail(id) {
        // 获取商品规格
            getGoodsSpecDetail(id).then(res => {
                const resData = res.data
                // console.log(resData,'获取商品规格')
                // 获取商品数据
                this.modelList = resData.modelListAll
                // 获取输入值'商品含量-售价-库存-安全预警-值'的内容进行保存(数组)
                this.vallList = resData.vallList
                // console.log(this.vallList,'商品含量-售价-库存-安全预警-值')
                if (resData.modelId != 0) {
                    // 获取当前保存商品的id
                    this.formData.modelId = resData.modelId
                    // 传入id,和当前输入值商品含量-售价-库存-安全预警-值的内容进行保存内容进行保存,进行调用获取商品规格模型详情
                    this.getModelSelectDetail(resData.modelId, resData.vallList)
                }
            })
        },
        getSelectList() {
            getDicList('D014').then(res => {
                this.weightUnitList = res.data
            })
            getStockLocation().then(res => {
                this.stockList = res.data
            })
        },
        // 切换class
	    toggleItem(item, specification) {
            let s = specification

            if (item.choose === undefined) {
                this.$set(item, 'choose', false)
            }
            item.choose = item.choose === true ? false : true

            this.specList[s.id] = []
            this.getSelectSpec()
        },
        initSelectSpec() { 
            this.selectSpec = []
            for (let i = 0; i < this.specifications.length; i++) {
                this.selectSpec.push([])
            }
        },
        getModelDetail(id) {
            // 获取商品规格模型详情
            getSpecificationDetail(id).then(res => {
                console.log(res,'获取商品规格模型详情')
                const resData = res.data
                if (resData.flag == 'success') {
                    this.specFromData = []
                    this.specList = {}
                    this.specData = resData.data
                    // 商品规格数据
                    this.specifications = resData.data.specifications
                    
                    // 调用增加列表
                    this.initSelectSpec()
                } else {
                    this.specifications = []
                    this.initSelectSpec()
                    this.$message.error('获取商品规格失败')
                }
            })
        },
        // 传入id,和当前输入的商品含量-售价-库存-安全预警-值的内容进行保存
        getModelSelectDetail(id, vallList) {
            // 获取商品规格模型详情
            getSpecificationDetail(id).then(res => {
                const resData = res.data
                // console.log(resData,'获取商品规格模型详情')
                if (resData.flag == 'success') {
                    this.specFromData = []
                    this.specList = {}
                    // 保存规格模型详情数据()
                    this.specData = resData.data
                    // 保存当前规格模型详情数据
                    this.specifications = resData.data.specifications
                    this.initSelectSpec()
                    let loadArr = []
                    // 输入商品含量-售价-库存-安全预警-值的内容进行保存
                    vallList.map(v => {
                        // console.log(vallList,'商品含量-售价-库存-安全预警')
                        let splitItem = v.loadStr.split('-')//获取id
                        // console.log(splitItem)//id
                        loadArr = loadArr.concat(splitItem)//合并id到loadArr空数组
                    })
                    // 遍历当前规格模型详情values中的数据

                    // 操作数组数据，并且要求实时更新视图数据，注：当发现model上的数据发生改变，而页面上的视图数据没有改变，推荐使用该方法。该方法的使用首先要在页面引入vue,应该这样写：import Vue from 'vue'，这样才能在组件全局获取到vue这个实例对象。如果你觉得引入麻烦，推荐使用vue.set的别名this.$set。
                    // this.$set(arr,  index,  val)。当然，this.$set除了用于操作数组外还可以操作对象，使用示例：this.$set( obj, key, val).
                    this.specifications.map(v => {
                        v.values.map(value => {
                            if (loadArr.indexOf((value.id).toString()) > -1) {
                                // 参数一value数组,参数二choose为后台返回的true,参数三值为true
                                this.$set(value, 'choose', true)
                            }
                        })
                    })

                    this.getSelectSpec()

                    this.mergeSpecData(vallList)//商品含量-售价-库存-安全预警(数组)
                    
                } else {
                    this.specifications = []
                    this.initSelectSpec()
                    this.$message.error('获取商品规格失败')
                }
            })
        },
        mergeSpecData(vallList) {//商品含量-售价-库存-安全预警(数组)
            let valObj = {}
            vallList.map(v => {
                valObj[v.loadStr] = v
                // console.log(valObj)
            })
            // console.log( this.specFromData)
            this.specFromData.map(v => {
                let inValStr = ''
                let valKeys = Object.keys(valObj)
                // console.log(valKeys) //id
                let loadIdArr = v.detailLoads.split('-')
                // console.log(loadIdArr) //id
                for(let str of valKeys) {
                    let arr = str.split('-')
                    // console.log(arr) //当前的id
                }
                if (valObj[v.detailLoads]) {
                    let specItem = valObj[v.detailLoads]
                    // console.log(specItem,'商品含量-售价-库存-安全预警400')
                    v.id = specItem.id
                    v.markprice = specItem.markprice
                    v.goodsStock = 0
                    v.stId = 0
                    v.stockEaryWarning = specItem.stockEaryWarning
                    v.safetyEaryWaring = specItem.safetyEaryWaring
                    v.netWeight = specItem.netWeight
                    v.netWeightUnit = specItem.netWeightUnit
                    // v.netWeightUnit = 'g'
                    // console.log(specItem.netWeightUnit)
                }
            })
            // console.log( '第二个',this.specFromData)
        },
        getSelectSpec() {
            this.initSelectSpec()
            this.selectSpecAttr = []
            let arr = []

            // 获取所有选中的规格信息
            for (let i = 0; i < this.specifications.length; i++) {
                let item = this.specifications[i]
                for (let j = 0; j < item.values.length; j++) {
                    let valueItem = item.values[j]
                    if (valueItem.choose) {
                        let spec = {
                            id: valueItem.id,
                            name: {
                                [i]: valueItem.speValue
                            },
                        }
                        this.selectSpec[i].push(spec)

                        // 获取选中的规格名
                        if (arr.indexOf(item.specification.id) == -1) {
                            arr.push(item.specification.id)
                            this.selectSpecAttr.push({
                                id: item.specification.id,
                                name: item.specification.speName,
                                index: i,
                            })
                        }
                    }
                }
            }

            this.resData = {
                id: [],
                name: [],
            }
            let codeSpecData = this.specFromData
            this.specFromData = []
            this.getSpecFormData(this.selectSpec, 0, this.selectSpec.length)

            let specObj = {}
            codeSpecData.map(v => {
                specObj[v.detailLoads] = v
            })

            // 当loadId是一致时，重新赋值
            for (let item of this.specFromData) {
                if (specObj[item.detailLoads]) {
                    let specItem = specObj[item.detailLoads]
                    item.markprice = specItem.markprice
                    item.goodsStock = 0
                    item.stId = 0
                    item.stockEaryWarning = specItem.stockEaryWarning
                    item.safetyEaryWaring = specItem.safetyEaryWaring
                    item.netWeight = specItem.netWeight
                    item.netWeightUnit = specItem.netWeightUnit
                }
            }
        },
        // 递归获取规格列表
        getSpecFormData(data, layer, length) {
            if (layer == length) {
                let obj = {
                    detailLoads: this.resData.id.join('-'),
                    markprice: null,
                    goodsStock: 0,
                    stId: 0,
                    stockEaryWarning: null,
                    safetyEaryWaring: null,
                    netWeight: null,
                    netWeightUnit: '0'
                }
                if (this.resData.id.length != 0) {
                    this.resData.name.map(v => {
                        for (const key in v) {
                            if (v.hasOwnProperty(key)) {
                                obj[key] = v[key]
                            }
                        }
                    })
                    this.specFromData.push(obj)
                }

                this.resData.id.pop()
                this.resData.name.pop()
                return
            }
            if (data[layer].length == 0) {
                this.getSpecFormData(data, layer + 1, length)
                return
            } else {
                for (let i = 0, len = data[layer].length; i < len; i++) {
                    this.resData.id.push(data[layer][i].id)
                    this.resData.name.push(data[layer][i].name)
                    this.getSpecFormData(data, layer + 1, length)
                }
            }
            this.resData.id.pop()
            this.resData.name.pop()
        },
        changeModel(value) {
            this.getModelDetail(value)
        },
        banChangeSpec(item, valueList) {
            let result = false
            let valueArr = []
            for (let value of valueList) {
                valueArr.push(value.id.toString())
            }
            
            for (let valItem of this.vallList) {
                let loadStr = valItem.loadStr.split('-')
                let concatArr = valueArr.concat(loadStr)
                concatArr = [...(new Set(concatArr))]
                let lengthSum = valueArr.length + loadStr.length

                if (loadStr.indexOf((item.id).toString()) > -1 && valItem.goodsStock != null && valItem.goodsStock > 0) {
                    result = true
                    break
                } else if ((loadStr.length != this.specifications.length) && (concatArr.length == lengthSum) && valItem.goodsStock != null && valItem.goodsStock > 0) {
                    result = true
                    break
                }
            }
            return result
        },
        handleCreate() {
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
        },
        handleUpdate(row) {
            this.getModelDetail(this.formData.modelId)
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
        },
        dialogCallBack(data) {
            if (this.dialogStatus == 'update') {
                this.specList = {}
            } else {
                this.specList = {}
                this.formData.modelId = data.model.id
                let id = this.baseId
                if (this.isEdit) {
                    id = this.goodsId
                }
                //获取商品规格
                this.getDetail(id)
            }
            this.specifications = data.specifications
            this.initSelectSpec()
        },
        validSepList() {
            let valid = true
            for (let item of this.specFromData) {
                if (item.markprice == null) {
                    valid = false
                }
            }
            return valid
        },
        validSelectSpec() {
            let b = []
            let result = true

            for (let i = 0; i < this.specifications.length; i++) {
                b.push(false)
                let item = this.specifications[i]
                for (let valueItem of item.values) {
                    if (valueItem.choose) {
                        b[i] = true
                        break
                    }
                }
            }
            
            for (let item of b) {
                if (!item) {
                    result = false
                    break
                }
            }

            return result
        },
        mergeData() {
            let list = []
            this.specFromData.map(v => {
                let obj = {
                    id: v.id,
                    detailLoads: v.detailLoads,
                    markprice: v.markprice,
                    goodsStock: 0,
                    stId: 0,
                    stockEaryWarning: v.stockEaryWarning,
                    safetyEaryWaring: v.safetyEaryWaring,
                    netWeight: v.netWeight,
                    netWeightUnit: v.netWeightUnit,
                }
                list.push(obj)
            })
            this.formData.list = list
        },
        handleSave() {
            if (!this.validSelectSpec()) {
                this.$message.error('每个规格值至少选择一个')
                return
            } else if (!this.validSepList()) {
                this.$message.error('请输入所有的售价')
                return
            }
            this.mergeData()
            this.formData.goodsId = this.goodsId
            this.submitLoading = true
            // 保存商品规格,并重置信息
              this.formData.list.map(v => {
                  if( v.netWeightUnit==='g'){
                    v.netWeightUnit='0'
               }else if ( v.netWeightUnit==='ml'){
                    v.netWeightUnit='2'
               }})
            // console.log(this.formData,'保存商品规格')
            saveGoodsSpec(this.formData).then(res => {
                const  resData= res.data
                // console.log(resData,'---保存商品规格---')
                if (resData.flag == 'success') {
                    // this.formData.id = resData.data.id
                    // 获取商品规格
                    this.getDetail(this.formData.goodsId)
                    this.$message.success('保存成功')
                } else {
                    this.$message.error('保存失败')
                }
                this.submitLoading = false
            }).catch(err => {
                this.submitLoading = false
            })
        },
    }

}
</script>

<style lang="scss" scoped>
.flexBox{
	margin-top: 15px;
	.flex{
		align-items: center;
	}
	/deep/ .el-row{
		border: 1px solid #ccc;
		.el-col{
			padding: 10px 15px;
			.el-select{
				margin-right: 15px;
			}
			.el-button{
				font-size: 14px;
			}
		}
		.el-col + .el-col{
			border-left: 1px solid #ccc;
		}
		.line{
			height: 20px;
		    border-left: 1px solid #333;
		    margin: 0 6px;
		}
		.active{
			background-color: #ff9933;
			border-color: #ff9933;
			color: #fff;
		}
	}
	/deep/ .el-row + .el-row{
		border-top-color: transparent;
		margin-top: -1px;
	}
}
.value-sort-input {
    width: 95px;
}
.specification-value-item {
    display: inline-block;
    margin: 10px 10px 10px 0;
    position: relative;
    .el-button.red {
        font-size: 20px;
        position: absolute;
        right: -9px;
        top: -9px;
        font-size: 20px;
        padding: 0;
    }
}
.specification-plus-font {
    font-size: 22px;
    cursor: pointer;
    margin-left: 5px;
    vertical-align: sub;
}
.mt20 {
    margin-top: 20px;
}
.no-spec-data {
    color: #909399;
    text-align: center;
}

.spec-container /deep/ .el-table thead th,
.spec-container /deep/ .el-table thead tr {
    background-color: #fff;
}
</style>
