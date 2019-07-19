<template>
    <div class="classify-container">
        <el-form
            :inline="true"
            :model="listQuery"
            style="width: 100%;"
            class="demo-form-inlin border clearfix"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="分类名称">
                <el-input v-model="listQuery.commodityName" placeholder="输入商品分类名称"></el-input>
            </el-form-item>
            <el-form-item label="是否启用">
                <el-select v-model="listQuery.commodityStatus" clearable>
                    <el-option label="是" value="0"></el-option>
                    <el-option label="否" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search" native-type="submit">搜索</el-button>
            </el-form-item>
            <div class="fr">
                <el-form-item>
                    <el-button type="primary" @click="handleCreate">新增分类</el-button>
                    <el-button type="danger" :disabled="selectList.length <= 0" @click="deleteSelect">删除</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-table
            :data="tableData"
            max-height="600"
            v-loading="listLoading"
            stripe
            tooltip-effect="dark"
            style="width: 100%;"
            @selection-change="selectRow"
        >
            <el-table-column
                type="selection"
                width="40"
                align="center"
            >
            </el-table-column>
            <el-table-column label="商品分类ID" prop="id" align="center" width="200">
            </el-table-column>
            <el-table-column label="商品分类名称" prop="commodityName" align="center">
            </el-table-column>
            <el-table-column label="是否启用" align="center">
                <template slot-scope="scope">
                    <el-checkbox 
                        :true-label="'0'"
                        :false-label="'1'"
                        v-model="scope.row.commodityStatus"
                        @change="enable(scope.row)"
                    ></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                    <span class="line"></span>
                    <el-button type="text" class="red" @click="deleteRow(scope.row)">删除</el-button>
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
        <el-dialog
            :title="textMap[dialogStatus]"
            :visible.sync="dialogFormVisible"
            center
            width="570px"
        >
            <div class="dialog-container">
                <el-form 
                    :rules="rules"
                    size="small"
                    :model="formData"
                    label-position="right"
                    label-width="80px"
                    ref="dataForm"
                    @submit.native.prevent
                >
                    <el-form-item label="分类ID" v-if="dialogStatus == 'update'">
                        {{ formData.id }}
                    </el-form-item >
                    <el-form-item label="分类名称" prop="commodityName">
                        <el-input v-model.trim="formData.commodityName"></el-input>
                    </el-form-item>
                    <el-form-item label="是否启用" prop="commodityStatus">
                        <el-radio-group v-model="formData.commodityStatus">
                            <el-radio label="0">是</el-radio>
                            <el-radio label="1">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisible = false">关闭</el-button>
                <el-button size="small" type="primary" @click="handleSave">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getClassifyList,
    saveClassify,
    getClassifyDetail,
    deleteClassify,
    enableClassify
} from '@/api/commodity'

export default {
    data() {
        return {
            listQuery: {
                commodityName: '',
                commodityStatus: '',
                pageNum: 0,
                pageSize: 50,
            },
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                create: '新增商品分类',
                update: '编辑商品分类',
            },
            formData: {
                dataRemoveType: 0,
                commodityName: '',
                commodityStatus: '0',
                commodityShow: '0',
            },
            rules: {
                commodityName: [{required: true, message: '请输入分类名称'}],
                commodityStatus: [{required: true, message: '请选择是否展示'}],
            },
            tableData: [],
            total: 0,
            listLoading: true,
            selectList: [],
            submitLoading: false,
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getClassifyList(this.listQuery).then(res => {
                const data = res.data
                if (data.code == '10001') {
                    this.tableData = data.data.pageData
                    this.total = data.data.totalCount
                }
                this.listLoading = false
            })
        },
        getDetail(id) {
            getClassifyDetail(id).then(res => {
                const data = res.data
                this.formData = {
                    id,
                    dataRemoveType: 0,
                    commodityName: data.commodityName,
                    commodityStatus: data.commodityStatus,
                    commodityShow: data.commodityShow,
                }
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
        selectRow(value) {
            this.selectList = value
        },
        enable(row) {
            enableClassify(row.id, row.commodityStatus).then(res => {
                const data = res.data
                console.log(data.code)
                if (data.code == '10001') {
                    this.$message.success('操作成功')
                } else {
                    this.getList()
                    this.$message.error(data.error)
                }
            }).catch(() => {
                this.getList()
                this.$message.error('操作失败')
            })
        },
        resetFormData() {
            this.formData = {
                dataRemoveType: 0,
                commodityName: '',
                commodityStatus: '0',
                commodityShow: '0',
            }
        },
        handleCreate() {
            this.resetFormData()
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleUpdate(row) {
            this.getDetail(row.id)
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.submitLoading = true
                    saveClassify(this.formData).then(res => {
                        const data = res.data
                        if (data.flag == 'success') {
                            this.dialogFormVisible = false
                            let isCreate = this.dialogStatus == 'create'
                            let message = isCreate ? '新增成功' : '修改成功'
                            if (isCreate) {
                                this.listQuery.pageNum = 0
                            }
                            this.getList()
                            this.$message.success(message)
                        }

                        if(data.msg == '该类型已存在'){
                            let isCreate = this.dialogStatus == 'create'
                            if (isCreate) {
                                this.$refs['dataForm'].$children[0].validateState = 'error'
                                this.$refs['dataForm'].$children[0].validateMessage = data.msg
                            }else{
                                this.$refs['dataForm'].$children[1].validateState = 'error'
                                this.$refs['dataForm'].$children[1].validateMessage = data.msg
                            }
                            
                        }
                        this.submitLoading = false
                    }).catch(() => {
                        this.submitLoading = false
                    })
                }
            })
        },
        deleteSelect() {
            let data = []
            for (let item of this.selectList) {
                data.push(item.id)
            }
            this.deleteConfirm(data)
        },
        deleteRow(row) {
            let data = [row.id]
            this.deleteConfirm(data)
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
        handleDelete(ids) {
            deleteClassify(ids).then(res => {
                const data = res.data
                if(data.code == '10001') {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                    })
                    this.getList()
                } else {
                    this.$message.error(data.error)
                }
            }).catch(() => {
                this.$message.error('操作失败')
            })
        }
    }
}
</script>

