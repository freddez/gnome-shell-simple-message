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
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const { Clutter, GObject, St } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

function init() {}

let simpleMessageItem = null;//Variable to hold our extension
let settings;//Variable to connect to settings

//Run when extension is enabled
function enable() {
  settings = ExtensionUtils.getSettings();
  simpleMessageItem = new SimpleMessage();
  Main.panel.addToStatusArea("simpleMessage", simpleMessageItem);
}

//Run when extension is disabled
function disable() {
    simpleMessageItem.destroy();
    simpleMessageItem = null;
    settings.run_dispose();
    settings = null;
}

//Create the message object
let SimpleMessage = GObject.registerClass(
  class SimpleMessage extends PanelMenu.Button {
    _init() {
      super._init(0.0, "SimpleMessage");
      settings.connect('changed::message', this._refreshUI.bind(this));
      this._buildUI();
      this._refreshUI();
    }

    _buildUI() {
      this._message = new St.Label({
        name: "simple-message-message",
        y_align: Clutter.ActorAlign.CENTER,
        y_expand: true,
      });
      (this instanceof Clutter.Actor ? this : this.actor).add_actor(this._message);
      this._newMessage = new St.Entry({
        name: "simple-message-new-message",
        track_hover: true,
        can_focus: true,
      });
    }

    _refreshUI() {
      let message = settings.get_string("message");
      this._message.set_text(message);
      this._newMessage.set_text(message);
    }
});
