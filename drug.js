async function makeDrug(userid, drugid, lists, lv) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Drug/makeDrug',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"drugId": drugid,
			"lists": lists,
			"lv": lv
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.msg + " 丹雷状态" + msg.data.userMakeDrug.danleiHp + "/" + msg.data.userMakeDrug.danleiHpMax);
			drugstate = [msg.code, msg.data.userMakeDrug.danleiHp, msg.data.userMakeDrug.danleiHpMax];
		} else {
			console.log(msg.msg);
			drugstate = [msg.code, 0, 0];
		}
		return drugstate;
	});
}

// 吃九转，没啥用
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
			console.log("气血:" + msg.data.userStateInfo.hp + "/" + msg.data.userStateInfo.hpMax + " 灵：" + msg.data.userStateInfo.linMp + "/" + msg.data.userStateInfo.linMpMax + " 魂：" + msg.data.userStateInfo.hunMp + "/" + msg.data.userStateInfo.hunMpMax);
			userstate = [msg.code, msg.data.userStateInfo.hp, msg.data.userStateInfo.hpMax, msg.data.userStateInfo.linMp, msg.data.userStateInfo.linMpMax, msg.data.userStateInfo.hunMp, msg.data.userStateInfo.hunMpMax];
		} else {
			console.log(msg.msg);
			userstate = [msg.code, 0, 0, 0, 0, 0, 0];
		}
		return userstate;
	});
	// task.next("一轮打坐结束");
}

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
			console.log(msg.data.msg + " 丹雷剩余：" + msg.data.userMakeDrug.danleiHp + "/" + msg.data.userMakeDrug.danleiHpMax);
			drughp = [msg.code, msg.data.userMakeDrug.danleiHp, msg.data.userMakeDrug.danleiHpMax];
		} else {
			console.log(msg.msg);
			drughp = [msg.code, 0, 0];
		}
		return drughp;
	});
	task.next("一次抗雷结束");
}

// 4200毫秒间隔，状态满后自动停止打坐

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function* main(userid, drugid, lists, lv, mapname, mapx, mapy) {
	try {
		drugstate = await makeDrug(userid, drugid, lists, lv);
		await sleep(4200);
		if (drugstate[0] == 0 && drugstate[1] > 0) throw ("丹雷出现");
	} catch (error) {
		console.log(error + "，开始抗雷");
		for (let count = 0; count < 30; count++) {
			try {
				drughp = await handle(userid, 1);
				await sleep(4200);
				if (drughp[0] == 0 && drughp[1] > 0) throw ("丹雷未消散");
				if (drughp[0] == -1) throw ("气血已耗尽，打坐");
				if (drughp[0] == 0 && drughp[1] < 0) break;
			} catch (error) {
				console.log(error + "，继续抗雷");
				for (let count = 0; count < 30; count++) {
					console.log("第" + (count + 1) + "次打坐");
					userstate = await dazuo(userid, mapname, mapx, mapy);
					await sleep(4200);
					if (userstate[0] == 0 && userstate[1] === userstate[2] && userstate[3] === userstate[4] && userstate[5] === userstate[6]) {
						console.log("状态已满，打坐结束");
						break;
					}
				}
			}
		}
	} finally {
		console.log("最后一轮打坐");
		for (let count = 0; count < 30; count++) {
			console.log("第" + (count + 1) + "次打坐");
			userstate = await dazuo(userid, mapname, mapx, mapy);
			await sleep(4200);
			if (userstate[0] == 0 && userstate[1] === userstate[2] && userstate[3] === userstate[4] && userstate[5] === userstate[6]) {
				console.log("状态已满，结束");
				break;
			}
		}
	}
}

// ID 丹方id 材料json 丹药等级 打坐地图名称 x轴位置 y轴位置

// 聚灵
// const task = main(20487, "1", "[248197,248197,277848,249043,258424]", 50, "琳琅境1", 3, 12 )

// 聚魂
// const task = main(20487, "2", "[248614,248614,258387,258424,255742]", 50, "琳琅境1", 3, 12 )

// 聚气
// const task = main(20487, "3", "[248615,248615,277475,277665,258439]", 50, "琳琅境1", 3, 12 )
// const task = main(20487, "3", "[258424,258424,249929,248198,248614]", 40, "琳琅境1", 3, 12 )
const task = main(20487, "3", "[248617,248617,229398,248198,249919]", 40, "琳琅境1", 3, 12 )

// 凝神
// const task = main(20487, "12", "[248198, 248198, 248198, 248198, 248198]", 20, "琳琅境1", 3, 12 )

// 金神
// const task = main(20487, "19", "[212202, 212202, 212202, 277475, 229376]", 40, "琳琅境1", 3, 12)

// 淬体
// const task = main(20487, "20", "[258424, 258424, 258424, 196408, 229376]", 40, "琳琅境1", 3, 12 )

// 灵泉
// const task = main(20487, "22", "[248198, 248198, 248198, 212204, 212759]", 40, "琳琅境1", 3, 12 )

// 破体
// const task = main(20487, "25", "[196436,196436,196436,196408,248198]", 30, "琳琅境1", 3, 12 )

task.next()