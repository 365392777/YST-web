<template>
    <div class="page-container">
        <lottery-set :is-edit="true"></lottery-set>
    </div>
</template>

<script>
import LotterySet from './components/LotterySet'

export default {
    components: { LotterySet }
}
</script>
