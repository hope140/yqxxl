async function collection(userid, mapname, mapx, mapy, offlinenum) {
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
		} else if (msg.code == -3) {
			console.log("请求超时，同时运行多个脚本或游戏未退出，请检查！");
		} else {
			console.log(msg.msg);
		}
		// console.log(msg);
	});
	task.next("一轮采药结束");
}


const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function* main(userid, mapname, mapx, mapy, offlinenum) {
	for (let count = 0; count < 100; count++) {
		console.log("***第" + (count + 1) + "次采药***");
		collection(userid, mapname, mapx, mapy, offlinenum);
		await sleep(4200)
	}
}
// ID 采药地图名称 x轴位置 y轴位置 使用元气数量
const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "殒神林1", 3, 7, 0)
task.next()