/**
 * @description 比较版本号
 * @param {Object} a
 * @param {Object} b
 */
function cmp_hx_version(a, b) {
    let i = 0;
    const arr1 = a.split('.');
    const arr2 = b.split('.');
    while (true) {
        const s1 = arr1[i];
        const s2 = arr2[i++];
        if (s1 === undefined || s2 === undefined) {
            return arr2.length - arr1.length;
        }
        if (s1 === s2) continue;
        return s2 - s1;
    }
};

/**
 * @description 判断是否是json
 * @param {Object} str
 */
function isJSON(str) {
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
};

/**
 * @description 判断是否是object
 * @param {Object} object
 */
function isObj(object){
    return object && typeof (object) == 'object' && Object.prototype.toString.call(object).toLowerCase() == "[object object]";
};

module.exports = {
    cmp_hx_version,
    isJSON,
    isObj
}
