// ==UserScript==
// @name         PttChrome+term.ptt.cc Add-on
// @namespace    https://greasyfork.org/zh-TW/scripts/372391-pttchrome-add-on-ptt
// @description  new features for PttChrome (show flags features code by osk2/ptt-comment-flag)
// @version      1.4.5
// @author       avan
// @match        iamchucky.github.io/PttChrome/*
// @match        term.ptt.cc/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/tippy.js/2.5.4/tippy.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://greasyfork.org/scripts/372760-gm-config-lz-string/code/GM_config_lz-string.js?version=634230
// @require      https://greasyfork.org/scripts/372675-flags-css/code/Flags-CSS.js?version=632757
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// ==/UserScript==
"use strict";
//===================================
const isTerm = window.location.href.match(/term.ptt.cc/);
let configStatus = false, configBlackStatus = false, flagMap = {};
let fields = { // Fields object
	'isAddFloorNum': {
		'label': '是否顯示推文樓層', // Appears next to field
		'type': 'checkbox', // Makes this setting a checkbox input
		'default': true // Default value if user doesn't change it
	},
	'isShowFlags': {
		'label': '看板內若有IP(ex.Gossiping)，是否依IP顯示國旗', // Appears next to field
		'type': 'checkbox', // Makes this setting a checkbox input
		'default': true // Default value if user doesn't change it
	},
	'whenShowFlagsIgnoreSpecificCountrys': {
		'label': '指定國家不顯示 ex.「tw;jp」(ISO 3166-1 alpha-2)', // Appears next to field
		'type': 'text', // Makes this setting a text input
		'size': 35, // Limit length of input (default is 25)
		'default': '' // Default value if user doesn't change it
	},
	'isShowDebug': {
		'label': '是否顯示DeBug紀錄', // Appears next to field
		'type': 'checkbox', // Makes this setting a checkbox input
		'default': false // Default value if user doesn't change it
	},
};
if (isTerm) {
	fields = Object.assign({
		'isAutoLogin': {
			'label': '是否自動登入', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'autoUser': {
			'label': '帳號', // Appears next to field
			'type': 'text', // Makes this setting a text input
			'size': 25, // Limit length of input (default is 25)
			'default': '' // Default value if user doesn't change it
		},
		'autoPassWord': {
			'label': '密碼', // Appears next to field
			'type': 'password', // Makes this setting a text input
			'size': 25, // Limit length of input (default is 25)
			'default': '' // Default value if user doesn't change it
		},
		'isAutoSkipInfo1': {
			'label': '是否自動跳過登入後歡迎畫面', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'isAutoToFavorite': {
			'label': '是否自動進入 Favorite 我的最愛', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'isEnableDeleteDupLogin': {
			'label': '當被問到是否刪除其他重複登入的連線，回答:', // Appears next to field
			'type': 'select', // Makes this setting a dropdown
			'options': ['N/A', 'Y', 'N'], // Possible choices
			'default': 'N/A' // Default value if user doesn't change it
		},
		'Button': {
			'label': '編輯黑名單', // Appears on the button
			'type': 'button', // Makes this setting a button input
			'size': 100, // Control the size of the button (default is 25)
			'click': function() { // Function to call when button is clicked
				if (configBlackStatus) gmcBlack.close();
				else if (!configBlackStatus) gmcBlack.open();
			}
		},
		'isHideViewImg': {
			'label': '是否隱藏黑名單圖片預覽', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		'isHideViewVideo': {
			'label': '是否隱藏黑名單影片預覽', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		/*
		'isHideAll': {
			'label': '是否隱藏黑名單推文', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'whenHideAllShowInfo': {
			'label': '當隱藏黑名單推文顯示提示訊息', // Appears next to field
			'type': 'text', // Makes this setting a text input
			'size': 35, // Limit length of input (default is 25)
			'default': '<本文作者已被列黑名單>' // Default value if user doesn't change it
		},
		'whenHideAllShowInfoColor': {
			'label': '上述提示訊息之顏色', // Appears next to field
			'type': 'text', // Makes this setting a text input
			'class':'jscolor',
			'data-jscolor': '{hash:true}',
			'size': 10, // Limit length of input (default is 25)
			'default': '#c0c0c0' // Default value if user doesn't change it
		},
		'isReduceHeight': {
			'label': '是否調降黑名單推文高度', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		'reduceHeight': {
			'label': '設定高度值(單位em)', // Appears next to field
			'type': 'float', // Makes this setting a text input
			'min': 0, // Optional lower range limit
			'max': 10, // Optional upper range limit
			'size': 10, // Limit length of input (default is 25)
			'default': 0.4 // Default value if user doesn't change it
		},
		'isReduceOpacity': {
			'label': '是否調降黑名單推文透明值', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'reduceOpacity': {
			'label': '設定透明值', // Appears next to field
			'type': 'float', // Makes this setting a text input
			'min': 0, // Optional lower range limit
			'max': 1, // Optional upper range limit
			'size': 10, // Limit length of input (default is 25)
			'default': 0.05 // Default value if user doesn't change it
		},
		'isDisableClosePrompt': {
			'label': '是否停用關閉頁面提示', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		*/
	}, fields);
} else {
	fields = Object.assign({
		'isHideAll': {
			'label': '是否隱藏黑名單推文', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'whenHideAllShowInfo': {
			'label': '當隱藏黑名單推文顯示提示訊息', // Appears next to field
			'type': 'text', // Makes this setting a text input
			'size': 35, // Limit length of input (default is 25)
			'default': '<本文作者已被列黑名單>' // Default value if user doesn't change it
		},
		'whenHideAllShowInfoColor': {
			'label': '上述提示訊息之顏色', // Appears next to field
			'type': 'text', // Makes this setting a text input
			'class':'jscolor',
			'data-jscolor': '{hash:true}',
			'size': 10, // Limit length of input (default is 25)
			'default': '#c0c0c0' // Default value if user doesn't change it
		},
		'isHideViewImg': {
			'label': '是否隱藏黑名單圖片預覽', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		'isHideViewVideo': {
			'label': '是否隱藏黑名單影片預覽', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		'isReduceHeight': {
			'label': '是否調降黑名單推文高度', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		'reduceHeight': {
			'label': '設定高度值(單位em)', // Appears next to field
			'type': 'float', // Makes this setting a text input
			'min': 0, // Optional lower range limit
			'max': 10, // Optional upper range limit
			'size': 10, // Limit length of input (default is 25)
			'default': 0.4 // Default value if user doesn't change it
		},
		'isReduceOpacity': {
			'label': '是否調降黑名單推文透明值', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'reduceOpacity': {
			'label': '設定透明值', // Appears next to field
			'type': 'float', // Makes this setting a text input
			'min': 0, // Optional lower range limit
			'max': 1, // Optional upper range limit
			'size': 10, // Limit length of input (default is 25)
			'default': 0.05 // Default value if user doesn't change it
		},
	}, fields);
};
const queryConfigEl = (configSelectors, selectors, callback) => {
	let configEl = document.querySelector(configSelectors);
	if (!configEl) {
		setTimeout(queryConfigEl.bind(null, configSelectors, selectors, callback), 1000);
		return;
	}
	configEl = configEl.contentWindow.document.querySelector(selectors);
	if (!configEl) {
		setTimeout(queryConfigEl.bind(null, configSelectors, selectors, callback), 1000);
		return;
	}
	callback(configEl);
};

const addCssLink = (id, cssStr) => {
	let checkEl = document.querySelector(`#${id}`);
	if (checkEl) {
		checkEl.remove();
	}
	const cssLinkEl = document.createElement('link');
	cssLinkEl.setAttribute('rel', 'stylesheet');
	cssLinkEl.setAttribute('id', id);
	cssLinkEl.setAttribute('type', 'text/css');
	cssLinkEl.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(cssStr));
	document.head.appendChild(cssLinkEl);
};
const gmc = new ConfigLzString({
	'id': 'PttChromeAddOnConfig', // The id used for this instance of GM_config
	'title': 'PttChrome Add-on Settings', // Panel Title
	'fields': fields,
	'events': { // Callback functions object
		'open': function() {
			this.frame.setAttribute('style', "border: 1px solid #AAA;color: #999;background-color: #111; width: 23em; height: 35em; position: fixed; top: 2.5em; right: 0.5em; z-index: 900;");

			configStatus = true;
		},
		'close': () => { configStatus = false;},
	},
	'css': `#PttChromeAddOnConfig * { color: #999 !important;background-color: #111 !important; } body#PttChromeAddOnConfig { background-color: #111}`,
	'src':`https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.js`,
});
const gmcDebug = new ConfigLzString({
	'id': 'PttChromeAddOnConfigDebug', // The id used for this instance of GM_config
	'title': 'PttChrome Add-on DeBugLog', // Panel Title
	'fields': { // Fields object
		'showLog': {
			'label': 'Show log of debug text',
			'type': 'textarea',
			'default': ''
		},
	},
	'events': { // Callback functions object
		'open': () => {
			gmcDebug.frame.setAttribute('style', "border: 1px solid #AAA;color: #999;background-color: #111; width: 26em; height: 35em; position: fixed; top: 2.5em; left: 0.5em; z-index: 900;");
		},
	},
	'css': `#PttChromeAddOnConfigDebug * { color: #999 !important;background-color: #111 !important; } body#PttChromeAddOnConfigDebug { background-color: #111} #PttChromeAddOnConfigDebug_field_showLog { width:26em; height: 24em;}`
});
const addBlackStyle = (blackList) => {
	if (blackList && blackList.trim().length === 0) return;
	blackList = blackList.replace(/\n$/g, '').replace(/\n\n/g, '\n');

	let opacityStyle = blackList.replace(/([^\n]+)/g, '.blu_$1').replace(/\n/g, ',');
	addCssLink('opacityStyle', `${opacityStyle} {opacity: 0.2;}`);

	if (gmc.get('isHideViewImg')) {
		let imgStyle = blackList.replace(/([^\n]+)/g, '.blu_$1 + div > .easyReadingImg').replace(/\n/g, ',');
		addCssLink('imgStyle', `${imgStyle} {display: none;}`);
	}
	if (gmc.get('isHideViewVideo')) {
		let videoStyle = blackList.replace(/([^\n]+)/g, '.blu_$1 + div > .easyReadingVideo').replace(/\n/g, ',');
		addCssLink('videoStyle', `${videoStyle} {display: none;}`);
	}
}
const gmcBlack = new ConfigLzString({
	'id': 'PttChromeAddOnConfigBlack', // The id used for this instance of GM_config
	'title': 'PttChrome Add-on Black List', // Panel Title
	'fields': { // Fields object
		'blackList': {
			'label': 'Black List',
			'type': 'textarea',
			'default': ''
		},
	},
	'events': { // Callback functions object
		'init': function() {
			addBlackStyle(this.get('blackList'));
		},
		'open': function() {
			gmcBlack.frame.setAttribute('style', "border: 1px solid #AAA;color: #999;background-color: #111; width: 26em; height: 35em; position: fixed; top: 2.5em; left: 0.5em; z-index: 900;");
			configBlackStatus = true;
		},
		'save': function() {
			addBlackStyle(this.get('blackList'));
		},
		'close': function() { configBlackStatus = false;},
	},
	'css': `#PttChromeAddOnConfigBlack * { color: #999 !important;background-color: #111 !important; } body#PttChromeAddOnConfigBlack { background-color: #111} #PttChromeAddOnConfigBlack_field_blackList { width:26em; height: 24em;}`
});
const HOST = 'https://osk2.me:9977',
	  ipValidation = /(\d{1,3}\.){3}\d{1,3}/,
	  timerArray = [];

let timestamp = Math.floor(Date.now() / 1000);
const execInterval = () => {
	if (timerArray.length === 0) {
		timerArray.push(setInterval(excute, 1000));
	}
}
const stopInterval = () => {
	while (timerArray.length > 0) {
		clearInterval(timerArray .shift());
	}
}
let currentNum, currentPage, pageData = {};
const excute = async () => {
	//console.log("do excute");
	const css = (elements, styles) => {
		elements = elements.length ? elements : [elements];
		elements.forEach(element => {
			for (var property in styles) {
				element.style[property] = styles[property];
			}
		});
	}
	const findAll = (elements, selectors) => {
		let rtnElements = [];
		elements = elements.length ? elements : [elements];
		elements.forEach(element => rtnElements.push.apply(rtnElements, element.querySelectorAll(selectors)));
		return rtnElements;
	}
	const innerHTMLAll = (elements) => {
		let rtn = "";
		elements = elements.length ? elements : [elements];
		elements.forEach(element => {element.innerHTML ? rtn += element.innerHTML : ""});
		return rtn;
	}
	const show = (elements, specifiedDisplay = 'block') => {
		elements = elements.length ? elements : [elements];
		elements.forEach(element => {
			if (!element.style) return;
			element.style.display = specifiedDisplay;
		});
	}
	const hide = (elements) => {
		elements = elements.length ? elements : [elements];
		elements.forEach(element => {
			if (!element.style) return;
			element.style.display = 'none';
		});
	}
	const generateImageHTML = (ip, flag) => {
		if (!flag) return;
		flag.countryCode = flag.countryCode ? flag.countryCode : "unknown";
		const ignoreCountrys = gmc.get('whenShowFlagsIgnoreSpecificCountrys').match(new RegExp(flag.countryCode, 'i'));
		if (ignoreCountrys && ignoreCountrys.length > 0) return;
		const imageTitile = `${flag.locationName || 'N/A'}<br><a href='https://www.google.com/search?q=${ip}' target='_blank'>${ip}</a>`;

		return `<div data-flag title="${imageTitile}" class="flag-${flag.countryCode}" style="background-repeat:no-repeat;background-position:left;float:right;height:0.8em;width:0.8em;cursor:pointer !important;"></div>`;
	}
	const chkBlackSpan = (isListPage) => {
		if (isTerm && isListPage) {
			let allNode = document.querySelectorAll('span[data-type="bbsline"]');
			if (allNode && allNode.length > 0) {
				allNode = [].filter.call(allNode, (element, index) => {
					if (element.dataset.type === 'bbsline') { //for term.ptt.cc
						let user = element.querySelectorAll('span[class^="q7"]')
						if (user && user.length > 1 && user[1].innerHTML.length > 10) {
							user = user[1].innerHTML.replace(/ +/g, ' ').split(' ');
							user = user && user.length > 3 ? user[1].toLowerCase() : "";
							user && user.match(/^[^\d][^ ]+$/) ? element.classList.add(`blu_${user}`) : null;
						}
						user = element.querySelector('span[class^="q15"]')
						if (user && user.innerHTML.trim().match(/^[^\d][^ ]+$/)) {
							user = user ? user.innerText.trim().toLowerCase() : "";
							user ? element.classList.add(`blu_${user}`) : null;
						}
					}
				});
			}
		}
		let blackSpan = document.querySelectorAll('span[style="opacity:0.2"]');
		let whenHideAllShowInfoCss = document.querySelector('#whenHideAllShowInfo');
		if (blackSpan.length > 0) {
			writeDebugLog(`黑名單筆數：${blackSpan.length}`);
			if (whenHideAllShowInfoCss) whenHideAllShowInfoCss.remove();
			gmc.get('isHideViewImg') && hide(findAll(blackSpan, 'img:not([style*="display: none"])'));
			gmc.get('isHideViewVideo') && hide(findAll(blackSpan, '.easyReadingVideo:not([style*="display: none"])'));
			if (gmc.get('isHideAll')) {
				if (gmc.get('whenHideAllShowInfo').length > 0 || isListPage) {
					addCssLink('whenHideAllShowInfo', `
span[type="bbsrow"][style="opacity:0.2"] {opacity:1 !important;visibility: hidden;}
span[type="bbsrow"][style="opacity:0.2"]:before {
visibility: visible;color: ${gmc.get('whenHideAllShowInfoColor')};
content: '                 -            ${gmc.get('whenHideAllShowInfo')}';
}`);
				} else {
					hide(blackSpan);
				}
			} else {
				!isListPage && gmc.get('isReduceHeight') && css(blackSpan, {
					'height': gmc.get('reduceHeight') + 'em',
					'font-size': (gmc.get('reduceHeight')/2) + 'em',
					'line-height': gmc.get('reduceHeight') + 'em'
				});
				gmc.get('isReduceOpacity') && css(blackSpan, {'opacity': gmc.get('reduceOpacity')});
			}
		}
	}
	const findPrevious = (element, selectors) => {
		if (!element) return;
		if (element.dataset.type === 'bbsline') { //for term.ptt.cc
			element = element.closest('span[type="bbsrow"]');
			element = element.parentElement;
		}
		element = element.previousElementSibling;
		if (!element) return;
		let rtnElement = element.querySelectorAll(selectors)
		if (rtnElement && rtnElement.length > 0) {
			return rtnElement;
		} else {
			return findPrevious(element, selectors);
		}
	}
	const firstEl = (element) => {
		if (!element) return;
		if (element.dataset.type === 'bbsline') { //for term.ptt.cc
			element = element.closest('span[type="bbsrow"]');
			element = element.parentElement;
		}
		element = element.nextElementSibling;
		if (!element) return;
		if (element.querySelector('span[data-type="bbsline"]')) { //for term.ptt.cc
			return element.querySelector('span[data-type="bbsline"]');
		} else if (element.classList.toString().match(/blu_[^ ]+/)) {
			return element;
		} else {
			return firstEl(element);
		}
	}
	const queryPage = (node) => {
		let rtnPage;
		if (node && node.length > 0) {
			rtnPage = node[node.length -1].querySelector('span');
			if (!rtnPage) return;
			rtnPage = rtnPage.innerText.match(/瀏覽[^\d]+(\d+)\/(\d+)/);
			if (rtnPage && rtnPage.length === 3) {
				rtnPage = rtnPage[1];
				writeDebugLog(`警告：未啟用文章好讀模式，結果會不正確`);
				return rtnPage;
			}
		}
	}
	const currentTS = Math.floor(Date.now() / 1000);

	if ((currentTS - timestamp) > 2) {
		stopInterval();
	}

	const checkNode = document.querySelector('span.q2');
	if (!checkNode || (checkNode && checkNode.innerHTML.length <= 10)) {
		chkBlackSpan(true);
		return;
	} else {
		chkBlackSpan();
	}

	let firstNode, isHasFirst, allNode = document.querySelectorAll('span[type="bbsrow"]'), bbsline = document.querySelectorAll('span[data-type="bbsline"]');
	bbsline && bbsline.length > 0 ? allNode = bbsline : null;

	currentPage = queryPage(allNode);

	let count = {author:0, comment:0, authorCnt:0, commentCnt:0, authorIp:0, commentIp:0, completed: 0};
	allNode = [].filter.call(allNode, (element, index) => {
		if (element.dataset.type === 'bbsline') { //for term.ptt.cc
			let user = element.querySelector('span[class^="q11"]'); //ex.1.<span class="q11 b0">USERNAME</span> 2.<span class="q11 b0">USERNAME   </span>
			let name = user ? user.innerHTML.match(/^([^ ]+)[ ]*$/) : "";
			name && name.length > 0 ? element.classList.add(`blu_${name[1]}`) : null;
		}
		let node = element.innerHTML.match('※ 文章網址:');
		if (node && node.length > 0) {
			isHasFirst = true;
			firstNode = firstEl(element);
			if (firstNode && !firstNode.innerHTML.match(/data-floor/)) {
				pageData = [];
				currentNum = -1;
			}
		}
		if (innerHTMLAll(findAll(element, "span.q2")).match(ipValidation)) {
			count.author++;
			return true;
		}
		if (element.classList && element.classList.toString().match(/blu_[^ ]+/)) {
			count.comment++;
			return true;
		}
	});
	writeDebugLog(`偵測 作者筆數：${count.author}、留言筆數：${count.comment}`);
	let allIpList = allNode.map(c => {
		const ip = c.innerHTML.match(ipValidation);
		if (ip && !flagMap[ip[0]]) return ip[0];
	});
	allIpList = new Set(allIpList);
	allIpList.delete(undefined);
	allIpList.delete(null);
	allIpList = Array.from(allIpList);
	if (allIpList && allIpList.length > 0 && allIpList[0]) {
		try {
			const flagsResponse = await axios.post(`${HOST}/ip`, { ip: allIpList}, {headers: {'Content-Type': 'application/json',}}),
				  flags = flagsResponse.data;
			if (flags && flags.length > 0) {
				flags.forEach((flag, index) => {
					const ip = allIpList[index];
					if (!flag) {
						flag = [];
					} else if (flag.imagePath) {
						flag.countryCode = flag.imagePath.toLowerCase().replace('assets/','').replace('.png','');;
					}
					flag.ip = ip;
					flagMap[ip] = flag;
				});
			}
		} catch (ex) {
			writeDebugLog(`查詢IP失敗...${ex}`);
			console.log(ex);
		}
	}

	allNode.some((comment, index) => {
		const test = comment.innerHTML.match(/^[ \t]*\d+/);
		if (test && test.length > 0) return true;

		if (gmc.get('isAddFloorNum') && comment.classList && comment.classList.toString().match(/blu_[^ ]+/) && !comment.innerHTML.match(/data-floor/)) {
			let upstairs = null;
			if (currentNum > 0) {
				upstairs = findPrevious(allNode[index], 'div[data-floor]');
				if (upstairs && upstairs.length > 0) {
					let upstairsNum = Number(upstairs[0].innerHTML);
					if (upstairsNum) {
						currentNum = Number(upstairs[0].innerHTML) + 1;
					}
				} else if (currentPage) { //非好讀模式才有頁數
					if (!pageData[currentPage]) pageData[currentPage] = currentNum;
					currentNum = pageData[currentPage];
				} else {
					currentNum = 1;
				}
			} else if (isHasFirst && comment === firstNode) {
				currentNum = 1;
			} else if (!isHasFirst) {
				currentNum = 1;
			}
			if (currentNum > 0) {
				count.commentCnt++
				const divCnt = `<div data-floor style="float:left;margin-left: 2.2%;height: 0em;width: 1.5em;font-size: 0.4em;font-weight:bold;text-align: right;">${currentNum}</div>`;
				comment.innerHTML = divCnt + comment.innerHTML.trim();
			} else {
				const divCnt = `<div data-floor></div>`;
				comment.innerHTML = divCnt + comment.innerHTML.trim();
			}
		} else if ((gmc.get('isAddFloorNum') && comment.classList && !comment.querySelector('.q2') && !comment.classList.toString().match(/blu_[^ ]+/))) {
			writeDebugLog(`警告 推文資料格式錯誤：${comment.innerHTML}`);
		} else if (comment.innerHTML.match(/data-floor/)) {
			count.completed++;
		}

		if (!gmc.get('isShowFlags')) return;

		const ip = comment.innerHTML.match(ipValidation);

		if (!ip) return;
		if (comment.innerHTML.match(/data-flag/)) return;
		const imageHTML = generateImageHTML(ip[0], flagMap[ip[0]]);
		if (!imageHTML) return;

		const authorNode = comment.querySelector("span.q2");
		if (authorNode) {
			count.authorIp++;
			authorNode.innerHTML = imageHTML + authorNode.innerHTML.trim()
		} else {
			count.commentIp++;
			comment.innerHTML = imageHTML + comment.innerHTML.trim();
		}
		timestamp = Math.floor(Date.now() / 1000);
	});

	if (count.comment !== count.completed) {
		writeDebugLog(`寫入 作者IP數：${count.authorIp}、留言樓層：${count.commentCnt}、留言IP數：${count.commentIp}`);
	}

	tippy('[data-flag]', {
		arrow: true,
		size: 'large',
		placement: 'left',
		interactive: true
	});
}
const chkBeforeunloadEvents = () => {
	if (gmc.get('isDisableClosePrompt')) {
		window.addEventListener("beforeunload", function f() {
			window.removeEventListener("beforeunload", f, true);
		}, true);
		unsafeWindow.addEventListener("beforeunload", function beforeunload() {
			unsafeWindow.removeEventListener("beforeunload", beforeunload, true);
		}, true);
 		if (window.getEventListeners) {
			window.getEventListeners(window).beforeunload.forEach((e) => {
				window.removeEventListener('beforeunload', e.listener, true);
			})
		} else if (unsafeWindow.getEventListeners) {
			unsafeWindow.getEventListeners(unsafeWindow).beforeunload.forEach((e) => {
				unsafeWindow.removeEventListener('beforeunload', e.listener, true);
			})
		} else {
			setTimeout(chkBeforeunloadEvents, 2000);
		}
	}
}

const CreateMutationObserver = () => {
	const container = document.querySelector('#mainContainer');
	if (!container) {
		setTimeout(CreateMutationObserver, 2000);
		return;
	}

	if (isTerm) {
		autoLogin(container);
		const reactAlert = document.querySelector('#reactAlert');
		const observerTerm = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (reactAlert.querySelector('p button')) {
					reactAlert.querySelector('p button').addEventListener("click", function(event) {
						autoLogin(container);
					});
				}
			});
		})
		observerTerm.observe(reactAlert, {childList: true,});
	}
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => execInterval());
	})
	observer.observe(container, {childList: true,});

	//chkBeforeunloadEvents();
}

const writeDebugLog = (log) => {
	if (gmc.get('isShowDebug')) {
		queryConfigEl('#PttChromeAddOnConfigDebug', 'textarea', el => {
			el.value = `${log}\n` + el.value;
		});
	}
}
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
const autoLogin = async (container) => {
	const checkAndWait = async (container, keyword) => {
		if (container && container.innerText.match(keyword)) {
			await sleep(1000);
			return checkAndWait(container, keyword);
		}
	}
	const pasteInputArea = async (str) => {
		let inputArea = document.querySelector('#t');
		if (!inputArea) {
			await sleep(1000);
			return pasteInputArea(str);
		}

		const pasteE = new CustomEvent('paste');
		pasteE.clipboardData = { getData: () => str };
		inputArea.dispatchEvent(pasteE);
	}
	const autoSkip = async (node, regexp, pasteKey, isReCheck) => {
		if (node.innerText.match(regexp)) {
			await pasteInputArea(pasteKey);
			await checkAndWait(node, regexp);
		} else if (isReCheck) {
			await sleep(1000);
			return autoSkip(node, regexp, pasteKey, isReCheck)
		}
	}
	if (gmc.get('isAutoLogin')) {
		if (container.innerText.trim().length < 10) {
			await sleep(1000);
			return autoLogin(container);
		}
		const list = [];
		if (gmc.get('autoUser') && gmc.get('autoPassWord')) {
			list.push({regexp: /請輸入代號，或以/, pasteKey: `${gmc.get('autoUser')}\n${gmc.get('autoPassWord')}\n`, isReCheck: true});
		}

		if (gmc.get('isEnableDeleteDupLogin') !== "N/A") {
			list.push({regexp: /您有其它連線已登入此帳號/, pasteKey: `${gmc.get('isEnableDeleteDupLogin')}\n`, isReCheck: true});
		}

		if (gmc.get('isAutoSkipInfo1')) {
			list.push(
				{regexp: /正在更新與同步線上使用者及好友名單，系統負荷量大時會需時較久.../, pasteKey: '\n'},
				{regexp: /歡迎您再度拜訪，上次您是從/, pasteKey: '\n'},
				{regexp: /─+名次─+範本─+次數/, pasteKey: 'q'},
				{regexp: /發表次數排行榜/, pasteKey: 'q'},
				{regexp: /大富翁 排行榜/, pasteKey: 'q'},
				{regexp: /本日十大熱門話題/, pasteKey: 'q'},
				{regexp: /本週五十大熱門話題/, pasteKey: 'q'},
				{regexp: /每小時上站人次統計/, pasteKey: 'qq'},
				{regexp: /程式開始啟用/, pasteKey: 'q'},
				{regexp: /排名 +看 *板 +目錄數/, pasteKey: 'q'},
			);

		}
		if (gmc.get('isAutoToFavorite')) {
			list.push({regexp: /【主功能表】 +批踢踢實業坊/, pasteKey: `f\n`, isReCheck: true});
		}
		let isMatch = false;
		for (let idx=0;idx < list.length; idx++) {
			if (container.innerText.match(list[idx].regexp)) {
				isMatch = true;
				await autoSkip(container, list[idx].regexp, list[idx].pasteKey, list[idx].isReCheck);
			}
			if (idx == list.length-1 && !isMatch) {
				idx = 0;
				await sleep(1000);
			}
		}
	}
}

try {
	window.addEventListener("load", function(event) {
		CreateMutationObserver();
	});
} catch (ex) {
	writeDebugLog(`出現錯誤...${ex}`);
	console.error(ex);
}

const _button = document.createElement("div");
_button.innerHTML = 'Settings';
_button.onclick = event => {
	event.preventDefault();
	event.stopPropagation();
	if (!configStatus) {
		configStatus = true;
		if (gmc) gmc.open();
		if (gmc.get('isShowDebug') && gmcDebug) gmcDebug.open();
	} else if (configStatus) {
		configStatus = false;
		if (gmc.isOpen) gmc.close();
		if (gmcDebug.isOpen) gmcDebug.close();
		if (gmcBlack.isOpen) gmcBlack.close();
	}
}
_button.style = "border: 1px solid #AAA;color: #999;background-color: #111;position: fixed; top: 0.5em; right: 0.5em; z-index: 900;cursor:pointer !important;"

document.body.appendChild(_button)

const el = document.createElement('link');
el.rel = 'stylesheet';
el.type = 'text/css';
el.href = "https://cdnjs.cloudflare.com/ajax/libs/tippy.js/2.5.4/tippy.css";
document.head.appendChild(el);
