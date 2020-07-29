1. 在 package.json script 中新增以下 2 行

```json
// 拷贝并打包
"copy_build": "npm run build_before && npm rum build && npm run build_after",
// 打包前备份 dist_prev 到 dist_temp
"build_before": "node script/build_copy.js before",
// 打包后备份 最新 dist 到 dist_prev，合并 dist_temp 到 dist，删除 dist_temp
"build_after": "node script/build_copy.js after",
// 合并 tags 到 dist
"merge_tags": "node script/build_copy.js tags"
```

2. 编辑 config.js 配置 dist 中 js 和 css 的路径
