const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function dazuo(userid, mapname, mapx, mapy, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(4200)
		console.log("第" + (count + 1) + "次打坐");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/User/startDaZuo',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"mapName": mapname,
				"mapX": mapx,
				"mapY": mapy
			})
		};
		request(options, function (error, response) {
			// if (error) throw new Error(error);
			msg = JSON.parse(response.body);
			if (msg.code == 0) {
				console.log("气血:" + msg.data.userStateInfo.hp + "/" + msg.data.userStateInfo.hpMax + " 灵：" + msg.data.userStateInfo.linMp + "/" + msg.data.userStateInfo.linMpMax + " 魂：" + msg.data.userStateInfo.hunMp + "/" + msg.data.userStateInfo.hunMpMax);
				userState = msg.data.userStateInfo;
			} else if (msg.code == -3) {
				console.log(msg.msg);
			} else {
				console.log(msg.msg);
			}
		});
	}
	task.next('打坐结束，开始下一步');
}

async function upgrade(userid, type) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/User/upgradeLv',
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
			console.log(msg.data.msg + " 等级：" + msg.data.userLv.wuLv + "级武者" + msg.data.userLv.linLv + "级灵者" + msg.data.userLv.hunLv + "级炼药师");
		} else {
			console.log(msg.msg);
		}
	});
	task.next('升级结束，开始下一步');
}

async function* main() {
	for (let count = 0; count < 60; count++) {
		yield upgrade(27188, 2);
		yield dazuo(27188, "炎谷", 7, 8, 25);
	}
}
const task = main()
task.next()