const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function output(userid, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		 await sleep(100)
		console.log("第" + (count + 1) + "次讨伐");
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
		// console.log(msg);
		// if (msg.data.userStateInfo.hp === msg.body.data.userStateInfo.hpMax) {
		// 	console.log("气血已满，结束");
		// 	break;
		// }
	}
}
output(27188, 10);