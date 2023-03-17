const fs = require('fs');
const path = require('path');
const hx = require('hbuilderx');

let utils = require('./lib/utils.js');

const themeDir = path.join(__dirname, "built-in-theme")

// 获取内置的主题文件
function getBuiltInThemesFiles(dir, ext) {
    const files = fs.readdirSync(dir);
    return files.filter(file => fs.statSync(path.join(dir, file)).isFile() && path.extname(file) === ext);
}

/**
 * @description 浏览更多主题
 */
async function selecteMoreTheme() {
    const themeFileList = getBuiltInThemesFiles(themeDir, ".json");
    const PickData = themeFileList.map(name => ({ label: name }));

    PickData.push({"label": "在线浏览更多主题"})
    PickData.push({"label": "关闭"})

    const result = await hx.window.showQuickPick(PickData, { placeHolder: "选择主题文件" });
    if (!result) return;

    const selected = result.label;
    if (selected == "关闭") return;
    if (selected == "在线浏览更多主题") {
        hx.env.openExternal('https://hbuilderx-theme.github.io/')
        return;
    };

    try{
        let themeFileName = selected;
        let themeData = require(`./built-in-theme/${themeFileName}`);
        await utils.installTheme(themeFileName, themeData);
    } catch(e){
        console.error("[主题设置]设置主题异常......")
    };
}

module.exports = selecteMoreTheme;
