import{w as p,u as n,e as u}from"./index-DtL3pAzF.js";import{L as d}from"./LoginForm-CyhtUFBf.js";import"./jsx-runtime-D_zvdyIk.js";import"./index-D4lIrffr.js";import"./hooks-Bxn_zwj1.js";import"./react-redux-Dn6r42s_.js";import"./auth.slice-DipMbztw.js";import"./auth.selectors-CuJgQIbu.js";import"./i18n.hook-BEJJAUYQ.js";import"./i18n.context-nfTZ_47v.js";const h={title:"ports/auth/LoginForm",component:d},e={},a={play:async({canvasElement:l})=>{const t=p(l);await n.type(t.getByLabelText("Email"),"member@example.com"),await n.click(t.getByRole("button",{name:"Send login link"})),await u(await t.findByRole("alert")).toBeInTheDocument()}};var o,r,s;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:"{}",...(s=(r=e.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};var i,m,c;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
}`,...(c=(m=a.parameters)==null?void 0:m.docs)==null?void 0:c.source}}};const L=["Default","RequestFailed"];export{e as Default,a as RequestFailed,L as __namedExportsOrder,h as default};
