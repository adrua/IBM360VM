export class instruction {
    constructor(opCode){
        this.opCode = opCode;
        this.addressMode = opCode >>> 6;
    }

    Registers(uByte) {
        this.R1 = uByte >>> 4;
        this.R2 = uByte & 0x0F;
    }

    Address1(uByte, uByte2) {
        this.R3 = uByte >>> 4;
        this.displacement = (uByte & 0x0F << 8) + uByte2;
    }

    Address2(uByte, uByte2) {
        this.R4 = uByte >>> 4;
        this.displacement2 = (uByte & 0x0F << 8) + uByte2;
    }    
}