const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function experience(userid, mapname, mapx, mapy, offlinenum, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(4200)
		console.log("第" + (count + 1) + "次历练");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/Map/experience',
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
				console.log("获得材料:" + msg.data.propInfo.name, "状态： 灵值" + msg.data.userLv.linExp, "武值" + msg.data.userLv.wuExp, "魂值" + msg.data.userLv.hunExp);
			}else if (msg.code == -3) {
				console.log("请求超时，同时运行多个脚本或游戏未退出，请检查！");
			}else {
				console.log(msg.msg);
			}
			// console.log(msg);
		});
	}
}
experience(27188, "殒神林1", 3, 7, 0, 100);