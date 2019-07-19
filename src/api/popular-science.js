import request from '@/utils/request'

// 获取文章列表
export function getArticleList(data) {
    return request({
        url: '/article/findArticles',
        method: 'post',
        data,
    })
}

// 添加文章
export function addArticle(data) {
    return request({
        url: '/article/addArticle',
        method: 'post',
        data,
    })
}

// 获取文章详情
export function getArticleDetail(id) {
    return request({
        url: '/article/queryArticleById',
        method: 'post',
        data: {
            id
        }
    })
}

// 更新文章
export function updateArticle(data){
    return request({
        url: '/article/updateArticle',
        method: 'post',
        data,
    })
}

// 推荐文章 （recommend：0不推荐，1推荐）
export function udpateRecommend(id, recommend) {
    return request({
        url: '/article/updateArticleRecommend',
        method: 'post',
        data: {
            id,
            recommend
        }
    })
}

// 修改文章的状态
export function updateArtStatus(idList, status) {
    return request({
        url: '/article/updateArtStatus',
        method: 'post',
        data: {
            idList,
            status,
        },
    })
}

// 获取评论列表
export function getCommentList(data) {
    return request({
        url: '/article/findArtComments',
        method: 'post',
        data,
    })
}

// 是否展示评论
export function enableComment(id, status) {
    return request({
        url: '/article/showArtComment',
        method: 'post',
        data: {
            id,
            status
        },
    })
}

// 删除评论
export function deleteComment(idList) {
    return request({
        url: '/article/delArtComments',
        method: 'post',
        data: {
            idList
        },
    })
}

// 获取分类列表
export function getCategoryList(data) {
    return request({
        url: '/article/findArtCategories',
        method: 'post',
        data,
    })
}

// 添加分类
export function createCategory(data) {
    return request({
        url: '/article/createArtCategory',
        method: 'post',
        data,
    })
}

// 更新分类
export function updateCategory(data) {
    return request({
        url: '/article/updateArtCategory',
        method: 'post',
        data,
    })
}

// 删除分类
export function deleteCategory(idList) {
    return request({
        url: '/article/delArtCategory',
        method: 'post',
        data: {
            idList
        },
    })
}
