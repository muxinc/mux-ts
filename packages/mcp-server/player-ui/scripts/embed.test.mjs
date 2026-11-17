import assert from 'node:assert/strict';
import { test } from 'node:test';
import { externalReferences } from './embed.mjs';

const external = {
  'script src': '<script src="https://evil.example/x.js"></script>',
  'link href': '<link rel="stylesheet" href="https://evil.example/x.css">',
  'uppercase img src': '<IMG SRC="https://evil.example/x.png">',
  'uppercase script src': '<SCRIPT SRC="https://evil.example/x.js"></SCRIPT>',
  'slash before the attribute': '<img/src="https://evil.example/x.png">',
  'slash before a script attribute': '<script/src="https://evil.example/x.js"></script>',
  'newline before the attribute': '<img\nsrc="https://evil.example/x.png">',
  'unquoted value': '<img src=https://evil.example/x.png>',
  'single-quoted value': "<img src='https://evil.example/x.png'>",
  'protocol-relative value': '<img src="//evil.example/x.png">',
  'http value': '<img src="http://evil.example/x.png">',
  'xlink:href': '<svg><use xlink:href="https://evil.example/x.svg#a"></use></svg>',
  'form action': '<form action="https://evil.example"><button>go</button></form>',
  poster: '<video poster="https://evil.example/p.png"></video>',
  srcset: '<img srcset="https://evil.example/x.png 2x">',
  'iframe src': '<iframe src="https://evil.example"></iframe>',
  'meta refresh': '<meta http-equiv="refresh" content="0;url=https://evil.example">',
  'inline style url()': '<div style="background:url(https://evil.example/x.png)"></div>',
  'quoted style url()': '<div style="background:url(\'//evil.example/x.png\')"></div>',
  'style @import': '<style>@import "https://evil.example/x.css";</style>',
  'uppercase @IMPORT': '<style>@IMPORT "https://evil.example/x.css";</style>',
  'uppercase URL()': '<style>a{background:URL(https://evil.example/x.png)}</style>',
  'style with attributes': '<style media="all">a{background:url(https://evil.example/x.png)}</style>',
  'tag hidden between script bodies by comment markers':
    '<script>var a="<!--";</script><script src="https://evil.example/x.js"></script><script>var b="-->";</script>',
  'tag hidden between style bodies by comment markers':
    '<style>/* <!-- */</style><link rel=stylesheet href=https://evil.example/x.css><style>/* --> */</style>',
  '> inside an attribute value': '<script data-x="a>b" src="https://evil.example/x.js"></script>',
};

for (const [name, html] of Object.entries(external)) {
  test(`flags ${name}`, () => {
    assert.notEqual(externalReferences(html).length, 0);
  });
}

const allowed = {
  'data: image': '<img src="data:image/png;base64,AAAA">',
  'data: url() in CSS': '<style>a{background:url(data:image/svg+xml;base64,AAAA)}</style>',
  'relative src': '<img src="logo.png">',
  'fragment href': '<a href="#top">top</a>',
  'src= inside a script body': '<script>var s="<img src=\\"https://x\\">"; var t = "src=https://y"</script>',
};

for (const [name, html] of Object.entries(allowed)) {
  test(`allows ${name}`, () => {
    assert.deepEqual(externalReferences(html), []);
  });
}
