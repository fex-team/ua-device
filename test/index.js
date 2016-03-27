#!nodejs/bin/node
var UA = require("../lib/ua-device");
var path = require('path');
var assert = require("assert");
var fs = require('fs');

var total_test_num = 0;
var recognize_num = {
	'browser_name': 0,
	'browser_version': 0,
	'engine_name': 0,
	'engine_version': 0,
	'os_name': 0,
	'os_version': 0,
	'device_manufacturer': 0,
	'device_model': 0
}

function testData () {
	var data_input_path = path.resolve(__dirname, './test_input');
	var data_input = String(fs.readFileSync(data_input_path)).split("\n");
	for(var i = 0; i < data_input.length; ++i) {
		if(data_input.length == 0) {
			continue;
		}
		total_test_num += 1;
		var tmp_result = new UA(data_input[i]);
		
		/********* handle browser engine os *********/
		var tmp_arr = ['browser', 'engine', 'os'];
		for(var j = 0; j < tmp_arr.length; ++j) {
			if(tmp_result[tmp_arr[j]]['name']) {
				recognize_num[tmp_arr[j]+'_name'] += 1;
			}
			if(tmp_result[tmp_arr[j]]['version'] && tmp_result[tmp_arr[j]]['version']['original']){
				recognize_num[tmp_arr[j]+'_version'] += 1;
			}
		}

		/***************** handle device *****************/
		var device_type = tmp_result['device']['type'] || '';
		var device_model = tmp_result['device']['model'] || '-';
		var device_manufacturer = tmp_result['device']['manufacturer'] || '-';
		if(tmp_result['device']['type'] == 'desktop' || tmp_result['device']['type'] == 'emulator' || tmp_result['device']['type'] == 'television') {
			recognize_num['device_manufacturer'] += 1;
			recognize_num['device_model'] += 1;
		} else if(tmp_result['device']['type'] == "mobile" || tmp_result['device']['type'] == 'tablet' || tmp_result['device']['type'] == 'media') {
			if(tmp_result['device']['model']) {
				recognize_num['device_model'] += 1;
			}
			if(tmp_result['device']['manufacturer']){
				recognize_num['device_manufacturer'] += 1;
			}
		}
	}

	// avoid the total num is 0
	if(total_test_num == 0) {
		total_test_num = 1;
	}
}

testData();
describe('ua-device测试数据共'+total_test_num+'条', function() {
	var result_arr = ['browser_name','browser_version','engine_name','engine_version','os_name','os_version','device_manufacturer','device_model'];
	for(var i = 0; i < result_arr.length; ++i) {
		var describe_str = result_arr[i]+'识别成功共 '+recognize_num[result_arr[i]]+' 条，成功率为 ' + parseFloat(recognize_num[result_arr[i]]*100/total_test_num).toFixed(2)+'%\n';
		it(describe_str, function() {
			assert.equal(1,1);
		});
	}
});
