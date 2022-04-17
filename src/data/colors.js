const hx = require('hbuilderx');

const os = require('os');
const osName = os.platform();

const {cmp_hx_version} = require('../lib/common.js');

// hbuilderx version
let hxVersion = hx.env.appVersion;
hxVersion = hxVersion.replace('-alpha', '').replace(/.\d{8}/, '');

// 比较版本号，HBuilderX编辑器代码颜色自定义仅对HBuilderX 3.1.19+版本生效
const cmpVersionResult = cmp_hx_version(hxVersion, '3.1.19');


/**
 * @description 公共颜色（即mac、windows都生效）
 */
const common = [{
    "id": "editor",
    "name": "文本编辑区",
    "colors": [{
        "option_id": "editor.background",
        "option_desc": "编辑区 - 背景颜色"
    }, {
        "option_id": "editor.foreground",
        "option_desc": "编辑区 - 前景颜色"
    }, {
        "option_id": "editor.caretLine",
        "option_desc": "编辑区 - 光标所在行的行颜色"
    }, {
        "option_id": "editor.caret",
        "option_desc": "编辑区 - 光标颜色"
    }, {
        "option_id": "editor.linenumber",
        "option_desc": "编辑区 - 行号颜色"
    }, {
        "option_id": "editor.selection",
        "option_desc": "编辑区 - 选中代码后选区颜色"
    }, {
        "option_id": "editor.unactive_selection.background",
        "option_desc": "编辑区 - 未激活的选区颜色"
    }, {
        "option_id": "editor.selectRegion",
        "option_desc": "编辑区 - 区域内搜索，选区颜色"
    },{
        "option_id": "editor.foldMarker.expanded.background",
        "option_desc": "编辑区 - 折叠图标，展开状态背景色"
    },{
        "option_id": "editor.foldMarker.expanded.foreground",
        "option_desc": "编辑区 - 折叠图标，展开状态前景色"
    },{
        "option_id": "editor.foldMarker.collapsed.background",
        "option_desc": "编辑区 - 折叠图标，折叠状态背景色"
    },{
        "option_id": "editor.foldMarker.collapsed.foreground",
        "option_desc": "编辑区 - 折叠图标，折叠状态前景色"
    },{
        "option_id": "editor.indentguide",
        "option_desc": "编辑区 - 缩进导轨的颜色"
    }, {
        "option_id": "editor.whitespace",
        "option_desc": "编辑区 - 缩进颜色"
    }, {
        "option_id": "editor.hyperlink",
        "option_desc": "编辑区 - 超链接激活时的文字颜色"
    }, {
        "option_id": "editor.indicator.matchtag",
        "option_desc": "配对括号的突出显示颜色"
    }, {
        "option_id": "editor.indicator.sameword",
        "option_desc": "相同词汇的突出显示颜色"
    }]
}, {
    "id": "sideBar",
    "name": "项目管理器 (左侧视图)",
    "colors": [{
        "option_id": "sideBar.background",
        "option_desc": "项目管理器 - 背景颜色"
    }, {
        "option_id": "sideBar.border",
        "option_desc": "项目管理器 - 边框颜色"
    }]
}, {
    "id": "list",
    "name": "列表控件/树控件区（项目管理器）",
    "colors": [{
        "option_id": "list.foreground",
        "option_desc": "前景颜色"
    }, {
        "option_id": "list.activeSelectionBackground",
        "option_desc": "选中条目背景颜色"
    }, {
        "option_id": "list.activeSelectionForeground",
        "option_desc": "选中条目前景颜色"
    }, {
        "option_id": "list.hoverBackground",
        "option_desc": "鼠标滑过背景颜色"
    }, {
        "option_id": "list.highlightForeground",
        "option_desc": "高亮时前景颜色"
    }, {
        "option_id": "list.inactiveSelectionBackground",
        "option_desc": "未选中条目背景颜色"
    }, {
        "option_id": "list.inactiveSelectionForeground",
        "option_desc": "未选中条目前景颜色"
    }, {
        "option_id": "explorer.file.status.modified",
        "option_desc": "svn/git项目修改状态前景色"
    }, {
        "option_id": "explorer.file.status.untracked",
        "option_desc": "svn/git项目未跟踪状态前景色"
    }, {
        "option_id": "explorer.file.status.added",
        "option_desc": "svn/git项目添加状态前景色"
    }, {
        "option_id": "explorer.file.status.conflicted",
        "option_desc": "svn/git项目冲突状态前景色"
    }, {
        "option_id": "explorer.file.status.rename",
        "option_desc": "svn/git项目重命名状态前景色"
    }, {
        "option_id": "explorer.file.status.marktext",
        "option_desc": "svn/git项目标记前景色"
    }]
}, {
    "id": "toolBar",
    "name": "工具栏",
    "colors": [{
        "option_id": "toolBar.background",
        "option_desc": "工具栏 - 背景颜色"
    }, {
        "option_id": "toolBar.border",
        "option_desc": "工具栏 - 边框颜色"
    }, {
        "option_id": "toolBar.hoverBackground",
        "option_desc": "工具栏 - 图标被选中时的背景颜色"
    }, {
        "option_id": "pathnavigator.pathnode.hoverbackground",
        "option_desc": "工具栏 - 地址栏悬停背景色"
    }]
}, {
    "id": "tab",
    "name": "标签卡",
    "colors": [{
        "option_id": "editorGroupHeader.tabsBackground",
        "option_desc": "tabs背景颜色"
    }, {
        "option_id": "tab.activeBackground",
        "option_desc": "激活/选中时的背景颜色"
    }, {
        "option_id": "tab.activeForeground",
        "option_desc": "激活/选中时的前景颜色"
    }, {
        "option_id": "tab.border",
        "option_desc": "边框颜色"
    }, {
        "option_id": "tab.inactiveBackground",
        "option_desc": "未选中时的背景颜色"
    }, {
        "option_id": "tab.inactiveForeground",
        "option_desc": "未选中时的前景颜色"
    }, {
        "option_id": "tab.activeBorder",
        "option_desc": "选中时的边框颜色"
    }, {
        "option_id": "tab.hoverBackground",
        "option_desc": "鼠标滑过时的背景颜色"
    }, {
        "option_id": "tab.unfocusedInactiveForeground",
        "option_desc": "未选中分栏里未选中标签的前景颜色"
    }, {
        "option_id": "tab.unfocusedHoverBackground",
        "option_desc": "未选中分栏里鼠标滑过未选中标签的背景颜色"
    }, {
        "option_id": "tab.unfocusedActiveForeground",
        "option_desc": "未选中分栏里选中标签的前景颜色"
    }]
}, {
    "id": "subfield",
    "name": "分栏",
    "colors": [{
        "option_id": "editorGroup.border",
        "option_desc": "分割线颜色"
    }, {
        "option_id": "tab.unfocusedActiveForeground",
        "option_desc": "未激活分组里选中标签前景色"
    }]
}, {
    "id": "editorSuggestWidget",
    "name": "代码助手",
    "colors": [{
        "option_id": "editorSuggestWidget.background",
        "option_desc": "助手弹窗背景颜色"
    }, {
        "option_id": "editorSuggestWidget.border",
        "option_desc": "助手弹窗边框颜色"
    }, {
        "option_id": "editorSuggestWidget.selectedBackground",
        "option_desc": "助手弹窗选中条目时背景颜色"
    }, {
        "option_id": "editorSuggestWidget.link",
        "option_desc": "助手链接颜色"
    }]
}, {
    "id": "input",
    "name": "搜索文本框",
    "colors": [{
        "option_id": "input.background",
        "option_desc": "文本框背景颜色"
    }, {
        "option_id": "input.foreground",
        "option_desc": "文本框前景颜色"
    }, {
        "option_id": "input.border",
        "option_desc": "文本框边框颜色"
    }, {
        "option_id": "focusBorder",
        "option_desc": "文本框有焦点时边框颜色"
    },{
        "option_id": "input.searchbar.foreground.notfinded",
        "option_desc": "字符搜索框有内容,且内容没有搜索到时,搜索文字以及光标的颜色"
    },{
        "option_id": "input.searchbar.foreground",
        "option_desc": "字符搜索框没有内容时,搜索框内的文字颜色; 字符搜索框有内容,被搜索到时,搜索文字以及光标的颜色"
    }]
}, {
    "id": "inputList",
    "name": "搜索下拉框",
    "colors": [{
        "option_id": "inputValidation.infoBackground",
        "option_desc": "下拉框背景颜色"
    }, {
        "option_id": "inputList.hoverBackground",
        "option_desc": "鼠标滑过item背景颜色"
    }, {
        "option_id": "inputList.border",
        "option_desc": "下拉框边框颜色"
    }, {
        "option_id": "inputList.titleColor",
        "option_desc": "下拉框左边文字颜色"
    }, {
        "option_id": "inputList.foreground",
        "option_desc": "下拉框右边文字颜色"
    }, {
        "option_id": "searchbar.quick_search_item.icon",
        "option_desc": "搜索栏下拉列表,未选中项的颜色 （反色）"
    }, {
        "option_id": "searchbar.quick_search_item.icon_selected",
        "option_desc": "搜索栏下拉列表,当前选中项的颜色（反色）"
    }]
}, {
    "id": "outline",
    "name": "文档结构图",
    "colors": [{
        "option_id": "outlineBackground",
        "option_desc": "文档结构图背景颜色"
    }]
}, {
    "id": "scrollbarSlider",
    "name": "滚动条",
    "colors": [{
        "option_id": "scrollbarSlider.background",
        "option_desc": "滚动条背景颜色"
    }, {
        "option_id": "scrollbarSlider.hoverBackground",
        "option_desc": "鼠标滑过滚动条背景颜色"
    }]
}, {
    "id": "extensionButton",
    "name": "预览按钮",
    "colors": [{
        "option_id": "extensionButton.prominentBackground",
        "option_desc": "背景颜色"
    }, {
        "option_id": "extensionButton.prominentForeground",
        "option_desc": "前景颜色"
    }, {
        "option_id": "extensionButton.border",
        "option_desc": "边框颜色"
    }, {
        "option_id": "extensionButton.prominentHoverBackground",
        "option_desc": "鼠标滑过时的背景颜色"
    }, {
        "option_id": "extensionButton.checkColor",
        "option_desc": "选中时的前景颜色"
    }]
}, {
    "id": "set",
    "name": "设置",
    "colors": [{
        "option_id": "editor.background",
        "option_desc": "设置页面背景颜色"
    }, {
        "option_id": "inputOption.activeBorder",
        "option_desc": "文本框有焦点时边框颜色"
    }, {
        "option_id": "settings.textInputBackground",
        "option_desc": "文本框背景颜色"
    }, {
        "option_id": "settings.textInputBorder",
        "option_desc": "文本框边框颜色"
    }, {
        "option_id": "settings.textInputDisableBackground",
        "option_desc": "文本框不可用背景颜色"
    }, {
        "option_id": "settings.dropdownForeground",
        "option_desc": "combobox下拉列表前景颜色"
    }, {
        "option_id": "settings.dropdownBorder",
        "option_desc": "combobox下拉列表边框颜色"
    }, {
        "option_id": "settings.dropdownBackground",
        "option_desc": "combobox下拉列表背景颜色"
    }, {
        "option_id": "settings.dropdownListBorder",
        "option_desc": "combobox item边框颜色"
    }]
}, {
    "id": "button",
    "name": "按钮 (设置窗口)",
    "colors": [{
        "option_id": "button.background",
        "option_desc": "按钮背景颜色"
    }, {
        "option_id": "button.foreground",
        "option_desc": "按钮前景颜色"
    }, {
        "option_id": "button.hoverBackground",
        "option_desc": "鼠标滑过按钮背景颜色"
    }]
}, {
    "id": "imageview",
    "name": "图片预览",
    "colors": [{
        "option_id": "imageview.background",
        "option_desc": "图片预览 - 浅色方格颜色"
    }, {
        "option_id": "imageview.foreground",
        "option_desc": "图片预览 - 深色方格颜色"
    }]
}, {
    "id": "notifications",
    "name": "弹窗提示框",
    "colors": [{
        "option_id": "notifications.border",
        "option_desc": "弹窗边框颜色"
    }, {
        "option_id": "notifications.background",
        "option_desc": "弹窗背景颜色"
    }, {
        "option_id": "notifications.foreground",
        "option_desc": "弹窗前景颜色"
    }, {
        "option_id": "notification.buttonBorder",
        "option_desc": "弹窗按钮边框颜色"
    }, {
        "option_id": "notification.buttonBackground",
        "option_desc": "弹窗按钮背景颜色"
    }, {
        "option_id": "notification.buttonForeground",
        "option_desc": "弹窗按钮前景颜色"
    }, {
        "option_id": "notification.buttonPressedForeground",
        "option_desc": "弹窗按钮按下前景颜色"
    }, {
        "option_id": "notification.buttonPressedBackground",
        "option_desc": "弹窗按钮按下背景颜色"
    }, {
        "option_id": "notificationLink.foreground",
        "option_desc": "弹窗链接颜色"
    }]
}, {
    "id": "filediff",
    "name": "文件对比",
    "colors": [{
        "option_id": "filediff.line.add",
        "option_desc": "添加行背景颜色"
    }, {
        "option_id": "filediff.line.delete",
        "option_desc": "删除行背景颜色"
    }, {
        "option_id": "filediff.inline.base",
        "option_desc": "行内比较和右边行有不同字符，左边字符显示颜色"
    }, {
        "option_id": "filediff.inline.modify",
        "option_desc": "行内比较和左边行有不同字符，右边字符显示颜色"
    }]
}, {
    "id": "console-terminal",
    "name": "终端/控制台",
    "colors": [{
        "option_id": "terminal.background",
        "option_desc": "终端背景颜色"
    }, {
        "option_id": "console.background",
        "option_desc": "控制台背景颜色"
    },  {
        "option_id": "console.foreground",
        "option_desc": "控制台 - 窗口文字颜色"
    }, {
        "option_id": "panelTitle.activeForeground",
        "option_desc": "tab选中时的前景颜色"
    }, {
        "option_id": "debug.foreground",
        "option_desc": "前景颜色"
    }, {
        "option_id": "console.ad",
        "option_desc": "控制台 - 广告信息文字颜色"
    }, {
        "option_id": "console.time",
        "option_desc": "控制台 - 时间信息文字颜色"
    },  {
        "option_id": "console.error",
        "option_desc": "控制台 - 错误信息文字颜色"
    }, {
        "option_id": "console.success",
        "option_desc": "控制台 - 成功信息文字颜色"
    },{
        "option_id": "console.warn",
        "option_desc": "控制台 - 警告信息文字颜色"
    }]
}, {
    "id": "statusBar",
    "name": "底部状态栏",
    "colors": [{
        "option_id": "statusBar.background",
        "option_desc": "底部 - 状态栏 - 背景颜色"
    }, {
        "option_id": "statusBar.foreground",
        "option_desc": "底部 - 状态栏 - 前景颜色"
    }, {
        "option_id": "statusBar.button.hoverbackground",
        "option_desc": "底部 - 状态栏 - 按钮悬停背景色"
    }]
}, {
    "id": "minimap",
    "name": "右侧迷你地图",
    "colors": [{
        "option_id": "minimap.handle.background",
        "option_desc": "迷你地图滑块背景"
    }]
}]

/**
 * @description MacOS颜色
 */
const mac = [{
        "id": "titleBar",
        "name": "mac标题栏",
        "colors": [{
            "option_id": "titleBar.activeBackground",
            "option_desc": "背景颜色"
        }, {
            "option_id": "titleBar.activeForeground",
            "option_desc": "前景颜色"
        }]
    },
    {
        "id": "logview",
        "name": "查看svn/git日志 (仅对mac生效)",
        "colors": [{
            "option_id": "logviewButton.background",
            "option_desc": "按钮背景颜色"
        }, {
            "option_id": "logviewButton.border",
            "option_desc": "按钮边框颜色"
        }, {
            "option_id": "logviewButton.hover",
            "option_desc": "鼠标滑过按钮背景颜色"
        }, {
            "option_id": "logviewButton.disable",
            "option_desc": "按钮不可用背景颜色"
        }, {
            "option_id": "logviewButtonDisable.border",
            "option_desc": "按钮不可用边框颜色"
        }, {
            "option_id": "logview.file.action.modified",
            "option_desc": "选中已修改文件前景色"
        }, {
            "option_id": "logview.file.action.deleted",
            "option_desc": "选中已删除文件前景色"
        }, {
            "option_id": "logview.file.action.added",
            "option_desc": "选中已增加文件前景色"
        }, {
            "option_id": "logview.file.action.rename",
            "option_desc": "选中已重命名文件前景色"
        }]
    }
]

/**
 * @description 代码颜色
 */
let codeRules = [{
    "id": "codeColors",
    "name": "代码颜色",
    "colors": [{
        "option_id": "code_comment",
        "option_desc": "代码注释颜色",
        "scope": ["comment"]
    }, {
        "option_id": "code_tag",
        "option_desc": "html标签颜色",
        "scope": ["punctuation.definition.tag", "punctuation.definition.tag.begin",
            "punctuation.definition.tag.end"
        ]
    }]
}]

if (cmpVersionResult > 0) {
    codeRules[0]["name"] = "代码颜色（HBuilderX 3.1.19+版本生效）";
};

if (osName == 'darwin') {
    colors = [...common, ...mac, ...codeRules]
} else {
    colors = [...common, ...codeRules]
};

module.exports = {
    colors,
    codeRules
};
