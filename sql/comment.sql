/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */

/* Create and use database 'upost' in mysql and execute codes below to create table and isert records*/

/* In database 'ubuy', you should also execute 'account.sql', but it may cause problem as newly registered
users will not be update to 'ubuy', only the 'account' table in 'ubuy' will be updated. 

I think it's their unobserved bug. You may fix it easily or just write the whole 'post' function from scratch (recommended).
*/

DROP TABLE IF EXISTS `comment`;
 
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `postid` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `content` varchar(200) NOT NULL,
  `createtime` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) 