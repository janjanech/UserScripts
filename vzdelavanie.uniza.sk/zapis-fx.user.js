// ==UserScript==
// @name         Zapis FX vzdelavanie
// @namespace    https://vzdelavanie.uniza.sk/
// @version      0.2
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
            let pocet_studentov = 0;

            for (let row of document.querySelectorAll('#znamkovanie tr:not(.hdr)')) {
                if (row.querySelector("select") === null) {
                    continue;
                }
                
                let zapisany = false;
                for (let col = 5; col <= 7; col++) {
                    let old_znamka = row.cells[col].querySelector('select').value;
                    if (!old_znamka || old_znamka === '0') {
                        let znamka_select = row.cells[col].querySelector('select');
                        let datum_input = row.cells[col].querySelector('input');
                        datum_input.value = datum;
                        znamka_select.value = 'FX';
                        pocet_zapisanych++;
                        zapisany = true;
                    } else if (old_znamka !== 'FX') {
                        break;
                    }
                }
                if (zapisany) {
                    pocet_studentov++;
                }
            }

            alert(`Zapisanych ${pocet_zapisanych} FX pre ${pocet_studentov} studentov`);
        }
    );
})();
