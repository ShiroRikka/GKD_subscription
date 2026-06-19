# ShiroRikka 的 GKD 订阅项目

## 项目概述

本项目是 [GKD（搞快点）](https://gkd.li/) 的订阅规则仓库，基于官方的 `subscription-template` 构建。

**GKD** 是一款基于无障碍服务、高级选择器、订阅规则的自定义屏幕点击 Android 应用。通过自定义规则，在指定界面满足指定条件时自动点击指定节点或位置。

- **订阅名称**: ShiroRikka的GKD订阅
- **订阅 ID**: `5119`
- **作者**: ShiroRikka
- **支持 URL**: https://github.com/ShiroRikka/GKD_subscription

## 技术栈

| 工具 | 版本要求 |
|------|---------|
| Node.js | >= 22（需要 WasmGc 支持校验 Java/Kotlin 正则表达式） |
| pnpm | >= 9 |
| TypeScript | 5.x（ESNext 模块） |
| 关键包 | `@gkd-kit/define`, `@gkd-kit/tools`, `@gkd-kit/api` |

> **注意**: `@gkd-kit/define` 和 `@gkd-kit/tools` 只是开发辅助工具包，用于将 TypeScript 规则编译为最终的 JSON5 订阅文件。GKD 本身只消费 JSON5 格式的订阅规则。

## 目录结构

```
.
├── src/
│   ├── subscription.ts      # 订阅详情（主入口）
│   ├── categories.ts        # 规则分类定义
│   ├── globalGroups.ts      # 全局规则（跨应用规则）
│   └── apps/                # 各应用规则，按包名命名
│       └── com.MobileTicket.ts  # 示例: 铁路12306
├── dist/                    # 构建输出（自动生成，不要手动修改！）
│   ├── gkd.json5            # 最终订阅文件
│   ├── gkd.version.json5    # 版本信息
│   ├── CHANGELOG.md
│   └── README.md
├── scripts/                 # 构建脚本
├── .github/workflows/       # CI/CD（build_release.yml 等）
├── package.json
├── tsconfig.json
└── AGENTS.md                # 📌 本文件 — AI 助手项目指南
```

## 开发流程

### 本地开发

```bash
pnpm install                                                # 安装依赖
pnpm install --registry=https://registry.npmmirror.com      # 国内用阿里镜像
pnpm run check          # 类型检查 + 规则校验
pnpm run build          # 构建订阅到 dist/
```

### 代码质量

- **Prettier**: 自动格式化代码
- **ESLint**: 代码检查 + 自动修复
- **simple-git-hooks**: commit 前自动运行 lint-staged，push 前自动运行 check
- commit 如有错误会阻止提交，请修复后重新提交

### GitHub Actions 构建

使用 `build_release.yml` 工作流，触发后自动构建并发布到 `dist/`。

订阅地址：
```
https://raw.githubusercontent.com/ShiroRikka/GKD_subscription/main/dist/gkd.json5
```

国内镜像加速（jsDelivr）：
```
https://fastly.jsdelivr.net/gh/ShiroRikka/GKD_subscription@main/dist/gkd.json5
```

---

## GKD 选择器语法完全指南

GKD 的选择器类似 CSS 选择器，能利用节点上下文信息精确定位目标节点。

### 核心概念

#### 匹配顺序：**从右往左匹配**

选择器从**最后一个属性选择器**开始，从根节点/事件节点中找到匹配的节点，然后向左逐级检查关系约束。

例如 `FrameLayout > TextView`：
1. 先遍历找到所有 `TextView` 节点
2. 再逐个检查其父节点是否为 `FrameLayout`

> 💡 从右往左匹配的好处：能快速筛选，避免遍历整棵树。

#### `@` 目标标记

`@` 放在某个属性选择器前，表示选择/点击这个节点。如果没有 `@`，则取 **最后一个** 属性选择器作为目标节点。

- `@LinearLayout > TextView` — 点击 LinearLayout
- `LinearLayout > @TextView` — 点击 TextView
- `LinearLayout > TextView` — 无 `@`，默认为最后一个，即点击 TextView

#### `*` 通配节点名

`*` 匹配任意节点 name，类似 CSS 的通配符。

`* [text="确定"]` — 选择任意节点类型中 text 为"确定"的节点

#### 节点 name 简写

`TextView` 等价于 `[name='TextView'||name$='.TextView']`

因为 Android 节点 name 是完整 Java 类名（如 `android.widget.TextView`），简写可方便书写。

---

### 属性选择器 (Attribute Selector)

格式：`[左值 操作符 右值]`

#### 可用属性

> 以下属性来源于 [官方文档 - 属性方法](https://gkd.li/guide/node)

| 属性 | 类型 | 说明 |
|------|------|------|
| `id` | string | 资源 ID（完整格式如 `com.zhihu.android:id/btn_skip`） |
| `vid` | string | 视图 ID 简写（推荐使用，性能更好） |
| `name` | string | 节点类名 |
| `text` | string | 文本内容 |
| `desc` | string | 内容描述（content-desc） |
| `clickable` | boolean | 是否可点击 |
| `focusable` | boolean | 是否可聚焦 |
| `checkable` | boolean | 是否可勾选 |
| `checked` | boolean | 是否已勾选 |
| `editable` | boolean | 是否可编辑 |
| `longClickable` | boolean | 是否可长按 |
| `visibleToUser` | boolean | 用户是否可见 |
| `left` / `top` / `right` / `bottom` | int | 节点边界坐标 |
| `width` / `height` | int | 节点宽高 |
| `childCount` | int | 子节点数量 |
| `index` | int | 在同级兄弟中的索引 |
| `depth` | int | 在树中的深度（根=0） |
| `parent` | node | 父节点 |
| `_id` / `_pid` | int | ⚠️ **仅快照审查工具可用**，真机不可用 |

#### node 的方法

- `getChild(index)` — 获取指定索引的子节点

#### context 的特殊属性

- `prev` — 右侧属性选择器的节点上下文。最右侧的 `prev=null`
- `current` — 当前节点，`current.id = id`
- `getPrev(n)` — 快捷获取深层 prev（`getPrev(0)`=prev, `getPrev(1)`=prev.prev）

#### context/global 的方法

- `global.equal(a, b)` / `global.notEqual(a, b)` — 判断相等/不相等

> 详情参考 [官方文档 - node 类型](https://gkd.li/guide/node#node)

#### 操作符

| 操作符 | 名称 | 适用类型 | 示例 |
|--------|------|---------|------|
| `=` | 等于 | 全部 | `[text="确定"]` |
| `!=` | 不等于 | 全部 | `[text!="取消"]` |
| `>` | 大于 | int | `[index>0]` |
| `>=` | 大于等于 | int | `[childCount>=2]` |
| `<` | 小于 | int | `[index<5]` |
| `<=` | 小于等于 | int | `[depth<=3]` |
| `^=` | 以…开头 | string | `[text^="跳过"]` |
| `!^=` | 不以…开头 | string | `[text!^="广告"]` |
| `*=` | 包含 | string | `[text*="跳过"]` |
| `!*=` | 不包含 | string | `[text!*="推广"]` |
| `$=` | 以…结尾 | string | `[text$="关闭"]` |
| `!$=` | 不以…结尾 | string | `[text!$="取消"]` |
| `~=` | 正则匹配 | string | `[text~="^(?is)跳过.*"]` |
| `!~=` | 正则不匹配 | string | `[text!~="广告"]` |

> 💡 `matches`/`notMatches`（即 `~=`/`!~=`）的右侧值必须是合法的 **Java/Kotlin 正则表达式**。
> 正则表达式由 Node.js 22 的 WasmGc 校验，所以 **Node.js 必须 >= 22**。

#### 正则优化提示

对于 `matches`/`notMatches`，当正则满足以下格式时，GKD 会使用内置函数匹配（更快），而非运行真正的正则表达式：

- `[text~="(?is)abc.*"]` → `startsWith('abc', ignoreCase=true)`
- `[text~="(?is).*abc.*"]` → `contains('abc', ignoreCase=true)`
- `[text~="(?is).*abc"]` → `endsWith('abc', ignoreCase=true)`

其中 `abc` 是不含 `\^$.?*|+()[]{}` 等特殊正则字符的任意字符串。

#### 逻辑表达式

多个属性条件可以用 `[]` 并列（相当于 `&&`），也可显式使用逻辑操作符：

| 表达式 | 示例 |
|--------|------|
| 并列 AND | `[text*="跳过"][text.length<10]` |
| 显式 AND | `[text*="跳过" && visibleToUser=true]` |
| 显式 OR | `[text="跳过" \|\| text="关闭"]` |
| 取反 | `[!(text="确定" \|\| text="取消")]` |
| 组合选择器 OR | `(A + B) \|\| (M > N)` |
| 组合选择器 AND | `(A + B) && (M > N)` |

> 优先级：`!` > `&&` > `||`

---

### 关系选择器 (Relationship Combinator)

关系选择器用于连接两个属性选择器，**必须用空白字符（空格/换行/制表）隔开**，`A>B` 是非法的。

| 操作符 | 名称 | 说明 | 示例 |
|--------|------|------|------|
| `+` | 前置兄弟节点 | A 是 B 前面的兄弟节点 | `Button + Button[text="确定"]` |
| `-` | 后置兄弟节点 | A 是 B 后面的兄弟节点 | `@Button[text="确定"] - Button[text="取消"]` |
| `>` | 祖先节点 | A 是 B 的祖先（父/祖父…） | `FrameLayout > TextView[text="确定"]` |
| `<` | 直接子节点 | A 是 B 的直接子节点 | `TextView < FrameLayout` |
| `<<` | 子孙节点(深度先序) | A 是 B 的子孙节点（深度优先遍历） | `@[text="直播"] <<n ViewGroup[vid="live_text_container"]` |
| `->` | 回溯到之前节点 | 查询到 B 后，回溯到之前已匹配的节点 A | `C ->1 B > A` |

#### 关系表达式（索引约束）

关系操作符可以跟索引表达式，精确控制位置：

- **元组表达式**: `(a1, a2, a3)` — 索引必须是这些值之一
  - 示例: `+(1,3,5)` — 第 1、3、5 个前置兄弟节点
- **多项式表达式**: `(an+b)` — 满足 `{an+b \| an+b>=1, n>=1}` 的索引集合
  - `(n)` = `(1,2,3,...)` 所有
  - `(2n-1)` = `(1,3,5,...)` 奇数位
  - `(-n+4)` = `(1,2,3)` 前 3 个
- **简写**: 当 a=0 或 b=0 时，括号和 `0n+` 可以省略
  - `+(0n+3)` → `+3`（第 3 个前置兄弟）
  - `+(0n+1)` → `+`（第 1 个前置兄弟，即紧邻的）
  - `>(1n+0)` → `>n` → 空格省略 = `A B`（任意祖先，CSS 风格）
  - `<<(0n+2)` → `<<2`（深度优先遍历的第 2 个子孙）

#### 常用关系示例

| 选择器 | 说明 |
|--------|------|
| `A + B` | B 紧邻在 A 后面 |
| `A +(2,4) B` | B 是 A 后面的第 2 或 4 个兄弟 |
| `A > B` | B 的父节点是 A |
| `A >2 B` | B 的祖父节点是 A |
| `LinearLayout > ImageView` | ImageView 的父节点是 LinearLayout |
| `FrameLayout[vid="content_layout"] >n ImageView[vid="search_icon"]` | 祖先 FrameLayout 中任意层级的 ImageView |
| `@[text="直播"] <<n ViewGroup[vid="live_text_container"]` | 在 ViewGroup 内查找 text="直播" 的节点 |
| `[parent=null]` | 根节点 |
| `[depth=0]` | 根节点（另一种写法） |
| `[index=parent.childCount.minus(1)]` | 最后一个子节点 |

#### 选择器组合

```txt
ImageView < FrameLayout <n ViewGroup[desc^="直播"] - ViewGroup >4 FrameLayout[index=0] +2 FrameLayout > @TextView[index=parent.childCount.minus(1)] <<n FrameLayout[vid="content"]
```

> 💡 复杂的组合选择器可以精确匹配非常具体的界面布局。

---

### 快速查询 (fastQuery)

**这是什么？** Android 提供了通过 `id`/`vid`/`text` 快速获取子孙节点的 API。开启 `fastQuery: true` 后，GKD 会利用这些 API 直接定位节点，**跳过手动遍历整棵视图树**，大幅提升性能。

**启用方式**：在规则组层面设置 `fastQuery: true`

```ts
{
  key: 0,
  name: '开屏广告',
  fastQuery: true,  // ← 启用快速查询
  rules: [{
    matches: '[vid="btn_skip"]',
  }],
}
```

**快速查询的格式要求**：末尾属性选择器的第一个属性表达式必须符合以下格式之一：

| 格式 | 示例 |
|------|------|
| `[id='...']` | `[id='com.zhihu.android:id/btn_skip']` |
| `[vid='...']` | `[vid='btn_skip']` |
| `[text='...']` | `[text='确定']` |
| `[text^='...']` | `[text^='跳过']` |
| `[text*='...']` | `[text*='广告']` |
| `[text$='...']` | `[text$='关闭']` |

或用 `||` 组合多个：`[vid="close" || text="关闭"]`

**局部快速查询**：当选择器中存在 `[vid="xxx"] <<n` 时，中间的节点也能使用局部快速查找。

> ⚠️ 如果节点在快照面板中没有被标识「可快速查找」，则 `fastQuery` 不起作用。
> 如果选择器不满足快速查找格式，`fastQuery` 是否开启都不影响查询复杂度。

---

### 主动查询优化（根节点标记）

在选择器末尾加上 `[parent=null]` 可标识从根节点开始查询。

```
TextView <3 LinearLayout <2 [parent=null]
```

加上后，选择器**只会执行一次判断**，无需遍历所有 n 个节点，性能大幅提升。

> 实际上 `A > B` 等价于 `A > @B <<n [parent=null]`。

---

## 规则编写规范

### 应用规则文件 (src/apps/*.ts)

每个应用一个文件，以**包名**命名，例如 `com.example.app.ts`。

使用 `defineGkdApp` 定义：

```ts
import { defineGkdApp } from '@gkd-kit/define';

export default defineGkdApp({
  id: 'com.example.app',
  name: '应用名称',
  groups: [
    {
      key: 0,
      name: '开屏广告-跳过',
      desc: '点击跳过开屏广告',
      resetMatch: 'app',
      actionCd: 1000,       // 冷却时间（毫秒）
      actionMaximum: 1,     // 最大触发次数（可选）
      fastQuery: true,      // 启用快速查询
      rules: [
        {
          matches: '[vid="btn_skip"][text="跳过"]',
          excludeMatches: '[text*="已跳过"]',  // 排除条件
          snapshotUrls: ['https://i.gkd.li/i/13070251'],  // 快照链接（可选）
        },
      ],
    },
  ],
});
```

### 规则 key 规范

- 每个应用文件内的 `groups` 数组，key 从 **0** 开始递增
- 如果一条规则有多个子规则（match 快照不同但逻辑相同），子规则的 `key` 也从 **0** 开始
- **key 分配后不建议修改** — GKD 用它来追踪用户是否关闭了该规则

### 规则常用字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `key` | int | 规则组的唯一标识，从 0 递增 |
| `name` | string | 规则组名称，格式 `功能-操作` |
| `desc` | string | 规则说明 |
| `resetMatch` | `'app'` 或 `'activity'` | 重置策略：切到前台(app)或切换Activity时重置匹配计数 |
| `actionCd` | int (ms) | 操作冷却时间，防止频繁触发 |
| `actionMaximum` | int | 最大触发次数（如开屏广告设为 1） |
| `matchTime` | int (ms) | 匹配超时时间（全局规则常用，如 10000ms） |
| `fastQuery` | boolean | 启用快速查询优化 |
| `preKeys` | int[] | 前置规则组 key 列表 |

### 规则匹配字段（rules 数组内）

| 字段 | 类型 | 说明 |
|------|------|------|
| `matches` | string | 选择器字符串，**匹配目标** |
| `excludeMatches` | string 或 string[] | 排除匹配：当界面同时匹配 matches 和 excludeMatches 时，**不触发** |
| `activityIds` | string 或 string[] | 限制规则仅在指定 Activity 中生效 |
| `snapshotUrls` | string[] | 快照链接，用于验证规则 |
| `key` | int | 子规则标识（同一 rules 数组内从 0 递增） |

### 规则命名规范

遵循 `功能分类-具体操作` 格式：
- `开屏广告-跳过`
- `全屏广告-会员活动弹窗`
- `局部广告-信息流广告`
- `自动点击-预填信息购票-确定`
- `关闭更新弹窗`
- `权限提示-通知权限`

### 全局规则 (globalGroups.ts)

全局规则跨应用生效，适用于通用场景（如开屏广告）：

```ts
import { defineGkdGlobalGroups } from '@gkd-kit/define';

export default defineGkdGlobalGroups([
  {
    key: 0,
    name: '开屏广告',
    fastQuery: true,
    matchTime: 10000,
    actionMaximum: 1,
    resetMatch: 'app',
    rules: [
      {
        key: 0,
        matches: '[text*="跳过"][text.length<10][visibleToUser=true]',
      },
    ],
  },
]);
```

### 规则分类 (categories.ts)

用于对规则组进行分组管理：

```ts
import { defineGkdCategories } from '@gkd-kit/define';

export default defineGkdCategories([
  {
    key: 0,
    name: '自动点击',
    enable: true,
  },
  {
    key: 1,
    name: '开屏广告',
    enable: true,
  },
]);
```

---

## 快照（Snapshot）开发工作流

### 什么是快照？

快照是一个 zip 文件，保存了设备在某时间点的状态：截图、设备信息、界面信息、无障碍节点信息。

有了快照后，开发者无需每次都到实际界面去调试，可离线分析节点布局并编写选择器。

### 如何抓取快照

1. **悬浮窗按钮**: 设置 → 高级设置 → 悬浮窗服务 → 在任意界面点击按钮抓取
2. **快捷开关**: 状态栏添加「捕获快照」快捷开关
3. **截屏快照**: 设置 → 高级设置 → 截屏快照（配置后截屏自动抓取）
4. **HTTP 服务**: 设置 → 高级设置 → HTTP 服务 → 电脑浏览器连接后抓取

### 快照审查工具

使用 [在线快照审查工具](https://i.gkd.li/device) 可实时测试选择器：

- 选择一个快照后，在搜索框输入选择器即可测试匹配结果
- 快照链接格式：`https://i.gkd.li/i/13070251`
- 在 GKD 规则中可添加 `snapshotUrls` 关联快照用于验证

### 添加规则的标准流程

1. 在目标 APP 界面抓取快照
2. 使用审查工具打开快照
3. 分析节点树，找到目标节点
4. 编写选择器并测试
5. 编写规则文件并构建验证

---

## 重要注意事项

1. **Node.js 必须 >= 22** — 否则选择器中的 Java/Kotlin 正则校验会失败
2. **订阅 ID (5119) 不能与其他订阅冲突** — 如需改为你自己的订阅，请填一个较大的随机数
3. **`resetMatch` 策略**: `'app'` = 应用回到前台时重置；`'activity'` = Activity 切换时重置
4. **`actionCd`**: 单位毫秒，防止规则短时间重复触发（建议 1000ms 以上）
5. **`fastQuery`**: 只有在选择器满足快速查询格式时才有优化效果，不满足时形同虚设
6. **`@` 标记**: 务必确认 `@` 标记在正确的节点上，否则可能点击错位置
7. **选择器匹配是从右往左**：编写复杂选择器时需注意效率，优先用 `vid`/`id` 快速定位
8. **不要修改 `dist/` 下的构建产物** — 它们是自动生成的，修改会被覆盖
9. **`excludeMatches` 可用于多条排除**：传字符串数组 `['排除A', '排除B']` 即可
10. **正则转义嵌套问题**：选择器在 JSON 字符串内→JSON 有转义→`~=` 还有正则转义，多重嵌套可能导致写出来的规则很「丑」，务必在审查工具中验证

## 选择器快速参考

```
# 基础属性匹配
[vid="btn_skip"]                          # 视图 ID
[id="com.example:id/btn"]                 # 资源 ID
[text="确定"]                              # 精确文本
[text*="跳过"]                             # 包含文本
[text^="跳过"]                             # 以…开头
[text$="关闭"]                             # 以…结尾
[text~="(?is)^(跳过\|关闭)"]              # 正则匹配（忽略大小写）

# 关系匹配
A + B                                      # B 紧邻 A 后面
A > B                                      # B 的父节点是 A
A >n B                                     # B 的任意祖先节点是 A (CSS 风格 A B)
A < B                                      # A 的直接子节点是 B
FrameLayout > ImageView                    # ImageView 的直接父节点是 FrameLayout

# 快速查找定位（推荐）
[vid="image"] <<n [vid="recyclerView"] <<n [vid="content_layout"]

# 逻辑组合
(A + B) || (M > N)                         # 满足任一条件
(A + B) && (M > N)                         # 同时满足

# 根节点查询优化
TextView <3 LinearLayout <2 [parent=null]  # 从根节点开始匹配（性能优化）
```

## 对 AI 助手的特别说明

- 新增应用规则时，在 `src/apps/` 下以包名创建 `.ts` 文件，使用 `defineGkdApp` 编写规则
- 优先使用 `vid` 而非 `id`（更简洁），且配合 `fastQuery: true` 以提升性能
- 选择器用双引号括起来写在 `matches` 字段中
- 规则编写后使用 `pnpm run check` 验证，再用 `pnpm run build` 构建
- 构建后检查 `dist/gkd.json5` 中的规则是否正确
- 帮助用户思考：是否有更好的排除条件？是否和其他规则冲突？选择器是否高效？是否用上了 `fastQuery`？
