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
async function main(userid, equipid, roomName, roomPassWord, difficulty, palyerNum) {
	LieMoInfo = await getMyProgress(userid);
	await sleep(1000);
	LieMoNum = await getUserLieMoInfo(userid);
	await sleep(1000);
	if (LieMoInfo[0] == 0) {
		console.log("***继续当前猎魔***");
	}else if (LieMoInfo[0] == -1 && LieMoNum[0] > 0) {
		console.log("***开始猎魔***");
		EquipsState = await getAttributesInfo(userid);
		await sleep(1000);
		await equip(userid, EquipsState, equipid);
		await sleep(500);
		await createLieMoRoom(userid, roomName, roomPassWord, difficulty, palyerNum);
		await sleep(500);
		await equip(userid, equipid, EquipsState);
		await sleep(500);
	}else{
		console.log("***无创建次数***");
	}
}
// 猎魔单刷
main("4837a285-bb1a-4f9a-886e-946a3e11597a", [145320, 155025, 132974], "葱芽" , "", 3, 1);
