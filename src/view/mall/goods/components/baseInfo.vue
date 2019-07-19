<template>
  <div>
    <el-form
      :model="formData"
      :rules="rules"
      ref="formAdd"
      size="small"
      label-width="120px"
      class="demo-form formAdd clearfix"
    >
      <el-col :span="11">
        <el-form-item label="商品分类" prop="goodsCategoryId">
          <el-select v-model="formData.goodsCategoryId" placeholder="请选择商品分类">
            <el-option
              v-for="item in classList"
              :key="item.id"
              :label="item.commodityName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否FSMP" prop="isFsmp">
          <el-select @change="handleChangeFsmp" v-model="formData.isFsmp" placeholder="请选择">
            <el-option
              v-for="item in fsmpOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" required>
          <div v-if="formData.isFsmp == '0'">
            <el-col :span="12" class="pr10 no-margin-bottom">
              <el-form-item
                prop="goodsNameFirst"
                :rules="[
									{ required: true, message: '请输入商品名称', trigger: 'blur' }
								]"
              >
                <el-input v-model="formData.goodsNameFirst"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="pl10 no-margin-bottom">
              <el-form-item
                prop="goodsNameSecond"
                :rules="[{
									required: true, message: '请输入商品名称', trigger: 'blur'
								}]"
              >
                <el-input v-model="formData.goodsNameSecond"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div v-if="formData.isFsmp == '1' || formData.isFsmp == ''">
            <el-col :span="24" class="no-margin-bottom">
              <el-form-item
                prop="goodsNameFirst"
                :rules="[
									{ required: true, message: '请输入商品名称', trigger: 'blur' }
								]"
              >
                <el-input v-model="formData.goodsNameFirst"></el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-form-item>
        <el-form-item label="商品品牌" prop="goodsBrandId">
          <el-select v-model="formData.goodsBrandId" placeholder="请选择" clearable>
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.brandName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- 供应商 -->
        <el-form-item label="供应商" prop="goodsSupplierId" v-if="isSelecShow">
          <el-col :span="8">
            <el-select v-model="formData.goodsSupplierId" placeholder="请选择主供应商" clearable>
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.supplierName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select v-model="formData.goodsSupplierId1==0?null:formData.goodsSupplierId1" placeholder="请选择备用供应商" clearable>
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.supplierName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-select v-model="formData.goodsSupplierId2==0?null:formData.goodsSupplierId2" placeholder="请选择备用供应商" clearable>
              <el-option
                v-for="item in supplierList"
                :key="item.id"
                :label="item.supplierName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="退换货" prop="returnAndExchange">
          <el-select v-model="formData.returnAndExchange" placeholder="请选择">
            <el-option
              v-for="item in returnList"
              :key="item.dicSubval"
              :value="item.dicSubval"
              :label="item.dicSubname"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" :offset="1">
        <el-form-item label="市场售价" prop="marketPrice">
          <el-col :span="24" class="marketPrice">
            <el-input
              v-model.number="formData.marketPrice"
              v-num-digit="formData.marketPrice"
              data-dotrange="{0,2}"
            ></el-input>
            <span class="unit">元/出售单位</span>
          </el-col>
        </el-form-item>

        <el-form-item label="商品重量" prop="goodsWeight">
          <el-col :span="11">
            <el-input
              v-model.number="formData.goodsWeight"
              v-num-digit="formData.goodsWeight"
              data-dotrange="{0,2}"
            ></el-input>
          </el-col>

          <el-col :span="12" :offset="1">
            <el-select v-model="formData.goodsWeightUnit" placeholder="请选择单位">
              <el-option label="g" value="g"></el-option>
              <el-option label="kg" value="kg"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="商品体积" prop="volume">
          <el-col :span="5">
            <el-input
              v-model.number="formData.goodsCubageLength"
              v-num-digit="formData.goodsCubageLength"
            ></el-input>
          </el-col>
          <el-col :span="1" align="center">
            <i class="el-icon-close"></i>
          </el-col>
          <el-col :span="5">
            <el-input
              v-model.number="formData.goodsCubageWidth"
              v-num-digit="formData.goodsCubageWidth"
            ></el-input>
          </el-col>
          <el-col :span="1" align="center">
            <i class="el-icon-close"></i>
          </el-col>
          <el-col :span="5">
            <el-input
              v-model.number="formData.goodsCubageHeight"
              v-num-digit="formData.goodsCubageHeight"
            ></el-input>
          </el-col>
          <el-col :span="6" :offset="1">
            <el-select v-model="formData.goodsCubageUnit" placeholder="请选择单位">
              <el-option label="cm" value="cm"></el-option>
              <el-option label="dm" value="dm"></el-option>
              <el-option label="m" value="m"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="虚拟销量">
          <el-input v-model.number="formData.virtualSales" v-num-digit="formData.virtualSales"></el-input>
        </el-form-item>
        <el-form-item label="虚拟收藏量">
          <el-input
            v-model.number="formData.virtualCollection"
            v-num-digit="formData.virtualCollection"
          ></el-input>
        </el-form-item>
        <el-form-item label="运费" prop="templateId">
          <el-select v-model="formData.templateId" placeholder="请选择运费">
            <el-option
              v-for="item in freightList"
              :key="item.id"
              :label="item.templateName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="商品描述">
          <!-- <el-input type="textarea" :rows="5" v-model="formData.describe"></el-input> -->
          <wang-editor ref="editor" @input="updateContent" :value="formData.goodsDesc"></wang-editor>
        </el-form-item>
      </el-col>
      <el-col :span="24" align="center">
        <router-link to="/mall/goods/list">
          <el-button size="small">返回</el-button>
        </router-link>
        <el-button
          type="primary"
          size="small"
          class="ml20"
          @click="handleSave"
          :loading="submitLoading"
        >提交</el-button>
      </el-col>
    </el-form>
  </div>
</template>
<style lang="scss" scoped>
  .demo-form {
    margin-top: 15px;
    .marketPrice {
      position: relative;
      padding-right: 85px;
      .unit {
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -16px;
      }
    }
    .el-form-item {
      margin-right: 0;
      .el-select {
        width: 100%;
      }
    }
    .widthAuto {
      width: auto;
      margin-right: 6px;
    }
  }
  .formAdd {
    .el-form-item {
      margin-bottom: 20px;
    }
    .no-margin-bottom {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
  .pr10 {
    padding-right: 10px;
  }
  .pl10 {
    padding-left: 10px;
  }
</style>

<script>
  import WangEditor from "@/components/WangEditor";
  import { saveBasis, getGoodsBaseDetail } from "@/api/mall";
  import {
    getDicList,
    getComodityClassList,
    getComodityBrandList,
    getComodityFreightList,
    getComoditySupplierList
  } from "@/api/util";

  const freightFree = {
    id: 0,
    templateName: "包邮"
  };

  export default {
    components: { WangEditor },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      baseId: {
        default: ""
      }
    },
    data() {
      return {
        // 商品基本信息
        formData: {
          goodsCategoryId: "", // 商品分类
          isFsmp: "", // 是否FSMP
          goodsName: "", // 商品名称
          goodsNameSecond: "", // 商品名称1
          goodsBrandId: "", // 商品品牌ID
          goodsSupplierId: null, // 供应商ID
          goodsSupplierId1: null, // 备用供应商ID1
          goodsSupplierId2: null, // 备用供应商ID2
          returnAndExchange: "", // 退换货
          marketPrice: "", // 市场售价
          goodsWeight: "", // 商品重量
          goodsWeightUnit: "", // 商品重量单位
          goodsCubageLength: "", // 商品体积 长
          goodsCubageWidth: "", // 商品体积 宽
          goodsCubageHeight: "", // 商品体积 高
          goodsCubageUnit: "", // 商品体积 单位
          virtualSales: "", // 虚拟销量
          virtualCollection: "", // 虚拟收藏量
          templateId: "", // 运费规则
          goodsDesc: "", // 商品描述
          dataRemoveType: 0
        },
        rules: {
          goodsCategoryId: [
            { required: true, message: "请选择商品分类", trigger: "change" }
          ],
          isFsmp: [
            { required: true, message: "请选择是否FSMP", trigger: "change" }
          ],
          // goodsName: [
          // 	{ required: true, message: '请输入商品名称', trigger: 'blur' }
          // ],
          returnAndExchange: [
            { required: true, message: "请选择退换货", trigger: "change" }
          ],
          templateId: [
            { required: true, message: "请选择运费", trigger: "change" }
          ],
          // 供应商
          goodsSupplierId: [
            { required: true, message: "请选择供应商", trigger: "change" }
          ]
        },
        showFsmp: true,
        showNotFsmp: false,
        fsmpOptions: [
          {
            value: "0",
            label: "是"
          },
          {
            value: "1",
            label: "否"
          }
        ],
        value: "",
        selVal: "",
        classList: [],
        brandList: [],
        freightList: [],
        returnList: [],
        supplierList: [],
        submitLoading: false,
        //显示/隐藏供应商下拉框
        isSelecShow: false
      };
    },
    created() {
      this.getSelectList();
      if (this.isEdit) {
        let id = this.$route.params && this.$route.params.id;
        this.getDetail(id);
      }
      const supplierId = localStorage.getItem("supplierId");
      if (supplierId === "") {
        this.isSelecShow = true;
      } else {
        this.isSelecShow = false;
        this.formData.goodsSupplierId = supplierId;
      }
    },
    mounted () {
      
    },
    methods: {
      getDetail(id) {
        getGoodsBaseDetail(id).then(res => {
          console.log(res)
          this.formData = res.data;
          //本地存储数据
          // localStorage.setItem('isFsmp', res.data.isFsmp)
          // 第一个参数为,父组件提前定义好的函数,第二个为要想父组件传递的参数
           this.$emit('isFsmpStatus', res.data.isFsmp)
          console.log(res.data.isFsmp,'传递编辑状态')
          if (this.formData.goodsBrandId == 0) {
            this.formData.goodsBrandId = "";
          }
          if (this.formData.goodsSupplierId == 0) {
            this.formData.goodsSupplierId = "";
          }
          this.$refs.editor.setEditorContent(this.formData.goodsDesc);
        });
      },
      getSelectList() {
        getComodityClassList().then(res => {
          const resData = res.data;
          if (resData.code == "10001") {
            this.classList = resData.data;
          }
        });
        getComodityBrandList().then(res => {
          const resData = res.data;
          if (resData.code == "10001") {
            this.brandList = resData.data;
          }
        });
        getComodityFreightList().then(res => {
          const resData = res.data;
          if (resData.code == "10001") {
            let freightData = resData.data;
            freightData.unshift(freightFree);
            this.freightList = freightData;
          }
        });
        getDicList("D012").then(res => {
          this.returnList = res.data;
        });
        getComoditySupplierList().then(res => {
          const resData = res.data;
          if (resData.code == "10001") {
            this.supplierList = resData.data.list;
               console.log(this.supplierList)

          }
        });
      },
      isFsmp(selVal) {
        this.selVal = selVal;
        if (this.selVal == "是") {
          this.showFsmp = true;
          this.showNotFsmp = false;
        } else {
          this.showFsmp = false;
          this.showNotFsmp = true;
        }
      },
      handleChangeFsmp(val) {
        // console.log(val,'baseInfo中的状态')
        // 第一个参数为,父组件提前定义好的函数,第二个为要想父组件传递的参数
         this.$emit('handleFsmpStatus', val)
         let isFsmps=''
         if(val){
           if(val==1){
             isFsmps='否'
           }else{
             isFsmps='是'
           }
         }
         this.$emit('isFsmps', isFsmps)
        //本地存储Fsmp状态
        localStorage.setItem('FsmpStatus',val)
        if (!this.isEdit && val == "0") {
          for (let item of this.returnList) {
            if (item.dicSubname == "不支持退换货") {
              this.formData.returnAndExchange = item.dicSubval;
              break;
            }
          }
        } else if (!this.isEdit && val == "1") {
          this.formData.returnAndExchange = "";
        }
      },
      updateContent(val) {
        this.formData.goodsDesc = val;
      },
      validForm() {
        let valid = false;
        return valid;
      },
      // 保存商品基本信息
      handleSave() {
        this.$refs["formAdd"].validate(valid => {
          if (valid) {
            this.submitLoading = true;
            if (this.formData.isFsmp == '1') {
            this.formData.goodsNameSecond=''     
            }
            // 发起保存商品基本信息请求
            saveBasis(this.formData)
              .then(res => {
                console.log(res);
                // 获取成功的状态码
                const { status } = res;
                const { id } = res.data.data;
                // console.log(id);
                //本地存储数据
                localStorage.setItem("goodsid", id);
                const resData = res.data;
                // if (resData.flag == 'success') {
                // ruanjiafeng 修改
                if (status == 200) {
                  if (!this.formData.id) {
                    this.$emit("update:baseId", resData.data.id);
                    this.$message.success("保存成功，可操作其他内容");
                  } else {
                    this.$message.success("保存成功");
                  }
                  this.formData.id = resData.data.id;
                } else {
                  this.$message.error(resData.msg);
                }
                this.submitLoading = false;
              })
              .catch(err => {
                this.submitLoading = false;
              });
          }
        });
      }
    }
  };
</script>
