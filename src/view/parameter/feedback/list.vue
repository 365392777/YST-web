<template>
    <div class="page-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item class="bold">意见反馈</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form 
            :inline="true"
            :model="listQuery"
            class="demo-form-inline border"
            size="small"
            @submit.native.prevent
        >
            <el-form-item label="反馈来源">
                <el-select class="search-input" v-model="listQuery.feedBackPort" clearable>
                    <el-option
                        v-for="item in feedBackPortList"
                        :key="item.dicSubval"
                        :label="item.dicSubname"
                        :value="item.dicSubval"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="内容">
                <el-input class="search-input" v-model="listQuery.feedBackContent" placeholder="请输入内容关键字"></el-input>
            </el-form-item>
            <el-form-item label="用户">
                <el-input class="search-input" v-model="listQuery.userPhone" placeholder="请输入用户手机号码"></el-input>
            </el-form-item>
            <el-form-item label="跟进状态">
                <el-select class="search-input" v-model="listQuery.dealStatus" clearable>
                    <el-option
                        v-for="item in dealStatusList"
                        :key="item.dicSubval"
                        :label="item.dicSubname"
                        :value="item.dicSubval"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="反馈时间">
                <el-date-picker
                    class="search-input"
                    type="date"
                    placeholder="起始时间"
                    v-model="listQuery.fbTimeStart"
                    :picker-options="startOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
		        <template><span>-</span></template>
		        <el-date-picker
                    class="search-input"
                    type="date"
                    placeholder="结束时间"
                    v-model="listQuery.fbTimeEnd"
                    :picker-options="endOptions"
                    value-format="yyyy-MM-dd"
                ></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="search" type="primary" icon="el-icon-search" native-type="submit">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="deleteSelect" type="danger" :disabled="selectList.length <= 0">删除</el-button>
            </el-form-item>
        </el-form>
        <el-table
            ref="multipleTable"
            v-loading="listLoading"
            :data="tableData"
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
                prop="feedBackContent"
                label="内容"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="userPhone"
                label="用户"
                min-width="120"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="图片"
                align="center"
            >
                <template slot-scope="scope">
                    <!-- <img :src="imgBase(item.feedBackImage)" v-for="item in scope.row.images" :key="item.id" class="image-preview"> -->
                    <img :src="feedBackImageUrl + feedBackImage" class="image-preview" v-for="feedBackImage in scope.row.feedBackImage.split(',')" v-if="scope.row.feedBackImage">
                </template>
            </el-table-column>
            <el-table-column
                label="反馈时间"
                min-width="160"
                align="center"
            >
                <template slot-scope="scope">
                    <span>{{ dateTime(scope.row.createTime) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="dealStatus"
                label="跟进状态"
                align="center"
            >
            </el-table-column>
            <el-table-column
                label="操作"
                align="center"
                width="200"
            >
                <template slot-scope="scope">
                    <router-link :to="'/parameter/feedback/detail/' + scope.row.id ">
	            	    <el-button type="text">查看</el-button>
                    </router-link>
	            	<span class="line"></span>
                    <router-link :to="'/parameter/feedback/follow-up/' + scope.row.id ">
                        <el-button type="text">跟进</el-button>
                    </router-link>
	            	<span class="line"></span>
	            	<el-button type="text" @click="deleteRow(scope.row.feedBack)" class="red">删除</el-button>
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
import { getFeedbackList, deleteFeedback } from '@/api/parameter'
import { getDicList } from '@/api/util'
import { convertDate } from '@/utils'
import { feedBackImageUrl } from '@/utils/dev'

export default {
    data() {
        return {
            listQuery: {
                feedBackPort: '',
                feedBackContent: '',
                userPhone: '',
                dealStatus: '',
                fbTimeStart: '',
                fbTimeEnd: '',
                pageNum: 0,
                pageSize: 20,
            },
            tableData: [],
            total: 0,
            listLoading: true,
            dealStatusList: [],
            feedBackPortList: [
                {
                    dicSubval: '0',
                    dicSubname: '医生端',
                },
                {
                    dicSubval: '1',
                    dicSubname: '患者端',
                },
            ],
            startOptions: {
                disabledDate: (time) => {
                    if (this.listQuery.fbTimeEnd) {
                        let date = new Date(this.listQuery.fbTimeEnd.replace(/-/g, '/'))
                        return time.getTime() > date || time.getTime() > Date.now()
                    } else {
						return time.getTime() > Date.now()
					}
                }
            },
            endOptions: {
                disabledDate: (time) => {
                    let date = null
					if (this.listQuery.fbTimeStart) {
						date = this.listQuery.fbTimeStart.replace(/-/g, '/')
						date = new Date(date)
					}
                    return time.getTime() < date || time.getTime() > Date.now()
                }
            },
            selectList: [],
            feedBackImageUrl,
        }
    },
    created() {
        this.getList()
        this.getSelectList()
    },
    computed: {
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        },
        imgBase() {
            return function(image) {
                return 'data:image/*;base64,' + image
            }
        },
    },
    methods: {
        getList() {
            this.listLoading = true
            getFeedbackList(this.listQuery).then(res => {
                const data = res.data.data
                this.tableData = data.pageData
                this.total = data.totalCount
                this.listLoading = false
            })
        },
        getSelectList() {
            getDicList('D005').then(res => {
                this.dealStatusList = res.data
            })
        },
        search() {
            this.listQuery.pageNum = 0
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
                data.push(item.feedBack.id)
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
        handleDelete(ids) {
            deleteFeedback(ids).then(res => {
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
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1
            this.getList()
        }
    }
}
</script>

<style lang="scss" scoped>
.search-input {
    width: 160px;
}
.image-preview {
    width: 50px;
    height: 50px;
    border-radius: 4px;
    + .image-preview {
        margin-left: 5px;
        display: none;
    }
}
</style>
