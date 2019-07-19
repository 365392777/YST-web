<template>
    <div class="classify-container">
        <el-row type="flex" justify="end" :gutter="15">
			<el-col :span="24" class="align-right">
				<el-button type="primary" size="small" @click="handleCreate">新增商品规格模型</el-button>
			</el-col>
		</el-row>
        <el-table
            :data="tableData"
            max-height="600"
            stripe
            tooltip-effect="dark"
            style="width: 100%;"
        >
            <el-table-column label="商品规格模型 ID" prop="id" align="center">
            </el-table-column>
            <el-table-column label="商品规格模型名称" prop="speModelName" align="center">
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button type="text" @click="handleUpdate(scope.row)">编辑</el-button>
                    <span class="line"></span>
                    <el-button type="text" class="red" @click="handleDelete(scope.row)">删除</el-button>
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
    getSpecificationList,
    saveSpecification,
    getSpecificationDetail,
    deleteSpecification
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
    components: {
        SpecDialog
    },
    data() {
        return {
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                create: '新增商品规格模型',
                update: '编辑商品规格模型',
            },
            listQuery: {
                pageNum: 0,
                pageSize: 50,
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
            tableData: [],
            total: 0,
            listLoading: true,
            submitLoading: false,
            rules: {
                name: [{ required: true, message: '请输入商品规格模型名称' }]
            },
            specData: {}
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getSpecificationList(this.listQuery).then(res => {
                const data = res.data
                if (data.code == '10001') {
                    this.tableData = data.data.pageData
                    this.total = data.data.totalCount
                } else {
                    this.$message.error(data.error)
                }
                this.listLoading = false
            })
        },
        getDetail(id) {
            getSpecificationDetail(id).then(res => {
                const resData = res.data
                if (resData.flag == 'success') {
                    this.dialogStatus = 'update'
                    this.dialogFormVisible = true
                    this.specData = resData.data
                } else {
                    this.$message.error('获取商品规格失败')
                }
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getList()
        },
        handleCreate() {
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
        },
        handleUpdate(row) {
            this.getDetail(row.id)
        },
        dialogCallBack(data) {
            let isCreate = this.dialogStatus == 'create'
            if (isCreate) {
                this.listQuery.pageNum = 0
            }
            this.getList()
        },
        handleDelete(row) {
            this.$confirm('此操作将删除信息, 确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true,
            }).then(() => {
                deleteSpecification(row.id).then(res => {
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
</style>

