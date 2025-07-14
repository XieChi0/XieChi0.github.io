

# git推送

## 一、推送到指定远程仓库（推荐）

使用 `git push` 命令时，**加上远程名和分支名**，例如：

```
bash


复制编辑
git push astro-boke main
```

> 表示将当前 `main` 分支推送到 `astro-boke` 这个远程仓库。

## 二、临时设置默认推送目标

你也可以先设置默认的上游分支，让之后的 `git push` 不用每次指定：

```
bash


git branch --set-upstream-to=astro-boke/main
```

或者直接：

```
bash


git push -u astro-boke main
```

这样以后只需要输入 `git push` 就会自动推送到 `astro-boke` 仓库了。



# git连接慢

## 一、检查本地网络是否能访问 GitHub

先试试在终端里运行：

```
bash


复制编辑
curl https://github.com
```

如果几秒后没有返回 GitHub 的网页 HTML，而是卡住或报错，很可能是你的网络 **连接 GitHub 不稳定或被阻断**。



## 二、配置 Git 使用代理（推荐）

如果你有科学上网环境，可以让 Git 使用代理，比如设置为 7890 端口：

```
bash


复制编辑
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890
```

取消代理（如果以后需要）：

```
bash


复制编辑
git config --global --unset http.proxy
git config --global --unset https.proxy
```



