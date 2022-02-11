window.jj_ext = {
    get_toolbar: function() {
        let old_toolbar = document.getElementById("jj_extensions:toolbar");

        if (old_toolbar !== null) {
            return old_toolbar;
        }

        let control_table = document.querySelector('#id-tabulka-znamky > tbody > tr > td > table')
        let new_row = control_table.insertRow(2)
        let control_cell = new_row.insertCell(0)

        control_cell.setAttribute("colspan", "4");

        let toolbar_div = document.createElement('div');
        toolbar_div.setAttribute("id", "jj_extensions:toolbar");
        toolbar_div.setAttribute("style", "padding: 5px; border-radius: 5px; background: lightgray; text-align: left;");
        let toolbar_label = document.createElement('span');
        toolbar_label.setAttribute("style", "font-size: 14px; font-weight: bold; padding: 0 10px");
        toolbar_label.innerHTML = "JJ Toolbar";
        toolbar_div.appendChild(toolbar_label);
        control_cell.appendChild(toolbar_div);

        return toolbar_div;
    },

    create_toolbutton: function(label, callback) {
        let toolbar = jj_ext.get_toolbar();

        let toolbar_button = document.createElement('input')
        toolbar_button.setAttribute("type", 'button')
        toolbar_button.setAttribute("class", 'tien')
        toolbar_button.setAttribute("value", 'Import znamok z jsonu')
        toolbar_button.addEventListener("click", callback);
        toolbar.appendChild(toolbar_button);
    },

    create_dialog: function(dialog_builder, on_ok_callback) {
        let dialog = document.createElement('dialog');
        dialog.setAttribute("style", "margin: auto; padding: 10px; width: 300px;");
        document.body.appendChild(dialog);
        let dialog_form = document.createElement('form');
        dialog_form.setAttribute("method", "dialog");
        dialog.appendChild(dialog_form);

        let ok_button = document.createElement('input');
        ok_button.setAttribute("type", 'submit');
        ok_button.setAttribute("class", 'tien');
        ok_button.setAttribute("value", 'Ok');

        let cancel_button = document.createElement('input');
        cancel_button.setAttribute("type", 'submit');
        cancel_button.setAttribute("class", 'tien');
        cancel_button.setAttribute("value", 'Cancel');

        let dialog_separator = document.createElement('hr');
        dialog_separator.setAttribute("style", "margin: 10px 0");

        let dialog_state = dialog_builder(dialog_form);

        dialog_form.appendChild(document.createElement('br'));
        dialog_form.appendChild(dialog_separator);
        dialog_form.appendChild(ok_button);
        dialog_form.appendChild(cancel_button);

        dialog.addEventListener('close', function onClose() {
            try {
                if (dialog.returnValue === 'Ok') {
                    on_ok_callback(dialog_state);
                }
            } finally {
                dialog.remove();
            }
        });

        dialog.showModal();
    }
};
