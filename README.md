# gnome-shell-simple-message

Write message on top bar with dconf:

```sh
dconf write /org/gnome/shell/extensions/simple-message/message 'hello world'
```

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
```
