<template>
    <div class="page-container">
        <role :is-edit="true" />
    </div>
</template>

<script>
import Role from './components/role'

export default {
    components: { Role }
}
</script>