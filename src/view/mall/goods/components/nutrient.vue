
<template>
<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <div class="thermal "><span>热能及三大营养素</span></div>
     <el-row>
  <el-col :span="8">
  <el-form-item label="热量:" prop="heatKcal">
    <el-input maxlength=9 clearable v-model="ruleForm.heatKcal"></el-input>kcal
  </el-form-item>
  </el-col>
  <el-col :span="8">
      <el-form-item label="热量:" prop="heatKj">
    <el-input maxlength=9 clearable v-model="ruleForm.heatKj"></el-input>kj
  </el-form-item>
  </el-col>

  <el-col :span="8">
  <el-form-item label="蛋白质:" prop="protein">
    <el-input maxlength=9 clearable v-model="ruleForm.protein"></el-input>g
  </el-form-item>
  </el-col>
</el-row>

  <el-row>   
  <el-col :span="8">
  <el-form-item label="脂肪:" prop="fat">
    <el-input maxlength=9 clearable v-model="ruleForm.fat"></el-input>g
  </el-form-item>
  </el-col>
  <el-col :span="8">
  <el-form-item label="碳水化合物:" prop="carbohy">
    <el-input maxlength=9 clearable v-model="ruleForm.carbohy"></el-input>g
  </el-form-item>
  </el-col>
</el-row>
		<dl>
			<dt>注：每100 (g/ml) 含量</dt>
		</dl>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
</template>

<style lang="scss" scoped>
.thermal{
  background-color: #e4e7ed;
  width: 130px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid #aaa;
}
.el-input {
  width: 130px;
}
  dl {
    margin-bottom: 30px;
    dd {
      margin-top: 10px;
    }
  }
</style>
<script>
  import { saveNutrientInfo,getGoodsNutrientInformation } from '@/api/mall'
  export default {
  props: {
		baseId: {
			default: ''
    },
    // 是不是编辑
		isEdit: {
			type: Boolean,
			default: false,
		}
	},
    data() {
      var checkAge = (rule, value, callback) => {
        setTimeout(() => {
            // 检测输入框数据输入小数点后面只允许2位数字,并且只能输入9位
            const reg = /(^\d{1,9}(\.\d{1,2})?$)/
          if (reg.test(value)) {
               callback();
          } else {
            callback(new Error('(必填) 需输入数值,如:10 或 10.22'));
          }
        }, 500);
      };
      return {
        ruleForm: {
          heatKcal:'' ,
           heatKj:'',    
           protein:'' , 
           fat:'' ,  
           carbohy :'' , 
           id:0,
        },
        goodsId:'',
        rules: {
          heatKcal: [
            { validator: checkAge, trigger: 'blur' }
          ],
          heatKj: [
            { validator: checkAge, trigger: 'blur' }
          ],
          protein: [
            { validator: checkAge, trigger: 'blur' }
          ],
          fat: [
            { validator: checkAge, trigger: 'blur' }
          ],
          carbohy: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      };
    },
  created() {
		if (this.isEdit) {
      let id = this.$route.params && this.$route.params.id
      console.log(id)
			this.id = id
			this.getDetail(id)
		}
	},
    methods: {
     getDetail(id) {
			getGoodsNutrientInformation(id).then(res => {
				const data = res.data.data
        // console.log(data,'营养素信息')
        this.ruleForm= {
          heatKcal:data.heatKcal ,
           heatKj:data.heatKj,    
           protein:data.protein , 
           fat:data.fat ,  
           carbohy :data.carbohy , 
           id:data.id,
        }
        // console.log(this.ruleForm)
			})
    },
    
      //正则校验输入框不允许出现3位小数
       IWS_CheckDecimal(obj) {
            const reg = /(^\d{1,9}(\.\d{1,2})?$)/
            if (reg.test(obj.target.value)) { 
            } 
            else {
                obj.target.value = obj.target.value.substr(0, obj.target.value.length - 1);
            }
        },
        // 提交按钮提交数据
      submitForm(formName) {
           //获取本地存储数据
      let goodsId=localStorage.getItem('goodsid')

      console.log(goodsId)
      this.ruleForm={
           heatKcal:this.ruleForm.heatKcal ,
           heatKj:this.ruleForm.heatKj,    
           protein:this.ruleForm.protein , 
           fat:this.ruleForm.fat ,  
           carbohy :this.ruleForm.carbohy , 
           id:this.ruleForm.id,
           goodsId:	this.id
      }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 提交FSMP营养素信息
          	saveNutrientInfo(this.ruleForm).then(res => {
              console.log(res)
                const status = res.status
                if (status == 200) {
                  this.$message.success('保存成功')
                } else {
                  this.$message.error('保存失败')
                }
              }).catch(err => {
                console.log(err)
              })
          } else {
            return false;
          }
        });
      },
      // 重置信息
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
