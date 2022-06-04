async function getGameCopyInfo(userid) {
	console.log("***获取当前远征状态***");
	await sleep(100)
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/GameCopy/getGameCopyInfo',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid
		})
	};
	request(options, function (error, response) {
		// if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`讨伐邪魔剩余次数${msg.data.userGameCopyInfo.level3Num}`);
			bossinfo = [msg.data.gameCopyBossInto.id, msg.data.userGameCopyInfo.level3Num, msg.data.gameCopyBossInto.value];
		} else {
			console.log(msg.msg);
			bossinfo = [0, 0, ""];
		}
		return bossinfo;
	});
}

async function useDrug(userid, bagid) {
	console.log("***吃九转回复状态***");
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
		// if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.msg);
		} else {
			console.log(msg.msg);
		}
	});
}

async function output(userid, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(1000)
		console.log(`第${count + 1}次讨伐`);
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/GameCopy/outPutBoss',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
			})
		};
		request(options, function (error, response) {
			// if (error) throw new Error(error);
			msg = JSON.parse(response.body);
			if (msg.code == 0) {
				console.log(msg.data.msg);
			} else {
				console.log(msg.msg);
			}
		});
	}
}

// 找出满足等级条件下三类的最高伤害（默认均属性生自己且+10，懒得计算）的法器，返回id数组
async function getUserBag(userid) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/User/getUserBag',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		// 法器列表
		if (msg.code == 0) {
			EquipList = msg.data.userBagEquipList;
			console.log(`共有${EquipList.length}件法器，取各种类前三件`);
		} else {
			console.log(msg.msg);
			EquipList = [];
		}
		return EquipList;
	});
}

async function getUserLV(userid, mapx, mapy) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/User/getUserLV',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"mapX": mapx,
			"mapY": mapy
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`武:${msg.data.userLv.wuLv} 灵：${msg.data.userLv.linLv} 魂：${msg.data.userLv.hunLv}`);
			userlv = [msg.code, msg.data.userLv.wuLv, msg.data.userLv.linLv, msg.data.userLv.hunLv];
		} else {
			console.log(msg.msg);
			userlv = [msg.code, 0, 0, 0];
		}
		return userlv;
	});
}

async function orderEquip(userid, mapx, mapy) {
	console.log(`***获取当前人物等级***`);
	userlv = await getUserLV(userid, mapx, mapy);
	await sleep(1000);
	console.log("***获取背包信息（属性从大到小排序）***");
	EquipList = await getUserBag(userid);
	await sleep(1000);
	var equip_wu = [];
	var equip_lin = [];
	var equip_hun = [];
	for (var i = 0; i < EquipList.length; i++) {
		if (EquipList[i].equipRule.type == 1 && EquipList[i].equipRule.lv <= userlv[1]) {
			equip_wu.push(EquipList[i]);
		} else if (EquipList[i].equipRule.type == 2 && EquipList[i].equipRule.lv <= userlv[2]) {
			equip_lin.push(EquipList[i]);
		} else if (EquipList[i].equipRule.type == 3 && EquipList[i].equipRule.lv <= userlv[3]) {
			equip_hun.push(EquipList[i]);
		}
	}
	// 武
	console.log(`武法器`);
	equip_wu.sort(function (x, y) {
		return x.equipIncrease.increase - y.equipIncrease.increase;
	});
	equip_wu.reverse();
	order_wu = [equip_wu.slice(0, 3)[0].userBagEquip.id, equip_wu.slice(0, 3)[1].userBagEquip.id, equip_wu.slice(0, 3)[2].userBagEquip.id];
	console.log(order_wu);
	// 灵
	console.log(`灵法器`);
	equip_lin.sort(function (x, y) {
		return x.equipIncrease.increase - y.equipIncrease.increase;
	});
	equip_lin.reverse();
	order_lin = [equip_lin.slice(0, 3)[0].userBagEquip.id, equip_lin.slice(0, 3)[1].userBagEquip.id, equip_lin.slice(0, 3)[2].userBagEquip.id];
	console.log(order_lin);
	// 魂
	console.log(`魂法器`);
	equip_hun.sort(function (x, y) {
		return x.equipIncrease.increase - y.equipIncrease.increase;
	});
	equip_hun.reverse();
	order_hun = [equip_hun.slice(0, 3)[0].userBagEquip.id, equip_hun.slice(0, 3)[1].userBagEquip.id, equip_hun.slice(0, 3)[2].userBagEquip.id];
	console.log(order_hun);
	console.log(`***获取背包信息完成***`);
	return [order_wu, order_lin, order_hun];
}

// 一键换装
async function carryEquip(userid, userBagEquipId) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Bag/carryEquip',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"userBagEquipId": userBagEquipId
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(userBagEquipId + msg.data);
		} else {
			console.log(msg.msg);
		}
	});
}

async function endEquip(userid, userBagEquipId) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Bag/endEquip',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"userBagEquipId": userBagEquipId
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(userBagEquipId + msg.data);
		} else {
			console.log(msg.msg);
		}
	});
}

async function lockEquip(userid, userBagEquipId) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Bag/lockEquip',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"userBagEquipId": userBagEquipId
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(userBagEquipId + msg.data);
		} else {
			console.log(msg.msg);
		}
	});
}
async function equip(userid, endequipid, carryequipid) {
	console.log("***卸装备***");
	for (let i = 0; i < 3; i++) {
		await endEquip(userid, endequipid[i]);
		await sleep(200);
	}
	await sleep(200);
	console.log("***穿装备***");
	for (let i = 0; i < 3; i++) {
		await carryEquip(userid, carryequipid[i]);
		await sleep(200);
	}
	await sleep(200);
	console.log("***锁装备***");
	for (let i = 0; i < 3; i++) {
		await lockEquip(userid, endequipid[i]);
		await sleep(200);
	}
	await sleep(200);
}

async function getAttributesInfo(userid) {
	console.log("***获取当前角色状态***");
	await sleep(100)
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/User/getAttributesInfo',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid
		})
	};
	request(options, function (error, response) {
		// if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`角色当前装备${msg.data.userBagEquipsState[0].id},${msg.data.userBagEquipsState[1].id},${msg.data.userBagEquipsState[2].id}`);
			EquipsState = [msg.data.userBagEquipsState[0].id, msg.data.userBagEquipsState[1].id, msg.data.userBagEquipsState[2].id];
		} else {
			console.log(msg.msg);
			EquipsState = [0, 0, 0];
		}
		return EquipsState;
	});
}

async function attack(userid, EquipId, frequency, bagid) {
	EquipsState = await getAttributesInfo(userid);
	await sleep(1000);
	await equip(userid, EquipsState, EquipId);
	await sleep(500);
	if(typeof(bagid) !== "undefined" && bagid !== null){
		await useDrug(userid, bagid);
	}
	await sleep(500);
	console.log("***讨伐邪魔***");
	await output(userid, frequency);
	await sleep(500);
	await equip(userid, EquipId, EquipsState);
	await sleep(500);
	console.log("***讨伐结束***");
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function main(userid, bagid) {
	bossinfo = await getGameCopyInfo(userid);
	await sleep(1000);
	if (bossinfo[1] > 0) {
		EquipId = await orderEquip(userid, 1, 3);
		if (bossinfo[0] == 1) {
			console.log(`邪魔特性：${bossinfo[2]}`);
			await attack(userid, EquipId[2], bossinfo[1], bagid);
		} else if (bossinfo[0] == 2) {
			console.log(`邪魔特性：${bossinfo[2]}`);
			await attack(userid, EquipId[1], bossinfo[1], bagid);
		} else {
			console.log(`邪魔特性：${bossinfo[2]}`);
		}
	} else {
		console.log("***没有剩余次数，不进行讨伐***");
	}
}
main("4837a285-bb1a-4f9a-886e-946a3e11597a", 176564);

// 收集boss信息，为自动化做准备
// "gameCopyBossInto": {
// 	"id": 1,
// 	"lastHp": 19192538,
// 	"name": "武灵魔尊",
// 	"nowHp": 18447788,
// 	"state": 1,
// 	"value": "武灵无效，魂四倍伤害",
// 	"weekDieNum": 11
// }

// "gameCopyBossInto": {
// 	"id": 2,
// 	"lastHp": 6949867,
// 	"name": "魂天邪帝",
// 	"nowHp": 645179,
// 	"state": 1,
// 	"value": "魂无效，武灵两倍伤害",
// 	"weekDieNum": 0
// }