<template>
    <div class="page-container">
        <advertising :is-edit="true"></advertising>
    </div>
</template>

<script>
import Advertising from './components/advertising'

export default {
    components: { Advertising }
}
</script>

