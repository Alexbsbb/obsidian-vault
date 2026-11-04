---
name: debian-server-bootstrap
description: "Use when provisioning a fresh Debian box for Docker."
tags: [debian, provisioning, docker, ssh, bootstrap, paramiko, fresh-install]
related_skills: [server-hardware-assessment, deploy-swarm-service]
---

# Debian Server Bootstrap / Provisioning

Take a freshly installed Debian box from "just installed" to "ready for Docker",
using the same real constraints you hit in practice. This is the ONBOARDING
companion to `deploy-swarm-service` (which assumes an already-provisioned server).

## When to Use

- Answering "novo servidor / nova VM / VPS Debian — colocar pra funcionar"
- A fresh Debian that has no Docker yet, no `curl`, no `sudo`, and root SSH locked
- Enabling direct root SSH login on a server that only accepts a normal user
- Deciding whether a vendor setup script (`bash <(curl -sSL ...)`) is safe to run
- Installing Docker Engine from the official apt repo on Debian

## Fresh-Install Realities (not bugs — expect these)

A minimal Debian (esp. netinstall) at first boot:

| Expectation | Reality |
|-------------|---------|
| `curl` / `wget` | often **absent** → installer scripts fail before doing anything |
| `sudo` | often **absent**, and the created user is NOT in admin groups |
| root SSH login | **blocked** by default (`PermitRootLogin prohibit-password`, commented) |
| DNS | a domain may resolve **only to IPv6 (AAAA)** → add `-4` to curl or it stalls |
| IP check | `/etc/shadow` is NOT readable by non-root → a grep there is misleading |

So the honest first pass usually is `apt-get update`, then install
`curl ca-certificates wget git sudo`. Work as root once enabled (below) rather than
feeding each `sudo` a password.

## su → root when direct root SSH is locked

If you must operate as root but direct `ssh root@` fails (blocked), log in as the
normal user and `su -`. A full working `su_root()` helper (base64 + PTY, feeds the
`Senha:`/`Password:` prompt) lives in **server-hardware-assessment** §1b and in
`scripts/su_root_helper.py`. Reuse it rather than rewriting per session.

## Enable direct root SSH

Doing this lets you skip the su dance and run long installs as root via plain
`exec_command` (easier to stream over PTY):

```bash
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
grep -rl PermitRootLogin /etc/ssh/sshd_config.d/*.conf 2>/dev/null | xargs -r sed -i 's/^#*PermitRootLogin.*/PermitRootLogin yes/'
sshd -t && systemctl restart ssh        # service is `ssh` on Debian, NOT `sshd`
```

Then verify from a **separate** SSH connection: `ssh root@host` — for these lab
boxes the normal user and root passwords are often identical.

## Docker Engine install (official repo, works on Debian 11 AND 13)

```bash
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq && apt-get install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
> /etc/apt/sources.list.d/docker.list
apt-get update -qq
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker && systemctl is-active docker
docker --version && docker compose version && docker run --rm hello-world
```

Docker version depends on the repo's support for the Debian codename (`trixie` for
13, `bullseye` for 11). `docker-compose-plugin` provides the `docker compose` v2
subcommand.

**Pitfall:** the first `docker run hello-world` can take ~30s pulling the image —
don't read that as a hang. These installs run over PTY: stream lines and set a
generous channel timeout (600s+).

## Vendor setup scripts (`curl | bash`) — vet before you trust

Before running any `bash <(curl -sSL …)` as root, download and INSPECT it first:

```bash
curl -4 -sSL -o /tmp/setup.sh <url>
file /tmp/setup.sh && wc -c /tmp/setup.sh && sha256sum /tmp/setup.sh
grep -nE 'curl|wget|docker|apt |rm |chmod|\.sh|git clone|http' /tmp/setup.sh | head -50
```

- State in your reply what the script does before executing (packages, sources, repos).
- **A vendor setup script can hard-require a specific Debian release.** The "Orion
  Design" installer (`setup.oriondesign.art.br`) prints `Este script recomenda o uso do Debian 11`, then blocks waiting on interactive input — NOT compatible with Debian 12/13. Don't try to push through an OS check a vendor script makes: it signals the box should be (re)installed on the required release.
- Interactive-menu installers over paramiko can hang at an invisible `read`/`dialog`. Detect with `ps aux | grep -E 'SetupOrion|setup'`; an `S+` (stopped, foreground) process is waiting on a read no TTY will satisfy — kill with `pkill -f <name>`.
- When the DNS for the script host only returns AAAA, use `curl -4` so it doesn't stall.

`references/orion-ssh-and-setup.md` has the full srv-app-03 case (Debian 13 trixie):
SSH enabling, Docker installed verbatim, and the Orion-on-Debian13 hang → box gets reinstalled as Debian 11.

## Host discovery when the box isn't where you expect

Told about "a new server" but don't know which host owns the IP? Check the known
Proxmox hosts you have SSH access to (`qm list`, `pct list`, `ip -4 addr show`) and
report which owns it. If it's on none of them, ASK the user where it lives (third
hypervisor / bare metal / cloud VPS) instead of guessing.

## Reference Files

- `references/orion-ssh-and-setup.md` — Full srv-app-03 onboarding: root-SSH enabling, installs that succeeded, and the vendor-installer-on-wrong-Debian hang.
- `scripts/su_root_helper.py` — standalone paramiko helper: run a command as root via `su -`, feeding the root password over a PTY.