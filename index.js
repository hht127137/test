//创建express的应用程序
var express=require("express");
var app=express();
//连接数据库MongoClient
var MongoClient=require("mongodb").MongoClient
var goodsdbUrl="mongodb://127.0.0.1:27017/goodslist"

//设置跨域访问
app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

//查询
app.get("/",function(req,res,next){
	MongoClient.connect(goodsdbUrl,{useUnifiedTopology: true},function(err,db){
		if(err){
			console.log("连接失败")
			return;
		}
		var result=[]
		var dbase=db.db("goodslist");
		var userRel=dbase.collection("goods").find();
		userRel.toArray(function(err,doc){
			if(err){
				console.log("遍历失败");
				return;
			}
			result.push(doc)
			db.close();
			res.json({status:200,data:result})
		})
	})
})

app.listen(3000)