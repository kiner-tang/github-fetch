# GitHubApi

通过 GitHub API 获取 GitHub 仓库信息。

## 安装

```bash
npm i --location=global @kiner/github-fetch
```

## 使用

1. 参考教程申请 GitHub API Token [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)。

2. 在项目根目录创建`.githubtoken`文件，并将创建的 Token 写入文件。

3. 运行 `yarn build` 构建项目

4. 运行以下命令爬取目标信息：

```bash
# 参数说明
# --owner: 仓库拥有者，多个用逗号分隔
# --author: 目标用户的用户名，用于筛选数据
# --token: GitHub API Token，可选，如果不传入则会自动读取项目根目录下的`.githubtoken`文件
# --output: 收集到的数据导出路径，可选，默认为当前目录下的：`{{cmd}}-{{author}}.json`文件，路径名中可包含以下占位符：
# - {{cmd}}: 当前命令类型，如：commit
# - {{author}}: 传入的作者用户名，如：kiner-tang
# - {{owner}}: 传入的仓库拥有者列表，如：ant-design,umijs,react-component
# 以上占位符将在导出时被替换。
# --full: 是否将 github 返回的全量信息加入到结果数组中的 extra 当中，可选（由于全量信息比较多，如果以下字段能够满足要求，建议不保存全量信息）
#   // 作者 id
#   id: string;
#   // 作者用户名
#   name: string;
#   // 作者头像 url
#   avatar: string;
#   // 本次提交的主题
#   message: string;
#   // 本次提交详情信息
#   desc: string;
#   // 提交时间
#   time: string;
#   // 本次提交记录的网页地址
#   html_url: string;

# 爬取所有仓库的所有 commit
ghf commit --owner=ant-design,umijs,react-component --author=kiner-tang --output=data/{{cmd}}-{{owner}}-{{author}}.json --token=**GithubToken**

```


