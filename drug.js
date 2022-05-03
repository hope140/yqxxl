const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function makeDrug(userid, drugid, lists, lv, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		 await sleep(2000)
		console.log("炼丹");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/Drug/makeDrug',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"drugId": drugid,
				"lists": lists,
				"lv": lv
			})
		};
		request(options, function (error, response) {
			// if (error) throw new Error(error);
			msg = JSON.parse(response.body);
			if (msg.code == 0) {
				console.log(msg.data.msg + " 丹雷状态" + msg.data.userMakeDrug.danleiHp + "/" + msg.data.userMakeDrug.danleiHpMax);
			} else {
				console.log(msg.msg);
			}
		});
	}
	task.next('炼丹');
}

async function useDrug(userid, bagid, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		 await sleep(2000)
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
	task.next('嗑药');
}

async function dazuo(userid, mapname, mapx, mapy, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(4200)
		console.log("第" + (count + 1) + "次打坐");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/User/startDaZuo',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"mapName": mapname,
				"mapX": mapx,
				"mapY": mapy
			})
		};
		request(options, function (error, response) {
			// if (error) throw new Error(error);
			msg = JSON.parse(response.body);
			if (msg.code == 0) {
				console.log("气血:" + msg.data.userStateInfo.hp + "/" + msg.data.userStateInfo.hpMax + " 灵：" + msg.data.userStateInfo.linMp + "/" + msg.data.userStateInfo.linMpMax + " 魂：" + msg.data.userStateInfo.hunMp + "/" + msg.data.userStateInfo.hunMpMax);
				userState = msg.data.userStateInfo;
			} else if (msg.code == -3) {
				console.log("请求超时，同时运行多个脚本或游戏未退出，请检查！");
			} else {
				console.log(msg.msg);
			}
		});
	}
	task.next('打坐结束，开始下一步');
}

async function handle(userid, type ,maxrun) {
	for (let count = 0; count < maxrun; count++) {
		 await sleep(200)
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
	// yield makeDrug(27188, "2" ,"[196390,196390,196393,248615,211901]" ,40 , 1);
	for (let count = 0; count < 8; count++) {
		// yield useDrug(27188, 101686, 1);
		yield dazuo(27188, "殒神林1", 3, 7, 6);
		yield handle(27188, 1, 1);
		yield handle(27188, 2, 1);
	}
}
const task = main()
task.next()
