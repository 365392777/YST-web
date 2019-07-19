<template>
    <div class="page-container">
        <article-template :is-edit="true"></article-template>
    </div>
</template>

<script>
import ArticleTemplate from './components/ArticleTemplate'

export default {
    components: {
        ArticleTemplate
    }
}
</script>
