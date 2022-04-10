# put this table in ubuy database negotiation phase no conclusion: 0
#seller agree: 1, buyer agree:2, both of sides agree:3
DROP TABLE IF EXISTS `negotiation_record`;

CREATE TABLE `negotiation_record` (
  `uid` int(11) NOT NULL ,
  `buyer_id` int(10) NOT NULL,
  `seller_id` int(10) NOT NULL,
  `negotiation_prase` int(2) NOT NULL,

  PRIMARY KEY (`uid`,`buyer_id`,`seller_id`)
);


