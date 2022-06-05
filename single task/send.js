async function send(SendKey, title, desp, channel) {
	var request = require('request');
	var url = `https://sctapi.ftqq.com/${SendKey}.send`;
	var dataString = `title=${title}&desp=${desp}&channel=${channel}`;
	var options = {
		'method': 'POST',
		'headers': {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		'url': url,
		body: dataString
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		// console.log(msg);
		if (msg.code == 0) {
			console.log(`已发送通知`);
		}
	});
}
send("SCT153699ToIVbZFnVru7DLtLS4WO8BlnI", "测试", "测试", 9);