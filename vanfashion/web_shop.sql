/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 50617
 Source Host           : localhost:3306
 Source Schema         : web_shop

 Target Server Type    : MySQL
 Target Server Version : 50617
 File Encoding         : 65001

 Date: 22/11/2020 16:12:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for administrators
-- ----------------------------
DROP TABLE IF EXISTS `administrators`;
CREATE TABLE `administrators`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `pwd` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of administrators
-- ----------------------------
INSERT INTO `administrators` VALUES (1, 'admin', '63814a82384f9faca8bcca0f08d86eb9');

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart`  (
  `goods_id` int(11) NOT NULL,
  `goods_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `thumb_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `price` decimal(10, 0) DEFAULT NULL,
  `buy_count` int(11) DEFAULT NULL,
  `is_pay` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `counts` int(11) DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of cart
-- ----------------------------
INSERT INTO `cart` VALUES (136590526, '【花花公子正品】皮带男士休闲自动扣皮带商务百搭自动扣学生腰带', 'http://t00img.yangkeduo.com/t10img/images/2018-06-22/2fa2b2b9b6423fa01b5a769110d20afb.jpeg', 1380, 1, '0', 8, 50);
INSERT INTO `cart` VALUES (344112935, '蓝牙耳机通用所有手机', 'http://t00img.yangkeduo.com/t03img/images/2018-05-05/690f068dfbf940e9a22f71132766bcd1.jpeg', 990, 3, '0', 8, 50);
INSERT INTO `cart` VALUES (48367210, '【天然竹浆本色品质纸巾】丝飘抽纸餐巾纸', 'http://t00img.yangkeduo.com/t07img/images/2018-05-27/38a24fafe5166b7e236a01ddf1ec7a04.jpeg', 990, 3, '0', 5, 60);
INSERT INTO `cart` VALUES (621723438, '青春励志文学', 'http://t00img.yangkeduo.com/t09img/images/2018-07-20/a6eb38f1b52054d149a0dcbf9539ebf2.jpeg', 955, 4, '0', 5, 50);
INSERT INTO `cart` VALUES (55984768, '华为 荣耀9青春版', 'http://t00img.yangkeduo.com/goods/images/2018-08-24/d57f9e6c4c04568324775079cc8ab386.jpeg', 80500, 1, '0', 5, 50);
INSERT INTO `cart` VALUES (1031855, '甜曲紫米面包550g', 'http://t00img.yangkeduo.com/goods/images/2018-08-30/1093ac9bfaa77304a8c3f25d4bfcb743.jpeg', 990, 5, '0', 5, 50);
INSERT INTO `cart` VALUES (621723438, '青春励志文学', 'http://t00img.yangkeduo.com/t09img/images/2018-07-20/a6eb38f1b52054d149a0dcbf9539ebf2.jpeg', 955, 1, '0', 9, 50);
INSERT INTO `cart` VALUES (7657775, '【曹大姐】五香熟牛肉200克无淀粉无添加', 'http://t00img.yangkeduo.com/t08img/images/2018-05-23/2a78ac1b4c151168ceddbb73920cdaef.jpeg', 1390, 3, '0', 9, 50);
INSERT INTO `cart` VALUES (2316452, '男士修身弹力小脚裤 品质保证', 'http://t00img.yangkeduo.com/t11img/images/2018-07-15/6982d3a77481e146e9fb81dc31d3a546.jpeg', 2800, 1, '0', 9, 50);
INSERT INTO `cart` VALUES (2316452, '男士修身弹力小脚裤 品质保证', 'http://t00img.yangkeduo.com/t11img/images/2018-07-15/6982d3a77481e146e9fb81dc31d3a546.jpeg', 2800, 1, '0', 5, 50);
INSERT INTO `cart` VALUES (1, 'aj11满天星', 'http://localhost:3000/uploads/upload_8e640ef085c3cf1181e4e1c6eae0b3ef.jpg', 99999, 1, '0', 12, 7000);
INSERT INTO `cart` VALUES (3, 'AJ11男子黑红高帮实战篮球鞋', 'http://localhost:3000/uploads/upload_74bd3de383c4f95cc6af3d78b3756531.jpg', 99799, 1, '0', 1, 1254);

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category`  (
  `cate_id` int(11) NOT NULL,
  `cate_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `cate_icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `cate_counts` int(11) DEFAULT NULL,
  PRIMARY KEY (`cate_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES (1, '热门男鞋', 'el-icon-reading', 7);
INSERT INTO `category` VALUES (2, '热门女鞋', 'el-icon-box', 3);
INSERT INTO `category` VALUES (3, '童鞋', 'el-icon-present', 1);
INSERT INTO `category` VALUES (4, '老人健步鞋', 'el-icon-mobile-phone', 1);
INSERT INTO `category` VALUES (5, '美食宝典', 'el-icon-ice-cream', 17);

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `goods_id` int(11) NOT NULL,
  `comment_detail` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `comment_rating` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`comment_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES (1, 136590526, 'good', 5, 5);
INSERT INTO `comments` VALUES (16, 136590526, 'nice', 5, 5);
INSERT INTO `comments` VALUES (17, 136590526, 'bad', 1, 8);
INSERT INTO `comments` VALUES (20, 65676090, 'success', 5, 5);
INSERT INTO `comments` VALUES (21, 65676090, 'error', 5, 5);
INSERT INTO `comments` VALUES (22, 6225284, '不好用', 2, 5);
INSERT INTO `comments` VALUES (23, 6225284, '还可以', 4, 5);
INSERT INTO `comments` VALUES (24, 8836407, '好吃', 5, 5);
INSERT INTO `comments` VALUES (25, 621723438, '强烈推荐', 5, 5);
INSERT INTO `comments` VALUES (26, 621723438, '毒鸡汤', 2, 9);
INSERT INTO `comments` VALUES (27, 5, '！！！', 4, 13);
INSERT INTO `comments` VALUES (28, 5, '啊啊啊', 0, 14);

-- ----------------------------
-- Table structure for homecasual
-- ----------------------------
DROP TABLE IF EXISTS `homecasual`;
CREATE TABLE `homecasual`  (
  `id` int(11) NOT NULL,
  `imgurl` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `detail` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of homecasual
-- ----------------------------
INSERT INTO `homecasual` VALUES (1, 'http://localhost:3000/images/home/s1.png', 'http://mobile.yangkeduo.com/subject.html?subject_id=6153');
INSERT INTO `homecasual` VALUES (2, 'http://localhost:3000/images/home/s2.png', 'http://mobile.yangkeduo.com/promotion_op.html?type=12&id=228');
INSERT INTO `homecasual` VALUES (3, 'http://localhost:3000/images/home/s3.png', 'http://mobile.yangkeduo.com/subject.html?subject_id=6242');
INSERT INTO `homecasual` VALUES (4, 'http://localhost:3000/images/home/s4.png', 'http://mobile.yangkeduo.com/subject.html?subject_id=6153');
INSERT INTO `homecasual` VALUES (5, 'http://localhost:3000/images/home/s5.png', 'http://mobile.yangkeduo.com/subject.html?subject_id=6230');
INSERT INTO `homecasual` VALUES (6, 'http://localhost:3000/images/home/s6.png', 'http://mobile.yangkeduo.com/promotion_op.html?type=12&id=190');
INSERT INTO `homecasual` VALUES (7, 'http://localhost:3000/images/home/s7.png', 'http://mobile.yangkeduo.com/promotion_op.html?type=12&id=229');
INSERT INTO `homecasual` VALUES (8, 'http://localhost:3000/images/home/s8.png', 'http://mobile.yangkeduo.com/subject.html?subject_id=6153');
INSERT INTO `homecasual` VALUES (9, 'http://localhost:3000/images/home/s9.png', 'http://mobile.yangkeduo.com/subject.html?subject_id=6242');

-- ----------------------------
-- Table structure for order_goods
-- ----------------------------
DROP TABLE IF EXISTS `order_goods`;
CREATE TABLE `order_goods`  (
  `order_id` int(20) DEFAULT NULL,
  `goods_id` int(20) DEFAULT NULL,
  `goods_count` int(20) DEFAULT NULL,
  `goods_price` decimal(10, 2) DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of order_goods
-- ----------------------------
INSERT INTO `order_goods` VALUES (7, 4, 1, 99999.00);
INSERT INTO `order_goods` VALUES (8, 4, 1, 99999.00);
INSERT INTO `order_goods` VALUES (9, 5, 2, 99799.00);
INSERT INTO `order_goods` VALUES (9, 21, 1, 99999.00);
INSERT INTO `order_goods` VALUES (10, 3, 4, 15800.00);

-- ----------------------------
-- Table structure for order_info
-- ----------------------------
DROP TABLE IF EXISTS `order_info`;
CREATE TABLE `order_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `orderStatus` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci DEFAULT NULL,
  `price` decimal(10, 2) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of order_info
-- ----------------------------
INSERT INTO `order_info` VALUES (2, 13, '帅比', '2', 99999.00);
INSERT INTO `order_info` VALUES (3, 13, '帅比', '2', 299597.00);
INSERT INTO `order_info` VALUES (4, 13, '帅比', '2', 99999.00);
INSERT INTO `order_info` VALUES (5, 13, '帅比', '2', 99999.00);
INSERT INTO `order_info` VALUES (6, 13, '帅比', '1', 99999.00);
INSERT INTO `order_info` VALUES (7, 13, '帅比', '1', 99999.00);
INSERT INTO `order_info` VALUES (8, 13, '帅比', '1', 99999.00);
INSERT INTO `order_info` VALUES (9, 13, '帅比', '1', 299597.00);
INSERT INTO `order_info` VALUES (10, 13, '帅比', '2', 63200.00);

-- ----------------------------
-- Table structure for recommend
-- ----------------------------
DROP TABLE IF EXISTS `recommend`;
CREATE TABLE `recommend`  (
  `goods_id` bigint(20) NOT NULL,
  `goods_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `short_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `thumb_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `hd_thumb_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `normal_price` int(11) DEFAULT NULL,
  `market_price` int(11) DEFAULT NULL,
  `sales_tip` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `category` int(11) DEFAULT NULL,
  `counts` int(11) DEFAULT NULL,
  `comments_count` int(11) DEFAULT NULL,
  `isActive` tinyint(10) DEFAULT 1,
  PRIMARY KEY (`goods_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of recommend
-- ----------------------------
INSERT INTO `recommend` VALUES (3, 'NIKE AIR JORDAN 11 AJ11男子黑红高帮实战篮球鞋 378037-061', 'AJ11男子黑红高帮实战篮球鞋', 'http://localhost:3000/uploads/upload_74bd3de383c4f95cc6af3d78b3756531.jpg', 'http://localhost:3000/uploads/upload_74bd3de383c4f95cc6af3d78b3756531.jpg', 'http://localhost:3000/uploads/upload_74bd3de383c4f95cc6af3d78b3756531.jpg', 99799, 99799300, 99799500, 'AJ11男子黑红高帮实战篮球鞋', 1, 1254, 0, 1);
INSERT INTO `recommend` VALUES (4, '匹克闪现态极篮球鞋男鞋路威秋季男鞋子耐磨防滑实战运动鞋球鞋男', '态极', 'http://localhost:3000/uploads/upload_77ee090bbb1b4dedf622bc43201ad71c.jpg', 'http://localhost:3000/uploads/upload_77ee090bbb1b4dedf622bc43201ad71c.jpg', 'http://localhost:3000/uploads/upload_77ee090bbb1b4dedf622bc43201ad71c.jpg', 37700, 37700300, 37700500, '态极篮球鞋', 1, 524, 0, 0);
INSERT INTO `recommend` VALUES (5, '帅气的gwc男鞋', 'gwc男鞋', 'http://localhost:3000/uploads/upload_c85191d1b1d32d9f547c396720a629c3.jpg', 'http://localhost:3000/uploads/upload_c85191d1b1d32d9f547c396720a629c3.jpg', 'http://localhost:3000/uploads/upload_c85191d1b1d32d9f547c396720a629c3.jpg', 372100, 372100300, 372100500, 'gwc男鞋', 1, 1232, 2, 1);
INSERT INTO `recommend` VALUES (21, 'sup女鞋冬季2020青少年粘扣鞋子中大童潮鞋韩版初高中学生气垫鞋', 'sup女鞋', 'http://localhost:3000/uploads/upload_ad51fc20e8c4c2d09b446511b216e51b.jpg', 'http://localhost:3000/uploads/upload_ad51fc20e8c4c2d09b446511b216e51b.jpg', 'http://localhost:3000/uploads/upload_ad51fc20e8c4c2d09b446511b216e51b.jpg', 15800, 15800300, 15800500, 'sup女鞋', 2, 3654, 0, 1);

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_pwd` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_phone` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_address` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_birthday` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_sign` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_nickname` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_avatar` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_email` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of user_info
-- ----------------------------
INSERT INTO `user_info` VALUES (1, '帅逼', '123456', '15078552193', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `user_info` VALUES (15, '水手', NULL, '15078552193', NULL, NULL, NULL, NULL, NULL, 'http://localhost:3000/avatar_uploads/avatar_default.jpg', '11@qq.com');
INSERT INTO `user_info` VALUES (16, '水手2', '111', '15078552193', NULL, NULL, NULL, NULL, NULL, 'http://localhost:3000/avatar_uploads/avatar_default.jpg', '11@qq.com');

SET FOREIGN_KEY_CHECKS = 1;
