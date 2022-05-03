const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function getgift(userid, level ,levellevel, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		 await sleep(100)
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
}
getgift(27188, 1, 1, 10);