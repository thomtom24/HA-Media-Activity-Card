const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const registry=new Map(),context={HTMLElement:class{},customElements:{get:k=>registry.get(k),define:(k,v)=>registry.set(k,v)},window:{}};
vm.createContext(context);
vm.runInContext(fs.readFileSync("ha-media-activity-card.js","utf8"),context);
test("registers card and editor",()=>{assert.ok(registry.has("media-activity-card"));assert.ok(registry.has("media-activity-card-editor"));});
test("escapes untrusted app names",()=>assert.equal(vm.runInContext('esc("<script>")',context),"&lt;script&gt;"));
test("formats duration",()=>assert.equal(vm.runInContext("duration(9000)",context),"2h 30m"));
test("avoids divide by zero",()=>assert.equal(vm.runInContext("pct(1,0)",context),null));
test("renders empty charts",()=>assert.match(vm.runInContext("chart([], {})",context),/<svg/));
