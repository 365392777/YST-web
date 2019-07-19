import {
    getStore,
    setStore,
    removeStore
} from '@/utils'
import {
    loginByUserid,
    getCurrentUserInfo,
    loginOut
} from '@/api/login'
import { getMenus } from '@/api/util'

// initial state
const state = {
    user: null,
    token: getStore('token'),
    menus: getStore('menus', true) ? getStore('menus', true) : [],
}

const actions = {
    loginUser({
        commit
    }, userInfo) {
        const userid = userInfo.userLoginid.trim()
        return new Promise((resolve, reject) => {
            loginByUserid(userid, userInfo.userLoginpassword).then(res => {
                const data = res.data
                if (data.success == 'true') {
                    commit('SET_TOKEN', data.data.token)
                    setStore('token', data.data.token)
                }
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },
    getUserInfo({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            getCurrentUserInfo().then(res => {
                if (!res.data) {
                    reject('error')
                }
                const data = res.data
                commit('SET_USER', data)
                resolve(res)
            }).catch(err => {
                reject(err)
            })
        })
    },
    logOut({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            loginOut().then(res => {
                resolve()
                // commit('SET_USER', null)
                commit('SET_TOKEN', '')
                removeStore('token')
            }).catch(err => {
                reject(err)
                // commit('SET_USER', null)
                commit('SET_TOKEN', '')
                removeStore('token')
            })
        })
    },
    getMenusList({
        commit,
        state
    }) {
        return new Promise((resolve, reject) => {
            getMenus().then(res => {
                const resData = res.data
                commit('SET_MENUS', resData.list)
                resolve(resData)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

const mutations = {
    SET_TOKEN(state, token) {
        state.token = token
    },
    SET_USER(state, user) {
        state.user = user
    },
    SET_MENUS(state, menus) {
        state.menus = menus
        setStore('menus', state.menus)
    }
}

const user = {
    namespaced: true,
    state,
    actions,
    mutations,
}

export default user
