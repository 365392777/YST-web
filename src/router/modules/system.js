import Layout from '@/view/layout/Layout'

const systemRouter = {
    path: '/system',
    component: Layout,
    redirect: '/system/user/list',
    name: 'System',
    children: [
        {
            path: 'user',
            component: () => import('@/view/system/user/index'),
            redirect: '/system/user/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/system/user/list'),
                },
                {
                    path: 'add',
                    component: () => import('@/view/system/user/add'),
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/system/user/edit'),
                },
            ]
        },
        {
            path: 'role',
            component: () => import('@/view/system/role/index'),
            redirect: '/system/role/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/system/role/list.vue'),
                },
                {
                    path: 'add',
                    component: () => import('@/view/system/role/add.vue'),
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/system/role/edit.vue'),
                },
            ],
        },
        {
            path: 'info',
            component: () => import('@/view/system/info/index.vue'),
            redirect: '/system/info/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/system/info/list.vue'),
                },
                {
                    path: 'edit',
                    component: () => import('@/view/system/info/edit.vue'),
                }
            ],
        },
        {
            path: 'log',
            component: () => import('@/view/system/log/index.vue'),
            redirect: '/system/log/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/system/log/list.vue'),
                },
                {
                    path: 'add',
                    component: () => import('@/view/system/role/add')
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/system/role/edit')
                }
            ]
        }
    ]
}

export default systemRouter
