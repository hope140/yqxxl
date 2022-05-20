const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function createLieMoRoom(userid, roomName, roomPassWord, difficulty, palyerNum) {
	console.log("***创建猎魔房间***");
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/LieMo/createLieMoRoom',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"roomName": roomName,
			"roomPassWord": roomPassWord,
			"difficulty": difficulty,
			"palyerNum": palyerNum
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.playerNum + "人队伍" + "，名称：" + msg.data.lieMoRoomInfo.roomName + "，难度：" + msg.data.lieMoRoomInfo.difficulty);
		} else {
			console.log("创建失败，" + msg.msg);
		}
	});
}

createLieMoRoom("4837a285-bb1a-4f9a-886e-946a3e11597a", "葱芽" , "", 3, 1);