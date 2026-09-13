import{w as p,u as n,e as u}from"./index-Ch1O_M5-.js";import{L as d}from"./LoginForm-BGjj79-s.js";import"./jsx-runtime-D_zvdyIk.js";import"./index-D4lIrffr.js";import"./auth.selectors-BAS4YwMG.js";import"./react-redux-Dn6r42s_.js";import"./auth.slice-D7sgt_yh.js";import"./i18n.hook-BuLst5l6.js";import"./i18n.context-CgCQS9qW.js";const R={title:"ports/auth/LoginForm",component:d},e={},a={play:async({canvasElement:l})=>{const t=p(l);await n.type(t.getByLabelText("Email"),"member@example.com"),await n.click(t.getByRole("button",{name:"Send login link"})),await u(await t.findByRole("alert")).toBeInTheDocument()}};var o,r,s;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:"{}",...(s=(r=e.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};var i,m,c;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Email"), "member@example.com");
    await userEvent.click(canvas.getByRole("button", {
      name: "Send login link"
    }));
    await expect(await canvas.findByRole("alert")).toBeInTheDocument();
  }
}`,...(c=(m=a.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};const h=["Default","RequestFailed"];export{e as Default,a as RequestFailed,h as __namedExportsOrder,R as default};
