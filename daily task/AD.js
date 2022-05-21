// 刷新广告状态返回，有待观察
async function getUserADInfo(userid) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Shop/getUserADInfo',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'userId': userid
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.msg);
		} else {
			console.log(msg.msg);
		}
	});
}
async function AD(userid) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Shop/getADGift',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			'userId': userid
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.msg);
		} else {
			console.log(msg.msg);
		}
	});
}
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function* main(userid) {
	console.log("***刷新广告状态***");
	await getUserADInfo(userid);
	await sleep(1000);
	console.log("***领取奖励***");
	await AD(userid);
}
const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a");
task.next();