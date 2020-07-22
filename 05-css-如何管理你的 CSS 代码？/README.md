### 样式文件管理模式

Sass Guidelines 曾经提出过一个用来划分样式文件目录结构的 7-1 模式。

### **这种模式建议将目录结构划分为 7 个目录和 1 个文件，这 1 个文件是样式的入口文件，它会将项目所用到的所有样式都引入进来，一般命名为 main.scss。**

剩下的 7 个目录及作用如下：

> - base/，模板代码，比如默认标签样式重置；
> - components/，组件相关样式；
> - layout/，布局相关，包括头部、尾部、导航栏、侧边栏等；
> - pages/，页面相关样式；
> - themes/，主题样式，即使有的项目没有多个主题，也可以进行预留；
> - abstracts/，其他样式文件生成的依赖函数及 mixin，不能直接生成 css 样式；
> - vendors/，第三方样式文件。

[点击这里获取示例项目地址](https://github.com/HugoGiraudel/sass-boilerplate)

由于这个划分模式是专门针对使用 Sass 项目提出的，从样式文件名称看出还留有 jQuery 时代的影子，为了更加符合单页应用的项目结构，我们可以稍作优化。

> - main.scss 文件存在意义不大，页面样式、组件样式、布局样式都可以在页面和组件中引用，全局样式也可以在根组件中引用。而且每次添加、修改样式文件都需要在 main.scss 文件中同步，这种过度中心化的配置方式也不方便。
> - layout 目录也可以去除，因为像 footer、header 这些布局相关的样式，放入对应的组件中来引用会更好，至于不能被组件化的“\_grid”样式存在性也不大。因为对于页面布局，既可以通过下面介绍的方法来拆分成全局样式，也可以依赖第三方 UI 库来实现。所以说这个目录可以去除。
> - themes/ 目录也可以去除，毕竟大部分前端项目是不需要设置主题的，即使有主题也可以新建一个样式文件来管理样式变量。
> - vendors/ 目录可以根据需求添加。因为将外部样式复制到项目中的情况比较少，更多的是通过 npm 来安装引入 UI 库或者通过 webpack 插件来写入对应的 cdn 地址。

### 手动命名规则

最简单有效的命名管理方式就是制定一些命名规则，比如 [OOCSS](https://amcss.github.io/)、[BEM](http://getbem.com/)、[AMCSS](https://amcss.github.io/)，其中推荐比较常用的 BEM。
BEM 是 Block、Element、Modifier 三个单词的缩写，Block 代表独立的功能组件，Element 代表功能组件的一个组成部分，Modifier 对应状态信息。

```
<form class="form form--theme-xmas form--simple">
  <input class="form__input" type="text" />
  <input
    class="form__submit form__submit--disabled"
    type="submit" />
</form>
```

```
.form { }
.form--theme-xmas { }
.form--simple { }
.form__input { }
.form__submit { }
.form__submit--disabled { }
```

### 工具命名

CSS Modules
