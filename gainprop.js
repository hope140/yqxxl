const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function gainprop(userid, gainpropid, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		 await sleep(100)
		console.log("使用法宝");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/GainProp/useGainProp',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"gainPropId": gainpropid,
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
gainprop(20487, 14, 1);
// gainprop(27188, 14 , 1);