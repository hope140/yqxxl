const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function getDongfu(userid) {
	await sleep(100)
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Map/getDongfu',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"mapX": 1,
			"mapY": 2
		})
	};
	request(options, function (_error, response) {
		// if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`当前副本次数${msg.data.userDongfuInfo.number}/${msg.data.userDongfuInfo.maxNumber}，剩余购买次数${msg.data.userDongfuInfo.gmNumber}`);
			dongfuInfo = [msg.code, msg.data.userDongfuInfo.number, msg.data.userDongfuInfo.gmNumber];
		} else {
			console.log(msg.msg);
			dongfuInfo = [msg.code, 0, 0];
		}
		return dongfuInfo;
	});
}

async function experiencedongfu(userid, type, lv, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(500)
		console.log("第" + (count + 1) + "次副本");
		var request = require('request');
		var options = {
			'method': 'POST',
			'url': 'https://yqxxl.yqbros.com/Yqxxl/Map/experienceDongfu',
			'headers': {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"userId": userid,
				"type": type,
				"lv": lv
			})
		};
		request(options, function (error, response) {
			if (error) throw new Error(error);
			msg = JSON.parse(response.body);
			if (msg.code == 0) {
				console.log("副本结束");
			} else if (msg.code == -1) {
				console.log("次数不足！");
			} else {
				console.log(msg.msg);
			}
			// console.log(msg);
		});
	}
}
async function buydongfu(userid, number) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Map/buyDongFu',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"number": number
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`次数:${msg.data.userDongfuInfo.number}/${msg.data.userDongfuInfo.maxNumber}`);
		} else if (msg.code == -1) {
			console.log("购买次数不足");
		} else {
			console.log(msg.msg);
		}
	});
}

async function sellUserBagAll(userid, lv, quality, type, lvGrowthValue) {
	await sleep(500)
	console.log("***一键售卖无用法器***");
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Bag/sellUserBagAll',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"userId": userid,
			"lv": lv,
			"quality": quality,
			"type": type,
			"lvGrowthValue": lvGrowthValue
		})
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.msg)
		} else {
			console.log(msg.msg);
		}
	});
}

async function main(userid) {
	console.log("***刷新副本次数***");
	dongfuInfo = await getDongfu(userid);
	await sleep(1000);
	if (dongfuInfo[0] == 0) {
		if (dongfuInfo[1] == 0 && dongfuInfo[2] == 0) {
			console.log("二者次数均不足");
		} else if (dongfuInfo[1] > 0 && dongfuInfo[2] == 0) {
			console.log("***购买次数不足，开始副本***");
			await experiencedongfu(userid, 1, 30, 3);
		} else if (dongfuInfo[1] == 0 && dongfuInfo[2] > 0) {
			console.log("***副本次数不足，开始购买***");
			await buydongfu(userid, 3, 1);
			await experiencedongfu(userid, 1, 30, 3);
		} else if (dongfuInfo[1] > 0 && dongfuInfo[2] > 0) {
			console.log("***次数充足，开始副本***");
			await experiencedongfu(userid, 1, 30, 3);
			await sleep(500)
			console.log("***购买次数***");
			await buydongfu(userid, 3, 1);
			await experiencedongfu(userid, 1, 30, 3);
		}
	}
	await sleep(1000);
	await sellUserBagAll(userid, 30, -1, -1, 0);
}
main("4837a285-bb1a-4f9a-886e-946a3e11597a")
