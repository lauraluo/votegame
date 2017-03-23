var CryptographerManager = function () {

    var that = this, // Public methods
        mgr = {}; // Privat methods

    /** 
     * 取得加解密規則
     * @returns {binary[]} 加解密規則
     */
    mgr['CUSTOM_HASH_VALUE'] = function () {
        return [7, -1, -4, 9, 8, 1, 3, 2, -6, 5, -4, -2, 1, 1, 9, -1];
    };

    /** 
     * 取得自訂加密或解密結果
     * @param {bool} isEncrypt true:加密 / false:解密
     * @param {binary[]} source 需加解密二位元文字
     * @returns {binary[]} 加解密處理後二位元文字
     */
    mgr['getCustomHash'] = function (isEncrypt, source) {
        var count = 0,
            customHash = mgr.CUSTOM_HASH_VALUE(),
            customHashLength = customHash.length,
            size = source.length,
            result = [];

        for (var i = 0; i < size; i++) {
            var sourceChar = parseInt(source[i], 2);
            result[i] = sourceChar + (isEncrypt ? customHash[count] : -customHash[count]);
            result[i] = result[i].toString(2);

            count++;
            count = count % customHashLength;
        }
        return result;
    }

    /** 
     * 加密字串
     * @param {string} source 欲加密的字串
     * @returns {string} 加密後的字串
     */
    that.encrypt = function (source) {
        var toEncryptSource = utilityJS.stringToBinaryArray(source);
        toEncryptSource = mgr.getCustomHash(true, toEncryptSource);
        var result = utilityJS.binaryArrayToString(toEncryptSource);

        result = result.replace(/\./g, "．");
        result = result.replace(/\#/g, "＃");
        result = result.replace(/\$/g, "＄");
        result = result.replace(/\[/g, "〔");
        result = result.replace(/\]/g, "〕");
        result = result.replace(/\//g, "／");


        return encodeURI(result);
    };

    /** 
     * 解密字串
     * @param {string} source 欲解密字串
     * @returns {string} 解密後的字串
     */
    that.decrypt = function (source) {
        source = decodeURI(source)

        source = source.replace(/\．/g, ".");
        source = source.replace(/\＃/g, "#");
        source = source.replace(/\＄/g, "$");
        source = source.replace(/\〔/g, "[");
        source = source.replace(/\〕/g, "]");
        source = source.replace(/\／/g, "/");


        var toDecryptSource = utilityJS.stringToBinaryArray(source);
        toDecryptSource = mgr.getCustomHash(false, toDecryptSource);
        var result = utilityJS.binaryArrayToString(toDecryptSource);


        return result;
    };


};

cryptographer = new CryptographerManager();

//投票統計名單，參與投票人會重複
var getNowFormatString = function () {
    return (new Date).format('YYYY-MM-DD');
}

$.getJSON("../datas/0322.json", function (datas) {
    var JsonObject = datas;

    function getGamersStates() {
        Firebase_config.database().ref().once('value', function (snapshot) {
            var gamers = snapshot.child('gamers').val();
            var voteResult = JsonObject.statistics;
            var convertString = '選手編號,選手姓名,投票者手機,投票日期';
            $.each(voteResult, function (gamerKey, votersOfGamer) {
                var gamersName = !!gamers[gamerKey] ? gamers[gamerKey].name : '被刪除的選手';
                var votersOfGamerKeys = Object.keys(votersOfGamer);
                var votersOfGamerSize = votersOfGamerKeys.length;
                for (var i = 0; i < votersOfGamerSize; i++) {
                    var row = gamerKey + ',' + gamersName; //補齊 第一欄跟第二欄 選手編號跟選手姓名
                    var voter = votersOfGamer[votersOfGamerKeys[i]];
                    var voterKeys = Object.keys(voter);
                    var voterSize = voterKeys.length;
                    for (var j = 0; j < voterSize; j++) {
                        var data = voter[voterKeys[j]];
                        var dataKeyOfVoter = Object.keys(voter)[j];
                        if (dataKeyOfVoter == "memberkey" || dataKeyOfVoter == "timestamp") {
                            if (dataKeyOfVoter == "memberkey") {
                                data = cryptographer.decrypt(data);
                            }
                            row += ',' + data;
                        }
                    }
                    convertString += escape('\r\n') + row;
                    // convertString += '\r\n' + row;
                }
            });

            $('#csv').text(convertString);
            $("#download").attr('download', '投票結果統計' + getNowFormatString() + '.csv');
            $("#download").attr('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + convertString);
            $("#download").show();
        });
    }

    function getMembers() {
        var voters = JsonObject.voters;
        var votersKeys = Object.keys(voters);
        var votersSize = votersKeys.length;
        var convertString = '電話,姓名,最後一次投票日期';
        for (var i = 0; i < votersSize; i++) {
            var voter = voters[votersKeys[i]];
            var voterKeys = Object.keys(voter);
            var voterSize = voterKeys.length;
            var row = "";

            if (voterSize == 2) {
                row = cryptographer.decrypt(votersKeys[i]);
            }

            for (var j = 0; j < voterSize; j++) {
                var data = voter[voterKeys[j]];
                var dataKeyOfVoter = Object.keys(voter)[j];

                if (dataKeyOfVoter == "name" || dataKeyOfVoter == "timestamp") {
                    // if(dataKeyOfVoter == "name"){
                    //     data = data;
                    // }
                    row += ',' + data;
                }
            }
            if (voterSize == 2) {
                convertString += escape('\r\n') + row;
            }
        }

        $('#csv2').text(convertString);
        $("#download2").attr('download', '會員名單' + getNowFormatString() + '.csv');
        $("#download2").attr('href', 'data:text/csv;charset=utf-8,%EF%BB%BF' + convertString);
        $("#download2").show();
    }
    getGamersStates();
    getMembers();
});