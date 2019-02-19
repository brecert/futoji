/**
 * A transformer transforms what is found between the symbols
 */
interface ITransformer {
    /**
     * note: currently unused
     */
    name: string;
    /**
     * The symbol to match when opening and closing transformation
     */
    symbol: string;
    /**
     * If the transformed text is to be transformed again
     */
    recursive: boolean;
    /**
     * The transform the text into something else
     */
    transformer: (text: string) => string;
}
/**
 * The formatter class contains transformers to transform and format code
 */
export default class Formatter {
    transformers: ITransformer[];
    /**
     * Define the symbol and the transformer
     * Add a transformer to transform code when formatting text
     * Transformers are are used in the order added so make sure to add transformer that may have conflicting syntax in the correct order
     */
    addTransformer(params: ITransformer): void;
    /**
     * transform and format the text
     */
    format(text: string): string;
}
export {};
