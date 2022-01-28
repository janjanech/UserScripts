// ==UserScript==
// @name         Import znamok z JSON na vzdelavanie
// @namespace    https://vzdelavanie.uniza.sk/
// @version      0.1
// @description  skript na pridanie moznosti importu znamok z JSON do systemu vzdeavanie
// @author       Jan Janech
// @match        https://vzdelavanie.uniza.sk/vzdelavanie/znpredmet.php?*
// @icon         https://vzdelavanie.uniza.sk/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let control_table = document.querySelector('#id-tabulka-znamky > tbody > tr > td > table')
    let new_row = control_table.insertRow(2)
    let control_cell = new_row.insertCell(0)

    control_cell.setAttribute("align", "center");
    control_cell.setAttribute("colspan", "4");

    let show_button = document.createElement('input')
    show_button.setAttribute("type", 'button')
    show_button.setAttribute("class", 'tien')
    show_button.setAttribute("value", 'Import znamok z jsonu')
    show_button.addEventListener('click', function() {
        show_button.disabled = true;

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

        let import_button = document.createElement('input');
        import_button.setAttribute("type", 'button');
        import_button.setAttribute("class", 'tien');
        import_button.setAttribute("value", 'Import');

        control_cell.appendChild(document.createElement('br'));
        control_cell.appendChild(znamky_json_label);
        control_cell.appendChild(document.createElement('br'));
        control_cell.appendChild(znamky_json);
        control_cell.appendChild(document.createElement('br'));
        control_cell.appendChild(datum_text_label);
        control_cell.appendChild(document.createElement('br'));
        control_cell.appendChild(datum_text);
        control_cell.appendChild(document.createElement('br'));
        control_cell.appendChild(import_button);

        import_button.addEventListener('click', function() {
            let znamky = JSON.parse(znamky_json.value);

            let datum = datum_text.value;

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
        });
    });
    control_cell.appendChild(show_button)
})();
