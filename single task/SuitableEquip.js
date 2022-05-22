// 找出满足等级条件下三类的最高属性的法器，返回id数组
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function getUserBag(userid) {
	console.log("***获取背包信息***");
	await sleep(100)
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
		// if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		// 法器列表
		if (msg.code == 0) {
			EquipList = msg.data.userBagEquipList;
			// console.log(`共有${EquipList.length}件法器`);
		} else {
			console.log(msg.msg);
			EquipList = [];
		}
		return EquipList;
	});
}
async function main(userid) {
	EquipList = await getUserBag(userid);
}
main("4837a285-bb1a-4f9a-886e-946a3e11597a")