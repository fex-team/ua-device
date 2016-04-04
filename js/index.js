(function() {
    var localUA = navigator.userAgent;
    var uaList = [
    	localUA, 
    	'Mozilla/5.0 (Windows; U; Windows NT 5.1; de-CH) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.2', 
    	'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; GTB5; Avant Browser; .NET CLR 1.1.4322; .NET CLR 2.0.50727)', 
    	'Mozilla/5.0 (Macintosh; U; PPC Mac OS X 10.4; en; rv:1.9.0.19) Gecko/2011091218 Camino/2.0.9 (like Firefox/3.0.19)', 
    	'Mozilla/5.0 (Windows NT 6.2) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1090.0 Safari/536.6', 
    	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11', 
    	'Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.75 Safari/537.1', 
    	'Mozilla/5.0 (X11; U; Linux i686; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.127 Safari/534.16', 
    	'Mozilla/5.0 (iPhone; U; CPU iPhone OS 5_1_1 like Mac OS X; en) AppleWebKit/534.46.0 (KHTML, like Gecko) CriOS/19.0.1084.60 Mobile/9B206 Safari/7534.48.3', 
    	'Mozilla/5.0 (Linux; U; Android-4.0.3; en-us; Galaxy Nexus Build/IML74K) AppleWebKit/535.7 (KHTML, like Gecko) CrMo/16.0.912.75 Mobile Safari/535.7', 
    	'Mozilla/5.0 (X11; U; CrOS i686 9.10.0; en-US) AppleWebKit/532.5 (KHTML, like Gecko) Chrome/4.0.253.0 Safari/532.5'
    ];

    var png_browserList = ["360", "baidu", "maxthon", "superfast", "dolphin", "safari", "ie", "uc", "chrome", "chromium", "opera", "web", "webkit", "mozilla", "firefox", "sogou", "qq"];
    var png_osList = ['android','bsd','chromium','freebsd','mac','ios','symbian','unix','winphone','blackberry','centos','debian','linux','redhat','ubuntu','windows'];
    var png_deviceList = ['mobile_iphone.png','mobile_normal.png','pc_mac.png','pc_normal.png','tablet_ipad.png','tv.png'];

    var tmp_str = '<option value=0>本机UA</option>';
    for(var i = 1; i < uaList.length; ++i) {
    	tmp_str += ("<option value=" + i + ">" + uaList[i] + "</option>");
    }
    $("#uaSelect").html(tmp_str).select2();
    bindEvent();
    $("#resultText").html('<span class="uaResult"><span style="color:#999">Result for: </span>' + uaList[$("#uaSelect").val()] + '<span style="color:#999">(本机UA)</span></span>');
    showResult(uaList[$("#uaSelect").val()]);
    function bindEvent() {
    	$("#uaInput").keyup(function(event){
    		if(event.which == 13) {
    			$("#resultText").html('<span class="uaResult"><span style="color:#999">Result for: </span>' + $("#uaInput").val() + '</span>');
                showResult($("#uaInput").val());
    		}
    	});
    	$("body").delegate("#uaSelect", "change", function(event){
            if($("#uaSelect").val() == 0) {
                $("#resultText").html('<span class="uaResult"><span style="color:#999">Result for: </span>' + uaList[$("#uaSelect").val()] + '<span style="color:#999">(本机UA)</span></span>');
            } else {
                $("#resultText").html('<span class="uaResult"><span style="color:#999">Result for: </span>' + uaList[$("#uaSelect").val()] + '</span>');
            }
            showResult(uaList[$("#uaSelect").val()]);
    	});
    }
    function showResult(uaStr) {
        var res_ua = new uaDevice(uaStr);

        // handle browser
        var ua_browser = res_ua['browser']['name'] || '-';
        var ua_browser_version = '-';
        if (res_ua['browser']['version'] && res_ua['browser']['version']['original']){
            ua_browser_version = res_ua['browser']['version']['original'];
            // ua_browser_version = ua_browser_version.match(/(\d*\.?\d*)/)[1];
        }
        $("#ua_browser .ua_item_name").html(ua_browser);
        $("#ua_browser .ua_item_version").html(ua_browser_version);
        var browser_icon = '';
        if(png_browserList.indexOf(ua_browser.toLowerCase()) >= 0) {
            browser_icon = ua_browser.toLowerCase() + '.png';
        } else if (ua_browser == 'Internet Explorer'){
            browser_icon = 'ie.png';
        } else {
            browser_icon = 'undefined.png';
        }
        $("#ua_browser .ua_logo").html('<img src="'+BASE_URL+'/images/icons/browser/'+browser_icon+'" width=64 height=64 />');

        // handle engine
        var ua_engine = res_ua['engine']['name'] || '-';
        var ua_engine_version = '-';
        if (res_ua['engine']['version'] && res_ua['engine']['version']['original']){
            ua_engine_version = res_ua['engine']['version']['original'];
            // ua_engineV = ua_engineV.match(/(\d*\.?\d*)/)[1];
        }
        $("#ua_engine .ua_item_name").html(ua_engine);
        $("#ua_engine .ua_item_version").html(ua_engine_version);

        var engine_icon = '';
        if(ua_engine != '-') {
            engine_icon = 'check.png';
        } else {
            engine_icon = 'undefined.png';
        }
        $("#ua_engine .ua_logo").html('<img src="'+BASE_URL+'/images/icons/'+engine_icon+'" width=64 height=64 />');
        // handle os
        var ua_osName = res_ua['os']['name'] || '-';
        var ua_osVersion = '-';
        if (res_ua['os']['version'] && res_ua['os']['version']['original']){
            ua_osVersion = res_ua['os']['version']['original'];
            // ua_osVersion = ua_osVersion.match(/(\d*\.?\d*)/)[1];
        }
        $("#ua_os .ua_item_name").html(ua_osName);
        $("#ua_os .ua_item_version").html(ua_osVersion);

        var tmp_os_name = ua_osName.split(/[\s_]/g)[0].toLowerCase();
        var os_icon = '';
        if(png_osList.indexOf(tmp_os_name) >= 0) {
            os_icon = tmp_os_name + '.png';
        } else {
            os_icon = 'undefined.png';
        }
        $("#ua_os .ua_logo").html('<img src="'+BASE_URL+'/images/icons/os/'+os_icon+'" width=64 height=64 />');

        // handle ua_device
        var ua_device_type = res_ua['device']['type'] || '-';
        var ua_device_model = res_ua['device']['model'] || '-';
        var ua_device_manufacturer = res_ua['device']['manufacturer'] || '-';

        var device_icon = '';
        if(ua_device_type == 'desktop'){
            if(tmp_os_name == 'mac') {
                device_icon = 'pc_mac.png';
            } else {
                device_icon = 'pc_normal.png';                
            }
        } else if(ua_device_type == 'mobile') {
            if(tmp_os_name == 'ios') {
                device_icon = 'mobile_iphone.png';
            } else {
                device_icon = 'mobile_normal.png';               
            } 
        } else if(ua_device_type == 'tablet') {
            device_icon = 'tablet_ipad.png';
        } else if(ua_device_type == 'tv') {
            device_icon = 'tv.png';
        } else {
            device_icon = 'undefined.png';
        }
        $("#ua_device .ua_item_name").html(ua_device_manufacturer);
        $("#ua_device .ua_item_version").html(ua_device_model);
        $("#ua_device .ua_logo").html('<img src="'+BASE_URL+'/images/icons/device/'+device_icon+'" width=64 height=64 />');
    }

})();