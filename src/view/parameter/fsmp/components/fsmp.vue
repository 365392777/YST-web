<template>
    <div class="fsmp-container">
        <el-breadcrumb
            separator-class="el-icon-arrow-right"
            class="page-breadcrumb"
        >
            <el-breadcrumb-item 
                class="bold" 
                :to="{ path: '/parameter/fsmp/list' }"
            >特医食品信息管理</el-breadcrumb-item>
            <el-breadcrumb-item>{{breadcrumbMap[isEdit]}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form 
            ref="dataForm"
            :model="formData"
            :rules="rules"
            label-width="140px"
            class="demo-form"
            size="small"
            @submit.native.prevent
        >
            <el-row>
                <el-col :span="11">
                    <el-form-item label="特医食品名称" prop="name" :error="nameError">
                        <el-input v-model.trim="formData.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" :offset="2">
                    <el-form-item label="特医食品所属分类" prop="brand">
                        <el-input v-model.trim="formData.brand"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="国食注字" prop="note">
                        <el-input v-model.trim="formData.note"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="详细信息">
                        <wang-editor ref="editor" @input="updateContent" :value="formData.content"></wang-editor>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item>
                <router-link to="/parameter/fsmp/list">
                    <el-button>返回</el-button>
                </router-link>
                <el-button :loading="submitLoading" type="primary" class="ml20" @click="handleSave">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import WangEditor from '@/components/WangEditor'
import { getFsmpDetail, saveFsmp } from '@/api/parameter'

export default {
    components: { WangEditor },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            formData: {
                name: '',
                brand: '',
                note: '',
                content: '',
                dataRemoveType: 0,
            },
            breadcrumbMap: {
                false: '新增特医食品信息',
                true: '编辑特医食品信息',
            },
            rules: {
                name: [{required: true, message: '特医食品名称不能为空', trigger: 'change'}],
                brand: [{required: true, message: '特医食品所属分类不能为空', trigger: 'change'}],
                note: [{required: true, message: '国食注字不能为空', trigger: 'change'}],
            },
            submitLoading: false,
            nameError: '',
        }
    },
    created() {
        if (this.isEdit) {
            let id = this.$route.params && this.$route.params.id
            this.getDetail(id)
        }
    },
    methods: {
        getDetail(id) {
            getFsmpDetail(id).then(res => {
                // this.formData = res.data
                const data = res.data
                this.formData.id = id,
                this.formData.name = data.name,
                this.formData.brand = data.brand,
                this.formData.note = data.note,
                this.formData.content = data.content,
                this.$refs.editor.setEditorContent(this.formData.content)
            })
        },
        updateContent(val) {
            this.formData.content = val
        },
        handleSave() {
            this.$refs['dataForm'].validate(valid => {
                if (valid) {
                    this.submitLoading = true
                    this.nameError = ''
                    saveFsmp(this.formData).then(res => {
                        const data = res.data
                        if (data.code == '10001') {
                            let message = this.isEdit ? '修改成功' : '添加成功'
                            this.$router.replace({path: '/parameter/fsmp/list'})
                        } else {
                            this.nameError = data.error
                        }
                        this.submitLoading = false
                    }).catch(() => {
                        this.$message({
                            message: '提交失败',
                            type: 'error'
                        })
                        this.submitLoading = false
                    })
                }
            })
        }
    }
}
</script>
