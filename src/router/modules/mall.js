import Layout from '@/view/layout/Layout'

const mallRouter = {
    path: '/mall',
    component: Layout,
    redirect: '/mall/order/list',
    name: 'MallManage',
    children: [
        {
            path: 'order',
            component: () => import('@/view/mall/order/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/mall/order/list'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('@/view/mall/order/detail'),
                },
            ]
        },
        {
            path: 'goods',
            component: () => import('@/view/mall/goods/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/mall/goods/list'),
                },
                {
                    path: 'add',
                    component: () => import('@/view/mall/goods/add'),
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/mall/goods/edit'),
                },
            ]
        },
        {
            path: 'coupons',
            component: () => import('@/view/mall/coupons/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/mall/coupons/list'),
                },
                {
                    path: 'add',
                    component: () => import('@/view/mall/coupons/add'),
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/mall/coupons/edit'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('@/view/mall/coupons/detail'),
                },
            ]
        },
        {
            path: 'activity',
            component: () => import('@/view/mall/activity/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/mall/activity/list'),
                },
                {
                    path: 'add',
                    component: () => import('@/view/mall/activity/add'),
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/mall/activity/edit'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('@/view/mall/activity/detail'),
                },
            ]
        },
        {
            path: 'goods-comment',
            component: () => import('@/view/mall/goods-comment/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/mall/goods-comment/list'),
                },
            ]
        }
    ]
}

export default mallRouter
