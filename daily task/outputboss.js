async function getGameCopyInfo(userid) {
	console.log("***获取当前远征状态***");
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
		if (msg.code == 0) {
			console.log("讨伐邪魔剩余次数" + msg.data.userGameCopyInfo.level3Num);
			maxrun = msg.data.userGameCopyInfo.level3Num;
		} else {
			console.log(msg.msg);
			maxrun = 0;
		}
		return maxrun;
	});
}

async function output(userid, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(1000)
		console.log("第" + (count + 1) + "次讨伐");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/GameCopy/outPutBoss',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
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

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function* main(userid) {
	maxrun = await getGameCopyInfo(userid);
	await sleep(1000);
	if (maxrun > 0) {
		await output(userid, maxrun);
	}
}
const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a");
task.next();

// "gameCopyBossInto": {
// 	"id": 1,
// 	"lastHp": 19192538,
// 	"name": "武灵魔尊",
// 	"nowHp": 18447788,
// 	"state": 1,
// 	"value": "武灵无效，魂四倍伤害",
// 	"weekDieNum": 11
// }