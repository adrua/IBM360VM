import { psw } from './psw-class'
import { memory } from './memory-class'

export class cpu {

    constructor() {
        this._psw = new psw();
        this._mem = new memory(4096);
        this._insts = [];
        this._regs = new Uint32Array(16);
        this._instructions = []; 
            
        //RR
        this._instructions[0x05] = { "Name": "BALR", "Description": "Branch and Link Register", "AddressMode": "RR", "Length": 4, "Exec": () => this.BranchAndLinkRegister()  }; 
        //RX
        this._instructions[0x50] = { "Name": "ST", "Description": "Store", "AddressMode": "RX", "Length": 4, "Exec": () => this.Store()  }; 
        this._instructions[0x58] = { "Name": "L", "Description": "Load", "AddressMode": "RX", "Length": 4, "Exec": () => this.Load()  }; 
        this._instructions[0x5A] = { "Name": "A", "Description": "Add", "AddressMode": "RX", "Length": 4, "Exec": () => this.Add()  }; 
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
    
    getInstructions(address, length) {
        var instrs = new Array();
        for(var kInx = 0; kInx < length; kInx++){
            var instr = this._mem.getInstruction(address);
            instr.instruction = this._instructions[instr.opCode];
            instrs.push(instr);
            address = instr.address;    
        }
        return instrs;    
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

    checkAddressBoundary(address) {
        if(address & 0b11) {
            throw "Out of word boundary (" + addr.toString(16) +")";
        }

        if(address >= this._mem.length) {
            throw "Out of memory boundary (" + addr.toString(16) +")";
        }

        return address;
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

    BranchAndLinkRegister() {
        this._regs[this._instr.R1] = this._psw.Address;
        if(this._instr.R2) {
            this._psw.Address = this._regs[this._instr.R2];
        }
    }

    Store() { 
        var addr = this.checkAddressBoundary(this.getAddressX);
        this._mem.setUInt32(addr, this._regs[this._instr.R1]);
    }    

    Load() { 
        var addr = this.checkAddressBoundary(this.getAddressX);        
        this._regs[this._instr.R1] = this._mem.getUInt32(addr);
    }    

    Add() { 
        var addr = this.checkAddressBoundary(this.getAddressX);
        
        //try {
            this._regs[this._instr.R1] +=  this._mem.getInt32(addr);
            this.PSW.setConditionCodeInt32(this._regs[this._instr.R1]);
        //} catch {
        //    this.PSW.ConditionCode = 0b11;
        //}
        
    }    

}
