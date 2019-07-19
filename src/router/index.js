import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/view/layout/Layout'

import mallRouter from './modules/mall'
import warehouseRouter from './modules/warehouse'
import userRouter from './modules/user'
import statementRouter from './modules/statement'
import parameterRouter from './modules/parameter'
import systemRouter from './modules/system'
import integralRouter from './modules/integral'
import popularScienceRouter from './modules/popular-science'

const routerMap = [
    {
        path: '/login',
        component: () => import('@/view/login/index')
    },
    {
        path: '/pass-find',
        component: () => import('@/view/login/pass_find')
    },
    {
        path: '',
        component: Layout,
        redirect: 'home',
        children: [
            {
                path: 'home',
                component: () => import('@/view/home/index')
            }
        ]
    },
    {
        path: '/error',
        component: Layout,
        redirect: 'noredirect',
        name: 'ErrorPages',
        children: [
            {
                path: '401',
                component: () => import('@/view/errorPage/401')
            },
            {
                path: '404',
                component: () => import('@/view/errorPage/404')
            }
        ]
    },
    mallRouter,
    integralRouter,
    warehouseRouter,
    popularScienceRouter,
    userRouter,
    statementRouter,
    parameterRouter,
    systemRouter,
]

const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: routerMap,
})

export default router
