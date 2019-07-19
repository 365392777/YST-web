<template>
    <div class="page-container">
        <rule-template :is-edit="true"></rule-template>
    </div>
</template>

<script>
import ruleTemplate from './components/ruleTemplate'

export default {
    components: { ruleTemplate }
}
</script>
