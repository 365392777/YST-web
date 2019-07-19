<template>
    <section class="page-main">
        <transition name="fade-transform" mode="out-in">
            <!-- <keep-alive > -->
                <!-- <router-view :key="key" /> -->
            <!-- </keep-alive> -->
            <router-view />
        </transition>
    </section>
</template>

<script>
export default {
    name: 'PageMain',
    computed: {
        cachedViews() {
            return this.$store.state.tagsView.cachedViews
        },
        key() {
            return this.$route.fullPath
        }
    }
}
</script>

<style lang="scss" scoped>
.page-main {
    min-height: calc(100vh - 50px);
    width: 100%;
    position: relative;
    overflow: hidden;
}
</style>

