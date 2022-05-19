const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function rewards(userid, type, id, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(4200)
		console.log("每日任务");
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
				console.log(msg.msg);
			} else {
				console.log(msg.msg);
			}
			// console.log(msg);
		});
	}
	task.next('每日任务结束，开始下一步');
}
async function taskreward(userid, type, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(4200)
		console.log("宝箱领取");
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
				console.log(msg.msg);
			} else {
				console.log(msg.msg);
			}
		});
	}
	task.next('宝箱领取结束，开始下一步');
}
// 遍历所有的每日任务，然后领取每日宝箱，从9点宝箱开始

async function* main() {
	for (let count = 0; count < 1; count++) {
		for (let i = 0; i < 10; i++) {
			yield rewards("4837a285-bb1a-4f9a-886e-946a3e11597a", 0, i, 1);
		}
		for (let i = 3; i > 1; i--) {
			yield taskreward("4837a285-bb1a-4f9a-886e-946a3e11597a", i, 1);
		}
		for (let i = 0; i < 2; i++) {
			yield rewards("4837a285-bb1a-4f9a-886e-946a3e11597a", 5, i, 1);
		}
	}
}
const task = main()
task.next()