const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
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
		// 法器列表
		if (msg.code == 0) {
			DrugInfo = msg.data.userDrugInfos;
			console.log(`共有${DrugInfo.length}个丹方`);
		} else {
			console.log(msg.msg);
			DrugInfo = [];
		}
		return DrugInfo;
	});
}
async function main(userid, mapx, mapy) {
	DrugInfo = await getUserDrugInfo(userid, mapx, mapy);
}
main("4837a285-bb1a-4f9a-886e-946a3e11597a", 1 , 3)

