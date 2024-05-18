/**
 * SteamUser example - BasicBot
 *
 * Simply logs into Steam using account credentials, goes online on friends, and launches Team Fortress 2
 */

const SteamUser = require('steam-user'); // Replace this with `require('steam-user');` if used outside of the module directory
const GlobalOffensive = require('./index');

let client = new SteamUser();
let csgo = new GlobalOffensive(client);
client.logOn({
	accountName: '17612180840',
	password: 'mlzx950526'
});

client.on('loggedOn', function(details) {
	console.log('Logged into Steam as ' + client.steamID.getSteam3RenderedID());
	// client.gamesPlayed([730]);
	console.log("loggedOn, session=" + csgo.haveGCSession);
});

client.on("playingState", function (blocked, playingApp) {
	console.log("playingState " + blocked + "  app " + playingApp)
	if (blocked) {
		console.log(`Started playing somewhere (blocked: ${blocked}) Awaiting until disconnect`);
	} else {
		client.gamesPlayed([730]);
	}

})

client.on('error', function(e) {
	// Some error occurred during logon
	console.log(e);
});

csgo.on('connectedToGC', (reason) => {
	console.log("connectedToGC");
});


csgo.on('craftingComplete', (recipe, itemsGained) => {
	console.log("craftingComplete " + JSON.stringify(recipe) + ", " + JSON.stringify(itemsGained));
});

csgo.on('itemRemoved', (item) => {
	console.log("itemRemoved " + JSON.stringify(item));
});

csgo.on('itemAcquired', (item) => {
	console.log("get a new item, " + JSON.stringify(item));
});

csgo.on('disconnectedFromGC', (reason) => {
	if (reason == GlobalOffensive.GCConnectionStatus.GC_GOING_DOWN) {
		console.log('GC going down');
	}
});

csgo.on('debug', (reason) => {
	console.log(reason)
});
const express = require('express');
const app = express();
const cors = require('cors');
const url = require('url');
const querystring = require('querystring');
const {response} = require("express");

// 处理跨域中间件
app.use(cors())
// 处理JSON表单格式中间件
app.use(express.json());
// const app = express();
// 处理application/x-www-form-urlencoded表单格式的中间件
app.use(express.urlencoded({ extended: false }))
// okk
app.get('/okk', (req, res)=>{
	res.send({
		status: 200,
		data: "okk",
		message: '请求成功'
	});
})


app.get('/gameAllServerIps', (req, res)=>{
	Promise.all([client.getServerList("", 10, function (){
		console.log("getServerList callback")
	})]).then(result => {
		res.send({
			status: 200,
			data: result || "failed",
			message: '请求成功'
		});
	});

})

app.get('/gameServerIps', (req, res)=>{
	Promise.all([client.getServerIPsBySteamID(["76561198417899069"], function (){
		console.log("getServerList callback")
	})]).then(result => {
		res.send({
			status: 200,
			data: result || "failed",
			message: '请求成功'
		});
	});
})

app.get('/csgoStatus', (req, res)=>{

	res.send({
		status: 200,
		data: csgo.haveGCSession,
		message: 'POST请求成功'
	});
})

// 获取交易链接
app.get('/unlockCrate', (req, res)=>{
	csgo.unlockCrate(req.query.boxId, req.query.keyId);
	res.send({
		status: 200,
		data: null,
		message: 'POST请求成功'
	});


})

// 获取交易链接
app.get('/deleteItem', (req, res)=>{
	try{
		csgo.deleteItem(req.query.itemId);
	}catch (error){
		console.log(error)
	}

	res.send({
		status: 200,
		data: null,
		message: 'POST请求成功'
	});

})

// 启动服务器，并监听端口8080
app.listen(5000, () => {
	console.log('express server running at http://127.0.0.1')
})