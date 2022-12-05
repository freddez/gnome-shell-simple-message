EXTENSION_UUID = simple-message@freddez
PACK_NAME = $(EXTENSION_UUID).shell-extension.zip

.phony: install uninstall enable disable pack prefs

install: pack
	gnome-extensions install --force $(PACK_NAME)

uninstall:
	gnome-extensions uninstall $(EXTENSION_UUID)

enable:
	gnome-extensions enable $(EXTENSION_UUID)

disable:
	gnome-extensions disable $(EXTENSION_UUID)

pack:
	gnome-extensions pack  \
	--force

prefs:
	gnome-extensions prefs $(EXTENSION_UUID)
