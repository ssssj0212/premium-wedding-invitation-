# Tailscale Setup Plan

## Goal

Put this Mac, your Android phone, your iPad, and future laptops in the same Tailscale tailnet so they can reach each other reliably from anywhere.

## Recommended baseline

- Use the same Tailscale account on all of your personal devices.
- On macOS, use the standalone app from Tailscale's package server, not the App Store version.
- Keep always-on devices plugged in and signed in.
- Give every device a clear name right after it joins.

## Device naming

- This Mac: `home-mac`
- Android phone: `android-phone`
- iPad: `home-ipad`
- Future laptops: `laptop-<name>`

## Current Mac

1. Install the standalone macOS package.
2. Approve the system extension and VPN permission prompts.
3. Sign in with your Tailscale account.
4. Confirm the device appears in the Tailscale admin console.
5. Rename the device to `home-mac`.
6. Leave it connected for remote access use.

## Android phone

1. Install Tailscale from Google Play.
2. Sign in with the same Tailscale account.
3. Allow the VPN permission.
4. Turn Tailscale on.
5. Rename the device to `android-phone`.

## iPad

1. Install Tailscale from the App Store.
2. Sign in with the same Tailscale account.
3. Allow the VPN permission.
4. Turn Tailscale on.
5. Rename the device to `home-ipad`.

## Future laptops

1. Install Tailscale.
2. Sign in with the same Tailscale account.
3. Rename the device using the `laptop-<name>` pattern.
4. Verify it can see `home-mac` in the device list.

## Tailnet settings to enable after first login

- Enable MagicDNS in the Tailscale admin console so devices can find each other by name.
- For any machine you want to keep reachable long-term, disable key expiry for that device in the admin console.
- If you later want zero-touch enrollment for extra laptops, create a reusable auth key from the admin console after the tailnet is live.

## Quick verification

- Confirm each device appears in the admin console.
- From one device, open the Tailscale app and verify the others are listed.
- On Macs, run `tools/tailscale-healthcheck.sh` after install.
