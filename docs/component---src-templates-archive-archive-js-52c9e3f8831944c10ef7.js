(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{"6z7D":function(e,t,a){e.exports={tags:"tag-list-module--tags--O_Obx"}},FT44:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var n=a("q1tI"),r=a.n(n),l=a("Wbzz"),o=a("ph5I"),c=a.n(o),i=function(e){var t=e.children,a=e.to,n=e.buttonStyle;return r.a.createElement(l.Link,{to:a,className:c.a.button+" "+n},t)};i.defaultProps={buttonStyle:""};var s=i},GWjj:function(e,t,a){e.exports={container:"post-list-module--container--2AqiX",post:"post-list-module--post--1gkyY",cover:"post-list-module--cover--31q1n",content:"post-list-module--content--ixjr-"}},JIeO:function(e,t,a){"use strict";a.d(t,"a",(function(){return g}));var n=a("q1tI"),r=a.n(n),l=a("ma3e"),o=a("FT44"),c=a("obyI"),i=a.n(c),s=a("Al62"),u=a.n(s),m=a("qux6"),p=a.n(m),g=function(e){var t=e.prevPage,a=e.nextPage;return r.a.createElement("div",{className:p.a.container},t?r.a.createElement(o.a,{to:u.a.resolvePageUrl(i.a.pages.archive,t),buttonStyle:p.a.buttonLeft},r.a.createElement(l.a,null),r.a.createElement("span",null,"Newer posts")):null,a?r.a.createElement(o.a,{to:u.a.resolvePageUrl(i.a.pages.archive,a),buttonStyle:p.a.buttonRight},r.a.createElement("span",null,"Older posts"),r.a.createElement(l.b,null)):null)}},bpH6:function(e,t,a){"use strict";a.r(t);var n=a("q1tI"),r=a.n(n),l=a("I/Ru"),o=a("jNNy"),c=a("fC2M"),i=a("JIeO"),s=a("obyI"),u=a.n(s);t.default=function(e){var t=e.data,a=e.pageContext,n=a.archivePage,s=n>1?n-1:null,m=n<a.lastArchivePage?n+1:null;return r.a.createElement(l.a,{title:"Archive"},r.a.createElement(o.a,{title:"Archive | Page "+n,description:"Old posts",path:u.a.pages.archive}),r.a.createElement(c.a,{posts:t.allMarkdownRemark.edges}),r.a.createElement(i.a,{prevPage:s,nextPage:m}))}},dkXr:function(e,t,a){"use strict";a.d(t,"a",(function(){return p}));var n=a("q1tI"),r=a.n(n),l=a("Wbzz"),o=a("6z7D"),c=a.n(o),i=a("obyI"),s=a.n(i),u=a("Al62"),m=a.n(u),p=function(e){var t=e.tags;return r.a.createElement("div",{className:c.a.tags},console.log(t),t.filter((function(e,a){return a===t.indexOf(e)})).sort().map((function(e){return r.a.createElement(l.Link,{to:m.a.resolvePageUrl(s.a.pages.home)+m.a.resolvePageUrl(s.a.pages.tag,e),key:e},s.a.tags[e].name||m.a.capitalize(e))})))}},fC2M:function(e,t,a){"use strict";a.d(t,"a",(function(){return d}));var n=a("q1tI"),r=a.n(n),l=a("Wbzz"),o=a("9eSz"),c=a.n(o),i=a("GWjj"),s=a.n(i),u=a("dkXr"),m=a("Al62"),p=a.n(m),g=a("obyI"),v=a.n(g),d=function(e){var t=e.posts;return r.a.createElement("div",{className:s.a.container},t.map((function(e,t){var a=e.node.frontmatter,n=a.title,o=a.date,i=a.path,m=a.tags,g=a.cover,d=a.excerpt;return console.log(e),r.a.createElement("div",{key:n,className:s.a.post},r.a.createElement("div",{className:s.a.cover},r.a.createElement(l.Link,{to:p.a.resolvePageUrl(v.a.pages.home)+p.a.resolvePageUrl(i)},r.a.createElement(c.a,{fluid:g.childImageSharp.fluid,title:d,alt:n}))),r.a.createElement("div",{className:s.a.content},r.a.createElement(l.Link,{to:p.a.resolvePageUrl(v.a.pages.home)+p.a.resolvePageUrl(i)},o?r.a.createElement("label",null,o):null,r.a.createElement("h2",null,n),r.a.createElement("p",null,d)),r.a.createElement(u.a,{tags:m})))})))}},ph5I:function(e,t,a){e.exports={button:"button-module--button--24AQQ"}},qux6:function(e,t,a){e.exports={container:"archive-pagination-module--container--2VM7Y",buttonLeft:"archive-pagination-module--buttonLeft--3CRS6",buttonRight:"archive-pagination-module--buttonRight--Wnali"}}}]);
//# sourceMappingURL=component---src-templates-archive-archive-js-52c9e3f8831944c10ef7.js.map