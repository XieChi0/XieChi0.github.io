# git推送

## 一、推送到指定远程仓库（推荐）

使用 `git push` 命令时，**加上远程名和分支名**，例如：

```
bash
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

## 三、如果git push推送失败，该怎么做
首先确保你在powershell环境下，执行```ssh -T git@github.com```
然后再git push