<template>
    <div class="page-container">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="page-breadcrumb">
            <el-breadcrumb-item class="bold" :to="{ path: '/mall/goods-comment/index' }">商品评论</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" :model="listQuery" size="small" class="demo-form-inline border" label-width="100px" @submit.native.prevent>
            <el-form-item label="用户账号：">
                <el-input v-model="listQuery.userName" placeholder="输入用户账号"></el-input>
            </el-form-item>
            <el-form-item label="商品名称：">
                <el-input v-model="listQuery.goodsName" placeholder="输入商品名称"></el-input>
            </el-form-item>
                <!-- 商品评论-供应商 -->
                <el-form-item label="供应商:" v-if="isSelecShow">
                    <el-select
                    v-model="listQuery.supplierId"
                    placeholder="请选择供应商"
                    clearable
                    class="search-width"
                    >
                    <el-option
                        v-for="item in supplier"
                        :key="item.id"
                        :label="item.supplierName"
                        :value="item.id"
                    ></el-option>
                    </el-select>
                </el-form-item>

            <el-form-item>
                <el-button type="primary" icon="el-icon-search" native-type="submit" @click="search">搜索</el-button>
            </el-form-item>
            <el-form-item class="align-right">
                <el-button type="primary" @click="handleShow">展示评论</el-button>
                <el-button type="danger" @click="handleBatch" :disabled="this.selectList.length === 0">批量删除</el-button>
            </el-form-item>
        </el-form>
        <!-- // 获取表格选中时的数据 -->
        <el-table ref="multipleTable" :data="tableData" max-height="600" stripe tooltip-effect="dark" style="width: 100%" v-loading="listLoading" @selection-change="selectRow">
            <el-table-column type="selection" width="40" align="center">
            </el-table-column>
            <el-table-column prop="username" label="用户账号" align="center">
            </el-table-column>

            <el-table-column label="评论内容" align="center">
                <template slot-scope="scope">
                    <p class="ellipsis">{{ scope.row.commenttext }}</p>
                </template>
            </el-table-column>


            <el-table-column label="商品" align="center">
            	<template slot-scope="scope">
            		<router-link :to="'/mall/goods/edit/' + scope.row.id">{{ scope.row.goodsname }}</router-link>
            	</template>
            </el-table-column>
        <!-- 供应商 -->
             <el-table-column label="供应商" align="center">
                <template slot-scope="scope">
                    <p class="ellipsis">{{ scope.row.supplierName }}</p>
                </template>
            </el-table-column>


            <el-table-column prop="createTime" label="评论时间" min-width="160" align="center">
                <template slot-scope="scope">{{ dateTime(scope.row.commenttime) }}</template>
            </el-table-column>
            <el-table-column width="60px" label="展示" align="center">
                <template slot-scope="scope">
                    <!-- <el-checkbox v-model="scope.row.showstatus"></el-checkbox> -->
                    <el-checkbox 
                    	:true-label="1" 
                    	:false-label="0" 
                    	v-model="scope.row.showstatus" 
                    	@change="enable(scope.row)"
                	></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button type="text" @click="check(scope.row)">查看</el-button>
                    <span class="line"></span>
                    <el-button type="text" class="red" @click="handleSingle(scope.row)">删除</el-button>
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
    	></el-pagination>

        <!-- 详情 -->
        <el-dialog title="评论详情" :visible.sync="dialogCheck" center :lock-scroll="false">
            <div class="dialogForm">
                <el-form size="small" :model="formData" class="demo-form-inline" label-width="100px">
                    <el-form-item label="用户账号：" prop="userName">
                        <template>{{ formData.userName }}</template>
                    </el-form-item>
                    <el-form-item label="评论内容：" prop="commentText">
                        <template>{{ formData.commentText }}</template>
                    </el-form-item>
                    <el-form-item label="商品名称：" prop="goodsName">
                        <template>{{ formData.goodsName }}</template>
                    </el-form-item>
                    <el-form-item label="评论时间：" prop="createTime">
                        <template>{{ dateTime(formData.createTime) }}</template>
                    </el-form-item>
                    <!-- <el-form-item label="展示评论：" prop="status">
                        <el-radio-group v-model="formData.status">
                            <el-radio :label="0">否</el-radio>
                            <el-radio :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item> -->
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="danger" size="small" @click="singleDelete">删除</el-button>
            </div>
        </el-dialog>

        <!-- 删除 -->
        <el-dialog
			title="删除"
			:visible.sync="dialogDelete"
			center 
			:lock-scroll="false">
			<div class="dialogForm">
                <el-form size="small" :model="deleteData" ref="deleteForm" class="demo-form" @submit.native.prevent align="center">
                    <el-form-item prop="info">
                        <template>{{ deleteData.info }}</template>
                    </el-form-item>
                </el-form>
            </div>
			<span slot="footer" class="dialog-footer">
				<el-button :loading="submitLoading" size="small" @click="dialogDelete = false">否</el-button>
				<el-button :loading="submitLoading" size="small" type="primary" v-show="showSingle" @click="singleDelete">是</el-button>
				<el-button :loading="submitLoading" size="small" type="primary" v-show="showBatch" @click="batchDelete">是</el-button>
			</span>
		</el-dialog>

    </div>
</template>
<style lang="scss" scoped>
.ellipsis {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.search-width{
    width: 200px;
}

</style>
<script>
import { getCommentList, getCommentDetail, deleteBatch, deleteById, updateComment } from '@/api/mall'
import { convertDate } from '@/utils'

  import {
   getComodityClassList,  // 获取商品分类列表
  getComoditySupplierList  //请选择供应商,下拉选项搜索
   } from '@/api/util'

export default {
    data() {
        return {
            listQuery: {
                userName: '',
                goodsName: '',
                pageSize: 50,
                pageNum: 0,
                supplierId: '' ,//  供应商id
            },
            //显示/隐藏供应商下拉框
            isSelecShow: false,
            supplier:[], //  供应商数据
            tableData: [], //表格中所需要渲染的数据
            selectList: [],
            listLoading: true,
            submitLoading: false,
            total: 0,
            dialogCheck: false,
            formData: {
                id: '',
                commentText: '',
                goodsName: '',
                createTime: '',
                status: '',
                dataRemoveType: 0
            },
            dialogDelete: false,
            showSingle: false,
            showBatch: false,
            deleteData: {
            	info: ''
            },
            commentId: '',
            idList: '',
        }
    },
    created() {
        // 根据供应商显示自身对应的数据
        const supplierId = localStorage.getItem("supplierId");
        // console.log(supplierId,'supplierId供应商id')
        this.isSelecShow = supplierId === "" ? true : false;
        // this.listQuery.supperlyId = supplierId;
        this.listQuery.supplierId = supplierId;
        // console.log(this.listQuery,'供应商数据')
        this.getList()  // 商品评论
        this.getClassList() // 获取商品分类列表
        this.suppliers()  //供应商
   
    },
    computed: {
        dateTime() {
            return function(date) {
                return convertDate(date)
            }
        }
    },
    methods: {
        // 获取表格选中时的数据
        selectRow(val) {
            // console.log(val)
            this.selectList = val
        },
        getList() { // 商品评论
            this.listLoading = true
            getCommentList(this.listQuery).then(res => {
                console.log(res)
                // 供应商数据
                const data = res.data;
                this.tableData = data.data.pageData;
                this.total = data.data.totalCount;
                this.listLoading = false;
            })
        },
        changePage(val) {
            this.listQuery.pageNum = val - 1;
            this.getList(); // 商品评论
        },
        search() {
            this.listQuery.pageNum = 0;
            this.getList();// 商品评论
        },
        check(row) {
            this.dialogCheck = true
            this.getDetail(row.id)
        },
        getDetail(commentId) {
            // 商品评论详情
            getCommentDetail(commentId).then(res => {
                console.log(res)
                const data = res.data.data
                this.formData = {
                    commentId: data.id,
                    userName: data.userName,
                    commentText: data.commentText,
                    goodsName: data.goodsName,
                    createTime: data.createTime,
                    status: data.status,
                    dataRemoveType: 0
                }
            })
        },
        enable(row) {
            let data = {
                commentIds: row.id,
                nstatus: row.showstatus
            }
            updateComment(data).then(res => {
                const data = res.data
                if (data.flag == 'success') {
                    this.$message.success('操作成功')
                    this.getList() // 商品评论
                } else {
                    this.$message.error('操作失败')
                }
            })
        },
        // 获取商品分类列表
      getClassList() {
        getComodityClassList().then(res => {
          // console.log(res)
          const resData = res.data
          if (resData.code == '10001') {
            this.classList = resData.data
          }
        })
      },
      //获取供应商下拉列表
      suppliers(){
        // console.log("获取供应商")
        getComoditySupplierList().then(res=>{
          // console.log(res)
          this.supplier=res.data.data.list
          // console.log(this.supplier)
        })
      },

        handleShow() {
            if(this.selectList.length != 0){
                this.commentIds = []
                for (let item of this.selectList) {
                    this.commentIds.push(item.id);
                }
                let commentIds = this.commentIds.join(',')
                let data = {
                    commentIds: commentIds,
                    nstatus: 1
                }
                updateComment(data).then(res => {
                    const data = res.data
                    if (data.flag == 'success') {
                        this.$message.success('操作成功')
                        this.getList(); // 商品评论
                    } else {
                        this.$message.error('操作失败')
                    }
                })
            }else{
                this.$message({
                    message: '请先选择',
                    type: 'warning'
                })
            }
        },
        // 删除
        handleBatch() {
            this.idList = []
            for (let item of this.selectList) {
                this.idList.push(item.id);
            }
            this.dialogDelete = true
            this.showSingle = false
            this.showBatch = true
            this.deleteData.info = '是否删除所选评论？'
        },
        handleSingle(row) {
            this.commentId = row.id
            this.dialogDelete = true
            this.showSingle = true
            this.showBatch = false
            this.deleteData.info = '是否删除该评论？'
        },
        batchDelete(data) {
        	// let idList = this.idList
        	let idList = this.idList.join(',')
        	deleteBatch(idList).then(res => {
                const data = res.data;
                if(data.flag == 'success') {
                    this.$message({
                        message: data.msg,
                        type: 'success',
                    })
                    this.dialogDelete = false
                    this.getList(); // 商品评论
                } else {
                    this.$message({
                        message: data.msg,
                        type: 'error',
                    })
                }
            })
        },
        singleDelete(data) {
        	let commentId = this.commentId
        	if(commentId == ''){
        		let commentId = this.formData.commentId
        		deleteById(commentId).then(res => {
	                const data = res.data;
	                if(data.flag == 'success') {
	                    this.$message({
	                        message: data.msg,
	                        type: 'success',
	                    })
	                    this.dialogCheck = false
	                    this.getList(); // 商品评论
	                } else {
	                    this.$message({
	                        message: data.msg,
	                        type: 'error',
	                    })
	                }
	            })
        	}else{
        		deleteById(commentId).then(res => {
	                const data = res.data;
	                if(data.flag == 'success') {
	                    this.$message({
	                        message: data.msg,
	                        type: 'success',
	                    })
	                    this.dialogDelete = false
	                    this.getList(); // 商品评论
	                } else {
	                    this.$message({
	                        message: data.msg,
	                        type: 'error',
	                    })
	                }
	            })
        	}
        },
    }
}

</script>
