//-------------------------------------------
// Basic Assembler Language IBM 360
// Analizador Semantico Generador de Codigo
// Por Adalberto Raul Rua Aguirre
// Nov 01/2018
//-------------------------------------------
class bal360sem {
    constructor(bal360) {
        this.symbols = {};
        this.literals = bal360.literals;
        this.literalsCount  = bal360.literalsCount;
        this.pc = 0;
        this.opcodes = {};
        this.errors = [];
        this.baseRegister = 0;

        this.lastLiteral = {};

        //RR
        this.opcodes.BALR = { "Name": "BALR", "Description": "Branch and Link Register", opcode: 0x05, "AddressMode": "RR", "Length": 2 };
        this.opcodes.BCR = { "Name": "BCR", "Description": "Branch Condition Register", "AddressMode": "RR", opcode: 0x07, "Length": 2  }; 
        this.opcodes.LR = { "Name": "LR", "Description": "Load", "AddressMode": "RR", opcode: 0x18, "Length": 2  }; 
        this.opcodes.CR = { "Name": "CR", "Description": "Compare Register", "AddressMode": "RR", opcode: 0x19,  "Length": 2  }; 
        this.opcodes.AR = { "Name": "SR", "Description": "Add Register (32)", "AddressMode": "RR", opcode: 0x1A, "Length": 2  }; 
        this.opcodes.SR = { "Name": "SR", "Description": "Subtract", "AddressMode": "RRX", opcode: 0x1B, "Length": 2  }; 

        // RR Extendend mnemonics
        this.opcodes.BR = { "Name": "BR", "Description": "Branch Register (Unconditional)", "AddressMode": "RRX", opcode: 0x07, "mask": 0xf, "Length": 2  }; 

        //RX
        this.opcodes.LA = { "Name": "LA", "Description": "Load Address", "AddressMode": "RX", opcode: 0x41, "Length": 4  }; 
        this.opcodes.CVD = { "Name": "CVD", "Description": "Convert To Decimal", "AddressMode": "RX", opcode: 0x4E, "Length": 4  }; 
        this.opcodes.BC = { "Name": "BC", "Description": "Branch if Not Low (C)", "AddressMode": "RX", opcode: 0x47, "Length": 4  }; 
        this.opcodes.ST = { "Name": "ST", "Description": "Store", "AddressMode": "RX", opcode: 0x50, "Length": 4  }; 
        this.opcodes.L = { "Name": "L", "Description": "Load", "AddressMode": "RX", opcode: 0x58, "Length": 4  }; 
        this.opcodes.C = { "Name": "C", "Description": "Compare", "AddressMode": "RX", opcode: 0x59, "Length": 4  }; 
        this.opcodes.A = { "Name": "A", "Description": "Add", "AddressMode": "RX", opcode: 0x5A, "Length": 4  };         

        // RX Extendend mnemonics
        this.opcodes.BNE = { "Name": "BNE", "Description": "Branch if Not Equal (C)", "AddressMode": "RXX", opcode: 0x47, "mask": 0x7, "Length": 4  }; 
        this.opcodes.BE = { "Name": "BE", "Description": "Branch if Equal (C)", "AddressMode": "RXX", opcode: 0x47, "mask": 0x8, "Length": 4  }; 
        this.opcodes.BNL = { "Name": "BNL", "Description": "Branch if Not Low (C)", "AddressMode": "RXX", opcode: 0x47, "mask": 0xB, "Length": 4  }; 
        this.opcodes.B = { "Name": "B", "Description": "Unconditional Branch", "AddressMode": "RXX", opcode: 0x47, "mask": 0xF, "Length": 4  }; 

        //RS Register Storage    
        this.opcodes.STM = { "Name": "STM", "Description": "Store Multiple Register", opcode: 0x90, "AddressMode": "RRS_2", "Length": 4  }; 
        this.opcodes.LM = { "Name": "LM", "Description": "Load Multiple Register", opcode: 0x98, "AddressMode": "RRS_2", "Length": 4  }; 

        //SI Storage Immediate
        this.opcodes.MVI = { "Name": "MVI", "Description": "Move Immediate", "AddressMode": "SI", opcode: 0x92, "Length": 4  }; 
        this.opcodes.CLI = { "Name": "CLI", "Description": "Compare Logical Immediate", "AddressMode": "SI", opcode: 0x95, "Length": 4  }; 
        this.opcodes.OI = { "Name": "OI", "Description": "OR Immediate", "AddressMode": "SI", opcode: 0x96, "Length": 4  }; 
        //SS
        this.opcodes.UNPK = { "Name": "UNPK", "Description": "Unpack", "AddressMode": "SS", opcode: 0xF3, "Length": 6  }; 
        //Asembler
        this.opcodes.COMMENT = { "Name": "COMMENT", "Description": "Comment Line", "AddressMode": "COMMENT", "Length": 0  }; 
        this.opcodes.CSECT = { "Name": "CSECT", "Description": "SECTION", "AddressMode": "CSECT", "Length": 0  }; 
        this.opcodes.USING = { "Name": "USING", "Description": "Set Base Location y Base Register", "AddressMode": "USING", "Length": 0  }; 
        this.opcodes.EQU = { "Name": "EQU", "Description": "Define Constant", "AddressMode": "EQU", "Length": 0  }; 
        this.opcodes.DC = { "Name": "DC", "Description": "Define Storage Constant", "AddressMode": "DC", "Length": 0  }; 
        this.opcodes.DS = { "Name": "DS", "Description": "Define Storage", "AddressMode": "DS", "Length": 0  }; 
        this.opcodes.END = { "Name": "END", "Description": "End Program", "AddressMode": "END", "Length": 0  }; 
    }

    fx_instructions(instructions) {
        this.errors = [];
        this.pc = 0;
        this.baseRegister = 0;
        this.instructions = instructions;

        this.assemblies = instructions.map((instruction) => {
           if(instruction.label) {
                this.symbols[instruction.label.toUpperCase()] = this.pc;
           }
           var opcode = this.opcodes[instruction.mnemonic.toUpperCase()] || { Length: 0, "AddressMode": "NOTHING"};
           var func = this["fx_" + opcode.AddressMode] || this.fx_NOTHING;
           var assembly = func.apply(this, [opcode, instruction]);
           this.pc += opcode.Length; 
           return assembly;
        } );

        length = this.assemblies.reduce((x, y) => x + y.length, 0);
        var _assemblies = new Uint8Array(length);
        var kInx = 0;
        this.assemblies.forEach((assembly) =>{
            _assemblies.set(assembly, kInx);
            kInx += assembly.length;
        });
        return _assemblies;
    }

    //Register Register
    fx_RR(opcode, instruction) {
        var assembly = new Uint8Array(2);
        assembly[0] = opcode.opcode;
        assembly[1] = (this.fx_factor(instruction.operands[0].displacement) & 0xf) << 4;
        assembly[1] += this.fx_factor(instruction.operands[1].displacement) & 0xf;
        return assembly;
    }

    //Register - Extendend mnemonics
    fx_RRX(opcode, instruction) {
        var assembly = new Uint8Array(2);
        assembly[0] = opcode.opcode;
        assembly[1] = opcode.mask << 4;
        assembly[1] += this.fx_factor(instruction.operands[0].displacement) & 0xf;
        return assembly;
    }

    //Register Storage with Index
    fx_RX(opcode, instruction) {
        var assembly = new Uint8Array(4);
        assembly[0] = opcode.opcode;
        assembly[1] = (this.fx_factor(instruction.operands[0].displacement) & 0xf) << 4;
        var s = this.fx_expr(opcode, instruction, 1);
        assembly[1] += (s.index || 0) & 0xf;
        this.fx_storage(assembly, 2, s);
        return assembly;
    }

    //Register Storage with Index - Extendend mnemonics
    fx_RXX(opcode, instruction) {
        var assembly = new Uint8Array(4);
        assembly[0] = opcode.opcode;
        assembly[1] = opcode.mask << 4;
        var s = this.fx_expr(opcode, instruction, 0);
        assembly[1] += (s.index || 0) & 0xf;
        this.fx_storage(assembly, 2, s);
        return assembly;
    }

    //Register Storage
    fx_RRS_1(opcode, instruction) {
        var assembly = new Uint8Array(4);
        assembly[0] = opcode.opcode;
        assembly[1] = (this.fx_factor(instruction.operands[0].displacement) & 0xf) << 4;
        var s = this.fx_expr(opcode, instruction, 2);
        this.fx_storage(assembly, 2, s);
        return assembly;
    }

    //Register Storage
    fx_RRS_2(opcode, instruction) {
        var assembly = new Uint8Array(4);
        assembly[0] = opcode.opcode;
        assembly[1] = (this.fx_factor(instruction.operands[0].displacement) & 0xf) << 4;
        assembly[1] += this.fx_factor(instruction.operands[1].displacement) & 0xf;
        var s = this.fx_expr(opcode, instruction, 2);
        this.fx_storage(assembly, 2, s);
        return assembly;
    }

    //Storage Immediate
    fx_SI(opcode, instruction) {
        return this.fx_SIGeneric(opcode, instruction, 1, 0)    
    }

    //Immediate Storage
    fx_IS(opcode, instruction) {
        return this.fx_SIGeneric(opcode, instruction, 0, 1)    
    }

    fx_SIGeneric(opcode, instruction, inmediateOperand, storageOperand) {
        var assembly = new Uint8Array(4);
        assembly[0] = opcode.opcode;
        assembly[1] = this.fx_factor(instruction.operands[inmediateOperand].displacement) & 0xff; //Inmediate Value
        var s = this.fx_expr(opcode, instruction, storageOperand);
        this.fx_storage(assembly, 2, s);

        return assembly;
    }

    //Storage - Storage
    fx_SS(opcode, instruction) {
        var assembly = new Uint8Array(6);
        assembly[0] = opcode.opcode;
        var s = this.fx_expr(opcode, instruction, 0);
        assembly[1] = s.index & 0xff; //Length
        this.fx_storage(assembly, 2, s);
        s = this.fx_expr(opcode, instruction, 1);
        this.fx_storage(assembly, 4, s);
        return assembly;
    }

    fx_storage(assembly, index, s) {
        var base = s.base;
        if(typeof s.base === 'undefined'){
            base = this.baseRegister;
        }
        assembly[index] = base << 4;
        assembly[index] += s.displacement >>> 8;
        assembly[index + 1] = s.displacement & 0xff;
    }

    fx_COMMENT(opcode, instruction) {
        var assembly = new Uint8Array();
        
        return assembly;
    }

    fx_CSECT(opcode, instruction) {
        var assembly = new Uint8Array();
        
        return assembly;
    }

    fx_USING(opcode, instruction) {
        var assembly = new Uint8Array();
        var s = this.fx_expr(opcode, instruction, 0);
        if(instruction.operands[0].displacement === '*'){
            this.pc = s.displacement;
        }
        var s = this.fx_expr(opcode, instruction, 1);
        this.baseRegister = s.displacement;
        return assembly;
    }

    fx_EQU(opcode, instruction) {
        var assembly = new Uint8Array();
        var s = this.fx_expr(opcode, instruction, 0);
        this.symbols[instruction.label.toUpperCase()] = s.displacement;
        return assembly;
    }

    fx_DC(opcode, instruction) {
        var operand = instruction.operands[0];
        var _pc = this.pc;
        if(instruction.label) {
            if(operand.displacement.literal && operand.displacement.literal.substr(0,1).toUpperCase() === 'F') {
                this.pc >>>= 2;
                this.pc <<=2;
                if(_pc != this.pc) {
                    this.pc += 4;                
                }                
            }
            this.symbols[instruction.label.toUpperCase()] = this.pc;
        }
        this.fx_factor(operand.displacement);
        this.lastLiteral.count = operand.displacement.count || 1;
        var length = this.lastLiteral.length * this.lastLiteral.count; 
        this.pc += length;
        var assembly = new Uint8Array(this.pc - _pc);
        var kkInx = assembly.length - length;
        for(var kInx = 0; kInx < this.lastLiteral.count; kInx++) {
            assembly.set(this.lastLiteral.assembly, kkInx);
            kkInx += this.lastLiteral.length;
        }
        return assembly;
    }

    fx_DS(opcode, instruction) {
        if(instruction.label) {
            this.symbols[instruction.label.toUpperCase()] = this.pc;
        }
        var operand = instruction.operands[0];
        var matches = operand.displacement.match(/^([CFP])(L([0-9]+))?$/) || []

        if(matches[3]) {
            operand.length = parseInt(matches[3]);
        } else {
            operand.length = (matches[1] === 'F')?4:1;
        }
        
        var length = operand.length * (operand.count || 1)
        this.pc += length;
        return new Uint8Array(length);
    }

    fx_NOTHING(opcode, instruction) {
        var assembly = new Uint8Array();
        
        return assembly;
    }

    fx_expr(opcode, instruction, operandIndex) {
        var operand = instruction.operands[operandIndex] ;
        var displacement = operand.displacement;
        var res = {};
        switch(true) {
            case typeof displacement === 'object' && !!displacement.literal:
                res.displacement = this.fx_factor(displacement.literal);
                break;
            case typeof displacement === 'object':
                var left = this.fx_factor(displacement.left);
                var right = this.fx_factor(displacement.right);
                switch(displacement.operator) {
                    case '+':
                        res.displacement = left + right;
                        break;
                    case '-':
                        res.displacement = left - right;
                        break;
                    default:
                        res.displacement = 0;
                        this.errors.push("Operator '" + displacement.operator + "' invalid"); 
                        break;                       
                }
                break;
            default:
                res.displacement = this.fx_factor(displacement)
                break;
        }
        res.base = this.fx_factor(operand.base);
        res.index = this.fx_factor(operand.index);
        return res;
    }

    fx_factor(operand) {
        this.lastLiteral = { literal: operand, count: 1 };

        switch(true) {
            case typeof operand === 'undefined':
                return operand;
            case typeof operand === 'object':
                return this.fx_factor(operand.literal);
            case /^[0-9]+$/.test(operand):
                this.lastLiteral.length = 4;
                return parseInt(operand);
            case /^[A-Z][A-Z0-9]*$/i.test(operand):
                var r = this.symbols[operand.toUpperCase()];
                if(typeof r === 'undefined') {
                    this.errors.push("Symbol '" + operand + "' not found");
                    r = 0;
                }
                return r;
            case /^F(L[0-9]+)?'.*'+$/i.test(operand): //Integer Fullword 4Bytes
                var matches = operand.match(/^F(L([0-9]+))?'(.*)'+$/)
                if(matches[2]) {
                    this.lastLiteral.length = parseInt(matches[2]);
                } else {
                    this.lastLiteral.length = 4;
                }
                var val = new Uint32Array([parseInt(matches[3])]);
                this.lastLiteral.value = val[0];
                var buffer = new Uint8Array(val.buffer);
                this.lastLiteral.assembly = buffer.reverse();
                this.lastLiteral.displacement = this.literals[operand];
                return (this.lastLiteral.displacement)?this.lastLiteral.displacement.address : this.lastLiteral.value;
            case /^X(L[0-9]+)?'.*'+$/i.test(operand): //Integer Fullword 4Bytes
                var matches = operand.match(/^X(L([0-9]+))?'(.*)'+$/)
                var sVal = matches[3];
                if(matches[2]) {
                    this.lastLiteral.length = parseInt(matches[2]);
                } else {
                    this.lastLiteral.length = sVal.length >>> 2;
                }
                this.lastLiteral.value = sVal;
                this.lastLiteral.assembly = new Uint8Array(this.lastLiteral.length);
                for(var kInx = 0; kInx < length; kInx++){
                    this.lastLiteral.assembly[kInx] = parseInt(sVal.substr(kInx << 2, 2), 16);
                }
                this.lastLiteral.displacement = this.literals[operand];
                return (this.lastLiteral.displacement)?this.lastLiteral.displacement.address : this.lastLiteral.value;
            case /^C(L[0-9]+)?'.*'+$/i.test(operand): //Integer Fullword 4Bytes
                var matches = operand.match(/^C(L([0-9]+))?'(.*)'+$/)
                this.lastLiteral.value = matches[3];
                if(matches[2]) {
                    this.lastLiteral.length = parseInt(matches[2]);
                } else {
                    this.lastLiteral.length = this.lastLiteral.value.length;
                }
                var encoder = new TextEncoder();                
                this.lastLiteral.assembly = encoder.encode(this.lastLiteral.value);
                this.lastLiteral.displacement = this.literals[operand];
                return (this.lastLiteral.displacement)?this.lastLiteral.displacement.address : this.lastLiteral.value;
            case operand === '*':
                return this.pc;
            default:
                debugger;
                break;   
        } 
    }


    fx_END(opcode, instruction) {
        //Calcula las posiciones de los literales
        var nkey = 0;
        var _assemblies = [];
        for(var key in this.literals){
            var instruction = {
                label: '_LITERAL_' + nkey++,
                mnemonic: "DC",
                operands: [{
                    displacement: { literal: key }
                }]
            };
            this.instructions.push(instruction);
            _assemblies.push(this.fx_DC(null, instruction));
            this.lastLiteral.address = this.pc - this.lastLiteral.length;
            this.literals[key] = this.lastLiteral;
        }      

        var length = _assemblies.reduce((x, y) => x + y.length, 0);
        var __assemblies = new Uint8Array(length);
        var kInx = 0;
        _assemblies.forEach((assembly) =>{
            __assemblies.set(assembly, kInx);
            kInx += assembly.length;
        });
        return __assemblies;
    }
}