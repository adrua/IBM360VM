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
import '@polymer/paper-checkbox/paper-checkbox.js';
import { setPassiveTouchGestures } from '@polymer/polymer/lib/utils/settings';

import { cpu } from './cpu-class.js'

class StartPolymer3 extends PolymerElement {
  static get properties () {
    return {
      message: {
        type: String,
        value: ''
      },
      pie: {
        type: Boolean,
        value: false,
        observer: 'togglePie'
      },
      loadComplete: {
        type: Boolean,
        value: false
      }
    };
  }

  constructor() {
    // If you override the constructor, always call the 
    // superconstructor first.
    super();

    window["IBMCPU"] = new cpu();
    IBMCPU.PSW.Program = 1;
    IBMCPU.PSW.Address = 0x100;

    IBMCPU.Memory[0x100] = 0x58; // L R1, 50H(R2, R3)
    IBMCPU.Memory[0x101] = 0x12;
    IBMCPU.Memory[0x102] = 0x30;
    IBMCPU.Memory[0x103] = 0x50;

    IBMCPU.Memory[0x104] = 0x50; // ST R1, 60H(R2, R3)
    IBMCPU.Memory[0x105] = 0x12;
    IBMCPU.Memory[0x106] = 0x30;
    IBMCPU.Memory[0x107] = 0x60;

    IBMCPU.Registers[2] = 0x0100;
    IBMCPU.Registers[3] = 0x0100;

    IBMCPU.Memory[0x250] = 0x12;  //0x250 = 12345678H
    IBMCPU.Memory[0x251] = 0x34;
    IBMCPU.Memory[0x252] = 0x56;
    IBMCPU.Memory[0x253] = 0x78;
  }

  ready(){
    // If you override ready, always call super.ready() first.
    super.ready();
    // Output the custom element's HTML tag to the browser console.
    // Open your browser's developer tools to view the output.
    console.log(this.tagName);
  }
  

  static get template () {
    // Template getter must return an instance of HTMLTemplateElement.
    // The html helper function makes this easy.
    return html`
      <style>
        paper-checkbox {
          --paper-checkbox-checked-ink-color: #FFFFFF;
          --paper-checkbox-unchecked-ink-color: #FFFFFF;
        }
      </style>

      <h1>Start IBM 360 </h1>
      <h2>PSW: {{PSW.toString(2)}}</h2>
    `;
  }
}

// Register the element with the browser.
customElements.define('start-polymer3', StartPolymer3);