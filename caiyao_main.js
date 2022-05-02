const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function collection(userid, mapname, mapx, mapy, offlinenum, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(4200)
		console.log("第" + (count + 1) + "次采药");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/Map/collection',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"mapName": mapname,
				"mapX": mapx,
				"mapY": mapy,
				"offlineNum": offlinenum
			})
		};
		request(options, function (error, response) {
			// if (error) throw new Error(error);
			msg = JSON.parse(response.body);
			if (msg.code == 0) {
				console.log("获得材料:" + msg.data.propInfo.name, "状态：" + "魂值" + msg.data.userStateInfo.hunMp + "/" + msg.data.userStateInfo.hunMpMax + "魂值" + msg.data.userLv.hunExp);
			} else if (msg.code == -3) {
				console.log("请求超时，同时运行多个脚本或游戏未退出，请检查！");
			} else {
				console.log(msg.msg);
			}
			// console.log(msg);
		});
	}
	task.next('采药结束，开始下一步');
}
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
				console.log("请求超时，同时运行多个脚本或游戏未退出，请检查！");
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

// async function main() {
// 	collection(27188, "炎谷", 7, 8, 0, 27);
// 	await sleep(4200);
// 	dazuo(27188, "炎谷", 7, 8, 25);
// }
// main()

async function* main() {
	for (let count = 0; count < 1000; count++) {
		yield dazuo(27188, "炎谷", 7, 8, 37);
		yield collection(27188, "炎谷", 7, 8, 0, 27);
	}
}
const task = main()
task.next()