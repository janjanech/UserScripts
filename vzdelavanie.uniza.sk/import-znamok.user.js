// ==UserScript==
// @name         Import znamok z JSON na vzdelavanie
// @namespace    https://vzdelavanie.uniza.sk/
// @version      0.2
// @description  skript na pridanie moznosti importu znamok z JSON do systemu vzdeavanie
// @author       Jan Janech
// @match        https://vzdelavanie.uniza.sk/vzdelavanie/znpredmet.php?*
// @icon         https://vzdelavanie.uniza.sk/favicon.ico
// @grant        none
// @require      https://raw.githubusercontent.com/janjanech/UserScripts/master/vzdelavanie.uniza.sk/_lib.js
// ==/UserScript==

(function() {
    'use strict';

    jj_ext.create_toolbutton("Import znamok z jsonu", function() {
        jj_ext.create_dialog(
            function(dialog) {
                let znamky_json_label = document.createElement('label');
                znamky_json_label.setAttribute("for", 'znamky_json');
                znamky_json_label.innerHTML = '<b>JSON znamky:</b>';

                let znamky_json = document.createElement('textarea');
                znamky_json.setAttribute("id", 'znamky_json');
                znamky_json.setAttribute("rows", '25');
                znamky_json.setAttribute("style", 'width: 100%');
                znamky_json.setAttribute("class", 'tform');

                let datum_text_label = document.createElement('label');
                datum_text_label.setAttribute("for", 'datum_text');
                datum_text_label.innerHTML = '<b>Datum skusky:</b>';

                let today = new Date();
                let datum_text = document.createElement('input');
                datum_text.setAttribute("class", 'tform');
                datum_text.value = today.getDate() + '.'+ (today.getMonth()+1) + '.' + today.getFullYear();

                dialog.appendChild(document.createElement('br'));
                dialog.appendChild(znamky_json_label);
                dialog.appendChild(document.createElement('br'));
                dialog.appendChild(znamky_json);
                dialog.appendChild(document.createElement('br'));
                dialog.appendChild(datum_text_label);
                dialog.appendChild(document.createElement('br'));
                dialog.appendChild(datum_text);

                return {
                    'znamky': znamky_json,
                    'datum': datum_text
                };
            }, function(state) {
                let znamky = JSON.parse(state.znamky.value);

                let datum = state.datum.value;

                let znamky_map = {};

                let pocet_importovanych = 0;

                for (let item of znamky) {
                    let personal_no = item[0];
                    if (znamky_map.hasOwnProperty(personal_no)) {
                        console.log(`Znamka pre ${personal_no} zadana 2x`);
                    }
                    znamky_map[personal_no] = item[1];
                }

                for (let row of document.querySelectorAll('#znamkovanie tr:not(.hdr)')) {
                    let personal_no = row.cells[2].innerText;
                    let name = row.cells[1].innerText;
                    if (znamky_map.hasOwnProperty(personal_no)) {
                        let znamka = znamky_map[personal_no].toUpperCase();
                        delete znamky_map[personal_no]

                        let found_col = -1;
                        for (let col = 5; col <= 7; col++) {
                            let old_znamka = row.cells[col].querySelector('select').value;
                            if (!old_znamka || old_znamka === '0') {
                                found_col = col;
                                break;
                            } else if (old_znamka !== 'FX') {
                                break;
                            }
                        }

                        if (found_col === -1) {
                            console.log(`Nemozem zmenit znamku pre ${name}`);
                        } else {
                            let znamka_select = row.cells[found_col].querySelector('select');
                            let datum_input = row.cells[found_col].querySelector('input');

                            datum_input.value = datum;
                            znamka_select.value = znamka;

                            pocet_importovanych++;
                        }
                    }
                }

                for (let personal_no in znamky_map) {
                    if (znamky_map.hasOwnProperty(personal_no)) {
                        console.log(`Nepodarilo sa najst studenta s osobnym cislom ${personal_no}`);
                    }
                }

                alert(`Importovanych ${pocet_importovanych} znamok`);
            }
        );
    });
})();
