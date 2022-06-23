// ==UserScript==
// @name         block Adblock blocker
// @namespace    sme.sk
// @version      0.1
// @author       Jan Janech
// @match        https://*sme.sk/*
// @match        https://*.sme.sk/*
// @icon         https://komentare.sme.sk/favicon.ico
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(
        `
body {
    overflow: auto !important;
}

body div.fc-ab-root {
    display: none !important;
}`
    );
})();
