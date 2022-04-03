
/* (Create and) use database 'ubuy' in mysql and execute codes below to create table and isert records*/

DROP TABLE IF EXISTS `admin_account`;

CREATE TABLE `admin_account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `aid` int(10) NOT NULL,
  `name` varchar(25) NOT NULL DEFAULT 'Anynomous',
  `password` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `admin_account` VALUES (1,123456,'Administrator','e10adc3949ba59abbe56e057f20f883e');
