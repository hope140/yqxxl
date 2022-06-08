function _copyArrayObject(arrayObject) {
	var temp = []
	arrayObject.forEach(element => {
		temp.push(Object.assign({}, element))
	});
	return temp
}

async function makeDrug(userid, drugid, lists, lv) {
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
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(`${msg.data.msg} 丹雷状态${msg.data.userMakeDrug.danleiHp}/${msg.data.userMakeDrug.danleiHpMax}`);
			drugstate = [msg.code, msg.data.userMakeDrug.danleiHp, msg.data.userMakeDrug.danleiHpMax];
		} else {
			console.log(msg.msg);
			drugstate = [msg.code, 0, 0];
		}
		return drugstate;
	});
}

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

// // 吃九转，没啥用
// async function useDrug(userid, bagid) {
// 	var request = require('request');
// 	var options = {
// 		'method': 'POST',
// 		'url': 'https://yqxxl.yqbros.com/Yqxxl/Drug/useDrug',
// 		'headers': {
// 			'Content-Type': 'application/json'
// 		},
// 		body: JSON.stringify({
// 			"userId": userid,
// 			"bagId": bagid
// 		})
// 	};
// 	request(options, function (error, response) {
// 		if (error) throw new Error(error);
// 		msg = JSON.parse(response.body);
// 		if (msg.code == 0) {
// 			console.log(msg.data.msg);
// 		} else {
// 			console.log(msg.msg);
// 		}
// 	});
// }

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
			userstate = [msg.code, msg.data.userStateInfo.hp, msg.data.userStateInfo.hpMax, msg.data.userStateInfo.linMp, msg.data.userStateInfo.linMpMax, msg.data.userStateInfo.hunMp, msg.data.userStateInfo.hunMpMax];
		} else {
			console.log(msg.msg);
			userstate = [msg.code, 0, 0, 0, 0, 0, 0];
		}
		return userstate;
	});
}

async function handle(userid, type) {
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
		if (error) throw new Error(error);
		msg = JSON.parse(response.body);
		if (msg.code == 0) {
			console.log(msg.data.msg + " 丹雷剩余：" + msg.data.userMakeDrug.danleiHp + "/" + msg.data.userMakeDrug.danleiHpMax);
			drughp = [msg.code, msg.data.userMakeDrug.danleiHp, msg.data.userMakeDrug.danleiHpMax, msg.msg];
		} else {
			console.log(msg.msg);
			drughp = [msg.code, 0, 0, msg.msg];
		}
		return drughp;
	});
}
// 4000毫秒间隔，状态满后自动停止打坐

async function getUserDrugInfo(userid, mapx, mapy) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Drug/getUserDrugInfo',
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
		// 丹方列表
		if (msg.code == 0) {
			DrugInfo = msg.data.userDrugInfos;
			// console.log(`共有${DrugInfo.length}个丹方`);
		} else {
			console.log(msg.msg);
			DrugInfo = [];
		}
		return DrugInfo;
	});
}

async function getUserBag(userid) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/User/getUserBag',
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
		// 材料列表
		if (msg.code == 0) {
			PropList = msg.data.userBagProps;
			// console.log(`共有${PropList.length}种材料`);
		} else {
			console.log(msg.msg);
			PropList = [];
		}
		return PropList;
	});
}

async function findProp(userid, needVal, attribute, propNum, druglv) {
	PropList = await getUserBag(userid);
	await sleep(1000);
	var prop_mu = [], prop_huo = [], prop_tu = [], prop_jin = [], prop_shui = [], prop_input = [];
	for (var i = 0; i < PropList.length; i++) {
		// 过滤稀有材料
		if (PropList[i].userBagProp.attribute == 0 && PropList[i].propInfo.name.match(/[\u4E00-\u9FA5]/g).length < 4) {
			prop_mu.push(PropList[i]);
		} else if (PropList[i].userBagProp.attribute == 1 && PropList[i].propInfo.name.match(/[\u4E00-\u9FA5]/g).length < 4) {
			prop_huo.push(PropList[i]);
		} else if (PropList[i].userBagProp.attribute == 2 && PropList[i].propInfo.name.match(/[\u4E00-\u9FA5]/g).length < 4) {
			prop_tu.push(PropList[i]);
		} else if (PropList[i].userBagProp.attribute == 3 && PropList[i].propInfo.name.match(/[\u4E00-\u9FA5]/g).length < 4) {
			prop_jin.push(PropList[i]);
		} else if (PropList[i].userBagProp.attribute == 4 && PropList[i].propInfo.name.match(/[\u4E00-\u9FA5]/g).length < 4) {
			prop_shui.push(PropList[i]);
		}
	}
	for (var j = 0; j < attribute.length; j++) {
		if (attribute[j] == 0) {
			prop_input.push(prop_mu);
		} else if (attribute[j] == 1) {
			prop_input.push(prop_huo);
		} else if (attribute[j] == 2) {
			prop_input.push(prop_tu);
		} else if (attribute[j] == 3) {
			prop_input.push(prop_jin);
		} else if (attribute[j] == 4) {
			prop_input.push(prop_shui);
		}
	}
	for (var k = 0; k < prop_input[0].length; k++) {
		for (var l = 0; l < prop_input[1].length; l++) {
			for (var m = 0; m < prop_input[2].length; m++) {
				for (var n = 0; n < prop_input[3].length; n++) {
					for (var o = 0; o < prop_input[4].length; o++) {
						var prop_input_all = [(prop_input[0][k]), (prop_input[1][l]), (prop_input[2][m]), (prop_input[3][n]), (prop_input[4][o])], prop_equal = [];
						val_input = propNum[0] * prop_input_all[0].propInfo.value + propNum[1] * prop_input_all[1].propInfo.value + propNum[2] * prop_input_all[2].propInfo.value + propNum[3] * prop_input_all[3].propInfo.value + propNum[4] * prop_input_all[4].propInfo.value;
						if (val_input >= needVal && val_input - needVal <= 50000 * druglv) {
							// 判断五个值(prop_input_all[p].userBagProp.id)是否有相等的
							var prop_input_all_now = _copyArrayObject(prop_input_all)
							for (var p = 0; p < 5; p++) {
								for (var q = p + 1; q < 5; q++) {
									if (prop_input_all_now[p].userBagProp.id == prop_input_all_now[q].userBagProp.id) {
										prop_equal.push([p, q]);
									}
								}
							}
							for (var r = 0; r < prop_equal.length; r++) {
								prop_input_all_now[prop_equal[r][1]].userBagProp.propNumber -= propNum[prop_equal[r][0]];
								// console.log(prop_equal[r][1], prop_equal[r][0]);
							}
							// 这个方法会出现如果一个属性材料需要两个4个，而材料有6个的话，会一直卡住的情况。但低概率事件，暂时不处理了，希望有好的办法(艹,出现了,我修bug行了吧(┬┬﹏┬┬)，bug修好了，运行速度急剧下降，丢(再补充，可以手动把一些数量极少的直接处理掉，剩下的计算时间会小很多很多(再补充，又调整了一下，将影响速度的东西放到了判断最后一层)))
							if (propNum[0] <= prop_input_all_now[0].userBagProp.propNumber && propNum[1] <= prop_input_all_now[1].userBagProp.propNumber && propNum[2] <= prop_input_all_now[2].userBagProp.propNumber && propNum[3] <= prop_input_all_now[3].userBagProp.propNumber && propNum[4] <= prop_input_all_now[4].userBagProp.propNumber) {
								console.log(`找到${prop_input_all_now[0].propInfo.name}+${prop_input_all_now[1].propInfo.name}+${prop_input_all_now[2].propInfo.name}+${prop_input_all_now[3].propInfo.name}+${prop_input_all_now[4].propInfo.name} 药值共${val_input}`);
								return prop_input_all_now;
							}
						}
					}
				}
			}
		}
	}
}
async function autoInput(userid, drugname, druglv, mapx, mapy) {
	DrugInfo = await getUserDrugInfo(userid, mapx, mapy);
	await sleep(500);
	var drugName = [], drugNeedProp = []; attribute = []; propNum = [], prop_id = [];
	for (var i = 0; i < DrugInfo.length; i++) {
		drugName.push(DrugInfo[i].drugInfo.name);
		drugNeedProp.push(DrugInfo[i].drugNeedProp);
	}
	console.log(`***寻找${drugname}丹方***`);
	var drugIndex = drugName.indexOf(drugname);
	if (drugIndex == -1) {
		console.log(`没有找到${drugname}，请检查输入是否正确`);
		return;
	} else {
		attribute[0] = drugNeedProp[drugIndex].attribute1;
		attribute[1] = drugNeedProp[drugIndex].attribute2;
		attribute[2] = drugNeedProp[drugIndex].attribute3;
		attribute[3] = drugNeedProp[drugIndex].attribute4;
		attribute[4] = drugNeedProp[drugIndex].attribute5;
		propNum[0] = drugNeedProp[drugIndex].prop1Num;
		propNum[1] = drugNeedProp[drugIndex].prop2Num;
		propNum[2] = drugNeedProp[drugIndex].prop3Num;
		propNum[3] = drugNeedProp[drugIndex].prop4Num;
		propNum[4] = drugNeedProp[drugIndex].prop5Num;
		needVal = drugNeedProp[drugIndex].needVal * druglv;
		drugid = drugNeedProp[drugIndex].drugId;
		console.log(`${druglv}品${drugname}所需药值：${needVal}`);
		console.log("***开始检索材料***");
		prop_input_all = await findProp(userid, needVal, attribute, propNum, druglv);
		if (prop_input_all == undefined) {
			prop_id = 0;
			return prop_id;
		} else {
			for (var i = 0; i < prop_input_all.length; i++) {
				prop_id.push(prop_input_all[i].userBagProp.id);
			}
			prop_id.unshift(drugid);
			return prop_id;
		}
	}
}

// 历练函数 参数：用户ID, 历练地点, 地图x轴位置, 地图y轴位置, 使用元气数量
async function experience(userid, mapname, mapx, mapy, offlinenum) {
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Map/experience',
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
		if (msg.code == 0 && msg.data.propInfo) {
			console.log(`获得:${msg.data.userBagProp.propNumber}个${msg.data.propInfo.name}`, `回合数：${msg.data.titles.length - 1}`, `状态：灵值${msg.data.userLv.linExp}`, `武值${msg.data.userLv.wuExp}`, `魂值${msg.data.userLv.hunExp}`);
			state = [msg.code, msg.data.userStateInfo.hp, msg.data.userStateInfo.hpMax, msg.data.userStateInfo.linMp, msg.data.userStateInfo.linMpMax, msg.data.userStateInfo.hunMp, msg.data.userStateInfo.hunMpMax, msg.data.titles.length - 1];
		} else {
			console.log(msg.msg.replace('Request succeeded', '历练失败'));
			state = [msg.code, 0, 0, 0, 0, 0, 0, 0];
		}
		return state;
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
			userstate = [msg.code, msg.data.userStateInfo.hp, msg.data.userStateInfo.hpMax, msg.data.userStateInfo.linMp, msg.data.userStateInfo.linMpMax, msg.data.userStateInfo.hunMp, msg.data.userStateInfo.hunMpMax];
		} else {
			console.log(msg.msg);
			userstate = [msg.code, 0, 0, 0, 0, 0, 0];
		}
		return userstate;
	});
}

// 历练主函数，参数：用户ID, 历练地点, 打坐地图，地图x轴位置, 地图y轴位置, 使用元气数量
// 这里因为是直接把历练函数拿过来了，参数有点乱，不过好在没出啥问题
async function Experience(userid, mapname, sitmap, mapx, mapy, offlinenum) {
	for (let count = 0; count < 1000; count++) {
		console.log(`第${count + 1}次历练`);
		try {
			state = await experience(userid, mapname, mapx, mapy, offlinenum);
			await sleep(4000);
			if (state[7] > 4) {
				await sleep(100 + (state[7] - 4) / 2 * 1600);
			}
			if (state[0] == 0 && state[1] < state[2] / 10) throw ("气血不足");
			if (state[0] == 0 && state[3] < state[4] / 10) throw ("灵力不足");
			if (state[0] == 0 && state[5] < state[6] / 10) throw ("魂力不足");
			if (state[0] == 0 && state[2] == 0) throw ("历练失败");
			if (state[0] == -2) throw ("身体被掏空");
		} catch (error) {
			console.log(`***${error}，开始打坐***`);
			for (let count = 0; count < 25; count++) {
				console.log(`第${count + 1}次打坐`);
				userstate = await dazuo(userid, sitmap, mapx, mapy);
				await sleep(4000);
				if (userstate[0] == 0 && userstate[1] === userstate[2] && userstate[3] === userstate[4] && userstate[5] === userstate[6]) {
					console.log("***状态已满，打坐结束***");
					break;
				}
			}
		}
	}
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function main(userid, drugname, druglv, sitmap, mapx, mapy, experiencemap, Serverkey, Deerkey) {
	prop_id = autoInput(userid, drugname, druglv, mapx, mapy);
	await sleep(2000);
	if (prop_id == 0) {
		console.log("没有找到合适的材料，发送通知并开始历练");
		// server酱提醒，如使用需自行申请更换sendkey
		if (Serverkey) {
			await ServerPush(Serverkey, "没有找到合适的材料", "请及时处理，一小时后将再次通知", 9);
		}else if (Deerkey){
			await DeerPush(Deerkey, "没有找到合适的材料", "请及时处理，一小时后将再次通知");
		}
		// 本来打算弄一个按任意键继续的,不过感觉没必要,本来也不好直接操作,但为了节省server酱次数就这样吧
		// 加一个历练看看效果
		await sleep(500);
		Experience(userid, experiencemap, sitmap, mapx, mapy, 0);
		await sleep(600000);
	} else {
		drugid = prop_id.shift();
		console.log(`***开始炼制${drugname}***`);
		drugstate = await makeDrug(userid, drugid, prop_id, druglv * 10);
		await sleep(1500);
		if (drugstate[0] == 0 && drugstate[1] > 0) {
			console.log(`***丹雷出现，开始抗雷***`);
			for (let count = 0; count < 30; count++) {
				drughp = await handle(userid, 1);
				await sleep(400);
				drughp = await handle(userid, 2);
				await sleep(400);
				if (drughp[0] == 0 && drughp[1] > 0) {
					console.log(`***丹雷未消散，打坐***`);
					userstate = await dazuo(userid, sitmap, mapx, mapy);
					await sleep(4000);
				} else if (drughp[0] == -1 && drughp[3] !== "异常信息") {
					console.log(`***${(msg.msg)}，打坐***`);
					userstate = await dazuo(userid, sitmap, mapx, mapy);
					await sleep(4000);
				} else break;
			}
		}
		console.log("***最后一轮打坐***");
		for (let count = 0; count < 30; count++) {
			console.log(`第${count + 1}次打坐`);
			userstate = await dazuo(userid, sitmap, mapx, mapy);
			await sleep(4000);
			if (userstate[0] == 0 && userstate[1] === userstate[2] && userstate[3] === userstate[4] && userstate[5] === userstate[6]) {
				console.log("***状态已满，结束***");
				break;
			}
		}
	}
}
// main(userid, drugname, druglv, sitmap, mapx, mapy, experiencemap);
main("4837a285-bb1a-4f9a-886e-946a3e11597a", "寻古丹", 7, "无极山1", 1, 2, "天潭2", "", "PDU11730TL2qnZl1EMFulx6P98fSp2UXOoY61etKz");