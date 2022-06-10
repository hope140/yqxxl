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

async function getMyProgress(userid) {
	console.log("***当前猎魔状态***");
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/LieMo/getMyProgress',
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
		if (msg.code == 0) {
			console.log(`${msg.data.playerNum}人队伍，名称：${msg.data.lieMoRoomInfo.roomName}，难度：${msg.data.lieMoRoomInfo.difficulty}`);
			LieMoInfo = [msg.code, msg.data.lieMoRoomInfo.roomId];
		} else {
			console.log(msg.msg);
			LieMoInfo = [msg.code, 0];
		}
		return LieMoInfo;
	});
}

async function getUserLieMoInfo(userid) {
	console.log("***剩余猎魔次数***");
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/LieMo/getUserLieMoInfo',
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
		if (msg.code == 0) {
			console.log(`剩余创建次数：${msg.data.userLieMoInfo.creatNum}，剩余加入次数${msg.data.userLieMoInfo.joinNum}，剩余奖励次数${msg.data.userLieMoInfo.rewardNum}`);
			LieMoNum = [msg.data.userLieMoInfo.creatNum, msg.data.userLieMoInfo.joinNum, msg.data.userLieMoInfo.rewardNum];
		} else {
			console.log(msg.msg);
			LieMoNum = [0, 0, 0];
		}
		return LieMoNum;
	});
}

async function createLieMoRoom(userid, roomName, roomPassWord, difficulty, palyerNum) {
	console.log("***创建猎魔房间***");
	await sleep(100)
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/LieMo/createLieMoRoom',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"roomName": roomName,
			"roomPassWord": roomPassWord,
			"difficulty": difficulty,
			"palyerNum": palyerNum
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.msg);
		} else {
			console.log("创建失败，" + msg.msg);
		}
	});
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
		return x.equipIncrease.increase * x.equipRule.equipIncrease * Math.pow(1 + x.userBagEquip.lvGrowthValue, x.userBagEquip.addLv) - y.equipIncrease.increase * y.equipRule.equipIncrease * Math.pow(1 + y.userBagEquip.lvGrowthValue, y.userBagEquip.addLv);
	});
	equip_wu.reverse();
	order_wu = [equip_wu.slice(0, 3)[0].userBagEquip.id, equip_wu.slice(0, 3)[1].userBagEquip.id, equip_wu.slice(0, 3)[2].userBagEquip.id];
	console.log(order_wu);
	// 灵
	console.log(`灵法器`);
	equip_lin.sort(function (x, y) {
		return x.equipIncrease.increase * x.equipRule.equipIncrease * Math.pow(1 + x.userBagEquip.lvGrowthValue, x.userBagEquip.addLv) - y.equipIncrease.increase * y.equipRule.equipIncrease * Math.pow(1 + y.userBagEquip.lvGrowthValue, y.userBagEquip.addLv);
	});
	equip_lin.reverse();
	order_lin = [equip_lin.slice(0, 3)[0].userBagEquip.id, equip_lin.slice(0, 3)[1].userBagEquip.id, equip_lin.slice(0, 3)[2].userBagEquip.id];
	console.log(order_lin);
	// 魂
	console.log(`魂法器`);
	equip_hun.sort(function (x, y) {
		return x.equipIncrease.increase * x.equipRule.equipIncrease * Math.pow(1 + x.userBagEquip.lvGrowthValue, x.userBagEquip.addLv) - y.equipIncrease.increase * y.equipRule.equipIncrease * Math.pow(1 + y.userBagEquip.lvGrowthValue, y.userBagEquip.addLv);
	});
	equip_hun.reverse();
	order_hun = [equip_hun.slice(0, 3)[0].userBagEquip.id, equip_hun.slice(0, 3)[1].userBagEquip.id, equip_hun.slice(0, 3)[2].userBagEquip.id];
	console.log(order_hun);
	console.log(`***获取背包信息完成***`);
	return [order_wu, order_lin, order_hun];
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

// 先检测状态，然后换装备
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function main(userid, roomName, roomPassWord, difficulty, palyerNum, equipid) {
	LieMoInfo = await getMyProgress(userid);
	await sleep(1000);
	LieMoNum = await getUserLieMoInfo(userid);
	await sleep(1000);
	if (LieMoInfo[0] == 0) {
		console.log("***继续当前猎魔***");
	}else if (LieMoInfo[0] == -1 && LieMoNum[0] > 0) {
		console.log("***开始猎魔***");
		if (equipid){
			EquipId = equipid;
		}else{
			EquipId = await orderEquip(userid, 1, 3);
		}
		await sleep(1000);
		EquipsState = await getAttributesInfo(userid);
		await sleep(1000);
		await equip(userid, EquipsState, [EquipId[0][0], EquipId[1][0], EquipId[2][0]]);
		await sleep(500);
		await createLieMoRoom(userid, roomName, roomPassWord, difficulty, palyerNum);
		await sleep(500);
		await equip(userid, [EquipId[0][0], EquipId[1][0], EquipId[2][0]], EquipsState);
		await sleep(500);
	}else{
		console.log("***无创建次数***");
	}
}
// 猎魔单刷，如果没有指定equipid，则获取理论最高属性的装备
main("4837a285-bb1a-4f9a-886e-946a3e11597a", "葱芽" , "", 4, 1, );
