async function collection(userid, mapname, mapx, mapy, offlinenum) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Map/collection',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"mapName": mapname,
			"mapX": mapx,
			"mapY": mapy,
			"offlineNum": offlinenum
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`获得:${msg.data.userBagProp.propNumber}个${msg.data.propInfo.name}`, `状态：魂值${msg.data.userStateInfo.hunMp}/${msg.data.userStateInfo.hunMpMax}`);
			userhunMp = [msg.code, msg.data.userStateInfo.hunMp, msg.data.userStateInfo.hunMpMax];
		} else {
			console.log(msg.msg);
			userhunMp = [msg.code, 0, 0];
		}
		return userhunMp;
	});
}

// 打坐函数 参数：用户ID, 打坐地点, 地图x轴位置, 地图y轴位置
// 打坐函数 返回值：魂力
async function dazuo(userid, mapname, mapx, mapy) {
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
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`气血:${msg.data.userStateInfo.hp}/${msg.data.userStateInfo.hpMax} 灵：${msg.data.userStateInfo.linMp}/${msg.data.userStateInfo.linMpMax} 魂：${msg.data.userStateInfo.hunMp}/${msg.data.userStateInfo.hunMpMax}`);
			hunMp = [msg.code, msg.data.userStateInfo.hunMp, msg.data.userStateInfo.hunMpMax];
		} else {
			console.log(msg.msg);
			hunMp = [msg.code, 0, 0];
		}
		return hunMp;
	});
}

async function getUserLV(userid, mapx, mapy) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/User/getUserLV',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"mapX": mapx,
			"mapY": mapy
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`武:${msg.data.userLv.wuLv} 灵：${msg.data.userLv.linLv} 魂：${msg.data.userLv.hunLv}`);
			userlv = [msg.code, msg.data.userLv.wuLv, msg.data.userLv.linLv, msg.data.userLv.hunLv];
		} else {
			console.log(msg.msg);
			userlv = [msg.code, 0, 0, 0];
		}
		return userlv;
	});
}

// 4000毫秒间隔，气血满后自动停止打坐

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function main(userid, mapname, sitmap, mapx, mapy, offlinenum) {
	console.log(`获取当前人物等级`);
	userlv = await getUserLV(userid, mapx, mapy);
	await sleep(1000);
	for (let count = 0; count < 100; count++) {
		console.log(`第${count + 1}次采药`);
		try {
			userhunMp = await collection(userid, mapname, mapx, mapy, offlinenum);
			await sleep(4000);
			if (userhunMp[0] == 0 && userhunMp[1] < userlv[3]) throw ("魂力不足");
			if (userhunMp[0] == -1) throw ("采药失败，魂力不足");
		} catch (Error) {
			console.log(`***${Error} 开始打坐***`);
			for (let count = 0; count < 30; count++) {
				console.log(`第${count + 1}次打坐`);
				hunMp = await dazuo(userid, sitmap, mapx, mapy);
				await sleep(4000);
				if (hunMp[0] == 0 && hunMp[1] === hunMp[2]) {
					console.log("***魂力已满，结束***");
					break;
				}
			}
		}
	}
}
// ID 采药地图名称 打坐地图名称 x轴位置 y轴位置 使用元气数量
main("4837a285-bb1a-4f9a-886e-946a3e11597a", "武林溪2", "无极山2", 1, 3, 0)