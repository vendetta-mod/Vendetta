# Vendetta
A mod for Discord's mobile apps.

## Installing
Vendetta's codebase is platform-agnostic, but you need a platform-specific loader.

### Android
* Root - [VendettaXposed](https://github.com/vendetta-mod/VendettaXposed)
* Non-root - [frendetta](https://github.com/vendetta-mod/frendetta)

### iOS
* [VendettaTweak](https://github.com/vendetta-mod/VendettaTweak) <sub>must be built from source for now™️</sub>

## Contributing
I ([Beef](https://github.com/Beefers)) develop Vendetta entirely on my rooted Pixel 7, so these instructions only cover Android with LSPosed. If you have development instructions for iOS or unrooted Android, PRs are welcome!

1. Clone the repo:
    ```
    git clone https://github.com/vendetta-mod/Vendetta
    ```

2. Install dependencies:
    ```
    pnpm i
    ```
    <sup>`npm` or `yarn` should also work.</sup>

3. Install the [debug build of the Xposed module](https://nightly.link/vendetta-mod/VendettaXposed/workflows/build/master/app-debug.zip), and enable it. It should target Discord by default.

4. Connect your test device via ADB, and run:
    ```
    adb reverse tcp:4040 tcp:4040
    ```
    <sup>You can replace the second `4040` with any port of your choosing, as long as the first port is **always** `4040`.</sup>

5. Build Vendetta's code:
    ```
    pnpm build
    ```
    <sup>`npm` or `yarn` should also work.</sup>

6. In the newly created `dist` directory, run a HTTP server on port 4040.

7. Upon starting Discord, you should notice that your phone makes a request to your HTTP server, downloading Vendetta's bundle.

8. Make your changes, rebuild, reload, go wild!