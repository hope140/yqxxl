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

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function* main(userid, endequipid, carryequipid) {
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
// 卸下 换装 锁定
// 魂换灵
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", [132974, 134721, 145529], [153114, 150948, 146211]);

// 灵换魂
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", [153114, 150948, 146211], [132974, 134721, 145529]);

// 猎魔单刷
// const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", [153114, 150948, 146211], [145320, 150948, 132974]);

// 猎魔还原
const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a", [145320, 150948, 132974], [153114, 150948, 146211]);
task.next()