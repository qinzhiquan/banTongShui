import ajax from './ajax'

// 1. 基础路径
const BASE_URL = '/api';  // 防跨域
// const BASE_URL = 'http://localhost:3000';  // 服务器真实地址

// 2. 请求方法

// 请求首页的轮播图
export const getHomeCasual = () => ajax(BASE_URL + '/api/homecasual');

// 请求首页的分类数
export const getCategory = () => ajax(BASE_URL + '/api/category');

// 请求首页的商品数据
export const getHomeShopList = () => ajax(BASE_URL + '/api/homeshoplist');

// 请求推荐的商品数据
export const getRecommendShopList = (params) => ajax(BASE_URL + '/api/recommendshoplist', params);

// 请求所有商品
export const getAllgoods = () => ajax(BASE_URL + '/api/allgoods');

// 请求搜索商品
export const searchgoods2 = (params) => ajax(BASE_URL + '/api/searchgoods2', params);

// 请求搜索用户
export const searchusers = (searchName) => ajax(BASE_URL + '/api/searchusers', searchName);

// 请求所有管理员
export const getAlladmins = () => ajax(BASE_URL + '/api/alladmins');

// 请求商品详细数据
export const getGoodsDetail = (params) => ajax(BASE_URL + '/api/goodsdetail', params);

// 请求商品评价
export const getGoodsComment = (params) => ajax(BASE_URL + '/api/goodscomment', params);

// 发布评论
export const postComment = (goods_id, comment_detail, comment_rating, user_id, user_name) => ajax(BASE_URL + '/api/postcomment', {goods_id, comment_detail, comment_rating, user_id, user_name}, 'POST');

// 请求短信验证码
export const getPhoneCode = (phone) => ajax(BASE_URL + '/api/send_code', {phone});

// 手机验证码登录
export const phoneCodeLogin = (phone, code) => ajax(BASE_URL + '/api/login_code', {phone, code}, 'POST');

// 用户名和密码登录
export const pwdLogin = (name, pwd ) => ajax(BASE_URL + '/api/login_pwd', {name, pwd}, 'POST');

// 获取登录的用户信息
export const getUserInfo = (params) => ajax(BASE_URL + '/api/user_info',params);

// 用户注册
export const addUser = (phone, name, pwd, email) => ajax(BASE_URL + '/api/add_user', {phone, name, pwd, email}, 'POST');

// 退出登录
export const getLogout = () => ajax(BASE_URL + '/api/logout');

// 修改用户信息
export const changeUserInfo = (params) => ajax(BASE_URL + '/api/change_user_msg', params, 'POST');

// 修改用户密码
export const changeUserPwd = (id, oriPwd, newPwd) => ajax(BASE_URL + '/api/change_user_pwd', {id, oriPwd, newPwd}, 'POST');

// 修改用户手机
export const changeUserPhone = (id, phone, code) => ajax(BASE_URL + '/api/change_user_phone', {id, phone, code}, 'POST');

// 加入购物车
export const addGoodsToCart = (user_id, goods_id, goods_name, thumb_url, price,buy_count, counts) => ajax(BASE_URL + '/api/add_shop_cart', {user_id, goods_id, goods_name, thumb_url, price, buy_count, counts}, 'POST');

// 单个商品数量的改变
export const changeGoodsCount = (goods_id, count, user_id) => ajax(BASE_URL + '/api/change_goods_count', {goods_id, count, user_id}, 'POST');

// 删除单个商品
export const deleteGoods = (goods_id, user_id) => ajax(BASE_URL + '/api/delete_goods', {goods_id, user_id}, 'POST');

// 删除所有商品
export const deleteAllGoods = (user_id) => ajax(BASE_URL + '/api/delete_all_goods', {user_id}, 'POST');

// 添加商品到数据库
export const addGoodsToRecom = (params) => ajax(BASE_URL + '/api/add_shop_recom', params, 'POST');

// 添加管理员
export const addAdmin = (params) => ajax(BASE_URL + '/api/add_admin', params, 'POST');

// 删除recommend单个商品
export const deleteRecomGoods = (goods_id) => ajax(BASE_URL + '/api/delete_recom_goods', {goods_id}, 'POST');

// 删除管理员
export const deleteAdmin = (id) => ajax(BASE_URL + '/api/delete_admin', {id}, 'POST');

// 修改recommend单个商品
export const changeGoodsInfo = (params) => ajax(BASE_URL + '/api/update_recom_goods', params, 'POST');

// 修改管理员信息
export const changeAdmin = (params) => ajax(BASE_URL + '/api/update_admin', params, 'POST');

// 请求购物车的数据
export const getCartsGoods = (params) => ajax(BASE_URL + '/api/cart_goods', params);

// 关键词搜索
export const searchKeywords = (keywords) => ajax(BASE_URL + '/api/searchgoods', {keywords}, 'POST');

// 管理员登录
export const adminLogin = (account, pwd) => ajax(BASE_URL + '/api/admin_login', {account, pwd}, 'POST');

// 管理员退出登录
export const adminLogout = () => ajax(BASE_URL + '/api/admin_logout');

// 请求所有用户
export const getAllUsers = () => ajax(BASE_URL + '/api/admin_allusers');

// 请求所有订单
export const getAllOrders = () => ajax(BASE_URL + '/api/admin_allorders');

// 增加订单
export const addOrder = ( user_id, user_name, orderStatus,price, checkGoods) => ajax(BASE_URL + '/api/addorder', {user_id, user_name, orderStatus,price, checkGoods}, 'POST');

// 更改订单状态
export const updateOrder = ( id,orderStatus) => ajax(BASE_URL + '/api/updateorder', {id,orderStatus}, 'POST');

// 获取用户订单
export const getUserOrder = ( userId, goodsName, categoryId) => ajax(BASE_URL + '/api/get_user_order', {userId, goodsName, categoryId}, 'POST');


// 获取单个用户订单
export const getOrderList = ( userId) => ajax(BASE_URL + '/api/orderList', {userId}, 'GET');

// 获取订单商品
export const getGoodsList = ( orderId) => ajax(BASE_URL + '/api/goodsList', {orderId}, 'GET');

// 用户申请退换货
export const exchangeOrderGoods = ( data ) => ajax(BASE_URL + '/api/exchangeOrderGoods', data, 'GET');

// 商家同意退换货
export const handleExchangeOrderGoods = ( data ) => ajax(BASE_URL + '/api/handleExchangeOrderGoods', data, 'GET');

// 查询客户信息
export const getuser = ( data ) => ajax(BASE_URL + '/api/getuser', data, 'GET');

// 查看商品评论
export const goodscomment = ( data ) => ajax(BASE_URL + '/api/goodscomment', data, 'GET');

// 回复评论
export const recomment = ( data ) => ajax(BASE_URL + '/api/recomment', data, 'POST');

// 获取退换货记录
export const exchangeOrderGoodsList = ( data ) => ajax(BASE_URL + '/api/exchangeOrderGoodsList', data, 'GET');
