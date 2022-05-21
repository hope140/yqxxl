const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function findUserTask(userid) {
	await sleep(100)
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Task/findUserTask',
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
	task.next('刷新任务完成');
}
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

async function rewards(userid, type, id, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/Task/receiveRewards',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"type": type,
				"id": id
			})
		};
		request(options, function (error, response) {
			// if (error) throw new Error(error);
			msg = JSON.parse(response.body);
			if (msg.code == 0) {
				console.log(msg.data.msg);
			} else {
				console.log(msg.msg.replace("异常操作", "该任务不存在"));
			}
		});
	}
	task.next('每日任务结束，开始下一步');
}
async function taskreward(userid, type, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/Task/getDailyTaskReward',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"type": type
			})
		};
		request(options, function (error, response) {
			// if (error) throw new Error(error);
			msg = JSON.parse(response.body);
			if (msg.code == 0) {
				console.log(msg.data.msg);
			} else {
				console.log(msg.msg);
			}
		});
	}
	task.next('宝箱领取结束，开始下一步');
}
// 遍历所有的每日任务，然后领取每日宝箱，从9点宝箱开始

async function getFieldGift(userid) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Field/getFieldGift',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid
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
	task.next('药田次数领取结束，开始下一步');
}


async function* main(userid) {
	yield findUserTask(userid);
	yield getGameCopyInfo(userid);
	// console.log('***每日任务开始***');
	for (let i = 1; i < 11; i++) {
		console.log("每日任务" + i);
		yield rewards(userid, 0, i, 1);
		await sleep(1000)
	}
	for (let i = 2; i > 0; i--) {
		console.log("***宝箱领取***");
		yield taskreward(userid, i, 1);
		await sleep(1000)
	}
	for (let i = 1; i < 2; i++) {
		console.log("***每日签到***")
		yield rewards(userid, 5, i, 1);
		await sleep(1000)
	}
	console.log("***药田次数领取***");
	yield getFieldGift(userid);
}
const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a")
task.next()