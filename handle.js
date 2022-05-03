const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function handle(userid, type ,maxrun) {
	for (let count = 0; count < maxrun; count++) {
		 await sleep(100)
		// console.log("抗丹雷");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/Drug/danleiHandLe',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"type": type
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
	task.next('抗丹雷');
}

async function* main() {
	for (let count = 0; count < 1; count++) {
		yield handle(20487, 1, 1);
		yield handle(20487, 2, 1);
	}
}
const task = main()
task.next()
