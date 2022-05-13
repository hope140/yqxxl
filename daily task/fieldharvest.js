const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
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
	task.next("药田收获完毕");
}

// 药田收获，填写药田编号

async function* main() {
	console.log("收获药田")
	yield field(2430);
	yield field(2431);
	yield field(2480);
	yield field(2519);
}
const task = main()
task.next()