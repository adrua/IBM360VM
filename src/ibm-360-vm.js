/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

// Import statements in Polymer 3.0 can now use package names.
// polymer-element.js now exports PolymerElement instead of Element,
// so no need to change the symbol. 
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/polymer/lib/elements/dom-if.js';

import { cpu } from './cpu-class.js'

class ibm360vm extends PolymerElement {
  static get properties () {
    return {
      startAddress: {
        type: String,
        value:  "100",
        notify: true
      },
      cpu: {
        type: Object,
        value:  () => { new cpu() }
      },
      instructions: {
        type: Array,
        value: () => { return []}
      }
    };
  }

  constructor() {
    // If you override the constructor, always call the 
    // superconstructor first.
    super();

    this.IBMCPU = new cpu();
    window["IBMCPU"] = this.IBMCPU;
    this.IBMCPU.PSW.Program = 1;
    this.IBMCPU.PSW.Address = 0x100;

    this.IBMCPU.Memory[0x100] = 0x05; // L R1, 50H(R2, R3)
    this.IBMCPU.Memory[0x101] = 0xF0;


    this.IBMCPU.Memory[0x102] = 0x58; // L R1, 50H(R2, R3)
    this.IBMCPU.Memory[0x103] = 0x12;
    this.IBMCPU.Memory[0x104] = 0x30;
    this.IBMCPU.Memory[0x105] = 0x50;

    this.IBMCPU.Memory[0x106] = 0x50; // ST R1, 60H(R2, R3)
    this.IBMCPU.Memory[0x107] = 0x12;
    this.IBMCPU.Memory[0x108] = 0x30;
    this.IBMCPU.Memory[0x109] = 0x60;

    this.IBMCPU.Memory[0x10A] = 0x5A; // A R1, 60H(R2, R3)
    this.IBMCPU.Memory[0x10B] = 0x12;
    this.IBMCPU.Memory[0x10C] = 0x30;
    this.IBMCPU.Memory[0x10D] = 0x60;

    this.IBMCPU.Registers[2] = 0x0100;
    this.IBMCPU.Registers[3] = 0x0100;

    this.IBMCPU.Memory[0x250] = 0x12;  //0x250 = 12345678H
    this.IBMCPU.Memory[0x251] = 0x34;
    this.IBMCPU.Memory[0x252] = 0x56;
    this.IBMCPU.Memory[0x253] = 0x78;

    this.set('cpu', this.IBMCPU);
    this.set('instructions', this.IBMCPU.getInstructions(this.IBMCPU.PSW.Address, 16));
  }

  ready(){
    // If you override ready, always call super.ready() first.
    super.ready();
    // Output the custom element's HTML tag to the browser console.
    // Open your browser's developer tools to view the output.
    console.log(this.tagName);
  }

  _formatPSW(PSW) {
    return PSW.toString(2);
  }

  _formatAddress(PSW) {
    var addr = "0".repeat(6);
    addr += PSW.Address.toString(16).toUpperCase();
    return addr.substr(-6);
  }

  _formatHexUInt(val, length) {
    var len = length / 4;
    var sVal = "0".repeat(len);
    sVal += val.toString(16).toUpperCase();
    return sVal.substr(-len);
  }

  _formatInstruction(item) {
    var address = item.address - item.length;
    var sInstr = "";
    if(item.instruction) {
      var sName = item.instruction.Name + ' '.repeat(6 - item.instruction.Name.length);
      sInstr = `${this._formatHexUInt(address, 24)} | ${this._formatHexUInt(item.opCode, 8)} ${this._formatHexUInt(item.R1, 4)}${this._formatHexUInt(item.R2, 4)}`;
      switch(item.addressMode) {
        case 0: //RR
          sInstr += " ".repeat(30 - sInstr.length);
          sInstr += `${sName} R${item.R1}, R${item.R2}`;
          break;
        case 1: //RX
          sInstr += ` ${this._formatHexUInt(item.R3, 4)} ${this._formatHexUInt(item.displacement, 12)}`;
          sInstr += " ".repeat(30 - sInstr.length);
          sInstr += `${sName} R${item.R1}, ${item.displacement.toString()}(R${item.R3}, R${item.R2})`;
          break; 
        case 2: //RS
          break;
        case 3: //SS
          break;
        break;
      }
    }
    return sInstr;
  }

  _formatMemory(cpu, instructions) {
    var _instr = instructions[0];
    const mask24 = 0xFFFFFF; 
    var address = (cpu.Registers[_instr.R3] & mask24) + _instr.displacement + ((_instr.R2)?(cpu.Registers[_instr.R2] & mask24):0);
    var sMem = "";
    var memory = cpu.Memory;

    for(var kLin = 0; kLin < 16 && address < memory.length; kLin++) {
      sMem += `${this._formatHexUInt(address, 24)} | `; 
      for(var kCol = 0; kCol < 4 && address < memory.length; kCol++) {
        for(var kByte = 0; kByte <  8 && address < memory.length; kByte++, address++) {
          sMem += `${this._formatHexUInt(memory[address], 8)}`; 
        }
        sMem += " ";
      }
      sMem += '\n';
    }

    return sMem;
  }

  ExecNextInstruction() {
    this.cpu.ExecNextInstruction();
    this.notifyPath('cpu.PSW');
    this.notifyPath('cpu.Registers');
    this.set('instructions', this.IBMCPU.getInstructions(this.IBMCPU.PSW.Address, 16));
  }

  static get template () {
    return html`
    <h1>PSW: [[_formatPSW(cpu.PSW)]]</h1>
    <h2>current Address: [[_formatAddress(cpu.PSW)]]H </h2>
    <div>
      <div style="float: left">
        <h3>Registers</h3>
        <template is="dom-repeat" items="{{cpu.Registers}}" mutable-data style=" font-size: 11px !important; font-family: Menlo, monospace;">
          <pre>R[[_formatHexUInt(index, 4)]] [[_formatHexUInt(item, 32)]]</pre>
        </template>
      </div>
      <div style="float: left; padding-left: 10px; style=" font-size: 11px !important; font-family: Menlo, monospace;"">
        <h3>Instructions</h3>
        <template is="dom-repeat" items="{{instructions}}" mutable-data>
          <pre>[[_formatInstruction(item)]]</pre>
        </template>
        </div>
      </div>
      <div style="float: left; padding-left: 10px; style=" font-size: 11px !important; font-family: Menlo, monospace;"">
        <h3>Memory</h3>
        <template is="dom-if" if="{{instructions[0].addressMode === 1}}" mutable-data>
          <pre>[[_formatMemory(cpu, instructions)]]</pre>
        </template>
        </div>
      </div>
    `;
  }

}

// Register the element with the browser.
customElements.define('ibm-360-vm', ibm360vm);