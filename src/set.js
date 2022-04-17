const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const JSONC = require('json-comments');
const hx = require('hbuilderx');

const { colors, codeRules } = require('./data/colors.js');
const common = require('./lib/common.js');
const _ = require('lodash');

const settingsFile = path.join(hx.env.appData, 'user', 'settings.json');

/**
 * @description 仅供视图内使用
 */
class HxConfiguration {
    constructor() {
        this.defaultValue = {
            "[Default]": {},
            "[Monokai]": {},
            "[Atom One Dark]": {}
        };
        this.defaultEditorCodeValue = {
            "[Default]": {"rules": []},
            "[Monokai]": {"rules": []},
            "[Atom One Dark]": {"rules": []}
        };
        this.settingsFile = settingsFile;
        this.themeHistory = false;
        this.colors = colors;
    }

    init() {
        let currentThemeID = this.get('editor.colorScheme');
        let theme = `[${currentThemeID}]`
        let exist = this.get('workbench.colorCustomizations');
        if (exist == undefined) {
            return this.colors;
        } else {
            this.themeHistory = true;
            let local = this.parseCustomColor(theme);
            if (local == false) {
                return this.colors;
            } else {
                return local;
            };
        };
    };

    changeInitThemeOptions(currentThemeCustomData) {
        let init = this.colors.map( item => {
            return JSON.parse(JSON.stringify(item));
        });
        let options = Object.keys(currentThemeCustomData);
        let n = 0;
        let total = options.length;
        for (let op of options) {
            for (let i1 in init) {
                let tmp = init[i1]['colors'];
                for (let i2 in tmp) {
                    if (tmp[i2]['option_id'] == op) {
                        init[i1]['colors'][i2]['option_value'] = currentThemeCustomData[op];
                        n = n + 1;
                        break;
                    };
                };
                if (n == total) {break};
            };
        };
        return init;
    };

    // 解析本地已设置过的颜色数据
    parseCustomColor(theme) {
        let fileContent = this.readSettingsFile();
        if (fileContent == false) {return;};

        let ColorCustomizations = fileContent['workbench.colorCustomizations'];
        let currentThemeCustomData = ColorCustomizations[theme];
        if (JSON.stringify(currentThemeCustomData) != '{}' && currentThemeCustomData != undefined ) {
            let keys = Object.keys(currentThemeCustomData);
            if (keys.length != 0) {
                return this.changeInitThemeOptions(currentThemeCustomData)
            } else {
                return false;
            };
        } else {
            return this.colors;
        };
    };

    switchTheme(themeId) {
        let currentThemeID = this.get('editor.colorScheme');
        if (currentThemeID != themeId) {
            // this.updateValue('editor.colorScheme', themeId, '主题切换');
            hx.window.showInformationMessage('请点击菜单【工具】【主题】，切换相应主题。切换后，请重启HBuilderX编辑器。', ['我知道了'])
        };
    };

    // 读json文件
    readSettingsFile() {
        let content = fs.readFileSync(this.settingsFile, 'utf8');
        if (content == '') {
            return {};
        };
        try{
            let data = JSONC.parse(content);
            return data;
        }catch(e){
            hx.window.showErrorMessage('读取配置文件异常。 请点击菜单【设置 - 源码试图】，查看文件是否是有效json文件。');
            return false
        }
    };

    // 写入json文件
    writeSettingsFile(FileContent, message) {
        try{
            let check =  common.isJSON(JSON.stringify(FileContent));
            if (typeof(FileContent) != 'object' || check != true || FileContent == undefined || FileContent == false) {
                return hx.window.showErrorMessage('写入内容检查不通过，中止写入。', ['我知道了']);
            };
        }catch(e){
            hx.window.showErrorMessage('写入内容检查不通过，中止写入。', ['我知道了']);
            return;
        };

        fse.writeJson(this.settingsFile, FileContent, {spaces: '\t'})
            .then(() => {
                hx.window.setStatusBarMessage(`${message} 操作成功。`, 3000, 'info');
            })
            .catch(err => {
                hx.window.setStatusBarMessage(`${message} 操作失败。`, 3000, 'info');
            })
    };

    // 获取特定值
    get(key) {
        let config = hx.workspace.getConfiguration();
        return config.get(key);
    };

    updateValue(key, value, desc) {
        let config = hx.workspace.getConfiguration();
        config.update(key, value).then(() => {
            hx.window.setStatusBarMessage(`${desc} 设置成功。`, 3000, 'info');
        })
    };

    // 更新settings.json文件 -> HBuilderX窗体颜色
    updateSettingFileForHBuilderXWindows(currentTheme, key, value, desc) {
        // read settings.json
        let fileContent = this.readSettingsFile();
        if (fileContent == false) {return;};

        // get colorCustomizations
        let initColorCustomizations = this.get('workbench.colorCustomizations');
        if (!initColorCustomizations && initColorCustomizations == undefined) {
            initColorCustomizations = this.defaultValue;
        };

        let theme = `[${currentTheme}]`
        if (initColorCustomizations[theme] == undefined) {
            initColorCustomizations[theme] = {};
        };
        initColorCustomizations[theme][key] = value;

        fileContent["workbench.colorCustomizations"] = initColorCustomizations;
        this.writeSettingsFile(fileContent, desc);
    };

    // 更新settings.json文件 -> HBuilderX代码颜色，比如html标签\注释
    updateSettingFileForHBuilderXCode(currentTheme, key, value, desc) {
        // read settings.json,
        let fileContent = this.readSettingsFile();
        if (fileContent == false) {return;};

        // get editor.tokenColorCustomizations
        let initEditorCodeColors = this.get('editor.tokenColorCustomizations');
        if (!initEditorCodeColors && initEditorCodeColors == undefined) {
            initEditorCodeColors = this.defaultEditorCodeValue;
        };

        let theme = `[${currentTheme}]`;
        let themeCodeRules = initEditorCodeColors[theme];
        
        if (common.isObj(themeCodeRules)) {
            let tmpRules = themeCodeRules["rules"];
            themeCodeRules = Array.isArray(tmpRules) ? tmpRules : [];
        } else {
            themeCodeRules = [];
        };

        // todo 需要判断是否已设置，如已设置，则删除
        let rules = codeRules[0]["colors"];
        let scopes = rules.filter( data=> data["option_id"] == key );
        if (scopes.length == 0) {
            return hx.window.showErrorMessage("未找到相关颜色设置。", "我知道了");
        };

        let codeScope = scopes[0]["scope"];
        let insertData = {
            "scope": scopes[0]["scope"],
            "settings": {
                "foreground": value
            }
        };
        let isExist = _.findLastIndex(themeCodeRules, function(o) { return JSON.stringify(o.scope) == JSON.stringify(codeScope); });
        if (isExist != -1) {
            themeCodeRules[isExist] = insertData;
        } else {
            themeCodeRules.push(insertData);
        };

        if (initEditorCodeColors[theme] == undefined) {
            initEditorCodeColors[theme] = {"rules": themeCodeRules};
        } else {
            if (_.get(initEditorCodeColors, `[${theme}].rules`) == undefined) {
                initEditorCodeColors[theme] = {"rules": themeCodeRules};
            } else {
                initEditorCodeColors[theme]["rules"] = themeCodeRules;
            }
        };

        fileContent["editor.tokenColorCustomizations"] = initEditorCodeColors;
        this.writeSettingsFile(fileContent, desc);
    };

    // 更新settings.json文件 -> 【重置】HBuilderX代码颜色，比如html标签\注释
    resetSettingFileForHBuilderXCode(data) {
        let {currentThemeID,option_id,option_desc} = data;

        // read settings.json,
        let fileContent = this.readSettingsFile();
        if (fileContent == false) {return;};

        // get editor.tokenColorCustomizations
        let initEditorCodeColors = this.get('editor.tokenColorCustomizations');
        if (!initEditorCodeColors && initEditorCodeColors == undefined) {
            return hx.window.showErrorMessage("提醒：未设置过相关颜色，重置中止。", "我知道了");
        };

        let theme = `[${currentThemeID}]`;
        let themeCodeRules;
        try{
            themeCodeRules = initEditorCodeColors[theme]["rules"];
            if (!Array.isArray(themeCodeRules)) {throw 'not found'};
        }catch(e){
            return hx.window.showErrorMessage("提醒：未设置过相关颜色，重置中止。", "我知道了");
        };

        // todo 需要判断是否已设置，如已设置，则删除
        let rules = codeRules[0]["colors"];
        let scopes = rules.filter( data=> data["option_id"] == option_id );
        if (scopes.length == 0) {
            return hx.window.showErrorMessage("提醒：未找到相关颜色设置。", "我知道了");
        };

        let codeScope = scopes[0]["scope"];
        let isExist = _.findLastIndex(themeCodeRules, function(o) { return JSON.stringify(o.scope) == JSON.stringify(codeScope); });
        if (isExist != -1) {
            themeCodeRules.splice(isExist, 1);
        } else {
            return hx.window.showErrorMessage("提醒：未找到相关颜色设置。", "我知道了");
        };

        initEditorCodeColors[theme]["rules"] = themeCodeRules;
        fileContent["editor.tokenColorCustomizations"] = initEditorCodeColors;
        this.writeSettingsFile(fileContent, option_desc);
    };

    // 重置某个选项颜色
    resetSettingFileForHBuilderXWindows(data) {
        let {currentThemeID,option_id,option_desc} = data;
        let theme = `[${currentThemeID}]`

        // read settings.json, get colorCustomizations
        let fileContent = this.readSettingsFile();
        if (fileContent == false) {return;};

        let initColorCustomizations = fileContent['workbench.colorCustomizations']

        if (JSON.stringify(initColorCustomizations) != '{}' && initColorCustomizations != undefined) {
            delete initColorCustomizations[theme][option_id];

            fileContent["workbench.colorCustomizations"] = initColorCustomizations;
            this.writeSettingsFile(fileContent, option_desc + '重置');
        };
    };

    // 重置当前主题所有颜色
    resetAll(msg) {
        let {currentThemeID} = msg;
        let theme = `[${currentThemeID}]`

        let fileContent = this.readSettingsFile();
        if (fileContent == false) {return;};

        fileContent['workbench.colorCustomizations'][theme] = {};

        this.writeSettingsFile(fileContent, '重置当前主题所有颜色')
    };
};


module.exports = HxConfiguration;
