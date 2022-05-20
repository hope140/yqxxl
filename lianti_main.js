async function lianti(userid, offlinenum) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Map/liantiStart',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"offlineNum": offlinenum
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.msg + " 气血：" + msg.data.userStateInfo.hp + "/" + msg.data.userStateInfo.hpMax + " 灵：" + msg.data.userStateInfo.linMp + "/" + msg.data.userStateInfo.linMpMax + " 武值" + msg.data.userLv.wuExp);
			state = [msg.code, msg.data.userStateInfo.hp, msg.data.userStateInfo.hpMax, msg.data.userStateInfo.linMp, msg.data.userStateInfo.linMpMax];
		} else {
			console.log(msg.msg);
			state = [msg.code, 0, 0, 0, 0];
		}
	});
	// task.next('炼体结束，开始下一步');
}

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
			console.log("气血:" + msg.data.userStateInfo.hp + "/" + msg.data.userStateInfo.hpMax + " 灵：" + msg.data.userStateInfo.linMp + "/" + msg.data.userStateInfo.linMpMax + " 魂：" + msg.data.userStateInfo.hunMp + "/" + msg.data.userStateInfo.hunMpMax);
			userstate = [msg.code, msg.data.userStateInfo.hp, msg.data.userStateInfo.hpMax, msg.data.userStateInfo.linMp, msg.data.userStateInfo.linMpMax];
		} else {
			console.log(msg.msg);
			userstate = [msg.code, 0, 0, 0, 0];
		}
		return userstate;
	});
	// task.next("一轮打坐结束");
}

// 4200毫秒间隔，气血满后自动停止打坐

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function* main(userid, mapname, mapx, mapy, offlinenum) {
	for (let count = 0; count < 100; count++) {
		console.log("第" + (count + 1) + "次炼体");
		try {
			state = await lianti(userid, offlinenum);
			await sleep(4200);
			if (state[0] == 0 && state[1] < state[2]/10) throw ("气血不足");
			if (state[0] == 0 && state[3] < state[4]/10) throw ("灵气不足");
		} catch (Error) {
			console.log("***" + Error + " 开始打坐***");
			for (let count = 0; count < 30; count++) {
				console.log("第" + (count + 1) + "次打坐");
				userstate = await dazuo(userid, mapname, mapx, mapy);
				await sleep(4200);
				if (userstate[0] == 0 && userstate[1] === userstate[2] && userstate[3] === userstate[4]) {
					console.log("***状态已满，结束***");
					break;
				}
			}
		}
	}
}
//  ID 打坐地图名称 x轴位置 y轴位置 使用元气数量 气血消耗 灵气消耗（消耗没必要写真实值，写大点更稳定）
const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "殒神林2", 1, 2, 0)
task.next()