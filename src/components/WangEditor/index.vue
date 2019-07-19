<template>
    <div ref="editor" class="editor-content"></div>
</template>

<script>
import E from 'wangeditor'

export default {
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            editor: null
        }
    },
    mounted() {
        this.editor = new E(this.$refs.editor)
        this.editor.customConfig.uploadImgShowBase64 = true
        this.editor.customConfig.menus = [
            'head',  // 标题
            'bold',  // 粗体
            // 'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            // 'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            // 'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            // 'video',  // 插入视频
            'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ]
        this.editor.customConfig.onchange = (html) => {
            this.$emit('input', html)
        }
        this.editor.customConfig.zIndex = 100
        this.editor.create()
        this.editor.txt.html(this.value)
    },
    methods: {
        getEditorContent() {
            return this.editor.txt.html()
        },
        setEditorContent(val) {
            this.editor.txt.html(val)
        }
    },
}
</script>

<style lang="scss" scoped>
.editor-content /deep/ {
    ul {
        list-style-type: disc;
    }
    ol {
        list-style-type: decimal;
    }
}
</style>
