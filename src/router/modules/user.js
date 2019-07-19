import Layout from '@/view/layout/Layout'

const userRouter = {
    path: '/user',
    component: Layout,
    redirect: '/user/doctor/list',
    name: 'UserManage',
    children: [
        {
            path: 'doctor',
            component: () => import('@/view/user/doctor/index'),
            redirect: '/user/doctor/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/user/doctor/list'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('@/view/user/doctor/detail'),
                },
                {
                    path: 'add',
                    component: () => import('@/view/user/doctor/add'),
                },
                {
                    path: 'consult/:id',
                    component: () => import('@/view/user/doctor/consult'),
                },
            ]
        },
        {
            path: 'patient',
            component: () => import('@/view/user/patient/index'),
            redirect: '/user/patient/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/user/patient/list'),
                },
                {
                    path: 'detail/:id',
                    component: () => import('@/view/user/patient/detail'),
                },
            ]
        }
    ]
}

export default userRouter
