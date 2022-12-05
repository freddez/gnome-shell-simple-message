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

// Import required libraries
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const { Clutter, GObject, St } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

let simpleMessage = null;// Variable to hold our extension

// Create the extension object
let SimpleMessage = GObject.registerClass({
    GTypeName: 'SimpleMessage',
}, class SimpleMessage extends PanelMenu.Button {
    _init() {
        super._init(St.Align.START);

        // Get settings values
        this._settings = ExtensionUtils.getSettings();
        this.message = this._settings.get_string('message');
        this.message_alignment = this._settings.get_int('panel-alignment');
        this.message_position = this._settings.get_int('panel-position');

        // Create the object that holds and displays the message
        this.messageBox = new St.Label({
            name: "simple-message-message",
            y_align: Clutter.ActorAlign.CENTER,
            y_expand: true,
          });
        this.add_actor(this.messageBox);

        // Add message text
        this.messageBox.set_text(this.message);
        // Add message to panel
        Main.panel.addToStatusArea('simpleMessage', this, this.message_position, this.message_alignment);

        // Connect change in values settings to functions to update the message and position
        this._settings.connect('changed::message', this._rewriteMessage.bind(this));
        this._settings.connect('changed::panel-alignment', this._moveMessage.bind(this));
        this._settings.connect('changed::panel-position', this._moveMessage.bind(this));
    }

    _rewriteMessage() {
        this.message = this._settings.get_string('message');
        this.messageBox.set_text(this.message);
    }

    _moveMessage() {
        this.get_parent().remove_actor(this);// Remove from the old location
        this.message_alignment = this._settings.get_int('panel-alignment');
        this.message_position = this._settings.get_int('panel-position');

        // Allows easily addressable boxes
        let boxes = {
            0: Main.panel._leftBox,
            1: Main.panel._centerBox,
            2: Main.panel._rightBox
        };
        // Insert at new location
        boxes[this.message_alignment].insert_child_at_index(this, this.message_position);
    }
});

function init() {}

// Run when extension is enabled
function enable() {
    simpleMessage = new SimpleMessage();
}

// Run when extension is disabled
function disable() {
    simpleMessage.destroy();
    simpleMessage = null;
}
