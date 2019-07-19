import Layout from '@/view/layout/Layout'

const integralRouter = {
    path: '/integral',
    component: Layout,
    redirect: '/integral/commodity/list',
    name: 'IntegralMall',
    children: [
        {
            path: 'commodity',
            component: () => import('@/view/integral/commodity/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/integral/commodity/list')
                },
            ]
        },
        {
            path: 'lottery-set',
            component: () => import('@/view/integral/lottery-set/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/integral/lottery-set/list')
                },
                {
                    path: 'add',
                    component: () => import('@/view/integral/lottery-set/add')
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/integral/lottery-set/edit')
                },
            ]
        },
        {
            path: 'lottery-record',
            component: () => import('@/view/integral/lottery-record/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/integral/lottery-record/list')
                },
            ]
        },
        {
            path: 'exchange-record',
            component: () => import('@/view/integral/exchange-record/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/integral/exchange-record/list')
                },
            ]
        },
    ]
}

export default integralRouter
