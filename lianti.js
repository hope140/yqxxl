const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function lianti(userid, offlinenum, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(4200)
		console.log("第" + (count + 1) + "次炼体");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/Map/liantiStart',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"offlineNum": offlinenum
			})
		};
		request(options, function (error, response) {
			// if (error) throw new Error(error);
			msg = JSON.parse(response.body);
			if (msg.code == 0) {
				console.log(msg.data.msg);
			}else if (msg.code == -3) {
				console.log("请求超时，同时运行多个脚本或游戏未退出，请检查！");
			}else {
				console.log(msg.msg);
			}
			// console.log(msg);
		});
	}
}
lianti(27188, 0, 15);