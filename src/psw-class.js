export class psw {    

    constructor()
    {
        this._psw = new Uint32Array([0, 0]);
        this._program = 0;
        this._address = 0;
        this._conditionCode = 0;
    }
// 1    Program                        (R)                                      
    set Program(value) { 
        this._program = value?0b1:0b0;
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
    this._conditionCode = value & 0b11;
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
        this._psw[1] &= 0b1;   
        this._psw[1] |= this._address << 1;   
    }

    get Address() {
        return this._address;
    }

    //Arithmetical Operation (Add, Subtract, Multiply, Divide)
    setConditionCodeInt32(result) {
        if(result > 0) {
            result = 0b10;
        } else {
            result = (result < 0)?0b01:0b00;
        }
        this.ConditionCode = result;
        return result;
    }

    //Logical Operations (And, Or, )
    setConditionCodeBoolean(result) {
        this.ConditionCode = result ? 1: 0;
        return result;
    }

    checkConditionCode(mask) {
        switch(mask)
        {
            case 0: return false;
            case 1: return this._conditionCode === 3;
            case 2: return this._conditionCode === 2;
            case 3: return this._conditionCode >= 2;
            case 4: return this._conditionCode === 1;
            case 5: return this._conditionCode === 1 || this._conditionCode === 3;
            case 6: return this._conditionCode === 1 || this._conditionCode === 2;
            case 7: return this._conditionCode >= 1;
            case 8: return this._conditionCode === 0;
            case 9: return this._conditionCode === 0 || this._conditionCode === 3;
            case 10: return this._conditionCode === 0 || this._conditionCode === 2;
            case 11: return this._conditionCode === 0 || this._conditionCode >= 2;
            case 12: return this._conditionCode <= 1 ;
            case 13: return this._conditionCode != 2;
            case 14: return this._conditionCode <= 2 ;
            case 15: return true ;
        }
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

