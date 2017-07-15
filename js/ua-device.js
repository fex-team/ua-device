var uaDevice = function(ua) {
    var UA = useragent_base;
    var uaData = new UA(ua);
    var match;
    var tmpMatch;
    // handle mobile device
    if (uaData.device.type === 'mobile' || uaData.device.type === 'tablet') {

        // get manufacturer through the key words
        if (match = ua.match(/(ZTE|Samsung|Motorola|HTC|Coolpad|Huawei|Lenovo|LG|Sony Ericsson|Oppo|TCL|Vivo|Sony|Meizu|Nokia)/i)) {
            uaData.device.manufacturer = match[1];
            if (uaData.device.model && uaData.device.model.indexOf(match[1]) >= 0) {
                uaData.device.model = uaData.device.model.replace(match[1], '');
            }
        }
        // handle Apple
        // 苹果就这3种iPod iPad iPhone
        if (match = ua.match(/(iPod|iPad|iPhone)/i)) {
            uaData.device.manufacturer = 'Apple';
            uaData.device.model = match[1];
        }
        // handle Samsung
        // 特殊型号可能以xxx-开头 或者直接空格接型号 兼容build结尾或直接)结尾
        // Galaxy nexus才是三星 nexus是google手机
        // 三星手机类型：galaxy xxx|SM-xxx|GT-xxx|SCH-xxx|SGH-xxx|SPH-xxx|SHW-xxx  若这些均未匹配到，则启用在中关村在线爬取到的机型白名单进行判断
        else if (match = ua.match(/[-\s](Galaxy[\s-_]nexus|Galaxy[\s-_]\w*[\s-_]\w*|Galaxy[\s-_]\w*|SM-\w*|GT-\w*|s[cgp]h-\w*|shw-\w*|ATIV|i9070|omnia|s7568|A3000|A3009|A5000|A5009|A7000|A7009|A8000|C101|C1116|C1158|E400|E500F|E7000|E7009|G3139D|G3502|G3502i|G3508|G3508J|G3508i|G3509|G3509i|G3558|G3559|G3568V|G3586V|G3589W|G3606|G3608|G3609|G3812|G388F|G5108|G5108Q|G5109|G5306W|G5308W|G5309W|G550|G600|G7106|G7108|G7108V|G7109|G7200|G720NO|G7508Q|G7509|G8508S|G8509V|G9006V|G9006W|G9008V|G9008W|G9009D|G9009W|G9198|G9200|G9208|G9209|G9250|G9280|I535|I679|I739|I8190N|I8262|I879|I879E|I889|I9000|I9060|I9082|I9082C|I9082i|I9100|I9100G|I9108|I9128|I9128E|I9128i|I9152|I9152P|I9158|I9158P|I9158V|I9168|I9168i|I9190|I9192|I9195|I9195I|I9200|I9208|I9220|I9228|I9260|I9268|I9300|I9300i|I9305|I9308|I9308i|I939|I939D|I939i|I9500|I9502|I9505|I9507V|I9508|I9508V|I959|J100|J110|J5008|J7008|N7100|N7102|N7105|N7108|N7108D|N719|N750|N7505|N7506V|N7508V|N7509V|N900|N9002|N9005|N9006|N9008|N9008S|N9008V|N9009|N9100|N9106W|N9108V|N9109W|N9150|N916|N9200|P709|P709E|P729|S6358|S7278|S7278U|S7562C|S7562i|S7898i|b9388)[\s\)]/i)) {
            uaData.device.manufacturer = 'Samsung';
            // 解决移动联通等不同发行版导致的机型不同问题
            // 特征：[A-Z]+[0-9]+[A-Z]*, 例如 G9006 G9006V 其实应该是G9006 另外三星只保留3位
            uaData.device.model = match[1].replace(/Galaxy S VI/i, 'Galaxy S6')
                .replace(/Galaxy S V/i, 'Galaxy S5')
                .replace(/Galaxy S IV/i, 'Galaxy S4')
                .replace(/Galaxy s III/i, 'Galaxy S3')
                .replace(/Galaxy S II/i, 'Galaxy S2')
                .replace(/Galaxy S I/i, 'Galaxy S1')
                .replace(/([a-z]+[0-9]{3})[0-9]?[a-z]*/i, '$1');
        }
        // 针对三星已经匹配出的数据做处理
        else if (uaData.device.manufacturer && uaData.device.manufacturer.toLowerCase() === 'samsung' && uaData.device.model) {
            uaData.device.model = uaData.device.model.replace(/Galaxy S VI/i, 'Galaxy S6')
                .replace(/Galaxy S V/i, 'Galaxy S5')
                .replace(/Galaxy S IV/i, 'Galaxy S4')
                .replace(/Galaxy s III/i, 'Galaxy S3')
                .replace(/Galaxy S II/i, 'Galaxy S2')
                .replace(/Galaxy S I/i, 'Galaxy S1')
                .replace(/([a-z]+[0-9]{3})[0-9]?[a-z]*/i, '$1');
        }
        // handle Huawei
        // 兼容build结尾或直接)结尾
        // 华为机型特征：Huawei[\s-_](\w*[-_]?\w*)  或者以 7D-  ALE-  CHE-等开头
        else if (match = ua.match(/(Huawei[\s-_](\w*[-_]?\w*)|\s(7D-\w*|ALE-\w*|ATH-\w*|CHE-\w*|CHM-\w*|Che1-\w*|Che2-\w*|D2-\w*|G616-\w*|G620S-\w*|G621-\w*|G660-\w*|G750-\w*|GRA-\w*|Hol-\w*|MT2-\w*|MT7-\w*|PE-\w*|PLK-\w*|SC-\w*|SCL-\w*|H60-\w*|H30-\w*)[\s\)])/i)) {
            uaData.device.manufacturer = 'Huawei';
            if (match[2]) {
                uaData.device.model = match[2];
            }
            else if (match[3]) {
                uaData.device.model = match[3];
            }
            // 解决移动联通等不同发行版导致的机型不同问题
            // 特征：xxx-[A-Z][0-9]+ 例如  H30-L01  H30-L00  H30-L20  都应该是 H30-L
            // h30-l  h30-h  h30-t 都是H30
            if (match = uaData.device.model.match(/(\w*)[\s-_]+[a-z0-9]+/i)) {
                uaData.device.model = match[1];
            }
        }
        // handle Xiaomi
        // 兼容build结尾或直接)结尾 以及特殊的HM处理方案(build/hm2013011)
        // xiaomi手机类型: mi m1 m2 m3 hm 开头
        // hongmi有特殊判断build/hm2015011
        else if (match = ua.match(/;\s(mi|m1|m2|m3|m4|hm)(\s*\w*)[\s\)]/i)) {
            if (tmpMatch = ua.match(/(meitu|MediaPad)/i)) {
                // 美图手机名字冒充小米 比如 meitu m4 mizhi
                uaData.device.manufacturer = tmpMatch[1];
                uaData.device.model = '';
            }
            // 若匹配出的 match[2]没空格 会出现很多例如 mizi mizhi miha 但也会出现mi3 minote之类 特殊处理下
            else if (match[2].length > 0 && !((/\s/).test(match[2]))) {
                if (tmpMatch = match[2].match(/(\d)/i)) {
                    uaData.device.model = match[1] + '-' + tmpMatch[1];
                }
            }
            else {
                uaData.device.manufacturer = 'Xiaomi';
                if (match[2] && match[2].length > 0) {
                    match[2] = match[2].replace(/\s/, '');
                    uaData.device.model = (match[1].substr(match[1].length - 2) + '-' + match[2]).replace(/m(\d)-/i, 'MI-$1');
                }
                else {
                    uaData.device.model = (match[1].substr(match[1].length - 2)).replace(/m(\d)/i, 'MI-$1');
                }

                // 解决移动联通等不同发行版导致的机型不同问题
                // 特征：mi-3c,例如mi-4LTE mi-4 其实应该是 mi-4
                if (/(mi|hm)(-\d)/i.test(uaData.device.model)) {
                    // 看看是不是 MI-3S  MI-4S....
                    if (match = uaData.device.model.match(/(mi|hm)(-\ds)/i)) {
                        uaData.device.model = match[1] + match[2];
                    }
                    // 防止 MI-20150XX等滥竽充数成为MI-2
                    else if (match = uaData.device.model.match(/(mi|hm)(-\d{2})/i)) {
                        uaData.device.model = match[1];
                    }
                    // 将mi-3c mi-3a mi-3w等合为mi-3
                    else if (match = uaData.device.model.match(/(mi|hm)(-\d)[A-Z]/i)) {
                        uaData.device.model = match[1] + match[2];
                    }
                }
                // 去除 mi-4g这样的东西
                if (match = uaData.device.model.match(/(mi|hm)(-\dg)/i)) {
                    uaData.device.model = match[1];
                }
            }
        }
        else if (/build\/HM\d{0,7}\)/i.test(ua)) {
            uaData.device.manufacturer = 'Xiaomi';
            uaData.device.model = 'HM';
        }
        else if (match = ua.match(/redmi\s?(\d+)?/i)) {
            uaData.device.manufacturer = 'Xiaomi';
            uaData.device.model = 'HM-' + match[1];
        }
        else if (uaData.device.manufacturer && uaData.device.manufacturer.toLowerCase() === 'xiaomi' && uaData.device.model) {
            // 针对通过base库判断出数据时命名风格不同。特殊处理适配如下
            if (match = uaData.device.model.match(/mi-one/i)) {
                uaData.device.model = 'MI-1';
            }
            // mi 2
            else if (match = uaData.device.model.match(/mi-two/i)) {
                uaData.device.model = 'MI-2';
            }
            // 20150xxx2014501
            else if (match = uaData.device.model.match(/\d{6}/i)) {
                uaData.device.model = '';
            }
            else if (match = uaData.device.model.match(/redmi/i)) {
                uaData.device.model = uaData.device.model.toUpperCase().replace(/redmi/i, 'HM');
            }
            // m1 m2 m3 写法不标准 另外判断是否是 m1-s
            else if (match = uaData.device.model.match(/(m\d)[\s-_](s?)/i)) {
                uaData.device.model = match[1].replace(/m/, 'MI-') + match[2];
            }
            // mi-2w  mi-3w 等格式化为mi-2  mi-3
            else if (match = uaData.device.model.match(/(hm|mi)[\s-_](\d?)[a-rt-z]/i)) {
                if (tmpMatch = uaData.device.model.match(/(mi|hm)[\s-_](note|pad)(\d?s?)/i)) {
                    uaData.device.model = tmpMatch[1] + '-' + tmpMatch[2] + tmpMatch[3];
                }
                else {
                    uaData.device.model = match[2] ? match[1] + '-' + match[2] : match[1];
                }
            }
            // 处理hm
            else if (match = uaData.device.model.match(/hm/i)) {
                // 判断是不是 hm-201xxx充数
                if (match = uaData.device.model.match(/(hm)[\s-_](\d{2})/i)) {
                    uaData.device.model = 'HM';
                }
                // 判断是不是 hm-2s hm-1s
                else if (match = uaData.device.model.match(/(hm)[\s-_](\ds)/i)) {
                    uaData.device.model = 'HM-' + match[2];
                }
                else if (match = uaData.device.model.match(/(hm)[\s-_](\d)[a-z]/i)) {
                    uaData.device.model = 'HM-' + match[2];
                }
                else {
                    uaData.device.model = 'HM';
                }
                // 过滤类似 2g 3g等数据
                if (/hm-\dg/.test(uaData.device.model)) {
                    uaData.device.model = 'HM';
                }
            }
        }
        // handle Vivo
        // 兼容build结尾或直接)结尾
        // vivo机型特征: Vivo[\s-_](\w*)  或者以 E1  S11t  S7t 等开头
        else if (match = ua.match(/(vivo[\s-_](\w*)|\s(E1\w?|E3\w?|E5\w?|V1\w?|V2\w?|S11\w?|S12\w?|S1\w?|S3\w?|S6\w?|S7\w?|S9\w?|X1\w?|X3\w?|X520\w?|X5\w?|X5Max|X5Max+|X5Pro|X5SL|X710F|X710L|Xplay|Xshot|Xpaly3S|Y11\w?|Y11i\w?|Y11i\w?|Y13\w?|Y15\w?|Y17\w?|Y18\w?|Y19\w?|Y1\w?|Y20\w?|Y22\w?|Y22i\w?|Y23\w?|Y27\w?|Y28\w?|Y29\w?|Y33\w?|Y37\w?|Y3\w?|Y613\w?|Y622\w?|Y627\w?|Y913\w?|Y923\w?|Y927\w?|Y928\w?|Y929\w?|Y937\w?)[\s\)])/i)) {
            uaData.device.manufacturer = 'Vivo';
            uaData.device.model = match[1];
            // 首先剔除 viv-  vivo-  bbg- 等打头的内容
            uaData.device.model = uaData.device.model.replace(/(viv[\s-_]|vivo[\s-_]|bbg[\s-_])/i, '');
            // 解决移动联通等不同发行版导致的机型不同问题
            // 特征：[A-Z][0-9]+[A-Z] 例如  X5F X5L X5M X5iL 都应该是 X5
            if (match = uaData.device.model.match(/([a-z]+[0-9]+)i?[a-z]?[\s-_]?/i)) {
                uaData.device.model = match[1];
            }
        }
        // handle Oppo
        else if (match = ua.match(/(Oppo[\s-_](\w*)|\s(1100|1105|1107|3000|3005|3007|6607|A100|A103|A105|A105K|A109|A109K|A11|A113|A115|A115K|A121|A125|A127|A129|A201|A203|A209|A31|A31c|A31t|A31u|A51kc|A520|A613|A615|A617|E21W|Find|Mirror|N5110|N5117|N5207|N5209|R2010|R2017|R6007|R7005|R7007|R7c|R7t|R8000|R8007|R801|R805|R807|R809T|R8107|R8109|R811|R811W|R813T|R815T|R815W|R817|R819T|R8200|R8205|R8207|R821T|R823T|R827T|R830|R830S|R831S|R831T|R833T|R850|Real|T703|U2S|U521|U525|U529|U539|U701|U701T|U705T|U705W|X9000|X9007|X903|X905|X9070|X9077|X909|Z101|R829T)[\s\)])/i)) {
            uaData.device.manufacturer = 'Oppo';
            if (match[2]) {
                uaData.device.model = match[2];
            }
            else if (match[3]) {
                uaData.device.model = match[3];
            }
            // 解决移动联通等不同发行版导致的机型不同问题
            // 特征：[A-Z][0-9]+[A-Z] 例如  A31c A31s 都应该是 A31
            // 对 Plus 做特殊处理
            if (match = uaData.device.model.match(/([a-z]+[0-9]+)-?(plus)/i)) {
                uaData.device.model = match[1] + '-' + match[2];
            }
            else if (match = uaData.device.model.match(/(\w*-?[a-z]+[0-9]+)/i)) {
                uaData.device.model = match[1];
            }
        }
        else if (uaData.device.manufacturer && uaData.device.manufacturer.toLowerCase() === 'oppo' && uaData.device.model) {
            // 针对base库的数据做数据格式化处理
            // 解决移动联通等不同发行版导致的机型不同问题
            // 特征：[A-Z][0-9]+[A-Z] 例如  A31c A31s 都应该是 A31
            // 对 Plus 做特殊处理
            if (match = uaData.device.model.match(/([a-z]+[0-9]+)-?(plus)/i)) {
                uaData.device.model = match[1] + '-' + match[2];
            }
            else if (match = uaData.device.model.match(/(\w*-?[a-z]+[0-9]+)/i)) {
                uaData.device.model = match[1];
            }
        }
        // handle Lenovo
        // 兼容build结尾或直接)结尾 兼容Lenovo-xxx/xxx以及Leveno xxx build等
        else if (match = ua.match(/(Lenovo[\s-_](\w*[-_]?\w*)|\s(A3580|A3860|A5500|A5600|A5860|A7600|A806|A800|A808T|A808T-I|A936|A938t|A788t|K30-E|K30-T|K30-W|K50-T3s|K50-T5|K80M|K910|K910e|K920|S90-e|S90-t|S90-u|S968T|X2-CU|X2-TO|Z90-3|Z90-7)[\s\)])/i)) {
            uaData.device.manufacturer = 'Lenovo';
            if (match[2]) {
                uaData.device.model = match[2];
            }
            else if (match[3]) {
                uaData.device.model = match[3];
            }
            // 解决移动联通等不同发行版导致的机型不同问题
            // 特征：[A-Z][0-9]+[A-Z] 例如  A360t A360 都应该是 A360
            if (match = uaData.device.model.match(/([a-z]+[0-9]+)/i)) {
                uaData.device.model = match[1];
            }
        }
        // handle coolpad
        else if (match = ua.match(/(Coolpad[\s-_](\w*)|\s(7295C|7298A|7620L|8908|8085|8970L|9190L|Y80D)[\s\)])/i)) {
            uaData.device.manufacturer = 'Coolpad';
            if (match[2]) {
                uaData.device.model = match[2];
            }
            else if (match[3]) {
                uaData.device.model = match[3];
            }

            // 解决移动联通等不同发行版导致的机型不同问题
            // 特征：[A-Z][0-9]+[A-Z] 例如  8297-t01 8297-c01 8297w 都应该是 8297
            if (match = uaData.device.model.match(/([a-z]?[0-9]+)/i)) {
                uaData.device.model = match[1];
            }
        }
        else if (uaData.device.manufacturer && uaData.device.manufacturer.toLowerCase() === 'coolpad' && uaData.device.model) {
            // base 库适配
            // 解决移动联通等不同发行版导致的机型不同问题
            // 特征：[A-Z][0-9]+[A-Z] 例如  8297-t01 8297-c01 8297w 都应该是 8297
            if (match = uaData.device.model.match(/([a-z]?[0-9]+)/i)) {
                uaData.device.model = match[1];
            }
        }
        // handle meizu
        else if (match = ua.match(/\s(mx\d*\w*|mz-(\w*))\s(\w*)\s*\w*\s*build/i)) {
            uaData.device.manufacturer = 'Meizu';
            var tmpModel = match[2] ? match[2] : match[1];
            if (match[3]) {
                uaData.device.model = tmpModel + '-' + match[3];
            }
            else {
                uaData.device.model = tmpModel + '';
            }
        }
        else if (match = ua.match(/M463C|M35\d/i)) {
            uaData.device.manufacturer = 'Meizu';
            uaData.device.model = match[1];
        }
        // handle htc
        else if (match = ua.match(/(Htc[-_\s](\w*)|\s(601e|606w|608t|609d|610t|6160|619d|620G|626d|626s|626t|626w|709d|801e|802d|802t|802w|809D|816d|816e|816t|816v|816w|826d|826s|826t|826w|828w|901e|919d|A310e|A50AML|A510e|A620d|A620e|A620t|A810e|A9191|Aero|C620d|C620e|C620t|D316d|D516d|D516t|D516w|D820mt|D820mu|D820t|D820ts|D820u|D820us|E9pt|E9pw|E9sw|E9t|HD7S|M8Et|M8Sd|M8St|M8Sw|M8d|M8e|M8s|M8si|M8t|M8w|M9W|M9ew|Phablet|S510b|S510e|S610d|S710d|S710e|S720e|S720t|T327t|T328d|T328t|T328w|T329d|T329t|T329w|T528d|T528t|T528w|T8698|WF5w|X315e|X710e|X715e|X720d|X920e|Z560e|Z710e|Z710t|Z715e)[\s\)])/)) {
            uaData.device.manufacturer = 'Htc';
            uaData.device.model = match[1];
        }
        // handle Gionee
        else if (match = ua.match(/(Gionee[\s-_](\w*)|\s(GN\d+\w*)[\s\)])/i)) {
            uaData.device.manufacturer = 'Gionee';
            if (match[2]) {
                uaData.device.model = match[2];
            }
            else if (match[3]) {
                uaData.device.model = match[3];
            }
        }
        // handle LG
        else if (match = ua.match(/(LG[-_](\w*)|\s(D728|D729|D802|D855|D856|D857|D858|D859|E985T|F100L|F460|H778|H818|H819|P895|VW820)[\s\)])/i)) {
            uaData.device.manufacturer = 'Lg';
            if (match[2]) {
                uaData.device.model = match[2];
            }
            else if (match[3]) {
                uaData.device.model = match[3];
            }
        }
        // handle tcl
        else if (match = ua.match(/(Tcl[\s-_](\w*)|\s(H916T|P588L|P618L|P620M|P728M)[\s\)])/)) {
            uaData.device.manufacturer = 'Tcl';
            uaData.device.model = match[1];
        }
        // ZTE
        else if (match = ua.match(/(V9180|N918)/i)) {
            uaData.device.manufacturer = 'Zte';
            uaData.device.model = match[1];
        }
        else if (uaData.device.manufacturer && uaData.device.manufacturer.toLowerCase() === 'zte' && uaData.device.model) {
            // base 库适配
            // 解决移动联通等不同发行版导致的机型不同问题
            // 特征：[A-Z][0-9]+[A-Z] 例如  Q505T Q505u 都应该是 Q505
            if (match = uaData.device.model.match(/([a-z]?[0-9]+)/i)) {
                uaData.device.model = match[1];
            }
        }
        // UIMI
        else if (match = ua.match(/(UIMI\w*|umi\w*)[\s-_](\w*)\s*\w*\s*build/i)) {
            uaData.device.manufacturer = 'Uimi';
            if (match[2]) {
                uaData.device.model = match[1] + '-' + match[2];
            }
            else {
                uaData.device.model = match[1] + '';
            }
        }
        // eton
        else if (match = ua.match(/eton[\s-_](\w*)/i)) {
            uaData.device.manufacturer = 'Eton';
            uaData.device.model = match[1];
        }
        // Smartisan
        else if (match = ua.match(/(SM705|SM701|YQ601|YQ603)/i)) {
            uaData.device.manufacturer = 'Smartisan';
            uaData.device.model = ({
                SM705: 'T1',
                SM701: 'T1',
                YQ601: 'U1',
                YQ603: 'U1'
            })[match[1]] || match[1];
        }
        // handle Asus
        else if (match = ua.match(/(Asus[\s-_](\w*)|\s(A500CG|A500KL|A501CG|A600CG|PF400CG|PF500KL|T001|X002|X003|ZC500TG|ZE550ML|ZE551ML)[\s\)])/i)) {
            uaData.device.manufacturer = 'Asus';
            if (match[2]) {
                uaData.device.model = match[2];
            }
            else if (match[3]) {
                uaData.device.model = match[3];
            }
        }
        // handle nubia
        else if (match = ua.match(/(Nubia[-_\s](\w*)|(NX501|NX505J|NX506J|NX507J|NX503A|nx\d+\w*)[\s\)])/i)) {
            uaData.device.manufacturer = 'Nubia';
            if (match[2]) {
                uaData.device.model = match[2];
            }
            else if (match[3]) {
                uaData.device.model = match[3];
            }
        }
        // handle haier
        else if (match = ua.match(/(HT-\w*)|Haier[\s-_](\w*-?\w*)/i)) {
            uaData.device.manufacturer = 'Haier';
            if (match[1]) {
                uaData.device.model = match[1];
            }
            else if (match[2]) {
                uaData.device.model = match[2];
            }
        }
        // tianyu
        else if (match = ua.match(/K-Touch[\s-_](tou\s?ch\s?(\d)|\w*)/i)) {
            uaData.device.manufacturer = 'K-Touch';
            if (match[2]) {
                uaData.device.model = 'Ktouch' + match[2];
            }
            else {
                uaData.device.model = match[1];
            }
        }

        // DOOV
        else if (match = ua.match(/Doov[\s-_](\w*)/i)) {
            uaData.device.manufacturer = 'Doov';
            uaData.device.model = match[1];
        }
        // coobee
        else if (/koobee/i.test(ua)) {
            uaData.device.manufacturer = 'koobee';
        }

        // sony
        else if (/C69/i.test(ua)) {
            uaData.device.manufacturer = 'Sony';
        }

        // haojixing
        else if (/N787|N818S/i.test(ua)) {
            uaData.device.manufacturer = 'Haojixing';
        }

        // haisense
        else if (match = ua.match(/(hs-|Hisense[\s-_])(\w*)/i)) {
            uaData.device.manufacturer = 'Hisense';
            uaData.device.model = match[2];
        }

        // format the style of manufacturer
        if (uaData.device.manufacturer) {
            uaData.device.manufacturer = uaData.device.manufacturer.substr(0, 1).toUpperCase() + uaData.device.manufacturer.substr(1).toLowerCase();
        }
        // format the style of model
        if (uaData.device.model) {
            uaData.device.model = uaData.device.model.toUpperCase().replace(/-+|_+|\s+/g, ' ');
            uaData.device.model = uaData.device.model.match(/\s*(\w*\s*\w*)/)[1].replace(/\s+/, '-');

            // 针对三星、华为做去重的特殊处理
            if (uaData.device.manufacturer === 'Samsung') {
                uaData.device.model = ({
                    'SCH-I95': 'GT-I950',
                    'SCH-I93': 'GT-I930',
                    'SCH-I86': 'GT-I855',
                    'SCH-N71': 'GT-N710',
                    'SCH-I73': 'GT-S789',
                    'SCH-P70': 'GT-I915'
                })[uaData.device.model] || uaData.device.model;
            }
            else if (uaData.device.manufacturer === 'Huawei') {
                uaData.device.model = ({
                    CHE1: 'CHE',
                    CHE2: 'CHE',
                    G620S: 'G621',
                    C8817D: 'G621'
                })[uaData.device.model] || uaData.device.model;
            }
        }

        // 针对xiaomi 的部分数据没有格式化成功，格式化1次
        if (uaData.device.manufacturer && uaData.device.manufacturer === 'Xiaomi') {
            if (match = uaData.device.model.match(/(hm|mi)-(note)/i)) {
                uaData.device.model = match[1] + '-' + match[2];
            }
            else if (match = uaData.device.model.match(/(hm|mi)-(\ds?)/i)) {
                uaData.device.model = match[1] + '-' + match[2];
            }
            else if (match = uaData.device.model.match(/(hm|mi)-(\d)[a-rt-z]/i)) {
                uaData.device.model = match[1] + '-' + match[2];
            }
        }
    }
    // handle browser
    // if (!uaData.browser.name) {
    // ua = ua.toLowerCase();
    if (uaData.device.type === 'desktop') {
        /*
         * 360 security Explorer
         */
        if (match = /360se(?:[ \/]([\w.]+))?/i.exec(ua)) {
            uaData.browser.name = '360 security Explorer';
            uaData.browser.version = {
                original: match[1]
            };
        }
        /**
         * the world
         */
        else if (match = /the world(?:[ \/]([\w.]+))?/i.exec(ua)) {
            uaData.browser.name = 'the world';
            uaData.browser.version = {
                original: match[1]
            };
        }
        /**
         * tencenttraveler
         */
        else if (match = /tencenttraveler ([\w.]+)/i.exec(ua)) {
            uaData.browser.name = 'tencenttraveler';
            uaData.browser.version = {
                original: match[1]
            };
        }
        /**
         * LBBROWSER
         */
        else if (match = /LBBROWSER/i.exec(ua)) {
            uaData.browser.name = 'LBBROWSER';
        }
    }
    else if (uaData.device.type === 'mobile' || uaData.device.type === 'tablet') {
        /**
         * BaiduHD
         */
        if (match = /BaiduHD\s+([\w.]+)/i.exec(ua)) {
            uaData.browser.name = 'BaiduHD';
            uaData.browser.version = {
                original: match[1]
            };
        }
        /**
         * 360 Browser
         */
        else if (match = /360.s*aphone\s*browser\s*\(version\s*([\w.]+)\)/i.exec(ua)) {
            uaData.browser.name = '360 Browser';
            uaData.browser.version = {
                original: match[1]
            };
        }
        /**
         * Baidu Browser
         */
        else if (match = /flyflow\/([\w.]+)/i.exec(ua)) {
            uaData.browser.name = 'Baidu Browser';
            uaData.browser.version = {
                original: match[1]
            };
        }

        /**
         * Baidu HD
         */
        else if (match = /baiduhd ([\w.]+)/i.exec(ua)) {
            uaData.browser.name = 'Baidu HD';
            uaData.browser.version = {
                original: match[1]
            };
        }

        /**
         * baidubrowser
         */
        else if (match = /baidubrowser\/([\d\.]+)\s/i.exec(ua)) {
            uaData.browser.name = 'baidubrowser';
            uaData.browser.version = {
                original: match[1]
            };
        }

        /**
         * LieBaoFast
         */
        else if (match = /LieBaoFast\/([\w.]+)/i.exec(ua)) {
            uaData.browser.name = 'LieBao Fast';
            uaData.browser.version = {
                original: match[1]
            };
        }

        /**
         * LieBao
         */
        else if (match = /LieBao\/([\w.]+)/i.exec(ua)) {
            uaData.browser.name = 'LieBao';
            uaData.browser.version = {
                original: match[1]
            };
        }

        /**
         * SOUGOU
         */
        else if (match = /Sogou\w+\/([0-9\.]+)/i.exec(ua)) {
            uaData.browser.name = 'SogouMobileBrowser';
            uaData.browser.version = {
                original: match[1]
            };
        }

        /**
         * 百度国际
         */
        else if (match = /bdbrowser\w+\/([0-9\.]+)/i.exec(ua)) {
            uaData.browser.name = '百度国际';
            uaData.browser.version = {
                original: match[1]
            };
        }

        /**
         * Android Chrome Browser
         */
        else if (uaData.os.name === 'Android' && /safari/i.test(ua) && (match = /chrome\/([0-9\.]+)/i.exec(ua))) {
            if (tmpMatch = ua.match(/\s+(\w+Browser)\/?([\d\.]*)/)) {
                uaData.browser.name = tmpMatch[1];
                if (tmpMatch[2]) {
                    uaData.browser.version = {original: tmpMatch[2]};
                } else {
                    uaData.browser.version = {original: match[1]};
                }
            } else {
                uaData.browser.name = 'Android Chrome';
                uaData.browser.version = {original: match[1]};
            }
        }

        /**
         * Android Google Browser
         */
        else if (uaData.os.name === 'Android' && /safari/i.test(ua) && (match = /version\/([0-9\.]+)/i.exec(ua))) {
            if (tmpMatch = ua.match(/\s+(\w+Browser)\/?([\d\.]*)/)) {
                uaData.browser.name = tmpMatch[1];
                if (tmpMatch[2]) {
                    uaData.browser.version = {original: tmpMatch[2]};
                } else {
                    uaData.browser.version = {original: match[1]};
                }
            } else {
                uaData.browser.name = 'Android Browser';
                uaData.browser.version = {original: match[1]};
            }
        }

        /**
         * 'Mozilla/5.0 (iPad; CPU OS 5_1_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B206' belongs to Safari
         */
        else if (/(ipad|iphone).* applewebkit\/.* mobile/i.test(ua)) {
            uaData.browser.name = 'Safari';
        }
    }
    if (match = ua.match(/baiduboxapp\/?([\d\.]*)/i)) {
        uaData.browser.name = '百度框';
        if (match[1]) {
            uaData.browser.version = {
                original: match[1]
            };
        }
        // uaData.browser.name = 'baidu box';
    }
    else if (/BaiduLightAppRuntime/i.test(ua)) {
        uaData.browser.name = '轻应用runtime';
        // uaData.browser.name = 'qing runtime';
    }
    else if (/Weibo/i.test(ua)) {
        uaData.browser.name = '微博';
        // uaData.browser.name = 'weibo';
    }
    else if (/MQQ/i.test(ua)) {
        uaData.browser.name = '手机QQ';
        // uaData.browser.name = 'mobile qq';
    }
    else if (/hao123/i.test(ua)) {
        uaData.browser.name = 'hao123';
    }
    // }
    if (match = /MicroMessenger\/([\w.]+)/i.exec(ua)) {
        uaData.browser.name = '微信';
        var tmpVersion = (match[1]).replace(/_/g, '.');
        tmpMatch = /(\d+\.\d+\.\d+\.\d+)/.exec(tmpVersion);
        if(tmpMatch) {
            tmpVersion = tmpMatch[1];
        }
        uaData.browser.version = {
            original: tmpVersion
        };
    }
    if (match = /UCBrowser\/([\w.]+)/i.exec(ua)) {
        uaData.browser.name = 'UC Browser';
        uaData.browser.version = {
            original: match[1]
        };
    }
    if (match = /OPR\/([\w.]+)/i.exec(ua)) {
        uaData.browser.name = 'Opera';
        uaData.browser.version = {
            original: match[1]
        };
    } else if (match = /OPiOS\/([\w.]+)/i.exec(ua)) {
        uaData.browser.name = 'Opera';
        uaData.browser.version = {
            original: match[1]
        };
    }
    // IE 11
    else if (/Trident\/7/i.test(ua) && /rv:11/i.test(ua)) {
        uaData.browser.name = 'Internet Explorer';
        uaData.browser.version = {
            major: '11',
            original: '11'
        };
    }
    // Microsoft Edge
    else if (/Edge\/12/i.test(ua) && /Windows Phone|Windows NT/i.test(ua)) {
        uaData.browser.name = 'Microsoft Edge';
        uaData.browser.version = {
            major: '12',
            original: '12'
        };
    }
    // miui browser
    else if (match = /miuibrowser\/([\w.]+)/i.exec(ua)) {
        uaData.browser.name = 'miui browser';
        uaData.browser.version = {
            original: match[1]
        };
    }
    // Safari
    if (!uaData.browser.name) {
        if (match = /Safari\/([\w.]+)/i.exec(ua) && /Version/i.test(ua)) {
            uaData.browser.name = 'Safari';
        }
    }
    if (uaData.browser.name && !uaData.browser.version) {
        if (match = /Version\/([\w.]+)/i.exec(ua)) {
            uaData.browser.version =  {
                original: match[1]
            };
        }
    }

    // if (uaData.os.name === 'Windows' && uaData.os.version) {
    //  // Windows 8.1
    //  if (uaData.os.version.alias === 'NT 6.3') {
    //      uaData.os.version.alias = '8.1';
    //  }
    // }
    // handle os
    if (uaData.os.name === 'Windows' || /Windows/i.test(ua)) {
        uaData.os.name = 'Windows';
        if (/NT 6.3/i.test(ua)) {
            uaData.os.version = {
                alias: '8.1',
                original: '8.1'
            };
        }
        else if (/NT 6.4/i.test(ua) || /NT 10.0/i.test(ua)) {
            uaData.os.version = {
                alias: '10',
                original: '10'
            };
        }
    }
    else if (uaData.os.name === 'Mac OS X') {
        uaData.os.name = 'Mac OS X';
        if (match = /Mac OS X[\s\_\-\/](\d+[\.\-\_]\d+[\.\-\_]?\d*)/i.exec(ua)) {
            uaData.os.version = {
                alias: match[1].replace(/_/g, '.'),
                original: match[1].replace(/_/g, '.')
            };
        }
        else {
            uaData.os.version = {
                alias: '',
                original: ''
            };
        }
    }
    else if (/Android/i.test(uaData.os.name)) {
        if (match = ua.match(/Android[\s\_\-\/i686]?[\s\_\-\/](\d+[\.\-\_]\d+[\.\-\_]?\d*)/i)) {
            uaData.os.version = {
                alias: match[1],
                original: match[1]
            };
        }
    }
    return uaData;
};
