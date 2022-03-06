这是一个评论组件, 由 vercel/Next.js 托管, mongoDB 作为数据库，可以嵌入任意的 web 页面，前端框架无关

<img src='https://img.shields.io/badge/Reac-17.0.2-yellowgreen'/>
<img src='https://img.shields.io/badge/react--dom-17.0.2-yellowgreen'/>
<img src='https://img.shields.io/badge/Next.js-%5E12.1.0-orange'/>
<img src='https://img.shields.io/badge/mongoose-%5E6.2.4-blue'/>

<hr/>

## todo

- [x] iframe 组件封装导入评论组件

- [] 支持 github 和 qq 登录

- [] markdown 格式输入、图床支持

- [] 主题定制

- [] 国际化

## use

1. 在 mongoDB 官网申请一个数据库集群，复制数据库连接 URL 备用.
2. fork 此项目仓库到你的 GitHub 账户.
3. 打开 vercel dashboard（如果你没有 vercel 账户，先开通），在 vercel dashboard import 刚刚 fork 到 GitHub 的仓库.
4. import 成功后，在 vercel 这个项目的设置上面设置一些环境变量，设置一个环境变量 `mongodbUrl`, 值为第 1 步你复制的 mongoDB 数据库连接 URL.
5. 在 vercel 上面点击 deploy 即可部署完成
6. 将评论组件部署完成后，在你需要引入评论组件的网页，用 iframe 的方式引入，像这样：

```js
<iframe
  src={`https://xxxxx.vercel.app/?articleId=${params.articleId}`}
  style={{
    width: '100%',
    minHeight: '600px',
    maxHeight: '800px',
    border: '0px',
    scrollbarWidth: 'none'
  }}
  frameBorder='0'
/>
```
>说明：iframe 的 src 是你部署后的评论组件的 vercel 托管的上线地址，地址后面的参数 `articleId` 是这个页面上评论组件所属的页面 id，评论组件里面的数据将会用这个 id 作为索引存储.

## issues

### 1. 尝试 react server component 遇到的问题：

遇到一个可能是和 react 18 有关的 bug，报错：`An error occurred during hydration. The server HTML was replaced with client content`， https://github.com/facebook/react/issues/22784

为解决这个问题，暂时放弃 react server component 的使用，React 退回稳定版本
