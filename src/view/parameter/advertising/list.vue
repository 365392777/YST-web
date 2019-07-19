<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item
                class="bold"
            >广告管理</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :inline="true"
            :model="listQuery"
            class="demo-form-inline border"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="广告位置">
                <el-select v-model="listQuery.place" clearable>
                    <el-option
                        v-for="item in placeList"
                        :key="item.dicSubval"
                        :label="item.dicSubname"
                        :value="item.dicSubval"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标题">
                <el-input v-model="listQuery.head" placeholder="输入关键字"></el-input>
            </el-form-item>
            <el-form-item label="跳转类型">
                <el-select v-model="listQuery.dispatcherType" clearable>
                    <el-option
                        v-for="item in dispatcherTypeList"
                        :key="item.dicSubval"
                        :label="item.dicSubname"
                        :value="item.dicSubval"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button @click="search" type="primary" icon="el-icon-search">搜索</el-button>
            </el-form-item>
            <div class="fr">
                <el-form-item>
                    <router-link to="/parameter/advertising/add">
                        <el-button type="primary">新增</el-button>
                    </router-link>
                </el-form-item>
                <el-form-item>
                    <el-button :disabled="selectList.length <= 0" @click="deleteSelect" type="danger">删除</el-button>
                </el-form-item>
            </div>
        </el-form>
        <el-table
            ref="multipleTable"
            :data="tableData"
            v-loading="listLoading"
            max-height="600"
            stripe
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="selectRow"
        >
            <el-table-column
	            type="selection"
	            width="45" 
	            align="center">
	        </el-table-column>
            <el-table-column
                prop="id"
                label="编号"
                width="80"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="place"
                label="广告位置"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="head"
                label="标题"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="图片"
                align="center"
            >
                <template slot-scope="scope">
                    <!-- <img :src="imgBase(scope.row.image)" class="image-preview"> -->
                    <img :src="adImageUrl + scope.row.image" class="image-preview">
                </template>
            </el-table-column>
            <el-table-column
                prop="dispatcher"
                label="跳转信息"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="sort"
                label="排序"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="编辑时间"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ dateTime(scope.row.updateTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="200"
            >
                <template slot-scope="scope">
                    <router-link :to="'/parameter/advertising/detail/' + scope.row.id ">
	            	    <el-button type="text">查看</el-button>
                    </router-link>
	            	<span class="line"></span>
                    <router-link :to="'/parameter/advertising/edit/' + scope.row.id ">
                        <el-button type="text">编辑</el-button>
                    </router-link>
	            	<span class="line"></span>
	            	<el-button type="text" @click="deleteRow(scope.row)" class="red">删除</el-button>	
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
    </div>
</template>

<script>
import {
    getAdvertisingList,
    deleteAdvertising
} from '@/api/parameter'
import { getDicList } from '@/api/util'
import { convertDate } from '@/utils'
import { adImageUrl } from '@/utils/dev'

export default {
    data() {
        return {
            listQuery: {
                place: '',
                head: '',
                dispatcherType: '',
                pageNum: 0,
                pageSize: 20,
            },
            placeList: [],
            dispatcherTypeList: [],
            tableData: [],
            total: 0,
            listLoading: true,
            selectList: [],
            adImageUrl,
        }
    },
    created() {
        this.getSearchSelect()
        this.getList()
    },
    computed: {
        imgBase() {
            return function(image) {
                return 'data:image/*;base64,' + image
            }
        },
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        }
    },
    methods: {
        getList() {
            this.listLoading = true
            getAdvertisingList(this.listQuery).then(res => {
                this.tableData = res.data.pageData
                this.total = res.data.totalCount
                this.listLoading = false
            })
        },
        getSearchSelect() {
            getDicList('D002').then(res => {
                this.placeList = res.data
            })
            getDicList('D003').then(res => {
                this.dispatcherTypeList = res.data
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
        selectRow(val) {
            this.selectList = val
        },
        deleteRow(row) {
            let data = [row.id]
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
        handleDelete(data) {
            deleteAdvertising(data).then(res => {
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

<style lang="scss" scoped>
.image-preview {
    width: 50px;
    height: 50px;
    border-radius: 4px;
}
// .el-form .fr{
//     margin-top: 15px;
// }
</style>
