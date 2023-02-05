import * as _spitroast from "spitroast";
import _React from "react";
import _RN from "react-native";
import _Clipboard from "@react-native-clipboard/clipboard";

type MetroModules = { [id: number]: any };

// Helper types for API functions
type PropIntellisense<P extends string | symbol> = Record<P, any> & Record<PropertyKey, any>;
type PropsFinder = <T extends string | symbol>(...props: T[]) => PropIntellisense<T>;
type PropsFinderAll = <T extends string | symbol>(...props: T[]) => PropIntellisense<T>[];

type LoggerFunction = (...messages: any[]) => void;
interface Logger {
    log: LoggerFunction;
    info: LoggerFunction;
    warn: LoggerFunction;
    error: LoggerFunction;
    time: LoggerFunction;
    trace: LoggerFunction;
    verbose: LoggerFunction;
}

type SearchFilter = (tree: any) => boolean;
interface FindInTreeOptions {
    walkable?: string[];
    ignore?: string[];
    maxDepth?: number;
}

interface Asset {
    name: string;
    id: number;
}

interface PluginAuthor {
    name: string;
    id: string;
}

// See https://github.com/vendetta-mod/polymanifest
interface PluginManifest {
    name: string;
    description: string;
    authors: PluginAuthor[];
    main: string;
    hash: string;
    // Vendor-specific field, contains our own data
    vendetta?: {
        icon?: string;
    };
}

interface Plugin {
    id: string;
    manifest: PluginManifest;
    enabled: boolean;
    update: boolean;
    js: string;
}

interface Settings {
    debuggerUrl: string;
    developerSettings: boolean;
}

interface ApplicationCommand {
    description: string;
    name: string;
    options: ApplicationCommandOption[];
    execute: (args: any[], ctx: CommandContext) => CommandResult | void | Promise<CommandResult> | Promise<void>;
    id?: string;
    applicationId: string;
    displayName: string;
    displayDescription: string;
    inputType: ApplicationCommandInputType;
    type: ApplicationCommandType;
}

declare enum ApplicationCommandInputType {
    BUILT_IN,
    BUILT_IN_TEXT,
    BUILT_IN_INTEGRATION,
    BOT,
    PLACEHOLDER,
}

interface ApplicationCommandOption {
    name: string;
    description: string;
    required?: boolean;
    type: ApplicationCommandOptionType;
    displayName: string;
    displayDescription: string;
}

declare enum ApplicationCommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP,
    STRING,
    INTEGER,
    BOOLEAN,
    USER,
    CHANNEL,
    ROLE,
    MENTIONABLE,
    NUMBER,
    ATTACHMENT,
}

declare enum ApplicationCommandType {
    CHAT = 1,
    USER,
    MESSAGE,
}

interface CommandContext {
    channel: any;
    guild: any;
}

interface CommandResult {
    content: string;
    tts?: boolean;
}

interface RNConstants extends _RN.PlatformConstants {
    // Android
    Version: number;
    Release: string;
    Serial: string;
    Fingerprint: string;
    Model: string;
    Brand: string;
    Manufacturer: string;
    ServerHost?: string;

    // iOS
    forceTouchAvailable: boolean;
    interfaceIdiom: string;
    osVersion: string;
    systemName: string;
}

/**
 * A key-value storage based upon `SharedPreferences` on Android.
 *
 * These types are based on Android though everything should be the same between
 * platforms.
 */
interface MMKVManager {
    /**
     * Get the value for the given `key`, or null
     * @param key The key to fetch
     */
    getItem: (key: string) => Promise<string | null>;
    /**
     * Deletes the value for the given `key`
     * @param key The key to delete
    */
    removeItem: (key: string) => void;
    /**
     * Sets the value of `key` to `value`
     */
    setItem: (key: string, value: string) => void;
    /**
     * Goes through every item in storage and returns it, excluding the
     * keys specified in `exclude`.
     * @param exclude A list of items to exclude from result
     */
    refresh: (exclude: string[]) => Promise<Record<string, string>>;
    /**
     * You will be murdered if you use this function.
     * Clears ALL of Discord's settings.
     */
    clear: () => void;
}

interface DCDFileManager {
    /**
     * @param path **Full** path to file
     */
    fileExists: (path: string) => Promise<boolean>;
    /**
     * Allowed URI schemes on Android: `file://`, `content://` ([See here](https://developer.android.com/reference/android/content/ContentResolver#accepts-the-following-uri-schemes:_3))
     */
    getSize: (uri: string) => Promise<boolean>;
    /**
     * @param path **Full** path to file
     * @param encoding Set to `base64` in order to encode response
     */
    readFile(path: string, encoding: "base64" | "utf8"): Promise<string>;
    /**
     * Beware! This function has differing functionality on IOS and Android.
     * @param storageDir Either `cache` or `documents`.
     * @param path Path in `storageDir`, parents are recursively created.
     * @param data The data to write to the file
     * @param encoding Set to `base64` if `data` is base64 encoded.
     * @returns Promise that resolves to path of the file once it got written
     */
    writeFile(storageDir: "cache" | "documents", path: string, data: string, encoding: "base64" | "utf8"): Promise<string>;
    getConstants: () => {
        /**
         * The path the `documents` storage dir (see {@link writeFile}) represents.
         */
        DocumentsDirPath: string;
    };
    /**
     * Will apparently cease to exist some time in the future so please use {@link getConstants} instead.
     * @deprecated
     */
    DocumentsDirPath: string;
}

type Indexable<Type> = { [index: string]: Type }

type EmitterEvent = "SET" | "GET" | "DEL";

interface EmitterListenerData {
	path: string[];
	value?: any;
}

type EmitterListener = (
	event: EmitterEvent,
	data: EmitterListenerData | any
) => any;

type EmitterListeners = Indexable<Set<EmitterListener>>;

interface Emitter {
    listeners: EmitterListeners;
    on: (event: EmitterEvent, listener: EmitterListener) => void;
    off: (event: EmitterEvent, listener: EmitterListener) => void;
    once: (event: EmitterEvent, listener: EmitterListener) => void;
    emit: (event: EmitterEvent, data: EmitterListenerData) => void;
}

interface StorageBackend {
    get: () => unknown | Promise<unknown>;
    set: (data: unknown) => void | Promise<void>;
}

interface LoaderConfig {
    customLoadUrl: {
        enabled: boolean;
        url: string;
    };
    loadReactDevTools: boolean;
}

interface LoaderIdentity {
    name: string;
    features: {
        loaderConfig?: boolean;
        devtools?: {
            prop: string;
            version: string;
        }
    }
}

interface VendettaObject {
    patcher: {
        after: typeof _spitroast.after;
        before: typeof _spitroast.before;
        instead: typeof _spitroast.instead;
    };
    metro: {
        findByProps: PropsFinder;
        findByPropsAll: PropsFinderAll;
        findByDisplayName: (name: string, defaultExp?: boolean) => any;
        findByDisplayNameAll: (name: string, defaultExp?: boolean) => any[];
        findByStoreName: (storeName: string) => any;
        common: {
            constants: PropIntellisense<"API_HOST">;
            channels: PropIntellisense<"getVoiceChannelId">;
            i18n: PropIntellisense<"Messages">;
            url: PropIntellisense<"openURL">;
            toasts: PropIntellisense<"open" | "close">;
            stylesheet: PropIntellisense<"createThemedStyleSheet">;
            clipboard: typeof _Clipboard;
            assets: PropIntellisense<"registerAsset">;
            invites: PropIntellisense<"acceptInviteAndTransitionToInviteChannel">;
            commands: PropIntellisense<"getBuiltInCommands">;
            navigation: PropIntellisense<"pushLazy">;
            navigationStack: PropIntellisense<"createStackNavigator">;
            NavigationNative: PropIntellisense<"NavigationContainer">;
            React: typeof _React;
            ReactNative: typeof _RN;
        };
    };
    constants: {
        DISCORD_SERVER: string;
        GITHUB: string;
    };
    utils: {
        copyText: (content: string) => void;
        findInReactTree: (tree: { [key: string]: any }, filter: SearchFilter) => void;
        findInTree: (tree: { [key: string]: any }, filter: SearchFilter, options: FindInTreeOptions) => any;
        safeFetch: (input: RequestInfo, options: RequestInit) => Promise<Response>;
        unfreeze: (obj: object) => object;
    };
    debug: {
        connectToDebugger: (url: string) => void;
        // TODO: Type output?
        getDebugInfo: () => void;
    }
    ui: {
        components: {
            Forms: PropIntellisense<"Form" | "FormSection">;
            General: PropIntellisense<"Button" | "Text" | "View">;
            Search: _React.Component;
        }
        toasts: {
            showToast: (content: string, asset: number) => void;
        };
        assets: {
            all: Indexable<Asset>;
            find: (filter: (a: any) => void) => Asset | null | undefined;
            getAssetByName: (name: string) => Asset;
            getAssetByID: (id: number) => Asset;
            getAssetIDByName: (name: string) => number;
        };
    };
    plugins: {
        plugins: Indexable<Plugin>;
        fetchPlugin: (id: string, enabled: boolean) => void;
        evalPlugin: (plugin: Plugin) => void;
        stopPlugin: (id: string, disable: boolean) => void;
        removePlugin: (id: string) => void;
        getSettings: (id: string) => JSX.Element;
    };
    commands: {
        registerCommand: (command: ApplicationCommand) => () => void;
    };
    storage: {
        createProxy: <T>(target: T) => { proxy: T, emitter: Emitter };
        useProxy: <T>(storage: T) => T;
        createStorage: <T>(backend: StorageBackend) => Promise<Awaited<T>>;
        wrapSync: <T extends Promise<any>>(store: T) => Awaited<T>;
        awaitSyncWrapper: (store: any) => Promise<void>;
        createMMKVBackend: (store: string) => StorageBackend;
        createFileBackend: (file: string) => StorageBackend;
    };
    settings: Settings;
    loader: {
        identity?: LoaderIdentity;
        config: LoaderConfig;
    };
    logger: Logger;
    version: string;
    unload: () => void;
}

interface VendettaPluginObject {
    manifest: PluginManifest,
    storage: Indexable<any>,
}

declare global {
    type React = typeof _React;
    interface Window {
        [key: PropertyKey]: any;
        modules: MetroModules;
        vendetta: VendettaObject;
        React: typeof _React;
        __vendetta_loader?: LoaderIdentity;
    }
}
