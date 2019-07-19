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
            <el-form-item>
                <el-input v-model="listQuery.name" placeholder="输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
            </el-form-item>
            <div class="fr">
                <el-form-item>
                    <el-button type="primary" @click="handleCreate">新增</el-button>
                    <el-button type="danger" :disabled="selectList.length <= 0" @click="deleteSelect">删除</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-table
            :data="tableData"
            v-loading="listLoading"
            max-height="600"
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
            <el-table-column label="供应商 ID" prop="id" align="center" width="200">
            </el-table-column>
            <el-table-column label="供应商名称" prop="supplierName" align="center">
            </el-table-column>
            <el-table-column label="联络人" prop="liaisonPersonName" align="center">
            </el-table-column>
            <el-table-column label="联系电话" prop="contactNumber" align="center">
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
            width="30%"
        >
            <div class="dialog-container">
                <el-form 
                    size="small"
                    :model="formData"
                    label-position="right"
                    label-width="95px"
                    ref="dataForm"
                    :rules="rules"
                    @submit.native.prevent
                >
                    <el-form-item label="供应商ID" v-if="dialogStatus == 'update'">
                        {{ formData.id }}
                    </el-form-item >
                    <el-form-item label="供应商名称" prop="supplierName">
                        <el-input v-model.trim="formData.supplierName"></el-input>
                    </el-form-item>
                    <el-form-item label="联络人" prop="liaisonPersonName">
                        <el-input v-model.trim="formData.liaisonPersonName"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话" prop="contactNumber">
                        <el-input v-model.trim="formData.contactNumber" maxlength="11"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisible = false">关闭</el-button>
                <el-button size="small" type="primary" @click="handleSave" :disabled="submitLoading">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {
    getSupplierList,
    saveSupplier,
    getSupplierDetail,
    deleteSupplier
} from '@/api/commodity'
import { isValidPhone, isValidTel } from '@/utils/validate'

export default {
    data() {
        const validPhone = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入联系电话'))
            } else if (!isValidPhone(value) && !isValidTel(value)) {
                callback(new Error('请输入正确的联系电话'))
            } else {
                callback()
            }
        }
        return {
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                create: '新增供应商',
                update: '编辑供应商',
            },
            listQuery: {
                name: '',
                pageNum: 0,
                pageSize: 50,
            },
            formData: {
                dataRemoveType: 0,
                supplierName: '',
                liaisonPersonName: '',
                contactNumber: '',
            },
            tableData: [],
            total: 0,
            listLoading: true,
            selectList: [],
            submitLoading: false,
            rules: {
                supplierName: { required: true, message: '请输入供应商名称', trigger: 'blur' },
                liaisonPersonName: { required: true, message: '请输入联系人', trigger: 'blur' },
                contactNumber: [
                    { required: true, message: '请输入联系电话', trigger: 'blur' },
                    { trigger: 'blur', validator: validPhone }
                ]
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getSupplierList(this.listQuery).then(res => {
                const data = res.data
                if (data.code == '10001') {
                    this.tableData = data.data.pageData
                    this.total = data.data.totalCount
                }
                this.listLoading = false
            })
        },
        getDetail(id) {
            getSupplierDetail(id).then(res => {
                console.log(data)
                const data = res.data
                this.formData = {
                    id,
                    dataRemoveType: 0,
                    supplierName: data.supplierName,
                    liaisonPersonName: data.liaisonPersonName,
                    contactNumber: data.contactNumber,
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
        resetFormData() {
            this.formData = {
                dataRemoveType: 0,
                supplierName: '',
                liaisonPersonName: '',
                contactNumber: '',
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
                    saveSupplier(this.formData).then(res => {
                        console.log(res);
                        const data = res.data
                        if (data.error == '') {
                            this.dialogFormVisible = false
                            let isCreate = this.dialogStatus == 'create'
                            let message = isCreate ? '新增成功' : '修改成功'
                            if (isCreate) {
                                this.listQuery.pageNum = 0
                            }
                            this.getList()
                            this.$message.success(message)
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
            console.log(ids)
            deleteSupplier(ids).then(res => {
                console.log(res);
                const data = res.data
                if(data.error != '') {
                    this.$message({
                        message: data.error,
                        type: 'success',
                    })
                    this.getList()
                } else {
                    this.$message({
                        message: data.error,
                        type: 'error',
                    })
                }
            })
        }
    }
}
</script>
