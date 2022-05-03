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
}
dazuo(27188, "幽木林4", 3, 7, 15);