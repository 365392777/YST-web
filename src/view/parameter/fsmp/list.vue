<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
            >特医食品信息管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            size="small"
            class="demo-form-inline border clearfix"
            @submit.native.prevent
        >
            <el-form-item>
                <el-input
                    v-model="listQuery.name"
                    placeholder="输入关键字"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="search" type="primary" icon="el-icon-search" native-type="submit">搜索</el-button>
            </el-form-item>
            <div class="fr">
                <el-form-item>
                    <router-link to="/parameter/fsmp/add">
                        <el-button type="primary">新增</el-button>
                    </router-link>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleImport">导入</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="downloadModel">下载模版</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :data="tableData"
            max-height="600"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
        >
            <!-- <el-table-column
	            type="selection"
	            width="45" 
	            align="center">
	        </el-table-column> -->
            <el-table-column
                prop="id"
                label="特医食品 ID"
                width="150"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="特医食品名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="brand"
                label="特医食品所属分类"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="note"
                label="国食注字"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="150"
            >
                <template slot-scope="scope">
                    <router-link :to="'/parameter/fsmp/edit/' + scope.row.id">
	            	    <el-button type="text">编辑</el-button>
                    </router-link>
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
            title="导入特医食品"
            :visible.sync="dialogImportVisible"
            center
            width="30%"
            :beforeClose="handleCloseImport"
        >
            <div class="dialog-container">
                <el-form size="small" ref="importForm"  label-position="right" label-width="120px" style="margin-left:50px;">
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
import { getFsmpList, deleteFsmp, importFsmp } from '@/api/parameter'

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
            total: 0,
            listLoading: true,
            dialogImportVisible: false,
            importLoading: false,
            downloadUrl: process.env.BASE_API,
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getFsmpList(this.listQuery).then(res => {
                const data = res.data
                this.tableData = data.data.pageData
                this.total = data.data.totalCount
                this.listLoading = false
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
        handleDelete(row) {
            let data = [row.id]
            this.$confirm('此操作将删除信息, 确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                deleteFsmp(data).then(res => {
                    const data = res.data
                    if (data.flag == 'success') {
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
            importFsmp(fd).then(res => {
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
            window.location.href = `${process.env.BASE_API}/paramOperate/fileImportTemplate?flag=fsmp`
        }
    }
}
</script>
