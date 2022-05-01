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
				console.log("获得材料:" + msg.data.propInfo.name, "状态：" + "魂值" + msg.data.userStateInfo.hunMp + "/" + msg.data.userStateInfo.hunMpMax);
			}else if (msg.code == -3) {
				console.log("请求超时，同时运行多个脚本或游戏未退出，请检查！");
			}else {
				console.log(msg.msg);
			}
			// console.log(msg);
		});
	}
}
// collection(20487, "幽木林1", 3, 7, 0, 15);
dazuo(27188, "炎谷", 7, 8, 25);