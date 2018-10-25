import { psw } from './psw-class'
import { memory } from './memory-class'

export class cpu {

    constructor() {
        this._psw = new psw();
        this._mem = new memory(4096);
        this._insts = [];
        this._regs = new Uint32Array(16);
        this._instructions = []; 
            
        this._instructions[0x50] = { "Name": "ST", "Description": "Store", "AddressMode": "RX", "Length": 4, "Exec": () => this.Store()  }; 
        this._instructions[0x58] = { "Name": "L", "Description": "Load", "AddressMode": "RX", "Length": 4, "Exec": () => this.Load()  }; 
    }    

    get PSW() {
        return this._psw;
    }

    get Memory() {
        return this._mem;
    }

    get Registers() {
        return this._regs;
    }

    get getAddressX() {
        const mask24 = 0xFFFFFF; 
        return (this._regs[this._instr.R3] & mask24) + this._instr.displacement + ((this._instr.R2)?(this._regs[this._instr.R2] & mask24):0);
    }

    get getAddressSSource() {
        const mask24 = 0xFFFFFF; 
        return (this._regs[this._instr.R3] & mask24) + this._instr.displacement;
    }

    get getAddressSTarget() {
        const mask24 = 0xFFFFFF; 
        return (this._regs[this._instr.R3] & mask24) + this._instr.displacement;
    }

    ExecNextInstruction() {
        this._instr = this._mem.getInstruction(this._psw.Address);
        var instr = this._instructions[this._instr.opCode];
        if(!instr) {
            throw  "Instruction " +  this._instr.opCode.toString(16) + "H not implemented"
        }
        this._psw.Address = this._instr.address;
        instr.Exec();    
    }

    Load() { 

        var addr = this.getAddressX;
        
        if(addr & 0x3) {
            throw "Out of word boundary (" + addr.toString(16) +")";
        }

        if(addr >= this._mem.length) {
            throw "Out of memory boundary (" + addr.toString(16) +")";
        }

        //TODO: Validate Memory key check

        this._regs[this._instr.R1] = this._mem.getUInt32(addr);
    }    

    Store() { 

        var addr = this.getAddressX;
        
        if(addr & 0x3) {
            throw "Out of word boundary (" + addr.toString(16) +")";
        }

        if(addr >= this._mem.length) {
            throw "Out of memory boundary (" + addr.toString(16) +")";
        }

        //TODO: Validate Memory key check

        this._mem.setUInt32(addr, this._regs[this._instr.R1]);
    }    

}
