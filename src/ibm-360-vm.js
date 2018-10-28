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

  _formatUInt32(val) {
    var sVal = "0".repeat(8);
    sVal += val.toString(16).toUpperCase();
    return sVal.substr(-8);
  }

  _formatInt4(val) {
    var sVal = "0".repeat(2) + val;
    return sVal.substr(-2);
  }
  
  ExecNextInstruction() {
    this.cpu.ExecNextInstruction();
    this.notifyPath('cpu.PSW');
    this.notifyPath('cpu.Registers');
  }

  static get template () {
    return html`
    <h1>PSW: [[_formatPSW(cpu.PSW)]]</h1>
    <h2>current Address: [[_formatAddress(cpu.PSW)]]H </h2>
    <h3>Registers</h3>
    <template is="dom-repeat" items="{{cpu.Registers}}" mutable-data>
    <div><span>R[[_formatInt4(index)]] [[_formatUInt32(item)]]</span></div>
  </template>
    `;
  }

}

// Register the element with the browser.
customElements.define('ibm-360-vm', ibm360vm);