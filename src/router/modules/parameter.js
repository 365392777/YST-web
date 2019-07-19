import Layout from '@/view/layout/Layout'

const parameterRouter = {
    path: '/parameter',
    component: Layout,
    redirect: '/parameter/hospital',
    name: 'Parameter',
    children: [
        {
            path: 'hospital',
            component: () => import('@/view/parameter/hospital/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/parameter/hospital/list')
                }
            ]
        },
        {
            path: 'fsmp',
            component: () => import('@/view/parameter/fsmp/index'),
            redirect: '/parameter/fsmp/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/parameter/fsmp/list')
                },
                {
                    path: 'add',
                    component: () => import('@/view/parameter/fsmp/add')
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/parameter/fsmp/edit')
                },
            ]
        },
        {
            path: 'sensitive',
            component: () => import('@/view/parameter/sensitive/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/parameter/sensitive/list')
                }
            ]
        },
        {
            path: 'storage',
            component: () => import('@/view/parameter/storage/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/parameter/storage/list')
                }
            ]
        },
        {
            path: 'customer-service',
            component: () => import('@/view/parameter/customer-service/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/parameter/customer-service/list')
                }
            ]
        },
        {
            path: 'other',
            component: () => import('@/view/parameter/other/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/parameter/other/list')
                }
            ]
        },
        {
            path: 'advertising',
            component: () => import('@/view/parameter/advertising/index'),
            redirect: '/parameter/advertising/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/parameter/advertising/list')
                },
                {
                    path: 'add',
                    component: () => import('@/view/parameter/advertising/add')
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/parameter/advertising/edit')
                },
                {
                    path: 'detail/:id',
                    component: () => import('@/view/parameter/advertising/detail')
                },
            ]
        },
        {
            path: 'mall-icon',
            component: () => import('@/view/parameter/mall-icon/index'),
            redirect: '/parameter/mall-icon/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/parameter/mall-icon/list')
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/parameter/mall-icon/edit')
                },
            ]
        },
        {
            path: 'feedback',
            component: () => import('@/view/parameter/feedback/index'),
            redirect: '/parameter/feedback/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/parameter/feedback/list')
                },
                {
                    path: 'detail/:id',
                    component: () => import('@/view/parameter/feedback/detail')
                },
                {
                    path: 'follow-up/:id',
                    component: () => import('@/view/parameter/feedback/follow-up')
                },
            ]
        },
        {
            path: 'commodity',
            component: () => import('@/view/parameter/commodity/index'),
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/parameter/commodity/list')
                },
                {
                    path: 'add',
                    component: () => import('@/view/parameter/commodity/add')
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/parameter/commodity/edit')
                }
            ]
        },
    ]
}

export default parameterRouter
