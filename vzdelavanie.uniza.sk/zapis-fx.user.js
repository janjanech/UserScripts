// ==UserScript==
// @name         Zapis FX vzdelavanie
// @namespace    https://vzdelavanie.uniza.sk/
// @version      0.1
// @description  skript na zapisanie FX vsetkym studentom, ktori nemaju ziadnu znamku
// @author       Jan Janech
// @match        https://vzdelavanie.uniza.sk/vzdelavanie/znpredmet.php?*
// @icon         https://vzdelavanie.uniza.sk/favicon.ico
// @grant        none
// @require      https://raw.githubusercontent.com/janjanech/UserScripts/af3d892864af53111fd59b98762f712e1d206871/vzdelavanie.uniza.sk/_lib.js
// ==/UserScript==

(function() {
    'use strict';

    jj_ext.create_toolbutton(
        "Zapis FX",
        function() {
            let today = new Date();
            let datum = today.getDate() + '.'+ (today.getMonth()+1) + '.' + today.getFullYear();
            let pocet_zapisanych = 0;

            for (let row of document.querySelectorAll('#znamkovanie tr:not(.hdr)')) {
                let znamka_select = row.cells[5].querySelector('select');
                let datum_input = row.cells[5].querySelector('input');
                if (!znamka_select.value || znamka_select.value === '0') {
                    datum_input.value = datum;
                    znamka_select.value = 'FX';

                    pocet_zapisanych++;
                }
            }

            alert(`Zapisanych ${pocet_zapisanych} FX`);
        }
    );
})();
