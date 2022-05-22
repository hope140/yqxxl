// 打坐函数 参数：用户ID, 打坐地点, 地图x轴位置, 地图y轴位置
// 打坐函数 返回值：气血
async function dazuo(userid, mapname, mapx, mapy) {
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
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`气血:${msg.data.userStateInfo.hp}/${msg.data.userStateInfo.hpMax} 灵：${msg.data.userStateInfo.linMp}/${msg.data.userStateInfo.linMpMax} 魂：${msg.data.userStateInfo.hunMp}/${msg.data.userStateInfo.hunMpMax}`);
			userstate = [msg.code, msg.data.userStateInfo.hp, msg.data.userStateInfo.hpMax, msg.data.userStateInfo.linMp, msg.data.userStateInfo.linMpMax, msg.data.userStateInfo.hunMp, msg.data.userStateInfo.hunMpMax];
		} else {
			console.log(msg.msg);
			userstate = [msg.code, 0, 0, 0 ,0, 0, 0];
		}
		return userstate;
	});
}

// 主函数 4200毫秒间隔，气血满后自动停止打坐

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function sit(userid, mapname, mapx, mapy) {
	for (let count = 0; count < 30; count++) {
		console.log(`第${count + 1}次打坐`);
		userstate = await dazuo(userid, mapname, mapx, mapy);
		await sleep(4200);
		if (userstate[0] == 0 && userstate[1] === userstate[2] && userstate[3] === userstate[4] && userstate[5] === userstate[6]) {
			console.log("***状态已满，结束***");
			break;
		}
	}
}
// ID 打坐地图名称 x轴位置 y轴位置
sit("4837a285-bb1a-4f9a-886e-946a3e11597a", "殒神林2", 4, 2, 0)