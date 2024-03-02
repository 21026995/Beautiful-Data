/*! For license information please see p5.axidraw.js.LICENSE.txt */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.axidraw=t():e.axidraw=t()}(this,(()=>(()=>{var e={830:function(e){var t;t=()=>{return e={883:(e,t,r)=>{const n=r(397);function o(e){if(e<0||e>255)throw new Error("Byte value must be between 0 and 255.");if(!Number.isInteger(e))throw new Error("Byte values must be integers.")}function i(e){if(-1===["A","B","C","D","E"].indexOf(e))throw new Error("Port letter must be A, B, C, D, or E.")}e.exports={EiBotBoard:class{constructor(){this.port=new n,this.pending=[],this.responseHandlers=[],this.port.on("line",(e=>{0!==this.responseHandlers.length?this.responseHandlers.shift()(e):console.log(`Received unexpected message from EBB: ${e}`)}))}connect(){return this.port.connect(115200)}command(e,t=1,r=3e3){const n=new Promise(((n,o)=>{let i=!1;const a=setTimeout((()=>{i=!0,o(new Error(`Command "${e}" timed out`))}),r),s=[];for(let e=0;e<t;e+=1)this.responseHandlers.push((e=>{i||(s.push(e),s.length===t&&(clearTimeout(a),n(s.join("\r\n"))))}))}));return new Promise((t=>{const r=()=>this.port.print(`${e}\r`).then((()=>n)).then((e=>{t(e),this.pending.shift(),this.pending.length>0&&this.pending[0]().then()})),o=this.pending.length>0;this.pending.push(r),o||r().then()}))}async analogValueGet(){return(await this.command("A")).split(",").slice(1).reduce(((e,t)=>{const[r,n]=t.split(":").map((e=>parseInt(e,10)));return{...e,[r]:n}}),{})}async analogConfigure(e,t){if(e<0||e>15)throw new Error(`Channel must be between 0 and 15. Is ${e}`);const r=await this.command(`AC,${e},${t?1:0}`);if("OK"!==r)throw new Error(`Received unexpected response: ${r}`)}async enterBootloader(){return await this.command("BL"),this.port.disconnect()}async configurePinDirections(e,t,r,n,i){o(e),o(t),o(r),o(n),o(i);const a=await this.command(`C,${e},${t},${r},${n},${i}`);if("OK"!==a)throw new Error(`Received unexpected response: ${a}`)}async clearStepPosition(){const e=await this.command("CS");if("OK"!==e)throw new Error(`Received unexpected response: ${e}`)}async configureUserOptions(e=!0,t=!0,r=!1){await this.command("CU,1,"+(e?1:0)),await this.command("CU,2,"+(t?1:0)),await this.command("CU,3,"+(r?1:0))}async enableMotors(e,t){const r=await this.command(`EM,${e},${t}`);if("OK"!==r)throw new Error(`Received unexpected response: ${r}`)}async emergencyStop(e){const t=e?await this.command("ES,1",2):await this.command("ES",2);if(-1===t.indexOf("\r\n"))throw new Error(`Unexpected response: ${t}`);const[r,n]=t.split("\r\n");if("OK"!==n)throw new Error(`Unexpected response: ${t}`);const[o,i,a,s,c]=r.split(",");return{interrupted:"1"===o,fifoSteps:[parseInt(i,10),parseInt(a,10)],stepsRemaining:[parseInt(s,10),parseInt(c,10)]}}async absoluteMove(e,t=0,r=0){if(e<2||e>25e3)throw new Error("Step frequency must be between 2 and 25000.");const n=4294967;if(t<-4294967||t>n)throw new Error("Motor 1 position must be between -4294967 and 4294967.");if(r<-4294967||r>n)throw new Error("Motor 2 position must be between -4294967 and 4294967.");const o=await this.command(`HM,${e},${t},${r}`);if("OK"!==o)throw new Error(`Received unexpected response: ${o}`)}async getInput(){const e=await this.command("I");if(!e.startsWith("I"))throw new Error(`Received unexpected response: ${e}`);const[,...t]=e.split(",");return t.map((e=>parseInt(e,10)))}async lowLevelMove(e,t,r,n,o,i,a,s){if(e<0||e>2**31-1)throw new Error("Motor 1 rate must be between 0 and 2^31-1.");if(o<0||o>2**31-1)throw new Error("Motor 2 rate must be between 0 and 2^31-1.");if(t<-(2**31)||t>2**31-1)throw new Error("Motor 1 steps must be between -2^31 and 2^31-1.");if(i<-(2**31)||i>2**31-1)throw new Error("Motor 2 steps must be between -2^31 and 2^31-1.");if(r<-(2**31)||r>2**31-1)throw new Error("Motor 1 acceleration must be between -2^31 and 2^31-1.");if(a<-(2**31)||a>2**31-1)throw new Error("Motor 2 acceleration must be between -2^31 and 2^31-1.");const c=(s?2:0)+(n?1:0),u=await this.command(`LM,${e},${t},${r},${o},${i},${a},${c}`);if("OK"!==u)throw new Error(`Received unexpected response: ${u}`)}async lowLevelMoveTimeLimited(e,t,r,n,o,i,a){if(t<0||t>2**31-1)throw new Error("Motor 1 rate must be between 0 and 2^31-1.");if(o<0||o>2**31-1)throw new Error("Motor 2 rate must be between 0 and 2^31-1.");if(r<-(2**31)||r>2**31-1)throw new Error("Motor 1 acceleration must be between -2^31 and 2^31-1.");if(i<-(2**31)||i>2**31-1)throw new Error("Motor 2 acceleration must be between -2^31 and 2^31-1.");const s=(a?2:0)+(n?1:0),c=await this.command(`LT,${e},${t},${r},${o},${i},${s}`);if("OK"!==c)throw new Error(`Received unexpected response: ${c}`)}async memoryRead(e){if(e<0||e>4095)throw new Error("Address must be between 0 and 4095.");const t=await this.command(`MR,${e}`),[r,n]=t.split(",");if("MR"!==r)throw new Error(`Received unexpected response: ${t}`);return parseInt(n,10)}async memoryWrite(e,t){if(e<0||e>4095)throw new Error("Address must be between 0 and 4095.");o(t);const r=await this.command(`MW,${e},${t}`);if("OK"!==r)throw new Error(`Received unexpected response: ${r}`)}async nodeCountDecrement(){const e=await this.command("ND");if("OK"!==e)throw new Error(`Received unexpected response: ${e}`)}async nodeCountIncrement(){const e=await this.command("NI");if("OK"!==e)throw new Error(`Received unexpected response: ${e}`)}async setOutputs(e,t,r,n,i){o(e),o(t),o(r),o(n),o(i);const a=await this.command(`O,${e},${t},${r},${n},${i}`);if("OK"!==a)throw new Error(`Received unexpected response: ${a}`)}async pulseConfigure(e,t,r,n,o,i,a,s){const c=await this.command(`PC,${e},${t},${r},${n},${o},${i},${a},${s}`);if("OK"!==c)throw new Error(`Received unexpected response: ${c}`)}async setPinDirection(e,t,r){if(i(e),t<0||t>7)throw new Error("Pin index must be between 0 and 7.");const n=await this.command(`PD,${e},${t},${r?0:1}`);if("OK"!==n)throw new Error(`Received unexpected response: ${n}`)}async pulseGo(e){const t=await this.command("PG,"+(e?1:0));if("OK"!==t)throw new Error(`Received unexpected response: ${t}`)}async pinInput(e,t){if(i(e),t<0||t>7)throw new Error("Pin index must be between 0 and 7.");const r=await this.command(`PI,${e},${t}`),[n,o]=r.split(",");if("PI"!==n)throw new Error(`Received unexpected response: ${r}`);return"1"===o}async pinOutput(e,t,r){if(i(e),t<0||t>7)throw new Error("Pin index must be between 0 and 7.");const n=await this.command(`PO,${e},${t},${r?1:0}`);if("OK"!==n)throw new Error(`Received unexpected response: ${n}`)}async queryButton(){const e=await this.command("QB",2);if(-1===e.indexOf("\r\n"))throw new Error(`Unexpected response: ${e}`);const[t,r]=e.split("\r\n");if("OK"!==r)throw new Error(`Unexpected response: ${e}`);return"1"===t}async queryCurrent(e=!1){const t=await this.command("QC",2);if(-1===t.indexOf("\r\n"))throw new Error(`Unexpected response: ${t}`);const[r,n]=t.split("\r\n");if("OK"!==n)throw new Error(`Unexpected response: ${t}`);const[o,i]=r.split(",").map((e=>parseInt(e,10)));return{maxCurrent:3.3*o/1023/1.76,powerVoltage:3.3*i/1023/(e?1/11:1/9.2)+.3}}async queryMotorConfig(){const e=await this.command("QE",2);if(-1===e.indexOf("\r\n"))throw new Error(`Unexpected response: ${e}`);const[t,r]=e.split("\r\n");if("OK"!==r)throw new Error(`Unexpected response: ${e}`);const[n,o]=t.split(",").map((e=>parseInt(e,10))),i={0:0,1:5,2:4,4:3,8:2,16:1};if(!(n in i)||!(o in i))throw new Error(`Unexpected response: ${e}`);return[i[n],i[o]]}async queryGeneral(){const e=await this.command("QG"),t=parseInt(e,16),r=(e,t)=>(e&1<<t)>0;return{pinRB5:r(t,7),pinRB2:r(t,6),buttonPrg:r(t,5),penDown:r(t,4),commandExecuting:r(t,3),motor1Moving:r(t,2),motor2Moving:r(t,1),fifoEmpty:!r(t,0)}}async queryLayer(){const e=await this.command("QL",2),[t,r]=e.split("\r\n");if("OK"!==r)throw new Error(`Unexpected response: ${e}`);return parseInt(t,10)}async queryMotors(){const e=await this.command("QM");if(!e.startsWith("QM,"))throw new Error(`Unexpected response: ${e}`);const[,t,r,n,o]=e.split(",");return{executingMotion:parseInt(t,10)>0,motorMoving:["1"===r,"1"===n],fifoEmpty:0===parseInt(o,10)}}async queryPen(){const e=await this.command("QP",2);if(-1===e.indexOf("\r\n"))throw new Error(`Unexpected response: ${e}`);const[t,r]=e.split("\r\n");if("OK"!==r)throw new Error(`Unexpected response: ${e}`);return 0===parseInt(t,10)}async queryServoPower(){const e=await this.command("QR",2);if(-1===e.indexOf("\r\n"))throw new Error(`Unexpected response: ${e}`);const[t,r]=e.split("\r\n");if("OK"!==r)throw new Error(`Unexpected response: ${e}`);return 1===parseInt(t,10)}async queryStepPosition(){const e=await this.command("QS",2);if(-1===e.indexOf("\r\n"))throw new Error(`Unexpected response: ${e}`);const[t,r]=e.split("\r\n");if("OK"!==r)throw new Error(`Unexpected response: ${e}`);const[n,o]=t.split(",");return[parseInt(n,10),parseInt(o,10)]}async queryNickname(){const e=await this.command("QT",2);if(-1===e.indexOf("\r\n"))throw new Error(`Unexpected response: ${e}`);const[t,r]=e.split("\r\n");if("OK"!==r)throw new Error(`Unexpected response: ${e}`);return t}async reboot(){return await this.command("RB"),this.port.disconnect()}async reset(){const e=await this.command("R");if("OK"!==e)throw new Error(`Unexpected response: ${e}`)}async servoOutput(e,t,r,n){if(e<0||e>65535)throw new Error("Position must be between 0 and 2^16 - 1");if(t<0||t>24)throw new Error("Pin index must be between 0 and 24");if(r<0||r>65535)throw new Error("Rate must be between 0 and 2^16 - 1");if(n<0||n>65535)throw new Error("Delay must be between 0 and 2^16 - 1");const o=await this.command(`S2,${e},${t},${r},${n}`);if("OK"!==o)throw new Error(`Unexpected response: ${o}`)}async stepperAndServoModeConfigure(e,t){let r;switch(e){case 1:if(t<0||t>2)throw new Error("Parameter value must be between 0 and 2");r=`SC,1,${t}`;break;case 2:if(t<0||t>2)throw new Error("Parameter value must be between 0 and 2");r=`SC,2,${t}`;break;case 4:if(t<1||t>65535)throw new Error("Parameter value must be between 1 and 2^16 - 1");r=`SC,4,${t}`;break;case 5:if(t<1||t>65535)throw new Error("Parameter value must be between 1 and 2^16 - 1");r=`SC,5,${t}`;break;case 8:if(t<1||t>24)throw new Error("Parameter value must be between 1 and 24");r=`SC,8,${t}`;break;case 9:if(t<1||t>6)throw new Error("Parameter value must be between 1 and 6");r=`SC,9,${t}`;break;case 10:if(t<0||t>65535)throw new Error("Parameter value must be between 0 and 2^16 - 1");r=`SC,10,${t}`;break;case 11:if(t<0||t>65535)throw new Error("Parameter value must be between 0 and 2^16 - 1");r=`SC,11,${t}`;break;case 12:if(t<0||t>65535)throw new Error("Parameter value must be between 0 and 2^16 - 1");r=`SC,12,${t}`;break;case 13:if(t<0||t>1)throw new Error("Parameter value must be between 0 and 1");r=`SC,13,${t}`;break;default:throw new Error(`Parameter index ${e} not allowed`)}const n=await this.command(r);if("OK"!==n)throw new Error(`Unexpected response: ${n}`)}async setEngraver(e,t,r){if(t<0||t>1023)throw new Error("Power must be between 0 and 1023");const n=await this.command(`SE,${e?1:0},${t},${r?1:0}`);if("OK"!==n)throw new Error(`Unexpected response: ${n}`)}async setLayer(e){if(e<0||e>127)throw new Error("Layer value must be between 0 and 127");const t=await this.command(`SL,${e}`);if("OK"!==t)throw new Error(`Unexpected response: ${t}`)}async stepperMove(e,t,r){if(e<1||e>2**24-1)throw new Error("Duration must be between 1 and 2^24 - 1");if(t<-(2**24)||t>2**24-1)throw new Error("M1 steps must be between -2^24 and 2^24 - 1");if(r<-(2**24)||r>2**24-1)throw new Error("M2 steps must be between -2^24 and 2^24 - 1");const n=await this.command(`SM,${e},${t},${r}`);if("OK"!==n)throw new Error(`Unexpected response: ${n}`)}async setNodeCount(e){if(e<0||e>=2**32)throw new Error("Node count must be between 0 and 2^32");const t=await this.command(`SN,${e}`);if("OK"!==t)throw new Error(`Unexpected response: ${t}`)}async setPenState(e,t,r){if(void 0!==t&&(t<1||t>=65536))throw new Error("Duration must be between 1 and 2^16");if(void 0!==r&&(r<0||r>7))throw new Error("Port B pin must be between 0 and 7");const n=e?0:1;let o;if(o=void 0!==t&&void 0!==r?await this.command(`SP,${n},${t},${r}`):void 0!==t?await this.command(`SP,${n},${t}`):await this.command(`SP,${n}`),"OK"!==o)throw new Error(`Unexpected response: ${o}`)}async setServoPowerTimeout(e,t){if(e<0||e>=2**32)throw new Error("Duration must be between 0 and 2^32");const r=await this.command(`SR,${e},${t?1:0}`);if("OK"!==r)throw new Error(`Unexpected response: ${r}`)}async setNickname(e){if(e.length>16)throw new Error("Nickname must be 16 characters or less");const t=await this.command(`ST,${e}`);if("OK"!==t)throw new Error(`Unexpected response: ${t}`)}async timedRead(e,t){if(e<1||e>=65536)throw new Error("Duration must be between 1 and 2^16");const r=t?0:1,n=await this.command(`T,${e},${r}`);if("OK"!==n)throw new Error(`Unexpected response: ${n}`)}async togglePen(e){if(e){if(e<1||e>=65536)throw new Error("Duration must be between 0 and 2^16");return void await this.command(`TP,${Math.floor(e)}`)}const t=await this.command("TP");if("OK"!==t)throw new Error(`Unexpected response: ${t}`)}async queryNodeCount(){const e=await this.command("QN",2);if(-1===e.indexOf("\r\n"))throw new Error(`Unexpected response: ${e}`);const[t,r]=e.split("\r\n");if("OK"!==r)throw new Error(`Unexpected response: ${e}`);return parseInt(t,10)}queryVersion(){return this.command("V")}async stepperMoveMixedAxis(e,t,r){if(e<1||e>=2**24)throw new Error("Duration must be between 1 and 2^24 milliseconds");if(t<=-(2**24)||t>=2**24)throw new Error("Steps A must be between 0 and 2^24");if(r<-(2**24)||r>=2**24)throw new Error("Steps B must be between 0 and 2^24");const n=await this.command(`XM,${Math.floor(e)},${Math.floor(t)},${Math.floor(r)}`);if("OK"!==n)throw new Error(`Unexpected response: ${n}`)}},PEN_UP:1,PEN_DOWN:0,MOTOR_DISABLE:0,MOTOR_STEP_DIV16:1,MOTOR_STEP_DIV8:2,MOTOR_STEP_DIV4:3,MOTOR_STEP_DIV2:4,MOTOR_STEP_DIV1:5}},579:(e,t,r)=>{e.exports={...r(883)}},397:(e,t,r)=>{const n=r(729);e.exports=class extends n{constructor(){super(),this.port=null,this.reader=null,this.buffer=""}async connect(e){this.port=await navigator.serial.requestPort(),await this.port.open({baudRate:e}),this.listen().then()}async listen(){for(;this.port.readable;)try{this.reader=this.port.readable.getReader();const{value:e,done:t}=await this.reader.read();if(t)return void await this.reader.cancel();this.emit("data",e),this.buffer+=(new TextDecoder).decode(e);const r=this.buffer.split(/\r\n|\n\r/);if(r.length>1){for(let e=0;e<r.length-1;e++){const t=r[e];this.emit("line",t),console.log("rx:",t)}this.buffer=r[r.length-1]}}catch(e){console.error("Error reading data from serial port",e)}finally{this.reader&&this.reader.releaseLock()}}async write(e){if(!this.port||!this.port.writable)throw new Error("Serial port is not writable or not connected");this.writer=this.port.writable.getWriter(),await this.writer.write(e),this.writer.releaseLock()}async print(e){console.log("tx:",e);const t=(new TextEncoder).encode(e);await this.write(t)}async disconnect(){this.reader&&(await this.reader.cancel(),await this.reader.releaseLock()),this.port&&(await this.port.close(),this.port=null)}}},729:e=>{"use strict";var t=Object.prototype.hasOwnProperty,r="~";function n(){}function o(e,t,r){this.fn=e,this.context=t,this.once=r||!1}function i(e,t,n,i,a){if("function"!=typeof n)throw new TypeError("The listener must be a function");var s=new o(n,i||e,a),c=r?r+t:t;return e._events[c]?e._events[c].fn?e._events[c]=[e._events[c],s]:e._events[c].push(s):(e._events[c]=s,e._eventsCount++),e}function a(e,t){0==--e._eventsCount?e._events=new n:delete e._events[t]}function s(){this._events=new n,this._eventsCount=0}Object.create&&(n.prototype=Object.create(null),(new n).__proto__||(r=!1)),s.prototype.eventNames=function(){var e,n,o=[];if(0===this._eventsCount)return o;for(n in e=this._events)t.call(e,n)&&o.push(r?n.slice(1):n);return Object.getOwnPropertySymbols?o.concat(Object.getOwnPropertySymbols(e)):o},s.prototype.listeners=function(e){var t=r?r+e:e,n=this._events[t];if(!n)return[];if(n.fn)return[n.fn];for(var o=0,i=n.length,a=new Array(i);o<i;o++)a[o]=n[o].fn;return a},s.prototype.listenerCount=function(e){var t=r?r+e:e,n=this._events[t];return n?n.fn?1:n.length:0},s.prototype.emit=function(e,t,n,o,i,a){var s=r?r+e:e;if(!this._events[s])return!1;var c,u,h=this._events[s],f=arguments.length;if(h.fn){switch(h.once&&this.removeListener(e,h.fn,void 0,!0),f){case 1:return h.fn.call(h.context),!0;case 2:return h.fn.call(h.context,t),!0;case 3:return h.fn.call(h.context,t,n),!0;case 4:return h.fn.call(h.context,t,n,o),!0;case 5:return h.fn.call(h.context,t,n,o,i),!0;case 6:return h.fn.call(h.context,t,n,o,i,a),!0}for(u=1,c=new Array(f-1);u<f;u++)c[u-1]=arguments[u];h.fn.apply(h.context,c)}else{var p,w=h.length;for(u=0;u<w;u++)switch(h[u].once&&this.removeListener(e,h[u].fn,void 0,!0),f){case 1:h[u].fn.call(h[u].context);break;case 2:h[u].fn.call(h[u].context,t);break;case 3:h[u].fn.call(h[u].context,t,n);break;case 4:h[u].fn.call(h[u].context,t,n,o);break;default:if(!c)for(p=1,c=new Array(f-1);p<f;p++)c[p-1]=arguments[p];h[u].fn.apply(h[u].context,c)}}return!0},s.prototype.on=function(e,t,r){return i(this,e,t,r,!1)},s.prototype.once=function(e,t,r){return i(this,e,t,r,!0)},s.prototype.removeListener=function(e,t,n,o){var i=r?r+e:e;if(!this._events[i])return this;if(!t)return a(this,i),this;var s=this._events[i];if(s.fn)s.fn!==t||o&&!s.once||n&&s.context!==n||a(this,i);else{for(var c=0,u=[],h=s.length;c<h;c++)(s[c].fn!==t||o&&!s[c].once||n&&s[c].context!==n)&&u.push(s[c]);u.length?this._events[i]=1===u.length?u[0]:u:a(this,i)}return this},s.prototype.removeAllListeners=function(e){var t;return e?(t=r?r+e:e,this._events[t]&&a(this,t)):(this._events=new n,this._eventsCount=0),this},s.prototype.off=s.prototype.removeListener,s.prototype.addListener=s.prototype.on,s.prefixed=r,s.EventEmitter=s,e.exports=s}},t={},function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,r),i.exports}(579);var e,t},e.exports=t()}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var i=t[n]={exports:{}};return e[n].call(i.exports,i,i.exports,r),i.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var n={};return(()=>{"use strict";r.r(n),r.d(n,{AxiDraw:()=>l,MAX_MM_PER_SEC:()=>f,MIN_MM_PER_SEC:()=>p,STEPS_PER_MM:()=>h});var e=r(830);function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},t(e)}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function i(){i=function(){return e};var e={},r=Object.prototype,n=r.hasOwnProperty,o=Object.defineProperty||function(e,t,r){e[t]=r.value},a="function"==typeof Symbol?Symbol:{},s=a.iterator||"@@iterator",c=a.asyncIterator||"@@asyncIterator",u=a.toStringTag||"@@toStringTag";function h(e,t,r){return Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}),e[t]}try{h({},"")}catch(e){h=function(e,t,r){return e[t]=r}}function f(e,t,r,n){var i=t&&t.prototype instanceof d?t:d,a=Object.create(i.prototype),s=new _(n||[]);return o(a,"_invoke",{value:$(e,r,s)}),a}function p(e,t,r){try{return{type:"normal",arg:e.call(t,r)}}catch(e){return{type:"throw",arg:e}}}e.wrap=f;var w={};function d(){}function l(){}function m(){}var v={};h(v,s,(function(){return this}));var y=Object.getPrototypeOf,b=y&&y(y(M([])));b&&b!==r&&n.call(b,s)&&(v=b);var x=m.prototype=d.prototype=Object.create(v);function E(e){["next","throw","return"].forEach((function(t){h(e,t,(function(e){return this._invoke(t,e)}))}))}function g(e,r){function i(o,a,s,c){var u=p(e[o],e,a);if("throw"!==u.type){var h=u.arg,f=h.value;return f&&"object"==t(f)&&n.call(f,"__await")?r.resolve(f.__await).then((function(e){i("next",e,s,c)}),(function(e){i("throw",e,s,c)})):r.resolve(f).then((function(e){h.value=e,s(h)}),(function(e){return i("throw",e,s,c)}))}c(u.arg)}var a;o(this,"_invoke",{value:function(e,t){function n(){return new r((function(r,n){i(e,t,r,n)}))}return a=a?a.then(n,n):n()}})}function $(e,t,r){var n="suspendedStart";return function(o,i){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw i;return{value:void 0,done:!0}}for(r.method=o,r.arg=i;;){var a=r.delegate;if(a){var s=O(a,r);if(s){if(s===w)continue;return s}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var c=p(e,t,r);if("normal"===c.type){if(n=r.done?"completed":"suspendedYield",c.arg===w)continue;return{value:c.arg,done:r.done}}"throw"===c.type&&(n="completed",r.method="throw",r.arg=c.arg)}}}function O(e,t){var r=t.method,n=e.iterator[r];if(void 0===n)return t.delegate=null,"throw"===r&&e.iterator.return&&(t.method="return",t.arg=void 0,O(e,t),"throw"===t.method)||"return"!==r&&(t.method="throw",t.arg=new TypeError("The iterator does not provide a '"+r+"' method")),w;var o=p(n,e.iterator,t.arg);if("throw"===o.type)return t.method="throw",t.arg=o.arg,t.delegate=null,w;var i=o.arg;return i?i.done?(t[e.resultName]=i.value,t.next=e.nextLoc,"return"!==t.method&&(t.method="next",t.arg=void 0),t.delegate=null,w):i:(t.method="throw",t.arg=new TypeError("iterator result is not an object"),t.delegate=null,w)}function P(e){var t={tryLoc:e[0]};1 in e&&(t.catchLoc=e[1]),2 in e&&(t.finallyLoc=e[2],t.afterLoc=e[3]),this.tryEntries.push(t)}function S(e){var t=e.completion||{};t.type="normal",delete t.arg,e.completion=t}function _(e){this.tryEntries=[{tryLoc:"root"}],e.forEach(P,this),this.reset(!0)}function M(e){if(e){var t=e[s];if(t)return t.call(e);if("function"==typeof e.next)return e;if(!isNaN(e.length)){var r=-1,o=function t(){for(;++r<e.length;)if(n.call(e,r))return t.value=e[r],t.done=!1,t;return t.value=void 0,t.done=!0,t};return o.next=o}}return{next:k}}function k(){return{value:void 0,done:!0}}return l.prototype=m,o(x,"constructor",{value:m,configurable:!0}),o(m,"constructor",{value:l,configurable:!0}),l.displayName=h(m,u,"GeneratorFunction"),e.isGeneratorFunction=function(e){var t="function"==typeof e&&e.constructor;return!!t&&(t===l||"GeneratorFunction"===(t.displayName||t.name))},e.mark=function(e){return Object.setPrototypeOf?Object.setPrototypeOf(e,m):(e.__proto__=m,h(e,u,"GeneratorFunction")),e.prototype=Object.create(x),e},e.awrap=function(e){return{__await:e}},E(g.prototype),h(g.prototype,c,(function(){return this})),e.AsyncIterator=g,e.async=function(t,r,n,o,i){void 0===i&&(i=Promise);var a=new g(f(t,r,n,o),i);return e.isGeneratorFunction(r)?a:a.next().then((function(e){return e.done?e.value:a.next()}))},E(x),h(x,u,"Generator"),h(x,s,(function(){return this})),h(x,"toString",(function(){return"[object Generator]"})),e.keys=function(e){var t=Object(e),r=[];for(var n in t)r.push(n);return r.reverse(),function e(){for(;r.length;){var n=r.pop();if(n in t)return e.value=n,e.done=!1,e}return e.done=!0,e}},e.values=M,_.prototype={constructor:_,reset:function(e){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(S),!e)for(var t in this)"t"===t.charAt(0)&&n.call(this,t)&&!isNaN(+t.slice(1))&&(this[t]=void 0)},stop:function(){this.done=!0;var e=this.tryEntries[0].completion;if("throw"===e.type)throw e.arg;return this.rval},dispatchException:function(e){if(this.done)throw e;var t=this;function r(r,n){return a.type="throw",a.arg=e,t.next=r,n&&(t.method="next",t.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var s=n.call(i,"catchLoc"),c=n.call(i,"finallyLoc");if(s&&c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(e,t){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===e||"continue"===e)&&i.tryLoc<=t&&t<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=e,a.arg=t,i?(this.method="next",this.next=i.finallyLoc,w):this.complete(a)},complete:function(e,t){if("throw"===e.type)throw e.arg;return"break"===e.type||"continue"===e.type?this.next=e.arg:"return"===e.type?(this.rval=this.arg=e.arg,this.method="return",this.next="end"):"normal"===e.type&&t&&(this.next=t),w},finish:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.finallyLoc===e)return this.complete(r.completion,r.afterLoc),S(r),w}},catch:function(e){for(var t=this.tryEntries.length-1;t>=0;--t){var r=this.tryEntries[t];if(r.tryLoc===e){var n=r.completion;if("throw"===n.type){var o=n.arg;S(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(e,t,r){return this.delegate={iterator:M(e),resultName:t,nextLoc:r},"next"===this.method&&(this.arg=void 0),w}},e}function a(e,t,r,n,o,i,a){try{var s=e[i](a),c=s.value}catch(e){return void r(e)}s.done?t(c):Promise.resolve(c).then(n,o)}function s(e){return function(){var t=this,r=arguments;return new Promise((function(n,o){var i=e.apply(t,r);function s(e){a(i,n,o,s,c,"next",e)}function c(e){a(i,n,o,s,c,"throw",e)}s(void 0)}))}}function c(e,r){for(var n=0;n<r.length;n++){var o=r[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,(void 0,i=function(e,r){if("object"!==t(e)||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,"string");if("object"!==t(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(o.key),"symbol"===t(i)?i:String(i)),o)}var i}function u(e,t,r){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return r}var h=80,f=380,p=1.31/h;function w(e){return new Promise((function(t){setTimeout(t,e)}))}var d=new WeakSet,l=function(){function t(){var r,n;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")}(r=this,n=d),n.add(r),this.ebb=new e.EiBotBoard,this.connected=!1,this.targetPos={x:0,y:0},this.lastCommandedPos={x:0,y:0},this.mmPerSec=25,this.commands=[]}var r,n,a,l,v,y,b,x,E,g,$;return r=t,n=[{key:"isBusy",value:function(){return this.commands.length>0}},{key:"connect",value:($=s(i().mark((function e(){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.connected){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,this.ebb.connect();case 4:this.connected=!0;case 5:case"end":return e.stop()}}),e,this)}))),function(){return $.apply(this,arguments)})},{key:"disconnect",value:(g=s(i().mark((function e(){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.connected){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,this.ebb.disconnect();case 4:this.connected=!1;case 5:case"end":return e.stop()}}),e,this)}))),function(){return g.apply(this,arguments)})},{key:"enable",value:(E=s(i().mark((function t(){var r=this;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.connected){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,u(this,d,m).call(this,(function(){return r.ebb.enableMotors(e.MOTOR_STEP_DIV16,e.MOTOR_STEP_DIV16)}));case 4:case"end":return t.stop()}}),t,this)}))),function(){return E.apply(this,arguments)})},{key:"disable",value:(x=s(i().mark((function t(){var r=this;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.connected){t.next=2;break}return t.abrupt("return");case 2:return t.next=4,u(this,d,m).call(this,(function(){return r.ebb.enableMotors(e.MOTOR_DISABLE,e.MOTOR_DISABLE)}));case 4:case"end":return t.stop()}}),t,this)}))),function(){return x.apply(this,arguments)})},{key:"currentPosition",value:(b=s(i().mark((function e(){var t=this;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.connected){e.next=2;break}throw new Error("Not connected");case 2:return e.abrupt("return",u(this,d,m).call(this,s(i().mark((function e(){var r,n,a,s,c,u;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.ebb.queryStepPosition();case 2:return r=e.sent,f=2,n=function(e){if(Array.isArray(e))return e}(i=r)||function(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,o,i,a,s=[],c=!0,u=!1;try{if(i=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;c=!1}else for(;!(c=(n=i.call(r)).done)&&(s.push(n.value),s.length!==t);c=!0);}catch(e){u=!0,o=e}finally{try{if(!c&&null!=r.return&&(a=r.return(),Object(a)!==a))return}finally{if(u)throw o}}return s}}(i,f)||function(e,t){if(e){if("string"==typeof e)return o(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?o(e,t):void 0}}(i,f)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),a=n[0],s=n[1],c=(a+s)/h*.5,u=(a-s)/h*.5,e.abrupt("return",{x:c,y:u});case 9:case"end":return e.stop()}var i,f}),e)})))));case 3:case"end":return e.stop()}}),e,this)}))),function(){return b.apply(this,arguments)})},{key:"penUp",value:(y=s(i().mark((function e(){var t=this;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.connected){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,u(this,d,m).call(this,s(i().mark((function e(){var r;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.ebb.queryPen();case 2:return r=e.sent,e.next=5,t.ebb.setPenState(!1);case 5:if(!r){e.next=8;break}return e.next=8,w(1e3);case 8:case"end":return e.stop()}}),e)}))));case 4:case"end":return e.stop()}}),e,this)}))),function(){return y.apply(this,arguments)})},{key:"penDown",value:(v=s(i().mark((function e(){var t=this;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.connected){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,u(this,d,m).call(this,s(i().mark((function e(){var r;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.ebb.queryPen();case 2:return r=e.sent,e.next=5,t.ebb.setPenState(!0);case 5:if(r){e.next=8;break}return e.next=8,w(1e3);case 8:case"end":return e.stop()}}),e)}))));case 4:case"end":return e.stop()}}),e,this)}))),function(){return v.apply(this,arguments)})},{key:"setSpeed",value:function(e){this.mmPerSec=Math.max(Math.min(e,f),p)}},{key:"moveTo",value:(l=s(i().mark((function e(t,r){var n,o,a,c,f=this;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.connected){e.next=2;break}return e.abrupt("return");case 2:if(this.targetPos={x:t,y:r},p=this.lastCommandedPos,l=this.targetPos,n=Math.sqrt(Math.pow(p.x-l.x,2)+Math.pow(p.y-l.y,2)),!((o=n/this.mmPerSec*1e3)<1)){e.next=7;break}return e.abrupt("return");case 7:return a={x:this.targetPos.x-this.lastCommandedPos.x,y:this.targetPos.y-this.lastCommandedPos.y},c={x:a.x*h,y:a.y*h},this.lastCommandedPos=this.targetPos,e.next=12,u(this,d,m).call(this,s(i().mark((function e(){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,f.ebb.stepperMoveMixedAxis(o,c.x,c.y);case 2:return e.next=4,w(o);case 4:case"end":return e.stop()}}),e)}))));case 12:case"end":return e.stop()}var p,l}),e,this)}))),function(e,t){return l.apply(this,arguments)})},{key:"stop",value:function(){if(!this.connected)return Promise.resolve();var e=this.ebb.emergencyStop(!1);return this.commands=[],e}},{key:"analogConfigure",value:(a=s(i().mark((function e(t,r){var n=this;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.connected){e.next=2;break}return e.abrupt("return");case 2:if(!(t<0||t>12)){e.next=4;break}throw new Error("Invalid channel number");case 4:return e.next=6,u(this,d,m).call(this,s(i().mark((function e(){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.ebb.analogConfigure(t,r);case 2:case"end":return e.stop()}}),e)}))));case 6:case"end":return e.stop()}}),e,this)}))),function(e,t){return a.apply(this,arguments)})},{key:"analogRead",value:function(e){var t=this;return this.connected?u(this,d,m).call(this,s(i().mark((function r(){var n;return i().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,t.ebb.analogValueGet(e);case 2:if(n=r.sent,e in n){r.next=5;break}throw new Error("Channel not enabled. Enable it with analogConfigure(".concat(e,", true) first."));case 5:return r.abrupt("return",n[e]/1023);case 6:case"end":return r.stop()}}),r)})))):Promise.resolve()}}],n&&c(r.prototype,n),Object.defineProperty(r,"prototype",{writable:!1}),t}();function m(e){var t=this;return new Promise((function(r){var n=function(){return e().then((function(e){r(e),t.commands.shift(),t.commands.length>0&&t.commands[0]().then()}))},o=t.commands.length>0;t.commands.push(n),o||n().then()}))}})(),n})()));