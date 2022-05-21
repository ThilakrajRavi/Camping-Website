const mysql = require("mysql");

const db = mysql.createConnection({
    host    : "localhost",
    user    : "root",
    password    : "",
    database    : "test"
});

db.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log("connected to database test");
    }
});


exports.getUser = function(id, callback){
    let sql = `SELECT * From users WHERE id = ?`;
    db.query(sql, [id], function(err, data){
        if(err){
            callback(err);
        }else{
            callback(null, data);
        }
    })
}

exports.insertUser = function(data, callback){
    let sql = "INSERT into users set ?";

    db.query(sql, [data], function(err, result){
        if(err){
            callback(err);
        }else{
            callback(null, result);
        }
    })
}

exports.updateUser = function(id, data, callback){
    let sql = "update users set ? where id = ?";
    db.query(sql, [data, id], function(err, data){
        if(err){
            callback(err);
        }else{
            callback(null, data);
        }
    })
}

exports.deleteUser = function(id, callback){
    let sql = "DELETE from users where id = ?";
    db.query(sql, [id],function(err, data){
        if(err){
            callback(err);
        }else{
            callback(null, data);
        }
    })
}