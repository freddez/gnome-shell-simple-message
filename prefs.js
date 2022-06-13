/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
'use strict';

//Import required libraries
const { Gio, GObject, Gtk } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;//Access to settings from schema

function init() {}

//SETTINGS WIDGETS
const settings = ExtensionUtils.getSettings();//Create a global variable to connect user settings

function makeMessageEntry() {
    let _messageText = new Gtk.EntryBuffer({ text: settings.get_string('message') })
    let _messageField = new  Gtk.Entry({
        buffer: _messageText,
        hexpand: true,
        halign: Gtk.Align.CENTER,
        valign:Gtk.Align.CENTER
    })
    settings.bind( 'message', _messageField.buffer, 'text', Gio.SettingsBindFlags.DEFAULT );
    return _messageField;
}

/*
//GTK4 WINDOW

//Dectect Gnome Version Number
const Config = imports.misc.config;
const [major, minor] = Config.PACKAGE_VERSION.split('.').map(s => Number(s));

function fillPreferencesWindow(window) {
    if (major >= 42) {//Check for Gnome 42 or above
        const Adw = imports.gi.Adw;

        //Create a preferences page and group
        const page = new Adw.PreferencesPage();
        window.add(page);
        const group = new Adw.PreferencesGroup({ title: 'Write your message' });
        page.add(group);

        //Add the row for the text entry
        const messageRow = new Adw.ActionRow();
        let messageEntry = makeMessageEntry();
        group.add(messageEntry);
        messageRow.add_suffix(messageEntry);
        messageRow.activatable_widget = messageEntry;
    }
}
*/

//GTK3 WINDOW
const BigAvatarSettings = new GObject.Class({
    Name: 'BigAvatarPrefs',
    Extends: Gtk.Grid,
    _init: function(params) {
        //Give grid's characteristics
        this.parent(params);
        this.column_spacing = 32;
        this.row_spacing = 16;
        this.margin_top = 16;
        this.margin_bottom = 16;
        this.margin_start = 32;
        this.margin_end = 32;

        let messageLabel = new Gtk.Label({
            label: '<b><u>Write your message</u></b>',
            use_markup: true,
        });

        let messageEntry = makeMessageEntry();

        this.attach(messageLabel, 0,0,1,1);
        this.attach(messageEntry, 0,1,1,1);
    }
});

function buildPrefsWidget() {
    let widget = new BigAvatarSettings();
    return widget;
}
