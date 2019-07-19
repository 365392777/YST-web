/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * 
 */

let baseUrl = process.env.NODE_ENV === 'development' ? '/apis' : process.env.BASE_API
let goodsImageUrl = `${baseUrl}/imageRelationOperate/getOneGoodsImageOnApp?id=`
let adImageUrl = `${baseUrl}/imageRelationOperate/getOneCommomImage?id=`
let feedBackImageUrl = `${baseUrl}/imageRelationOperate/getOneFeedBackImage?id=`
let doctorImageUrl = `${baseUrl}/imageRelationOperate/getDocOneImage?id=`
let customerImageUrl = `${baseUrl}/imageRelationOperate/getCommomImage?id=`

export {
    baseUrl,
    goodsImageUrl,
    adImageUrl,
    feedBackImageUrl,
    doctorImageUrl,
    customerImageUrl,
}
