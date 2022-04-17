var hx = require('hbuilderx');

let utils = require('./lib/utils.js');

let getWebviewContent = require('./html.js');
let HxConfiguration = require('./set.js');

let CustomDocument = hx.CustomEditor.CustomDocument;
let CustomEditorProvider = hx.CustomEditor.CustomEditorProvider;
let CustomDocumentEditEvent = hx.CustomEditor.CustomDocumentEditEvent;

let cfg = new HxConfiguration();
let hxConfig = hx.workspace.getConfiguration();

let LastCustomEditorBackground;

class CatCustomDocument extends CustomDocument {
    constructor(uri) {
        super(uri)
    }
    dispose() {
        super.dispose();
    }
};

class CatCustomEditorProvider extends CustomEditorProvider {
    constructor(context) {
        super()
    }
    openCustomDocument(uri) {
        return Promise.resolve(new CatCustomDocument(uri));
    }
    resolveCustomEditor(document, webViewPanel) {
        var webview = webViewPanel.webView;
        webview.html = getWebviewContent();;

        webViewPanel.onDidDispose(function() {
            console.log("custom editor disposed");
        });
        let provider = this;
        webViewPanel.webView.onDidReceiveMessage(function(msg) {
            let action = msg.command;
            switch (action) {
                case 'CurrentThemeSetting':
                    let HXThemeOptions = cfg.init();
                    webview.postMessage({
                        "command": "CurrentThemeSetting",
                        "data": HXThemeOptions
                    });
                    break;
                case 'switchTheme':
                    cfg.switchTheme(msg.theme);
                    break;
                case 'setColor' || 'setOptionColor':
                    const {currentThemeID, option_id, option_color, option_desc} = msg.data;
                    let isColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(option_color);
                    if (!isColor) {
                        hx.window.showErrorMessage('颜色值无效，请填写有效的十六进制颜色。如: #FFFFFF。无效的颜色将会导致HBuilderX启动或渲染异常。', ['我知道了']);
                        return;
                    };
                    if (option_id.includes('code_')) {
                        cfg.updateSettingFileForHBuilderXCode(currentThemeID, option_id, option_color, option_desc);
                    } else {
                        cfg.updateSettingFileForHBuilderXWindows(currentThemeID, option_id, option_color, option_desc)
                    };
                    break;
                case 'resetOptionColor':
                    const option_id_2 = msg.data.option_id;
                    if (option_id_2.includes('code_')) {
                        cfg.resetSettingFileForHBuilderXCode(msg.data);
                    } else {
                        cfg.resetSettingFileForHBuilderXWindows(msg.data);
                    };
                    break;
                case 'resetAll':
                    cfg.resetAll(msg);
                    break;
                case 'refresh':
                    hx.commands.executeCommand('ThemeSupport');
                    break;
                case 'share':
                    utils.goShare();
                    break;
                case 'help':
                    hx.env.openExternal(
                        'https://ext.dcloud.net.cn/plugin?name=hbuilderx-theme-support#rating');
                    break;
                case 'tutorial':
                    hx.env.openExternal('https://ask.dcloud.net.cn/article/35776');
                    break;
                case 'showBoxMsg':
                    hx.window.showErrorMessage(msg.text, ['我知道了']);
                    break;
                default:
                    break;
            };
        });

        let configurationChangeDisplose = hx.workspace.onDidChangeConfiguration(function(event){
            if(event.affectsConfiguration("workbench.colorCustomizations")) {
                // 设置自定义编辑器颜色，使其跟hx主题保持一致
                // let ThemeColor = utils.getThemeColor();
                // let {background, fontColor} = ThemeColor;

                // if (LastCustomEditorBackground == background) return;
                // LastCustomEditorBackground = background;

                // webview.postMessage({
                //     "command": "CustomEditor",
                //     "data": ThemeColor
                // });
            };
            if(event.affectsConfiguration("editor.colorScheme")){
                let HXThemeOptions = cfg.init();
                webview.postMessage({
                    "command": "CurrentThemeSetting",
                    "data": HXThemeOptions
                });

                let currentThemeID = cfg.get("editor.colorScheme");
                webview.postMessage({
                    "command": "currentThemeID",
                    "data": currentThemeID
                });

                // 设置自定义编辑器颜色，使其跟hx主题保持一致
                let ThemeColor = utils.getThemeColor();
                webview.postMessage({
                    "command": "CustomEditor",
                    "data": ThemeColor
                });
            }
        });
    }
};


module.exports = CatCustomEditorProvider;
