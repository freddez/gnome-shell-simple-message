# gnome-shell-simple-message

Install the extension from the [extension website](https://extensions.gnome.org/extension/5018/simple-message/).

You can change the message from command line with `gsettings` (or in the preference panel):

```sh
gsettings --schemadir $HOME/.local/share/gnome-shell/extensions/simple-message@freddez/schemas \
set org.gnome.shell.extensions.simple-message message "Hello world!"
```

or `dconf`:

```sh
dconf write /org/gnome/shell/extensions/simple-message/message '"Hello world!"'
```

It is also possible to launch a custom command on message click. See "command" property in dconf or preference panel.


I use this extension to view my current org-mode running task:

```emacs-lisp
(defun current-task-to-status ()
  (interactive)
  (if (fboundp 'org-clocking-p)
      (if (org-clocking-p)
          (call-process "dconf" nil nil nil "write"
                        "/org/gnome/shell/extensions/simple-message/message"
                        (concat "'" (org-clock-get-clock-string) "'"))
        (call-process "dconf" nil nil nil "write"
                      "/org/gnome/shell/extensions/simple-message/message"
                      "'No active clock'"))))
(run-with-timer 0 60 'current-task-to-status)
(add-hook 'org-clock-in-hook 'current-task-to-status)
(add-hook 'org-clock-out-hook 'current-task-to-status)
(add-hook 'org-clock-cancel-hook 'current-task-to-status)
(add-hook 'org-clock-goto-hook 'current-task-to-status)
```
