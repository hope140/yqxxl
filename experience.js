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
			console.log(`获得材料:${msg.data.propInfo.name}`, `状态：灵值${msg.data.userLv.linExp}`, `武值${msg.data.userLv.wuExp}`, `魂值${msg.data.userLv.hunExp}`);
			state = [msg.code, msg.data.userStateInfo.hp, msg.data.userStateInfo.hpMax, msg.data.userStateInfo.linMp, msg.data.userStateInfo.linMpMax, msg.data.userStateInfo.hunMp, msg.data.userStateInfo.hunMpMax];
		} else {
			console.log(msg.msg);
			state = [msg.code, 0, 0, 0, 0, 0, 0];
		}
		return state;
	});
	// task.next("一轮历练结束");
}

// 打坐函数 参数：用户ID, 打坐地点, 地图x轴位置, 地图y轴位置
// 打坐函数 返回值：魂力
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
			userstate = [msg.code, 0, 0, 0, 0, 0, 0];
		}
		return userstate;
	});
	// task.next("一轮打坐结束");
}

// 主函数，打不过怪会报错
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function* main(userid, mapname, sitmap, mapx, mapy, offlinenum) {
	for (let count = 0; count < 100; count++) {
		console.log(`第${count + 1}次历练`);
		try {
			state = await experience(userid, mapname, mapx, mapy, offlinenum);
			await sleep(4200);
			if (state[0] == 0 && state[1] < state[2] / 10 ) throw ("气血不足");
			if (state[0] == 0 && state[3] < state[4] / 10 ) throw ("灵力不足");
			if (state[0] == 0 && state[5] < state[6] / 10 ) throw ("魂力不足");
			if (state[0] == -2) throw ("身体被掏空");
		} catch (error) {
			console.log(`***${error}，开始打坐***`);
			for (let count = 0; count < 25; count++) {
				console.log(`第${count + 1}次打坐`);
				userstate = await dazuo(userid, sitmap, mapx, mapy);
				await sleep(4200);
				if (userstate[0] == 0 && userstate[1] === userstate[2] && userstate[3] === userstate[4] && userstate[5] === userstate[6]) {
					console.log("***状态已满，打坐结束***");
					break;
				}
			}
		}
	}
}

// ID 历练地图名称 x轴位置 y轴位置 使用元气数量
const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "无极山1", "殒神林2",1, 2, 0)
task.next()