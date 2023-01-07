import * as MiscAppFxns from "../app/misc";
import {
    validateEvent,
    verifySignature,
} from "nostr-tools";

const isValidObj = MiscAppFxns.isValidObj

export const doesEventValidate = (event) => {
    let ok = false;
    let veryOk = false;
    if (isValidObj(event)) {
        ok = validateEvent(event)
        veryOk = verifySignature(event)
    }
    if ((ok) && (veryOk)) {
        return true;
    }
    return false;
}
