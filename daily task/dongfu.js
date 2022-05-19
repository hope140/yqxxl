const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function experiencedongfu(userid, type, lv, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(4200)
		console.log("第" + (count + 1) + "次副本");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/Map/experienceDongfu',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"type": type,
				"lv": lv
			})
		};
		request(options, function (error, response) {
			if (error) throw new Error(error);
			msg = JSON.parse(response.body);
			if (msg.code == 0) {
				console.log("副本结束，获得：" + msg.data.equipSuitInfos[1].name);
			} else if (msg.code == -1) {
				console.log("次数不足！");
			} else {
				console.log(msg.msg);
			}
			// console.log(msg);
		});
	}
	task.next('副本三次结束，开始下一步');
}
async function buydongfu(userid, number, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(4200)
		console.log("购买次数");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/Map/buyDongFu',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"number": number
			})
		};
		request(options, function (error, response) {
			if (error) throw new Error(error);
			msg = JSON.parse(response.body);
			if (msg.code == 0) {
				console.log("次数:" + msg.data.userDongfuInfo.number + "/" + msg.data.userDongfuInfo.maxNumber);
			} else if (msg.code == -1) {
				console.log("购买次数不足");
			} else {
				console.log(msg.msg);
			}
		});
	}
	task.next('购买结束，开始下一步');
}

// 洞府副本，获取物品json还有问题，有时候会返回两个，不过优先级不高，暂不处理
async function* main() {
	for (let count = 0; count < 1; count++) {
		yield experiencedongfu("4837a285-bb1a-4f9a-886e-946a3e11597a", 1, 30, 3);
		yield buydongfu("4837a285-bb1a-4f9a-886e-946a3e11597a", 3, 1);
		yield experiencedongfu("4837a285-bb1a-4f9a-886e-946a3e11597a", 1, 30, 3);
	}
}
const task = main()
task.next()