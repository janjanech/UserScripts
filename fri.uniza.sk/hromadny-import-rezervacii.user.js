// ==UserScript==
// @name         Import rezervacii terminov
// @namespace    https://fri.uniza.sk/
// @version      0.1
// @description  Importuje rezervacie obsadenia ucebne z json formatu
// @author       Jan Janech
// @match        https://www.fri.uniza.sk/schoolrooms/admin/reservations/add
// @icon         https://www.fri.uniza.sk/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const import_json_button_html = `
    <input type="button" value="Import from json" class="btn btn-dark" id="jj-show-import-dialog" />
    `;

    const import_dialog_html = `
    <dialog id="jj-import-dialog" style="margin: auto; padding: 10px; width: 300px;">
        <form method="dialog">
            <textarea id="jj-json" class="form-control" rows="10"></textarea>
            <input type="submit" value="Imporuj" class="btn btn-primary" />
            <input type="submit" value="Zrus" class="btn btn-secondary" />
        </form>
    </dialog>
    `;

    document.querySelector("#snippet--full-content input[type='submit']").insertAdjacentHTML("afterend", import_json_button_html);
    document.querySelector("#snippet--full-content").insertAdjacentHTML("beforeend", import_dialog_html);

    document.querySelector("#jj-show-import-dialog").addEventListener('click', function() {
        document.querySelector("dialog#jj-import-dialog").showModal();
    });

    const rooms = {};

    for (let room_option of document.querySelectorAll("#frm-reservationForm-schoolroom_id option:not([value=''])")) {
        rooms[room_option.text] = +room_option.value;
    }

    const user_id = document.querySelector("#frm-reservationForm-user_id").value;

    const user_created_id = document.querySelector("#frm-reservationForm input[name='created_id']").value;

    console.log(user_created_id);

    let dialog = document.querySelector("#jj-import-dialog");
    dialog.addEventListener("close", async function(e) {
        if (dialog.returnValue != "Imporuj") {
            return;
        }

        let data = JSON.parse(document.querySelector("#jj-json").value);
        for (let item of data) {
            let request = `schoolroom_id=${rooms[item.room]}&user_id=${user_id}&alldayfrom=1.1.1900&alldayto=1.1.1900&from=${encodeURIComponent(item.from)}&to=${encodeURIComponent(item.to)}&reason=${encodeURIComponent(item.reason)}&save=Ulo%C5%BEi%C5%A5&created_id=${user_created_id}&_do=reservationForm-submit`;
            let response = await fetch(
                "/schoolrooms/admin/reservations/add",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    redirect: 'manual',
                    body: request
                }
            );
            if (response.type != "opaqueredirect") {
                console.log("Nepodarilo sa pridat rezervaciu", item, await response.text());
            }
        }
    });
})();
