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
                <el-button type="primary" icon="el-icon-search" @click="search" native-type="submit">搜索</el-button>
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
            <el-table-column label="品牌 ID" prop="id" align="center">
            </el-table-column>
            <el-table-column label="品牌名称" prop="brandName" align="center">
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
                    size="small"
                    :model="formData"
                    label-position="right"
                    label-width="100px"
                    ref="dataForm"
                    :rules="rules"
                    @submit.native.prevent
                >
                    <el-form-item label="品牌ID：" v-if="dialogStatus == 'update'">
                        {{ formData.id }}
                    </el-form-item >
                    <el-form-item label="品牌名称：" prop="brandName">
                        <el-input v-model.trim="formData.brandName"></el-input>
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
    getBrandList,
    saveBrand,
    getBrandDetail,
    deleteBrand
} from '@/api/commodity'

export default {
    data() {
        return {
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                create: '新增商品品牌',
                update: '编辑商品品牌',
            },
            listQuery: {
                name: '',
                pageNum: 0,
                pageSize: 50,
            },
            formData: {
                dataRemoveType: 0,
                brandName: '',
            },
            rules: {
                brandName: [{required: true, message: '品牌名称不能为空'}],
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
            getBrandList(this.listQuery).then(res => {
                const data = res.data
                if (data.code == '10001') {
                    this.tableData = data.data.pageData
                    this.total = data.data.totalCount
                }
                this.listLoading = false
            })
        },
        getDetail(id) {
            getBrandDetail(id).then(res => {
                const data = res.data
                this.formData = {
                    id,
                    dataRemoveType: 0,
                    brandName: data.brandName,
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
                brandName: '',
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
                    saveBrand(this.formData).then(res => {
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
            deleteBrand(ids).then(res => {
                const data = res.data
                if(data.flag == 'success') {
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
        }
    }
}
</script>
