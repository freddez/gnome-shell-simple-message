# gnome-shell-simple-message

Install the extension from the [extension website](https://extensions.gnome.org/extension/5018/simple-message/).

You can change the message from command line with `gsettings`:

```sh
gsettings --schemadir $HOME/.local/share/gnome-shell/extensions/simple-message@freddez/schemas \
set org.gnome.shell.extensions.simple-message message "Hello world!"
```

or `dconf`:

```sh
dconf write /org/gnome/shell/extensions/simple-message/message '"Hello world!"'
```

## Update message in the background

One application of the extension is to display the output of commands and keep it updated in the background.

Here is a way to do it:

1. Create a file `simple-message.sh` and paste the following into it

    ```bash
    #!/bin/bash

    # While loop to set the 'message' key of the 'simple message' extension

    # to the output of a command every n seconds

    # for this example, install 'fortune-mod', a program that returns quotes and phrases
    # `fortune <themes> -s -n 40`: write short quotes below 40 characters

    while true
      do
        quote=$(fortune fortunes humorists humorix-misc science wisdom -s -n 40)
        quote_singleline=$(echo $quote | tr '\n      ' ' ')

        gsettings --schemadir \
          $HOME/.local/share/gnome-shell/extensions/simple-message@freddez/schemas \
          set org.gnome.shell.extensions.simple-message message \
          "$quote_singleline"
        sleep 300
      done
    exit 0
    ```

2. Make the file executable

    ```bash
    chmod +x ./simple-message.sh -v
    ```

3. Start the script as a background task

    ```bash
    ./simple-message.sh &
    ```

4. You can add the script to your `bash_profile` to have it started after logging in

    ```bash
    echo "<PATH>/simple-message.sh &" >> $HOME/.bash_profile
    cat $HOME/.bash_profile
    ```
