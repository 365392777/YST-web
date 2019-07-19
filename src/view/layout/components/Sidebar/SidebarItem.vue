<template>
    <div class="menu-wrapper">
        <template v-if="!item.childMenus || item.childMenus.length == 0">
            <app-link :to="item.menuUrl" :key="item.name">
                <el-menu-item :index="item.menuUrl">
                    <item :title="item.menuName" />
                </el-menu-item>
            </app-link>
        </template>
        <el-submenu v-else ref="submenu" :index="item.menuUrl">
            <template slot="title">
                <item :title="item.menuName" />
            </template>

            <template v-for="child in item.childMenus">
                <sidebar-item
                    v-if="child.childMenus&&child.childMenus.length>0"
                    :is-nest="true"
                    :item="child"
                    :key="child.menuUrl"
                    :base-path="child.menuUrl"
                    class="nest-menu" />

                <app-link v-else :to="child.menuUrl" :key="child.name">
                    <el-menu-item :index="child.menuUrl">
                        <item :title="child.menuName" />
                    </el-menu-item>
                </app-link>
            </template>
        </el-submenu>
    </div>
</template>

<script>
import Item from './Item'
import AppLink from './Link'

export default {
    name: 'SidebarItem',
    components: { Item, AppLink },
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    methods: {
        hasChild(childMenus, parent) {

        }
    }
}
</script>

