const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function useDrug(userid, bagid, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		 await sleep(100)
		console.log("嗑药");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/Drug/useDrug',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"bagId": bagid
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
useDrug(20487, 101686, 1);