
import Layout from '@/view/layout/Layout'

const popularScienceRouter = {
    path: '/popular-science',
    component: Layout,
    redirect: '/popular-science/article/list',
    name: 'PopularScienceManage',
    children: [
        {
            path: 'article',
            component: () => import('@/view/popular-science/article/index'),
            redirect: '/popular-science/article/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/popular-science/article/list'),
                },
                {
                    path: 'add',
                    component: () => import('@/view/popular-science/article/add')
                },
                {
                    path: 'edit/:id',
                    component: () => import('@/view/popular-science/article/edit')
                },
            ]
        },
        {
            path: 'comment',
            component: () => import('@/view/popular-science/comment/index'),
            redirect: '/popular-science/comment/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/popular-science/comment/list'),
                },
            ]
        },
        {
            path: 'category',
            component: () => import('@/view/popular-science/category/index'),
            redirect: '/popular-science/category/list',
            children: [
                {
                    path: 'list',
                    component: () => import('@/view/popular-science/category/list'),
                },
            ]
        },
    ]
}

export default popularScienceRouter
