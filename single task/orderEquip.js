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
			console.log(`共有${EquipList.length}件法器`);
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
// async function orderEquip_test() {
// 	var a = await orderEquip("4837a285-bb1a-4f9a-886e-946a3e11597a", 1, 3);
// 	await sleep(3000);
// 	console.log(a[0][1]);
// }
// orderEquip_test()
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
orderEquip("4837a285-bb1a-4f9a-886e-946a3e11597a", 1, 3);