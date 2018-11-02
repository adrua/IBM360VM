//-------------------------------------------
// Basic Assembler Language IBM 360
// Por Adalberto Raul Rua Aguirre
// Nov 01/2018
//-------------------------------------------
function Bal360Scanner() {
    var text = "";
    this.yytext = "";
    this.yyloc = {
        first_column: 0,
        first_line: 1,
        last_line: 1,
        last_column: 0
    };
    
    this.yylloc = this.yyloc;
    
    this.setInput = function(text_) {
        text = text_;
    };

    this.setLastColumn = function() {
        this.yyloc.last_column += this.yytext.length;
        if(this.yyloc.last_column > 71) {
            this.yytext.length -= this.yyloc.last_column - 71;
            this.yyloc.last_column = 71;
        }
        text = text.substring(this.yytext.length);
    };
    
    this.lex = function() {
        // increment our column numbers.
        this.yyloc.first_column = this.yyloc.last_column +  1;

        switch(true) {
            // Return the EOF token when we run out of text.
            case (text === ""): 
                return "EOF";
            //Continuation Line            
            case this.yyloc.first_column === 72 && (this.yytext = text.match(/^[^\s\n\r]/)).length:
                return this.lex();
            //End Line Comment    
            case this.yyloc.first_column === 73 && (this.yytext = text.match(/^[^\n\r]+/)).length:
                this.setLastColumn()
                return "COMMENT";
            //Start Line Comment             
            case this.yyloc.first_column === 1 && (this.yytext = text.match(/^\*.{0,70}/)).length:
                this.setLastColumn()
                return "COMMENT"
            //End of Line    
            case (this.yytext = text.match(/^[\n\r]+/)).length:
                // Increment our line number when we hit newlines.
                this.yyloc.first_line++;
                this.yyloc.last_line++;
                this.yyloc.last_column = 0;
                return "EOL";
            //Spaces Ignore    
            case (this.yytext = text.match(/^\s+/)).length:
                this.setLastColumn()
                return this.lex();
            //CONSTANT CHARACTERS  
            case (this.yytext = text.match(/^C(L[0-9]+)?'[^']*'/)).length:                
                this.setLastColumn()
                return "CHARACTERS";
            //CONSTANT DECIMAL PACKED
            case (this.yytext = text.match(/^P(L[0-9]+)?'[0-9]*'/)).length:                
                this.setLastColumn()
                return "PACKED";
            //ID or LABEL   
            case (this.yytext = text.match(/^[A-Z][A-Z0-9]*/)).length:                
                this.setLastColumn()
                return (this.yyloc.first_column === 1)?"LABEL":"ID";
            //INT    
            case (this.yytext = text.match(/^[0-9]*/)).length:                
                this.setLastColumn()
                return "INT";
            //Operator ADD/SUB
            case (this.yytext = text.match(/^[\+\-]/)).length:                
                this.setLastColumn()
                return "OPERATOR";
            //COMMA
            case (this.yytext = text.match(/^,/)).length:                
                this.setLastColumn()
                return "COMMA";
            //LITERAL
            case (this.yytext = text.match(/^=/)).length:                
                this.setLastColumn()
                return "LITERAL";
            default:
                return "INVALID";
        }
    };
}
parser.lexer = new Bal360Scanner();