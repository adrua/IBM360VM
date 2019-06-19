# IBM 360 Maquina Virtual 

Esta maquina esta siendo construida en Javascript ES-2005 y Polymer
```
npm install -g polymer-cli
git clone https://github.com/PolymerLabs/start-polymer3.git
cd start-polymer3
npm install
polymer serve
```

### Install Polymer CLI Prerequisites

* [Git](https://git-scm.com/download/)
* [Node.js](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/)

<a name="installcli"></a>

### Basic Assembler Language
2018-11-04 Implementacion Inicial BAL-360

### Instrucciones Implementadas

#### RR - Register Register
* 05 BALR Branch and Link Register
* 07 BCR  Branch Condition Register

* 18 LR Load
* 19 CR Compare Register
* 1A AR Add Register (32)
* 1B SR Subtract

#### RR - Extendend mnemonics
* 07 BR Branch Register (Unconditional)

#### RX - Register Storage Indexed
* 41 LA Load Address
* 4E CVD Convert To Decimal
* 47 BC Branch if Not Low (C)
* 50 ST Store
* 58 L Load
* 59 C Compare
* 5A A Add

#### RX - Extendend mnemonics
* 47 BNE Branch if Not Equal (C)
* 47 BE Branch if Equal (C)
* 47 BNL Branch if Not Low (C)
* 47 B Unconditional Branch

####  RS - Register Storage    
* 90 STM Store Multiple Register
* 98 LM Load Multiple Register

#### SI - Storage Immediate
* 92 MVI Move Immediate
* 95 CLI Compare Logical Immediate
* 96 OI OR Immediate

#### SS - Storage Storage
* F3 UNPK Unpack

#### Assembler
* COMMENT Comment Line
* CSECT   SECTION
* USING   Set Base Location y Base Register
* EQU     Define Constant
* DC      Define Storage Constant
* DS      Define Storage
* END     End Program

