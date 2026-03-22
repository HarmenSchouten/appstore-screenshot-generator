import { TextLayerProps } from "../../types.ts";

export const TextLayer = (props: TextLayerProps) => {
    return <div>{props.text}</div>;
}