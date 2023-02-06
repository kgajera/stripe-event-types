"use strict";(self.webpackChunkdocublitz=self.webpackChunkdocublitz||[]).push([[971],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>y});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function p(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),l=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):p(p({},t),e)),n},c=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),d=l(n),m=a,y=d["".concat(s,".").concat(m)]||d[m]||u[m]||i;return n?r.createElement(y,p(p({ref:t},c),{},{components:n})):r.createElement(y,p({ref:t},c))}));function y(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,p=new Array(i);p[0]=m;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o[d]="string"==typeof e?e:a,p[1]=o;for(var l=2;l<i;l++)p[l]=n[l];return r.createElement.apply(null,p)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1269:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>p,default:()=>u,frontMatter:()=>i,metadata:()=>o,toc:()=>l});var r=n(7462),a=(n(7294),n(3905));const i={},p="Stripe Event Types",o={unversionedId:"index",id:"index",title:"Stripe Event Types",description:"npm",source:"@site/docs/index.md",sourceDirName:".",slug:"/",permalink:"/stripe-event-types/docs/",draft:!1,editUrl:"https://github.com/kgajera/stripe-event-types/tree/main/website/docs/index.md",tags:[],version:"current",frontMatter:{}},s={},l=[{value:"Installation",id:"installation",level:2},{value:"Version compatability",id:"version-compatability",level:3},{value:"Usage",id:"usage",level:2},{value:"Webhook event",id:"webhook-event",level:3},{value:"Event type",id:"event-type",level:3}],c={toc:l},d="wrapper";function u(e){let{components:t,...n}=e;return(0,a.kt)(d,(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"stripe-event-types"},"Stripe Event Types"),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://www.npmjs.com/package/stripe-event-types"},(0,a.kt)("img",{parentName:"a",src:"https://img.shields.io/npm/v/stripe-event-types",alt:"npm"})),"\n",(0,a.kt)("a",{parentName:"p",href:"https://github.com/kgajera/stripe-event-types/actions/workflows/build.yml"},(0,a.kt)("img",{parentName:"a",src:"https://github.com/kgajera/stripe-event-types/actions/workflows/build.yml/badge.svg",alt:"Build"}))),(0,a.kt)("p",null,"This provides TypeScript typings for Stripe webhook events to strongly type the ",(0,a.kt)("inlineCode",{parentName:"p"},"type")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"data.object")," fields. These types are automatically generated by scraping Stripe's documentation for ",(0,a.kt)("a",{parentName:"p",href:"https://stripe.com/docs/api/events/types"},"types of events"),"."),(0,a.kt)("p",null,"Why is this needed? The typings included in the ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/stripe/stripe-node"},(0,a.kt)("inlineCode",{parentName:"a"},"stripe"))," library are lacking in this respect. The type for ",(0,a.kt)("inlineCode",{parentName:"p"},"type")," is a ",(0,a.kt)("inlineCode",{parentName:"p"},"string")," instead of a string literal and the type for ",(0,a.kt)("inlineCode",{parentName:"p"},"data.object")," is ",(0,a.kt)("inlineCode",{parentName:"p"},"{}")," which requires casting each usage of it. This can lead to mistakes in your implementation that could easily be caught with stronger types."),(0,a.kt)("p",null,(0,a.kt)("img",{parentName:"p",src:"https://user-images.githubusercontent.com/1087679/187047509-d8cfe324-0e19-468e-8cdf-7fd3f503ad1f.gif",alt:"Typed Webhook Event"})),(0,a.kt)("h2",{id:"installation"},"Installation"),(0,a.kt)("p",null,"Install the package with:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"npm install stripe-event-types\n# or\nyarn add stripe-event-types\n")),(0,a.kt)("h3",{id:"version-compatability"},"Version compatability"),(0,a.kt)("table",null,(0,a.kt)("thead",{parentName:"table"},(0,a.kt)("tr",{parentName:"thead"},(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"th"},"stripe-event-types")," version"),(0,a.kt)("th",{parentName:"tr",align:null},(0,a.kt)("inlineCode",{parentName:"th"},"stripe")," version"))),(0,a.kt)("tbody",{parentName:"table"},(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"2"),(0,a.kt)("td",{parentName:"tr",align:null},"11")),(0,a.kt)("tr",{parentName:"tbody"},(0,a.kt)("td",{parentName:"tr",align:null},"1"),(0,a.kt)("td",{parentName:"tr",align:null},"10")))),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("h3",{id:"webhook-event"},"Webhook event"),(0,a.kt)("p",null,"When constructing the webhook event, cast it to ",(0,a.kt)("inlineCode",{parentName:"p"},"Stripe.DiscriminatedEvent")," to strongly type the ",(0,a.kt)("inlineCode",{parentName:"p"},"type")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"data.object")," fields:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-diff"},"+/// <reference types=\"stripe-event-types\" />\n\nconst event = stripe.webhooks.constructEvent(\n  request.body,\n  request.headers['stripe-signature'],\n  'whsec_test'\n-);\n+) as Stripe.DiscriminatedEvent;\n")),(0,a.kt)("h3",{id:"event-type"},"Event type"),(0,a.kt)("p",null,"The ",(0,a.kt)("inlineCode",{parentName:"p"},"Stripe.DiscriminatedEvent.Type")," type is a string literal of all event types:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},'/// <reference types="stripe-event-types" />\n\nconst type: Stripe.DiscriminatedEvent.Type = "charge.succeeded";\n')))}u.isMDXComponent=!0}}]);