/* prefs.js
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
import Gio from 'gi://Gio';
import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';

import {ExtensionPreferences, gettext as _} from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';


export default class SimpleMessahePreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    window.settings = this.getSettings('org.gnome.shell.extensions.simple-message');
    // const settings = ExtensionUtils.getSettings()
    // Create a page
    const page = new Adw.PreferencesPage();
    window.add(page);
    // Create a group of settings
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Create a row for position settings
    const positionRow = new Adw.ActionRow({
      title: 'Top Panel Location',
      subtitle: 'Group and Position',
    });
    group.add(positionRow);

    // Create a group of toggle buttons to set the panel box
    const left_button = new Gtk.ToggleButton({ label: 'Left', valign: Gtk.Align.CENTER });
    const center_button = new Gtk.ToggleButton({ label: 'Center', valign: Gtk.Align.CENTER });
    const right_button = new Gtk.ToggleButton({ label: 'Right', valign: Gtk.Align.CENTER });
    center_button.set_group(left_button);// Add those buttons on the same line
    right_button.set_group(left_button);

    // Set the initial state of the toggle buttons and make them update
    // the settings
    const panelBoxes = [left_button, center_button, right_button];
    const initialPanelBox = window.settings.get_int('panel-alignment');
    function _initiatePanelButton(button, index, array) {
      if ( initialPanelBox == index) { button.set_active(true) }
      button.connect('toggled', () => {
        window.settings.set_int('panel-alignment', index);
      });
      positionRow.add_suffix(button);
    }
    panelBoxes.forEach(_initiatePanelButton);

    // Within a panel box, the position should be provided
    // Create a spin button with the initial position value.
    const initialPanelBoxPosition = window.settings.get_int('panel-position');
    const positionButton = new Gtk.SpinButton({ valign: Gtk.Align.CENTER });
    positionButton.set_adjustment(new Gtk.Adjustment({
      lower: -100,
      upper: 100,
      value: initialPanelBoxPosition,
      step_increment: 1,
      page_increment: 1,
      page_size: 0,
    }));
    // Let the spin button update the settings state.
    positionButton.connect('value-changed', () => {
      window.settings.set_int(
        'panel-position', positionButton.get_adjustment().value);
    });
    // Add it to the GUI.
    positionRow.add_suffix(positionButton);

    // Create an option to access and edit the message
    const messageRow = new Adw.ActionRow({
      title: 'Write your message',
      subtitle: 'Confirm with Enter'
    });
    group.add(messageRow);
    // Create a text box where the user can enter the message
    const messageText = new Gtk.EntryBuffer({
      text: window.settings.get_string('message')
    });
    const messageField = new Gtk.Entry({
      buffer: messageText,
      hexpand: true,
      valign:Gtk.Align.CENTER,
      halign:Gtk.Align.CENTER
    })
    // Let the text box update the message
    messageField.connect('activate', () => {
      window.settings.set_string('message', messageText.text);
    })
    // Add the text box to the row
    messageRow.add_suffix(messageField);

    // Create an option to access and edit the command
    const commandRow = new Adw.ActionRow({
      title: 'Command to execute on click',
      subtitle: 'Confirm with Enter'
    });
    group.add(commandRow);
    // Create a text box where the user can enter the command
    const commandText = new Gtk.EntryBuffer({
      text: window.settings.get_string('command')
    });
    const commandField = new Gtk.Entry({
      buffer: commandText,
      hexpand: true,
      valign:Gtk.Align.CENTER,
      halign:Gtk.Align.CENTER
    })
    // Let the text box update the command
    commandField.connect('activate', () => {
      window.settings.set_string('command', commandText.text);
    })
    // Add the text box to the row
    commandRow.add_suffix(commandField);
  }
}


