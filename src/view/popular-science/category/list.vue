<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">分类目录</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            size="small"
            class="demo-form-inline border"
            @submit.native.prevent
        >
            <el-form-item>
                <el-input
                    v-model="listQuery.category"
                    placeholder="输入关键字"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="search"
                    icon="el-icon-search"
                    native-type="submit"
                >搜索</el-button>
            </el-form-item>
            <div class="fr">
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="handleCreate"
                    >新增分类</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="danger"
                        @click="deleteSelect"
                        :disabled="selectList.length <= 0"
                    >删除</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="tableData"
            max-height="600"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            v-loading="listLoading"
            @selection-change="selectRow"
        >
            <el-table-column
                type="selection"
                width="45"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="id"
                label="文章分类 ID"
                width="150"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="category"
                label="文章分类名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="是否启用"
                align="center"
            >
                <template slot-scope="scope">
                    <el-checkbox
                        :true-label="1"
                        :false-label="0"
                        v-model="scope.row.status"
                        @change="handleEnable(scope.row)"
                    ></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="scope">
                    <el-button
                        type="text"
                        @click="handleUpdate(scope.row)"
                    >编辑</el-button>
                    <span class="line"></span>
                    <el-button
                        type="text"
                        class="red"
                        @click="deleteRow(scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            :title="textMap[dialogStatus]"
            :visible.sync="dialogFormVisible"
            center
            width="700px"
        >
            <div class="dialog-container">
                <el-form
                    ref="dataForm"
                    size="small"
                    :rules="rules"
                    :model="formData"
                    label-position="right"
                    label-width="120px"
                    @submit.native.prevent
                >
                    <el-form-item
                        label="分类名称"
                        prop="category"
                    >
                        <el-input v-model="formData.category"></el-input>
                    </el-form-item>
                    <el-form-item label="启用">
                        <el-checkbox
                            v-model="formData.status"
                            :true-label="1"
                            :false-label="0"
                        ></el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <span
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    size="small"
                    @click="dialogFormVisible = false"
                >取 消</el-button>
                <el-button
                    :loading="submitLoading"
                    size="small"
                    type="primary"
                    @click="handleSave"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getCategoryList, deleteCategory, createCategory, updateCategory } from '@/api/popular-science'

export default {
    data() {
        return {
            listQuery: {
                category: '',
                id: 0,
            },
            total: 0,
            tableData: [],
            selectList: [],
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑分类',
                create: '新增分类'
            },
            formData: {
                category: '',
                status: 1
            },
            rules: {
                category: [{required: true, message: '分类名称不能为空', trigger: 'change'}],
            },
            listLoading: false,
            submitLoading: false
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getCategoryList(this.listQuery).then(res => {
                const resData = res.data
                this.tableData = resData.data
                this.total = resData.data.totalCount
                this.listLoading = false
            })
        },
        search() {
            this.listQuery.pageNum = 0
            this.getList()
        },
        handleEnable(row) {
            let data = {
                id: row.id,
                status: row.status,
                category: row.category,
            }
            updateCategory(data).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.$message.success(resData.error)
                } else {
                    this.$message.error(resData.error)
                    this.getList()
                }
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getList()
        },
        selectRow(val) {
            this.selectList = val
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
        deleteConfirm(data) {
            this.$confirm('此操作将删除信息, 确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(() => {
                this.handleDelete(data)
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // })
            })
        },
        handleDelete(data) {
            deleteCategory(data).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.$message.success('删除成功')
                    this.getList()
                } else {
                    this.$message.error('删除失败')
                }
            })
        },
        resetFormData() {
            this.formData = {
                category: '',
                status: 1
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
        getDetail(id) {
            let data = {
                id
            }
            getCategoryList(data).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    let categoryData = resData.data[0]
                    this.formData = {
                        id: categoryData.id,
                        status: categoryData.status,
                        category: categoryData.category,
                    }
                } else {
                    this.$message.error(resData.error)
                }
            })
        },
        handleSave() {
            let handleOperate = createCategory
            if (this.dialogStatus == 'update') {
                handleOperate = updateCategory
            }
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.submitLoading = true
                    handleOperate(this.formData).then(res => {
                        const resData = res.data
                        if (resData.code == '10001') {
                            this.dialogFormVisible = false
                            let isCreate = this.dialogStatus == 'create'
                            let message = isCreate ? '添加成功' : '修改成功'
                            if (isCreate) {
                                this.listQuery.pageNum = 0
                            }
                            this.$message.success(message)
                            this.getList()
                        } else {
                            this.$message.error(resData.error)
                        }
                        this.submitLoading = false
                    }).catch(err => {
                        this.submitLoading = false
                    })
                }
            })
        }
    }
}
</script>
