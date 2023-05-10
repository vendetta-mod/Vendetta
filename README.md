# Vendetta
A mod for Discord's mobile apps.

## Installing
Vendetta's codebase is platform-agnostic, but you need a platform-specific loader.

### Android
* Root - [VendettaXposed](https://github.com/vendetta-mod/VendettaXposed)
* Non-root - [VendettaManager](https://github.com/vendetta-mod/VendettaManager)
    - Manager not working? No problem! Pre-built APKs are provided [here](https://discord.k6.tf/).

#### Any differences between VendettaXposed and VendettaManager? Which I should pick?
For most users we recommend to use Vendetta manager as it don't require root.
    
A brief explanation of differences below:

* VendettaXposed module allows to inject the modification in applications. It is also possible to inject in apps installed from Google Play, so they will continue receiving updates from the store. For already installed apps root required, as this is not a permitted Android behaviour and such method relies on Xposed Framework.
* VendettaManager uses the xposed module as standalone application which can download all required files and repackage them with the modifcation for further installation or update. This method don't require root and installs Vendetta next to original Discord (if you use any from Google Play or somewhere else).

### iOS
* [VendettaTweak](https://github.com/vendetta-mod/VendettaTweak)
    - You can get prebuilt `.deb` files from GitHub Actions.
    - Both an IPA and an APT repo will be provided in future.

## Contributing
1. Install a Vendetta loader with loader config support (any mentioned in the [Installing](#installing) section).

2. Go to Settings > General and enable Developer Settings.

3. Clone the repo:
    ```
    git clone https://github.com/vendetta-mod/Vendetta
    ```

4. Install dependencies:
    ```
    pnpm i
    ```
    <sup>`npm` or `yarn` should also work.</sup>

5. Build Vendetta's code:
    ```
    pnpm build
    ```
    <sup>`npm` or `yarn` should also work.</sup>

6. In the newly created `dist` directory, run a HTTP server. I recommend [http-server](https://www.npmjs.com/package/http-server).

7. Go to Settings > Developer enabled earlier). Enable `Load from custom url` and input the IP address and port of the server (e.g.  e.g. `http://192.168.1.236:4040`) in the new input box labelled `VENDETTA URL`.

8. Restart Discord. Upon reload, you should notice that your device will download Vendetta's bundled code from your server, rather than GitHub.

9. Make your changes, rebuild, reload, go wild!
