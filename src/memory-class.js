export class memory extends Uint8Array{

    constructor(length) {
        super(length || 4096);
    }    

    getUInt32(address) {
        var data = 0 >> 0;
        for(var k = address; k < address + 4; k++) {
            data <<= 8;
            data += this[k];
        }
           
        return data;
    }

    setUInt32(address, data) {
        for(var k = address + 4; k > address; k--) {
            this[k] = data & 0xff;
            data >>>= 8;
        }
           
        return data;
    }

    getInstruction(address) {
        var instr = { 
            opCode: this[address++]
        }

        instr.adressMode = instr.opCode >>> 6;

        var uByte = this[address++];

        instr.R1 = uByte >>> 4;
        instr.R2 = uByte & 0x0F;    

        if(!instr.adressMode) { ////RR Statement
            instr.length = 2;
        } else { //RX Statement
            instr.length = 4;
            uByte = this[address++];
            instr.R3 = uByte >>> 4;
            instr.displacement = (uByte & 0x0F << 8) + this[address++];        
    
            if(instr.adressMode == 3) { //SS Statement
                uByte = this[address++];
                instr.length = 6;
                instr.R4 = uByte >>> 4;
                instr.displacement2 = (uByte & 0x0F << 8) + this[address++];    
            }
        }

        instr.address = address;

        return instr;
    }

}
