(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{"6z7D":function(e,t,a){e.exports={tags:"tag-list-module--tags--O_Obx"}},FT44:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var n=a("q1tI"),r=a.n(n),o=a("Wbzz"),l=a("ph5I"),c=a.n(l),i=function(e){var t=e.children,a=e.to,n=e.buttonStyle;return r.a.createElement(o.Link,{to:a,className:c.a.button+" "+n},t)};i.defaultProps={buttonStyle:""};var s=i},GWjj:function(e,t,a){e.exports={container:"post-list-module--container--2AqiX",post:"post-list-module--post--1gkyY",cover:"post-list-module--cover--31q1n",content:"post-list-module--content--ixjr-"}},JIeO:function(e,t,a){"use strict";a.d(t,"a",(function(){return d}));var n=a("q1tI"),r=a.n(n),o=a("ma3e"),l=a("FT44"),c=a("obyI"),i=a.n(c),s=a("Al62"),u=a.n(s),m=a("qux6"),p=a.n(m),d=function(e){var t=e.prevPage,a=e.nextPage;return r.a.createElement("div",{className:p.a.container},t?r.a.createElement(l.a,{to:u.a.resolvePageUrl(i.a.pages.archive,t),buttonStyle:p.a.buttonLeft},r.a.createElement(o.a,null),r.a.createElement("span",null,"Newer posts")):null,a?r.a.createElement(l.a,{to:u.a.resolvePageUrl(i.a.pages.archive,a),buttonStyle:p.a.buttonRight},r.a.createElement("span",null,"Older posts"),r.a.createElement(o.b,null)):null)}},RXBc:function(e,t,a){"use strict";a.r(t);var n=a("q1tI"),r=a.n(n),o=a("I/Ru"),l=a("jNNy"),c=a("fC2M"),i=a("JIeO"),s=a("obyI"),u=a.n(s);t.default=function(e){var t=e.data;return r.a.createElement(o.a,null,r.a.createElement(l.a,{title:"Home",description:u.a.siteDescription,path:""}),r.a.createElement(c.a,{posts:t.allMarkdownRemark.edges}),r.a.createElement(i.a,{nextPage:2}))}},dkXr:function(e,t,a){"use strict";a.d(t,"a",(function(){return p}));var n=a("q1tI"),r=a.n(n),o=a("Wbzz"),l=a("6z7D"),c=a.n(l),i=a("obyI"),s=a.n(i),u=a("Al62"),m=a.n(u),p=function(e){var t=e.tags;return r.a.createElement("div",{className:c.a.tags},console.log(t),t.filter((function(e,a){return a===t.indexOf(e)})).sort().map((function(e){return r.a.createElement(o.Link,{to:m.a.resolvePageUrl(s.a.pages.home)+m.a.resolvePageUrl(s.a.pages.tag,e),key:e},s.a.tags[e].name||m.a.capitalize(e))})))}},fC2M:function(e,t,a){"use strict";a.d(t,"a",(function(){return v}));var n=a("q1tI"),r=a.n(n),o=a("Wbzz"),l=a("9eSz"),c=a.n(l),i=a("GWjj"),s=a.n(i),u=a("dkXr"),m=a("Al62"),p=a.n(m),d=a("obyI"),g=a.n(d),v=function(e){var t=e.posts;return r.a.createElement("div",{className:s.a.container},t.map((function(e,t){var a=e.node.frontmatter,n=a.title,l=a.date,i=a.path,m=a.tags,d=a.cover,v=a.excerpt;return console.log(e),r.a.createElement("div",{key:n,className:s.a.post},r.a.createElement("div",{className:s.a.cover},r.a.createElement(o.Link,{to:p.a.resolvePageUrl(g.a.pages.home)+p.a.resolvePageUrl(i)},r.a.createElement(c.a,{fluid:d.childImageSharp.fluid,title:v,alt:n}))),r.a.createElement("div",{className:s.a.content},r.a.createElement(o.Link,{to:p.a.resolvePageUrl(g.a.pages.home)+p.a.resolvePageUrl(i)},l?r.a.createElement("label",null,l):null,r.a.createElement("h2",null,n),r.a.createElement("p",null,v)),r.a.createElement(u.a,{tags:m})))})))}},ph5I:function(e,t,a){e.exports={button:"button-module--button--24AQQ"}},qux6:function(e,t,a){e.exports={container:"archive-pagination-module--container--2VM7Y",buttonLeft:"archive-pagination-module--buttonLeft--3CRS6",buttonRight:"archive-pagination-module--buttonRight--Wnali"}}}]);
//# sourceMappingURL=component---src-pages-index-js-547e3a83d4439d0ec98a.js.map