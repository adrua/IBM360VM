//-------------------------------------------
// Basic Assembler Language IBM 360
// Analizador Lexico 
// Por Adalberto Raul Rua Aguirre
// Nov 01/2018
//-------------------------------------------
class Bal360Scanner {

    constructor() {
        this.text = "";
        this.yytext = "";
        this.yylineno = 1;
        this.yyloc = {
            first_column: 0,
            first_line: 1,
            last_line: 1,
            last_column: 0,
            findEol: false
        };    
        this.yylloc = this.yyloc;
    }
    
    
    set Input(text) {
        this.text = text;
    };

    setLastColumn(endColumn) {
        //console.log('[' + this.yyloc.first_line + ', ' + this.yyloc.first_column + ']' +this.yytext);
        endColumn = endColumn || 71;
        this.yyloc.last_column += this.yytext.length;
        if(this.yyloc.last_column > endColumn) {
            this.yytext.length -= this.yyloc.last_column - endColumn;
            this.yyloc.last_column = endColumn;
        }
        this.text = this.text.substring(this.yytext.length);
    }

    // Return string to EOL
    findEol(token) {
        this.remarks = "";
        if(token !== 'EOL' && token !== 'EOF') {
            var yytext = (this.text.match(/^.*/)||[""])[0];
            this.remarks = this.yytext + yytext;        
            this.yytext = yytext;
            this.setLastColumn(71);
            return this.lex();    
        }
        return token;
    }

    lex() {
        // increment our column numbers.
        this.yyloc.first_column = this.yyloc.last_column +  1;

        switch(true) {
            // Return the EOF token when we run out of text.
            case (!this.text): 
                this.yytext = "";
                this.yyloc.last_column = this.yyloc.first_column;
                return 'EOF';
            //End of Line    
            case !!(this.yytext = (this.text.match(/^[\n\r]+/)||[""])[0]):
                // Increment our line number when we hit newlines.
                this.text = this.text.substring(this.yytext.length);
                this.yylineno = ++this.yyloc.first_line;
                this.yyloc.last_line++;
                this.yyloc.last_column = 0;
                return "EOL";
            //Continuation Line            
            //case !!(this.yyloc.first_column === 72 && ((this.yytext = text.match(/^[^\s\n\r]/)||[""])[0])):
            //    return this.lex();
            //End Line Comment    
            case !!(this.yyloc.first_column === 73 && (this.yytext = (this.text.match(/^[^\n\r]+/)||[""])[0])):
                this.setLastColumn(1024)
                return "COMMENTEND";
            //Start Line Comment             
            case !!(this.yyloc.first_column === 1 && (this.yytext = (this.text.match(/^\*.{0,70}/)||[""])[0])):
                this.setLastColumn()
                return "COMMENT"
            //Spaces Ignore    
            case !!(this.yytext = (this.text.match(/^[ \t\v]+/)||[""])[0]):
                this.setLastColumn()
                return this.lex();
            //CONSTANT CHARACTERS  
            case !!(this.yytext = (this.text.match(/^C(L[0-9]+)?'[^']*'/i)||[""])[0]):                
                this.setLastColumn()
                return "CHARACTERS";
            //CONSTANT DECIMAL PACKED
            case !!(this.yytext = (this.text.match(/^P(L[0-9]+)?'[0-9]*'/i)||[""])[0]):                
                this.setLastColumn()
                return "PACKED";
            //CONSTANT INTEGER FULLWORD
            case !!(this.yytext = (this.text.match(/^F'[0-9]*'/i)||[""])[0]):                
                this.setLastColumn()
                return "FULLWORD";
            //CONSTANT BYTES HEXADECIMAL
            case !!(this.yytext = (this.text.match(/^X(L[0-9]+)?'[0-9A-F]*'/i)||[""])[0]):                
                this.setLastColumn()
                return "BYTES";
            //ID or LABEL   
            case !!(this.yytext = (this.text.match(/^[A-Z][A-Z0-9]*/i)||[""])[0]):                
                this.setLastColumn()
                return (this.yyloc.first_column === 1)?"LABEL":"ID";
            //INT    
            case !!(this.yytext = (this.text.match(/^[0-9]*/)||[""])[0]):                
                this.setLastColumn()
                return "INT";
            //Operator ADD/SUB
            case !!(this.yytext = (this.text.match(/^[\+\-]/)||[""])[0]):                
                this.setLastColumn()
                return "OPERATOR";
            //COMMA
            case !!(this.yytext = (this.text.match(/^,/)||[""])[0]):                
                this.setLastColumn()
                return ",";
            //LEFT_PAREN
            case !!(this.yytext = (this.text.match(/^\(/)||[""])[0]):                
                this.setLastColumn()
                return "(";
            //RIGHT_PAREN
            case !!(this.yytext = (this.text.match(/^\)/)||[""])[0]):                
                this.setLastColumn()
                return ")";
            //STAR
            case !!(this.yytext = (this.text.match(/^\*/)||[""])[0]):                
                this.setLastColumn()
                return "*";
            //EQUAL
            case !!(this.yytext = (this.text.match(/^=/)||[""])[0]):                
                this.setLastColumn()
                return "=";
            default:
                this.yytext = this.text.charAt(0);
                this.setLastColumn();
                return "INVALID";
        }
    }
}
