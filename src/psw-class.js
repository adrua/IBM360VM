export class psw {    

    constructor()
    {
        this._psw = new Uint32Array([0, 0]);
        this._program = 0;
        this._address = 0;
    }
// 1    Program                        (R)                                      
    set Program(value) { 
        this._program = value?1:0;
        this._psw[0] |= this._program << 31;   
    }

    get Program() {
        return this._program;
    }
// 5      DAT Mode                       (T = 1)                                  
// 6      Input/Output Mask              (I)                                             
// 7      External Mask                  (E)                                      
// 12     Zero indicates z/Architecture                                           
// 13     Machine Check Mask             (M)                                      
// 14     Wait State                     (W = 1)                                  
// 15     Problem State                  (P = 1)                                  
// 16-17  xx Real Mode                   (T = 1)                                  
//        00 Primary Space Mode          (T = 1)                                  
//        01 Access Register Mode        (T = 1)                                  
//        10 Secondary Spacer Mode       (T = 1)                                  
//        11 Home Space Mode             (T = 1)                                  
// 18-19  Condition Code                 (CC)                                     
set ConditionCode(value) { 
    this._conditionCode = value & 0x3;
    this._psw[0] &= 0xFFFF9FFF;   
    this._psw[0] |= this._conditionCode << 13;   
}

get ConditionCode() {
    return this._conditionCode;
}
// 20     Fixed Point Overflow Mask                                               
// 21     Decimal Overflow Mask                                                   
// 22     HFP Exponent Overflow Mask                                              
// 23     HFP Signficance Mask                                                    
// 31-32  Extended/Basic Address Mode    (EA/BA)                                  
//         00 24-bit Mode                                                          
//         01 31-bit Mode                                                          
//         10 Invalid                                                                    
//         11 64-bit Mode                                                          
// 33-63  Instruction Address            (Hexadecimal)   
    set Address(value) { 
        this._address = value & 0x7FFFFFFF; 
        this._psw[1] &= 0x1;   
        this._psw[1] |= this._address << 1;   
    }

    get Address() {
        return this._address;
    }

    toString(radix = 2) {
        var sFill = "0";
        var vRadix = -8;
        switch(radix) {
            case 2: //Binary
                vRadix = -32;
                break;
            default: //Hexadecimal 
                vRadix = -8;
                break;
        }
        sFill = "0".repeat(-vRadix);
        var sPsw = this._psw.reduce((x, y) => x + (sFill + y.toString(radix)).substr(vRadix), "");
        return sPsw;
    }
}

