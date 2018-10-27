import { instruction }  from './instruction-class'

export class memory extends Uint8Array{

    constructor(length) {
        super(length || 4096);
    }    

    getInt32(address) {
        var data = new Int32Array(1);
        for(var k = address; k < address + 4; k++) {
            data[0] <<= 8;
            data[0] |= this[k];
        }
           
        return data[0];
    }

    getUInt32(address) {
        var data = new Uint32Array(1);
        for(var k = address; k < address + 4; k++) {
            data[0] <<= 8;
            data[0] |= this[k];
        }
           
        return data[0];
    }

    setUInt32(address, data) {
        for(var k = address + 3; k >= address; k--) {
            this[k] = data & 0xff;
            data >>>= 8;
        }
           
        return data;
    }

    getInstruction(address) {
        var instr = new instruction(this[address++]);

        instr.Registers(this[address++]);

        switch(instr.adressMode){
            case 0: //RR
                instr.length = 2;
                break;
            case 1: //RX
            case 2: //RS
                instr.length = 4;
                instr.Address1(this[address++], this[address++]);
                break;
            case 3: //SS
                instr.length = 6;
                instr.Address1(this[address++], this[address++]);
                instr.Address2(this[address++], this[address++]);
                break;
        }

        instr.address = address;

        return instr;
    }

}
