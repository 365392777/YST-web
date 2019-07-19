import router from './router'
import store from './store'
import { getStore } from './utils'

function hasPermission(roles, permissionRoles) {

}

const whiteList = ['/login', '/pass-find']

router.beforeEach((to, from, next) => {
    if (getStore('token')) {
        if (to.path == '/login') {
            next({ path : '/' })
        } else {
            if (!store.state.user.user) {
                store.dispatch('user/getMenusList')
                store.dispatch('user/getUserInfo').then(res => {
                    next({ ...to, replace: true })
                }).catch(err => {
                    store.dispatch('user/logOut').then(() => {
                        next({ path: '/' })
                    }).catch(() => {
                        next({ path: '/' })
                    })
                })
            } else {
                // if (to.matched.length == 0) {
                //     from.name ? next({name: from.name}) : next({path: 'error/404'})
                // } else {
                //     next()
                // }
                next()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) != -1) {
            next()
        } else {
            next(`/login?redirect=${to.path}`)
        }
    }
})
