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

const SimpleMessageSettings = new GObject.Class({
  Name: 'SimpleMessagePrefs',
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

    let settings = ExtensionUtils.getSettings();

    let messageLabel = new Gtk.Label({
      label: '<b><u>Write your message</u></b>',
      use_markup: true,
    });
    let messageText = new Gtk.EntryBuffer({ text: settings.get_string('message') })
    let messageField = new  Gtk.Entry({
      buffer: messageText,
      hexpand: true,
      halign: Gtk.Align.CENTER,
      valign:Gtk.Align.CENTER
    })

    settings.bind( 'message', messageField.buffer, 'text', Gio.SettingsBindFlags.DEFAULT );

    this.attach(messageLabel, 0,0,1,1);
    this.attach(messageField, 0,1,1,1);
  }
});

function buildPrefsWidget() {
    let widget = new SimpleMessageSettings();
    return widget;
}
