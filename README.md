<div style="width: 400px; margin: auto; display: flex; justify-content: center; align-items: center; flex-direction: column">
  <img src='./assets/comment.png' style="width: 200px;height: 200px"/>
  <h1>Blog Comment</h1>
</div>

这是一个评论组件, 由 vercel/Next.js 托管, mongoDB 作为数据库，可以嵌入任意的 web 页面

[文档](https://blog-comment-doc-site.vercel.app/)


<a href='https://reactjs.org/versions'>
  <img src='https://img.shields.io/badge/Reac-17.0.2-yellowgreen'/>
</a>
<a href='https://mui.com/'>
  <img src='https://img.shields.io/badge/%40mui%2Fmaterial-%5E5.4.4-green'/>
</a>
<a href='https://reactjs.org/versions'>
  <img src='https://img.shields.io/badge/react--dom-17.0.2-yellowgreen'/>
</a>
<a href='https://nextjs.org/'>
  <img src='https://img.shields.io/badge/Next.js-%5E12.1.0-orange'/>
</a>
<a href='https://mongoosejs.com/'>
  <img src='https://img.shields.io/badge/mongoose-%5E6.2.4-blue'/>
</a>


## feature

- [x] 基本的评论和回复、点赞功能 (已支持)

- [x] 支持匿名和 github 登录 (已支持)

- [] 国际化 (计划中)

- [] 前端框架无关化(计划中)

## use

[Blog comment 文档](https://blog-comment-doc-site.vercel.app/)

## issues

### 1. 尝试 react server component 遇到的问题：

遇到一个可能是和 react 18 有关的 bug，报错：`An error occurred during hydration. The server HTML was replaced with client content`， https://github.com/facebook/react/issues/22784

为解决这个问题，暂时放弃 react server component 的使用，React 退回稳定版本
