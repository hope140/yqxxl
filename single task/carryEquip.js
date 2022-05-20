const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function carryEquip(userid, userBagEquipId) {
	console.log("***穿装备***");
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

carryEquip("4837a285-bb1a-4f9a-886e-946a3e11597a", 146211);