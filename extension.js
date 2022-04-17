const path = require('path');
const hx = require("hbuilderx");

let CatCustomEditorProvider = require('./src/main.js');

let utils = require('./src/lib/utils.js');
let common = require('./src/lib/common.js');

let hxVersion = hx.env.appVersion;
hxVersion = hxVersion.replace('-alpha', '').replace(/.\d{8}/, '');


function activate(context) {

    // HBuilderX 2.9.2+以上版本才支持CustomEditor
    let cmp_2 = common.cmp_hx_version(hxVersion, '2.9.2');
    if (cmp_2 <= 0) {
        let provider = new CatCustomEditorProvider({});
        hx.window.registerCustomEditorProvider("自定义主题辅助工具", provider);
    };

    try {
        // 解决某些hx版本上，registerUriHandler拼写错误的Bug
        let cmp = common.cmp_hx_version(hxVersion, '2.8.12');
        if (cmp > 0) {
            hx.window.registerUriHanlder({
                handleUri: function(uri) {
                    let params = uri.query;
                    let themeFileUrl = params.slice(5);
                    utils.themeDownload(themeFileUrl);
                }
            }, context);
        } else {
            hx.window.registerUriHandler({
                handleUri: function(uri) {
                    let params = uri.query;
                    let themeFileUrl = params.slice(5);
                    utils.themeDownload(themeFileUrl);
                }
            }, context);
        };
    } catch (e) {
        let outputChannel = hx.window.createOutputChannel('主题');
        outputChannel.show();
        outputChannel.appendLine(e);
    };

    // 主题设置
    let ThemeSupport = hx.commands.registerCommand('ThemeSupport', (param) => {
        if (cmp_2 > 0) {
            hx.window.showErrorMessage("自定义主题工具：目前仅支持2.9.3+版本，请升级HBuilderX。", ["我知道了"]);
        } else {
            const cscratFile = path.join(__dirname, 'src', 'cscrat', '自定义主题辅助工具');
            hx.workspace.openTextDocument(cscratFile);
        };
    });
    context.subscriptions.push(ThemeSupport);

    // 主题导出/分享
    let ThemeExport = hx.commands.registerCommand('ThemeExport', () => {
        utils.goShare();
    });
    context.subscriptions.push(ThemeExport);

    // 主题重置
    let ThemeResetCurrent = hx.commands.registerCommand('ThemeResetCurrent', () => {
        utils.resetCurrentTheme();
    });
    context.subscriptions.push(ThemeResetCurrent);

    // 主题重置全部
    let ThemeResetAll = hx.commands.registerCommand('ThemeResetAll', () => {
        utils.resetAllTheme();
    });
    context.subscriptions.push(ThemeResetAll);

    // vscode light+
    let ThemeSetVscodeLight = hx.commands.registerCommand('ThemeSetVscodeLight', () => {
        utils.setBuiltInTheme('vscode Light+');
    });
    context.subscriptions.push(ThemeSetVscodeLight);

    // 浏览更多主题
    let ThemeBrowse = hx.commands.registerCommand('ThemeBrowse', () => {
        hx.env.openExternal('https://static-0c1fa337-7340-4755-9bec-f766d7d31833.bspapp.com/');
    });
    context.subscriptions.push(ThemeBrowse);
}

//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}

module.exports = {
    activate,
    deactivate
}
