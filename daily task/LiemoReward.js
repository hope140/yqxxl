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
			console.log(`${msg.data.playerNum}人队伍，名称：${msg.data.lieMoRoomInfo.roomName}，难度：${msg.data.lieMoRoomInfo.difficulty}`);
			lieMoInfo = [msg.code, msg.data.id];
		} else {
			console.log(msg.msg);
			lieMoInfo = [msg.code, 0];
		}
		return lieMoInfo;
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

async function getUserLieMoInfo(userid) {
	console.log("***剩余猎魔次数***");
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/LieMo/getUserLieMoInfo',
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
			console.log(`剩余创建次数：${msg.data.userLieMoInfo.creatNum}，剩余加入次数${msg.data.userLieMoInfo.joinNum}，剩余奖励次数${msg.data.userLieMoInfo.rewardNum}`);
			LieMoNum = [msg.data.userLieMoInfo.creatNum, msg.data.userLieMoInfo.joinNum, msg.data.userLieMoInfo.rewardNum];
		} else {
			console.log(msg.msg);
			LieMoNum = [0, 0, 0];
		}
		return LieMoNum;
	});
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function main(userid) {
	lieMoInfo = await getMyProgress(userid);
	await sleep(1000);
	LieMoNum = await getUserLieMoInfo(userid);
	await sleep(1000);
	if (lieMoInfo[0] == 0 && LieMoNum[2] > 0) {
		await getLiemoReward(userid, lieMoInfo[1]);
	} else if (lieMoInfo[0] == -1 && LieMoNum[2] > 0) {
		console.log("***无奖励可领取***");
	} else {
		console.log("***无奖励次数***");
	}
}

main("4837a285-bb1a-4f9a-886e-946a3e11597a")
