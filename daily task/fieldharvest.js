const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function findUserFieldInfo(userid) {
	await sleep(100)
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Field/findUserFieldInfo',
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
			console.log(`当前存在${msg.data.fileInfoDataList[0].fieldInfo.id}、${msg.data.fileInfoDataList[1].fieldInfo.id}、${msg.data.fileInfoDataList[2].fieldInfo.id}、${msg.data.fileInfoDataList[3].fieldInfo.id}号药田`);
			fileInfo = [msg.code, msg.data.fileInfoDataList[0].fieldInfo.id, msg.data.fileInfoDataList[1].fieldInfo.id, msg.data.fileInfoDataList[2].fieldInfo.id, msg.data.fileInfoDataList[3].fieldInfo.id];
		} else {
			console.log(msg.msg);
			fileInfo = [msg.code, 0, 0, 0, 0];
		}
		return fileInfo;
	});
}

async function field(fieldid) {
	await sleep(1500)
	console.log(fieldid + "号药田");
	var request = require('request');
	var options = {
		'method': 'POST',
		'url': 'https://yqxxl.yqbros.com/Yqxxl/Field/fieldHarvest',
		'headers': {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"fieldId": fieldid
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

// 药田收获，填写药田编号

async function* main(userid) {
	console.log("***获取药田编号***");
	fileInfo = await findUserFieldInfo(userid);
	await sleep(1000);
	if (fileInfo[0] != 0) {
		console.log("***获取药田编号失败***");
	} else if (fileInfo[0] == 0) {
		console.log("***收获药田***")
		await field(fileInfo[1]);
		await field(fileInfo[2]);
		await field(fileInfo[3]);
		await field(fileInfo[4]);
	}
}
const task = main("4837a285-bb1a-4f9a-886e-946a3e11597a")
task.next()