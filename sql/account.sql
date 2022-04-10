/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */

/* Create and use database 'ubuy' in mysql and execute codes below to create table and isert records*/

DROP TABLE IF EXISTS `account`;


CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `SID` int(10) NOT NULL,
  `name` varchar(25) NOT NULL DEFAULT 'Anynomous',
  `password` varchar(64) NOT NULL,
  `gender` char(1) DEFAULT 'F',
  `state` int(1) NOT NULL DEFAULT '0',
  `code` varchar(6) DEFAULT NULL,
  `judgement_times` int(8) NOT NULL DEFAULT '0',
  `total_scores` int(10) NOT NULL DEFAULT '0',
  
  PRIMARY KEY (`id`)
);

INSERT INTO `account` VALUES (523,1155124736,"XUSERNAMEX","e10adc3949ba59abbe56e057f20f883e","F",1,268057,0,0),(886,1155000000,'JOHNNN','e10adc3949ba59abbe56e057f20f883e','M',1,'654321',0,0);

select * from account;