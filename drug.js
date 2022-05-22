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
			console.log(`${msg.data.msg} 丹雷状态${msg.data.userMakeDrug.danleiHp}/${msg.data.userMakeDrug.danleiHpMax}`);
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
			drughp = [msg.code, msg.data.userMakeDrug.danleiHp, msg.data.userMakeDrug.danleiHpMax, msg.msg];
		} else {
			console.log(msg.msg);
			drughp = [msg.code, 0, 0, msg.msg];
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
		await sleep(1000);
		if (drugstate[0] == 0 && drugstate[1] > 0) throw ("丹雷出现");
	} catch (error) {
		console.log(`***${error}，开始抗雷***`);
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
				await sleep(4200);
			}
		}
	} finally {
		console.log("***最后一轮打坐***");
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
}

// ID 丹方id 材料json 丹药等级 打坐地图名称 x轴位置 y轴位置

// 聚灵
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "1", "[248197,248197,277848,249043,258424]", 50, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "1", "[277665,277665,277477,212205,249859]", 40, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "1", "[249735,277665,277477,212205,277838]", 40, "殒神林2", 1, 2 )

// 聚魂
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "2", "[248614,248614,258387,258424,255742]", 50, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "2", "[249919, 249919, 212201, 277838, 249929]", 50, "殒神林2", 1, 2 )

// 聚气
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "3", "[248615,248615,277475,277665,258439]", 50, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "3", "[258424,258424,249929,248198,248614]", 40, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "3", "[248617,248617,229398,248198,249919]", 40, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "3", "[248617,248617,229398,248198,277477]", 40, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "3", "[248615,248615,277478,248198,258422]", 40, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "3", "[196436,196436,229398,249034,277848]", 40, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "3", "[196436,196436,196408,229358,212231]", 20, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "3", "[200437,200437,226063,249034,212231]", 30, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "3", "[249933,249933,249929,249861,212204]", 40, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "3", "[196436,196436,278590,277483,281751]", 60, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "3", "[226062,196436,277478,226064,281748]", 40, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", 3, "[212235,212235,229359,277483,281748]", 50, "殒神林2", 1, 2 )
const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", 3, "[281836,281836,277484,277483,276819]", 60, "殒神林2", 1, 2 )

// 聚液
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "4", "[212201, 212201, 249859, 277484, 281037]", 60, "殒神林2", 1, 2 )

// 凝神
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "12", "[248198, 248198, 248198, 248198, 248198]", 20, "殒神林2", 1, 2 )

// 金神
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "19", "[212202, 212202, 212202, 277475, 229376]", 40, "殒神林2", 1, 2)

// 淬体
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "20", "[258424, 258424, 258424, 196408, 229376]", 40, "殒神林2", 1, 2 )

// 灵泉
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "22", "[248198, 248198, 248198, 212204, 212759]", 40, "殒神林2", 1, 2 )

// 破灵
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "24", "[248197, 248197, 248197, 212231, 277480]", 40, "殒神林2", 1, 2 )
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "24", "[196270, 196270, 196270, 196323, 249736]", 50, "殒神林2", 1, 2 )

// 破体
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", "25", "[196436,196436,196436,196408,248198]", 30, "殒神林2", 1, 2 )


task.next()