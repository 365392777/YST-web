<template>
    <el-dialog
            :title="textMap[dialogStatus]"
            :visible.sync="dialogFormVisible"
            center
            width="1000px"
            :before-close="handleClose"
        >
        <div class="dialog-container">
            <el-form 
                :model="formData" 
                label-position="right"
                :inline="true"
                class="clearfix"
                size="small"
                ref="dataForm"
                :rules="rules"
                @submit.native.prevent
            >
                <el-form-item label="商品规格模型名称" prop="name">
                    <el-input v-model="formData.name"></el-input>
                </el-form-item>
                <div class="fr">
                    <el-form-item>
                        <el-button type="primary" @click="addSpecification">添加规格</el-button>
                    </el-form-item>
                </div>
            </el-form>
            <el-table
                :data="speList"
                border
                tooltip-effect="dark"
                style="width: 100%;"
            >
                <el-table-column label="规格名称" width="150">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="排序" width="150">
                    <template slot-scope="scope">
                        <el-input
                            size="small"
                            v-model.number="scope.row.sort"
                            v-num-digit="scope.$index"
                            data-form-model="speList,sort"
                            data-nonzero
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="规格值">
                    <template slot-scope="scope">
                        <div 
                            class="specification-value-item" 
                            v-for="(item, childIndex) in scope.row.valueList" 
                            :key="item.key"
                        >
                            <el-input 
                                size="small"
                                v-model="item.value"
                                class="value-sort-input"
                            />
                            <el-button type="text" v-if="scope.row.valueList.length > 1" icon="el-icon-circle-close-outline" class="red" @click="deleteItemValue(scope.$index, childIndex)"></el-button>
                        </div>
                        <i 
                            class="specification-plus-font el-icon-circle-plus-outline"
                            @click="addItemValue(scope.$index)"
                        ></i>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button 
                            type="text" 
                            v-if="speList.length > 1"
                            class="red"
                            @click="deleteModelRow(scope.$index)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeDialog">关闭</el-button>
            <el-button size="small" type="primary" @click="handleSave" :disabled="submitLoading">提交</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {
    saveSpecification,
    getSpecificationDetail,
} from '@/api/commodity'

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
    props: {
        dialogFormVisible: {
            type: Boolean,
            default: false,
        },
        dialogStatus: {
            type: String,
            default: '',
        },
        specData: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            textMap: {
                create: '新增商品规格模型',
                update: '编辑商品规格模型',
            },
            formData: {
                name: '',
                speList: [],
                dataRemoveType: 0,
            },
            speList: [
                {
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
            ],
            submitLoading: false,
            rules: {
                name: [{ required: true, message: '请输入商品规格模型名称' }]
            },
        }
    },
    watch: {
        dialogFormVisible(newValue) {
            if (newValue) {
                this.resetFormData()
                
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
                if (this.dialogStatus == 'update') {
                    this.getDetail()
                }
            }
        },
        specData(newValue) {
            this.getDetail()
        }
    },
    methods: {
        getDetail() {
            // getSpecificationDetail(id).then(res => {
            //     const resData = res.data
            const { model, specifications } = this.specData
            this.formData = {
                id: model.id,
                name: model.speModelName,
                speList: []
            }
            this.speList = []
            for (let item of specifications) {
                let valueList = []
                for (let valueItem of item.values) {
                    valueList.push({
                        value: valueItem.speValue,
                        id: valueItem.id,
                        dataRemoveType: 0,
                    })
                }
                this.speList.push({
                    name: item.specification.speName,
                    sort: item.specification.sort,
                    valueList: JSON.parse(JSON.stringify(valueList)),
                    id: item.specification.id,
                    dataRemoveType: 0,
                })
                this.formData.speList.push({
                    name: item.specification.speName,
                    sort: item.specification.sort,
                    valueList,
                    id: item.specification.id,
                    dataRemoveType: 0,
                })
            }
            // })
        },
        resetFormData() {
            this.formData = {
                name: '',
                speList: [],
            }
            this.speList = [
                {
                    name: '',
                    sort: '',
                    valueList: [
                        {
                            value: '',
                            dataRemoveType: 0,
                        }
                    ],
                    dataRemoveType: 0,
                },
            ]
        },
        handleClose(done) {
            this.closeDialog()
        },
        closeDialog() {
            this.$emit('update:dialogFormVisible', false)
            this.$refs['dataForm'].clearValidate()
        },
        addSpecification() {
            if (this.speList.length >= 5) {
                this.$message.error('最多添加五个规格')
                return
            }
            let obj = JSON.stringify(addObj)
            obj = JSON.parse(obj)
            obj.key = Date.now()
            this.speList.push(obj)
        },
        deleteModelRow(index) {
            this.speList.splice(index, 1)
        },
        addItemValue(index) {
            this.speList[index].valueList.push({
                value: '',
                dataRemoveType: 0,
                key: Date.now(),
            })
        },
        deleteItemValue(parentIndex, index) {
            this.speList[parentIndex].valueList.splice(index, 1)
        },
        validSepList() {
            let valid = true
            for (let item of this.speList) {
                if (item.name == '' || (!item.sort && item.sort !== 0)) {
                    valid = false
                    break
                }
                for (let valueItem of item.valueList) {
                    if (valueItem.value == '') {
                        valid = false
                        break
                    }
                }
            }
            return valid
        },
        mergeData() {
            let x = {}
            this.speList.map(v => {
                if (v.id) {
                    x[v.id] = v
                } else {
                    x[v.key] = v
                }
            })
            x = JSON.parse(JSON.stringify(x))

            for (let item of this.formData.speList) {
                if (x[item.id]) {
                    item.name = x[item.id].name
                    item.sort = x[item.id].sort

                    let valueArr = {}
                    x[item.id].valueList.map(v => {
                        if (v.id) {
                            valueArr[v.id] = v
                        } else {
                            valueArr[v.key] = v
                        }
                    })
                    
                    for (let valueItem of item.valueList) {
                        if (valueArr[valueItem.id]) {
                            valueItem.value = valueArr[valueItem.id].value
                            valueArr[valueItem.id] = null
                        } else {
                            valueItem.dataRemoveType = 1
                        }
                    }

                    for (let arrItem of Object.keys(valueArr)) {
                        if (valueArr[arrItem]) {
                            item.valueList.push(valueArr[arrItem])
                        }
                    }
                    x[item.id] = null
                } else {
                    item.dataRemoveType = 1
                }
            }

            for (let item of Object.keys(x)) {
                if (x[item]) {
                    this.formData.speList.push(x[item])
                }
            }
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    if (!this.validSepList()) {
                        console.log(this.speList);
                        this.$message.error('请输入所有的规格名称，排序和规格值')
                        return false
                    }
                    this.submitLoading = true
                    if (this.dialogStatus == 'create') {
                        this.formData.speList = this.speList
                    } else {
                        this.mergeData()
                    }
                    saveSpecification(this.formData).then(res => {
                        const data = res.data
                        if (data.flag == 'success') {
                            // this.dialogFormVisible = false
                            this.closeDialog()
                            let isCreate = this.dialogStatus == 'create'
                            let message = isCreate ? '新增成功' : '修改成功'
                            this.$message.success(message)
                            this.$emit('call-back', data.data)
                        }
                        this.submitLoading = false
                    }).catch(() => {
                        this.submitLoading = false
                    })
                }
            })
        },
    }
}
</script>

<style lang="scss" scoped>
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
</style>
