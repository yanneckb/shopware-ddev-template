# DDEV Deep-Dive

## DDEV Share

With the ddev share command you can share your local development.

A temporary domain is created via ngrok, with which the project can be reached from outside. However, the **domain must be registered in the sales channel**!

To set up a stable domain, you can use `ddev-tailscale-router`. More information can be found here:

[Tailscale Router](https://ddev.com/blog/tailscale-router-ddev-addon/)

[DDEV share](https://ddev.com/blog/sharing-a-ddev-local-project-with-other-collaborators/)

---

## HTTPS Support

Simply execute `ddev poweroff && mkcert -install` and start the project.

## Using DDEV with Vite

[Working with Vite in DDEV](https://ddev.com/blog/working-with-vite-in-ddev/ )

---

## [WIP] ZSH and OhMyZsh

[Use DDEV custom commands to add zsh](https://ddev.com/blog/oh-my-zsh-using-custom-commands-and-other-goodies-to-add-to-ddev/)

Add the line `webimage_extra_packages: ["zsh"]` to the `./.ddev/config.yaml`.

To add the `ddev zsh` command, create a file `zsh` in `.ddev/commands/web/` and add the following

```bash
#!/bin/bash

## Description: ssh into web container using zsh
## Usage: zsh [flags] [args]
## Example: "ddev zsh"

zsh $@
```

- After restarting the environment with `ddev restart`, you can open the ZSH environment with `ddev zsh`
- If you already have `~/.zshrc` and `~/.oh-my-zsh`, you can simply insert them into `./.ddev/homeadditions`.

Alternatively, you can reconfigure OMZ:

```bash
cd .ddev/homeadditions
curl -Lo install.sh https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh
ZSH=./.oh-my-zsh sh ./install.sh --unattended
```

then `cp ~/.zshrc .` to copy the `.zshrc` that was packed into the home directory by the `install.sh`

Change the line above the file `.ddev/homeadditions/.zshrc` to `export ZSH=~/.oh-my-zsh`

Now start and use OMZ with `ddev restart` and `ddev zsh`