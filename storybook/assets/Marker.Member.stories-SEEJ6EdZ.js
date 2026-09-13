import{M as b}from"./Marker.Member-i6-ZRv68.js";import{a as t}from"./story-fixtures-CINZKkVm.js";import"./jsx-runtime-D_zvdyIk.js";import"./index-D4lIrffr.js";import"./i18n.hook-BuLst5l6.js";import"./i18n.context-CgCQS9qW.js";import"./map-Cf2mBB-h.js";import"./iframe-DKtxwxI6.js";import"./marker-CkFPAjuQ.js";import"./index-DsJinFGm.js";import"./auth.selectors-BAS4YwMG.js";import"./react-redux-Dn6r42s_.js";import"./windows.slice-DdXfUL5I.js";import"./member.slice-Dt6gKY0s.js";import"./member.selectors-BQeLpn_d.js";import"./request-id-CAY4q5cO.js";import"./selection.slice-CJNz-S_B.js";import"./selection.selectors-dzruBmhK.js";const l={auth:{status:"authenticated",account:{id:"account-1",email:"leader@example.com",role:"leader"},error:null}},S={auth:{status:"authenticated",account:{id:"account-2",email:"member@example.com",role:"member"},error:null}},z={title:"ports/markers/Marker.Member",component:b,parameters:{map:!0}},e={args:{member:t[0]},parameters:{reduxState:l}},r={args:{member:t[1]},parameters:{reduxState:l}},a={args:{member:t[0]},parameters:{reduxState:S}};var m,s,o;e.parameters={...e.parameters,docs:{...(m=e.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(c=(n=r.parameters)==null?void 0:n.docs)==null?void 0:c.source}}};var d,i,u;a.parameters={...a.parameters,docs:{...(d=a.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    member: sampleMembers[0]
  },
  parameters: {
    reduxState: memberState
  }
}`,...(u=(i=a.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};const B=["ActiveAsLeader","LostContactAsLeader","ReadOnlyAsMember"];export{e as ActiveAsLeader,r as LostContactAsLeader,a as ReadOnlyAsMember,B as __namedExportsOrder,z as default};
