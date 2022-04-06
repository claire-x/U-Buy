/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
DROP TABLE IF EXISTS `ready_match`;
CREATE TABLE `ready_match`(
    `request_id` int(11) NOT NULL AUTO_INCREMENT,
    `user_sid` char(20) NOT NULL,
    `category` char(1) DEFAULT NULL, /* B is to find buyer, S is to find seller */
    `college` char(10) NOT NULL, /* preferred place */
    `object` char(20) NOT NULL,
    `if_matched` tinyint(4) DEFAULT NULL,
    `price_min` int(5) NOT NULL,
    `price_max` int(5) NOT NULL,
    PRIMARY KEY (`request_id`)
);

