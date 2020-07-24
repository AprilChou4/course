### [flex 布局](https://www.jianshu.com/p/4290522e1560)

### 一、Flex 布局是什么？

布局的传统解决方案，基于盒状模型，依赖**display 属性 +position 属性 +float 属性**。它对于那些特殊布局非常不方便，比如，垂直居中就不容易实现。

> - Flex 是 Flexible Box 的缩写，意为”弹性布局”，用来为盒状模型提供最大的灵活性。

> - 任何一个容器都可以指定为 Flex 布局。

```
.box{display:flex;}
```

> - 行内元素也可以使用 Flex 布局。

```
.box{display:inline-flex;}
```

> - Webkit 内核的浏览器，必须加上-webkit 前缀。

```
.box{
    display:-webkit-flex; /*Safari*/
    display:flex;
}
```

注意，设为 Flex 布局以后，子元素的 float、clear 和 vertical-align 属性将失效。
**注意，设为 Flex 布局以后，子元素的 float、clear 和 vertical-align 属性将失效。**

### 二、基本概念

采用 Flex 布局的元素，称为**Flex 容器**（flex container），简称”容器”。它的所有子元素自动成为容器成员，称为 Flex 项目（flex item），简称”项目”。
![file-list](https://upload-images.jianshu.io/upload_images/13944531-b1144007e4830a72.png?imageMogr2/auto-orient/strip|imageView2/2/w/563/format/webp)

容器默认存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis）。主轴的开始位置（与边框的交叉点）叫做 main start，结束位置叫做 main end；交叉轴的开始位置叫做 cross start，结束位置叫做 cross end。

项目默认沿主轴排列。单个项目占据的主轴空间叫做 main size，占据的交叉轴空间叫做 cross size。

### 三、容器的属性

> - flex-direction 属性决定主轴的方向（即项目的排列方向）。

> - flex-wrap 如果一条轴线排不下，如何换行

> - flex-flow

> - justify-content

> - align-items

> - align-content

1.flex-direction 属性决定主轴的方向（即项目的排列方向）。

![file-list](https://upload-images.jianshu.io/upload_images/13944531-c2f97bb8a47d139c.png?imageMogr2/auto-orient/strip|imageView2/2/w/796/format/webp)

它可能有 4 个值。
column-reverse：主轴为垂直方向，起点在下沿。

column：主轴为垂直方向，起点在上沿。

row（默认值）：主轴为水平方向，起点在左端。

row-reverse：主轴为水平方向，起点在右端。

2.flex-wrap
默认情况下，项目都排在一条线（又称”轴线”）上。flex-wrap 属性定义，如果一条轴线排不下，如何换行
它有 3 个值

```
.box{flex-wrap:nowrap | wrap | wrap-reverse;}
```

（1）nowrap（默认）：不换行。

![file-list](https://upload-images.jianshu.io/upload_images/13944531-ce8c6f815b5bfc0a.png?imageMogr2/auto-orient/strip|imageView2/2/w/700/format/webp)

（2）wrap：换行，第一行在上方。

![file-list](https://upload-images.jianshu.io/upload_images/13944531-0701b857c3588b37.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/700/format/webp)

（3）wrap-reverse：换行，第一行在下方。

![file-list](https://upload-images.jianshu.io/upload_images/13944531-0ae21f2bd8af65f8.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/700/format/webp)

3.3 flex-flow 是 flex-direction 属性和 flex-wrap 属性的简写形式，默认值为 row nowrap。

```
.box{flex-flow:||;}
```

3.4 justify-content 属性 定义了项目在主轴上的对齐方式。

```
.box{ justify-content:flex-start | flex-end | center | space-between | space-around; }
```

它可能取 5 个值，具体对齐方式与轴的方向有关。下面假设主轴为从左到右。

> - flex-start（默认值）：左对齐

> - flex-end：右对齐

> - center： 居中

> - space-between：两端对齐，项目之间的间隔都相等。

> - space-around：每个项目两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍。
>   ![file-list](https://upload-images.jianshu.io/upload_images/13944531-3e78d500eb78a34b.png?imageMogr2/auto-orient/strip|imageView2/2/format/webp)

3.5 align-items 属性 定义项目在交叉轴上如何对齐。

```
.box{align-items: flex-start | flex-end | center | baseline | stretch; }
```

![file-list](https://upload-images.jianshu.io/upload_images/13944531-96b4662bd1da272a.png?imageMogr2/auto-orient/strip|imageView2/2/w/617/format/webp)

它可能取 5 个值。具体的对齐方式与交叉轴的方向有关，下面假设交叉轴从上到下。

> - flex-start：交叉轴的起点对齐。

> - flex-end：交叉轴的终点对齐。

> - center：交叉轴的中点对齐。

> - baseline: 项目的第一行文字的基线对齐。

> - stretch（默认值）：如果项目未设置高度或设为 auto，将占满整个容器的高度。

3.6 align-content 属性 定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。

```
.box{align-content: flex-start | flex-end | center | space-between | space-around | stretch;}
```

![file-list](https://upload-images.jianshu.io/upload_images/13944531-1ca06439bf8f102c.png?imageMogr2/auto-orient/strip|imageView2/2/w/620/format/webp)

该属性可能取 6 个值。

> - flex-start：与交叉轴的起点对齐。

> - flex-end：与交叉轴的终点对齐。

> - center：与交叉轴的中点对齐。

> - space-between：与交叉轴两端对齐，轴线之间的间隔平均分布。

> - space-around：每根轴线两侧的间隔都相等。所以，轴线之间的间隔比轴线与边框的间隔大一倍。

> - stretch（默认值）：轴线占满整个交叉轴。
