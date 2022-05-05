// 历练函数 参数：用户ID, 历练地点, 地图x轴位置, 地图y轴位置, 使用元气数量
async function experience(userid, mapname, mapx, mapy, offlinenum) {
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
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log("获得材料:" + msg.data.propInfo.name, "状态：灵值" + msg.data.userLv.linExp, "武值" + msg.data.userLv.wuExp, "魂值" + msg.data.userLv.hunExp);
		} else {
			console.log(msg.msg);
		}
		// console.log(msg);
	});
	task.next("一轮历练结束");
}
// 主函数，打不过怪会报错
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function* main(userid, mapname, mapx, mapy, offlinenum) {
	for (let count = 0; count < 100; count++) {
		console.log("第" + (count + 1) + "次历练");
		yield experience(userid, mapname, mapx, mapy, offlinenum);
		await sleep(4200);
	}
}

// ID 历练地图名称 x轴位置 y轴位置 使用元气数量
const task = main(27188, "殒神林1", 3, 2, 0)
task.next()