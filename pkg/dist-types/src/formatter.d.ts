import { Merge } from 'type-fest';
/**
 * a transformer transforms and formats using symbols/patters to find the start and end of a piece of text easily and formats it
 */
export interface Transformer {
    /**
     * note: currently unused
     */
    name: string;
    /**
     * the symbols to match to start matching a transformation
     */
    open: string | RegExp;
    /**
     * the symbols to match to stop matching a transformation
     */
    close: string | RegExp;
    /**
     * tf the transformed text is to be transformed again
     */
    recursive: boolean;
    /**
     * if padding is expected to be inbetween transformers
     * true if padding is wanted, false if it is unwanted
     * this is to prevent potentially unwanted ambiguities
     * for example `*italic**bold or italic?**`
     * while the maintainer of a project may expect what can happen to an average user it may be ambiguious
     * to help with this, it will not transform `*italic**bold or italic**` without padding
     * for example `*italic* **bold!**` or `*italic* *italic!* *`
     * however padding may have small performance cost for extera checks.
     * padding only checks the same symbol however
     */
    padding: boolean;
    /**
     * the function to validate if the text should be transformed
     * if the validation is false the result will be ignored
     */
    validate: (text: string) => boolean;
    /**
     * the function to transform the text into something else
     */
    transformer: (text: string) => string;
}
export declare type TransformerOptions = Merge<Transformer, {
    /**
     * symbol sets both open and close
     */
    symbol?: string | RegExp;
    /**
     * the symbols to match to start matching a transformation
     */
    open?: string | RegExp;
    /**
     * the symbols to match to stop matching a transformation
     */
    close?: string | RegExp;
    /**
     * if padding is expected to be inbetween transformers
     * true if padding is wanted, false if it is unwanted
     * this is to prevent potentially unwanted ambiguities
     * for example `*italic**bold or italic?**`
     * while the maintainer of a project may expect what can happen to an average user it may be ambiguious
     * to help with this, it will not transform `*italic**bold or italic**` without padding
     * for example `*italic* **bold!**` or `*italic* *italic!* *`
     * however padding may have small performance cost for extera checks.
     * padding only checks the same symbol however
     */
    padding?: boolean;
    /**
    * the function to validate if the text should be transformed
    * if the validation is false the result will be ignored
    */
    validate?: (text: string) => boolean;
    /**
     * if the transformed text is to be transformed again
     */
    recursive?: boolean;
}>;
/**
 * The formatter class contains transformers to transform and format code
 */
export default class Formatter {
    transformers: Transformer[];
    /**
     * define the symbol and the transformer
     * Add a transformer to transform code when formatting text
     * Transformers are are used in the order added so make sure to add transformer that may have conflicting syntax in the correct order
     */
    addTransformer(params: TransformerOptions): void;
    /**
     * slower than format but supports regex
     * much simpler
     */
    formatRegex(text: string): string;
    /**
     * transform and format the text
     */
    format(text: string): string;
}
