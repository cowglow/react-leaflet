import{j as p}from"./jsx-runtime-D_zvdyIk.js";import{f as d,w as u,u as g,e as C}from"./index-DtL3pAzF.js";import{D as v}from"./DialogWindow-DYkpicNP.js";import"./i18n.hook-BEJJAUYQ.js";import"./index-D4lIrffr.js";import"./i18n.context-nfTZ_47v.js";const h={title:"ports/dialogs/DialogWindow",component:v,args:{title:"Add Member",onClose:d(),children:p.jsx("p",{children:"Dialog content goes here."})}},e={},a={play:async({canvasElement:l,args:i})=>{const m=u(l);await g.click(m.getByRole("button",{name:"Close"})),await C(i.onClose).toHaveBeenCalled()}};var o,s,t;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:"{}",...(t=(s=e.parameters)==null?void 0:s.docs)==null?void 0:t.source}}};var n,r,c;a.parameters={...a.parameters,docs:{...(n=a.parameters)==null?void 0:n.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", {
      name: "Close"
    }));
    await expect(args.onClose).toHaveBeenCalled();
  }
}`,...(c=(r=a.parameters)==null?void 0:r.docs)==null?void 0:c.source}}};const k=["Default","CloseClicked"];export{a as CloseClicked,e as Default,k as __namedExportsOrder,h as default};
