//  吃九转，没啥用
async function useDrug(userid, bagid) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Drug/useDrug',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"bagId": bagid
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.msg);
		} else {
			console.log(msg.msg);
		}
	});
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
}
// 抗雷函数 参数：用户ID, 抗雷消耗类型
async function handle(userid, type) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Drug/danleiHandLe',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"type": type
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`${msg.data.msg} 丹雷剩余：${msg.data.userMakeDrug.danleiHp}/${msg.data.userMakeDrug.danleiHpMax}`);
			drughp = [msg.code, msg.data.userMakeDrug.danleiHp, msg.data.userMakeDrug.danleiHpMax];
		} else {
			console.log(msg.msg);
			drughp = [msg.code, 0, 0];
		}
		return drughp;
	});
}

// 4000毫秒间隔，状态满后自动停止打坐

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function main(userid, mapname, mapx, mapy) {
	console.log("***开始抗雷***");
	for (let count = 0; count < 30; count++) {
		try {
			drughp = await handle(userid, 1);
			await sleep(300);
			drughp = await handle(userid, 2);
			await sleep(300);
			if (drughp[0] == 0 && drughp[1] > 0) throw ("丹雷未消散");
			if (drughp[0] == -1 && drughp[3] !== "异常信息") throw (msg.msg);
			if (drughp[0] == 0 && drughp[1] < 0) break;
			if (drughp[0] == -1 && drughp[3] == "异常信息") break;
		} catch (error) {
			console.log(`***${error}，打坐***`);
			userstate = await dazuo(userid, mapname, mapx, mapy);
			await sleep(4000);
		}
	}
	console.log("***最后一轮打坐***");
	for (let count = 0; count < 30; count++) {
		console.log(`第${count + 1}次打坐`);
		userstate = await dazuo(userid, mapname, mapx, mapy);
		await sleep(4000);
		if (userstate[0] == 0 && userstate[1] === userstate[2] && userstate[3] === userstate[4] && userstate[5] === userstate[6]) {
			console.log("***状态已满，结束***");
			break;
		}
	}
}
// ID 打坐地图名称 x轴位置 y轴位置
main("4837a285-bb1a-4f9a-886e-946a3e11597a", "无极山1", 4, 2, 0)