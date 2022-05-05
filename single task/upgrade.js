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
				// var userState = {
				// 			"hp": 1,
				// 			"hpMax": 2,
				// 			"linMp": 1,
				// 			"linMpMax": 2,
				// 			"hunMp": 1,
				// 			"hunMpMax": 2,
				// };
			} else {
				console.log(msg.msg);
			}
		});
		// console.log(msg);
		// if (msg.data.userStateInfo.hp === msg.body.data.userStateInfo.hpMax) {
		// 	console.log("气血已满，结束");
		// 	break;
		// }
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
		yield upgrade(20487, 2);
		yield dazuo(20487, "琳琅境1", 3, 2, 100);
	}
}
const task = main()
task.next()