<template>
    <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
            :show-timeout="200"
            mode="vertical"
            :default-active="routePath"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
        >
            <sidebar-item v-for="menu in menus" :key="menu.menuId" :item="menu"></sidebar-item>
        </el-menu>
    </el-scrollbar>
</template>

<script>
import { mapState } from 'vuex'
import { getMenus } from '@/api/util'
import { asideMenus } from '@/utils/menu-dev'
import SidebarItem from './SidebarItem'

export default {
    data() {
        return {
            menus: []
        }
    },
    components: { SidebarItem },
    created() {
        this.menus = asideMenus
        // this.menus = this.userMenus
    },
    computed: {
        ...mapState({
            userMenus: state => state.user.menus
        }),
        routePath() {
            let route = this.$route.path
            if (route.match(/\//g).length > 1 && route.indexOf('/list') == -1) {
                let splitArr = this.$route.path.split('/')
                splitArr.splice(3)
                route = splitArr.join('/') + '/list'
            }
            return route
        }
    }
}
</script>
