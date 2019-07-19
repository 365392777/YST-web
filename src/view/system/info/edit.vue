<template>
	<div class="page-container">
		<el-tabs v-model="tabType" type="card" @tab-click="handleClick" class="secondTab">
		    <el-tab-pane label="服务协议与隐私声明" name="agreement" class="statement">
		    	<el-tabs v-model="tab1" class="tabChild">
				    <el-tab-pane label="医生端" name="doctor">
				    	
				    </el-tab-pane>
				    <el-tab-pane label="患者端" name="patient">患者端</el-tab-pane>
				</el-tabs>
				<el-button type="primary" size="small" @click="save">保存</el-button>
		    </el-tab-pane>
		    <el-tab-pane label="常见问题" name="problem">
		    	<el-tabs v-model="tab2" class="tabChild">
				    <el-tab-pane label="医生端" name="doctor">
				    	<el-form :inline="true" :model="formInfo" size="small" class="demo-form-inline border flex">
						    <el-form-item label="问题名称：">
						        <el-input v-model="formInfo.search" placeholder="输入关键字"></el-input>
						    </el-form-item>
						    <el-form-item>
						    	<el-button type="primary" icon="el-icon-search" @click="">搜索</el-button>
						    </el-form-item>
						    <el-form-item class="flex-item">
						        <el-button type="primary" @click="">删除</el-button>
						        <el-button type="primary" @click="">新增</el-button>
						    </el-form-item>
						</el-form>
				        <el-table
					        ref="multipleTable"
					        :data="tableData"
					        max-height="500"
					        stripe
					        tooltip-effect="dark"
					        style="width: 100%"
					        @selection-change="selectRow">
					        <el-table-column
					            type="selection"
					            width="45" 
					            align="center">
					        </el-table-column>
					        <el-table-column
					            prop="id"
					            label="问题ID" 
					            type="index" 
					            width="80" 
					            align="center">
					        </el-table-column>
					        <el-table-column
					            prop="name"
					            label="问题名称"
					            align="center">
					        </el-table-column>
					        <el-table-column
					            label="操作"
					            align="center"
					            width="100"
					            show-overflow-tooltip>
					            <template slot-scope="scope">
					            	<router-link to="" class="red">{{ scope.row.delete }}</router-link>
					            	<span class="line"></span>
					            	<router-link to="">{{ scope.row.modify }}</router-link>	
					            </template>
					        </el-table-column>
						</el-table>
						<el-pagination
						    :page-size="20"
						    :pager-count="7"
						    layout="prev, pager, next"
						    :total="1000">
						</el-pagination>
				    </el-tab-pane>
				    <el-tab-pane label="患者端" name="patient">患者端</el-tab-pane>
				</el-tabs>
		    </el-tab-pane>
		    <el-tab-pane label="声明" name="statement" class="statement">
		    	<el-tabs v-model="tab3" class="tabChild">
				    <el-tab-pane label="医生端" name="doctor">
				    	<h4>声明</h4>
				    	<p>这是声明的内容这是声明的内容这是声明的内容这是声明的内容这是声明的内容这是声明的内容这是声明的内容</p>
				    </el-tab-pane>
				    <el-tab-pane label="患者端" name="patient">患者端</el-tab-pane>
				</el-tabs>
				<el-button type="primary" size="small" @click="save">保存</el-button>
		    </el-tab-pane>
		</el-tabs>
		
	</div>
</template>
<style lang="scss" scoped>
	.secondTab{
		.el-tabs__active-bar{
			background-color: #FF9933;
		}
		.el-tabs__nav-wrap::after{
			height: 0;
		}
		.tabChild {
			padding: 0 15px;
			.el-tabs__item:nth-child(2){
				padding-left: 0 !important;
			}
			.el-tabs__item:last-child{
				padding-right: 0 !important;
			}
		}
		.statement{
			position: relative;
			.el-button{
				position: absolute;
				right: 0;
				top: 5px;
			}
		}
		.el-form .flex-item{
			margin-right: 0;
			text-align: right;
		}
		.el-table{
			margin: 15px 0;
		}
		.el-table thead th,
		.el-table thead tr{
			background-color: #e4e7ed;
			color: #333;
		}
		.el-table tr td{
			a,.line{
				display: inline-block;
				vertical-align: middle;
			}
			.line{
				height: 20px;
				border-left: 1px solid #333;
				margin: 0 6px;
			}
		}
	}
	.secondTab>.el-tabs__header .el-tabs__item.is-active{
		border-bottom-color: #e4e7ed;
		background-color: #e4e7ed;
		color: #303133;
	}
</style>
<script>
    export default {
        data() {
            return {
            	tabType: 'agreement',
            	tab1: 'doctor',
            	tab2: 'doctor',
            	tab3: 'doctor',
            	formInfo: {
		        	search: ''
		        },
            	tableData: [
			        {	
			        	id: 1,
			            name: '问题名称-01',
			            delete: '删除',
			            modify: '编辑',
			        }, 
			        {	
			        	id: 2,
			            name: '问题名称-02',
			            delete: '删除',
			            modify: '编辑',
			        },
			        {	
			        	id: 3,
			            name: '问题名称-03',
			            delete: '删除',
			            modify: '编辑',
			        },
			        {	
			        	id: 4,
			            name: '问题名称-04',
			            delete: '删除',
			            modify: '编辑',
			        }
		        ],
		        selectlistRow: []
            };
        },
        methods: {
	        handleClick(tab, event) {
	            
	        },
	        save() {
	        	
	        },
	        // 获取表格选中时的数据
	        selectRow (val) {
	          this.selectlistRow = val
	        },
	    }
    };
</script>