export function element(tag,{className,text,attrs}={},...children){const e=document.createElement(tag);if(className)e.className=className;if(text!==undefined)e.textContent=text;for(const [k,v] of Object.entries(attrs||{}))e.setAttribute(k,String(v));for(const ch of children)if(ch)e.append(ch);return e;}
export function button(label,action,cls='button'){const e=element('button',{className:cls,text:label,attrs:{type:'button'}});e.addEventListener('click',action);return e;}
export function card(...children){return element('section',{className:'card'},...children);}
export function clear(root,...children){root.replaceChildren(...children);}
export function note(text){return element('div',{className:'note',text});}
export function header(kicker,title){return element('div',{},element('div',{className:'eyebrow',text:kicker}),element('h1',{className:'h',text:title}));}
export function statusMessage(message,type='warn'){return element('div',{className:'feedback '+type,text:message,attrs:{role:'status'}});}
