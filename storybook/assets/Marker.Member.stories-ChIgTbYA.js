import{M as b}from"./Marker.Member-ChlIhXtW.js";import{a as t}from"./story-fixtures-CINZKkVm.js";import"./jsx-runtime-D_zvdyIk.js";import"./index-D4lIrffr.js";import"./i18n.hook-BEJJAUYQ.js";import"./i18n.context-nfTZ_47v.js";import"./map-C93wRKkV.js";import"./iframe-DM4SJ1Xx.js";import"./marker-BPhuYeW1.js";import"./index-DsJinFGm.js";import"./hooks-Bxn_zwj1.js";import"./react-redux-Dn6r42s_.js";import"./windows.slice-DdXfUL5I.js";import"./member.slice-Dt6gKY0s.js";import"./member.selectors-BEYMWI49.js";import"./request-id-CAY4q5cO.js";import"./selection.slice-CJNz-S_B.js";import"./selection.selectors-dzruBmhK.js";import"./auth.selectors-CuJgQIbu.js";const l={auth:{status:"authenticated",account:{id:"account-1",email:"leader@example.com",role:"leader"},error:null}},S={auth:{status:"authenticated",account:{id:"account-2",email:"member@example.com",role:"member"},error:null}},B={title:"ports/markers/Marker.Member",component:b,parameters:{map:!0}},e={args:{member:t[0]},parameters:{reduxState:l}},r={args:{member:t[1]},parameters:{reduxState:l}},a={args:{member:t[0]},parameters:{reduxState:S}};var m,s,o;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    member: sampleMembers[0]
  },
  parameters: {
    reduxState: leaderState
  }
}`,...(o=(s=e.parameters)==null?void 0:s.docs)==null?void 0:o.source}}};var p,n,c;r.parameters={...r.parameters,docs:{...(p=r.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    member: sampleMembers[1]
  },
  parameters: {
    reduxState: leaderState
  }
}`,...(c=(n=r.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var i,d,u;a.parameters={...a.parameters,docs:{...(i=a.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    member: sampleMembers[0]
  },
  parameters: {
    reduxState: memberState
  }
}`,...(u=(d=a.parameters)==null?void 0:d.docs)==null?void 0:u.source}}};const D=["ActiveAsLeader","LostContactAsLeader","ReadOnlyAsMember"];export{e as ActiveAsLeader,r as LostContactAsLeader,a as ReadOnlyAsMember,D as __namedExportsOrder,B as default};
