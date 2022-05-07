const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function getgift(userid, level ,levellevel, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(1000)
		console.log("第" + (count + 1) + "次扫荡");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/GameCopy/getGameCopyGift',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"level": level,
				"levelLevel": levellevel
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
	task.next('扫荡结束，开始下一步');
}

// 扫荡，level为扫荡的关卡，levellevel为关卡的种类，maxrun为扫荡的次数，次数为6保证扫荡成功
async function* main() {
	for (let count = 0; count < 1; count++) {
		yield getgift(21487, 1, 2, 6);
		yield getgift(21487, 2, 2, 6);
	}
}
const task = main()
task.next()
