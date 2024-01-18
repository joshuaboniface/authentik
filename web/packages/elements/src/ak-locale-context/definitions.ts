import type { LocaleModule } from "@lit/localize";
import { msg } from "@lit/localize";

import * as _enLocale from "../locales/en.js";
import { AkLocale, LocaleRow } from "./types";

export const DEFAULT_FALLBACK = "en";

const enLocale: LocaleModule = _enLocale;

export { enLocale };

// NOTE: This table cannot be made any shorter, despite all the repetition of syntax. Bundlers look
// for the `await import` string as a *string target* for doing alias substitution, so putting
// the import in some sort of abstracting function doesn't work. The same is true for the `msg()`
// function, which `localize` uses to find strings for extraction and translation. Likewise,
// because this is a file-level table, the `msg()` must be thunked so that they're re-run when
// the user changes the locale.

// NOTE: The matchers try to conform loosely to [RFC
// 5646](https://www.rfc-editor.org/rfc/rfc5646.txt), "Tags for the Identification of Languages." In
// practice, language tags have been seen using both hyphens and underscores, and the Chinese
// language uses both "regional" and "script" suffixes. The regexes use the language and any region
// or script.
//
// Chinese locales usually (but not always) use the script rather than region suffix. The default
// (optional) fallback for Chinese (zh) is "Chinese (simplified)", which is why it has that odd
// regex syntax at the end which means "match zh as long as it's not followed by a [:word:] token";
// Traditional script and the Taiwanese are attempted first, and if neither matches, anything
// beginning with that generic "zh" is mapped to "Chinese (simplified)."

// - Code for Lit/Locale
// - Regex for matching user-supplied locale.
// - Text Label
// - Locale loader.

// prettier-ignore
const debug: LocaleRow = [
    "pseudo-LOCALE",  /^pseudo/i,  () => msg("Pseudolocale (for testing)"),  async () => await import("../locales/pseudo-LOCALE.js"),
];

// prettier-ignore
const LOCALE_TABLE: LocaleRow[] = [
    ["en",      /^en([_-]|$)/i,      () => msg("English"),               async () => await import("../locales/en.js")],
    ["es",      /^es([_-]|$)/i,      () => msg("Spanish"),               async () => await import("../locales/es.js")],
    ["de",      /^de([_-]|$)/i,      () => msg("German"),                async () => await import("../locales/de.js")],
    ["fr",      /^fr([_-]|$)/i,      () => msg("French"),                async () => await import("../locales/fr.js")],
    ["ko",      /^ko([_-]|$)/i,      () => msg("Korean"),                async () => await import("../locales/ko.js")],
    ["nl",      /^nl([_-]|$)/i,      () => msg("Dutch"),                 async () => await import("../locales/nl.js")],
    ["pl",      /^pl([_-]|$)/i,      () => msg("Polish"),                async () => await import("../locales/pl.js")],
    ["tr",      /^tr([_-]|$)/i,      () => msg("Turkish"),               async () => await import("../locales/tr.js")],
    ["zh-Hant", /^zh[_-](HK|Hant)/i, () => msg("Chinese (traditional)"), async () => await import("../locales/zh-Hant.js")],
    ["zh_TW",   /^zh[_-]TW$/i,       () => msg("Taiwanese Mandarin"),    async () => await import("../locales/zh_TW.js")],
    ["zh-Hans", /^zh(\b|_)/i,        () => msg("Chinese (simplified)"),  async () => await import("../locales/zh-Hans.js")],
    debug
];

export const LOCALES: AkLocale[] = LOCALE_TABLE.map(([code, match, label, locale]) => ({
    code,
    match,
    label,
    locale,
}));

export default LOCALES;
