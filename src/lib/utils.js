const os = require('os');
const process = require('process');

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const JSONC = require('json-comments');

const hx = require('hbuilderx');

const common = require('./common.js');

// hbuilderx version
let hxVersion = hx.env.appVersion;
hxVersion = hxVersion.replace('-alpha', '').replace(/.\d{8}/, '');

// 比较版本号
const cmpVersionResult = common.cmp_hx_version(hxVersion, '2.9.12');

const env = process.env;
const osName = os.platform();

const BasicThemeData = {
    "Default": "绿柔",
    "Monokai": "酷黑",
    "Atom One Dark": "雅蓝"
};

/**
 * @description 创建控制台
 */
function createOutputChannel(msg) {
    let channel_name = "主题";
    let outputChannel = hx.window.createOutputChannel(channel_name);
    outputChannel.show();
    outputChannel.appendLine(msg);
};

/**
 * @description 设置自定义编辑器的颜色，背景颜色、输入框颜色、字体颜色、线条颜色
 */
function getThemeColor(area) {
    let config = hx.workspace.getConfiguration();
    let colorScheme = config.get('editor.colorScheme');
    let colorCustomizations = config.get('workbench.colorCustomizations');

    if (colorScheme == undefined) {
        colorScheme = 'Default';
    };

    // 背景颜色、输入框颜色、字体颜色、线条颜色
    let background, liHoverBackground, inputColor, inputBgColor, inputLineColor, fontColor, lineColor, menuBackground, scrollbarColor;

    let custom = {};
    try{
        custom = colorCustomizations[`[${colorScheme}]`];
    }catch(e){
        custom = {}
    };

    let viewBackgroundOptionName = area == 'siderBar' ? 'sideBar.background' : 'editor.background';
    let viewFontOptionName = area == 'siderBar' ? 'list.foreground' : undefined;
    let viewLiHoverBgOptionName = area == 'siderBar' ? 'list.hoverBackground' : 'list.hoverBackground';

    if (colorScheme == 'Monokai') {
        if (custom != undefined && custom[viewBackgroundOptionName] && viewBackgroundOptionName in custom) {
            background = custom[viewBackgroundOptionName];
            menuBackground = custom[viewBackgroundOptionName];
        } else {
            background = 'rgb(39,40,34)';
            menuBackground = 'rgb(83,83,83)';
        };
        if (custom != undefined && custom[viewFontOptionName] && viewFontOptionName in custom) {
            fontColor = custom[viewFontOptionName];
        } else {
            fontColor = 'rgb(179,182,166)';
        };
        inputColor = 'rgb(255,254,250)';
        inputBgColor = '#2E2E2E';
        inputLineColor = 'rgb(81,140,255)';
        lineColor = 'rgb(23,23,23)';
        scrollbarColor = '#6F6F6F';
    } else if (colorScheme == 'Atom One Dark') {
        if (custom != undefined && custom[viewBackgroundOptionName] && viewBackgroundOptionName in custom) {
            background = custom[viewBackgroundOptionName];
            menuBackground = custom[viewBackgroundOptionName];
        } else {
            background = 'rgb(40,44,53)';
            menuBackground = 'rgb(50,56,66)';
        };
        if (custom != undefined && custom[viewFontOptionName] && viewFontOptionName in custom) {
            fontColor = custom[viewFontOptionName];
        } else {
            fontColor = 'rgb(171,178,191)';
        };
        inputColor = 'rgb(255,254,250)';
        inputBgColor = '#2E2E2E';
        inputLineColor = 'rgb(81,140,255)';
        lineColor = 'rgb(33,37,43)';
        scrollbarColor = '#6F6F6F';
    } else {
        if (custom != undefined && custom[viewBackgroundOptionName] && viewBackgroundOptionName in custom) {
            background = custom[viewBackgroundOptionName];
            menuBackground = custom[viewBackgroundOptionName];
        } else {
            background = 'rgb(255,250,232)';
            menuBackground = 'rgb(255,252,243)';
        };
        if (custom != undefined && custom[viewFontOptionName] && viewFontOptionName in custom) {
            fontColor = custom[viewFontOptionName];
        } else {
            fontColor = '#243237';
        };
        inputBgColor = 'rgb(255,254,250)';
        inputColor = 'rgb(255,252,243)';
        inputLineColor = 'rgb(65,168,99)';
        lineColor = 'rgb(225,212,178)';
        scrollbarColor = 'rgb(207,181,106)';
    };

    return {
        background,
        menuBackground,
        inputColor,
        inputLineColor,
        inputBgColor,
        fontColor,
        lineColor,
        scrollbarColor
    };
};


/**
 * @description 对话框
 *     - 插件API: hx.window.showMessageBox, 本身存在很大问题，请谨慎使用
 *     - 已屏蔽esc事件，不支持esc关闭弹窗；因此弹窗上的x按钮，也无法点击。
 *     - 按钮组中必须提供`关闭`操作。且关闭按钮需要位于数组最后。
 * @param {String} title
 * @param {String} text
 * @param {String} buttons 按钮，必须大于1个
 */
function hxShowMessageBox(title, text, buttons = ['关闭']) {
    return new Promise((resolve, reject) => {
        try {
            let escape = -10;
            if ( buttons.length > 1  && (buttons.includes('关闭') || buttons.includes('取消')) ) {
                if (osName == 'darwin') {
                    buttons = buttons.reverse();
                };
            };
            if (cmpVersionResult <= 0) {
                hx.window.showMessageBox({
                    type: 'info',
                    title: title,
                    text: text,
                    buttons: buttons,
                    defaultButton: 0,
                    escapeButton: escape
                }).then(button => {
                    resolve(button);
                })
            } else {
                hx.window.showInformationMessage(text, buttons).then((result) => {
                    resolve(result);
                });
            };
        } catch (e) {
            hx.window.showInformationMessage(text, buttons).then((result) => {
                resolve(result);
            });
        }
    });
};


/**
 * @description settings.json文件读写操作
 */
class SettingsFile {
    constructor() {
        this.defaultValue = {
            "[Default]": {},
            "[Monokai]": {},
            "[Atom One Dark]": {}
        }
        this.settingsFile = path.join(hx.env.appData, 'user', 'settings.json')
    };

    read() {
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
    write(FileContent, message) {
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
};


/**
 * @description 通过菜单【重置】触发
 */
async function resetCurrentTheme() {
    let config = hx.workspace.getConfiguration();

    let colorCustomizations = config.get('workbench.colorCustomizations');
    let editorCoderCustomizations = config.get('editor.tokenColorCustomizations');

    if (colorCustomizations == undefined && editorCoderCustomizations == undefined) {
        hxShowMessageBox('主题重置', '没有设置过自定义主题，操作终止。', ['我知道了']);
        return;
    };
    if (JSON.stringify(colorCustomizations) == '{}' && JSON.stringify(editorCoderCustomizations) == '{}') {
        hxShowMessageBox('主题重置', '没有设置过自定义主题，操作终止。', ['我知道了']);
        return;
    };

    // 获取当前主题
    let theme = config.get('editor.colorScheme');
    if (theme == undefined && !theme) {
        theme = 'Default'
    };
    theme = `[${theme}]`

    let f = new SettingsFile();
    let fileContent = f.read();

    if (fileContent == false) {return;};

    hxShowMessageBox('主题重置', '重置，会导致自定义的主题数据丢失，且无法找回。', ['确定重置', '关闭']).then( (result) => {
        if (result == '确定重置') {
            fileContent['workbench.colorCustomizations'][theme] = {};
            fileContent['editor.tokenColorCustomizations'][theme] = {};
            delete fileContent['theme-custom.name'];
            f.write(fileContent, '重置当前主题');
        };
    });
};


/**
 * @description 通过菜单【全部重置】触发, 重置绿柔、酷黑、雅蓝主题所有自定义数据
 */
function resetAllTheme() {
    let config = hx.workspace.getConfiguration();

    let colorCustomizations = config.get('workbench.colorCustomizations');
    let editorCoderCustomizations = config.get('editor.tokenColorCustomizations');

    if (colorCustomizations == undefined && editorCoderCustomizations == undefined) {
        hxShowMessageBox('主题重置', '没有设置过自定义主题，操作终止。', ['我知道了']);
        return;
    };
    if (JSON.stringify(colorCustomizations) == '{}' && JSON.stringify(editorCoderCustomizations) == '{}') {
        hxShowMessageBox('主题重置', '没有设置过自定义主题，操作终止。', ['我知道了']);
        return;
    };

    let f = new SettingsFile();
    let fileContent = f.read();

    if (fileContent == false) {return;};

    hxShowMessageBox('主题重置', '全部重置，会导致自定义的所有主题数据丢失，且无法找回。', ['确定重置', '关闭']).then( (result) => {
        if (result == '确定重置') {
            delete fileContent['workbench.colorCustomizations'];
            delete fileContent['editor.tokenColorCustomizations'];
            delete fileContent['theme-custom.name'];
            f.write(fileContent, '重置所有主题');
        };
    });
};


/**
 * @description 分享
 */
function goShare() {

    const config = hx.workspace.getConfiguration();
    let colorScheme = config.get('editor.colorScheme');
    let windowsData = config.get('workbench.colorCustomizations');
    let codeData = config.get('editor.tokenColorCustomizations');

    if (windowsData == undefined && codeData == undefined) {
        hx.window.showErrorMessage('导出中止。原因：未找到自定义主题数据。', ['我知道了']);
        return;
    };

    let content = {
        "workbench.colorCustomizations": windowsData,
        "editor.tokenColorCustomizations": codeData
    };

    // 获取当前日期
    let day = new Date();
    day.setTime(day.getTime());
    let current_date = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();

    if (colorScheme && colorScheme != undefined) {
        content = Object.assign({
            'theme-custom.author': '',
            'theme-custom.name': '',
            'theme-custom.version': '',
            'theme-custom.date': current_date,
            'editor.colorScheme': colorScheme
        }, content)
    };

    let fileContent = JSON.stringify(content, "", "\t");

    // 文件地址（默认写到桌面）
    let target = '';
    if (osName == 'darwin') {
        target = path.join(env.HOME, 'Desktop', 'hx_theme.json');
    } else {
        target = path.join(env.HOMEDRIVE, env.HOMEPATH, 'Desktop', 'hx_theme.json');
    };

    fs.writeFile(target, fileContent, { encoding:'utf-8' }, function(res, err) {
        if (err) {
            createOutputChannel(`自定义主题配置文件，导出文件失败。\n ${err} \n\n`);
        } else {
            createOutputChannel(`自定义主题配置文件，已导出到本地桌面。地址: ${target} \n`);
            createOutputChannel('给插件作者点赞, 您的鼓励是作者前行的动力。或在插件评论区分享您定义的主题。');
            createOutputChannel('分享到主题乐园：https://static-0c1fa337-7340-4755-9bec-f766d7d31833.bspapp.com/index.html \n')
            createOutputChannel('分享您的主题到插件市场：https://ext.dcloud.net.cn/plugin?name=hbuilderx-theme-support#rating')
            createOutputChannel('或分享到DCloud HBuilderX论坛。论坛地址：https://ask.dcloud.net.cn/');
        }
    });
};


/**
 * @description theme install - 安装内置主题、或安装用户从浏览器导入的主题
 * @param {String} themeTemplatesName - 自定义主题名称
 * @param {Obejct} themeTemplates - 自定义主题模板（json格式）
 */
async function installTheme(themeTemplatesName, themeTemplates) {

    try{
        let check =  common.isJSON(JSON.stringify(themeTemplates));
        if (check != true || themeTemplates == undefined || themeTemplates == false) {
            return hx.window.showErrorMessage('不是有效的json内容，中止写入。', ['我知道了']);
        };
    }catch(e){
        hx.window.showErrorMessage('不是有效的json内容，中止写入。', ['我知道了']);
        return;
    };

    const config = hx.workspace.getConfiguration();
    let OldHxColorScheme = config.get('editor.colorScheme');
    if (OldHxColorScheme == undefined) {
        OldHxColorScheme = 'Default';
    };

    // 自定义主题：基本主题
    let templateHxColorScheme = themeTemplates['editor.colorScheme'];
    let themeId = `[${templateHxColorScheme}]`;

    // 主题基本色有效性检查
    if (!['Default', 'Monokai', 'Atom One Dark'].includes(templateHxColorScheme)) {
        hxShowMessageBox("主题模板检查", `${themeTemplatesName}模板中，editor.colorScheme字段无效。`);
        return;
    };

    // 自定义主题名称（暂时无用，用于识别）
    let themeCustomName = themeTemplates['theme-custom.name'];

    // 自定义主题：窗体主题数据
    let WindowsThemeData = themeTemplates['workbench.colorCustomizations'][themeId];
    if (!common.isJSON(JSON.stringify(WindowsThemeData)) || JSON.stringify(WindowsThemeData) == '{}') {
        hxShowMessageBox("主题模板检查", `${themeTemplatesName}模板中，workbench.colorCustomizations字段无效。`);
        return;
    };

    // 自定义主题：编辑器代码颜色主题数据
    let editorCodeThemeData;
    if (themeTemplates['editor.tokenColorCustomizations']) {
        editorCodeThemeData = themeTemplates['editor.tokenColorCustomizations'][themeId];
        if (!common.isJSON(JSON.stringify(editorCodeThemeData)) || JSON.stringify(editorCodeThemeData) == '{}') {
            hxShowMessageBox("主题模板检查", `${themeTemplatesName}模板中，editor.tokenColorCustomizations字段无效。`);
            return;
        };
    };

    let f = new SettingsFile();
    // 读取用户本地的settings文件
    let fileContent = f.read();
    let content = Object.assign(fileContent);

    // hx主题基本色
    content['editor.colorScheme'] = templateHxColorScheme;

    // message
    let confirmationMessage;

    // 设置: 窗体主题数据
    if (content['workbench.colorCustomizations'] == undefined || JSON.stringify(content['workbench.colorCustomizations']) == '{}') {
        content['workbench.colorCustomizations'] = {};
    } else {
        confirmationMessage = "workbench.colorCustomizations";
    };
    content['workbench.colorCustomizations'][themeId] = WindowsThemeData;

    // 设置: 编辑器代码颜色数据
    if (editorCodeThemeData != undefined && editorCodeThemeData) {
        if (content['editor.tokenColorCustomizations'] == undefined || JSON.stringify(content['editor.tokenColorCustomizations']) == '{}') {
            content['editor.tokenColorCustomizations'] = {};
        } else {
            confirmationMessage = confirmationMessage + "<br/>editor.tokenColorCustomizations";
        };
        content['editor.tokenColorCustomizations'][themeId] = editorCodeThemeData;
    };

    // 第三方的主题名称
    if (themeCustomName != '' && themeCustomName != undefined) {
        content['theme-custom.name'] = themeCustomName;
    };

    if (confirmationMessage) {
        let Prompt = `安装主题，HBuilderX settings.json文件中的以下字段将会被覆盖。<br/><br/>${confirmationMessage}`
        let btn = await hxShowMessageBox(`主题安装`, Prompt, ["确认", "关闭"]).then( btn => { return btn; });
        if (btn != '确认') return;
    };
    f.write(content, themeTemplatesName);

    // 直接修改配置文件editor.colorScheme无法生效。
    if (OldHxColorScheme != templateHxColorScheme) {
        let basic = BasicThemeData[templateHxColorScheme];
        hxShowMessageBox(`${themeCustomName} 安装成功`, `点击菜单【工具 - 主题 - ${basic}】, 进行基本色设置后生效。`, ["我知道了"]);
    };
};

/**
 * @description 内置主题
 */
function setBuiltInTheme(theme) {
    switch (theme){
        case 'vscode Light+':
            let vscodeLightData = require('../built-in-theme/vscode-light.json');
            installTheme(theme, vscodeLightData);
            break;
        default:
            break;
    }
};


/**
 * @description download theme
 */
function themeDownload(url) {
    try{
        let theme_url = encodeURI(url);

        let http = require('http');
        http.get(theme_url, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                if (common.isJSON(data)) {
                    let info = JSON.parse(data);
                    let themeData = {...info};
                    let themeName = themeData['editor.colorScheme'];
                    installTheme(themeName, themeData);
                } else {
                    hx.window.showErrorMessage('配置文件无效json，主题模板安装失败。', ['我知道了']);
                    return;
                };
            });
            res.on("error", (e) => {
                hx.window.showErrorMessage('下载主题模板失败。', ['我知道了']);
                return;
            });
        });
    }catch(e){
        console.error('\ntheme Download and install: ', e);
        hx.window.showErrorMessage('主题模板安装失败。', ['我知道了']);
        return false;
    };
};

module.exports = {
    goShare,
    resetCurrentTheme,
    resetAllTheme,
    setBuiltInTheme,
    themeDownload,
    getThemeColor
}
