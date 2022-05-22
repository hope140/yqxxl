async function lianti(userid, offlinenum) {
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
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`${msg.data.msg} 气血:${msg.data.userStateInfo.hp}/${msg.data.userStateInfo.hpMax} 灵：${msg.data.userStateInfo.linMp}/${msg.data.userStateInfo.linMpMax} 魂：${msg.data.userStateInfo.hunMp}/${msg.data.userStateInfo.hunMpMax}`);
		} else if (msg.code == -3) {
			console.log("请求超时，同时运行多个脚本或游戏未退出，请检查！");
		} else {
			console.log(msg.msg);
		}
	});
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function main(userid, offlinenum) {
	for (let count = 0; count < 100; count++) {
		console.log(`第${count + 1}次炼体`);
		lianti(userid, offlinenum);
		await sleep(4200)
	}
}
// ID 使用元气数量
main("4837a285-bb1a-4f9a-886e-946a3e11597a", 0)
