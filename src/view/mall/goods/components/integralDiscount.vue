<template>
	<div>
		<el-form ref="form" :model="formData" size="small" label-width="160px" class="demo-form formDiscount">
		    <el-form-item label="折扣：">
		        <el-input v-model.number="formData.integralDiscount" class="widthAuto"></el-input>折
		    </el-form-item>
		    <el-form-item label="支持积分支付：">
		        <el-radio-group v-model="formData.isIntegralPay">
		        	<el-radio :label="'0'">是【1】</el-radio>
		        	<el-radio :label="'1'">否</el-radio>
		        </el-radio-group>
		    </el-form-item>
		    <el-form-item label="积分使用规则【2】：">
		        <el-radio-group v-model="formData.payRule" @change="changePayRule">
		        	<el-radio :label="'1'" class="block">
		        		<span>可使用积分</span>
		        		<el-input
							class="widthAuto" v-model.number="formData.payRuleValue['1']"
							:disabled="formData.payRule != '1'"
						></el-input>
		        	</el-radio>
		        	<el-radio :label="'2'" class="block">
		        		<span>积分支付不能超过单价的百分比</span>
		        		<el-input
							class="widthAuto" v-model.number="formData.payRuleValue['2']"
							:disabled="formData.payRule != '2'"
						></el-input>%
		        	</el-radio>
		        	<el-radio :label="'3'" class="block">不限制积分支付占比</el-radio>
		        </el-radio-group>
		    </el-form-item>
		    <el-form-item label="支付获取积分：">
		        <el-radio-group v-model="formData.isIntegralGet">
		        	<el-radio :label="'0'">是</el-radio>
		        	<el-radio :label="'1'">否</el-radio>
		        </el-radio-group>
		    </el-form-item>
		    <el-form-item label="积分获取规则【3】：">
		        <el-radio-group v-model="formData.getRule" @change="changeGetRule">
		        	<el-radio :label="'0'" class="block">
		        		<span>获取积分占单价的百分比</span>
		        		<el-input
							class="widthAuto"
							v-model.number="formData.getRuleValue['0']"
							:disabled="formData.getRule != '0'"
						></el-input>%
		        	</el-radio>
		        	<el-radio :label="'1'" value="notExceed" class="block">
		        		<span>支付可获取积分数量</span>
		        		<el-input
							class="widthAuto" v-model.number="formData.getRuleValue['1']"
							:disabled="formData.getRule != '1'"
						></el-input>积分
		        	</el-radio>
		        </el-radio-group>
		    </el-form-item>
		</el-form>
		<dl>
			<dt>注：</dt>
			<dd>【1】如商品有折扣，积分支付是在折扣价的基础上按积分使用规则计算可支付的积分数量</dd>
			<dd>【2】指买家在非积分商城购买时可使用积分的规则</dd>
			<dd>【3】积分获取或支付数量将保留整数，默认抹去小数</dd>
		</dl>
		<router-link to="/mall/goods/list">
			<el-button size="small">返回</el-button>
		</router-link>
		<el-button type="primary" size="small" class="ml20" @click="handleSave" :loading="submitLoading">提交</el-button>
	</div>
</template>

<style lang="scss" scoped>
.demo-form{
	margin-top: 15px;
	.marketPrice{
		position: relative;
		padding-right: 85px;
		.unit{
			position: absolute;
			right: 0;
			top: 50%;
			margin-top: -16px;
		}
	}
	.el-form-item{
		margin-right: 0;
		.el-select{
			width: 100%;
		}
	}
	.widthAuto{
		width: auto;
		margin-right: 6px;
	}
}
.formDiscount{
	.el-radio.block{
		display: block;
		margin: 0;
	}
	.el-radio.block + .el-radio.block{
		margin-top: 15px;
	}
}
dl{
	margin-bottom: 30px;
	dd{
		margin-top: 10px;
	}
}
</style>

<script>
import { getGoodsIntegralDetail, saveGoodsIntegral } from '@/api/mall'

export default {
	props: {
		baseId: {
			default: ''
		},
		isEdit: {
			type: Boolean,
			default: false,
		}
	},
    data() {
		return {
			id: '',
			// 积分折扣
    		formData: {
				id: '',
				goodsId: '',
    		integralDiscount: '',
    		isIntegralPay: '',
				payRule: '',
				payRuleValue: {
					'1': '',
					'2': '',
					'3': 0,
				},
    			isIntegralGet: '',
				getRule: '',
				getRuleValue: {
					'0': '',
					'1': '',
				},
			},
			submitLoading: false,
		}
	},
	created() {
		if (this.isEdit) {
			let id = this.$route.params && this.$route.params.id
			this.id = id
			this.getDetail(id)
		}
	},
    methods: {
        getDetail(id) {
			getGoodsIntegralDetail(id).then(res => {
				const data = res.data
				// console.log(data,'积分折')
				this.formData = {
					id: data.id,
					goodsId: this.id,
					integralDiscount: data.integralDiscount,
					isIntegralPay: data.isIntegralPay,
					payRule: data.payRule,
					payRuleValue: {
						'1': '',
						'2': '',
						'3': 0,
					},
					isIntegralGet: data.isIntegralPay,
					getRule: data.getRule,
					getRuleValue: {
						'0': '',
						'1': '',
					},
				}
				this.formData.getRuleValue[data.getRule] = data.getRuleValue
				this.formData.payRuleValue[data.payRule] = data.payRuleValue
			})
		},
		changePayRule(val) {
			for (let item of Object.keys(this.formData.payRuleValue)) {
				if (item != val && item != 3) {
					this.formData.payRuleValue[item] = ''
				}
			}
		},
		changeGetRule(val) {
			for (let item of Object.keys(this.formData.getRuleValue)) {
				if (item != val) {
					this.formData.getRuleValue[item] = ''
				}
			}
		},
		handleSave() {
			let requestData = Object.assign({}, this.formData)
			requestData.payRuleValue = this.formData.payRuleValue[requestData.payRule]
			requestData.getRuleValue = this.formData.getRuleValue[requestData.getRule]
			requestData.goodsId = this.baseId
			if (this.isEdit) {
				requestData.goodsId = this.id
			}
			this.submitLoading = true
			saveGoodsIntegral(requestData).then(res => {
				const resData = res.data
				console.log(resData,'折扣')
				if (resData.flag == 'success') {
					if (!this.isEdit) {
						this.formData.id = resData.data.id
					}
					this.$message.success('保存失败')
				} else {
					this.$message.success('保存成功')
				}
				this.submitLoading = false
			}).catch(err => {
				this.submitLoading = false
			})
		},
    }

}
</script>