const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function getGameCopyInfo(userid) {
	await sleep(100)
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/GameCopy/getGameCopyInfo',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid
		})
	};
	request(options, function (error, response) {
		// if (error) throw new Error(error);
		msg = JSON.parse(response.body);
	});
	task.next('刷新讨伐邪魔次数结束，开始下一步');
}

async function gainprop(userid, gainpropid, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(4500)
		console.log("使用法宝");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/GainProp/useGainProp',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"gainPropId": gainpropid,
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
	task.next("法宝进入冷却");
}
// 法宝使用，现所有主动法宝，最好配合定时任务使用

async function* main(userid) {
	yield getGameCopyInfo(userid);
	yield gainprop(userid, 1, 1);
	yield gainprop(userid, 2, 1);
	yield gainprop(userid, 3, 1);
	yield gainprop(userid, 7, 1);
	yield gainprop(userid, 14, 1);
	yield gainprop(userid, 19, 1);

}
const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a")
task.next()