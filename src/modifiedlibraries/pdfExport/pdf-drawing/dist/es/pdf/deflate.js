import { deflate as pakoDeflate } from '../../../../pako-esm';

export var deflate = pakoDeflate;

export function supportsDeflate() {
    return true;
}

