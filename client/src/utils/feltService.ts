export const feltToString = (felt: BigInt): string => {
    let hexString = felt.toString(16);
    if (hexString.length % 2 !== 0) {
        hexString = "0" + hexString;  // Ensure even length
    }

    let decodedString = "";
    for (let i = 0; i < hexString.length; i += 2) {
        const hexCode = hexString.slice(i, i + 2);  // Get each byte in hex
        decodedString += String.fromCharCode(parseInt(hexCode, 16));  // Convert to character
    }

    return decodedString.substring(1);
};

export const stringToFelt = (value: string): BigInt => {
    let encoded = "0x";
    for (const char of value) {
        const hex = char.charCodeAt(0).toString(16).padStart(2, "0");  // Convert to hex
        encoded += hex;
    }
    console.log(BigInt(encoded));
    return BigInt(encoded);
}