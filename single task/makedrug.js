const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
async function makeDrug(userid, drugid, lists, lv, maxrun) {
	for (let count = 0; count < maxrun; count++) {
		await sleep(100)
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
}
makeDrug(27188, "2", "[196390,196390,196393,248615,211901]", 40, 1);