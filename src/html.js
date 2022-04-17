const path = require('path');
const hx = require('hbuilderx');

const icon = require('./static/icon.js');
const utils = require('./lib/utils.js');

const vueFile = path.join(__dirname, 'static', 'vue.min.js');
const w3colorFile = path.join(__dirname, 'static', 'w3color.js');
const bootstrapCssFile = path.join(__dirname, 'static', 'bootstrap.min.css');
const supportCssFile = path.join(__dirname, 'static', 'support.css');

const colorMapFile = path.join(__dirname,'static', 'img' ,'colormap.gif')
const cscratFile = path.join(__dirname,'cscrat', '自定义主题辅助工具');

/**
 * @description 生成视图内容
 */
function getWebviewContent() {
    // svg icon
    let shareIcon = icon.shareIcon();
    let questionIcon = icon.questionIcon();
    let resetIcon = icon.resetIcon();
    let colorPickerActiveIcon = icon.colorPickerActiveIcon();
    let colorPickerNotActiveIcon = icon.colorPickerNotActiveIcon();
    let refreshIcon = icon.refreshIcon();

    // 获取当前主题
    let config = hx.workspace.getConfiguration();
    let currentThemeID = config.get('editor.colorScheme');
    if (currentThemeID == undefined) {
        currentThemeID = 'Default';
    };

    // 设置自定义编辑器颜色，使其跟hx主题保持一致
    let ThemeColor = utils.getThemeColor();
    let {background, fontColor, lineColor, inputLineColor, scrollbarColor} = ThemeColor;

    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <link rel="stylesheet" href="${bootstrapCssFile}">
            <script src="${vueFile}"></script>
            <script src="${w3colorFile}"></script>
            <style type="text/css">
                :root {
                  --background: ${background};
                  --fontColor: ${fontColor};
                  --lineColor: ${lineColor};
                  --inputLineColor: ${inputLineColor};
                  --scrollbarColor: ${scrollbarColor};
                }
            </style>
            <link rel="stylesheet" href="${supportCssFile}">
        </head>
        <body>
            <div id="app" v-cloak>
                <div class="fixed-top body-head">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col">
                                <div class="d-flex">
                                    <div class="flex-grow-1">
                                        <p class="theme-title">
                                            基于<span @click="showThemeList()" class="dropbtn">{{ currentThemeName }} - {{ currentThemeID }}</span>进行自定义
                                            <!--
                                            <div id="myDropdown" class="dropdown-content" :class="{show: isShowThemeList}" @mouseleave="isShowThemeList=false">
                                                <a id="Default" @click="switchTheme('Default', '绿柔');">绿柔</a>
                                                <a id="Monokai" @click="switchTheme('Monokai', '酷黑');">酷黑</a>
                                                <a id="Atom One Dark" @click="switchTheme('Atom One Dark', '雅蓝');">雅蓝</a>
                                            </div>
                                            -->
                                        </p>
                                    </div>
                                    <div title="当光标置于输入框时，是否显示颜色选择器窗口。默认显示">
                                        <span class="iconfont mx-1" v-if="colorPickerSetting" @click="colorPickerSetting = false">
                                            ${colorPickerActiveIcon}
                                        </span>
                                        <span class="iconfont mx-1" v-else @click="colorPickerSetting = true">
                                            ${colorPickerNotActiveIcon}
                                        </span>
                                    </div>
                                    <div title="刷新当前视图数据, 比如在外部更改了主题、自定义数据等">
                                        <span class="iconfont mx-1" @click="refresh();">${refreshIcon}</span>
                                    </div>
                                    <div title="重置当前主题所有颜色">
                                        <span class="iconfont mx-1" @click="resetAll();">${resetIcon}</span>
                                    </div>
                                    <div title="帮助">
                                        <span class="iconfont mx-1" @click="help();">${questionIcon}</span>
                                    </div>
                                    <div title="分享">
                                        <span class="iconfont mx-1" @click="share();">${shareIcon}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="theme">
                    <div class="container">
                        <div class="row">
                            <div class="col">
                                <input type="search"
                                    class="form-control outline-none search my-2 px-0"
                                    placeholder="输入关键字, 按下回车进行搜索..."
                                    v-model.trim="searchWord"
                                    @keyup.enter="goSearch();"/>
                            </div>
                        </div>
                    </div>
                    <div class="container mt-3" v-for="(item,idx) in hxColors" :key="idx">
                        <h5 :id="item.name" class="bd-title">{{ item.name }} </h5>
                        <div class="row mt-3">
                            <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3" v-for="(item2,ide2) in item.colors" :key="ide2">
                                <div class="form-group item-color">
                                    <label :for="item2.id">
                                        {{ item2.option_desc }}
                                        <span class="reset" title="重置此项" @click="resetOptionColor(item2);" @click="item2.option_value = ''"></span>
                                    </label>
                                    <div class="input-group" :id="item2.option_desc">
                                        <span class="color-fills" v-show="item2.option_value" :style="{ backgroundColor: item2.option_value}"></span>
                                        <input type="text" :id="(item2.option_id)"
                                            :title="item2.option_desc"
                                            class="form-control outline-none option-input"
                                            @focus="showColorPicker(item.id, item2);"
                                            v-model="item2.option_value"
                                            :placeholder="item2.option_id == selectInfo.option_id ? placeholder : ''"
                                            @keyup.enter="setOptionColor(item2);"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="help" class="fixed-bottom color-picker" v-if="isShowHelp">
                    <div class="d-flex">
                        <div class="flex-grow-1 m-3 help-title">
                            <h5 class="bd-title mb-3">帮助</h5>
                        </div>
                        <div>
                            <button type="button" class="close m-3" aria-label="Close" @click="isShowHelp = false">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                    <div class="container-fluid mb-3">
                        <div class="row">
                            <div class="col help">
                                <ul class="pl-0 mt-3">
                                    <li>1. 将焦点置于输入框，选择颜色，预览时，点击【预览】按钮。</li>
                                    <li>2. 仅支持十六进制颜色； 也支持在输入框中手动填写, 回车预览。</li>
                                    <li>3. HBuilderX官方主题自定义教程 <a class="link" @click="openTutorial();">教程</a></li>
                                    <li>4. 如果您使用满意，请给插件好评。<a class="link" @click="openWebHelp();">插件评价/寻求帮助</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="Picker" class="fixed-bottom color-picker" v-if="isShowPicker && colorPickerSetting">
                    <div class="d-flex">
                        <div class="flex-grow-1 m-3 help-title">
                            <h5 class="bd-title mb-3">{{ selectInfo.option_desc }}</h5>
                        </div>
                        <div>
                            <button type="button" class="close m-3" aria-label="Close" @click="leaveInput();">
                              <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                    <div class="container-fluid mb-3">
                        <div class="row justify-content-center">
                            <div class="col-12 col-sm-6 col-lg-4 text-center">
                                <img class="mt-5" src="${colorMapFile}" usemap="#colormap" alt="colormap">
                                <map id="colormap" name="colormap">
                                    <area shape="poly" coords="63,0,72,4,72,15,63,19,54,15,54,4" @click="clickColor(&quot;#003366&quot;,-200,54)"
                                     alt="#003366">
                                    <area shape="poly" coords="81,0,90,4,90,15,81,19,72,15,72,4" @click="clickColor(&quot;#336699&quot;,-200,72)"
                                     alt="#336699">
                                    <area shape="poly" coords="99,0,108,4,108,15,99,19,90,15,90,4" @click="clickColor(&quot;#3366CC&quot;,-200,90)"
                                     alt="#3366CC">
                                    <area shape="poly" coords="117,0,126,4,126,15,117,19,108,15,108,4" @click="clickColor(&quot;#003399&quot;,-200,108)"
                                     alt="#003399">
                                    <area shape="poly" coords="135,0,144,4,144,15,135,19,126,15,126,4" @click="clickColor(&quot;#000099&quot;,-200,126)"
                                     alt="#000099">
                                    <area shape="poly" coords="153,0,162,4,162,15,153,19,144,15,144,4" @click="clickColor(&quot;#0000CC&quot;,-200,144)"
                                     alt="#0000CC">
                                    <area shape="poly" coords="171,0,180,4,180,15,171,19,162,15,162,4" @click="clickColor(&quot;#000066&quot;,-200,162)"
                                     alt="#000066">
                                    <area shape="poly" coords="54,15,63,19,63,30,54,34,45,30,45,19" @click="clickColor(&quot;#006666&quot;,-185,45)"
                                     alt="#006666">
                                    <area shape="poly" coords="72,15,81,19,81,30,72,34,63,30,63,19" @click="clickColor(&quot;#006699&quot;,-185,63)"
                                     alt="#006699">
                                    <area shape="poly" coords="90,15,99,19,99,30,90,34,81,30,81,19" @click="clickColor(&quot;#0099CC&quot;,-185,81)"
                                     alt="#0099CC">
                                    <area shape="poly" coords="108,15,117,19,117,30,108,34,99,30,99,19" @click="clickColor(&quot;#0066CC&quot;,-185,99)"
                                     alt="#0066CC">
                                    <area shape="poly" coords="126,15,135,19,135,30,126,34,117,30,117,19" @click="clickColor(&quot;#0033CC&quot;,-185,117)"
                                     alt="#0033CC">
                                    <area shape="poly" coords="144,15,153,19,153,30,144,34,135,30,135,19" @click="clickColor(&quot;#0000FF&quot;,-185,135)"
                                     alt="#0000FF">
                                    <area shape="poly" coords="162,15,171,19,171,30,162,34,153,30,153,19" @click="clickColor(&quot;#3333FF&quot;,-185,153)"
                                     alt="#3333FF">
                                    <area shape="poly" coords="180,15,189,19,189,30,180,34,171,30,171,19" @click="clickColor(&quot;#333399&quot;,-185,171)"
                                     alt="#333399">
                                    <area shape="poly" coords="45,30,54,34,54,45,45,49,36,45,36,34" @click="clickColor(&quot;#669999&quot;,-170,36)"
                                     alt="#669999">
                                    <area shape="poly" coords="63,30,72,34,72,45,63,49,54,45,54,34" @click="clickColor(&quot;#009999&quot;,-170,54)"
                                     alt="#009999">
                                    <area shape="poly" coords="81,30,90,34,90,45,81,49,72,45,72,34" @click="clickColor(&quot;#33CCCC&quot;,-170,72)"
                                     alt="#33CCCC">
                                    <area shape="poly" coords="99,30,108,34,108,45,99,49,90,45,90,34" @click="clickColor(&quot;#00CCFF&quot;,-170,90)"
                                     alt="#00CCFF">
                                    <area shape="poly" coords="117,30,126,34,126,45,117,49,108,45,108,34" @click="clickColor(&quot;#0099FF&quot;,-170,108)"
                                     alt="#0099FF">
                                    <area shape="poly" coords="135,30,144,34,144,45,135,49,126,45,126,34" @click="clickColor(&quot;#0066FF&quot;,-170,126)"
                                     alt="#0066FF">
                                    <area shape="poly" coords="153,30,162,34,162,45,153,49,144,45,144,34" @click="clickColor(&quot;#3366FF&quot;,-170,144)"
                                     alt="#3366FF">
                                    <area shape="poly" coords="171,30,180,34,180,45,171,49,162,45,162,34" @click="clickColor(&quot;#3333CC&quot;,-170,162)"
                                     alt="#3333CC">
                                    <area shape="poly" coords="189,30,198,34,198,45,189,49,180,45,180,34" @click="clickColor(&quot;#666699&quot;,-170,180)"
                                     alt="#666699">
                                    <area shape="poly" coords="36,45,45,49,45,60,36,64,27,60,27,49" @click="clickColor(&quot;#339966&quot;,-155,27)"
                                     alt="#339966">
                                    <area shape="poly" coords="54,45,63,49,63,60,54,64,45,60,45,49" @click="clickColor(&quot;#00CC99&quot;,-155,45)"
                                     alt="#00CC99">
                                    <area shape="poly" coords="72,45,81,49,81,60,72,64,63,60,63,49" @click="clickColor(&quot;#00FFCC&quot;,-155,63)"
                                     alt="#00FFCC">
                                    <area shape="poly" coords="90,45,99,49,99,60,90,64,81,60,81,49" @click="clickColor(&quot;#00FFFF&quot;,-155,81)"
                                     alt="#00FFFF">
                                    <area shape="poly" coords="108,45,117,49,117,60,108,64,99,60,99,49" @click="clickColor(&quot;#33CCFF&quot;,-155,99)"
                                     alt="#33CCFF">
                                    <area shape="poly" coords="126,45,135,49,135,60,126,64,117,60,117,49" @click="clickColor(&quot;#3399FF&quot;,-155,117)"
                                     alt="#3399FF">
                                    <area shape="poly" coords="144,45,153,49,153,60,144,64,135,60,135,49" @click="clickColor(&quot;#6699FF&quot;,-155,135)"
                                     alt="#6699FF">
                                    <area shape="poly" coords="162,45,171,49,171,60,162,64,153,60,153,49" @click="clickColor(&quot;#6666FF&quot;,-155,153)"
                                     alt="#6666FF">
                                    <area shape="poly" coords="180,45,189,49,189,60,180,64,171,60,171,49" @click="clickColor(&quot;#6600FF&quot;,-155,171)"
                                     alt="#6600FF">
                                    <area shape="poly" coords="198,45,207,49,207,60,198,64,189,60,189,49" @click="clickColor(&quot;#6600CC&quot;,-155,189)"
                                     alt="#6600CC">
                                    <area shape="poly" coords="27,60,36,64,36,75,27,79,18,75,18,64" @click="clickColor(&quot;#339933&quot;,-140,18)"
                                     alt="#339933">
                                    <area shape="poly" coords="45,60,54,64,54,75,45,79,36,75,36,64" @click="clickColor(&quot;#00CC66&quot;,-140,36)"
                                     alt="#00CC66">
                                    <area shape="poly" coords="63,60,72,64,72,75,63,79,54,75,54,64" @click="clickColor(&quot;#00FF99&quot;,-140,54)"
                                     alt="#00FF99">
                                    <area shape="poly" coords="81,60,90,64,90,75,81,79,72,75,72,64" @click="clickColor(&quot;#66FFCC&quot;,-140,72)"
                                     alt="#66FFCC">
                                    <area shape="poly" coords="99,60,108,64,108,75,99,79,90,75,90,64" @click="clickColor(&quot;#66FFFF&quot;,-140,90)"
                                     alt="#66FFFF">
                                    <area shape="poly" coords="117,60,126,64,126,75,117,79,108,75,108,64" @click="clickColor(&quot;#66CCFF&quot;,-140,108)"
                                     alt="#66CCFF">
                                    <area shape="poly" coords="135,60,144,64,144,75,135,79,126,75,126,64" @click="clickColor(&quot;#99CCFF&quot;,-140,126)"
                                     alt="#99CCFF">
                                    <area shape="poly" coords="153,60,162,64,162,75,153,79,144,75,144,64" @click="clickColor(&quot;#9999FF&quot;,-140,144)"
                                     alt="#9999FF">
                                    <area shape="poly" coords="171,60,180,64,180,75,171,79,162,75,162,64" @click="clickColor(&quot;#9966FF&quot;,-140,162)"
                                     alt="#9966FF">
                                    <area shape="poly" coords="189,60,198,64,198,75,189,79,180,75,180,64" @click="clickColor(&quot;#9933FF&quot;,-140,180)"
                                     alt="#9933FF">
                                    <area shape="poly" coords="207,60,216,64,216,75,207,79,198,75,198,64" @click="clickColor(&quot;#9900FF&quot;,-140,198)"
                                     alt="#9900FF">
                                    <area shape="poly" coords="18,75,27,79,27,90,18,94,9,90,9,79" @click="clickColor(&quot;#006600&quot;,-125,9)"
                                     alt="#006600">
                                    <area shape="poly" coords="36,75,45,79,45,90,36,94,27,90,27,79" @click="clickColor(&quot;#00CC00&quot;,-125,27)"
                                     alt="#00CC00">
                                    <area shape="poly" coords="54,75,63,79,63,90,54,94,45,90,45,79" @click="clickColor(&quot;#00FF00&quot;,-125,45)"
                                     alt="#00FF00">
                                    <area shape="poly" coords="72,75,81,79,81,90,72,94,63,90,63,79" @click="clickColor(&quot;#66FF99&quot;,-125,63)"
                                     alt="#66FF99">
                                    <area shape="poly" coords="90,75,99,79,99,90,90,94,81,90,81,79" @click="clickColor(&quot;#99FFCC&quot;,-125,81)"
                                     alt="#99FFCC">
                                    <area shape="poly" coords="108,75,117,79,117,90,108,94,99,90,99,79" @click="clickColor(&quot;#CCFFFF&quot;,-125,99)"
                                     alt="#CCFFFF">
                                    <area shape="poly" coords="126,75,135,79,135,90,126,94,117,90,117,79" @click="clickColor(&quot;#CCCCFF&quot;,-125,117)"
                                     alt="#CCCCFF">
                                    <area shape="poly" coords="144,75,153,79,153,90,144,94,135,90,135,79" @click="clickColor(&quot;#CC99FF&quot;,-125,135)"
                                     alt="#CC99FF">
                                    <area shape="poly" coords="162,75,171,79,171,90,162,94,153,90,153,79" @click="clickColor(&quot;#CC66FF&quot;,-125,153)"
                                     alt="#CC66FF">
                                    <area shape="poly" coords="180,75,189,79,189,90,180,94,171,90,171,79" @click="clickColor(&quot;#CC33FF&quot;,-125,171)"
                                     alt="#CC33FF">
                                    <area shape="poly" coords="198,75,207,79,207,90,198,94,189,90,189,79" @click="clickColor(&quot;#CC00FF&quot;,-125,189)"
                                     alt="#CC00FF">
                                    <area shape="poly" coords="216,75,225,79,225,90,216,94,207,90,207,79" @click="clickColor(&quot;#9900CC&quot;,-125,207)"
                                     alt="#9900CC">
                                    <area shape="poly" coords="9,90,18,94,18,105,9,109,0,105,0,94" @click="clickColor(&quot;#003300&quot;,-110,0)"
                                     alt="#003300">
                                    <area shape="poly" coords="27,90,36,94,36,105,27,109,18,105,18,94" @click="clickColor(&quot;#009933&quot;,-110,18)"
                                     alt="#009933"><area shape="poly" coords="45,90,54,94,54,105,45,109,36,105,36,94" @click="clickColor(&quot;#33CC33&quot;,-110,36)"
                                     alt="#33CC33">
                                    <area shape="poly" coords="63,90,72,94,72,105,63,109,54,105,54,94" @click="clickColor(&quot;#66FF66&quot;,-110,54)"
                                     alt="#66FF66">
                                    <area shape="poly" coords="81,90,90,94,90,105,81,109,72,105,72,94" @click="clickColor(&quot;#99FF99&quot;,-110,72)"
                                     alt="#99FF99">
                                    <area shape="poly" coords="99,90,108,94,108,105,99,109,90,105,90,94" @click="clickColor(&quot;#CCFFCC&quot;,-110,90)"
                                     alt="#CCFFCC">
                                    <area shape="poly" coords="117,90,126,94,126,105,117,109,108,105,108,94" @click="clickColor(&quot;#FFFFFF&quot;,-110,108)"
                                     alt="#FFFFFF">
                                    <area shape="poly" coords="135,90,144,94,144,105,135,109,126,105,126,94" @click="clickColor(&quot;#FFCCFF&quot;,-110,126)"
                                     alt="#FFCCFF">
                                    <area shape="poly" coords="153,90,162,94,162,105,153,109,144,105,144,94" @click="clickColor(&quot;#FF99FF&quot;,-110,144)"
                                     alt="#FF99FF">
                                    <area shape="poly" coords="171,90,180,94,180,105,171,109,162,105,162,94" @click="clickColor(&quot;#FF66FF&quot;,-110,162)"
                                     alt="#FF66FF">
                                    <area shape="poly" coords="189,90,198,94,198,105,189,109,180,105,180,94" @click="clickColor(&quot;#FF00FF&quot;,-110,180)"
                                     alt="#FF00FF">
                                    <area shape="poly" coords="207,90,216,94,216,105,207,109,198,105,198,94" @click="clickColor(&quot;#CC00CC&quot;,-110,198)"
                                     alt="#CC00CC">
                                    <area shape="poly" coords="225,90,234,94,234,105,225,109,216,105,216,94" @click="clickColor(&quot;#660066&quot;,-110,216)"
                                     alt="#660066">
                                    <area shape="poly" coords="18,105,27,109,27,120,18,124,9,120,9,109" @click="clickColor(&quot;#336600&quot;,-95,9)"
                                     alt="#336600">
                                    <area shape="poly" coords="36,105,45,109,45,120,36,124,27,120,27,109" @click="clickColor(&quot;#009900&quot;,-95,27)"
                                     alt="#009900">
                                    <area shape="poly" coords="54,105,63,109,63,120,54,124,45,120,45,109" @click="clickColor(&quot;#66FF33&quot;,-95,45)"
                                     alt="#66FF33">
                                    <area shape="poly" coords="72,105,81,109,81,120,72,124,63,120,63,109" @click="clickColor(&quot;#99FF66&quot;,-95,63)"
                                     alt="#99FF66">
                                    <area shape="poly" coords="90,105,99,109,99,120,90,124,81,120,81,109" @click="clickColor(&quot;#CCFF99&quot;,-95,81)"
                                     alt="#CCFF99">
                                    <area shape="poly" coords="108,105,117,109,117,120,108,124,99,120,99,109" @click="clickColor(&quot;#FFFFCC&quot;,-95,99)"
                                     alt="#FFFFCC">
                                    <area shape="poly" coords="126,105,135,109,135,120,126,124,117,120,117,109" @click="clickColor(&quot;#FFCCCC&quot;,-95,117)"
                                     alt="#FFCCCC">
                                    <area shape="poly" coords="144,105,153,109,153,120,144,124,135,120,135,109" @click="clickColor(&quot;#FF99CC&quot;,-95,135)"
                                     alt="#FF99CC">
                                    <area shape="poly" coords="162,105,171,109,171,120,162,124,153,120,153,109" @click="clickColor(&quot;#FF66CC&quot;,-95,153)"
                                     alt="#FF66CC">
                                    <area shape="poly" coords="180,105,189,109,189,120,180,124,171,120,171,109" @click="clickColor(&quot;#FF33CC&quot;,-95,171)"
                                     alt="#FF33CC">
                                    <area shape="poly" coords="198,105,207,109,207,120,198,124,189,120,189,109" @click="clickColor(&quot;#CC0099&quot;,-95,189)"
                                     alt="#CC0099">
                                    <area shape="poly" coords="216,105,225,109,225,120,216,124,207,120,207,109" @click="clickColor(&quot;#993399&quot;,-95,207)"
                                     alt="#993399">
                                    <area shape="poly" coords="27,120,36,124,36,135,27,139,18,135,18,124" @click="clickColor(&quot;#333300&quot;,-80,18)"
                                     alt="#333300">
                                    <area shape="poly" coords="45,120,54,124,54,135,45,139,36,135,36,124" @click="clickColor(&quot;#669900&quot;,-80,36)"
                                     alt="#669900">
                                    <area shape="poly" coords="63,120,72,124,72,135,63,139,54,135,54,124" @click="clickColor(&quot;#99FF33&quot;,-80,54)"
                                     alt="#99FF33">
                                    <area shape="poly" coords="81,120,90,124,90,135,81,139,72,135,72,124" @click="clickColor(&quot;#CCFF66&quot;,-80,72)"
                                     alt="#CCFF66">
                                    <area shape="poly" coords="99,120,108,124,108,135,99,139,90,135,90,124" @click="clickColor(&quot;#FFFF99&quot;,-80,90)"
                                     alt="#FFFF99">
                                    <area shape="poly" coords="117,120,126,124,126,135,117,139,108,135,108,124" @click="clickColor(&quot;#FFCC99&quot;,-80,108)"
                                     alt="#FFCC99">
                                    <area shape="poly" coords="135,120,144,124,144,135,135,139,126,135,126,124" @click="clickColor(&quot;#FF9999&quot;,-80,126)"
                                     alt="#FF9999">
                                    <area shape="poly" coords="153,120,162,124,162,135,153,139,144,135,144,124" @click="clickColor(&quot;#FF6699&quot;,-80,144)"
                                     alt="#FF6699">
                                    <area shape="poly" coords="171,120,180,124,180,135,171,139,162,135,162,124" @click="clickColor(&quot;#FF3399&quot;,-80,162)"
                                     alt="#FF3399">
                                    <area shape="poly" coords="189,120,198,124,198,135,189,139,180,135,180,124" @click="clickColor(&quot;#CC3399&quot;,-80,180)"
                                     alt="#CC3399">
                                    <area shape="poly" coords="207,120,216,124,216,135,207,139,198,135,198,124" @click="clickColor(&quot;#990099&quot;,-80,198)"
                                     alt="#990099">
                                    <area shape="poly" coords="36,135,45,139,45,150,36,154,27,150,27,139" @click="clickColor(&quot;#666633&quot;,-65,27)"
                                     alt="#666633">
                                    <area shape="poly" coords="54,135,63,139,63,150,54,154,45,150,45,139" @click="clickColor(&quot;#99CC00&quot;,-65,45)"
                                     alt="#99CC00">
                                    <area shape="poly" coords="72,135,81,139,81,150,72,154,63,150,63,139" @click="clickColor(&quot;#CCFF33&quot;,-65,63)"
                                     alt="#CCFF33">
                                    <area shape="poly" coords="90,135,99,139,99,150,90,154,81,150,81,139" @click="clickColor(&quot;#FFFF66&quot;,-65,81)"
                                     alt="#FFFF66">
                                    <area shape="poly" coords="108,135,117,139,117,150,108,154,99,150,99,139" @click="clickColor(&quot;#FFCC66&quot;,-65,99)"
                                     alt="#FFCC66">
                                    <area shape="poly" coords="126,135,135,139,135,150,126,154,117,150,117,139" @click="clickColor(&quot;#FF9966&quot;,-65,117)"
                                     alt="#FF9966">
                                    <area shape="poly" coords="144,135,153,139,153,150,144,154,135,150,135,139" @click="clickColor(&quot;#FF6666&quot;,-65,135)"
                                     alt="#FF6666">
                                    <area shape="poly" coords="162,135,171,139,171,150,162,154,153,150,153,139" @click="clickColor(&quot;#FF0066&quot;,-65,153)"
                                     alt="#FF0066">
                                    <area shape="poly" coords="180,135,189,139,189,150,180,154,171,150,171,139" @click="clickColor(&quot;#CC6699&quot;,-65,171)"
                                     alt="#CC6699">
                                    <area shape="poly" coords="198,135,207,139,207,150,198,154,189,150,189,139" @click="clickColor(&quot;#993366&quot;,-65,189)"
                                     alt="#993366">
                                    <area shape="poly" coords="45,150,54,154,54,165,45,169,36,165,36,154" @click="clickColor(&quot;#999966&quot;,-50,36)"
                                     alt="#999966">
                                    <area shape="poly" coords="63,150,72,154,72,165,63,169,54,165,54,154" @click="clickColor(&quot;#CCCC00&quot;,-50,54)"
                                     alt="#CCCC00">
                                    <area shape="poly" coords="81,150,90,154,90,165,81,169,72,165,72,154" @click="clickColor(&quot;#FFFF00&quot;,-50,72)"
                                     alt="#FFFF00">
                                    <area shape="poly" coords="99,150,108,154,108,165,99,169,90,165,90,154" @click="clickColor(&quot;#FFCC00&quot;,-50,90)"
                                     alt="#FFCC00">
                                    <area shape="poly" coords="117,150,126,154,126,165,117,169,108,165,108,154" @click="clickColor(&quot;#FF9933&quot;,-50,108)"
                                     alt="#FF9933">
                                    <area shape="poly" coords="135,150,144,154,144,165,135,169,126,165,126,154" @click="clickColor(&quot;#FF6600&quot;,-50,126)"
                                     alt="#FF6600">
                                    <area shape="poly" coords="153,150,162,154,162,165,153,169,144,165,144,154" @click="clickColor(&quot;#FF5050&quot;,-50,144)"
                                     alt="#FF5050">
                                    <area shape="poly" coords="171,150,180,154,180,165,171,169,162,165,162,154" @click="clickColor(&quot;#CC0066&quot;,-50,162)"
                                     alt="#CC0066">
                                    <area shape="poly" coords="189,150,198,154,198,165,189,169,180,165,180,154" @click="clickColor(&quot;#660033&quot;,-50,180)"
                                     alt="#660033">
                                    <area shape="poly" coords="54,165,63,169,63,180,54,184,45,180,45,169" @click="clickColor(&quot;#996633&quot;,-35,45)"
                                     alt="#996633">
                                    <area shape="poly" coords="72,165,81,169,81,180,72,184,63,180,63,169" @click="clickColor(&quot;#CC9900&quot;,-35,63)"
                                     alt="#CC9900">
                                    <area shape="poly" coords="90,165,99,169,99,180,90,184,81,180,81,169" @click="clickColor(&quot;#FF9900&quot;,-35,81)"
                                     alt="#FF9900">
                                    <area shape="poly" coords="108,165,117,169,117,180,108,184,99,180,99,169" @click="clickColor(&quot;#CC6600&quot;,-35,99)"
                                     alt="#CC6600">
                                    <area shape="poly" coords="126,165,135,169,135,180,126,184,117,180,117,169" @click="clickColor(&quot;#FF3300&quot;,-35,117)"
                                     alt="#FF3300">
                                    <area shape="poly" coords="144,165,153,169,153,180,144,184,135,180,135,169" @click="clickColor(&quot;#FF0000&quot;,-35,135)"
                                     alt="#FF0000">
                                    <area shape="poly" coords="162,165,171,169,171,180,162,184,153,180,153,169" @click="clickColor(&quot;#CC0000&quot;,-35,153)"
                                     alt="#CC0000">
                                    <area shape="poly" coords="180,165,189,169,189,180,180,184,171,180,171,169" @click="clickColor(&quot;#990033&quot;,-35,171)"
                                     alt="#990033">
                                    <area shape="poly" coords="63,180,72,184,72,195,63,199,54,195,54,184" @click="clickColor(&quot;#663300&quot;,-20,54)"
                                     alt="#663300">
                                    <area shape="poly" coords="81,180,90,184,90,195,81,199,72,195,72,184" @click="clickColor(&quot;#996600&quot;,-20,72)"
                                     alt="#996600">
                                    <area shape="poly" coords="99,180,108,184,108,195,99,199,90,195,90,184" @click="clickColor(&quot;#CC3300&quot;,-20,90)"
                                     alt="#CC3300">
                                    <area shape="poly" coords="117,180,126,184,126,195,117,199,108,195,108,184" @click="clickColor(&quot;#993300&quot;,-20,108)"
                                     alt="#993300">
                                    <area shape="poly" coords="135,180,144,184,144,195,135,199,126,195,126,184" @click="clickColor(&quot;#990000&quot;,-20,126)"
                                     alt="#990000">
                                    <area shape="poly" coords="153,180,162,184,162,195,153,199,144,195,144,184" @click="clickColor(&quot;#800000&quot;,-20,144)"
                                     alt="#800000">
                                    <area shape="poly" coords="171,180,180,184,180,195,171,199,162,195,162,184" @click="clickColor(&quot;#993333&quot;,-20,162)"
                                     alt="#993333">
                                </map>
                                <div class="mt-3 text-center">
                                    <div class="input-group">
                                        <input id="colorPickerInput"
                                            class="form-control colorPickerInput"
                                            @keyup.enter="hslLum_top(colorPickerInput)"
                                            v-model="colorPickerInput"
                                            :style="{ backgroundColor: colorPickerInput, color: colorPickerInput }"/>
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-secondary" type="button" @click="generateGradientColor();">查看相近颜色</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="mt-3 text-center">
                                    <button class="btn btn-outline-primary fz8" @click="setColor();" title="在HBuilderX内预览当前颜色">预览</button>
                                    <button class="btn btn-outline-danger fz8" @click="resetOptionColor({});" title="重置当前颜色">重置</button>
                                </div>
                            </div>
                            <div class="col-12 col-sm-6 col-lg-4 text-center cpTable">
                                <ul class="colorPickerTable pl-0">
                                    <li v-for="(hex,hex_idex) in colorPickerTableData" :key="hex" @click="colorPickerInput = hex.color">
                                        <span class="color-block" :style="{ backgroundColor: hex.color }"></span>
                                        <span style="width: 80px; display:inline-block;">{{ (hex.color).toUpperCase() }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <script>
                var app = new Vue({
                    el: '#app',
                    data: {
                        themeData: {
                            "Default": "绿柔",
                            "Monokai": "酷黑",
                            "Atom One Dark": "雅蓝"
                        },
                        searchWord: '',
                        isShowThemeList: false,
                        isShowPicker: false,
                        isShowHelp: false,
                        hxColors: [],
                        sectionId: '',
                        selectInfo: {},
                        placeholder: '',
                        currentThemeID: '',
                        colorPickerSetting: true,
                        colorPickerTableData: [],
                        colorPickerInput: ""
                    },
                    computed: {
                        ThemeOptionsNames() {
                            let last = [];
                            let options1 = this.hxColors.map( item => {
                                return item.name;
                            });
                            last = [...last, ...options1];
                            for (let i of this.hxColors) {
                                let tmp = i.colors.map(item2 => { return item2.option_desc })
                                last = [...last, ...tmp];
                            };
                            return last;
                        },
                        currentThemeName() {
                            let themeData = this.themeData;
                            return themeData[this.currentThemeID];
                        }
                    },
                    watch: {
                        currentThemeID: function(val, oldVal) {
                            let theme = this.currentThemeID;
                            switch (theme){
                                case 'Monokai':
                                    this.hslLum_top('#FFFFFF');
                                    break;
                                case 'Atom One Dark':
                                    this.hslLum_top('#FFFFFF');
                                    break;
                                default:
                                    this.hslLum_top('#FFFAE8');
                                    break;
                            }
                        },
                        colorPickerInput: function (val, oldVal) {
                            let data = this.hxColors;
                            let sectionId = this.sectionId;
                            for (let i in data) {
                                if (data[i]['id'] == sectionId) {
                                    let options = data[i]['colors'];
                                    for (let i2 in options) {
                                        if (options[i2]['option_id'] == this.selectInfo.option_id) {
                                            let colorValue = this.colorPickerInput;
                                            options[i2] = Object.assign(options[i2],{'option_value': colorValue});
                                            break;
                                        };
                                    };
                                    data[i]['colors'] = options;
                                    break;
                                };
                            };
                            this.hxColors = data;
                        }
                    },
                    created() {
                        this.currentThemeID = '${currentThemeID}';
                    },
                    mounted() {
                        let that = this;
                        window.onload = function() {
                            setTimeout(function(){
                                that.getCurrentThemeSetting();
                                that.receive();
                            }, 1000)
                        }
                    },
                    methods: {
                        getCurrentThemeSetting() {
                            hbuilderx.postMessage({
                                command: 'CurrentThemeSetting'
                            });
                        },
                        receive() {
                            hbuilderx.onDidReceiveMessage((msg) => {
                                if (msg.command == 'CurrentThemeSetting') {
                                    this.hxColors = msg.data;
                                };
                                if (msg.command == 'currentThemeID') {
                                    this.currentThemeID = msg.data;
                                };
                                if (msg.command == 'CustomEditor') {
                                    let themedata = msg.data;
                                    let colors = Object.keys(themedata);
                                    for (let i of colors) {
                                        document.documentElement.style.setProperty('--' + i, themedata[i]);
                                    };
                                }
                            });
                        },
                        goSearch() {
                            let options = this.ThemeOptionsNames;
                            let result = options.filter( item => item.includes(this.searchWord));
                            let eid = result[0];
                            if (eid) {
                                document.getElementById(eid).scrollIntoView({
                                    behavior: "smooth",
                                    block:    "start"
                                });
                            }
                        },
                        showThemeList() {
                            if (this.isShowThemeList) {
                                this.isShowThemeList = false
                            } else {
                                this.isShowThemeList = true
                            }
                        },
                        switchTheme(themeId, themeName) {
                            this.currentThemeID = themeId;
                            this.currentThemeName = themeName;

                            hbuilderx.postMessage({
                                command: 'switchTheme',
                                theme: themeId
                            });
                        },
                        showColorPicker(sectionId, data) {
                            this.colorPickerInput = '';
                            if (this.isShowHelp) {
                                this.isShowHelp = false
                            };
                            this.isShowPicker = true;

                            this.placeholder = '请在颜色选择器上选择颜色'
                            this.sectionId = sectionId;
                            this.selectInfo = data;

                            let {option_value} = data;
                            let isColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(option_value);
                            if (option_value && isColor) {
                                this.colorPickerInput = option_value;
                                this.hslLum_top(option_value);
                            };
                        },
                        leaveInput() {
                            this.isShowPicker = false;
                            this.selectInfo = {};
                        },
                        checkScreenWidth() {
                            let width = document.documentElement.clientWidth;
                            if (width < 576) {
                                this.showBoxMsg('主题定制: 页面内容显示不全，请拉动至合适宽度，以便显示完整内容。')
                            }
                        },
                        clickColor(hex, seltop, selleft, html5) {
                            this.checkScreenWidth();
                            let c, cObj, colormap, areas, i, areacolor, cc;
                            if (html5 && html5 == 5) {
                                c = document.getElementById("colorPickerInput").value;
                            } else {
                                if (hex == 0) {
                                    c = document.getElementById("entercolor").value;
                                } else {
                                    c = hex;
                                }
                            }
                            cObj = w3color(c);
                            colorhex = cObj.toHexString();
                            this.hslLum_top(colorhex);
                        },
                        hslLum_top(v) {
                            let isColor = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(v);
                            if (!isColor) {return;};
                            let colorData = [];
                            let color = v;
                            let i, a, match;
                            let hslObj = w3color(color);
                            let h = hslObj.hue;
                            let s = hslObj.sat;
                            let l = hslObj.lightness;
                            let arr = [];
                            for (i = 0; i <= 20; i++) {
                                arr.push(w3color("hsl(" + h + "," + s + "," + (i * 0.05) + ")"));
                            };
                            arr.reverse();
                            match = 0;
                            for (i = 0; i < arr.length; i++) {
                                if (match == 0 && Math.round(l * 100) == Math.round(arr[i].lightness * 100)) {
                                    let tmp = {"color": w3color(hslObj).toHexString()}
                                    colorData.push(tmp)
                                    match = 1;
                                } else {
                                    if (match == 0 && l > arr[i].lightness) {
                                        let tmp1 = {"color": w3color(hslObj).toHexString()}
                                        colorData.push(tmp1)
                                        match = 1;
                                    }
                                    let tmp2 = {"color": arr[i].toHexString()}
                                    colorData.push(tmp2)
                                }
                            };
                            this.colorPickerTableData = colorData;
                        },
                        generateGradientColor() {
                            let color = this.colorPickerInput;
                            let check = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)
                            if (color == '' || !color || !check) {
                                this.showBoxMsg('请输入有效的十六进制颜色！')
                                return;
                            } else {
                                this.hslLum_top(color);
                            }
                        },
                        changeInputBoxColorValue(status) {
                            if (!['add','reset'].includes(status)) {
                                return;
                            };
                            let data = [...this.hxColors];
                            let sectionId = this.sectionId;
                            for (let i in data) {
                                if (data[i]['id'] == sectionId) {
                                    let options = data[i]['colors'];
                                    for (let i2 in options) {
                                        if (options[i2]['option_id'] == this.selectInfo.option_id) {
                                            if (status == 'reset') {
                                                options[i2] = Object.assign(options[i2],{'option_value': ''});
                                            };
                                            if (status == 'add') {
                                                options[i2] = Object.assign(options[i2],{'option_value': this.colorPickerInput});
                                            }
                                            break;
                                        };
                                    };
                                    data[i]['colors'] = options;
                                    break;
                                };
                            };
                            this.hxColors = data;
                        },
                        setColor() {
                            this.changeInputBoxColorValue('add');

                            let option_color = this.colors;
                            if (this.colorPickerInput != undefined && this.colorPickerInput != '') {
                                option_color = this.colorPickerInput;
                            };
                            let {option_id, option_desc} = this.selectInfo;
                            let data = {
                                'currentThemeID': this.currentThemeID,
                                'option_id': option_id,
                                'option_color': option_color,
                                'option_desc': option_desc
                            };
                            hbuilderx.postMessage({
                                command: 'setColor',
                                data: data
                            });
                        },
                        setOptionColor(data) {
                            this.colorPickerInput = data.option_value;
                            let {option_id, option_desc, option_value} = data;
                            if (option_value == '' || !option_value) {return;};
                            let result = {
                                'currentThemeID': this.currentThemeID,
                                'option_id': option_id,
                                'option_color': option_value,
                                'option_desc': option_desc
                            }
                            hbuilderx.postMessage({
                                command: 'setColor',
                                data: result
                            });
                        },
                        resetOptionColor(item) {
                            if (JSON.stringify(item) != '{}') {
                                this.selectInfo = item;
                            };
                            this.changeInputBoxColorValue('reset');
                            let option_id = this.selectInfo.option_id;
                            let option_desc = this.selectInfo.option_desc;

                            let data = {
                                'option_id': option_id,
                                'currentThemeID': this.currentThemeID,
                                'option_desc': option_desc
                            }
                            hbuilderx.postMessage({
                                command: 'resetOptionColor',
                                data: data
                            });
                        },
                        resetAll() {
                            hbuilderx.postMessage({
                                command: 'resetAll',
                                currentThemeID: this.currentThemeID
                            });
                        },
                        share() {
                            hbuilderx.postMessage({
                                command: 'share'
                            });
                        },
                        refresh() {
                            hbuilderx.postMessage({
                                command: 'refresh'
                            });
                        },
                        help() {
                            if (this.isShowPicker) {
                                this.isShowPicker = false
                            };
                            if (this.isShowHelp) {
                                this.isShowHelp = false
                            } else {
                                this.isShowHelp = true
                            };
                        },
                        openWebHelp() {
                            hbuilderx.postMessage({
                                command: 'help'
                            });
                        },
                        openTutorial() {
                            hbuilderx.postMessage({
                                command: 'tutorial'
                            });
                        },
                        showBoxMsg(text) {
                            hbuilderx.postMessage({
                                command: 'showBoxMsg',
                                text: text
                            });
                        }
                    }
                })
            </script>
            <script>
                window.oncontextmenu = function() {
                    event.preventDefault();
                    return false;
                }
            </script>
        </body>
    </html>
    `
};


module.exports = getWebviewContent;
