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
        this._instructions[0x05] = { "Name": "BALR", "Description": "Branch and Link Register", "AddressMode": "RR", "Length": 2, "Exec": () => this.BranchAndLinkRegister()  }; 
        this._instructions[0x07] = { "Name": "BCR", "Description": "Branch Condition Register", "AddressMode": "RR", opcode: 0x07, "Length": 2  }; 
        this._instructions[0x18] = { "Name": "LR", "Description": "Load", "AddressMode": "RR", opcode: 0x18, "Length": 2, "Exec": () => this.LoadRegister() }; 
        this._instructions[0x19] = { "Name": "CR", "Description": "Compare Register", "AddressMode": "RR", opcode: 0x19,  "Length": 2, "Exec": () => this.CompareRegister() }; 
        this._instructions[0x1A] = { "Name": "AR", "Description": "Add Register (32)", "AddressMode": "RR", opcode: 0x1A, "Length": 2, "Exec": () => this.AddRegister()  }; 
        this._instructions[0x1B] = { "Name": "SR", "Description": "Subtract", "AddressMode": "RR", opcode: 0x1B, "Length": 2, "Exec": () => this.SubtractRegister()   }; 

        // RR Extendend mnemonics
        this._instructions[0x07F0] = { "Name": "BR", "Description": "Branch Register (Unconditional)", "AddressMode": "RRX", opcode: 0x07, "mask": 0xf, "Length": 2  }; 

        //RX
        this._instructions[0x41] = { "Name": "LA", "Description": "Load Address", "AddressMode": "RX", opcode: 0x41, "Length": 4, "Exec": () => this.LoadAddress()   }; 
        this._instructions[0x4E] = { "Name": "CVD", "Description": "Convert To Decimal", "AddressMode": "RX", opcode: 0x4E, "Length": 4  }; 
        this._instructions[0x47] = { "Name": "BC", "Description": "Branch if Not Low (C)", "AddressMode": "RX", opcode: 0x47, "Length": 4, "Exec": () => this.BranchCondition()    }; 
        this._instructions[0x50] = { "Name": "ST", "Description": "Store", "AddressMode": "RX", "Length": 4, "Exec": () => this.Store()  }; 
        this._instructions[0x58] = { "Name": "L", "Description": "Load", "AddressMode": "RX", "Length": 4, "Exec": () => this.Load()  }; 
        this._instructions[0x59] = { "Name": "C", "Description": "Compare", "AddressMode": "RX", opcode: 0x59, "Length": 4, "Exec": () => this.Compare()   }; 
        this._instructions[0x5A] = { "Name": "A", "Description": "Add", "AddressMode": "RX", "Length": 4, "Exec": () => this.Add()  }; 

        // RX Extendend mnemonics
        this._instructions[0x4770] = { "Name": "BNE", "Description": "Branch if Not Equal (C)", "AddressMode": "RXX", opcode: 0x47, "mask": 0x7, "Length": 4  }; 
        this._instructions[0x4780] = { "Name": "BE", "Description": "Branch if Equal (C)", "AddressMode": "RXX", opcode: 0x47, "mask": 0x8, "Length": 4  }; 
        this._instructions[0x47B0] = { "Name": "BNL", "Description": "Branch if Not Low (C)", "AddressMode": "RXX", opcode: 0x47, "mask": 0xB, "Length": 4  }; 
        this._instructions[0x47F0] = { "Name": "B", "Description": "Unconditional Branch", "AddressMode": "RXX", opcode: 0x47, "mask": 0xF, "Length": 4  }; 

        //RS Register Storage    
        this._instructions[0x90] = { "Name": "STM", "Description": "Store Multiple Register", opcode: 0x90, "AddressMode": "RRS_2", "Length": 4, "Exec": () => this.StoreMultiple()   }; 
        this._instructions[0x98] = { "Name": "LM", "Description": "Load Multiple Register", opcode: 0x98, "AddressMode": "RRS_2", "Length": 4  }; 

        //SI Storage Immediate
        this._instructions[0x92] = { "Name": "MVI", "Description": "Move Immediate", "AddressMode": "SI", opcode: 0x92, "Length": 4, "Exec": () => this.MoveImmediate()  }; 
        this._instructions[0x95] = { "Name": "CLI", "Description": "Compare Logical Immediate", "AddressMode": "SI", opcode: 0x95, "Length": 4, "Exec": () => this.CompareImmediate()  }; 
        this._instructions[0x96] = { "Name": "OI", "Description": "OR Immediate", "AddressMode": "SI", opcode: 0x96, "Length": 4,  "Exec": () => this.OrImmediate()  }; 
        //SS
        this._instructions[0xF3] = { "Name": "UNPK", "Description": "Unpack", "AddressMode": "SS", opcode: 0xF3, "Length": 6  }; 
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
            throw "Out of word boundary (" + address.toString(16) +")";
        }

        if(address >= this._mem.length) {
            throw "Out of memory boundary (" + address.toString(16) +")";
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

    LoadRegister() {
        this._regs[this._instr.R1] = this._regs[this._instr.R2];
    }

    //Pendiente validacion con el manual de ASM360
    CompareRegister() { 
        //try {
            var value = this._regs[this._instr.R1] - this._regs[this._instr.R2];
            this.PSW.setConditionCodeInt32(value);
        //} catch {
        //    this.PSW.ConditionCode = 0b11;
        //}        
    }    

    AddRegister() {         
        //try {
            this._regs[this._instr.R1] +=  this._regs[this._instr.R2];
            this.PSW.setConditionCodeInt32(this._regs[this._instr.R1]);
        //} catch {
        //    this.PSW.ConditionCode = 0b11;
        //}        
    }    

    SubtractRegister() {         
        //try {
            this._regs[this._instr.R1] -=  this._regs[this._instr.R2];
            this.PSW.setConditionCodeInt32(this._regs[this._instr.R1]);
        //} catch {
        //    this.PSW.ConditionCode = 0b11;
        //}        
    }    

    LoadAddress() {
        this._regs[this._instr.R1] = this.getAddressX;
    }

    BranchCondition() { 
        var addr = this.getAddressX;
        if(this._psw.checkConditionCode( this._instr.R1)) {
            this._psw.Address = addr;
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
    
    //Pendiente validacion con el manual de ASM360
    Compare() { 
        var addr = this.checkAddressBoundary(this.getAddressX);
        
        //try {
            var value = this._regs[this._instr.R1] - this._mem.getInt32(addr);
            this.PSW.setConditionCodeInt32(value);
        //} catch {
        //    this.PSW.ConditionCode = 0b11;
        //}        
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

    StoreMultiple() {
        var addr = this.checkAddressBoundary(this.getAddressSSource);
            
        for(var rInx = this._instr.R1; rInx != this._instr.R2; rInx = (rInx + 1) & 0xF) {
            this._mem.setUInt32(addr, this._regs[rInx]);
            addr += 4;
        }
            
    }

    //SI
    MoveImmediate() {
        var address = this.getAddressSSource;
        if (address >= this._mem.length) {
            throw "Out of memory boundary (" + address.toString(16) + ")";
        }
      
        this._mem[address] =  this._mem[this._psw.Address - 3];            
    }

    CompareImmediate() {
        var address = this.getAddressSSource;
        if (address >= this._mem.length) {
            throw "Out of memory boundary (" + address.toString(16) + ")";
        }

        var value = this._mem[address] - this._mem[this._psw.Address - 3];
        this.PSW.setConditionCodeInt32(value);
    }

    OrImmediate() {
        var address = this.getAddressSSource;
        if (address >= this._mem.length) {
            throw "Out of memory boundary (" + address.toString(16) + ")";
        }

        this._mem[address] |= this._mem[this._psw.Address - 3];
        this.PSW.setConditionCodeBoolean(this._mem[address]);
    }

}
