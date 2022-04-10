/* use database 'ubuy' in mysql and execute codes below*/
DROP TABLE IF EXISTS `match_result`;
CREATE TABLE `match_result` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id1` varchar(45) NOT NULL,    /* the buyer's uid*/
    `user_id2` varchar(45) NOT NULL,    /* the seller's uid*/
    `object` varchar(45) NOT NULL,
    `result` tinyint(1) NOT NULL,
    `res1` tinyint(1) DEFAULT NULL,     
    `res2` tinyint(1) DEFAULT NULL,
    `pid1` varchar(11) DEFAULT NULL,        /* the buyer's post id */
    `pid2` varchar(11) DEFAULT NULL,        /* the seller's post id */
    `remark1` varchar(200) NOT NULL,
    `remark2` varchar(200) NOT NULL,
    PRIMARY KEY (`id`)
);
