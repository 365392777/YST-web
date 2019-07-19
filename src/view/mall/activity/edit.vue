<template>
    <div class="page-container">
        <activity :is-edit="true" />
    </div>
</template>

<script>
import Activity from './components/activity'

export default {
    components: { Activity }
}
</script>