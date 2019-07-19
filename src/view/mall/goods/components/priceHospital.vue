<template>
	<div>
		<table border class="colTable">
			<thead>
				<tr>
					<th>上架</th>
					<th>医院名称</th>
					<th>商品规格名称-01</th>
					<th>商品规格名称-02</th>
					<th>商品规格名称-03</th>
					<th>售价</th>
					<th>折后售价</th>
					<th>支付可使用积分</th>
					<th>支付可获取积分</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td rowspan="8">
						<el-checkbox></el-checkbox>
					</td>
					<td rowspan="8">医院名称-01</td>
					<td rowspan="4">商品规格名称-01</td>
					<td rowspan="2">规格值-01</td>
					<td>规格值-01</td>
					<td>
						<input type="namber">
					</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>规格值-02</td>
					<td>
						<input type="namber">
					</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td rowspan="2">规格值-03</td>
					<td>规格值-01</td>
					<td>
						<input type="namber">
					</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>规格值-02</td>
					<td>
						<input type="namber">
					</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td rowspan="4">商品规格名称-02</td>
					<td rowspan="2">规格值-01</td>
					<td>规格值-01</td>
					<td>
						<input type="namber">
					</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>规格值-02</td>
					<td>
						<input type="namber">
					</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td rowspan="2">规格值-03</td>
					<td>规格值-01</td>
					<td>
						<input type="namber">
					</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
				<tr>
					<td>规格值-02</td>
					<td>
						<input type="namber">
					</td>
					<td></td>
					<td></td>
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style lang="scss" scoped>
.colTable{
	margin-top: 15px;
	width: 100%;
	text-align: center;
	thead th,
	thead tr{
		background-color: #e4e7ed;
		color: #333;
	}
}
th,td{
	padding: 12px 10px;
	input{
		height: 32px;
		line-height: 32px;
	    padding: 0 15px;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
	}
	input:hover{
		border-color: #ccc;
	}
}
</style>

<script>
export default {
    data() {
		return {
			// 价格和医院
    		tableData: [
        		{
        			upperShelf: '',
        			name: '医院名称-01',
        			specName1: '商品规格名称-01',
        			specName2: '规格值-01',
        			specName3: '规格值-01',
        			price: '',
        			discountPrice: '',
        			useIntegral: '',
        			getIntegral: '',
        		}
    		],
    		selectlistRow: [],
		}
    },
    methods: {
        // 获取表格选中时的数据
	    selectRow (val) {
      		this.selectlistRow = val;
	    },
    }

}
</script>