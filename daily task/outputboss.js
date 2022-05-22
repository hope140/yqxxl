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
	task.next("使用成功");
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
	task.next("卸下成功");
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
	task.next("锁定成功");
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

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function main(userid, HunEquipId) {
	bossinfo = await getGameCopyInfo(userid);
	await sleep(1000);
	if (bossinfo[1] > 0) {
		if (bossinfo[0] == 1) {
			console.log(`邪魔特性：${bossinfo[2]}`);
			EquipsState = await getAttributesInfo(userid);
			await sleep(1000);
			await equip(userid, EquipsState, HunEquipId);
			await sleep(500);
			console.log("***讨伐邪魔***");
			await output(userid, bossinfo[1]);
			await sleep(500);
			await equip(userid, HunEquipId, EquipsState);
			await sleep(500);
			console.log("***讨伐结束***");
		}else if (bossinfo[0] == 2) {
			console.log(`邪魔特性：${bossinfo[2]}`);
		}else{
			console.log(`邪魔特性：${bossinfo[2]}`);
		}
	}else{
		console.log("***没有剩余次数，不进行讨伐***");
	}
}
main("4837a285-bb1a-4f9a-886e-946a3e11597a", [132974, 134721, 145529]);

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
