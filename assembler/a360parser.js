// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Main", "symbols": ["Instructions"], "postprocess": function(d) { return d[0] }},
    {"name": "Instructions", "symbols": ["Instructions", "EOL", "Instruction"]},
    {"name": "Instructions", "symbols": ["Instruction"]},
    {"name": "Instruction", "symbols": ["InstructionHead", "_", "InstructionOperands", "_", "InstructionComment"], "postprocess": function(d) {return { opCode: d[0].opCode, operands: d[2] } }},
    {"name": "Instruction", "symbols": ["InstructionHead", "_", "InstructionOperands"], "postprocess": function(d) {d[2].opCode = d[0].opCode; return d[2]  }},
    {"name": "Instruction", "symbols": ["InstructionHead", "_", "InstructionComment"], "postprocess": function(d) {d[0].comment = d[2]; return d[0]  }},
    {"name": "Instruction", "symbols": ["InstructionHead"], "postprocess": function(d) { return d[0]  }},
    {"name": "Instruction", "symbols": [{"literal":"*"}, "_", "InstructionComment"], "postprocess": function(d) {return {opCode:"", comment: d[2]}}},
    {"name": "InstructionHead", "symbols": ["label", "_", "label"], "postprocess": function(d) {return {label: d[0], opCode:d[2]}}},
    {"name": "InstructionHead", "symbols": ["_", "label"], "postprocess": function(d) {return {label: "", opCode:d[1]}}},
    {"name": "InstructionOperands", "symbols": ["OperandsRR"], "postprocess": function(d) {d[0].addressMode = "RR"; return d[0]}},
    {"name": "InstructionOperands", "symbols": ["OperandsRX"], "postprocess": function(d) {d[0].addressMode = "RX"; return d[0]}},
    {"name": "OperandsRR", "symbols": ["int", "COMMA", "int"], "postprocess": function(d) {return {R1:d[0], R2: d[2]}}},
    {"name": "OperandsRR", "symbols": [{"literal":"*"}, "COMMA", "int"], "postprocess": function(d) {return {R1:d[0], R2: d[2]}}},
    {"name": "OperandsRR", "symbols": ["int"], "postprocess": function(d) {return {R1:d[0]}}},
    {"name": "OperandsRX", "symbols": ["int", "COMMA", "expr", {"literal":"("}, "int", "COMMA", "int", {"literal":")"}], "postprocess": function(d) {return {R1:d[0], displacement: d[2], R3: d[4], R2: d[6] }}},
    {"name": "OperandsRX", "symbols": ["int", "COMMA", "expr", {"literal":"("}, "int", {"literal":")"}], "postprocess": function(d) {return {R1:d[0], displacement: d[2], R3: d[4], R2: 0 }}},
    {"name": "expr", "symbols": ["expr", "operator", "factor"], "postprocess": function(d) {return {left:d[0], op: d[1], right: d[2] }}},
    {"name": "expr", "symbols": ["factor"], "postprocess": function(d) {return {factor:d[0] }}},
    {"name": "factor", "symbols": ["label"]},
    {"name": "factor", "symbols": ["int"]},
    {"name": "operator", "symbols": [/[+-]/], "postprocess": function(d) {return d[0].join("")}},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": function(d) {return d[0].join("")}},
    {"name": "operator", "symbols": [/[+-]/], "postprocess": function(d) {return d[0].join("")}},
    {"name": "label", "symbols": ["label1", "label2"], "postprocess": function(d) {return d[0] + d[1]}},
    {"name": "label1", "symbols": [/[A-Z]/]},
    {"name": "label2$ebnf$1", "symbols": []},
    {"name": "label2$ebnf$1", "symbols": ["label2$ebnf$1", /[A-Z0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "label2", "symbols": ["label2$ebnf$1"], "postprocess": function(d) {return d[0].join("") }},
    {"name": "COMMA$ebnf$1", "symbols": []},
    {"name": "COMMA$ebnf$1", "symbols": ["COMMA$ebnf$1", {"literal":" "}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "COMMA$ebnf$2", "symbols": []},
    {"name": "COMMA$ebnf$2", "symbols": ["COMMA$ebnf$2", {"literal":" "}], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "COMMA", "symbols": ["COMMA$ebnf$1", {"literal":","}, "COMMA$ebnf$2"], "postprocess": function(d) {return null }},
    {"name": "InstructionComment$ebnf$1", "symbols": [/./]},
    {"name": "InstructionComment$ebnf$1", "symbols": ["InstructionComment$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "InstructionComment", "symbols": ["InstructionComment$ebnf$1"], "postprocess": function(d) {return d[0].join("")}},
    {"name": "_$ebnf$1", "symbols": [/[ \t]/]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[ \t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null }},
    {"name": "EOL$ebnf$1", "symbols": [/[\n\r]/]},
    {"name": "EOL$ebnf$1", "symbols": ["EOL$ebnf$1", /[\n\r]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "EOL", "symbols": ["EOL$ebnf$1"], "postprocess": function(d) {return null }}
]
  , ParserStart: "Main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
