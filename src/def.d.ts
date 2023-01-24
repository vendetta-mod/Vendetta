import * as _spitroast from "spitroast";
import _React from "react";
import _RN from "react-native";

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

export interface ApplicationCommand {
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

export enum ApplicationCommandInputType {
    BUILT_IN,
    BUILT_IN_TEXT,
    BUILT_IN_INTEGRATION,
    BOT,
    PLACEHOLDER
}

export interface ApplicationCommandOption {
    name: string;
    description: string;
    required?: boolean;
    type: ApplicationCommandOptionType;
    displayName: string;
    displayDescription: string;
}

export enum ApplicationCommandOptionType {
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
    ATTACHMENT
}

export enum ApplicationCommandType {
    CHAT = 1,
    USER,
    MESSAGE
}

export interface CommandContext {
    channel: any;
    guild: any;
}

export interface CommandResult {
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

type Indexable<Type> = { [index: string]: Type }

interface VendettaObject {
    patcher: {
        after: typeof _spitroast.after;
        before: typeof _spitroast.before;
        instead: typeof _spitroast.instead;
        unpatchAll: typeof _spitroast.unpatchAll;
    };
    metro: {
        findByProps: PropsFinder;
        findByPropsAll: PropsFinderAll;
        findByDisplayName: (name: string, defaultExp: boolean) => any;
        findByDisplayNameAll: (name: string, defaultExp: boolean) => any[];
        common: {
            constants: PropIntellisense<"API_HOST">;
            channels: PropIntellisense<"getVoiceChannelId">;
            i18n: PropIntellisense<"Messages">;
            url: PropIntellisense<"openURL">;
            toasts: PropIntellisense<"open" | "close">;
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
    };
    debug: {
        connectToDebugger: (url: string) => void;
    }
    ui: {
        components: {
            Forms: PropIntellisense<"Form" | "FormSection">;
            General: PropIntellisense<"Button" | "Text" | "View">;
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
        fetchPlugin: (id: string) => void;
        evalPlugin: (plugin: Plugin) => void;
        stopPlugin: (id: string) => void;
        removePlugin: (id: string) => void;
        getSettings: (id: string) => JSX.Element;
    };
    commands: {
        registerCommand: (command: ApplicationCommand) => () => void;
    };
    settings: Settings;
    logger: Logger;
    version: string;
}

declare global {
    type React = typeof _React;
    interface Window {
        [key: PropertyKey]: any;
        modules: MetroModules;
        vendetta: VendettaObject;
        React: typeof _React;
    }
}
