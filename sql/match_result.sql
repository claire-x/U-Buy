/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
DROP TABLE IF EXISTS `match_result`;
CREATE TABLE `match_result` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id1` varchar(45) NOT NULL,
    `user_id2` varchar(45) NOT NULL,
    `object` varchar(45) NOT NULL,
    `result` tinyint(1) NOT NULL,
    `res1` tinyint(1) DEFAULT NULL,
    `res2` tinyint(1) DEFAULT NULL,
    PRIMARY KEY (`id`)
);