async function getMyProgress(userid) {
	console.log("***当前猎魔状态***");
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/LieMo/getMyProgress',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.playerNum + "人队伍" + "，名称：" + msg.data.lieMoRoomInfo.roomName + "，难度：" + msg.data.lieMoRoomInfo.difficulty);
			lieMoInfo = [msg.code, msg.data.id];
		} else {
			console.log(msg.msg);
		}
	});
}

async function getLiemoReward(userid, roomId) {
	console.log("***领取猎魔奖励***");
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/LieMo/getLiemoReward',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"roomId": roomId
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.msg);
		} else {
			console.log(msg.msg);
		}
	});
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function* main(userid) {
		try {
			lieMoInfo = await getMyProgress(userid);
			await sleep(4200);
			if (lieMoInfo[0] == 0) throw ("领取奖励");
		} catch (error) {
			yield getLiemoReward("4837a285-bb1a-4f9a-886e-946a3e11597a", lieMoInfo[1]);
		}
	}

// ID 历练地图名称 x轴位置 y轴位置 使用元气数量
const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a")
task.next()
