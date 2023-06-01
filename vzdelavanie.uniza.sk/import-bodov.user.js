// ==UserScript==
// @name         Import bodov z JSON na vzdelavanie
// @namespace    https://vzdelavanie.uniza.sk/
// @version      0.1
// @description  skript na pridanie moznosti importu bodov z JSON do systemu vzdelavanie
// @author       Jan Janech
// @match        https://vzdelavanie.uniza.sk/vzdelavanie/znpredmet.php?*
// @icon         https://vzdelavanie.uniza.sk/favicon.ico
// @grant        none
// @require      https://raw.githubusercontent.com/janjanech/UserScripts/af3d892864af53111fd59b98762f712e1d206871/vzdelavanie.uniza.sk/_lib.js
// ==/UserScript==

(function() {
    'use strict';

    jj_ext.create_toolbutton("Import bodov z jsonu", function() {
        jj_ext.create_dialog(
            function(dialog) {
                let body_json_label = document.createElement('label');
                body_json_label.setAttribute("for", 'body_json');
                body_json_label.innerHTML = '<b>JSON body:</b>';

                let body_json = document.createElement('textarea');
                body_json.setAttribute("id", 'body_json');
                body_json.setAttribute("rows", '25');
                body_json.setAttribute("style", 'width: 100%');
                body_json.setAttribute("class", 'tform');

                dialog.appendChild(document.createElement('br'));
                dialog.appendChild(body_json_label);
                dialog.appendChild(document.createElement('br'));
                dialog.appendChild(body_json);
                dialog.appendChild(document.createElement('br'));

                return {
                    'body': body_json
                };
            }, function(state) {
                let body = JSON.parse(state.body.value);

                let body_map = {};

                let pocet_importovanych = 0;

                for (let item of body) {
                    let personal_no = item[0];
                    if (body_map.hasOwnProperty(personal_no)) {
                        console.log(`Body pre ${personal_no} zadane 2x`);
                    }
                    body_map[personal_no] = item[1];
                }

                for (let row of document.querySelectorAll('#znamkovanie tr:not(.hdr)')) {
                    let personal_no = row.cells[2].innerText;
                    let name = row.cells[1].innerText;
                    if (body_map.hasOwnProperty(personal_no)) {
                        let body = body_map[personal_no];
                        delete body_map[personal_no]
                        
                        let body_input = row.cells[3].querySelector('input');

                        body_input.value = body;

                        pocet_importovanych++;
                    }
                }

                for (let personal_no in body_map) {
                    if (body_map.hasOwnProperty(personal_no)) {
                        console.log(`Nepodarilo sa najst studenta s osobnym cislom ${personal_no}`);
                    }
                }

                alert(`Importovanych ${pocet_importovanych} studentov`);
            }
        );
    });
})();
