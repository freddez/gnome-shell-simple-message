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
"use strict";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as Config from "resource:///org/gnome/shell/misc/config.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import Clutter from "gi://Clutter";
import GObject from "gi://GObject";
import St from "gi://St";
import GLib from "gi://GLib";
let simpleMessage = null; // Variable to hold our extension

export default class SimpleMessageExtension extends Extension {
  /**
   * This class is constructed once when your extension is loaded, not
   * enabled. This is a good time to setup translations or anything else you
   * only do once.
   *
   * You MUST NOT make any changes to GNOME Shell, connect any signals or add
   * any event sources here.
   *
   * @param {ExtensionMeta} metadata - An extension meta object
   */
  constructor(metadata) {
    super(metadata);
  }

  /**
   * This function is called when your extension is enabled, which could be
   * done in GNOME Extensions, when you log in or when the screen is unlocked.
   *
   * This is when you should setup any UI for your extension, change existing
   * widgets, connect signals or modify GNOME Shell's behavior.
   */
  enable() {
    simpleMessage = new SimpleMessage();
  }

  /**
   * This function is called when your extension is uninstalled, disabled in
   * GNOME Extensions or when the screen locks.
   *
   * Anything you created, modified or setup in enable() MUST be undone here.
   * Not doing so is the most common reason extensions are rejected in review!
   */
  disable() {
    simpleMessage.destroy();
    simpleMessage = null;
  }
}

// Create the extension object
let SimpleMessage = GObject.registerClass(
  { GTypeName: "SimpleMessage" },
  class SimpleMessage extends PanelMenu.Button {
    _init() {
      super._init(/*St.Align.START*/);
      const [major] = Config.PACKAGE_VERSION.split(".");
      const shellVersion = Number.parseInt(major);

      // Getting the extension object by UUID
      let extensionObject = Extension.lookupByUUID("simple-message@freddez");
      this._settings = extensionObject.getSettings();
      //this._settings = ExtensionUtils.getSettings();
      this.message = this._settings.get_string("message");
      this.command = this._settings.get_string("command");
      this.message_alignment = this._settings.get_int("panel-alignment");
      this.message_position = this._settings.get_int("panel-position");

      // Create the object that holds and displays the message
      this.messageBox = new St.Label({
        name: "simple-message-message",
        y_align: Clutter.ActorAlign.CENTER,
        y_expand: true,
      });
      if (shellVersion >= 46) {
        this.actor.add_child(this.messageBox);
      } else {
        this.add_actor(this.messageBox);
      }

      // Add message text
      this.messageBox.set_text(this.message);
      // Add message to panel
      Main.panel.addToStatusArea(
        "simpleMessage",
        this,
        this.message_position,
        this.message_alignment,
      );

      // Connect change in values settings to functions to update the message and position
      this._settings.connect(
        "changed::message",
        this._rewriteMessage.bind(this),
      );
      this._settings.connect(
        "changed::command",
        this._rewriteCommand.bind(this),
      );
      this._settings.connect(
        "changed::panel-alignment",
        this._moveMessage.bind(this),
      );
      this._settings.connect(
        "changed::panel-position",
        this._moveMessage.bind(this),
      );
      this.connect("button-press-event", () => {
        if (this.command) {
          GLib.spawn_command_line_async(this.command);
        }
      });
    }

    _rewriteMessage() {
      this.message = this._settings.get_string("message");
      this.messageBox.set_text(this.message);
    }

    _moveMessage() {
      this.get_parent().remove_actor(this); // Remove from the old location
      this.message_alignment = this._settings.get_int("panel-alignment");
      this.message_position = this._settings.get_int("panel-position");

      // Allows easily addressable boxes
      let boxes = {
        0: Main.panel._leftBox,
        1: Main.panel._centerBox,
        2: Main.panel._rightBox,
      };
      // Insert at new location
      boxes[this.message_alignment].insert_child_at_index(
        this,
        this.message_position,
      );
    }
    _rewriteCommand() {
      this.command = this._settings.get_string("command");
    }
  },
);
