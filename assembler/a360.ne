Main -> Instructions 							{% function(d) { return d[0] } %}					

Instructions -> Instructions EOL Instruction	
			| Instruction						
			
Instruction ->  InstructionHead _ InstructionOperands _ InstructionComment 
										{% function(d) {return { opCode: d[0].opCode, operands: d[2] } } %}
            | InstructionHead _ InstructionOperands {% function(d) {d[2].opCode = d[0].opCode; return d[2]  } %}
            | InstructionHead _ InstructionComment 	{% function(d) {d[0].comment = d[2]; return d[0]  } %}
            | InstructionHead 						{% function(d) { return d[0]  } %}
            | "*" _ InstructionComment			{% function(d) {return {opCode:"", comment: d[2]}} %}

InstructionHead -> label _ label   				{% function(d) {return {label: d[0], opCode:d[2]}} %}  
			  | _ label      					{% function(d) {return {label: "", opCode:d[1]}} %}

InstructionOperands -> OperandsRR				{% function(d) {d[0].addressMode = "RR"; return d[0]} %}
                      | OperandsRX				{% function(d) {d[0].addressMode = "RX"; return d[0]} %}
					  
                     			
OperandsRR -> int COMMA int						{% function(d) {return {R1:d[0], R2: d[2]}} %}
            | "*" COMMA int						{% function(d) {return {R1:d[0], R2: d[2]}} %}
			| int								{% function(d) {return {R1:d[0]}} %}
			
OperandsRX -> int COMMA expr "(" int COMMA int ")" {% function(d) {return {R1:d[0], displacement: d[2], R3: d[4], R2: d[6] }} %}
            | int COMMA expr "(" int ")" 	{% function(d) {return {R1:d[0], displacement: d[2], R3: d[4], R2: 0 }} %}
            			
expr -> expr operator factor	{% function(d) {return {left:d[0], op: d[1], right: d[2] }} %}
      | factor					{% function(d) {return {factor:d[0] }} %}
	  
factor -> label
        | int

operator -> [+-]			{% function(d) {return d[0].join("")} %}

int -> [0-9]:+ 			{% function(d) {return d[0].join("")} %}

label -> label1 label2 {% function(d) {return d[0] + d[1]} %}
label1 -> [A-Z]  		
label2 -> [A-Z0-9]:* 	{% function(d) {return d[0].join("") } %}


COMMA -> " ":* "," " ":*	{% function(d) {return null } %}
InstructionComment -> .:+	{% function(d) {return d[0].join("")} %}

_ -> [ \t]:+				{% function(d) {return null } %}
EOL -> [\n\r]:+				{% function(d) {return null } %}
