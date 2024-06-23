interface UnknownObject {
    [key: string]: unknown;
}
type TText = UnknownObject & {
    text: string;
};
type TDescendant = TElement | TText;

type TElement = UnknownObject & {
    children: TDescendant[];
    type: string;
};
export type TPostContent = TElement[];
