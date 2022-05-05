/* ref: https://github.com/LI-YUXIN-Ryan-Garcia/CUPar-CSCI3100-Project.git */
var mysql = require('mysql');
var config = require('../config').config;

function create_pool(){
    return (mysql.createPool({
        host    : 'localhost',
        user    : config.db_user,
        password: config.db_pwd,
        port    : '3306',
        database: config.db_name,
        userConnectionPooling: true,
        connectionLimit: 500
    }));
}

var pool = new create_pool()

// find user info given user sid
exports.select_user_data = function(sid, callback){
    let sql = 'SELECT * FROM account WHERE BINARY `sid`="' + sid + '"'
    pool.query(sql, function(err, user_list){
        if(err){
            console.error("Error: select_user_data():")
            console.error(err)
            console.error('--------------------')
        }
        if(user_list && typeof callback == 'function'){
            callback(user_list)
            return user_list[0]
        }
    })
}

// find all user info given user sid
exports.select_all_user = function (callback) {
    let sql = 'SELECT * FROM account'
    pool.query(sql, function (err, user_list) {
        if (err) {
            console.error("Error: select_all_data():")
            console.error(err)
            console.error('--------------------')
        }
        if (user_list && typeof callback == 'function') {
            callback(user_list)
            return user_list
        }
    })
}

// verify user identity
exports.verify_user_identity = function(sid, password, callback){
    let sql = 'SELECT * FROM account WHERE `sid`="' + sid +
                '" AND `password`="' + password + '"'
    pool.query(sql, function(err, user_list){
        if(err) {print_func_err('verify_user_identity', err)}
        if(user_list && typeof callback == 'function'){
            callback(user_list)
            return user_list[0]
        }
    })
}

// verify admin identity
exports.verify_admin_identity = function (aid, password, callback) {
    let sql = 'SELECT * FROM admin_account WHERE `aid`="' + aid +
        '" AND `password`="' + password + '"'
    pool.query(sql, function (err, admin_list) {
        if (err) { print_func_err('verify_admin_identity', err) }
        if (admin_list && typeof callback == 'function') {
            callback(admin_list)
            return admin_list[0]
        }
    })
}

// add inactive user
exports.insert_unactive_user = function(sid, name, code, callback){
    let sql = 'INSERT INTO ?? (??,??,??,??,??,??) VALUES (?,?,?,?,?,?)'
    let params = [config.tb_account].concat(config.tb_account_params)
    params = params.concat([sid, name, '123456', 'F', 0, code])
    sql_stm = mysql.format(sql, params)
    console.debug(sql_stm)
    pool.query(sql_stm, function(err, res){
        if(err){throw err}
        if(res && typeof callback == 'function'){
            callback(res)
            console.log(res.insertID)  
        }
    })
    console.error("Error:  insert_unactive_user():")
}

// update user info
exports.update_user = function(sid, data, callback){
    let params_keys = Object.keys(data)
    let params_array = params_keys.map(key => "`" + key + "`='" + data[key] + "'")
    let params_str = params_array.join(',')
    let sql = 'UPDATE `ubuy`.`account` SET ' + params_str + ' WHERE `sid`=' + sid;
    console.debug('sql statement is:', sql)
    try{
        pool.query(sql, function(err, res){
            if(err) {throw err}
            if(res && typeof callback == 'function'){
                callback()
                console.log('Number of affected rows:', res.affectedRows)
            }
        })
    }catch(err){
        console.error('Error:  update_user() ')
        console.error(err)
    }
}

print_func_err = function(name,err){
    console.error("Error: " + name + "():")
    console.error(err)
    console.error('<=----------------------------------------=>')
}
