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
				console.log("获得材料:" + msg.data.propInfo.name, "状态：" + "魂值" + msg.data.userStateInfo.hunMp + "/" + msg.data.userStateInfo.hunMpMax + " 魂" + msg.data.userLv.hunExp);
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
			} else {
				console.log(msg.msg);
			}
		});
	}
	task.next('打坐结束，开始下一步');
}

async function* main() {
	for (let count = 0; count < 5; count++) {
		yield dazuo(27188, "殒神林1", 3, 7, 6);
		yield collection(27188, "占雪狱7", 3, 7, 0, 9);
	}
}

const task = main()
task.next()