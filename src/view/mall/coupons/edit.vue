<template>
    <div class="page-container">
        <coupon :is-edit="true" />
    </div>
</template>

<script>
import Coupon from './components/coupon'

export default {
    components: { Coupon }
}
</script>