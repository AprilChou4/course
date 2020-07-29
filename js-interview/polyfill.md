Polyfill:用于实现浏览器并不支持的原生 API 的代码

### 1.什么是 Polyfill?

Polyfill 是一个 js 库，主要抚平不同浏览器之间对 js 实现的差异。比如，html5 的 storage(session,local), 不同浏览器，不同版本，有些支持，有些不支持。Polyfill（Polyfill 有很多，在 [GitHub](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-Browser-Polyfills) 上），帮你把这些差异化抹平，不支持的变得支持了（典型做法是在 IE 浏览器中增加 window.XMLHttpRequest ，内部实现使用 ActiveXObject。）

提到 Polyfill，不得不提 shim,polyfill 是 shim 的一种。
shim 是将不同 api 封装成一种，比如 jQuery 的 \$.ajax 封装了 XMLHttpRequest 和 IE 用 ActiveXObject 方式创建 xhr 对象。它将一个新的 API 引入到一个旧的环境中,而且仅靠旧环境中已有的手段实现。

### 2.如何使用？

直接引入项目，最简单就是 CDN:

```
<script src="//cdn.polyfill.io/v1/polyfill.min.js" async defer></script>
```

[Polyfill 简介参考文档](https://www.jianshu.com/p/7562b8b589f3)
