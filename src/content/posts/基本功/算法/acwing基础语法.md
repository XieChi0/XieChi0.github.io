---
title: Acwing 基础语法算法
published: 2022-11-20
description: Acwing 算法基础语法与常见问题记录
tags: [算法, C++, Acwing]
category: 基本功/算法
draft: false
---

# 🦃acwing基础语法算法

## 杂

### double转int

double a = 2.34234;

int b = (int)a;	//不仅前面要加int，记得在等号右边也加int

### double*100精度丢失

**问题描述：**double a=0.33*100;	int b = a;   

cout<<a;  //33

cout<<b;  //32

这是因为double在乘100时会有点精度丢失

> **解决方法：**
>
> cout<<round(b)；
>
> 或者int b = round(a*100);
>
> cout<<b;

**补充：**

round是负责四舍五入的函数。它的库是#include<math.h>

### int转double

int s1=25,s2=50;

cout<<s1/s2;	//0

如果想得到0.25，且不能修改s1 s2int类型

> double c =(double)s1/(double)s2;

如果想得到25%呢？

double c = (double)s1/(double)s2*100;	

cout<<fixed<<setprecision(2)<<c<<"% "<<endl;

### 两个浮点数的比较（精确版）

之前不是说浮点数总有数据丢失吗？

所以想要比较可以用以下方式

```
const double eps = le-6;	//用科学计数法表示的，是一个很小很小很小的数字
    if(fabs(a-b)<=eps) cout<<"相等";	//fabs是取绝对值，专用于浮点数的，可以看笔记本子有
	if(a+eps<b) cout<<"小于";
	if(a+eps>b) cout<<"大于";
```



### 分离整数与小数

**问题解决：**double num = 453.23;

int A = floor(num);	//A=453; 

double a = num-A;	//a是0.23

**补充：**

floor的库也是<math.h>，作用是返回不大于num的最大整数，比如6.7会返回6

如果需要将0.23转化成整数，不要直接给a*100，会有数据丢失，可以参考上个问题，用int b = round(a✖100)；



### 约数

比如一个题是给你一个数字，让你找出所有约数。（除了自身）

![image 20230713183824004](https://s1.imagehub.cc/images/2024/11/24/963be7d54697b4e79d98bd60618c66a8.png)

这样看似简单，但是若是a是八位数，你就要从1开始加的很慢。一定超时。

所以需要优化，优化的思路是比如100/2=50.

那么我们需要把2和50都算在因子里。

我们的循环i并不会进行到50，而是50的平方根。

### switch case

```
	char a; 
        switch(a){
            case 'C':
                i=0;break;			//1️⃣
            case 'R':
                i=1;break;			//2️⃣
            case 'F':
                i=2;break;			//3️⃣
            //default: 语句		//default指如果上面case都不满足 执行这个
        }

 
```

* switch可以接收的数据类型*int ，String ，char
* 一定不要忘了在每句加case
* 关于**break**
  * 在case'C'加break，指只执行1️⃣语句，不会执行23语句。但是如果你想让它接着执行后面的语句可以不加break。
  * default后面可以不加break，因为default是最后一句了，反正执行完就退出了，不存在退不出的情况，**因为switch不是循环语句，而是选择语句**

### 2的一百次方

我写到onenote里了 见A1 因为可以记录语音

如果是让100个2相乘，数字保存不了那么多位，但是可以用数组操作

写了挺久的 onenote有语音讲解

```
#include<bits/stdc++.h>
using namespace std;
int main(){
    int N;	//2的N次方
    cin>>N;
    int A[300];
    A[0]=2;
    int t=0,c=0;
    int m=1;    //记位数
    if(N==0)cout<<"1";
    else if(N==1)cout<<"2";
    else{
        N=N-1;
        while(N--){
          t=0;
          for(int i=0;i<m;i++){
              c = A[i]*2+t;
              A[i] = c%10;
              t=c/10;
          }
          if(t)A[m++]=t;
        }
        
        for(int q=m-1;q>=0;q--){
            cout<<A[q];
        }
    }
    return 0;
}
```

### 四个数字中最大/小的

min (  min(a,b) , min(c,d)  )

### 平方矩阵1

![image 20230718175334121](https://s1.imagehub.cc/images/2024/11/24/d18e0631c9ef2cc9ea3291107eace235.png)

输出这样的数字，规律是选上下左右四个边里最下的，i j从1开始（不是数组，不要代入数组思考）

a是a阶数组的意思

up=i,   down=a-i+1,   left=j,   right=a-j+1

选用四个数中最小的(用上个标题的)

### 平方矩阵2

![image 20230718175704070](https://s1.imagehub.cc/images/2024/11/24/6e7b41bef2b0daa4fe151f33e3dddfcf.png)

这个矩阵的规律是

i,j都从1开始，行-列的绝对值+1

用到abs

### pow类型转换

pow比如想输出8位数的倒是也可以，pow(2,15)

但是会用科学计数法表示，如果想让它完整的表述出来

可以用 （long）pow（2，15）

或者（long long）pow（2，15）

### 二维数组初始化

在main外面声明二维数组会自动全部填为0；

在main里面声明是不确定是否填充的。



### 蛇形数组

用OBS录屏了 在副屏录的

结果没录上 只有声音

![image 20230718193513578](https://s1.imagehub.cc/images/2024/11/24/3a5c1865d17f8a53811bb88330ebc368.png)

这个是onenote的笔记

### while(cin>>a,a)

这句话的意思是题目同时在筛选两个条件，cin在输入a，并且a也不等于0



### 递归

~~~
int fact(int n){
    if(n==1) return 1;
    return n*fact(n-1);
}
~~~



![image 20230728103617224](https://s1.imagehub.cc/images/2024/11/24/974b791a05ce73a7ca69265b1b32197d.png)

在旁边写上返回值是个不错的选择。



![image 20230728120055347](https://s1.imagehub.cc/images/2024/11/24/f71200cb5fde88e228aad7b0db31ee38.png)

也可以采取这种写法

### 递归构造

![Snipaste 2024 11 24 14 32 56](https://s1.imagehub.cc/images/2024/11/24/a8e9d40566ae2e6aae18b5c722f021c7.png)

先画成树的结构，然后思考**变量** 也就是函数的参数

然后思考**什么时候终止**，比如这里就是到5终止

这个函数不用看的很仔细，因为要结合语境理解

然后思考函数可能的递进方式，比如这里有两种递进方式，f(k+1)  f(k+2)

```
递归不一定要返回一个值
  void fact(int n){
    
    if(n==k){count++;return;}
    else if(n<k){
        fact(n+1);
        fact(n+2);
    }
    else{return;}
}
//像这里n==k时return了，n>k时，return了
//return即你好歹要让函数有个结束的时候，才能返回到下一层

但是这样写就是不对的
    void fact(int n){   
    if(n==k){count++;return;}
        fact(n+1);
        fact(n+2);
    }
}

//我个人理解是包裹封闭性不太好
//比如这个是阶乘的函数 包裹性就不错
//int fact(int n){
//    if(n==1)return 1;
//    return n*fact(n-1);
//}

```





### 数组形参

![image 20230728112506171](https://s1.imagehub.cc/images/2024/11/24/f2de63c0c0bdaeec7727878b526e40c2.png)





![image 20230728114953682](https://s1.imagehub.cc/images/2024/11/24/e7638b1b453c8d812c88231499b670e4.png)

### 数组去重

```
#include <bits/stdc++.h>
using namespace std;
int b[1001],t=0;
int get_unique_count(int a[], int n)
{
    ///////////////////////////////下面是重点
    for(int i=1;i<=n;i++)
    {
        if(b[a[i]]==0){ 
            t++;
            b[a[i]]++;
        }
    }
    return t;
}
///////////////////////////////////上面是重点
int main()
{
  int n;
  cin>>n;
  int a[n+1];
  for(int i=1;i<=n;i++)		//直接从1输入也不错
  {
      cin>>a[i];
  }
  cout<<get_unique_count(a,n);
  return 0;
}


```



## 库

### cstdio<>

`<cstdio>`

更适合C++宝宝体质的`<stdio.h>`  （C语言库里的）

要在C++里用printf可以使用

## 类 结构体

**类与结构体的定义：**

```
class Preson{
  private:
  public:
};		//类的大括号外面 一定记得加分号
```

private和public里面可以写一些变量或者函数的声明。但是public和private这两句并不是一定要加的，如果你不给变量去描写他们是属于public还是private，会默认成为private。

 Public和private的区别在于 public的变量在类里面定义，但是还可以在外面继续使用，但是private的变量就只可以在类里面去使用。

与之相对的，结构体中不特定加以private或者public的变量定义会默认public。

~~~
struct{
    private:
    public:
}Person;
~~~

**使用举例：**

~~~
#include<bits/stdc++.h>
using namespace std;

class Person{
  private:
    int age,height;
    double money;
  public:
    string name;
    void say(){
        cout<<"I'm "<<name<<endl;
    }
    int get_age(){
        return age;
    }
};

int main(){
    Person.say(uro);		//I'm uro
    person.age={22};//✖ 报错
    return 0;
}

~~~

**初始化：**

结构体和类在使用构造函数初始化是一样一样的，以下我用结构体举例

```
struct Person(){
    int age,height;
    double money;	//默认public
    Person(int _age,int _height,double _money){//构造函数
        age=_age;
        height=_height;
        money=_money;
        
    private:
        string name;
    }
};
int main(){
    Person p(18,180,20);
    Person a(18,180);//错误的，你自己把构造函数写了三个参数就要传入三个参数
    Person p();	//错误的应该传入三个参数，因为你自己写的构造函数里面是这么写的 修改见下面
    return 0;
}
```

~~~
struct Person(){
    int age,height;
    double money;	//默认public
    Person(int _age,int _height,double _money){//构造函数
        age=_age;
        height=_height;
        money=_money;
    }
    /*
        Person(){}		//这个里面可以允许你一个参数都不传，像倒数第3行一样。
    */
    
};
int main(){
    Person p(18,180,20);
    Person a(18,180);//错误的，你自己把构造函数写了三个参数就要传入三个参数
    Person p();	
    return 0;
}
~~~

**第二种初始化：**

~~~
int main(){
    Person p={18,180,100};
    //或者是Person p={18,180};	没有赋值的会被默认初始化为0
}
~~~



### reverse()

头文件#include < algorithm >

reverse(a, a+n);*//n为数组中的元素个数* 

//注意 这个a不是起始位置的意思

> 还可以翻转字符串、向量
>
> https://blog.csdn.net/YMWM_/article/details/115468297



> 应用：
>
> 给你一个数组，例如12345，翻转一次，51234，翻转两次45123，翻转三次34512
>
> 如何用巧妙的做法呢？
>
> （以下这种做法的好处是数组不用移动里面的元素）
>
> ![image 20230714154423611](https://s1.imagehub.cc/images/2024/11/24/5886795549c0c852b9eda5d9476eb8fa.png)
>
> ![image 20230714154436655](https://s1.imagehub.cc/images/2024/11/24/b6ddd40d5e41e3660dacdc0b804612d3.png)



## 字符串篇（string是不可修改的）

### 细节

char数组的个数是用strlen(char a);

string的个数是用str.size();

这两函数都是返回一个int

**在使用它们的长度的时候，最好是用另一个Int去保存数据，因为这些函数返回的值并不完全是int，而是一种无符号数，在比较的时候容易出错。所以记得用另一个int去保存数据**

### 比对

string a = "jkaa";

if(a=="jkaa"){....}

### 字符串修改

string ss="astabc";

 ss=ss+"c";	//ss为astabcc

还有一种修改方式

string a[2];	//输入abc,def

此时a[0]是abc，a[1]是def

> 如果想要获得b，
>
> string cc = a[[0]][[][2];
>
> 现在cc就是b；

> 如果想要获得be，
>
> cc = a[[0]][[][2];
>
> cc=cc+a[[1]][[][2];





### 给每个输入的字符串加空格

![image 20230719230152292](https://s1.imagehub.cc/images/2024/11/24/e8a3bff40b7e4465622bc4747e90d89f.png)

```
#include<iostream>
#include<cstring>
using namespace std;
int main(){
    string A;
    getline(cin,A);
    for(int i=0;i<A.size()-1;i++){
        cout<<A[i]<<" ";
    }
    cout<<A[A.size()-1]<<endl;
    return 0;
}
```

### 只出现一次的字符

给你一串小写字母组成的字符串，让你判断里面有没有字符只出现了一次。想想看用什么函数











用find，但不完全是。判断函数是这样的。

```
for(int i=0;i<a.size();i++){
    if ( a.find(a[i])==a.rfind(a[i]) ){cout<<a[i]<<endl;break;}
    //指的是从左边开始找该字符的出现位置 与 从右边找该字符的出现位置是一样的
    //rfind是指从最后一个开始找
}
```



### 把字符全变大写或者小写

这个可能有函数，但我觉得也许不必增加多余的工作，可以小暴力破解一下。

大写字母A到Z的ASCII是65-90

小写字母a到z的ASCII是97-122

所以大写变小写加上32

小写变大写减去32

for(int i=0;i<s.size();i++){

​	s[i]=s[i]+32;

}//错啦错啦 如果本来有小写字母，那你加上32不是乱套了，应该判定它本来是大写字母才能加的



for(int i=0;i<s.size();i++){

​	if (s[i]>='A'&&s[i]<='Z') s[i]=s[i]+32;

}	//用'A'而不是用ASCII65，是防止记不住，这样用更方便



### 字符串综合题

`https://www.acwing.com/problem/content/778/`



### 表示空格

可以看到字符串初始化要用“双引号“来初始化，但是在比较是否等于0时，是要用'单引号'来比较。

> 但是这样初始化其实也不完全正确，这样初始化并不是初始化了一个空白的字符。而是初始化了一个空白的空格，等于说你的res在输出的时候你输出的字符天然就带有一个空格，所以完全的初始化应该是res="";

![image 20230730153602864](https://s1.imagehub.cc/images/2024/11/24/69b07839f372b128aa571bb9c51fee2f.png)



