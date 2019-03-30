import { Merge } from 'type-fest';
/**
 * A transformer transforms what is found between the symbols
 */
interface Transformer {
    /**
     * note: currently unused
     */
    name: string;
    /**
     * The symbols to match to start matching a transformation
     */
    open: string;
    /**
     * The symbols to match to stop matching a transformation
     */
    close: string;
    /**
     * If the transformed text is to be transformed again
     */
    recursive: boolean;
    /**
     * The function to validate if the text should be transformed
     * if the validation is false the result will be ignored
     */
    validate: (text: string) => boolean;
    /**
     * The function to transform the text into something else
     */
    transformer: (text: string) => string;
}
declare type TransformerOptions = Merge<Transformer, {
    /**
     * @depricated
     * please use open instead, symbol is depricated
     */
    symbol?: string;
    /**
     * The symbols to match to start matching a transformation
     */
    open?: string;
    /**
     * The symbols to match to stop matching a transformation
     */
    close?: string;
    /**
    * The function to validate if the text should be transformed
    * if the validation is false the result will be ignored
    */
    validate?: (text: string) => boolean;
    /**
     * If the transformed text is to be transformed again
     */
    recursive?: boolean;
}>;
/**
 * The formatter class contains transformers to transform and format code
 */
export default class Formatter {
    transformers: Transformer[];
    /**
     * Define the symbol and the transformer
     * Add a transformer to transform code when formatting text
     * Transformers are are used in the order added so make sure to add transformer that may have conflicting syntax in the correct order
     */
    addTransformer(params: TransformerOptions): void;
    /**
     * transform and format the text
     */
    format(text: string): string;
}
export {};
