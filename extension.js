const { GObject, St } = imports.gi;
const Clutter = imports.gi.Clutter;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

let SimpleMessage = GObject.registerClass(
  class SimpleMessage extends PanelMenu.Button {
    _init() {
      super._init(0.0, "SimpleMessage");
      this._settings = Convenience.getSettings();
      this._settingsChangedSignal = this._settings.connect(
        "changed",
        this._refreshUI.bind(this)
      );
      this._buildUI();
      this._refreshUI();
    }

    _buildUI() {
      this._message = new St.Label({
        name: "simple-message-message",
        y_align: Clutter.ActorAlign.CENTER,
        y_expand: true,
      });
      (this instanceof Clutter.Actor ? this : this.actor).add_actor(
        this._message
      );
      this._newMessage = new St.Entry({
        name: "simple-message-new-message",
        track_hover: true,
        can_focus: true,
      });
    }

    _refreshUI() {
      let message = this._loadMessage();
      this._message.set_text(message);
      this._newMessage.set_text(message);
    }

    _loadMessage() {
      return this._settings.get_string("message");
    }
  }
);

let simpleMessage = null;

function init() {}

function enable() {
  simpleMessage = new SimpleMessage();
  Main.panel.addToStatusArea("simpleMessage", simpleMessage);
}

function disable() {
  if (simpleMessage !== null) simpleMessage.destroy();
}
