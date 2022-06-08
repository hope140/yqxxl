async function ServerPush(SendKey, title, desp, channel) {
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
			console.log(`Server酱已发送通知`);
		}
	});
}

async function DeerPush(key, title, desp) {
	var request = require('request');
	var url = `https://api2.pushdeer.com/message/push?pushkey=${key}`;
	var dataString = `text=${title}&desp=${desp}&type=markdown`;
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
			console.log(`PushDeer已发送通知`);
		}
	});
}
async function main(Serverkey, Deerkey, name) {
	if (Serverkey) {
		await ServerPush(Serverkey, `通过测试`, `你的名字+${name}`, 9);
	} else if (Deerkey) {
		await DeerPush(Deerkey, `通过测试`, `你的名字+${name}`);
	}
}
main("", "PDU11730TL2qnZl1EMFulx6P98fSp2UXOoY61etKz", "hope");