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
}
// // 刷新远征
// async function getGameCopyInfo(userid) {
// 	await sleep(100)
// 	var request = require('request');
// 	var options = {
// 		'method': 'POST',
// 		'url': 'https://yqxxl.yqbros.com/Yqxxl/GameCopy/getGameCopyInfo',
// 		'headers': {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify({
// 			"userId": userid
// 		})
// 	};
// 	request(options, function (error, response) {
// 		// if (error) throw new Error(error);
// 		msg = JSON.parse(response.body);
// 	});
// }
// // 刷新法宝
// async function getUserGainPropInfo(userid) {
// 	await sleep(100)
// 	var request = require('request');
// 	var options = {
// 		'method': 'POST',
// 		'url': 'https://yqxxl.yqbros.com/Yqxxl/GainProp/getUserGainPropInfo',
// 		'headers': {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify({
// 			"userId": userid
// 		})
// 	};
// 	request(options, function (error, response) {
// 		// if (error) throw new Error(error);
// 		msg = JSON.parse(response.body);
// 	});
// }
// // 刷新灵石
// async function getUserSuperStoneInfo(userid) {
// 	await sleep(100)
// 	var request = require('request');
// 	var options = {
// 		'method': 'POST',
// 		'url': 'https://yqxxl.yqbros.com/Yqxxl/SuperStone/getUserSuperStoneInfo',
// 		'headers': {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify({
// 			"userId": userid
// 		})
// 	};
// 	request(options, function (error, response) {
// 		// if (error) throw new Error(error);
// 		msg = JSON.parse(response.body);
// 	});
// }
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
				console.log(msg.msg.replace("异常操作", "没有刷出该任务"));
			}
		});
	}
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
			console.log(msg.data.msg.replace("获得", "领取成功,当前共有"));
		} else {
			console.log(msg.msg);
		}
	});
}

async function main(userid) {
	await findUserTask(userid);
	// await getGameCopyInfo(userid);
	// await getUserGainPropInfo(userid);
	// await getUserSuperStoneInfo(userid);
	await sleep(1000);
	for (let i = 1; i < 2; i++) {
		console.log("***每日签到***")
		await rewards(userid, 5, i, 1);
		await sleep(1000)
	}
	console.log('***每日任务开始***');
	for (let i = 1; i < 11; i++) {
		console.log("每日任务" + i);
		await rewards(userid, 0, i, 1);
		await sleep(1000)
	}
	for (let i = 2; i > 0; i--) {
		console.log("***宝箱领取***");
		await taskreward(userid, i, 1);
		await sleep(1000)
	}
	console.log("***药田次数领取***");
	await getFieldGift(userid);
}
main("4837a285-bb1a-4f9a-886e-946a3e11597a")