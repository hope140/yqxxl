async function getGameCopyInfo(userid) {
	console.log("***获取当前远征状态***");
	await sleep(100)
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/GameCopy/getGameCopyInfo',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid
		})
	};
	request(options, function (error, response) {
		// if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`域外分境当前最快进度为${Math.max(msg.data.userGameCopyInfo.level1Hun, msg.data.userGameCopyInfo.level1Lin, msg.data.userGameCopyInfo.level1Wu)}关，还有${msg.data.userGameCopyInfo.level1Num}次扫荡机会`);
			console.log(`诛罚邪魔当前最快进度为${Math.max(msg.data.userGameCopyInfo.level2Level1, msg.data.userGameCopyInfo.level2Level2)}关，还有${msg.data.userGameCopyInfo.level2Num}次扫荡机会`);
			level = [msg.data.userGameCopyInfo.level1Num, msg.data.userGameCopyInfo.level1Hun, msg.data.userGameCopyInfo.level1Lin, msg.data.userGameCopyInfo.level1Wu, Math.max(msg.data.userGameCopyInfo.level1Hun, msg.data.userGameCopyInfo.level1Lin, msg.data.userGameCopyInfo.level1Wu), msg.data.userGameCopyInfo.level2Num, msg.data.userGameCopyInfo.level2Level1, msg.data.userGameCopyInfo.level2Level2, Math.max(msg.data.userGameCopyInfo.level2Level1, msg.data.userGameCopyInfo.level2Level2)];
		} else {
			console.log(msg.msg);
			level = [0, 0, 0, 0, 0, 0, 0, 0, 0];
		}
		return level;
	});
}

async function getgift(userid, level, levellevel, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(500)
		console.log(`第${count + 1}次扫荡`);
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

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
// 扫荡，level为扫荡的关卡，levellevel为关卡的种类，maxrun为扫荡的次数
async function main(userid) {
	level = await getGameCopyInfo(userid);
	await sleep(1000);
	level1 = level.slice(0, 5);
	level2 = level.slice(5);
	if (level1[0] > 0) {
		console.log(`***域外分境开始扫荡***`);
		await getgift(userid, 1, level1.indexOf(level1.pop()), level1[0]);
	}
	await sleep(500);
	if (level2[0] > 0) {
		console.log(`***诛罚邪魔开始扫荡***`);
		await getgift(userid, 2, level2.indexOf(level2.pop()), level2[0]);
	}
}
main("4837a285-bb1a-4f9a-886e-946a3e11597a")
