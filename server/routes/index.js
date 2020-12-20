import express from 'express'
const router = express.Router({})

import conn from './../db/db'
import config from '../src/config'
import sms_util from './../util/sms_util'

import svgCaptcha from 'svg-captcha'
import md5 from 'blueimp-md5'
import formidable from 'formidable'
import { basename } from 'path'

const S_KEY = '@WaLQ1314?.LqFtK.Com.#'; // 盐
const users = {}; // 用户信息
let tmp_captcha = '';

/* GET home page. */
router.get('/', (req, res, next) => {
    console.log(md5(md5("admin") + S_KEY))
    res.render('index', { title: '时刻腕表' });
});

/**************************************** 前台商城 ****************************************** */
/**
 * 获取首页轮播图
 */
router.get('/api/homecasual', (req, res) => {
    let sqlStr = 'SELECT * FROM homecasual';
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求轮播图数据失败' });
            console.log(error);
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

/**
 * 获取商品分类数
 */
router.get('/api/category', (req, res) => {
    let sqlStr = 'SELECT * FROM category';
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求商品分类数据失败' });
            console.log(error);
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

/**
 * 模糊搜索(商品名称)
 */
router.post('/api/searchgoods', (req, res) => {
    // 获取参数
    let keywords = req.body.keywords;
    keywords = keywords.replace(/\s+/g, ' ');
    keywords = keywords.replace(/(^\s*)|(\s*$)/g, '');
    let keyArr = keywords.split(' ');
    let sqlStr = 'SELECT * FROM recommend WHERE goods_name LIKE ';  // sql语句
    keyArr.forEach((item, index, arr) => {
        sqlStr += "'%" + item + "%'";
        if (index != arr.length - 1) {
            sqlStr += " OR goods_name LIKE ";
        }
    });
	console.log(sqlStr)
    conn.query(sqlStr, (error, results, fields) => {
        results = JSON.parse(JSON.stringify(results));
        if (!error && results.length) {
            res.json({ success_code: 200, message: results });
        } else {
            console.log(error);
        }
    });
});

/**
 * 获取推荐商品列表
 *  1, 3
 */
router.get('/api/recommendshoplist', (req, res) => {
    // 获取参数
    let category = req.query.category || 1
    let pageNo = req.query.pageNo || 1;
    let pageSize = req.query.count || 3;

    let sqlStr = 'SELECT * FROM recommend WHERE category = ' + category + ' LIMIT ' + (pageNo - 1) * pageSize + ',' + pageSize;

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '请求商品列表数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

/**
 * 获取所有商品
 */
router.get('/api/allgoods', (req, res) => {

    let sqlStr = `SELECT r.*,og.* from recommend as r LEFT JOIN (select goods_id, sum(goods_count) from order_goods group by goods_id) as og on r.goods_id = og.goods_id`;

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '请求商品数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});


/**
 * 获取搜索商品 根据分类和商品名
 */
router.get('/api/searchgoods2', (req, res) => {
    console.log(req.query);
    let searchName = req.query.name
    let category = req.query.category
    console.log(searchName);
    console.log(category);

    let sqlStr = ''
    if (searchName && category) {
        sqlStr = `SELECT r.*,og.* from recommend as r LEFT JOIN (select goods_id, sum(goods_count) from order_goods group by goods_id) as og on r.goods_id = og.goods_id where r.goods_name like '%${searchName}%' AND r.category = ${category}`;
    }

    if (searchName && !category) {
        sqlStr = `SELECT r.*,og.* from recommend as r LEFT JOIN (select goods_id, sum(goods_count) from order_goods group by goods_id) as og on r.goods_id = og.goods_id where r.goods_name like '%${searchName}%'`;
    }
    if (!searchName && category) {
        sqlStr = `SELECT r.*,og.* from recommend as r LEFT JOIN (select goods_id, sum(goods_count) from order_goods group by goods_id) as og on r.goods_id = og.goods_id where r.category = ${category}`;
    }
    if (!searchName && !category) {
        sqlStr = `SELECT r.*,og.* from recommend as r LEFT JOIN (select goods_id, sum(goods_count) from order_goods group by goods_id) as og on r.goods_id = og.goods_id `;
    }



    // let sqlStr = `SELECT * `;

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '请求商品数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

/**
 * 获取搜索用户
 */
router.get('/api/searchusers', (req, res) => {
    let searchName = req.query.searchName
    console.log(req.query);


    let sqlStr = `SELECT * from user_info where user_name like '%${searchName}%'’`;

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '请求用户数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

/**
 * 获取所有管理员
 */
router.get('/api/alladmins', (req, res) => {

    let sqlStr = 'SELECT * from administrators';

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '请求管理员数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});


//新加接口
/**
 * 4、	查询客户订单信息
 */
router.get('/api/orderList', (req, res) => {
    let userId = req.query.userId
    let querySqlStr = "SELECT * FROM `order_goods` as og INNER JOIN recommend as r  on  r.goods_id = og.goods_id INNER JOIN order_info as oi on oi.id = og.order_id WHERE oi.user_id = ? ";
    conn.query(querySqlStr, [userId], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

//获取商品
router.get('/api/goodsList', (req, res) => {
    let orderId = req.query.orderId
    let querySqlStr = "SELECT * FROM `order_goods` as og INNER JOIN recommend as r  on  r.goods_id = og.goods_id WHERE og.order_id = ? ";
    conn.query(querySqlStr, [orderId], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

///3.	查询客户信息
router.get('/api/getUser', (req, res) => {
    let userId = req.query.userId
    let querySqlStr = "SELECT * FROM `user_info` id = ? ";
    conn.query(querySqlStr, [userId], (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

//添加评论/回复
router.get('/api/reply', (req, res) => {
    let userId = req.query.userId
    let text = req.query.text
    let username = req.query.username
    let commentsid = req.query.commentsid
    let goodsid = req.query.goods_id     //对那个商品评论
    let superiorid = req.query.superiorid   //上级id，回复评论需要传，新加评论不传，这个id是当前表的id
    let data = [text, commentsid, userId, username, goodsid];
    // 添加评论
    // http://127.0.0.1:5000/api/reply?userId=1&text=%27123s%27&username=555&commentsid=29
    let querySqlStr = "INSERT INTO reply(text, comments_id, user_id, user_name,goods_id) VALUES (?, ?, ?, ?,?)";
    if (superiorid !== null && superiorid !== undefined) {
        data.push(superiorid);
        //这里是回复评论
        //http://127.0.0.1:5000/api/reply?userId=1&text=666&username=555&commentsid=29&superiorid=1
        querySqlStr = "INSERT INTO reply(text, comments_id, user_id, user_name,goods_id,superior_id) VALUES (?, ?, ?, ?,?,?)";
    }
    console.log(data)
    conn.query(querySqlStr, data, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '添加数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

//订单状态暂定 5是退货，6是换货，其他未知，没有值的是正常订单
//exchange_order_goods:订单退换货表，状态 1是申请退货中 ，2是申请换货中。 3同意退货，4同意换货，5是退货完成状态 6是换货完成状态  其他状态未设定
//申请换货//申请退货
router.get('/api/exchangeOrderGoods', (req, res) => {
    let userId = req.query.userId
    let ordergoodsid = req.query.ordergoodsid   //订单产品id
    let orderid = req.query.orderid   //订单id
    let count = req.query.count     //数量
    let price = req.query.price     //发生退换货的金额，换货可以 null / 0
    let state = req.query.state     //1是申请退货中 ，2是申请换货中。 3同意退货，4同意换货，5是退货完成状态 6是换货完成状态  其他状态未设定
    let data = [ordergoodsid, orderid, userId, count, price, state];        //state是退货表的状态
    console.log(data)

    if (state != 1 || state != 2) {
        res.json({ err_code: 0, message: '非法操作！' });
        return;
    }
    let querySqlStr = "INSERT INTO exchange_order_goods(order_goods_id,order_id, user_id, count, price,state) VALUES (?, ?, ?, ?,?,?)";
    conn.query(querySqlStr, data, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '添加数据失败' });
        } else {
            conn.query("update order_goods set state = 1 where id =" + ordergoodsid, (error, results) => {
                if (error) {
                    console.log(error);
                    res.json({ err_code: 0, message: '更新订单产品状态失败' });
                } else {
                    results = JSON.parse(JSON.stringify(results));
                    res.json({ success_code: 200, message: "操作成功！" });
                }
            });
            conn.query("update order_info set state = 1 where id =" + orderid, (error, results) => {
                if (error) {
                    console.log(error);
                    res.json({ err_code: 0, message: '更新订单状态失败' });
                } else {
                    results = JSON.parse(JSON.stringify(results));
                    res.json({ success_code: 200, message: "操作成功！" });
                }
            });
        }
    });
});

//同意退货/换货
router.get('/api/handleExchangeOrderGoods', (req, res) => {
    let exchangeordergoodsid = req.query.exchangeordergoodsid   //退货/换货 售后表id
    conn.query("select * from exchange_order_goods where id =" + exchangeordergoodsid, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '添加数据失败' });
        } else {
            let id = results[0].id
            if (id > 0) {
                let s = 4;
                if (results[0].state == 1) {
                    s = 5;
                }
                if (results[0].state == 2) {
                    s = 4;
                }
                conn.query("update exchange_order_goods set state = " + s + " where id =" + id, (error, results) => {
                    if (error) {
                        console.log(error);
                        res.json({ err_code: 0, message: '更新状态失败' });
                    } else {
                        results = JSON.parse(JSON.stringify(results));
                        res.json({ success_code: 200, message: "操作成功！" });
                    }
                });
            }

        }
    });
});

//获取退换货记录
router.get('/api/exchangeOrderGoodsList', (req, res) => {
    let ordergoodsid = req.query.ordergoodsid       //订单产品id
    let orderid = req.query.orderid                 //订单id
    let id = req.query.id                           //退换货表id
    let querySqlStr = 'select * from exchange_order_goods as eog INNER JOIN order_goods as og on og.id = eog.order_goods_id INNER JOIN recommend as r on r.goods_id = og.goods_id';
    if (orderid > 0 && ordergoodsid > 0)
        querySqlStr += ` where eog.order_id = ${orderid} or eog.order_goods_id = ${ordergoodsid}`;
    else if (orderid > 0)
        querySqlStr += `where eog.order_id = ${orderid} `;
    else if (ordergoodsid > 0)
        querySqlStr += ` where eog.order_goods_id = ${ordergoodsid} `;
    else if (id > 0)
        querySqlStr = ` where eog.id = ${id} `;
    else {
        // querySqlStr = `select * from exchange_order_goods `;
        // res.json({ err_code: 0, message: '请求数据失败,参数必填！' });
        // return;
    }
    conn.query(querySqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '请求数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});


//end

/**
 * 获取首页商品列表
 */
router.get('/api/homeshoplist', (req, res) => {
    // 获取总分类
    let cateSqlStr = 'SELECT COUNT(*) FROM category';
    conn.query(cateSqlStr, (error, results, fields) => {
        if (!error) {
            let sqlStr = '';
            for (let i = 0; i < results[0]['COUNT(*)']; i++) {
                sqlStr += 'SELECT * FROM recommend WHERE category = ' + (i + 1) + ' AND isActive = 1 LIMIT 3;';
            }
            conn.query(sqlStr, (error, results, fields) => {
                if (!error) {
                    results = JSON.parse(JSON.stringify(results));
                    res.json({ success_code: 200, message: results });
                }
            });
        }
    });
});

/**
 * 获取商品详细信息
 */
router.get('/api/goodsdetail', (req, res) => {
    // 获取参数
    let goodsNo = req.query.goodsNo;
    let sqlStr = 'SELECT * FROM recommend WHERE goods_id = ' + goodsNo;
    conn.query(sqlStr, (error, results, fields) => {
        if (!error) {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

/**
 * 获取商品评价
 */
router.get('/api/goodscomment', (req, res) => {
    // 获取参数
    let goodsId = req.query.goodsId;
    let sqlStr = `SELECT * FROM comments WHERE goods_id=${goodsId}`;
    conn.query(sqlStr, (error, results, fields) => {
        if (!error) {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

/**
  评论商品
*/
router.post('/api/postcomment', (req, res) => {
    // 获取参数
    let goods_id = req.body.goods_id;
    let comment_detail = req.body.comment_detail;
    let comment_rating = req.body.comment_rating;
    let user_id = req.body.user_id;
    let user_name = req.body.user_name;
    
    let addSql = "INSERT INTO comments(goods_id, comment_detail, comment_rating, user_id, user_name) VALUES (?, ?, ?, ?, ?)";
    let addSqlParams = [goods_id, comment_detail, comment_rating, user_id, user_name];
    conn.query(addSql, addSqlParams, (error, results) => {
        results = JSON.parse(JSON.stringify(results));
        if (error) {
			console.log(error);
		} else {
			res.json({ success_code: 200, message: "发布成功" });
		}
    });
});

/**
  回复评论商品
*/
router.post('/api/recomment', (req, res) => {
    // 获取参数
    let comment_id = req.body.comment_id;
    let re_txt = req.body.re_txt;
    let addSql = "UPDATE comments SET re_txt = ? WHERE comment_id = ?";
    let addSqlParams = [re_txt, comment_id];
    conn.query(addSql, addSqlParams, (error, results) => {
        if (error) {
			console.log(error);
			res.json({ err_code: 0, message: '修改用户信息失败!' });
		} else {
			res.json({ success_code: 200, message: '回复成功!' });
		}
    });
});

/**
 一次性图形验证码
*/
router.get('/api/captcha', (req, res) => {
    // 生成随机验证码
    let captcha = svgCaptcha.create({
        color: true,
        noise: 3,
        ignoreChars: '0o1iIO',
        size: 4
    });

    // 保存
    req.session.captcha = captcha.text.toLocaleLowerCase();
    tmp_captcha = captcha.text.toLocaleLowerCase();

    // 返回客户端
    res.type('svg');
    res.send(captcha.data);
});

/**
  发送验证码短信
*/
router.get('/api/send_code', (req, res) => {
    // 获取手机号码
    let phone = req.query.phone;
    // 随机产生验证码
    let code = sms_util.randomCode(6);

    /* sms_util.sendCode(phone, code, function (success) {
        if (success) {
             users[phone] = code;
             res.json({success_code: 200, message: '验证码获取成功!'});
         } else {
             res.json({err_code: 0, message: '验证码获取失败!'});
         }
     });*/

    // 成功——模拟短信功能
    setTimeout(() => {
        users[phone] = code;
        res.json({ success_code: 200, message: code });
    }, 2000);
});

/**
  手机验证码登录
*/
router.post('/api/login_code', (req, res) => {
    // 获取数据
    const phone = req.body.phone;
    const code = req.body.code;

    // 验证验证码是否正确
    if (users[phone] !== code) {
        res.json({ err_code: 0, message: '验证码不正确!' });
    }

    // 查询数据
    delete users[phone];

    let sqlStr = "SELECT * FROM user_info WHERE user_phone = '" + phone + "' LIMIT 1";

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '查询失败' });
            console.log(error);
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (results[0]) {  // 用户已经存在
                req.session.userId = results[0].id;

                res.json({
                    success_code: 200,
                    message: {
                        id: results[0].id,
                        user_name: results[0].user_name,
                        user_nickname: results[0].user_nickname || '',
                        user_phone: results[0].user_phone,
                        user_sex: results[0].user_sex,
                        user_address: results[0].user_address,
                        user_sign: results[0].user_sign,
                        user_birthday: results[0].user_birthday,
                        user_avatar: results[0].user_avatar
                    }
                });
            } else { // 新用户
                const addSql = "INSERT INTO user_info(user_name, user_phone, user_avatar) VALUES (?, ?, ?)";
                const addSqlParams = [phone, phone, 'http://localhost:' + config.port + '/avatar_uploads/avatar_default.jpg'];  // 手机验证码注册，默认用手机号充当用户名
                conn.query(addSql, addSqlParams, (error, results, fields) => {
                    results = JSON.parse(JSON.stringify(results));
                    if (!error) {
                        req.session.userId = results.insertId;
                        let sqlStr = "SELECT * FROM user_info WHERE id = '" + results.insertId + "' LIMIT 1";
                        conn.query(sqlStr, (error, results, fields) => {
                            if (error) {
                                res.json({ err_code: 0, message: '注册失败' });
                                console.log(error);
                            } else {
                                results = JSON.parse(JSON.stringify(results));

                                res.json({
                                    success_code: 200,
                                    message: {
                                        id: results[0].id,
                                        user_name: results[0].user_name,
                                        user_phone: results[0].user_phone,
                                        user_avatar: results[0].user_avatar
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });

});

/**
 用户注册
 */
router.post('/api/add_user', (req, res) => {
    // 获取数据
    const phone = req.body.phone;
    const name = req.body.name;
    const pwd = req.body.pwd;
    const email = req.body.email;


    // 查询数据
    delete users[phone];

    let sqlStr = "SELECT * FROM user_info WHERE user_name = '" + name + "' LIMIT 1";

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '查询失败' });
            console.log(error);
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (results[0]) {  // 用户已经存在
                res.json({ err_code: 0, message: '用户名已经存在!' });
            } else { // 新用户
                const addSql = "INSERT INTO user_info(user_email, user_name, user_phone, user_avatar, user_pwd) VALUES (?, ?, ?, ?, ?)";
                const addSqlParams = [email, name, phone, 'http://localhost:' + config.port + '/avatar_uploads/avatar_default.jpg', pwd];  //
                conn.query(addSql, addSqlParams, (error, results, fields) => {
                    results = JSON.parse(JSON.stringify(results));
                    if (!error) {
                        req.session.userId = results.insertId;
                        let sqlStr = "SELECT * FROM user_info WHERE id = '" + results.insertId + "' LIMIT 1";
                        conn.query(sqlStr, (error, results, fields) => {
                            if (error) {
                                res.json({ err_code: 0, message: '注册失败' });
                                console.log(error);
                            } else {
                                results = JSON.parse(JSON.stringify(results));

                                res.json({
                                    success_code: 200,
                                    message: {
                                        id: results[0].id,
                                        user_name: results[0].user_name,
                                        user_phone: results[0].user_phone,
                                        user_avatar: results[0].user_avatar
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
    });

});

/**
 * 用户名和密码登录
 */
router.post('/api/login_pwd', (req, res) => {
    // 获取数据
    const user_name = req.body.name;
    // const user_pwd = md5(md5(req.body.pwd) + S_KEY);//加密
    const user_pwd = req.body.pwd;

    // 查询数据
    let sqlStr = `SELECT * FROM user_info WHERE user_name = ${user_name} AND user_pwd = ${user_pwd} LIMIT 1`;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '用户名不正确!' });
        } else {
            results = JSON.parse(JSON.stringify(results));

            if (results[0]) {  // 用户密码正确
                results = JSON.parse(JSON.stringify(results));
                // 返回用户信息
                res.json({
                    success_code: 200,
                    message: {
                        id: results[0].id,
                        user_name: results[0].user_name || '',
                        user_nickname: results[0].user_nickname || '',
                        user_avatar: results[0].user_avatar || ''
                    }
                });
            } else { // 找不到该用户
                res.json({ err_code: 0, message: '找不到该用户' });
                return;

            }
        }
    });
});

/**
*  根据session中的用户id获取用户信息
* */
router.get('/api/user_info', (req, res) => {
    // 获取参数
    let userId = req.query.user_id || req.session.userId;

    let sqlStr = "SELECT * FROM user_info WHERE id = " + userId + " LIMIT 1";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '请求用户数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (!results[0]) {
                delete req.session.userId;
                res.json({ error_code: 1, message: '请先登录' });
            } else {
                res.json({
                    success_code: 200,
                    message: {
                        id: results[0].id,
                        user_name: results[0].user_name || '',
                        user_nickname: results[0].user_nickname || '',
                        user_phone: results[0].user_phone || '',
                        user_sex: results[0].user_sex || '',
                        user_address: results[0].user_address || '',
                        user_sign: results[0].user_sign || '',
                        user_birthday: results[0].user_birthday || '',
                        user_avatar: results[0].user_avatar || ''
                    },
                });
            }
        }
    });
});

/**
 * 退出登录
 */
router.get('/api/logout', (req, res) => {
    // 清除session中userId
    delete req.session.userId;

    res.json({
        success_code: 200,
        message: "退出登录成功"
    });
});

/**
 * 添加商品到购物车
 */
router.post('/api/add_shop_cart', (req, res) => {
    // 验证用户
    let user_id = req.body.user_id;
    if (!user_id) {
        res.json({ err_code: 0, message: '非法用户' });
        return;
    }
    /* if(!user_id || user_id !== req.session.userId){
         console.log( req.session.userId);
         res.json({err_code:0, message:'非法用户'});
         return;
     }
    */
    // 获取客户端传过来的商品信息
    let goods_id = req.body.goods_id;
    let goods_name = req.body.goods_name;
    let thumb_url = req.body.thumb_url;
    let price = req.body.price;
    let buy_count = req.body.buy_count;
    let is_pay = 0; // 0 未购买 1购买
    let counts = req.body.counts;

    let sql_str = "SELECT * FROM cart WHERE goods_id = " + goods_id + " AND user_id=" + user_id + " LIMIT 1";
    conn.query(sql_str, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '服务器内部错误!' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (results[0]) { // 商品已经存在
                res.json({ success_code: 200, message: '该商品已在购物车中' });
            } else { // 商品不存在
                let add_sql = "INSERT INTO cart(goods_id, goods_name, thumb_url, price, buy_count, is_pay, user_id, counts) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                let sql_params = [goods_id, goods_name, thumb_url, price, buy_count, is_pay, user_id, counts];
                conn.query(add_sql, sql_params, (error, results, fields) => {
                    if (error) {
                        res.json({ err_code: 0, message: '加入购物车失败!' });
                        console.log(error);
                    } else {
                        res.json({ success_code: 200, message: '加入购物车成功!' });
                    }
                });
            }
        }
    });

});

/**
 * 查询购物车的商品
 */
router.get('/api/cart_goods', (req, res) => {
    // 获取参数
    let user_id = req.query.user_id;
    let sqlStr = "SELECT * FROM cart WHERE user_id =" + user_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '请求购物车商品数据失败' });
        } else {
            res.json({ success_code: 200, message: results });
        }
    });
});

/**
 * 删除购物车单条商品
 */
router.post('/api/delete_goods', (req, res) => {
    // 获取数据
    const goods_id = req.body.goods_id;
    const user_id = req.body.user_id;

    let sqlStr = "DELETE FROM cart WHERE goods_id =" + goods_id + " AND user_id = " + user_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '删除失败!' });
        } else {
            res.json({ success_code: 200, message: '删除成功!' });
        }
    });
});

/*********************************** 用户中心 **************************************** */

/**
 * 修改用户信息 
 */
router.post('/api/change_user_msg', (req, res) => {
    // 获取客户端传过来的商品信息
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadsAvatarPath;  // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err);
        }
        let id = fields.id;
        let user_nickname = fields.user_nickname || '';
        let user_sex = fields.user_sex || '';
        let user_address = fields.user_address || '';
        let user_birthday = fields.user_birthday || '';
        let user_sign = fields.user_sign || '';
        let user_avatar = 'http://localhost:' + config.port + '/avatar_uploads/avatar_default.jpg';
        if (files.user_avatar) {
            user_avatar = 'http://localhost:' + config.port + '/avatar_uploads/' + basename(files.user_avatar.path);
        }

        // 验证
        if (!id) {
            res.json({ err_code: 0, message: '修改用户信息失败!' });
        }

        // 更新数据
        let sqlStr = "UPDATE user_info SET user_nickname = ? , user_sex = ?, user_address = ?, user_birthday = ?, user_sign = ?, user_avatar = ? WHERE id = " + id;
        let strParams = [user_nickname, user_sex, user_address, user_birthday, user_sign, user_avatar];
        conn.query(sqlStr, strParams, (error, results, fields) => {
            if (error) {
                console.log(error);
                res.json({ err_code: 0, message: '修改用户信息失败!' });
            } else {
                res.json({ success_code: 200, message: '修改用户信息成功!' });
            }
        });
    });
});

/**
 * 修改用户密码
 */
router.post('/api/change_user_pwd', (req, res) => {
    // 获取数据
    let id = req.body.id;
    let oriPwd = '';
    let newPwd = md5(md5(req.body.newPwd) + S_KEY);
    if (req.body.oriPwd) {
        oriPwd = md5(md5(req.body.oriPwd) + S_KEY);
    }

    let sqlStr = "SELECT * FROM user_info WHERE id = " + id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '查询失败!' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            if (results[0]) { // 用户存在
                if (!results[0].user_pwd || (results[0].user_pwd && oriPwd === results[0].user_pwd)) {
                    let sqlStr = "UPDATE user_info SET user_pwd = ? WHERE id = " + id;
                    conn.query(sqlStr, [newPwd], (error, results, fields) => {
                        if (!error) {
                            res.json({ success_code: 200, message: '密码修改成功!' });
                        }
                    });
                } else if (oriPwd != results[0].user_pwd) {
                    res.json({ err_code: 0, message: '输入的原始密码错误!' });
                }
            } else {
                res.json({ err_code: 0, message: '非法用户!' });
            }
        }
    });
});

/**
  修改手机
*/
router.post('/api/change_user_phone', (req, res) => {
    // 获取数据
    const id = req.body.id;
    const phone = req.body.phone;
    const code = req.body.code;

    // 验证验证码是否正确
    if (users[phone] !== code) {
        res.json({ err_code: 0, message: '验证码不正确!' });
    }

    // 查询数据
    delete users[phone];

    let sqlStr = "UPDATE user_info SET user_phone = " + phone + " WHERE id = " + id;

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            res.json({ err_code: 0, message: '修改失败' });
            console.log(error);
        } else {
            res.json({ success_code: 200, message: '修改成功' });
        }
    });

});

/********************************* 后台管理系统 ********************************** */

/**
 * 管理员登录
 */
router.post('/api/admin_login', (req, res) => {
    const account = req.body.account;
    const pwd = req.body.pwd;
    const md5Pwd = md5(md5(req.body.pwd) + S_KEY); //使用加密
    // const md5Pwd = req.body.pwd;//不使用加密

    if (!account || !pwd) {
        res.json({ error_code: 0, message: "账号和密码不得为空！" });
    }

    let sqlStr = "SELECT * FROM administrators WHERE account = '" + account + "'";
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ error_code: 0, message: "服务器内部错误！" });
        } else if (results[0]) {
            let user = JSON.parse(JSON.stringify(results[0]));
            if (md5Pwd === user['pwd']) {
                req.session.adminId = user['id'];
                res.json({ success_code: 200, message: "登录成功！" });
            } else {
                res.json({ error_code: 0, message: "密码错误！" });
            }
        } else {
            res.json({ err_code: 0, message: "用户不存在！" });
        }
    });
});

/**
 * 管理员退出登录
 */
router.get('/api/admin_logout', (req, res) => {
    console.log(req.session.adminId)
    delete req.session.adminId;

    res.json({
        success_code: 200,
        message: "退出登录成功"
    });
});

/**
 * 修改商品数量 
 */
router.post('/api/change_goods_count', (req, res) => {
    // 获取数据
    const goods_id = req.body.goods_id;
    const buy_count = req.body.count;
    const user_id = req.body.user_id;

    let sqlStr = "UPDATE cart SET buy_count = ? WHERE goods_id = " + goods_id + " AND user_id = " + user_id;
    let strParams = [buy_count];
    conn.query(sqlStr, strParams, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '修改商品数量失败!' });
        } else {
            res.json({ success_code: 200, message: '修改商品数量成功!' });
        }
    });
});

/**
 * 获取所有用户信息
 */
router.get('/api/admin_allusers', (req, res) => {

    let sqlStr = 'SELECT id, user_name, user_phone, user_nickname, user_address FROM user_info';

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '请求用户数据失败' });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});


/**
 * 删除recommend单条商品
 */
router.post('/api/delete_recom_goods', (req, res) => {
    // 获取数据
    const goods_id = req.body.goods_id;

    let sqlStr = "DELETE FROM recommend WHERE goods_id =" + goods_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '删除失败!' });
        } else {
            let sqlStr2 = "DELETE FROM cart WHERE goods_id =" + goods_id;
            conn.query(sqlStr, (error, results, fields) => {
                if (error) {
                    console.log(error);
                    res.json({ err_code: 0, message: '删除失败!' });
                } else {
                    res.json({ success_code: 200, message: '删除成功!' });
                }
            });
        }
    });
});

/**
 * 删除管理员
 */
router.post('/api/delete_admin', (req, res) => {
    // 获取数据
    const id = req.body.id;

    let sqlStr = "DELETE FROM administrators WHERE id =" + id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '删除失败!' });
        } else {
            res.json({ success_code: 200, message: '删除成功!' });
        }
    });
});

/**
 * 修改recommend商品信息 
 */
router.post('/api/update_recom_goods', (req, res) => {
    // 获取数据
    const goods_id = req.body.goods_id;
    const goods_name = req.body.goods_name;
    const short_name = req.body.short_name;
    const price = req.body.price;
    const counts = req.body.counts;
    const category = req.body.category;
    const isActive = req.body.isActive ? true : false;
    console.log(isActive)

    let sqlStr = "UPDATE recommend SET goods_name = ?, short_name = ?, price = ?, counts = ?, category = ?, isActive = ? WHERE goods_id = " + goods_id;
    let strParams = [goods_name, short_name, price, counts, category, isActive];
    conn.query(sqlStr, strParams, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '修改失败!' });
        } else {
            res.json({ success_code: 200, message: '修改成功!' });
        }
    });
});

/**
 * 修改管理员信息
 */
router.post('/api/update_admin', (req, res) => {
    // 获取数据
    const id = req.body.id;
    const account = req.body.account;
    const pwd = req.body.pwd;


    let sqlStr = "UPDATE administrators SET id = ?, account = ?, pwd = ? WHERE id = " + id;
    let strParams = [id, account, pwd];
    conn.query(sqlStr, strParams, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '修改失败!' });
        } else {
            res.json({ success_code: 200, message: '修改成功!' });
        }
    });
});

/**
 * 添加商品到recommend
 */
router.post('/api/add_shop_recom', (req, res) => {
    // 获取客户端传过来的商品信息
    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadsGoodsPath;  // 上传图片放置的文件夹
    form.keepExtensions = true; // 保持文件的原始扩展名
    form.parse(req, (err, fields, files) => {
        if (err) {
            return next(err);
        }
        let goods_id = fields.goods_id;
        let goods_name = fields.goods_name;
        let short_name = fields.short_name;
        let price = fields.price;
        let normal_price = price + 300;
        let market_price = price + 500;
        let sales_tip = fields.sales_tip;
        let category = fields.category;
        let comments_count = 0;
        let counts = fields.counts;
        let thumb_url = 'http://localhost:' + config.port + '/uploads/' + basename(files.goods_img.path);
        let image_url = 'http://localhost:' + config.port + '/uploads/' + basename(files.goods_img.path);
        let hd_thumb_url = 'http://localhost:' + config.port + '/uploads/' + basename(files.goods_img.path);

        let sql_str = "SELECT * FROM recommend WHERE goods_id = " + goods_id;
        conn.query(sql_str, (error, results, fields) => {
            if (error) {
                res.json({ err_code: 0, message: '服务器内部错误!' });
            } else {
                results = JSON.parse(JSON.stringify(results));
                if (results[0]) { // 商品已经存在
                    res.json({ success_code: 500, message: '该商品已在数据库中' });
                } else { // 商品不存在
                    let add_sql = "INSERT INTO recommend(goods_id, goods_name, short_name, thumb_url, image_url, hd_thumb_url, price, normal_price, market_price, sales_tip, category, counts, comments_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    let sql_params = [goods_id, goods_name, short_name, thumb_url, image_url, hd_thumb_url, price, normal_price, market_price, sales_tip, category, counts, comments_count];
                    conn.query(add_sql, sql_params, (error, results, fields) => {
                        if (error) {
                            console.log(error);
                            res.json({ err_code: 0, message: '加入失败!' });
                        } else {
                            let sqlStr = "UPDATE category SET cate_counts = cate_counts + 1  WHERE cate_id = " + category;
                            conn.query(sqlStr, [], (error, results, fields) => {
                                if (error) {
                                    console.log(error);
                                } else {
                                    res.json({ success_code: 200, message: '加入成功!' });
                                }
                            });
                        }
                    });
                }
            }
        });
    });
});

/**
 * 添加管理员
 */
router.post('/api/add_admin', (req, res) => {
    console.log(req.body);
    const id = req.body.id;
    const account = req.body.account;
    // const pwd = req.body.pwd;
    // const md5Pwd = md5(md5(req.body.pwd) + S_KEY); //使用加密
    const pwd = md5(md5(req.body.pwd) + S_KEY);
    let sqlStr = "INSERT INTO administrators(id, account, pwd) VALUES (?, ?, ?);"
    const addSqlParams = [id, account, pwd];
    conn.query(sqlStr, addSqlParams, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '添加管理员失败!' })
        } else {
            res.json({ success_code: 200, message: '添加管理员成功!' });
        }
    });
})


/**
 * 删除所有商品
 */
router.post('/api/delete_all_goods', (req, res) => {
    // 获取数据
    const user_id = req.body.user_id;

    let sqlStr = "DELETE FROM cart WHERE user_id = " + user_id;
    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '删除失败!' });
        } else {
            res.json({ success_code: 200, message: '删除成功!' });
        }
    });

});

/**
 * 获取所有订单信息
 */
router.get('/api/admin_allorders', (req, res) => {

    let sqlStr = 'SELECT * FROM order_info';
    // SELECT * FROM recommend

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: error });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

/**
 增加订单
 */
router.post('/api/addorder', (req, res) => {
    console.log(req.body);
    // 获取参数
    let user_id = req.body.user_id;
    let user_name = req.body.user_name;
    let orderStatus = req.body.orderStatus;
    let price = req.body.price;
    let checkGoods = req.body.checkGoods;
    // let user_id = req.body.user_id;
    const addSql = "INSERT INTO order_info(user_id, user_name, orderStatus, price) VALUES (?, ?, ?, ?)";
    const addSqlParams = [user_id, user_name, orderStatus, price];
    conn.query(addSql, addSqlParams, (error, results, fields) => {
        results = JSON.parse(JSON.stringify(results));
        console.log(results.insertId);
        // if (error) {
        //     console.log(error);
        // } else {
        //     res.json({success_code: 200, message: "结算成功"});
        // }
        if (!error) {
            // le
            let sqlStr = ''
            let sqlParams = []
            for (let i = 0, length = checkGoods.length; i < length; i++) {
                sqlStr += `INSERT INTO order_goods(order_id, goods_id, goods_count, goods_price) VALUES (?, ?, ?, ?);`
                sqlParams.push(results.insertId, checkGoods[i].goods_id, checkGoods[i].buy_count, checkGoods[i].price)
            }

            conn.query(sqlStr, sqlParams, (error, results, fields) => {
                if (error) {
                    console.log(error);
                } else {
                    res.json({ success_code: 200, message: "结算成功" });
                }
            });
        }
    });
});

/**
 * 修改订单状态
 */
router.post('/api/updateorder', (req, res) => {
    // 获取数据
    const id = req.body.id;
    const orderStatus = req.body.orderStatus;

    let sqlStr = "UPDATE order_info SET orderStatus = ? WHERE id = " + id;
    let strParams = [orderStatus];
    conn.query(sqlStr, strParams, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: '修改失败!' });
        } else {
            res.json({ success_code: 200, message: '修改成功!' });
        }
    });
});

/**
 * 获取用户订单
 */
router.post('/api/get_user_order', (req, res) => {
    let userId = req.body.userId;
    let goodsName = req.body.goodsName;
    let categoryId = req.body.categoryId;

    let sqlStr = ''
    if (goodsName && categoryId) {
        sqlStr = `
    SELECT * FROM order_info as oi  left JOIN  order_goods as og  on oi.id = og.order_id 
    left join recommend as r on og.goods_id = r.goods_id 
  
    WHERE oi.user_id =${userId} AND goods_name like '%${goodsName}%' AND category = ${categoryId}`;
    } else if (!goodsName && categoryId) {
        sqlStr = `
    SELECT * FROM order_info as oi  left JOIN  order_goods as og  on oi.id = og.order_id 
    left join recommend as r on og.goods_id = r.goods_id 
  
    WHERE oi.user_id =${userId} AND category = ${categoryId}`;
    } else if (goodsName && !categoryId) {
        sqlStr = `
    SELECT * FROM order_info as oi  left JOIN  order_goods as og  on oi.id = og.order_id 
    left join recommend as r on og.goods_id = r.goods_id 
  
    WHERE oi.user_id =${userId} AND goods_name like '%${goodsName}%'`;
    } else {
        sqlStr = `
    SELECT * FROM order_info as oi  left JOIN  order_goods as og  on oi.id = og.order_id 
    left join recommend as r on og.goods_id = r.goods_id 
  
    WHERE oi.user_id = ${userId}`;
    }

    // SELECT * FROM recommend

    conn.query(sqlStr, (error, results, fields) => {
        if (error) {
            console.log(error);
            res.json({ err_code: 0, message: error });
        } else {
            results = JSON.parse(JSON.stringify(results));
            res.json({ success_code: 200, message: results });
        }
    });
});

export default router;
