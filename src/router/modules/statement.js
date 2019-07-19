import Layout from '@/view/layout/Layout'

const statementRouter = {
    path: '/statement',
    component: Layout,
    redirect: '/statement/doctor-sales/list',
    name: 'Statement',
    children: [
        {
            path: 'doctor-sales',
            component: () => import('@/view/statement/doctor-sales/index'),
            redirect: '/statement/doctor-sales/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/statement/doctor-sales/list'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('@/view/statement/doctor-sales/detail'),
                },
            ]
        },
        {
            path: 'doctor-consult',
            component: () => import('@/view/statement/doctor-consult/index'),
            redirect: '/statement/doctor-consult/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/statement/doctor-consult/list'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('@/view/statement/doctor-consult/detail'),
                },
            ]
        },
        {
            path: 'commodity-sales',
            component: () => import('@/view/statement/commodity-sales/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/statement/commodity-sales/list')
                }
            ]
        }
    ]
}

export default statementRouter
