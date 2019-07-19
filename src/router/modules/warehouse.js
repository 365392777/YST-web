import Layout from '@/view/layout/Layout'

const warehouseRouter = {
    path: '/warehouse',
    component: Layout,
    redirect: '/warehouse/operate/list',
    name: 'warehouseManage',
    children: [
        {
            path: 'operate',
            component: () => import('@/view/warehouse/operate/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/warehouse/operate/list'),
                },
                {
                    path: 'history',
                    component: () => import('@/view/warehouse/operate/history'),
                },
            ]
        },
        {
            path: 'check',
            component: () => import('@/view/warehouse/check/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/warehouse/check/list'),
                },
                {
                    path: 'history',
                    component: () => import('@/view/warehouse/check/history'),
                },
            ]
        }
    ]
}

export default warehouseRouter
