/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `SID` int(10) NOT NULL,
  `name` varchar(25) NOT NULL DEFAULT 'Anynomous',
  `password` varchar(64) NOT NULL,
  `gender` char(1) DEFAULT 'F',
  `state` int(1) NOT NULL DEFAULT '0',
  `code` varchar(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

INSERT INTO `account` VALUES (32,1155124736,"XUSERNAMEX","e10adc3949ba59abbe56e057f20f883e","F",1,268057),(1,1155000000,'Administrator','e10adc3949ba59abbe56e057f20f883e','M',1,'654321');
