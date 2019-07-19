<template>
    <div class="rule-template-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item 
                class="bold" 
                :to="{ path: '/parameter/commodity/list' }"
            >商品参数管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品运费模板</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadcrumbMap[isEdit]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="formData"
            style="width: 100%;"
            class="border clearfix"
            size="small"
            ref="dataForm"
            :rules="rules"
            @submit.native.prevent
        >
            <el-form-item label="运费模版名称" prop="name">
                <el-input v-model.trim="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="计价方式" prop="method">
                <el-radio-group v-model="formData.method" @change="switchWay">
                    <el-radio 
                        v-for="item in wayList"
                        :key="item.dicSubval"
                        :label="item.dicSubval"
                    >{{ item.dicSubname }}</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-row type="flex" :gutter="15">
    		<el-col :span="24">
                <el-form>
                    <el-form-item label="配送区域及参数" required>
                        <el-button type="primary" size="small" @click="add">增加配送区域</el-button>
                    </el-form-item>
                </el-form>
			</el-col>
		</el-row>
        <el-table
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;"
        >
            <el-table-column label="配送区域">
                <template slot-scope="scope">
                    <el-select size="small" v-model="scope.row.pronvince" placeholder="请选择省份" class="w150" @change="selectProvince(scope.row)">
                        <el-option 
                            v-for="item in provinceList"
                            :key="item.areaCode"
                            :label="item.areaName"
                            :value="item.areaCode"
                        ></el-option>
                    </el-select>
                    <el-select size="small" v-model="scope.row.city" placeholder="请选择市" class="ml10 w150" @change="selectCity">
                        <el-option 
                            v-for="item in cityList"
                            :key="item.areaCode"
                            :label="item.areaName"
                            :value="item.areaCode"
                        ></el-option>
                    </el-select>
                    <el-select size="small" v-model="scope.row.county" placeholder="请选择区/县" class="ml10 w150">
                        <el-option 
                            v-for="item in countyList"
                            :key="item.areaCode"
                            :label="item.areaName"
                            :value="item.areaCode"
                        ></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column :label="`首${wayTitle}`" align="center" width="180">
                <template slot-scope="scope">
                    <el-input
                        size="small"
                        v-model.number="scope.row.firstCount"
                        class="input-w"
                        v-num-digit="scope.$index"
                        data-form-model="tableData,firstCount"
                    ></el-input> {{unitTitle}}
                </template>
            </el-table-column>
            <el-table-column :label="`首${wayTitle}运费`" align="center" width="180">
                <template slot-scope="scope">
                    <el-input
                        size="small"
                        v-model.number="scope.row.firstCountPrice"
                        class="input-w"
                        v-num-digit="scope.$index"
                        data-form-model="tableData,firstCountPrice"
                        data-dotrange="{0,2}"
                    ></el-input> 元
                </template>
            </el-table-column>
            <el-table-column :label="`续${wayTitle}`" align="center" width="180">
                <template slot-scope="scope">
                    <el-input
                        size="small"
                        v-model.number="scope.row.continueCount"
                        class="input-w"
                        v-num-digit="scope.$index"
                        data-form-model="tableData,continueCount"
                    ></el-input> {{unitTitle}}
                </template>
            </el-table-column>
            <el-table-column :label="`续${wayTitle}运费`" align="center" width="180">
                <template slot-scope="scope">
                    <el-input
                        size="small"
                        v-model.number="scope.row.continueCountPrice"
                        class="input-w"
                        v-num-digit="scope.$index"
                        data-form-model="tableData,continueCountPrice"
                        data-dotrange="{0,2}"
                    ></el-input> 元
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <el-button type="text" class="red" @click="deleteRow(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="mt20">
            <router-link to="/parameter/commodity/list">
                <el-button size="small">返回</el-button>
            </router-link>
            <el-button size="small" type="primary" class="ml20" @click="handleSave" :disabled="submitLoading">提交</el-button>
        </div>
    </div>
</template>

<script>
import { getRuleDetail, saveRule  } from '@/api/commodity'
import { getProvince, getArea } from '@/api/util'

const wayObj = {
    '0': {
        way: '件',
        unit: '件',
    },
    '1': {
        way: '体积',
        unit: 'm^3',
    },
    '2': {
        way: '重量',
        unit: 'g',
    },
}

const initObj = {
    pronvince: '',
    city: '',
    county: '',
    firstCount: 0,
    firstCountPrice: 0,
    continueCount: 0,
    continueCountPrice: 0,
    dataRemoveType: 0,
}

export default {
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            wayTitle: '件',
            unitTitle: '件',
            breadcrumbMap: {
                false: '新增广告',
                true: '编辑广告',
            },
            formData: {
                name: '',
                method: '0',
                paramList: [],
                dataRemoveType: 0,
            },
            tableData: [
                {
                    pronvince: '',
                    city: '',
                    county: '',
                    firstCount: 0,
                    firstCountPrice: 0,
                    continueCount: 0,
                    continueCountPrice: 0,
                    dataRemoveType: 0,
                },
            ],
            wayList: [
                {
                    dicSubval: '0',
                    dicSubname: '件数',
                },
                {
                    dicSubval: '1',
                    dicSubname: '体积',
                },
                {
                    dicSubval: '2',
                    dicSubname: '重量',
                },
            ],
            provinceList: [
                {
                    areaCode: "01",
                    areaName: "广东省",
                    parentAreacode: "0",
                }
            ],
            cityList: [
                {
                    areaCode: "02",
                    areaName: "广州市",
                    parentAreacode: "01",
                }
            ],
            countyList: [
                {
                    areaCode: "03",
                    areaName: "番禺区",
                    parentAreacode: "02",
                }
            ],
            rules: {
                name: [{required: true, message: '请输入运费模版名称'}],
                method: [{required: true, message: '请选择计价方式'}]
            },
            submitLoading: false
        }
    },
    created() {
        this.getProvinceList()
        if (this.isEdit) {
            let id = this.$route.params && this.$route.params.id
            this.getDetail(id)
        }
    },
    methods: {
        getDetail(id) {
            getRuleDetail(id).then(res => {
                const resData = res.data
                const { parameter, template } = resData.data
                let paramList = []
                for (let item of parameter) {
                    paramList.push({
                        id: item.id,
                        pronvince: item.pronvince,
                        city: item.city,
                        county: item.county,
                        firstCount: item.firstCount,
                        firstCountPrice: item.firstCountPrice,
                        continueCount: item.continueCount,
                        continueCountPrice: item.continueCountPrice,
                        dataRemoveType: 0,
                    })
                }
                this.formData = {
                    id,
                    name: template.templateName,
                    method: template.valuationMethod,
                    paramList: JSON.parse(JSON.stringify(paramList)),
                    dataRemoveType: 0,
                }
                this.tableData = paramList
            })
        },
        getProvinceList() {
            getProvince().then(res => {
                this.provinceList = res.data
            })
        },
        add() {
            if (this.formData.way == '') {
                this.$message.error('请选择计价方式！');
            }
            let obj = Object.assign({}, initObj)
            obj.key = Date.now()
            this.tableData.push(obj)
        },
        switchWay() {
            this.tableData = [
                {
                    pronvince: '',
                    city: '',
                    county: '',
                    firstCount: 0,
                    firstCountPrice: 0,
                    continueCount: 0,
                    continueCountPrice: 0,
                    dataRemoveType: 0,
                },
            ]
            this.wayTitle = wayObj[this.formData.method].way
            this.unitTitle = wayObj[this.formData.method].unit
        },
        selectProvince(row) {
            row.city = ''
            row.district = ''
            getArea(row.pronvince).then(res => {
                this.cityList = res.data
            })
        },
        selectCity(val) {
            getArea(val).then(res => {
                this.countyList = res.data
            })
        },
        deleteRow(index) {
            this.tableData.splice(index, 1);
        },
        validParamList() {
            let validInfo = {
                valid: true,
                message: '请选择所有的配送区域，输入首件，首件运费，续件和续件运费',
            }
            for (let item of this.tableData) {
                if (!item.pronvince || !item.city || !item.county || item.firstCount === '' || item.firstCountPrice === '' || item.continueCount === '' || item.continueCountPrice === '') {
                    validInfo.valid = false
                    break
                }
            }
            return validInfo
        },
        mergeData() {
            let x = {}
            this.tableData.map(v => {
                if (v.id) {
                    x[v.id] = v
                } else {
                    x[v.key] = v
                }
            })

            for (let item of this.formData.paramList) {
                if (x[item.id]) {
                    let data = x[item.id]
                    item.pronvince = data.pronvince
                    item.city = data.city
                    item.county = data.county
                    item.firstCount = data.firstCount
                    item.firstCountPrice = data.firstCountPrice
                    item.continueCount = data.continueCount
                    item.continueCountPrice = data.continueCountPrice

                    x[item.id] = null
                } else {
                    item.dataRemoveType = 1
                }
            }

            for (let item of Object.keys(x)) {
                if (x[item]) {
                    this.formData.paramList.push(x[item])
                }
            }
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    let errInfo = this.validParamList()
                    if (!errInfo.valid) {
                        this.$message.error(errInfo.message)
                        return false
                    }
                    if (this.isEdit) {
                        this.mergeData()
                    } else {
                        this.formData.paramList = this.tableData
                    }
                    saveRule(this.formData).then(res => {
                        const data = res.data
                        if (data.flag == 'success') {
                            let message = !this.isEdit ? '新增成功' : '修改成功'
                            this.$router.replace('/parameter/commodity/list')
                            this.$message.success(message)
                        }
                        this.submitLoading = false
                    }).catch(() => {
                        this.submitLoading = false
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.w150 {
    width: 150px;
}
.input-w {
    width: 80px;
}
.mt20 {
    margin-top: 20px;
}
</style>

