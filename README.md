# PttChrome and <span>term.ptt.cc</span> Enhanced Add-on
> 將 [PttChrome Long Change](https://greasyfork.org/zh-TW/scripts/370274-pttchrome-long-change) 融入 [PttChrome+term.ptt.cc Add-on](https://greasyfork.org/zh-TW/scripts/372391-pttchrome-term-ptt-cc-add-on) 之中，以實作出有效率地計算推、噓、箭頭、總樓數之 PC 版腳本，它同時擁有兩支腳本的功能，而且可在 [PttChrome](https://iamchucky.github.io/PttChrome/) 或 [term.ptt.cc](https://term.ptt.cc) 執行。

![](https://img.shields.io/github/languages/top/alan23273850/PttChrome-and-term.ptt.cc-Enhanced-Add-on.svg) ![](https://img.shields.io/badge/browsers-chrome%20|%20firefox-lightgrey.svg) ![](https://img.shields.io/github/license/alan23273850/PttChrome-and-term.ptt.cc-Enhanced-Add-on.svg)

* 類別：Side Project
* 時程：2019 年 1 月 ~ 2019 年 3 月，後續持續維護
* 動機與背景：<br>某些瀏覽 PTT 的知名手機應用程式如 [PiTT](https://www.facebook.com/Kimieno.Pitt/) 有支援計算推文樓數的功能 (包含推、噓、箭頭)，除了單純的統計目的之外，在發錢文底下搶先推文在特定樓層以賺取 P 幣更是實用；在此腳本完工的大約半年前就有大大 [Lalong](https://greasyfork.org/zh-TW/users/154761-lalong) 在 [Greasy Fork](https://greasyfork.org/zh-TW) 釋出能計算推、噓、箭頭、總樓數的[想法 (PttChrome Long Change)](https://greasyfork.org/zh-TW/scripts/370274-pttchrome-long-change)，其功能新穎、實用；而該想法發布之後的兩個月亦有另一位大大 [avan](https://greasyfork.org/zh-TW/users/214281-avan) 也在同個網站釋出一支僅計算總樓數但有許多額外功能的 [PttChrome+term.ptt.cc Add-on](https://greasyfork.org/zh-TW/scripts/372391-pttchrome-term-ptt-cc-add-on)；既然兩支腳本都各有自己的特色，那麼我們何不將它們集大成呢？於是我決定將前者的功能融入後者的程式碼中，形成現在的成品 [PttChrome and term.ptt.cc Enhanced Add-on](https://greasyfork.org/zh-TW/scripts/377781-pttchrome-and-term-ptt-cc-enhanced-add-on)。

---
## 腳本安裝
1. 在瀏覽器上安裝 [Tampermonkey](https://tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/get-it/) 等適用的腳本管理器。
2. 到 [PttChrome and term.ptt.cc Enhanced Add-on](https://greasyfork.org/zh-TW/scripts/377781-pttchrome-and-term-ptt-cc-enhanced-add-on) 點擊「安裝腳本」，等待腳本安裝至管理器中。
3. 在**新分頁**開啟 [PttChrome](https://iamchucky.github.io/PttChrome/) 或 [term.ptt.cc](https://term.ptt.cc) 即可開始使用，不過**在啟動功能之前務必記得勾選以下設定** (**HEN 重要**)...

---
## PttChrome／<span>term.ptt.cc</span> 使用前的設定 [ HEN 重要！！！]
1. **「文章好讀模式」必須啟用**
    * 啟用後推文樓層計算才會正確<br><kbd><img src="https://i.imgur.com/OBYX32R.png" style="border:1px solid black; display:block; margin-left:auto; margin-right:auto;"></kbd><br>
    * 無論您是使用 Firefox，或是使用從 Chromium 衍生之瀏覽器如 Cent、Kinza 等，請務必再次確認是否已開啟好讀模式，似乎很容易發生 PttChrome 或 <span>term.ptt.cc</span> 之中僅一者有開、而另外一者忘記開啟之情況，讓使用者誤以為腳本失效，這點必須留意。
    <br>
2. **「啟用使用者黑名單功能」必須啟用** (僅 PttChrome 需設定)
    * 啟用後腳本才能偵測到全部留言<br><kbd><img src="https://i.imgur.com/8vSRlqG.png" style="border:1px solid black; display:block; margin-left:auto; margin-right:auto;"></kbd>

---
## 腳本 PttChrome Long Change 之功能展示
1. 計算 **推 / 噓 / 箭頭 / 總** 樓數<br><p style="text-align:center">![](https://i.imgur.com/mx2R1I6.png)</p>
4. 原 PO 的 ID 高亮<br><p style="text-align:center">![](https://i.imgur.com/ic3ZEbw.png)</p>
5. 推文背景高亮<br><p style="text-align:center">![](https://i.imgur.com/FfhXlwq.png)</p>
6. 搜尋推文者文章<br><p style="text-align:center">![](https://i.imgur.com/CcuTXzK.png)</p>

---
## 衍生功能說明
1. 滑鼠瀏覽友善模式：限縮推文高亮的點擊範圍至使用者 id，避免與滑鼠瀏覽的運用空間衝突太多，此時必須點擊 id 至少 0.15 秒才會出現搜尋選單，否則僅一般推文高亮。本功能須至畫面右上角的 Settings 選單內勾選。
2. 搜尋作者文章<br><p style="text-align:center">![](https://i.imgur.com/zvHtNdh.png)</p>

---
## 前人種樹
1. [PttChrome Long Change](https://greasyfork.org/zh-TW/scripts/370274-pttchrome-long-change) (功能發想來源)
2. [PttChrome+term.ptt.cc Add-on](https://greasyfork.org/zh-TW/scripts/372391-pttchrome-term-ptt-cc-add-on) (程式碼基底來源)

ps. 兩腳本作者皆已知會且同意本專案之進行！

---
## 其他事項
* 理論上原腳本功能均須正常運作，若有出現 bug 那麼使用原腳本時也應該有相同 bug，如有例外請到 [GitHub Repo](https://github.com/alan23273850/PttChrome-and-term.ptt.cc-Enhanced-Add-on) 開 issue。
* 或者鄉民們也可以 fork 出新專案繼續開發其他功能、修復 bug。
