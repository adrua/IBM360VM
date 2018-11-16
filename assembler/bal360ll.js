//-------------------------------------------
// Basic Assembler Language IBM 360
// Analizador Syntactico LL
// Por Adalberto Raul Rua Aguirre
// Nov 01/2018
//-------------------------------------------
class bal360ll {

    constructor() {
        this.literals = {};
        this.literalsCount  = 0;
        this.errors = [];
        
        this.lexer = new Bal360Scanner();        
    }

    getNextToken(token) {
        if(this.token === token) {
            this.yytext = this.lexer.yytext;
            this.yyloc = this.lexer.yyloc;
            this.token = this.lexer.lex();
            return true;
        }
        return false;
    }

    parse(text) {
        //main :  { Instruction, EOL } EOF
        //
        var res = [];
        this.lexer.Input = text;
        this.getNextToken();
        res.push(this.fx_instruction());
        while(this.getNextToken('EOL') && this.token !== 'EOF'){
            res.push(this.fx_instruction());    
        }
        return res;
    }

    fx_instruction() {
    //Instrucion: LABEL? ID Operands? Comments?
    //            | COMMENT
        var res = {};
        if(this.getNextToken('COMMENT')) {
            res.comment = this.yytext
            res.mnemonic = "COMMENT";
            return res;
        }
        
        if(this.getNextToken('LABEL')) {
            res.label = this.yytext;
        }

        if(this.getNextToken('ID')) {
            res.mnemonic = this.yytext;
        } else {
            this.triggerError("ID at Instruction");
        }

        res.operands = this.fx_operands(res);
      
        this.token = this.lexer.findEol(this.token);
        res.remarks = this.lexer.remarks;

        if(this.getNextToken("COMMENTEND")){
            res.lineId = this.yytext; 
        }; 
        return res;
    }

    fx_operands(res) {
        //operands: { operand, ','}
        var res = [];
        var operand = this.fx_operand();
        while(operand) {
            res.push(operand);
            if(this.getNextToken(',')){
                operand = this.fx_operand();    
            } else {
                operand = null;
            }
        }
        return res;
    }

    fx_operand() {
        //operand: expr '(' expr ',' expr ')'  
        //| expr '(' expr ')'  
        //| expr
        var res = this.fx_expr();
        if(res) {
            res = { displacement: res };
            if(this.getNextToken('(')) {
                res.base = this.fx_expr();                
                if(this.getNextToken(',')) {
                    res.index = res.base;
                    res.base = this.fx_expr();                
                }
                if(!this.getNextToken(')')) {
                    this.triggerError(')');
                }
            }  
        }
        return res;
    }

    fx_expr() {
        //expr: factor { OPERATOR factor}
        var res = this.fx_factor()
        if(this.getNextToken('OPERATOR')) {
            res = { 
                left: res, 
                operator: this.yytext,
                right: this.fx_expr()
            }            
        }
                
        return res;
    }    

    fx_factor() {
        switch(this.token) {
            case 'ID':
            case '*':
                this.getNextToken(this.token);
                return this.yytext;
            case 'INT':
                this.getNextToken(this.token);
                var int = parseInt(this.yytext);
                var literal = '';
                if(literal = this.fx_literals()){
                    return { count: int, literal: literal }
                } else {
                    return this.yytext;            
                }               
            case '=': //Literal
                this.getNextToken(this.token);
                var literal = this.fx_literals();
                this.literals[literal] = this.literalsCount++; 
                return { literal: literal };
            default:
                return this.fx_literals();
        }
    }

    fx_literals() {
        switch(this.token) {
            case 'CHARACTERS':
            case 'PACKED':
            case 'BYTES':
            case 'FULLWORD':
                this.getNextToken(this.token);
                return this.yytext;
            default:
                return null;
        }
    }
    
    triggerError(msg) {
        msg = 'Expected ' + msg + ' find "' + this.yytext + '" in (' + this.yyloc.first_line + ', ' + this.yyloc.first_column + ')\n';
        throw new Error(msg);
    }
}