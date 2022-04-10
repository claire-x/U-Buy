/* use database 'ubuy' in mysql and execute codes below*/

DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `user_sid` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` varchar(200) NOT NULL,
  `createtime` varchar(25) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '0',
  `category` char(10) DEFAULT 'B', /* B is to find buyer, S is to find seller */
  `college` char(10) NOT NULL, /* preferred place */
  `object` char(20) NOT NULL,
  `if_matched` tinyint(4) DEFAULT '0',
  `price_min` int(5) NOT NULL,
  `price_max` int(5) NOT NULL,
  PRIMARY KEY (`id`)
) 