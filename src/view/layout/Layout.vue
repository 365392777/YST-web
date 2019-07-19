<template>
    <div class="page-wrapper">
        <sidebar class="sidebar-container" />
        <div class="main-container">
            <navbar />
            <page-main />
        </div>
    </div>
</template>

<script>
import { Sidebar, Navbar, PageMain } from './components'
export default {
    name: 'Layout',
    components: {
        Sidebar,
        Navbar,
        PageMain,
    }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>
