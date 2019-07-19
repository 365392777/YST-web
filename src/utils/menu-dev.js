/**
 * @date 2019/03/05
 * @author guweimo
 */

// 侧栏导航
export const asideMenus = [
    {
        menuId: "133",
        menuName: "首页",
        menuUrl: '/home',
    },
    {
        menuId: "58568436265",
        menuName: "商城管理",
        menuUrl: '/mall',
        childMenus: [
            {
                menuId: "432542432624363",
                menuName: "订单管理",
                menuUrl: '/mall/order/list',
            },
            {
                menuId: "23524342562451",
                menuName: "商品管理",
                menuUrl: '/mall/goods/list',
            },
            {
                menuId: "2352434254362451",
                menuName: "优惠券管理",
                menuUrl: '/mall/coupons/list',
            },
            {
                menuId: "235262451",
                menuName: "活动管理",
                menuUrl: '/mall/activity/list',
            },
            {
                menuId: "5473644543",
                menuName: "商品评论",
                menuUrl: '/mall/goods-comment/list',
            },
        ]
    },
    {
        menuId: "2038",
        menuName: "积分商城",
        menuUrl: '/integral',
        childMenus: [
            {
                menuId: "203801",
                menuName: "积分商品",
                menuUrl: '/integral/commodity/list',
            },
            {
                menuId: "203802",
                menuName: "抽奖设置",
                menuUrl: '/integral/lottery-set/list',
            },
            {
                menuId: "203803",
                menuName: "抽奖记录",
                menuUrl: '/integral/lottery-record/list',
            },
            {
                menuId: "203804",
                menuName: "兑换列表",
                menuUrl: '/integral/exchange-record/list',
            },
        ]
    },
    {
        menuId: "32514352",
        menuName: "仓库管理",
        menuUrl: '/warehouse',
        childMenus: [
            {
                menuId: "43154161",
                menuName: "出入库",
                menuUrl: '/warehouse/operate/list',
            },
            {
                menuId: "536537437",
                menuName: "库存盘点",
                menuUrl: '/warehouse/check/list',
            },
        ]
    },
    {
        menuId: "2058",
        menuName: "科普管理",
        menuUrl: '/popular-science',
        childMenus: [
            {
                menuId: "205801",
                menuName: "文章管理",
                menuUrl: '/popular-science/article/list',
            },
            {
                menuId: "205802",
                menuName: "评论管理",
                menuUrl: '/popular-science/comment/list',
            },
            {
                menuId: "205803",
                menuName: "分类目录",
                menuUrl: '/popular-science/category/list',
            },
        ]
    },
    {
        menuId: "585685",
        menuName: "用户管理",
        menuUrl: '/user',
        childMenus: [
            {
                menuId: "531531",
                menuName: "医生用户",
                menuUrl: '/user/doctor/list',
            },
            {
                menuId: "23524351",
                menuName: "患者用户",
                menuUrl: '/user/patient/list',
            },
        ]
    },
    {
        menuId: "124215",
        menuName: "报表管理",
        menuUrl: '/statement',
        childMenus: [
            {
                menuId: "2142141",
                menuName: "医生销售报表",
                menuUrl: '/statement/doctor-sales/list',
            },
            {
                menuId: "5436161",
                menuName: "医生咨询报表",
                menuUrl: '/statement/doctor-consult/list',
            },
            {
                menuId: "1531541",
                menuName: "商品销售报表",
                menuUrl: '/statement/commodity-sales/list',
            },
        ]
    },
    {
        menuId: "1222",
        menuName: "参数管理",
        menuUrl: '/parameter',
        childMenus: [
            {
                menuId: "123131",
                menuName: "医院管理",
                menuUrl: '/parameter/hospital/list',
            },
            {
                menuId: "1515312",
                menuName: "特医食品信息管理",
                menuUrl: '/parameter/fsmp/list',
            },
            {
                menuId: "141515151",
                menuName: "敏感词管理",
                menuUrl: '/parameter/sensitive/list',
            },
            {
                menuId: "313212412",
                menuName: "仓库库位管理",
                menuUrl: '/parameter/storage/list',
            },
            {
                menuId: "3132124123",
                menuName: "其他参数",
                menuUrl: '/parameter/other/list',
            },
            {
                menuId: "123212",
                menuName: "客服信息管理",
                menuUrl: '/parameter/customer-service/list',
            },
            {
                menuId: "3132124125",
                menuName: "广告管理",
                menuUrl: '/parameter/advertising/list',
            },
            {
                menuId: "3132124512",
                menuName: "商城图标",
                menuUrl: '/parameter/mall-icon/list',
            },
            {
                menuId: "31321241212",
                menuName: "意见反馈",
                menuUrl: '/parameter/feedback/list',
            },
            {
                menuId: "313212441212",
                menuName: "商品参数管理",
                menuUrl: '/parameter/commodity/list',
            },
        ]
    },
    {
        menuId: "12252",
        menuName: "系统管理",
        menuUrl: '/system',
        childMenus: [
            {
                menuId: "3333",
                menuName: "后台用户管理",
                menuUrl: '/system/user/list',
            },
            {
                menuId: "3131",
                menuName: "后台用户角色管理",
                menuUrl: '/system/role/list',
            },
            {
                menuId: "31321",
                menuName: "信息配置",
                menuUrl: '/system/info',
            },
            {
                menuId: "313212",
                menuName: "操作日志",
                menuUrl: '/system/log',
            },
        ]
    },
]
