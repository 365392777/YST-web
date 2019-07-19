<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
            >敏感词管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            class="demo-form-inline border"
            size="small"
            @submit.native.prevent
        >
            <el-form-item>
                <el-input v-model="listQuery.name" placeholder="输入关键字"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="search" type="primary" icon="el-icon-search" native-type="submit">搜索</el-button>
            </el-form-item>
            <div class="fr">
                <el-form-item>
                    <el-button @click="handleCreate" type="primary">新增敏感词</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleImport" type="primary">导入</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="downloadModel">下载模版</el-button>
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
	            align="center">
	        </el-table-column>
            <el-table-column
                prop="id"
                label="敏感词 ID"
                width="150"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="sensitiveWords"
                label="敏感词"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="scope">
	            	<el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
	            	<span class="line"></span>
	            	<el-button type="text" @click="handleDelete(scope.row)" class="red">删除</el-button>	
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
            width="480px"
        >
            <div class="dialog-container">
                <el-form ref="dataForm" size="small" :rules="rules" :model="formData" label-position="right" label-width="80px" @submit.native.prevent>
                    <el-form-item label="敏感词" prop="sensitiveWords" :error="wordError">
                        <el-input v-model.trim="formData.sensitiveWords"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
                <el-button :loading="submitLoading" size="small" type="primary" @click="handleSave">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="导入敏感词库"
            :visible.sync="dialogImportVisible"
            center
            width="30%"
            :beforeClose="handleCloseImport"
        >
            <div class="dialog-container">
                <el-form size="small" ref="importForm" :rules="rules" :model="formData" label-position="right" label-width="120px" style="margin-left:50px;">
                    <el-upload
                        class="upload-demo"
                        ref="upload"
                        action="http://192.168.0.29:8080/paramOperate/tSensitiveWordsImport.int.do"
                        :http-request="importFile"
                        :onExceed="handleExceed"
                        :file-list="fileList"
                        :auto-upload="false"
                        :limit="1"
                    >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
                        <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过500kb</div>
                    </el-upload>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleCloseImport">取 消</el-button>
                <el-button
                    size="small"
                    type="primary"
                    @click="submitUpload"
                    :loading="importLoading"
                >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.page-container {
    padding: 15px 30px;
    .el-col-4 button {
        float: right;
    }
    .el-table {
        margin: 15px 0;
    }
    .el-table thead th,
    .el-table thead tr {
        background-color: #e4e7ed;
        color: #333;
    }
}
</style>

<script>
import {
    getSensitiveList,
    getSensitiveDetail,
    saveSensitive,
    deleteSensitive,
    importSensitive
} from '@/api/parameter'

export default {
    data() {
        return {
            listQuery: {
                name: '',
                pageNum: 0,
                pageSize: 50,
            },
            fileList: [],
            tableData: [],
            selectlistRow: [],
            dialogFormVisible: false,
            dialogImportVisible: false,
            dialogStatus: '',
            textMap: {
                create: '新增敏感词',
                update: '编辑敏感词',
            },
            formData: {
                sensitiveWords: '',
            },
            rules: {
                sensitiveWords: [{required: true, message: '敏感词不能为空', trigger: 'change'}],
            },
            listLoading: true,
            total: 0,
            submitLoading: false,
            wordError: '',
            importLoading: false,
            downloadUrl: process.env.NODE_ENV,
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getSensitiveList(this.listQuery).then(res => {
                this.tableData = res.data.data.pageData
                this.total = res.data.data.totalCount
                this.listLoading = false
            })
        },
        getDetail(id) {
            getSensitiveDetail(id).then(res => {
                this.formData = {
                    dataRemoveType: 0,
                    id: id,
                    sensitiveWords: res.data.sensitiveWords
                }
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getList()
        },
        search() {
            this.listQuery.pageNum = 0
            this.getList()
        },
        resetFormData() {
            this.formData = {
                sensitiveWords: '',
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
        handleImport() {
            if (this.$refs.upload) {
                this.$refs.upload.clearFiles()
            }
            this.dialogImportVisible = true
        },
        submitUpload() {
            let uploadFiles = this.$refs.upload.uploadFiles
            if (uploadFiles.length <= 0) {
                this.$message.error('请选择附件')
                return
            }
            this.$refs.upload.submit()
        },
        handleExceed(file, files) {
            this.$message.error('只能上传一个附件')
        },
        importFile(content) {
            const fd = new FormData()
            fd.append('file', content.file)
            this.importLoading = true
            importSensitive(fd).then(res => {
                const resData = res.data
                if (resData.code == '10001') {
                    this.dialogImportVisible = false
                    this.handleClearFiles()
                    this.$message.success('上传成功')
                    this.getList()
                } else {
                    this.$message.error(resData.error)
                }
                this.importLoading = false
            }).catch(err => {
                this.importLoading = false
            })
        },
        handleCloseImport() {
            this.dialogImportVisible = false
            this.handleClearFiles()
        },
        handleClearFiles() {
            let upload = this.$refs.upload
            if (upload) {
                setTimeout(() => {
                    upload.clearFiles()
                }, 100)
            }
        },
        downloadModel() {
            window.location.href = `${process.env.BASE_API}/paramOperate/fileImportTemplate?flag=mgc`
            // window.location.href = `${process.env.BASE_API}/paramOperate/fileImportTemplate?flag=mgc`
        },
        handleUpdate(row) {
            this.getDetail(row.id)
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        selectRow(val) {
            
        },
        handleDelete(row) {
            let ids = []
            ids.push(row.id)
            this.$confirm('此操作将删除信息, 确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                deleteSensitive(ids).then(res => {
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
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // })
            })
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.submitLoading = true
                    this.wordError = ''
                    saveSensitive(this.formData).then(res => {
                        const data = res.data
                        if (data.code == '10001') {
                            this.dialogFormVisible = false
                            let isCreate = this.dialogStatus == 'create'
                            let message = isCreate ? '添加成功' : '修改成功'
                            if (isCreate) {
                                this.listQuery.pageNum = 0
                            }
                            this.getList()
                            this.$message({
                                message,
                                type: 'success'
                            })
                        } else if (data.code == 'PARAM_001'){
                            this.wordError = data.error
                        } else {
                            this.$message.error(data.error)
                        }
                        this.submitLoading = false
                    }).catch(() => {
                        this.submitLoading = false
                        this.$message({
                            message: '提交失败',
                            type: 'error'
                        })
                    })
                }
            })
        },
    }
}
</script>
