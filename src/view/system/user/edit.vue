<template>
    <div class="page-container">
        <user :is-edit="true" />
    </div>
</template>

<script>
import User from './components/user'

export default {
    components: { User }
}
</script>