/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */

/* (Create and) use database 'upost' in mysql and execute codes below to create table and isert records*/

DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `content` varchar(200) NOT NULL,
  `createtime` varchar(25) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) 