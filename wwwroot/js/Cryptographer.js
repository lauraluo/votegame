var cryptographer;

(function() {

    var CryptographerManager = function() {

        var that = this, // Public methods
            mgr = {}; // Privat methods

        /** 
         * 取得加解密規則
         * @returns {binary[]} 加解密規則
         */
        mgr['CUSTOM_HASH_VALUE'] = function() {
            return [7, -1, -4, 9, 8, 1, 3, 2, -6, 5, -4, -2, 1, 1, 9, -1];
        };

        /** 
         * 取得自訂加密或解密結果
         * @param {bool} isEncrypt true:加密 / false:解密
         * @param {binary[]} source 需加解密二位元文字
         * @returns {binary[]} 加解密處理後二位元文字
         */
        mgr['getCustomHash'] = function(isEncrypt, source) {
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
        that.encrypt = function(source) {
            var toEncryptSource = utilityJS.stringToBinaryArray(source);
            toEncryptSource = mgr.getCustomHash(true, toEncryptSource);
            var result = utilityJS.binaryArrayToString(toEncryptSource);

            return result;
        };

        /** 
         * 解密字串
         * @param {string} source 欲解密字串
         * @returns {string} 解密後的字串
         */
        that.decrypt = function(source) {
            var toDecryptSource = utilityJS.stringToBinaryArray(source);
            toDecryptSource = mgr.getCustomHash(false, toDecryptSource);
            var result = utilityJS.binaryArrayToString(toDecryptSource);

            return result;
        };

    };

    cryptographer = new CryptographerManager();

})();