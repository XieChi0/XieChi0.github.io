

## 本节说明

很多图片在本地，还没有上传到图床里，所以暂时无法浏览。



## 算法与递归（数据结构基本概念）

<img src="https://s1.imagehub.cc/images/2024/11/26/caf98a3358f5d4d991cfde5a42dc7599.png" alt="image 20230814204145988" style="zoom:67%;" />

逻辑结构还有一种表述方法：集合，线性结构，树状结构，图或网状结构

> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231212055222563.png" alt="image-20231212055222563" style="zoom: 80%;" />

存储结构分为顺序存储，链式存储，索引存储，哈希存储

> 顺链索哈（顺便链接，索要一下存款哈）



**理解：**

>数据：计算机加工的原料，信息载体。比如0，1。
>
>数据元素：把一些数据组合一下作为一个可以运算的基本单位（该单位不可分割）。 比如学生记录是数据元素，由学号、姓名、性别等数据项组成。
>
>​					（可以理解为链表上的每个节点）
>
>数据对象：相同性质的数据元素的组合
>
>

![image 20230814203423656](https://s1.imagehub.cc/images/2024/11/28/95a01b81a67f9969340311b75a05fd08.png)



> ![image 20231212055635289](https://s1.imagehub.cc/images/2024/11/28/3efeb2f4123902e9c7afd373d658b198.png)

>==数据类型：（比如bool、int）指一个值的集合以及在这之上的操作。==
>
>>  原子类型（int float）、结构类型（可以分解）、==抽象数据类型（链表）(ADT)：一个数据模型以及定义在该模型上的一组操作==
>
>**数据结构：**元素之间关系称作**结构**，有逻辑解构、存储结构、数据的运算。（比如树）
>
>（算法的设计取决于逻辑结构，算法的实现取决于存储结构）ADT也叫数据结构

==数据类型分为值的集合和操作。数据结构属于值的集合。所以结构类型，抽象数据类型是包含数据结构的。（还多出了一块操作）==

---

**记忆：**

### **数据结构三要素**

**逻辑结构：**

线性结构：线性表、**栈、队列**

非线性结构： 树、图

（或者是集合（无关系）、线性结构（一对一）、树形结构（一对多）、图或网（多对多））

**存储结构：**

顺序存储、链式存储（逻辑相邻物理不相邻）、索引存储、散列存储（哈希表）

**数据的运算：**

运算的定义与运算的实现。

前者针对逻辑结构，后者针对存储结构。



<img src="https://s1.imagehub.cc/images/2024/11/26/0f5c389828e586107f49e338fb55c82b.png" alt="image 20230814210810984" style="zoom:67%;" />

### 算法的五个特性：

![image 20230814210458804](https://s1.imagehub.cc/images/2024/11/26/a9626b0b29a610e924815e3e63449697.png)

## 线性表

线性表是一种逻辑结构，表示元素之间一对一的相邻关系。顺序表和链表是指存储结构，两者属于不同层面。

思维导图sun笔记有

**顺序表特点：**

1. 顺序表具有随机存取的特性。通过首地址和元素序号可以在O(1)的时间内找到。

2. 顺序表存储密度高。

3. 插入和删除需要移动大量元素，插入删除不方便。

>存储密度 = （结点数据本身所占的存储量）/（结点结构所占的存储总量）
>
>下面以指针举例
>
>![image 20230816194846680](https://s1.imagehub.cc/images/2024/11/26/fe5d5f551b522593e752f0a3045f68e9.png)
>
>结点的存储密度是1，链表存储密度＜1

**链式表特点：**（前面两点结合顺序表）

1. 非随机存取结构

2. 

3. 插入删除方便，修改指针即可，不需要移动大量元素。

4. 采用动态存储分配，不会造成内存浪费。

```C++
//单链表定义
typedef struct LNode{
    int data;
    struct LNode *next;
}*Linklist,LNode;
```

由于链表的命名一个有星号，一个没星号，所以在函数返回一个链表时，LNode需要加星号，因为它定义的时候没有星号，而Linklist定义的时候有星号就不用加了。

LNode* GetElem(Linklist L,int i){};

Linklist ListInsert(Linklist &L,int i){};

那么怎么判断到底该返回哪个？想强调返回整个链表就用Linlist，想强调返回结点就用LNode*；

```C++
//给值查找结点
LNode LocateElem(Linklist L,int x){
    LNode*p=L->next;
    while(p){
        if(p->data==x)return p;
        p=p->next;
    }
    return NULL;
}
                                                                                                                                                                                                                                                                                                           
```



## 栈与队列

*/栈：top指针指向最后一个元素 /*

*/队列：front指向底部的元素在的位置，rear指向最后一个元素的**下一个位置** /*

**栈的定义：**只允许在一端进行插入或删除操作的线性表。

注：共享栈 考纲没说 但是感觉考试经常考

**队列的定义：**操作受限的线性表，只允许在表的一端进行插入，另一端进行删除。

一定要注意区分队头队尾，容易忘，队头叫front，是删除的一端。队尾叫rear，是插入的一端。

~~~C++
//顺序栈的定义
tepedef struct{
    int top;
    int data[Maxsize];
}SqStack;

//链栈的定义
（把第一个节点当做栈顶，至于有没有头结点我觉得都可以）
typedef struct LNode{
    int data;
    struct LNode* next;
}LNode,*LinkStack;

//初始化
void InitStack(SqStack &S){
    S.top=-1;
}

//判空
bool StackEmpty(SqStack S){
    if(S.top==-1)
        return truel
    else
        return flase;
}

//进栈
bool Push(SqStack &S,ElemType x){
    if(S.top==Maxsize-1)
        return false;
    S.data[++top]=x;
    return true;
}

//出栈
bool Pop(SqStack &S,ElemType &x){
    if(S.top==-1)return false;
    x=S.data[top--];
    return true;
}

//读栈顶
bool GetTop(SqStack &S,ElemType &x){
    if(S.top==-1)return false;
    x=S.data[top];
    return true;
}
~~~

![image 20230906200806672](https://s1.imagehub.cc/images/2024/11/26/00ed9f9fb24d3508f98f70d2f8aea045.png)

顺序栈的特点：后进先出(LIFO)（缺点：空间利用率低）

链栈的特点：优点：不存在栈满上溢的情况，而且空间利用率高（动态存储）

​						缺点：需要额外的空间存储内存



---



顺序队列的特点：先进先出(FIFO)

**顺序队列有一个缺点，即只要删除元素，front就一直向上走，假设现在rear指向了maxsize,front指向了maxsize-1，此时只有 一个元素，但依据判定（Q,rear==Maxsize）仍然满了，但是这样叫做“上溢”，下面的空间远远没有满，下面的却满了，空间利用不合理，所以需要循环队列**

==循环队列在存储上也是顺序数组，所以它也叫SqQueue==

==在写rear或front的时候，不要忘记加上Q.front或者Q.rear==

```C++
 //顺序队列
define MaxSize 100
typedef struct{
    int front,rear;
    int data[MaxSize];
}SqQueue;
//判空
顺序队列的判空可以是队头和队尾都是-1，也可以都是0，但是我觉得记作0方便一点，因为队尾我们记作已有元素的下一个元素，而队头指的是最初的元素，这里我们以队尾为例。

//循环队列
//判空 Q.front==Q。rear即可，不用判断他们是否为0或者-1.
//队满 (Q.rear+1)% MaxSize == Q.front
 
//入队
    bool EnQueue(Queue &Q,int x){
    if((Q.rear+1)%Maxsize==Q.front) return false;
    Q.data[Q.rear]=x;
    Q.rear=(Q.rear+1)%Maxsize;
    return true;
}
//出队
	bool DeQueue(Queue &Q,int &x){
        if(Q.rear==Q.front)return false;
        x=Q.data[Q.front];
        Q.front=(Q.front+1)%Maxsize;
        return true;
    }

//链式队列
typedef struct LNode{
    int data;
    struct LNode* next;
}LNode;
typedef struct{
    LNode* front,*rear;
}LiQueue;

//初始化
void InitQueue(LiQueue &Q){
    Q,rear=(LNode*)malloc(sizeof(LNode));
    Q,front=Q.rear;
    Q.front->next=NULL;
}
//入队
void EnQueue(LiQueue &Q,int x){
    Q.rear->next=(LNode*)malloc(sizeof(LNode));
    Q.rear=Q.rear->next;
    Q.rear->data=x;
    Q.rear->next=NULL;
}

//出队
bool DeQueue(LiQueue & Q,int &x){
    if(Q.rear==Q.front)return false;
    LNode *p=Q.front->next;
    x=p->data;
    Q.front->next=p->next;
    free(p);
    return true;
}

```

![image 20230913150623339](https://s1.imagehub.cc/images/2024/11/26/139f0ab572a29b97a8eafca28d0ec8be.png)![image 20230913153616861](https://s1.imagehub.cc/images/2024/11/26/4bfd0d16ced208dc3349e28d8584a2a4.png)



### *栈的应用

*大题的可能性小 还是先以选填为主*

栈的应用：括号匹配，表达式计算（前中后），递归栈

队列应用：树的层次遍历，打印队列

![Snipaste 2024 11 28 16 36 26](https://s1.imagehub.cc/images/2024/11/28/4f0082e46460cc0f0fdfe151f12e5c3c.png)

王道上说的，我不确定

---

寻找第一个右括号，随机找到第一个左括号，第一个找到的左括号一定是最后进入的。与栈相似



#### **括号匹配：**

遇见左括号就压入，遇见右括号就弹出，然后看看与第一个左括号是否匹配，匹配则消耗掉这个左括号

**匹配失败的情况：**

* （匹配不上）弹出的左括号与右括号匹配不上，后面的也就不用再检查了
* （右括号剩余）右括号在这儿等着呢，但是左括号弹不出来了，所以后面的也就不用检查了
* （左括号剩余）右括号已经匹配完毕，但是栈里还有多余的左括号，也就失败了



```C++
//括号匹配问题
bool match_couple(char str[]){
    SqStack S;	//创建一个顺序栈
    InitStack(S);	//初始化栈
    for(int i=0;i<strlen(str);i++){
        if(str[i]=='('||str[i]=='['||str[i]=='{')push(S,str[i]);
        else{
            if(StackEmpty(S)){return false;}	//每一轮都要检查
            char top1;
            pop(S,top1);
            if(str[i]==')'&&top1!='(')return false;
            if(str[i]==']'&&top1!='[')return false;
            if(str[i]=='}'&&top1!='{')return false;
        }
    }
    return (StackEmpty(S));	//别忘了
}
```



代码在王道9：24，不难，懂逻辑就可以试着写一下

实现用顺序栈，链栈都可以，前者简单一些



---

#### **表达式求值：**

注意：括号比乘除的优先级更高

<img src="https://s1.imagehub.cc/images/2024/11/26/2802e7b36f3be535b8bc3a5ef9522485.png" alt="image 20230913162619986" style="zoom:50%;" />



虽然右优先，但是一个括号内还是从左到右，注意看⑤ ⑥

<img src="https://s1.imagehub.cc/images/2024/11/26/4614241264db58d3dea6914f0cffde45.png" alt="image 20230913210012345" style="zoom: 33%;" />

![image 20230913210400845](https://s1.imagehub.cc/images/2024/11/26/edc256e4ac046825f12afcf2983e7de8.png)



---

**栈来实现以下操作：**



1️⃣中缀转后缀

<img src="https://s1.imagehub.cc/images/2024/11/26/981cbddbb0cc28243af24e41fa340cdf.png" alt="image 20230919114846954" style="zoom:50%;" />

<img src="https://s1.imagehub.cc/images/2024/11/26/033b0cbb5554885de861a7c87d66f1ea.png" alt="image 20230919114955438" style="zoom:50%;" />

还有一种是有括号的情况：

<img src="https://s1.imagehub.cc/images/2024/11/26/9448c91ebc344895f90edf07a658f9da.png" alt="image 20230919115322514" style="zoom:50%;" />

但是注意哦 括号会在栈里 却不会在表达式里

<img src="https://s1.imagehub.cc/images/2024/11/26/228bf17973ba3b7a889f3fe5c4b22680.png" alt="image 20230919120221136" style="zoom:50%;" />

2️⃣后缀表达式求值

从左到右扫描，遇见操作数入栈，遇见操作符就弹出两个栈顶元素，先弹出来的是有操作数

3️⃣中缀表达式的求值

结合了前面两种方法，略微复杂一些，P29 15分

<img src="https://s1.imagehub.cc/images/2024/11/26/18a9275f9bc58566a8430803b897f669.png" alt="image 20230919121721541" style="zoom:50%;" />

#### 递归与栈：

首先在语法30天有一部分递归与栈的知识

其次系统中大概有以下四个大块，

Heap(堆)

Stack(栈)	：用来存放函数调用的所有信息和局部变量（栈中可能会用好几个函数，栈顶是正在执行的函数）

Static/Global  ：不在函数中声明的变量

Code



除了堆，其他的都只在函数执行期间内存活，并且它们的运行大小不会增长。

 在递归中，最先被执行的是最后调用的函数（LIFO  ）



<img src="https://s1.imagehub.cc/images/2024/11/26/24a61c4c04a1c5bada3c4d4b52acc496.png" alt="image 20230919122658000" style="zoom:67%;" />

对于这样的函数，它的栈是这样的（底下的start是压入了一些其他信息）

<img src="https://s1.imagehub.cc/images/2024/11/26/c03f862a9b566d198cffd9240dbbd161.png" alt="image 20230919122754051" style="zoom:67%;" />



![Snipaste 2024 11 28 16 38 29](https://s1.imagehub.cc/images/2024/11/28/2b12e6092ea0816dc0711a38b8de28d4.png)



![image 20230919123355915](https://s1.imagehub.cc/images/2024/11/26/a10f2fbbd5ad389466780e7a5b02bb83.png)

<img src="https://s1.imagehub.cc/images/2024/11/26/ab337c837248164b7e2442f6ef171b38.png" alt="image 20230919123454353" style="zoom:50%;" />



### *队列的应用：树的层次遍历

<img src="https://s1.imagehub.cc/images/2024/11/26/b726137196d351ff9dc71a53a6804698.png" alt="image 20230919124156954" style="zoom:33%;" />

每处理一个元素，就把它的孩子节点加入队尾，加入完毕，就让这个元素消失。

然后处理它的孩子节点，比如是2，在处理2的时候，再加入45，然后2就可以消失。



2️⃣图的广度优先遍历

<img src="https://s1.imagehub.cc/images/2024/11/26/d40ff92ae4295844f6590cb1b8319456.png" alt="image 20230919124332547" style="zoom:50%;" />

从1开始，然后找相邻节点23，1出队，再找2的相邻节点4，然后2出队，4出队...

3️⃣操作系统中的应用

<img src="https://s1.imagehub.cc/images/2024/11/26/07a2b7adb5610a696c0bb4d3ece84692.png" alt="image 20230919124522223" style="zoom:50%;" />

## 压缩矩阵

> 首先要知晓我们的目的是帮助压缩存储
>
> 一维数组和二维数组较为普通，特殊矩阵中，
>
> > 什么是对称矩阵呢？第几个元素个数是用什么思路求的呢？上三角区下三角区仅仅是将i,j做对调
> >
> > 什么是三角矩阵呢，注意其他部分都是常量哦，注意区分上三角区和下三角区，即使是上三角矩阵也有下三角区
> >
> > 什么是三对角矩阵，注意它也叫带状矩阵，它求i,j的思路是什么呢，以及知道元素个数如何求i,j呢
> >
> > 稀疏矩阵是什么呢？它的存储方式有什么呢
> >

<img src="https://s1.imagehub.cc/images/2024/11/28/bd47b85b19c2c089da48eba0ff2c8825.png" alt="image 20230919124908783" style="zoom: 50%;" />

==在描述矩阵元素的时候，通常从1开始，比如a1,1==

==可是实际存放的时候，很多时候是从0开始，可以是[0,0]，也可以是一维数组的[0]==

 B[k]在实际中是第k+1个元素

> * 三对角矩阵知道数组下标，如何得到i,j
>
> 注意是向上取整哦
>
> <img src="https://s1.imagehub.cc/images/2024/11/28/9fed156ca66d351b2c412d40b517d318.png" alt="image 20230921121043985" style="zoom:50%;" />
>
> 得到i之后再用等式求出j
>
> * 稀疏矩阵的存储方法有三元组和十字链表，由于没图，所以我存一个
>
> 下没存图
>
> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20230921121457405.png" alt="image-20230921121457405" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20230921121911613.png" alt="image-20230921121911613" style="zoom: 67%;" />

## 串(char)

> 思考存储方式
>
> 以及静态存储的时候具体是怎么放的 
>
> 思考结构定义方式以及结构名称
>
> 思考常用的操作，比如赋值，割去，比较
>
> 思考bf算法的两种模式（只想起最后一个也没事）
>
> 思考kmp算法next数组怎么构建的，以及nextval数组怎么构建的
>
> 思考kmp的算法代码
>
> > 参数里写入int next[]
> >
> > 在第一个判断是if(j==0||S.ch[i] ==T.ch[j]){i++;j++;}
> >
> > 否则让j=next[j];记住i不用动
>
> 简答暴力算法的时间复杂度和Kmp的时间复杂度

串就是String啦，是由多个字符组成的有限序列。（注意都是char类型辣！）

这里的字符是源于字符集，比如ASCII

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20230920192916371.png" alt="image-20230920192916371" style="zoom: 67%;" />

王道中让串采用静态数组

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20230920192957597.png" alt="image-20230920192957597" style="zoom: 150%;" />

提纲没说 但区分一下

子串是主串的一部分

模式串是我们要找的一部分，它可能在主串中出现，也可能不出现

**定义**

```C++
//顺序模式
typedef struct{
    char data[MaxSize];
    int length;
}SString;
//动态分配
typedef struct{
    char* ch;
    int length;
}HString;	//H指的是堆
ch=(char*)malloc(sizeof(char));	
```

**常见操作**

StrAssign(&T,chars);	//把chars的值赋给串T

StrEmpty(S);	//判空

StrCompare(S,T);	//比较，若S>T，则返回值>0；若S=T，则返回值=0；若S<T，则返回值<0

StrLength(T);	//求串长

SubString(&Sub,S,pos,len);	//求子串。S的第pos个字符长度为len的串赋值给Sub

Concat(&T,S1,S2);	//串联。把S1,S2串联在一起赋值给T

Index(S,T);	//若S中有T，则返回第一次定位到的位置，否则返回0

ClearSTring(&S);	//清空操作

DestroyString(&S)；	//销毁操作





### 朴素/BF/暴力模式匹配

定义：将主串中所有长度为n的子串依次与 模式串 进行对比，直到找到一个完全相同的子串，找不到就结束了

**时间复杂度 最坏下：**==O(mn)==

 ```C++
 //可以直接看第二个程序 我这个是复杂一些的暴力模式算法
 bool Brute-Force(Sttring T1,Sttring T2,int &x){
     int L1=T1.length,L2=T2.length;
     int i,j,flag;
     for(i=0;i<=L1-L2;i++){
         flag=0;
         for(j=i;j<L2;j++){
             if(T1[j]!=T2[j]){flag=1;break;}
         }
         if(flag==0){x=j;return true;}
     }
     return false;
 }
 
 //正宗版暴力模式算法
 int btute_Force(Sttring T1,Sttring T2){
     int n=StrLength(T1);
     int m=StrLength(T2);
     Sttring S;
     int i=1;//注意是从1开始，这是串结构时我们为了方便定义的
     while(i<=n-m+1){
         SubStr(S,T1,i,L2);
         //注意下面的写法不太对哦 一定要记得我们不需要赋值哦，substr或者说substring有四个变量
         //S=SubStr(T1,i,L2);
         if(!StrCompare(T1,S))i++;
         else{return i;}
     }
     return 0;
 }
 
 
 //正宗暴力模式算法2（图在下面）
 //（双指针比较）
 int Brute_Force(SString S,SString T){
     int i=1,j=1;
     while(i<=S.length&&j<=T.length){//这个容易忘
         if(S.ch[i]==T.ch[j]){++j;++i;}
         //if(S.ch[j]==T.ch[j])++j;  写错了的写法
         else{j=1;i=i-j+2;}
     }
     if(j>T.length)return i-T.length;	//这个模式是匹配成功的了，可以看下下张图
     return 0;
 }
 ```

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20230920201901558.png" alt="image-20230920201901558" style="zoom: 33%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20230920205255387.png" alt="image-20230920205255387" style="zoom:33%;" />

### KMP（保证i不变）

是基于朴素模式算法进行优化

#### next数组（前两个数字写 01）

如果j匹配失败，那么j要回溯到next[j]

https://www.bilibili.com/video/BV1b7411N798?p=39&vd_source=242db541ef4385051aa8604240bfc502 容易忘 我不仔细说了 多回看

  ![image-20230920211039248](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20230920211039248.png)

 这个next数组是要自己求的，不是每个串都是这个next数组

**整个代码分成两段，第一段是求出next数组，第二段是利用next数组进行匹配（匹配的过程中i不进行回溯）**

**next数组不考察代码，手动模拟next数组**

```C++

int kmp(SString S,SString T,int next[]){//注意这里的参数写上数组
    while(i<=S.length&&j<=T.length){
        if(j==0||S.char[i]==T.char[j]){i++;j++;}	//注意这个j==0 
        else{j=next[j];}
    }
    if(j>T.length)return i-T.length;
    return 0;
}
```

**kmp时间复杂度是==O(m+n)==，因为i不会回溯（对比朴素模式匹配的O(mn）**

#### nextval数组

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20230921090646925.png" alt="image-20230921090646925" style="zoom:67%;" />

注意序列4的地方优化为1而不是0

个人总结nextval:**若next[j]数组指向的值和next[1]一样，就为0，否则不要轻易写为0哦，总之我认为尽量向上（左）追溯源头即可，就像b的源头在2**

## 树

> 树的定义是什么？
>
> 思考术语：（并不需要背诵）
>
> * 双亲，兄弟，堂兄弟、孩子、祖先
> * 结点的度、树的度
> * 分支结点、叶子结点
> * 有序树和无序树
> * 路径（结点序列）、路径长度、树的路径长度（根到每个底部结点距离的总和）
> * 森林：m棵互不相交的树的集合
>
> ==结点的深度是从根节点自顶向下累积==
>
> ==结点的高度是从叶结点从底向上逐层累加==

定义：树是n个结点的有限集（n≥0）





### 二叉树

> 二叉树可以为空
>
> 二叉树的存储结构有哪些呢？
>
> 注：二叉树是说每个结点最多只有两颗子树，而二叉树的度可以为1
>
> n0=n2+1
>
> 2
>
> 用链表存储时，n个结点的二叉树有n+1个空指针



二叉树：一种树形结构，特点是每个结点最多两棵子树，并且子树有左右之分，次序不能颠倒。

满二叉树：树中的每层结点都含有最多的结点。

完全二叉树：当且仅当每个结点都与高度为h的满二叉树编号1~n的结点一一对应时，称为完全二叉树。

![image-20231007084120779](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231007084120779.png)

**存储结构：**

```C++
//顺序存储结构
////适用：完全二叉树，满二叉树（注：数组从1开始写）

//链式存储
////适用：其余二叉树
typedef struct BitNode{
    Elemtype data;
    struct BitNode *lchild,*rchild;
}BitNode,*BitTree;
    
```

#### *四种遍历*

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231007085559377.png" alt="image-20231007085559377" style="zoom: 80%;" />

```C++
//先序遍历
void PreOrder(BiTree T){
    if(T!=NULL){
        visit(T);
        PreOrder(T->lchild);
        PreOrder(T->rchild);
    }
}
//中序遍历
void InOrder(BiTree T){
    if(T!=NULL){
        InOrder(T->lchild);
        visit(T);
        InOrder(T->rchild);
    }
}
//后序遍历
void PostOrder(BiTree T){
    if(T!=NULL){
        PostOrder(T->lchild);
        PostOrder(T->rchild);
        visit(T);
    }
}

//先序遍历(易忘)
void PreOrder2(BiTree T){
    Stack S;InitStack(S);
    BiTree p=T;
    while(p||!IsEmpty(S)){
        if(p){
            visit(p);
            Push(S,p);
            p=p->lchild;
        }
        else{
            pop(S,p);
            p=p->rchild;
        }
    }    
}

//层次遍历
void LevelOrder(BiTree T){
    Queue Q;
    BiTree p=T;
    EnQueue(p);
    while(!IsEmpty(Q)){
      	DeQueue(Q,p);
        visit(p);
        if(p->lchild!=NULL)
       		EnQueue(Q,p->lchild);
        if(p->rchild!=NULL)
       		EnQueue(Q,p->rchild); 
    	}
    }
}
          
          
```



### 线索二叉树

线索就是指那些指向前驱或者后继的指针：如若没有左孩子，左指针指向前驱节点；如若没有右孩子，右指针指向后继节点

至于谁是前驱，谁是后继，是根据遍历的序列得到的

> 可以分为中序线索二叉树、先序线索二叉树、后序线索二叉树，再细分比如中序后继，中序前驱这样

```C++
typedef struct ThreadNode{
    int data;
    int rtag,ltag;
    struct ThreadNode *lchild,*rchild;
}ThreadNode,*ThreadTree;

//tag==0 表示指的是孩子
//tag==1 表示指的是前驱或者后继
```

```C++
//具体实现方法(以中序线索二叉树为例)
//不过说明一下 目前的软件精和考纲上均未提及
看似复杂，但是清楚几个大的构成便不复杂
void summary(ThreadTree &T){	//写这个函数只是为了处理最后一个节点，以及创立pre节点
    pre=NULL;
    if(T!=NULL){
        InThread(T);//其实就相当于上面遍历里的InOrder()
        if(pre->rchild==NULL)
        	pre->rtag=1;
    }
}

void InThread(ThreadTree &T){
    if(T!=NULL){
        InThread(T->lchild);
        visit(T);
        InThread(T->rchild);
    }
}

//注意此函数没有循环，上面函数召它一次它就干一次的事情
void visit(ThreadNode T){//⭐线索二叉树的重点函数
        if(T->lchild==NULL){
            T->lchild=pre;
            T->ltag=1;
        }
        if(pre->rchild==NULL&&pre!=NULL){
            pre->rchild=T;
            pre->rtag=1;
        } 
    pre=q;
}    
```

暂时未整理，等有人明确让我背时我再背（线索二叉树最后一节四分左右）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231008183959540.png" alt="image-20231008183957672" style="zoom:50%;" />

这下面这节视频我也没有仔细阅读 但是可以看一下思维导图

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231008185328834.png" alt="image-20231008185328834" style="zoom: 50%;" />



线索二叉树：引入线索二叉树是为了加快查找节点前驱和后继的速度。即节点若无左子树，令lchild指向前驱节点；若无右子树，令rchild指向后继节点。除此之外再增加两个标志域标识指针是指向孩子还是前驱。

二叉排序树（也称二叉查找树BST）：左子树结点值<根结点值<右子树结点值，对二叉排序数进行<u>中序遍历</u>，可以得到一个递增的有序序列。

平衡二叉树（AVL）：简称平衡树，树上任意节点的左子树和右子树的高度质差不超过1。

​	结点的平衡因子：左子树高-右子树高（只能是-1，0，1）



哈夫曼树：在含有n个带权叶结点的二叉树中，带权路径长度(WPL)最小的二叉树称为哈夫曼树，也叫最优二叉树

（带权路径长度WPL：从树的根到任意结点的路径长度（经过的边数）与该结点上权值的乘积）

（树的带权路径长度：树中所有叶结点的带权路径长度的和 WPL=w1L1+w2L2+...）

### 树、森林

> 树的表示方法有哪些？



**表示方法**

1.双亲表示法(也叫树的顺序存储，用数组记录的数字表示该节点指向的双亲的位置（数组下标代表编号 ）)

缺点：找孩子不方便（竖状表格 int data int parent）

2.孩子表示法（顺序+链式存储）

3.孩子兄弟表示法（链式存储，一个指针指向孩子，一个指针指向自己右边的兄弟）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012161355336.png" alt="image-20231012161355336"  /><img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012161417403.png" alt="image-20231012161417403"  />

```C++
//双亲表示法
    typedef struct ParentNode{
        int data;
        int parent;
    }PTNode;
PTNode tree[Maxsize];

//孩子兄弟表示法
typedef struct CSNode{
    int data;
    struct CSNode *firstchild,*nextchild;
}CSNode,*CSTree;
```

**优点：**方便实现树到二叉树的操作 (二叉树是指一个指针指向孩子，另一个指针指向右兄弟)

---

#### 树、森林的遍历

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012160547895.png" alt="image-20231012160547895" style="zoom:67%;" />

| 树       | 森林     | 二叉树   |
| -------- | -------- | -------- |
| 先根遍历 | 先序遍历 | 先序遍历 |
| 后根遍历 | 中序遍历 | 中序遍历 |



**森林：**森林是m颗（m>=0）互不相交的树的集合。每棵树去掉根节点后，其各个子树又组成森林。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012162600885.png" alt="image-20231012162600885" style="zoom: 50%;" />

B E K L F C G D H M I J

中序遍历：



* 中序遍历第一颗树的根节点的子树森林
* 再访问第一棵树的根
* 中序遍历除去第一棵树地点剩余的树构成的森林

K E L B F G C ==M H I J D==	

#### 树、森林的转化

（注，这里的二叉树都是指的左孩子右兄弟）

* 树转化为二叉树
* 森林转化为二叉树
* 二叉树转化为森林

#### 本章不太会的考点

高度为h的完全二叉树对应的森林所含树的个数一定是h

> 这句话是对的，只不过有条件：满二叉树对应的森林的树的个数才是h
>
> ![image-20231014152041782](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231014152041782.png)

一棵树的叶子数一定等于与其对应的二叉树的叶子数

> 这句话错误。但也是条件不对，条件对了的话还是有可能对的。
>
> 条件：***如果树中的任意两个叶子结点都不存在相同的双亲，则树中的叶子数才有可能与对应的二叉树中的叶子数相等***
>
> 可以分析一下由来。二叉树的叶子是指没有孩子也没有兄弟，没有孩子这点与树的叶子数对应了，但是树中有的叶子结点也是有右兄弟的啊
>
> 总结一下，**如果树在转化为二叉树时，有几个叶子结点有共同的双亲，则 转化为二叉树后只有一个结点是叶节点，即最右边的叶子结点**
>
> **但是如果树中的任意两个叶子结点都不存在相同的双亲，则树中的叶子数才有可能与对应的二叉树中的叶子数相等**



森林对应的二叉树有m个结点，二叉树的根节点的右子树结点个数是n，森林中第一棵树的结点个数是？

> m-n 



假设有一个二叉树是由森林变化而来的，森林中有n个非叶子结点（非终端结点），则二叉树中右指针链域为空的结点有：n+1

> 这里面不用去考虑森林，只用去想二叉树右指针为空的可能性。即没有兄弟。二叉树的根节点的右指针也就是森林里有几棵树，不管有几棵吧，反正最右边的一棵树在二叉树里一定没有右指针。
>
> 其次是非叶子结点，非叶子节点不管有几个孩子吧，反正最右边的孩子在二叉树里一定没有右指针，因为它没有右兄弟。
>
> （想不通就别想了，就理解为每个非终端节点首先都有孩子，一定存在最靠右边的孩子，这个最右边的孩子转化成二叉树就没有右指针）
>
> 所以在森林转化成二叉树后，二叉树中右指针为空的节点是n+1

已知一棵有2011个结点的树，其叶节点是116，则该树对应的二叉树中无右孩子的结点的个数是？

> 可以根据上一题已知，二叉树中没有右孩子的是非终端结点（非叶子结点）的孩子中的最后一个，也就是非叶子结点的个数，
>
> 以及虽然这里只有一棵树，但这一棵树转化成二叉树，根节点也没有右兄弟。所以是非叶子结点+1
>
> 2011-116+1

我们有一个这样的表格

![image-20231014153738380](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231014153738380.png)

> 在这里面可以发现森林和二叉树的遍历方式总是一样的，所以如果森林是后序遍历，则二叉树也是后序遍历。这是表格里所没有的。



### 哈夫曼树（带权二叉树）

> 什么是哈夫曼树？
>
> 什么是结点的权？
>
> 什么是带权路径长度？也称作结点的带权路径长度
>
> 什么是树的带权路径长度？
>
> 什么是WPL？
>
>  
>
> 哈夫曼树构造过程总共新建几个节点？
>
> 哈夫曼树总共节点是？
>
>  
>
> 什么是前缀编码？
>
> 什么是固定长度编码？
>
> 什么是可变长度编码？

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012164417700.png" alt="image-20231012164417700" style="zoom:50%;" />

哈夫曼树：在含有n个带权叶结点的二叉树中，WPL最小的二叉树。



结点的权：有某种含义的数值

带权路径长度：树根到任意结点的路径长度（经过的边数）✖该结点的权

树的带权路径长度：树中所有叶节点的带权路径长度之和（WPL）



(除过第一次是两个字母结点组合在一起，其他层都是一个字母结点与一个数字结点组合在一起 n-1减的是第一次的那个结点)

哈夫曼树：在含有n个带权叶结点的二叉树中，带权路径长度(WPL)最小的二叉树称为哈夫曼树，也叫最优二叉树



**哈夫曼编码**：用于数据压缩

**字符集中的每个字符作为一个叶子结点。各个字符出现的频度作为结点的权值**

指的是10题选A A的权值是2*10	80题选C C 的权值是2 * 80

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231014163442794.png" alt="image-20231014163442794" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231014163643563.png" alt="image-20231014163643563" style="zoom:50%;" />

前缀编码：没有一个编码是另一个编码的前缀

固定长度编码：每个字符用相等的二进制位表示

可变长度编码：不同字符用不等长的二进制位表示

### 并查集

> 并查集的逻辑结构是？存储结构是？
>
> 并的英文是？查的英文是？
>
> 以及上面二者的函数声明如何写呢？
>
> 
>
>   
>
> 并的优化思路是？（此栏最下面） 
>
> 查的优化思路是？

能否按照下图的方式写一下优化思路和每次并和查的时间复杂度

> （小的并到大的）（先找根，再压缩路径）

==在并查集的数组中，虽然存放位置是连续的，但相邻的元素并不一定是一个集合，他们只是存放各自的链条，各自为营==

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012192458544.png" alt="image-20231012192458544" style="zoom:50%;" />

这里的Union不是把一棵树并到另一棵树，而是把无数个散落的点并到一起

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012185738369.png" alt="image-20231012185738369" style="zoom:50%;" />

逻辑结构：集合

存储结构：双亲表示法（需要用到根 并和查操作都很方便 ）

  <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012175405765.png" alt="image-20231012175405765" style="zoom: 50%;" />

并：把一棵树并到另一棵树

查：查是否同一根

根在数组中的值都是-1

> **并：**比如C要并到第一棵树，就把C的值改为0 
>
> void Union()：

> **查:**一直往上找，找到根，那么==什么是根呢（就是值<0的点==）== O(n) n是高度==
>
> int Find()：



```C++
#define number 13
int UFSets[number]	//是指Union-Find Sets

//初始化并查集
void Initial(int S[]){
    for(int i=0;i<numer;i++){
        S[i]=-1;
    }
}    
//并(将两个集合并为一个)
void Union(int S[],int root1,int root2){ //root是指根在数组中的位置
    //首先要验证并不是一个集合
   if(root1!=root2){
       S[root2]=root1;
   }
    return;
}
//查(找x所属集合)
int Find(int S[],int x){
    while(S[x]>=0){
        x=S[x];
    }
    return x;
}
```

#### union优化(时间复杂度n到log2n)

==root是指根在数组中位置，S[root]是指存储的数字，优化前是-1,优化后是-n==

==比如把root2合并到root1，在合并后，root2就变成了普通节点，不再存放根节点，而是存放root1的位置，毕竟它直接并到root1下面==

之前说过 查的时候时间复杂度是O(n)，这是因为如果一棵树每层只有一个节点，一层一层往上查的时候，最坏情况要查n层

所以需要优化

**优化思路：**合并的时候让小树合并到大树（之所以不让大树合并到小树，是因为那样会增加高度）

如何判断树木的大小？

之前我们把根节点的值设为-1，现在我们设为-6，表示此树有六个节点

（具体情节是合并的时候 把小树的根的值与大树的根的值加起来（-6 + -2 = -8），加到大树的根的值，因为在合并后，大树的节点数量必然改变；然后把小树的根的值设为0，也就是大树的根所在的位置）

![image-20231012185604193](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012185604193.png)

这样优化过后 可以使得整个树的高度 不超过 <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012185645406.png" alt="image-20231012185645406" style="zoom:50%;" />



#### find的优化

```C++
int Find(int S[],int x){
    int root =x;
    while(S[root]>=0)root=S[root];
    while(x!=root){	//压缩路径
        int t=S[x];
        S[x]=root;
    }
    return root;
}
```

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231212050931748.png" alt="image-20231212050931748"  />

**不指向根节点的再挂，像B本来就在根节点上，不用改**

![image-20231012190346447](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012190346447.png)

![image-20231012192313448](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231012192313448.png)



## 图

### 图的定义

> 思考定义：
>
> 路径	路径长度
>
> 回路
>
> 简单路径
>
> 简单回路
>
> 什么是连通？什么是强连通
>
> 子图，生成子图
>
> 极大连通子图==连通分量(无向图)
>
> 极大强连通子图==强连通分量（有向图）
>
> 
>
> 极大连通子图和极小连通子图的区别？（看下面黄色）
>
> 生成树==极小连通子图
>
> 生成树与生成子图的区别是？（看下面黄色）

图：图G由顶点集V和边集E组成，记为G=(V,E)。V(G)表示图G中顶点的有限非空集，E(G)表示图G中顶点之间的边集合。 

> 注意是集合，表示具体的顶点个数，边的个数我们用|V|,|E|。
>
> 顶点个数不可以 为空，边集可以为空。
>
> 
>
> 生成树是无向图里才有的
>
> 生成森林是什么
>
> 
>
> 带权路径长度是指？
>
> ​                              
>
> 无向完全图是什么？有向完全图呢？

顶点的度=入度+出度。分别表示为ID(v)  OD(v)

==极大连通子图和极小连通子图的区别？（包含的顶点是一样的，但是一个是边尽可能的多，一个是边尽可能的少）==



![image-20231105181734418](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231105181734418.png)

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231105155400660.png" alt="image-20231105155400660" style="zoom: 50%;" />

在无向图中，如果任意两个顶点是联通的，则称图为**连通图**，否则称为**非连通图**。

在有向图中，如果任意一对顶点都是强连通的，则称为**强连通图**。

![image-20231105155819102](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231105155819102.png)



![image-20231105174218720](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231105174218720.png)

==生成子图是尽可能多的顶点，连通分量是尽可能多的顶点和边==

==图中顶点数为n，则它的生成树含有n-1条边==

![image-20231105175555228](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231105175555228.png)



生成树与生成子图都是包含==全部的顶点==，但是生成子图可以不连通，生成树虽然要求边要尽可能的少，但是需要连通。

生成森林：原先这个无向图里有好几个极大连通子图，我们将几个子图抠出来，将不影响连通的边给去掉，就变成了**生成森林**

![image-20231105175844778](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231105175844778.png)

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231105181051963.png" alt="image-20231105181051963" style="zoom:67%;" />



![image-20231105182113292](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231105182113292.png)

#### 邻接矩阵

**数组实现的顺序存储，空间复杂度高，不适合存储稀疏图**



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109203646102.png" alt="image-20231109203646102" style="zoom: 80%;" />





![image-20231109205108224](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109205108224.png)



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109210328651.png" alt="image-20231109210328651" style="zoom:50%;" />

带权图中，表示两个顶点没有边，可以用无穷或者0来表示

**空间复杂度：**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109210514842.png" alt="image-20231109210514842" style="zoom:50%;" />

A^n 这里不好理解，**我录了视频，可以去看**

![image-20231109212221125](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109212221125.png)



#### 邻接表法 

顺序+链式存储



 ![image-20231109214717167](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109214717167.png)

**邻接表的表示方法并不唯一，因为A可以先指向C，也可以先指向B**  

**但是邻接矩阵的表示方法唯一（前提是确定编号）**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109215059124.png" alt="image-20231109215059124" style="zoom: 67%;" />

#### 十字链表法

  <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109215804958.png" alt="image-20231109215804958" style="zoom: 50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109215909290.png" alt="image-20231109215909290" style="zoom:67%;" />

#### 邻接多重表

存储无向图

  ![image-20231109220916882](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109220916882.png)

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109220937203.png" alt="image-20231109220937203" style="zoom:50%;" />



**比起邻接表，邻接多重表不需要存储两份边的数据，而且它删除边、节点的操作方便**

### 比较

![image-20231109221113090](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231109221113090.png)



### 思维导图

![image-20231112201824055](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112201824055.png)

### 图的遍历 

> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112150158682.png" alt="image-20231112150158682" style="zoom: 50%;" />
>
> 给你一个图片像这样，从2开始你将要怎样遍历完这一整个图呢？（BFS、DFS）
>
> 遍历的时候它的空间复杂度和时间复杂度分别取决于哪些方面呢？										队列的最大值	访问顶点和访问边
>
> BFS、DFS的数据结构用的是？
>
> 所以它的空间复杂度最高是多少呢？对于邻接矩阵和邻接表它们的时间复杂度又分别是?

#### BFS

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112145546242.png" alt="image-20231112145546242" style="zoom: 50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112152712526.png" alt="image-20231112152712526" style="zoom:67%;" />

提纲也是说不需要看代码只看逻辑

**逻辑**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112150158682.png" alt="image-20231112150158682" style="zoom:50%;" />

 

先将2进行访问（visit(2)），然后在visited数组中对2标成true

然后将2号入队，

*进入循环*

将2出队，

检测它的邻居，（可以在邻接矩阵中存储（序列唯一的），也可以在邻接表中存储（可变的））

也入队

**空间复杂度：**取决于队列的最高长度。最大O(V)

**时间复杂度：**（时间主要取决于访问各个顶点加上各个边的时间）

> ![image-20231112151245835](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112151245835.png)

==当图是用邻接矩阵存储时，得到的广度优先生成树是唯一的==

**广度优先生成树：**



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112151745326.png" alt="image-20231112151745326" style="zoom:50%;" />

这个红色边是指这些节点第1次被遍历的时候是由哪条边过去的？

可以看到有N减一条边。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112151838921.png" alt="image-20231112151838921" style="zoom:50%;" />



**广度优先生成森林：**

多个广度优先生成树组合在一起，可以变成广度优先生成森林。**但是要注意是非联通图**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112152323217.png" alt="image-20231112152323217" style="zoom:50%;" />

#### DFS（用到递归）

我们会感觉深度优先遍历它和树的后根遍历比较像，可能会觉得它肯定是一个死缠烂打的过程，

实际上它是和树的先根遍历过程比较相似。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112153205272.png" alt="image-20231112153205272" style="zoom:67%;" />

2 1 5 6 3 4 7 8

2 1 6 5 3 7 4 8

上面它分别是深度优先遍历序列和广度优先遍历序列。所以感觉到深度优先，它主要是会把一个人的子树先尽可能的往下挖，直到没有子树，然后会返回上一级节点，看看上一级节点还有没有剩余的子树，在剩余的子树中从小到大开始访问。

**空间复杂度：**由于用到递归，所以空间复杂度的最坏值，涉及到调用栈，所以深度是O(|V|)

**时间复杂度：**<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112153802972.png" alt="image-20231112153802972" style="zoom:50%;" />



:fish:请问从3号顶点出发，遍历序列是？

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112154135597.png" alt="image-20231112154135597" style="zoom:50%;" />



==对无向图进行BFS/DFS遍历。调用BFS/DFS函数的次数=连通分量数==

==对于连通图，只需调用一次BFS/DFS==



### 最小生成树（最小代价树）

生成树：连通图的生成树是包含全部顶点的极小连通子图

之前两节学习的是深度优先生成树和广度优先生成树。

![image-20231112160342410](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112160342410.png)



 ==只有连通图才有生成树，非连通图是生成森林==

#### Prim（普里姆）

从某一个顶点开始构建生成数，每次将代价最小的新顶点纳入生成数，直到所有顶点都纳入为止。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112164956247.png" alt="image-20231112164956247" style="zoom: 33%;" />

 **代码思想**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112170142159.png" alt="image-20231112170142159" style="zoom:50%;" />

**时间复杂度：**O(v^2)

一共有v-1轮，每一轮会进行2v个检查



#### Kryskal（克鲁斯卡尔）

每次选择一条权值最小的边，使这条边的两头连通（原本已经联通的就不选），直到所有节点都连通

**算法思想：**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112170849349.png" alt="image-20231112170849349" style="zoom:50%;" />

他是先排完序以后呢，我们会从第1行开始往下看，对于前几行来说，一般这两个点都是没有联通的，怎么检查是否联通呢？

> 这里需要用到并查集，就是检查他们是不是一个集合，如果他们不是一个集合也就是不连通，那么我们可以用放心大胆的用红线把这两个点连起来。

前三行都是如此，把这些点连接起来。

![image-20231112171200526](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112171200526.png)

对于第4行来说，v2和v3其实也确实不是一个集合的，所以我们可以进行联通.

在第5行的时候呢, V3和v5已经属于联通的一个过程，所以我们跳过这一行。

以此类推，联通的我们就跳过，不联通的就连起来。 

**共执行E轮，每次需要判断两个顶点是否同属于一个集合，需要O(log2E)

#### 比较

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112165422760.png" alt="image-20231112165422760" style="zoom:50%;" />

#### :fish_cake:考点：

* Prim和Kryskal构造的最小生成树可能相同，可能不同。但是当最小生成树只有一颗的时候，他们构造的最小生成树相同
* 只要无向图中没有权值相同的边，则最小生成树唯一
* 





:fishing_pole_and_fish:：**错误选项：**

* 从n个顶点的连通图中选取n-1条权值最小的边，即可构造最小生成树。
* 设连通图G含有n个顶点，则含有n个顶点、n-1条边的子图一定是G的生成树



####  :sushi:大题：

首先熟练掌握四种算法的推布

Prim Kryskal Dijkstra bfs

以及寻找关键路径

以及学会写出拓扑序列（我在CSDN收藏了一个文章讲的还可以）

以及有向无环图表达算式怎么构成一个最简便的生成树

其次容易遗漏的地方是找深度优先遍历序列，或者广度优先遍历序列（可以拿王道大题第一道练手）

**具体类型：**

1.写出邻接矩阵

![image-20231116111543672](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231116111543672.png)

> 注意邻接矩阵里面的边是直接连接的，比如1可以先到2再到7，那1，7之间还是判定没有路走



2.画出邻接表

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231116131819582.png" alt="image-20231116131819582" style="zoom:67%;" />

> 前面是节点，后面节点里有两个数字，一个是节点，一个是距离长



3.如何判定图中有几个强连通分量?

> 注意不是用眼睛去数，而是一个一个顶点推敲，
>
> 从某个只有出弧没有入弧的顶点开始，由于没有入弧，所以其他顶点到不了，该顶点判定为一个自身的强连通分量
>
> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231116111929391.png" alt="image-20231116111929391" style="zoom: 80%;" />



4.用Prim算法求最小生成树

> 注意不是直接求结果，而是要写出过程。
>
> 这里我没找到官方答案，我个人是认为可以一张一张图来画，最多可以在旁边这样标注一下<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231116112242913.png" alt="image-20231116112242913" style="zoom:67%;" />
>
> 这里我举一个Kryskal算法的过程例子
>
> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231116112322027.png" alt="image-20231116112322027" style="zoom:67%;" />



5.请用Dijkstra算法写题（给你一个图，用该算法求最短路径）

> 有两种表格画法，王道的较为简便，软件精的更为好理解，且数据更直观
>
> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231116115456576.png" alt="image-20231116115456576" style="zoom: 33%;" />
>
> 剩下的先不写了 已经确立过最短路径的 涂过颜色的 其实后面的轮数可以不用再写 可以从这个角度简化
>
> 第一列写次数，第二列集合，剩下的就是写d,p
>
> 然后路径不存在的，d写无穷符号，p写-1









### 最短路径

导入

（单独的一个源头）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112172415714.png" alt="image-20231112172415714" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112172501275.png" alt="image-20231112172501275" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112172513855.png" alt="image-20231112172513855" style="zoom:50%;" />







#### BFS（适用不带权图）

也可以说适用带权图，但是权值都是1的图

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112172633703.png" alt="image-20231112172633703" style="zoom:50%;" />



![image-20231112173104670](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112173104670.png)

思路我并没有去仔细看，但是大致的可以讲出来，首先我们有三个数组，一个是visited数组，用于记录是否访问，它也是我们去进行下一个数组的一个前提条件。这个紫色数组的第1行它是用于记录到原点的距离。第2行它是用于记录直接前驱是谁。

我们从2出发的话，我们先去让2出队。出队以后呢，我们找到2的邻接点是1。

1没有被访问，我们将1的距离改成1，将1的直接前驱写为2，并且将1访问。

做完之后将1出队到了6，我们判断6是否被访问，然后将6的距离改成0+1，将6的直接前驱改为2，再将它设为被访问，

再将6出队....

> 代码的第1部分用于将数组初始化，第2部分负责将顶点设为访问，将顶点入队，在循环里面只要队伍不空就一直进行第1步就是将点出队，出队的时候我们去寻找它的临界点，在这个for循环中，我们首先一定要注意判断他是否被访问，如果没有被访问，我们将它的紫色数组进行修改以及的数组进行修改，然后将它出队。



:facepunch:：接下来我们用紫色数组干什么呢？

可以直接看出最短路径长度

![image-20231112173745881](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112173745881.png)

==但其实求广度优先生成树的时候，每一个节点在第几层也直接的反映了它的距离，我觉得这样更方便。==

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112173824867.png" alt="image-20231112173824867" style="zoom:50%;" />







#### 迪杰斯特拉（Dijkstra）

带权路径长度：一条路径上，所有边的权值之和（简称为路径长度）

**算法思想：**他首先他要找的是你这个节点有没有被访问过，其实跟visited是差不多的。

第1步我们是要看，和起始顶点有谁相连，它的最短路径是多少，比如在这里面与v0相连的就是v1与v4。它的路径和路径上的前驱我们已经标注过，我们现在可以走的路是v1与v4，我们将两条路进行对比，我们选择了v4。

选择v4以后呢，我们就将v0与v4连接在一起，连接在一起以后，我们对于其他顶点的最短路径长度，路径前驱就需要进行变更，当然V4的visited数组也需要标成true。

将v0与v4连接在一起之后，我们修改过的地方如下图，也就是看v0到其他顶点的最短距离有何变化。

当我们将最短路径长度与路径前区进行修改以后，我们可以再看看与v4相连的有哪些点这些点，它要符合的要求，第一是没有被访问过，第2路径长度要最短。

![image-20231112175111716](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112175111716.png)

 ![image-20231112175349203](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112175349203.png)

**时间复杂度：**O(V^2)



**缺点：**

如果说图中有负权值的话，迪杰斯特拉算法可能会失效。



#### Floyd（弗洛伊德）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112181427202.png" alt="image-20231112181427202" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112193154949.png" alt="image-20231112193154949" style="zoom:50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112193601443.png" alt="image-20231112193601443" style="zoom:50%;" />

从不允许中转（-1），到允许v1作为中转点再到允许V2作为中转点。经过n轮递推。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231112194726997.png" alt="image-20231112194726997" style="zoom:50%;" />

这个图可以直观的看到两个点之间的最短距离以及中转点。 

**时间复杂度**：O(V^3)

**空间复杂度**：O(V^2)

这里的时间复杂度是由代码决定的，因为它进行了三重循环，第1层是因为需要考虑n个节点作为中转点，之所以是n，是因为每个节点都要考虑一次，这是第1层。    第2层和第3层分别是对于这个表格进行遍历，也就是v的三次方。

有连接矩阵决定的，所以是v的平方。





#### :fish_cake:考点：

* 最短路径一定是简单路径
* 定义：Dijkstra算法适合求解有回路的带权图最短路径；任意两个顶点最短路径；	不适合求解带有负权值的最短路径
* 深度优先遍历、拓扑排序、求关键路径可以判断出一个有向图是否有环	（求最短路径是判断不了是否有环）
  * 深度优先遍历它还有一个是可以检测是否有环的，这个我们知道。拓扑排序是因为如果你有回路，那么你也形成不了拓扑排序。求关键路径是因为它本身是没有检测有环的功能，但是求关键路径需要先求出拓扑排序，所以它也可以检测是否有环。

















StrAssign(&T,S);

StrCopy(&T,S);

简单分配

typedef struct{

elemtype data[MaxSize];

int length;

}SString;

typedef struct{

int length;

char* ch;

}

ch=(char*)malloc(sizeof(char));

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20230920205255387.png" alt="image-20230920205255387" style="zoom:33%;" />

```C++
int BF(SString S,SString T){
   int i=1,j=1;
    SString SS;
    while(i<=S.length&&j<=T.length){
        if(S.ch[i]==T.ch[j]){i++;j++;}
        else{j=1;i=i-j+2;}
    }
    if(j>T.length){return i-T.length;}
    return 0;
}
```



### 有向无环图（DAG）

若一个有向图中不存在环，则称为有向无环图。



题目特点：给你一串算术表达式，让你把它表述成以下这个样子。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115163101543.png" alt="image-20231115163101543" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231210204343467.png" alt="image-20231210204343467" style="zoom:43%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115163120588.png" alt="image-20231115163120588" style="zoom:50%;" />



具体怎么画成这样子呢？根据我们的步骤来。

1.把各个运算符排成一排

> 比如说你这里面的运算符只有abcde，你就把它画在最下面画一排，因为我们这几个字母在最简的情况下，是不会重复的。

2.标算式中的顺序（有括号的一定要先标注括号）

3.开始做图，注意分层

> 注意分层是指，比如a*(b+c)	，这个乘号是用b+c的结果得到的，所以这个乘号的层数一定在+号的层数之上



4.检查同一层的运算符是否可以合体 



### 拓扑排序

**时间复杂度：**O(E+V)或者O(V^2)

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115164113133.png" alt="image-20231115164113133" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115165117371.png" alt="image-20231115165117371" style="zoom:50%;" />

==拓扑排序：找到做事的先后顺序==

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115164247369.png" alt="image-20231115164247369" style="zoom:50%;" />

​    

每个AOV网都有一个或多个拓扑排序序列 

**代码思路：**

虽然不考简单说说，

基于邻接表实现



**逆拓扑排序：**



先选择出度为0的点

![image-20231115164950542](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115164950542.png)





### 关键路径

> AOE网是什么意思呢？
>
> 关键路径是什么意思呢？
> 给你一条线路，怎样找到关键路径呢？

==入度选最大（边），出度选最小（边）==

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115165219653.png" alt="image-20231115165219653" style="zoom:50%;" />

事件的发生是一瞬间的，而顶点的持续还需要一定的时间发生。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115165316688.png" alt="image-20231115165316688" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115165428139.png" alt="image-20231115165428139" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115165459944.png" alt="image-20231115165459944" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115165639387.png" alt="image-20231115165639387" style="zoom:50%;" />



==事件Vk的最早发生时间ve(k)——决定了所有从Vk开始的活动能够最早开工的时间==

==活动ai的最早发生时间e(i)——指该活动弧的起点所表示的事件的最早发生时间==

 

==事件Vk的最迟发生时间vl(k)——是指在不推迟整个工程的前提下，该事件最迟发生的时间==

==活动ai的最迟开始时间l(i)——是指在活动弧的终点所表示的最迟发生时间与该活动所需时间之差==

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115170439587.png" alt="image-20231115170439587" style="zoom:50%;" />



活动ai的时间余量d(i) = l(i) - e(i)，表示在不增加完成整个工程所需总时间的情况下，活动ai可以拖延的时间

若一个活动的时间余量为0，则说明该活动必须要如期完成，

==d(i)=0即l(i)=e(i)的活动ai是关键活动==



:tropical_fish:：举例

现在给你这样一个图，求关键路径

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115171223282.png" alt="image-20231115171223282" style="zoom:50%;" />

* 1️⃣拓扑排序一串字母，写出事件最早发生时间，举例(ve(4)=6)

​		> 注意，你不是在求最短路径，比如到V4最短是5，但是ve(4)不是5，这是因为v4必须要等到最慢的事情都干完了，它才能开始。v6同理

​		> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115182240601.png" alt="image-20231115182240601" style="zoom: 50%;" />

* 2️⃣求事件最迟发生时间：需要用到逆拓扑序列

​		> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115183147606.png" alt="image-20231115183147606" style="zoom:50%;" />

> 事件最迟发生时间是用最后一个事件发生的最迟时间，比如在这里是v6，它发生最迟时间是8然后一步一步往上减，比如v4它就是8减2。
>
> 但是对于v2来说。就不可以从v4直接减2了，因为v2指向了两个方向，你要逐一比较看看哪个方向的时间最长，再选择从v5可以到v2是7减3，从v4可以到v2。是6减2。





* 3️⃣求所有活动的最早发生时间e( )

> 只要找到弧尾就好了

* 4️⃣求所有活动的最迟发生时间l( )

> 用弧头所指节点的最晚发生时间减去线段权值

* 5️⃣寻找关键路径（d(k)=0）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115184805173.png" alt="image-20231115184805173" style="zoom:50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231115184852327.png" alt="image-20231115184852327" style="zoom:50%;" />

那怎么加快工期？

加快那些包括在所有关键路径上的关键活动才能缩短工期







#### :fish_cake:考点：

* 在拓扑排序的算法中暂存入度为0的顶点，可以使用栈，也可以使用队列
* 邻接矩阵是三角形的，必然不形成回路，必然可以构成拓扑排序
* 拓扑序列唯一，可不意味着图形是唯一的，不能唯一确定该图
* 带权图G的最小生成树中，某条边的权值可能会超过未选边的权值
* ⭐在AOE图中，关键路径上的活动的时间延长多少，整个工程的时间也随之延长多少
* ⭐缩短所有关键路径上共有的任意一个关键活动的持续时间可以缩短关键路径长度（注意是所有路共有的哦）
* 用DFS遍历一个无环有向图，并在算法退栈时打印相应的顶点，则输出的顶点序列是**逆拓扑有序**
* 时间余量是指l(i)-e(i)       （是活动相减而不是事件）





## 查找

### 基本概念

定义：在数据集合中 寻找满足某种条件的数据元素 的 过程称为查找

关键字：用于唯一标识某个数据元素（不能重复，比如姓名就会重复）



分类：

* 静态查找表（只需要查找）
* 动态查找表（不仅要查找，还要进行插入删除）



评价算法：

* 查找长度：查找运算中，需要对比关键字的次数
* 平均差找长度：（ASL）所有查找过程中进行关键字的比较次数的平均值

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121110137527.png" alt="image-20231121110137527" style="zoom:50%;" />

> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121110229254.png" alt="image-20231121110229254" style="zoom: 40%;" />
>
> 

### 顺序查找

>顺序查找是什么意思？具体是说怎样查找？
>算法实现的动态数组是怎么定义的？
>哨兵是怎样的一种存储方式？怎样比较的？
>
>成功的时间复杂度是怎么算的？单位级呢？
>失败的时间复杂度呢？
>
>一个成功结点的查找长度是？
>失败结点的查找长度是？

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121134517935.png" alt="image-20231121134517935" style="zoom: 50%;" />

算法思想：从头到脚挨个找（线性表）

算法实现：

```C++
//动态数组
typedef struct{
    elemtype *elem;
    int len;
}SSTable;	//sorted string table 有序字符串表

int Search_SSTable(int key,SSTable ST){
    int i;
    for(i=0;i<ST.len&&ST.elem[i]!=key;i++)
    return i==ST.len?-1:i;
}
```

![image-20231121133131171](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121133131171.png)



  <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121133726745.png" alt="image-20231121133726745" style="zoom: 67%;" />



#### 优化1（若元素有序）

 <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121133917768.png" alt="image-20231121133917768" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121133947938.png" alt="image-20231121133947938" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121134144050.png" alt="image-20231121134144050" style="zoom: 50%;" />

#### 优化2（若概率不同）

不过以下这种优化只对ASL成功有帮助，对于ASL失败没有帮助

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121134357014.png" alt="image-20231121134357014" style="zoom:50%;" />







### 折半查找

> 折半查找是基于什么数组呢？
>
> 它的算法思想是？
>
> 折半查找英文名称是？
>
> 查找效率是？

![image-20231121143014498](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121143014498.png)

又称为二分查找，==仅适用于有序的顺序表==（顺序表可以随机存取）



查找失败：low>high

```C++
typedef struct{
    Elemtype *elem;
    int len;
}SSTable;

int Search_Binary(SSTable ST,int key){
    int low=0,high=ST.len-1;
    
    while(low<=high){	//注意这里是小于等于，记得加等于号！
        int mid=(low+high)/2;
        if(key<ST[mid])high=mid-1;
        else if(key>ST[mid])low=mid+1;
        else return mid;
    }
    return -1;
}
```



  **查找效率：**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121141922152.png" alt="image-20231121141922152" style="zoom:67%;" />





#### 判定树

**折半查找判定树的构造：**

首先对于右子树的节点数，肯定比同一层左子树节点数大1或者相等。

（多出来的一定是右子树上的节点）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121142255339.png" alt="image-20231121142255339" style="zoom: 33%;" /><img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121142317944.png" alt="image-20231121142317944" style="zoom:33%;" />





<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121142350565.png" alt="image-20231121142350565" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121142531200.png" alt="image-20231121142531200" style="zoom:50%;" />

 <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121142627875.png" alt="image-20231121142627875" style="zoom: 50%;" /><img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121142859240.png" alt="image-20231121142859240" style="zoom:50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121142952006.png" alt="image-20231121142952006" style="zoom:67%;" />







<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121143106498.png" alt="image-20231121143106498" style="zoom:40%;" />



==注：如果mid改为向上取整，则判定树的左子树比右子树多一个元素或者相等==

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121144402972.png" alt="image-20231121144402972" style="zoom:33%;" />

这只是编号，而不是关键字的值。



### 分块查找

![image-20231121151451651](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121151451651.png)

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121145452866.png" alt="image-20231121145452866" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121145807701.png" alt="image-20231121145807701" style="zoom:50%;" />



> 折半查找注释：
>
> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121145951468.png" alt="image-20231121145951468" style="zoom: 40%;" />
>
> low>high时，要在low的所指分块中查找 



**ASL分析：**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121150408785.png" alt="image-20231121150408785" style="zoom:50%;" />

> 27是因为27最开始是小于mid，所以high指向20，low指向10
>
> mid==10,对比第二次，27>10，low指向20，
>
> mid==20,第三次对比，27>20，low指向30，high指向20
>
> 所以总共是四次



:fallen_leaf::查找成功已经比较难算，因为每一个元素都要算一下次数，然后乘上概率，所以查找成功一般是不考的。

相比之下查找失败就更不会考了，而且底下的顺序还是乱序的。



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121151150189.png" alt="image-20231121151150189" style="zoom:60%;" /><img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121151223483.png" alt="image-20231121151223483" style="zoom:33%;" />

> 把红色的字体代入ASL，就得到s=根号n

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121151431928.png" alt="image-20231121151431928" style="zoom:50%;" />











### 二叉排序树（BST）

Binary Sort Tree

![image-20231121183651843](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121183651843.png)

也叫二叉查找树，左子树结点值<根节点值<右子树节点值

```C++
typedef struct BSTNode{
    int data;
    struct BSTNode *lchild,*rchild;
}BSTNode,*BSTree;
```

在二叉排序树中查找值为key的结点

```C++
BSTNode Rearch_BSTNode(BSTree T,int key){
    BSTree *p=T;
    while(p){
        if(key>p->data)p=p->rchild;
        if(key<p->data)p=p->lchild;
        if(key==p->data)return p;
    }
    return p;
}

//递归
BSTNode *BSTSearch(BSTree T,int key){
    if(T==NULL)return NULL;	//查找失败
    if(key--T->key)return T; //查找成功
    else if(key<T->data)return BSTSearch(T->rchild,key);
    else return BSTSearch(T->lchild,key);
    
}
```

**复杂度：**

**时间复杂度：**O（n）

**空间复杂度：**O（1）（非递归）

​					   O（n）（递归）  

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121182844103.png" alt="image-20231121182844103" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121183050650.png" alt="image-20231121183050650" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121183130189.png" alt="image-20231121183130189" style="zoom:50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121183256644.png" alt="image-20231121183256644" style="zoom:50%;" />



**查找效率：**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121183427553.png" alt="image-20231121183427553" style="zoom: 50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121183521331.png" alt="image-20231121183521331" style="zoom:50%;" />







### 平衡二叉树（AVL）

balanced binary tree

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121184050104.png" alt="image-20231121184050104" style="zoom: 50%;" /><img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121184617762.png" alt="image-20231121184617762" style="zoom:50%;" />

 **调整不平衡：**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121184809427.png" alt="image-20231121184809427" style="zoom:50%;" />

只要将最小不平衡子树调整平衡，则其他祖先结点都会恢复平衡

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121184925441.png" alt="image-20231121184925441" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20220917152052638.png" alt="image-20220917152052638" style="zoom:50%;" />

---

**LL&RR**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121190528969.png" alt="image-20231121190528969" style="zoom:67%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121193846870.png" alt="image-20231121193846870" style="zoom:50%;" />





 **练习：**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121193731553.png" alt="image-20231121193731553" style="zoom:50%;" />

我把旋转对象搞错了，应该是新加入结点的爸爸的爸爸

无论是LL RR RL LR都是如此

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121194316607.png" alt="image-20231121194316607" style="zoom: 50%;" />

 <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121194442491.png" alt="image-20231121194442491" style="zoom: 50%;" />



**查找效率：**

 ![image-20231121195344534](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121195344534.png)

即n=2时，它的高度最高是2

h(max)=O(log2n)

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231121195724408.png" alt="image-20231121195724408" style="zoom:50%;" />

  





<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122095521886.png" alt="image-20231122095521886" style="zoom: 50%;" />



### B树（多路平衡查找树 ）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122100240897.png" alt="image-20231122100240897" style="zoom:50%;" />  



为了保证效率不太低，所以我们制定了以下标准

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122104915721.png" alt="image-20231122104915721" style="zoom:50%;" />

​                            <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122105437159.png" alt="image-20231122105437159" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122105748087.png" alt="image-20231122105748087" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122110042866.png" alt="image-20231122110042866" style="zoom:50%;" />

 

==B树的高度不含叶子结点==

---

含有n个关键字的m阶B树，最小高度，最大高度是多少？

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122110428698.png" alt="image-20231122110428698" style="zoom:50%;" />

> m-1是关键字

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122112933442.png" alt="image-20231122112933442" style="zoom:50%;" />

> 最大高度的另一种做法（关键字的个数）
>
> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122113042500.png" alt="image-20231122113042500" style="zoom:50%;" />

#### 插入删除

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020114430749.png" alt="image-20221020114430749" style="zoom:50%;" />

**插入**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122114314727.png" alt="image-20231122114314727" style="zoom:50%;" />

 新元素一定是插入最底层的终端结点，用查找确定插入位置

 <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122114658567.png" alt="image-20231122114658567" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122114726415.png" alt="image-20231122114726415" style="zoom:50%;" />





:dancer:检查：

1.检查是否满足左边小于右边

2.检查关键字的个数是否满足最小值



**新元素一定是插入到最底层的终端节点，用查找来寻找插入位置**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020195049416.png" alt="image-20221020195049416" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020195150043.png" alt="image-20221020195150043" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020195343311.png" alt="image-20221020195343311" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020195418002.png" alt="image-20221020195418002" style="zoom:50%;" />



---

**删除 **

**删除或增加节点时都要康康是否要超过界限**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020195700538.png" alt="image-20221020195700538" style="zoom:70%;" />                              解释一下**兄弟够借**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020201239555.png" alt="image-20221020201239555" style="zoom:50%;" />

删除38后低于下限

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020201328562.png" alt="image-20221020201328562" style="zoom:50%;" />

如果直接这样借元素 不满足大小关系

调整一下父子关系后是这样的

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020201414811.png" alt="image-20221020201414811" style="zoom:50%;" />

==**右兄弟宽裕，用当前节点的后继、后继的后继来填补空缺**==

<hr>


再举例

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020201700258.png" alt="image-20221020201700258" style="zoom:50%;" />

（左兄弟）比如90的前驱是88，88的前驱是87

==**左兄弟宽裕，用当前结点的前驱、前驱的前驱来填补空缺**==

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020202037404.png" alt="image-20221020202037404" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020202142682.png" alt="image-20221020202142682" style="zoom:50%;" />

<hr>

**兄弟不够借**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020202744329.png" alt="image-20221020202744329" style="zoom:50%;" />

==此二节点进行合体合并==

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020202938279.png" alt="image-20221020202938279" style="zoom: 33%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020203028570.png" alt="image-20221020203028570" style="zoom:55%;" />

再往上由不平衡了

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020212202346.png" alt="image-20221020212202346" style="zoom: 33%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221020212257006.png" alt="image-20221020212257006" style="zoom: 33%;" />

把82拿下来 然后

兄弟不够借——不仅需要合并兄弟节点 还要合并双亲节点

![image-20231122120532705](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122120532705.png)





### B+树

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221023110032472.png" alt="image-20221023110032472" style="zoom:50%;" />

B+树源于分块查找

以及我们尽可能地保证树越低越好 这样查找效率高

以及B+树非叶节点中出现的数字都可以在叶节点中找到

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221023111334254.png" alt="image-20221023111334254" style="zoom: 50%;" /><img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221023111406223.png" alt="image-20221023111406223" style="zoom:50%;" />



> **非叶根节点是什么？**
>
> 是根节点 但不是叶子节点（整个树不是只有根节点这一个节点）
>
> 即整个树不是只有一个节点，如果只有一个节点，那么那个节点既充当根节点，又充当叶节点
>

![image-20231122121031083](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122121031083.png)

#### 与B树区别：

> 1.结点的分支个数与关键字个数相等（B树是分支=关键字+1）

> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231122152711359.png" alt="image-20231122152711359" style="zoom:43%;" />

> 2.叶结点包含指针，指向相应记录。
>
> >  注：这里的叶结点比如47，48，50，56是一个整体，而不是说每个关键字是一个叶结点
>
> 3.B树找到非最后一层时，看见了相同的数字，也可以确定B树存在。但是B+树一定要找到最后一层，找到对应的记录
>
> > 这是因为B树的每个非叶结点不仅有指针，而且有记录，而B+树的非叶节点只包含指针，具体的记录要找到叶结点
>
> 4.B树是不重复的，B+的叶子结点会把上面的结点再重复一遍



#### 查找过程 

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221115164507415.png" alt="image-20221115164507415" style="zoom: 67%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221023111024824.png" alt="image-20221023111024824" style="zoom:50%;" />

先从15，56找，9<15，

向下找，3<9，指针后移（9），还要向下找。

找6->8->9，找9->记录。

如果要找7，找到6<7，指针后移，8>7，查找失败。

#### 补充：磁盘

B+树比B树更适合做磁盘存储。

假设每个节点都是磁盘，你去查找9就是一层一层磁盘向后查。

B+树是最后一层的磁盘上才存储数据，之前的节点只存储索引。

而B树是每一层磁盘都有索引和数据 ，比B+树多存储了数据，自然多占用一些空间

可以看王道第十六道选择 我们更重视B+树的**关系数据库系统中的索引**这个应用。MySQL



### 散列表（上）(Hash Table)

散列表：又叫哈希表。是一种数据结构，特点是：数据结构的关键字与存储地址直接相关。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024104304932.png" alt="image-20221024104304932" style="zoom:50%;" />

**冲突**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024104339548.png" alt="image-20221024104339548" style="zoom:50%;" />

<hr>


处理冲突的方法：

#### 拉链法（链表）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024104446420.png" alt="image-20221024104446420" style="zoom:50%;" />

查找操作：

比如查找27

1️⃣：27%13=1 

2️⃣：去数组1的位置进行对比，和14，1，27对比，找到✔

*<u>**查找长度：3**</u>*

如果查找21，21%13=8，8里没有，查找长度为0

*<u>查找长度：查找过程中，需要对比关键字的次数</u>*



#### 成功/失败查找长度

横着看

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024105043908.png" alt="image-20221024105043908" style="zoom:50%;" />

一共12个元素，查找一次的（第一层）有6个，其次第二层，其次第三层



竖着看

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024105136779.png" alt="image-20221024105136779" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024105351069.png" alt="image-20221024105351069" style="zoom:50%;" />

数组一共13个框，所以除以13

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024105459381.png" alt="image-20221024105459381" style="zoom:50%;" />

**效率**

查找2次以上的，比如1 27 79 55...就是冲突，<u>冲突越多，查找效率越低</u>

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024105314079.png" alt="image-20221024105314079" style="zoom:50%;" />

#### 各式样的散列函数

> 设计目标：让不同关键字的冲突尽可能地小

**除留余数法**

p是不大于(散列表表长)m的最大质数（p可以等于m）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024110012705.png" alt="image-20221024110012705" style="zoom:50%;" />

适用情况：大部分情况，比如特征明显的数（偶数啦，奇数啦）用质数这个方法可以消磨掉数字的特征，从而更均匀分散的排列在表中（这样查找次数就会短）

不适用情况：123456这样连续排列的自然数

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024110241341.png" alt="image-20221024110241341" style="zoom:50%;" />





**直接定址法**

直接用关键字作为地址，或者给关键字进行一些线性处理后成为地址。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024110426996.png" alt="image-20221024110426996" style="zoom:50%;" />

适合情况：关键字的分布基本连续

（若关键字不连续，空位会很多，浪费）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024110718900.png" alt="image-20221024110718900" style="zoom:50%;" />



**数字分析法**

（手动）选取数码分布较为均匀的若干位作为散列地址

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024110902254.png" alt="image-20221024110902254" style="zoom:50%;" />

比如手机号前三位是随机分布的，后四位有规律的、均匀分布，我们选取**均匀分布**的若干位作为散列地址。

均匀是指重复的情况没有特别的多，基本是从1-9999每个都有，没有哪个数字区间为空白，平行摊开

手机后四位四位数，所以我们创建一个0000~9999的数组

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024111041723.png" alt="image-20221024111041723" style="zoom: 33%;" />



**平方取中法**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024111130453.png" alt="image-20221024111130453" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024111224937.png" alt="image-20221024111224937" style="zoom: 50%;" />

比如对于右边的一列，我们选取16，32，90比较有代表性的特征来代替数字（你可能理解不了代表性）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024111411125.png" alt="image-20221024111411125" style="zoom:33%;" />

可以看这个乘法浅浅get一下 虽然我也理解不了，但你只要知道我们选取的是有代表性的数字即可

举例：

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024111529808.png" alt="image-20221024111529808" style="zoom: 50%;" />

比如身份证号分布恨不均匀，我们取身份证号中间的五位数作为代表

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024111643181.png" alt="image-20221024111643181" style="zoom:50%;" />

下面的是用整个身份证号 直接定址存储信息

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024111712317.png" alt="image-20221024111712317" style="zoom:50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024111801846.png" alt="image-20221024111801846" style="zoom:50%;" />

### 散列表（下）（图）

ASL成功失败要会算

由散列函数决定的地址叫散列地址。

![image-20221024163315194](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024163315194.png)

首先强调一下概念：

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024113001299.png" alt="image-20221024113001299" style="zoom: 50%;" />



#### **开放定址法**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024113052719.png" alt="image-20221024113052719" style="zoom: 50%;" />

通俗解释：就是比如数组3这个位置没有东西，它既可以存放7%4=3，存放正儿八经映射过来的7，也可以存放隔壁因为冲突一个格子放不下的数字（但是一个格子只会存放一个东西）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024113304790.png" alt="image-20221024113304790" style="zoom: 50%;" />

三个红色箭头指向的是增量的设计

**线性探测法**

 

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024113608849.png" alt="image-20221024113608849" style="zoom: 50%;" />

d0=0,d1=1,d2=2.....

你现在要插入一个元素1

首先H(key)指的是你用散列函数定出来的地址，很显然这里用的是那个质数法则，用散列函数定出来本应该存放在位置1（但是你也可以用开放定址法来算，H0指的是数据元素最开始选位置还没进放的时候。H0=（1+0）%16=1）可以发现**H0=H（key）**这是一个小规律

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024114217564.png" alt="image-20221024114217564" style="zoom: 33%;" />

你把数据元素1放到了数字1上

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024114248154.png" alt="image-20221024114248154" style="zoom: 50%;" />

再举例：

https://www.bilibili.com/video/BV1b7411N798?p=76&spm_id_from=pageDriver&vd_source=e771ecf34dd26728a54b6a4e17897770

3：50

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024114439100.png" alt="image-20221024114439100" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024114644879.png" alt="image-20221024114644879" style="zoom:50%;" />

因为H(key)涉及到质数13，所以最多也就到数组12了

但是Hi会更久，涉及到真正的数组长度的边界

---

**查找**

比如你要查找27，27%13=1，但是数组1没有27，于是H1=2，H2=3，H3=4...一步步往后找

<u>查找长度为4</u>



查一下11，11%13=11，直接找到

<u>查找长度为1</u>

**注意：假如你直接存到了一个空位置，空位置我们这里也算一次比较次数，但是在H(key)里我们没有算**

*`查找长度是Hi+1`*

> 对了，如果你查到完表格也没有查到的话，查找次数也是Hi+1，因为查找空表格也算一次查找次数
>
> 但是在拉链法里空指针的判断不算一次比较次数哦

> 可以这么理解，在空表格里有些垃圾数据还要比较一下，或者完全为空的数字也是数字，也要比较一下，但是空指针是指针，指针不是数字

<u>*越早遇到空位置，可以越早确定失败，是好处*</u>

但是有时候删除这个节点，节点也是空的，怎么区分是中途只是一个被删除的节点和到了结尾的节点呢？

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024115938654.png" alt="image-20221024115938654" style="zoom:50%;" />



开放法的弊端：

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024120106212.png" alt="image-20221024120106212" style="zoom:50%;" />

假设可达鸭是我们删除时做的标记，那这个表实际上很空，很浪费

还有一个弊端

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024120730114.png" alt="image-20221024120730114" style="zoom:50%;" />

#### 成功/失败查找长度

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024120310388.png" alt="image-20221024120310388" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024120256999.png" alt="image-20221024120256999" style="zoom:40%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024120423780.png" alt="image-20221024120423780" style="zoom:50%;" />

你可以看到数组0的位置是空，那不是我们特意空的，而是没有整除13的数

所以在这个表格中，

如果你能整除13，而0这个框又是空的，所以你查一次就知道有没有查找失败

对于1这个框，你需要查1，然后查2，查13次才知道有没有失败（包括结尾空白的框框也算一次）





**平方探测法(4j+3)**

首先看看使用方法

H（key）= 6

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024160623608.png" alt="image-20221024160623608" style="zoom:50%;" />

使用上和之前别无二致，只是在代公式的时候，di要代入的是下面给的那些值

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024161255092.png" alt="image-20221024161255092" style="zoom: 50%;" />

最后一个84   (6-9)%27=-3，是指0再往后3个，即24（可以把整个数组理解为一根带子 可以首尾相接 带点循环的意思

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024161616650.png" alt="image-20221024161616650" style="zoom:50%;" />

比如长度为7的表可以，但长度为8的不可以

对了 ，讲个东西吧，我会放在10.24的日记中讲 关于快速理解di平方算法计算后的位置

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024162544473.png" alt="image-20221024162544473" style="zoom:33%;" />

比如你看到这里是个表长为8的东西，你并不能遍历所有的格子



**伪随机序列法**

即di是有点随机的。



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024162757270.png" alt="image-20221024162757270" style="zoom:50%;" />

**再散列法：**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221024163036048.png" alt="image-20221024163036048" style="zoom:50%;" />

不用理解王道书上的写法



## 排序



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026142657187.png" alt="image-20221026142657187" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026142720601.png" alt="image-20221026142720601" style="zoom:50%;" />

比如你对稳定没要求或者你所有的元素都不一样，那肯定没有稳定不稳定的问题了，

可以选择不稳定的

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026142843656.png" alt="image-20221026142843656" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026142939602.png" alt="image-20221026142939602" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026143053575.png" alt="image-20221026143053575" style="zoom:50%;" />

### 1插入排序

#### 1.1直接插入排序

 <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221108224557943.png" alt="image-20221108224557943" style="zoom: 50%;" />

---

https://www.bilibili.com/video/BV1b7411N798?p=78&spm_id_from=pageDriver&vd_source=e771ecf34dd26728a54b6a4e17897770 

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231201072104284.png" alt="image-20231201072104284" style="zoom:50%;" />

//直接插入排序

```C++
//代码要点 for if for 三层嵌套
void InsertSort(int A[].int n){	//注意看看怎么表示数组
    int i,j,temp;
    //最开始默认当前有序表的第0个元素成为一个已经排序好的有序的子数组 
    for(i=1;i<n;i++)
        if(A[i]<A[i-1]){
            temp=A[i];
            for(j=i-1;j>=0&&A[j]>temp;--j)//检查所有前面排好序的元素
                A[j+1]=A[j];//⭐//j位置的数据放到j+1去，所有大于temp的都要向后移位
            A[j+1]=temp;//temp里的元素放到插入位置
            //最后一句话注意两个点，在38，49这个例子里出循环的时候j<0的，故放到j+1，也就是0的位置
            //以及我们出了带j的for循环还能用j说明其不是局部变量
        }
}  
```

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231201072104284.png" alt="image-20231201072104284" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026144748487.png" alt="image-20221026144748487" style="zoom:50%;" />

空间复杂度时间复杂度 用哨兵法和我们原本的方法在 数量级上是没有差异的 但是具体的数字有点差异 我用原本的算法来算。

**注意咯，时间复杂度我们是根据比较次数来看的**

**最坏情况**

空间复杂度：O（1）	//只需要i,j,temp

时间复杂度： //原本就是逆序 	O(n平方)

>   80 70 60 50 40 30 20 10 
>
>   第一趟对比1次，移动2次（80向后 70向前）
>
>   70 80 60 50 40 30 20 10
>
>   第二趟对比2次（60<80,60<70），移动3次（80 70向后，60向前）
>
>   第n趟对比n次，移动元素n+1次

总的关键字对比次数是1+2+..+n 达到了O(n平方)量级

**最好情况**

每个元素都有序 但是你肯定不知道有序啊，所以该比较还是要比较的

那每一趟只要对比一次元素，对比n-1次 <u>O(n)</u>



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026145035011.png" alt="image-20221026145035011" style="zoom:50%;" />

​	平均的是用最好+最坏的和除以二

#### 1.2折半插入排序

代码要熟练。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026162900668.png" alt="image-20221026162900668" style="zoom:50%;" />

折半插入里面比较次数下降了，但是元素的移动次数是不变的，所以时间复杂度还是On2

我感觉时间复杂度有时候是看移动次数，有时候是看关键字对比次数，他应该会选择二者中最高的。

<hr>


比如55要往前找插入的位置，以前我们是一个个找的

但是前面的元素已经有序了啊，所以折半着向前面找

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026161132896.png" alt="image-20221026161132896" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026161204837.png" alt="image-20221026161204837" style="zoom:50%;" />

low=mid+1;

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026161220684.png" alt="image-20221026161220684" style="zoom:50%;" />

high=mid-1；low high mid此时都指向60，60>55，所以high=mid-1； 

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026161239994.png" alt="image-20221026161239994" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026161254566.png" alt="image-20221026161254566" style="zoom:50%;" />

再举个栗子

此时我们的点60是和mid中的值是一样的 此时你不能说直接把60就插在你发现的这个60后面

因为假如原式是有好几个60的，那你直接插入在第二个60的位置上，不符合我们之前所说的稳定性

所以你要继续向后检查 检查到第一个不是60的数字

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026161848324.png" alt="image-20221026161848324" style="zoom:50%;" />

由于60=60，让60继续low=mid+1,此时mid指向70，70>60，high=mid-1，

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026161908359.png" alt="image-20221026161908359" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026161919798.png" alt="image-20221026161919798" style="zoom:50%;" />

再举个栗子

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026162443019.png" alt="image-20221026162443019" style="zoom:50%;" />

此时low>high，但是由于low>i-1，所以并不需要移动元素

```C++
void InsertSort(int A[],int n,){ //我不喜欢用哨兵 所以没用
    //在和谁比对上，一种是在参数里面插入key来和key进行比较，这是只进行一次比较，如果说你是想拿一串长长的序列一段乱序，你不想就是只把一个数字整理好，而想把整个都整理好的话，那么你就用接下来的方法。
    //阐释一下思路 首先我们正常的low high比对 比最初low大于high就可以跳出循环，嗯，如果说我们不考虑稳定性的话，就把[low,n-1]这个范围全部向后移一位，然后把我们要比的那个数字放在high的后一位。
    //考虑稳定性的话，你可以放在了hi比较的函数里面，但是会有点混乱，还是拿出来比较好。也就是在判断出low，大于high，跳出while循环的时候。
    int i,j,temp,low,high,mid;
    for(i;i<=n-1;i++){//这个循环我忘加了，加上这个循环，你可以确保你一直自给自足。
        i=0,j=n-1;
        low=i,high=n-1;
        temp=A[++i];//虽然说数组是从0开始的，但是0数字位没法0数字位比较，只能是第1个数字和第0个数字比较
        while(low<=high){
            mid=(low+high)/2;
            if(temp<A[mid])high=mid-1;
            else{low=mid+1};
        }  
        for(int j=i-1;j>high;j--){//这个不是j不是n-1，而是j=i-1；你并不需要把你后面的数字全部向后移一位。假设你现在嗯，是要把第3个数字插入到第2个数字当中，由于你第3个数字已经拿出来了，所以你的表中数组中它是会空出一位的，所以你只要把第2位向后挪就行了。
            A[j+1]=A[j];
        }
        A[high+1]=temp;
	}
}
//这里面需要注意两个地方，第1个地方是low high它相当于I和J，千万不要把它当成了关键字的值，这个是非常容易搞混的，你就始终铭记low high是I和J。
//其次的话你不用过分考虑稳定性那个东西我已经帮你调查好了，嗯我们这里面看似没有包含稳定性，但是稳定性他放进来的时候也是非常合适的，不会有任何不合适的，你只需要放心大胆的让low大于high的时候跳出while循环。以及让A[low,i-1]这个范围向后挪就可以。最后我们可以把数字插在A[high+1]
//最后强调 我们是[low,i-1]的元素全部向后移，而不是[low,n-1]

void Sort_Insert(int A[],int n){
    int low,high,temp;
    for(int i=1;i<n;i++){
        low=0,high=i-1;
        temp=A[i];
        while(low<=high){
            mid=(low+high)/2;
        	if(A[mid]>A[i])high=mid-1;
       	 	else{low=mid+1;}
        }    
            
        for(int j=i-1;j>=low;j--){
        	A[j+1]=A[j];
    	}
            A[low]=temp;
        }    
    }
    
}
```





**复杂度**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026162749719.png" alt="image-20221026162749719" style="zoom:50%;" />

补充：

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221026162841141.png" alt="image-20221026162841141" style="zoom:50%;" />



#### 1.3希尔排序 

![image-20221108224811695](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221108224811695.png)

注意它只能适用于顺序表。时间复杂度最好的是O1.5，最坏的是On2 

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231201093537216.png" alt="image-20231201093537216" style="zoom:50%;" />

**注：这个表从数组下标1开始排列**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231201093743317.png" alt="image-20231201093743317" style="zoom:50%;" />这样分好以后，对各个表分别进行比较，比如这里38大于13，对他俩进行交换

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231201094124662.png" alt="image-20231201094124662" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231201094719392.png" alt="image-20231201094719392" style="zoom:50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231201094622307.png" alt="image-20231201094622307" style="zoom:50%;" />

**代码实现** 有点复杂，不懂的可以看动画

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231201100043901.png" alt="image-20231201100043901" style="zoom:50%;" />

```C++
//算法实现(蛮难写的哈哈)
//这个是两个两个比较，比如 现在的d里是38 27 13
//在i里的比较是38和27比，27小，把27放入A[0]
//然后j指向38，比较后38确实大于27，把38向后移，j再减d就小于0啦，退出
//然后把A[0]也就是27放到A[j+d]，（刚才j-d<1退出去了，现在再加d，相当于指向数组里原先38的位置）
//把27放到原先38的位置上
27 38 13
//然后i++，我们到了下一个数组中啦，那我们搞完以后接着i++，又回来了
//现在i指向13，发现<27，存入A[0]
//j指向38，发现确实大于13，向后挪，再j=j-d，指向27，发现确实也大于13,向后挪,然后再指就小于1了，退出
//再把A[j+d]=A[0]，13放到原先38的位置
13 27 38
    
void Shell_Sort(int A[],int n){
    int i,j,d;
    for(int d=n/2;d>=1;d/=2){
        for(int i=1+d;i<=n;i++){
            if(A[i-d]>A[i])A[0]=A[i];
            for(j=i-d;j>=1&&A[j]>A[0];j=j-d){A[j+d]=A[j];}
            A[j+d]=A[0];
        }
    }
}
```

```c++
//现在我们去实现一个不要两两比较不停切换数组的方式
void Shell_Sort(int A[],int n){
    int i,j,d;
    int count;
    for(int d=n/2;d>=1;d/=2){
        count=n/d+1;
        while(int c=0;c<count;c++){
            for(i=count+d;i<n;i=i+d){
                if(A[i-d]>A[i])A[0]=A[i];
                for(int j=i-d;j>=1&&A[j]>A[0];j=j-d)A[j+d]=A[j];
            }
        }
    }
     
}
```



时间复杂度很难计算，不过最差的情况也就是d=1，这样和直接插入排序一个效果，所以最差时间复杂度和直接插入一样，是**O(n^2)**



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231201114704979.png" alt="image-20231201114704979" style="zoom:50%;" />













































### 交换排序

#### 2.1冒泡排序

**注意若是没有元素交换 则可以提前结束**   利用flag=true;

**每趟排序都会有一个元素放置到最终位置上**

代码的话两层循环最外面的是n-1趟 从0开始

最里面的是从后面往前开始。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103154838391.png" alt="image-20221103154838391" style="zoom:50%;" />

<hr>


**和快速排序一样归属与冒泡排序**

```C++
void BubbleSort(){
for(int i= 0;i<n-1;i++){//i走了n-1趟
    int temp=0;
    int flag=false;
    for(int j=n-1;j>=i;j--){//是j≥i而不是1
        if(A[j]<A[j-1]){
            temp=A[j];
            A[j-1]=A[j];
            A[j-1]=temp;
            flag=true;
        }
    }
    if(flag)break;
} 
}
```



首先我来讲一下时间复杂度，因为书上写的有一点乱，在最好的情况下也就是说是12345678这样子排列，这样子的话你需要进行N减一次的比较，但是并不需要交换，因为原本就是有序的。

（n-1次比较是因为8和7:7和6比这样子一共需要这么多次。）



最坏的情况就是87654321.这里面我们在比较的同时也需要交换。第1趟交换是把一放到最前面需要7次。也就是n减一次。第2趟交换是要把2放在第2个位置，需要N-2次，以此类推第i次交换就需要N-i次。

(n-1)+(n-2)+...+(n-i)= n(n-1)/2

但是交换次数并不等于移动次数，因为具体在移动的时候两辆移动的时候，你需要swap函数里面是需要三次，也就是说一次交换需要三次元素的移动。（因为交换我们是1对1对讲的，而一动我们只是讲单个元素的移动。）

所以移动次数是交换次数的三倍。

<hr>


在写代码上能注意两个点，第一是两个for循环，外层控制的是趟数。内存控制的是每一趟的移动内存，它是从最后的元素开始的。

第2个是注意，我们不是说每次都一定要进行N减一趟，到了某趟的时候元素全部有序，就不需要再继续移动了，这个的话你可以参考书上的flag。

<hr>


冒泡排序&链表

链表可否用于冒泡排序是可以的，毕竟冒泡排序也是挨着来的，但是在列表里面我冒泡排序就需要从头往后进行了，而不是从后往前进行。（每次把最大的泡泡冒到结尾）

<hr>


































#### 2.2快速排序

以往我们折半查找的时候，都是以low大于high的时候作为结束标志。这里是以low等于high的时候作为结束标志。所以在fastsort里面，我们的while循环设置的都是low<high,也就是说low一旦等于high，他就会出去，他都没有机会大于high。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103174953275.png" alt="image-20221103174953275" style="zoom:50%;" />（具体的看下面有效率）

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103180529261.png" alt="image-20221103180529261" style="zoom:50%;" />



倒数三四行的好坏效率写反了



以及递归别忘了设置出口。

```C++
//核心代码
void QuickSort(int A[],low,high){
    if(low<high){//递归的出口（返回开始的条件）一定要设立啊
        int pos=Partition(low,high,A)//最开始low是0 high是n-1 后来会变的//返回的low的值给了pos
        QuickSort(low,pos-1,A);
        QuickSort(pos+1,high,A);
    }
}

//下面是自己写的有失误
//控制递归
void FastSort(int low,int high,int A[]){
    //if(low<high){
    fastsort(low,high,A);//int pivot=fastsort(low,high,A);//F1
    //我这里还有一个错误就是第1句它应该是调用别的函数，第二三句才是递归，并不是三句全都是递归。
    FastSort(low,pivot-1,A);
    FastSort(pivot+1,high,A);
    //}
}
int fastsort(int low,int high,int A[]){
    int pivot = A[low];
    while(low<high){
        while(true){//为了保险起见还是换成while(low<high)
            if(A[high]>=pivot)high--;
            else{A[low]=A[high];break;}}
        while(true){
            if(A[low]<pivot)low++;
            else{A[high]=A[low];break;}}
       
    }
    A[low]=pivot;
    return low;
}
```

F1处你不这么写的话，下一行的pivot从哪里来呢？从F1里函数的返回值low给了pivot

low==high时一趟结束

 

https://www.bilibili.com/video/BV1b7411N798?p=81&spm_id_from=pageDriver&vd_source=e771ecf34dd26728a54b6a4e17897770

过程在这里不赘述了，我来讲一下，在这个快速排序中需要注意的一些点，也帮助写代码。

首先low和high是指向区间的最低和最高（要有一个基准数字key，默认是选第1个）

high: ≥key

low:＜key

首先我们从low开始，因为low所指的数字已经被定为基本数字了，所以low所指这个框框是空的，因为基本数字已经被拿出来了

**如果指针所指的框框是空的话，就可以跳到另一个指针。当然了，你只有low和high两个指针可以选。**

所以一定要详记我们上面的切换状态

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103163024885.png" alt="image-20221103163024885" style="zoom:33%;" />

拿这个举例子，现在切换到嗨指针了，所以high要向左移动。由于H指针所指的数字并不符合大于等于基本数字，所以H指针所指的数字它要拿出来给到low指针所指的**空白框框**

由于H指针所指的数字拿出来是空的了，所以现在可以切换到low指针，low指针它就向右移动。

38是符合的，所以再向右移动。65是不符合的，所以65会被拿出来给到嗨指针所指的空框框。

**最后，low所指和high所指重合，把基准元素放到它们碰头的位置。第一趟就算结束**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231202162403687.png" alt="image-20231202162403687" style="zoom:50%;" />

然后所有的数字会被分成小于49和大于等于49两大阵营

再把low high指向第一个区间

完成后是这样

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103163356085.png" alt="image-20221103163356085" style="zoom:33%;" />

下面说一下区间的划分。首先你是把数字分成了两大阵营，基准是49。

所以现在你要先到小于49的部分再找出一个基准划分一下。（如果右半部分也划分一下，现在整串数字它是有4个阵营。）阵营的排序是从左到右

```C++
//两个函数 下面递归part讲了些代码注意点
int Partition(int low,int high,int A[]){
    //记得定义枢纽 
    int pos = A[low]; //pos是分组的意思 差不多就是枢纽的意思
    while(low<high){
        while(true){//一定要先从high指针开始，因为最初是low把第一个元素取了出来
            if(A[high]>=pos)high--;//想着只要关键字符合了关键字就是爹，low high要让道 
            else{A[low]=A[high];high--;break;}//切换到另一个指针
        }
        while(true){
            if(A[low]<pos)low++;
            else{A[high]=A[low];low++;break;}
        }
    }
    A[low]=pos;//此时low == high，
    return low;
}

void QuickSort(int A[],low,high){
    if(low<high){//递归的出口（返回开始的条件）一定要设立啊
        int pos=Partition(low,high,A)//最开始low是0 high是n-1 后来会变的//返回的low的值给了pos
        QuickSort(low,pos-1,A);
        QuickSort(pos+1,high,A);
    }
}
```

==排序顺序：0~7，（把3插入正确位置）；0~2，0~0，2~2；3~3；4~7；4~5；4~4，5~5；7~7==

已经被选为枢纽的我们不再管它了



##### 效率

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103173742232.png" alt="image-20221103173742232" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103173821457.png" alt="image-20221103173821457" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103173913997.png" alt="image-20221103173913997" style="zoom:50%;" />

> 递归层数如何看出
>
> 注意：我们 每一层排好序之后才会再继续往下层数延伸
>
> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103174714187.png" alt="image-20221103174714187" style="zoom:33%;" />
>
> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103174759066.png" alt="image-20221103174759066" style="zoom:50%;" />
>
> <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103174900228.png" alt="image-20221103174900228" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103174953275.png" alt="image-20221103174953275" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103175035880.png" alt="image-20221103175035880" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103175259169.png" alt="image-20221103175259169" style="zoom:50%;" />这里的不均匀指的是我们那个枢纽的左边和右边的元素个数相差很大，比如在第1层里面枢纽是一，它左边有零个元素，右边有7个元素。这样的话，你的氦指针本来它指向的是最右边，它一直找不到小于枢纽的元素，它就得一直向左转。直到他到了位置1，那么第1层结束了。

第2层也是同样的，太指针他一直找不到，小于2的元素他一直得往左找。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103175511759.png" alt="image-20221103175511759" style="zoom:50%;" />

**快排的优化：**

当然是重新选择枢纽

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103175559875.png" alt="image-20221103175559875" style="zoom:50%;" />

**稳定性：**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103180012609.png" alt="image-20221103180012609" style="zoom:50%;" />

low指向0 high指向2

把两个2区分是2`和2``

2`先拿出来

然后看High指针，1<2`的，把1放到2  `的位置中

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103180116180.png" alt="image-20221103180116180" style="zoom:50%;" />

然后low指针向右移动2 ``` `是等于2`的   ``

**你就这么想 符合要求后关键字是爹 lowhigh就得给让路**

此时符合要求，low向右

此时low high都指向最后一个元素 2·放进去

可以看到**不稳定**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221103180529261.png" alt="image-20221103180529261" style="zoom:50%;" />



倒数三四行的好坏效率写反了

### 选择排序

#### 3.1简单选择排序

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221109233928818.png" alt="image-20221109233928818" style="zoom:50%;" />

因为都是要和min挨个对比



i是未排序序列的第一个

i是从0到n-2

j是从i+1到n-1



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104151533108.png" alt="image-20221104151533108" style="zoom: 33%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104152039859.png" alt="image-20221104152039859" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104151658211.png" alt="image-20221104151658211" style="zoom:50%;" />

```C++
void SelectSort(int A[],int n){
    int min,temp;
    for(int i=0;i<=n-2;i++){//i负责记录待排序元素的起始位置
       
        min=i;//min是i不是0，min最起码要是有序序列里最大的
        for(int j=i+1;j<n;j++){//j负责遍历待排序元素块
            if(A[j]<min){//块里发现最小元素移到i上
                min=j;
            }
            if(min!=i)swap(A[i],A[min]);//这个条件还挺重要的 容易忘
        }
    }
}
//这里面我的算法倒是没错，但是他的时间复杂度会高一些，现在我来说一下课本是怎么写的。
min那我这里是最小值的意思，在课本里面它是最小序号的意思。
    min=i;
	for(int j=i+1;j<n;j++){
        if(A[j]<A[min])min=j;
    }
	if(j!=i)swap(A[i],A[min]);

像我的话，每发现一个比i小的就要去swap一次。
但它的话是在for循环(j)一轮结束以后才会去swap
    
```

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104154715003.png" alt="image-20221104154715003" style="zoom:50%;" />

**无论给出的序列逆序还是有序乱序 ，时间复杂度不变**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104154751975.png" alt="image-20221104154751975" style="zoom:33%;" />

也可以用链表表示



#### 3.2堆排序

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104174601093.png" alt="image-20221104174601093" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104172408565.png" alt="image-20221104172408565" style="zoom:50%;" />

---

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104155041500.png" alt="image-20221104155041500" style="zoom:50%;" />

 <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231203114002949.png" alt="image-20231203114002949" style="zoom:50%;" />

 

**如何建立大根堆？**



**先检查是不是大根堆？**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104155714587.png" alt="image-20221104155714587" style="zoom:50%;" />

比如4号节点，它的左孩子是8号<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104155820667.png" alt="image-20221104155820667" style="zoom:33%;" />

9并不大于32 不是大根堆

**若不满足，则当前节点与更大的一个孩子互换**

**代码在视频十三分的时候比较重要 也就是53这样跳级两次的情况，不懂可以去看看**

##### 大根堆构造

```C++
//堆排序
//思路：只调查分支节点 即[0,n/2] 从后向前找哦
void BuildMaxHeap(int A[],int n){//名字可以记记
    for(int i=n/2;i>0;i--){//0号位置要放比对元素的
        HeapSort(A,i,n);
    }
}
void MaxHeapAdjust(int A[],int k,int n){//看了一下视频写的
    //这里设置i为跑腿元素（左孩子右孩子不得i去找?2i,2i+1），k是基准元素
    A[0]=A[k];
    int i;// 不需要加int 毕竟调用它的函数里有声明i
    for(i=2k;i<len;i++){ //代码要写2*k，2k不保证起效
        结合一下课本 上面的条件是i<=len，因为要防止没有右节点是在下面防的 在这里防左节点都防掉了
        //先筛选大小元素
        if(A[i]<A[i+1]){i++;}//if(i<len&&A[i]<A[i+1])
        //最大元素与A[i]比对，根最大跳出，根小的话再次比对
        if(A[0]>A[i])break; //要加大于等于号
        else{
            A[k]=A[i];
            k=i;
        } 
    }
    A[i]=A[0];//这个有些问题 虽然在最后一步i与k相等 但是i变量出了循环后循环里的值消失了 所以只能用k
    //A[k]=A[0];
}

//简写版
void BuildMaxHeap(int A[],int n){
    for(int i=n/2;i>0;i--){
        HeadAdjust(A,n,i);
    }
}

void HeadAdjust(int A[],int n,int k){
    A[0]=A[k];
    for(int i=2k;i<=n;i=i*2){
        
        if(i<len&&A[i]<A[i+1])i++;
        if(A[0]>=A[i])break;
		else{A[k]=A[i];
        	k=i;}
    }
    A[k]=A[0];
}
```

##### 排序

**基于大根堆进行排序**

刚开始看真的是有点懵逼，以为一切都结束了，不知道接下来还要干嘛。

其实大根堆他完成之后，他只是按照根大于左右的顺序排了一下，并不意味着我们整串数字是有序的。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104164952438.png" alt="image-20221104164952438" style="zoom:50%;" />

比如你看这里面他是符合了大根堆，但是他并不有序。

**排序步骤：**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104165053503.png" alt="image-20221104165053503" style="zoom:50%;" />

 首位和末位换一下位置。也就是87 和 9

绿色的是已经换好了。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104165151922.png" alt="image-20221104165151922" style="zoom:50%;" />

现在不用再考虑87了，把上面的整体一部分看成一个对，上面这一坨它并不符合大根堆，所以我们可以代入之前的代码把它排一下。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104165242977.png" alt="image-20221104165242977" style="zoom:33%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104165312537.png" alt="image-20221104165312537" style="zoom:50%;" />

09他经过代码也就是不断下坠下坠了两层，最终到达这个效果

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104165410689.png" alt="image-20221104165410689" style="zoom:50%;" />

这时候上面已经是一个大根堆了，第1趟结束开启第2趟。

剩余的可以在视频的17分开始看。

**每到达一次大根堆的形式就代表一趟就结束了。**我觉得他每次是把根和最后一个元素互换通，可以保证最大的元素都到后面去，而最后一位元素是大于倒数第2位元素，再大于倒数第3位元素。

注意哦，左下角32就相当于没有左孩子了。



##### 完整代码

**HeapSort每次调整一个元素 下坠的都是一号元素 递减的只是来减长度 **

//注意在HeapAdjust里我们只调整分支节点（k<n/2）

//在HeapSort里我们是从1号节点调整到倒数第二个节点

```C++
//最大最小的互换 len--  然后1号元素开始下坠
void HeapSort(int A[],int len){
    swap(A[1],A[len]);//0号位置放着东西
    len--;
    MaxHeapAdjust(A,1,len);
}

//下面是正确代码
void HeapSort(int A[],int len){
    BuildMaxHeap(A,len);//这里我真的有被辅助，实际上它就是包含了我们之前写的那个堆的全过程，包含了建立堆以及调整成最后大根堆的过程，它实际上是一个完整的大过程。
    while(len>1){//长度大于一连等于一都不可有，因为长度为2的时候，再往下就已经不行了。
        swap(A[1],A[len]);
        len--;
        MaxHeapAdjust(A,len,1);
    }
}
//课本里面循环是用字母i表示的，说实话这样的写法我真的很虚，我是说我的写法，但是我真的懒得思考这些了，就算老师扣分应该不是什么大错吧，一两分。
因为我自己觉得用i很别扭。
```

![image-20221104171518941](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104171518941.png)

 

因为你下一层有两个孩子，你就比两次下一层有一个孩子，你就比一次。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104171804107.png" alt="image-20221104171804107" style="zoom:50%;" />

![image-20221104171927087](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104171927087.png)

#### 效率分析

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104171956416.png" alt="image-20221104171956416" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104172309561.png" alt="image-20221104172309561" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104172334404.png" alt="image-20221104172334404" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104172408565.png" alt="image-20221104172408565" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104172420646.png" alt="image-20221104172420646" style="zoom:50%;" />

哈哈，这里看着有点难吧，但是我听懂了弹幕没听懂，所以虽然难，但是我很开心。我给你大致的讲一下吧。

我们之前关于对事讲了三个函数，分别是在建立堆里面，我们又调用了调整堆，最后我们用堆排序来完整地概括前面两个函数，所以我们调查时间复杂度的话，我们只要看堆排序的时间复杂度就好了。(HeapSort）

> BuildMaxHeap你在脑内想象一颗二叉树 我们是要完成每个节点向下坠的过程
>
> 一共h层，<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104173156214.png" alt="image-20221104173156214" style="zoom:33%;" />
>
> 第一层一个节点，向下坠(h-1)层，比较次数2次
>
> 第二层两个节点，向下坠(h-2)层，比较次数2次
>
> 加总之后（你别算很复杂）是≤4n
>
> 所以绿色部分的时间开销不超过O(n)

> 红色部分分为了swap和HeadAdjust
>
> 但是这里只考虑了HeadAdjust(A,1,i-1)  //由参数可以看出我们这里的目的是从第1层开始往下坠，那么你只需要跟你的层高有关，对不对？而且你每一层是比较两次，所以你一轮就是二乘上层高。（即2log2n）
>
> 一共n-1轮，就是nlog2n

#### 稳定性

29分开始

不稳定![image-20221104174601093](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104174601093.png)

#### 练习

![image-20221104180737765](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221104180737765.png)

#### 插入删除

注意对比关键字的次数

https://www.bilibili.com/video/BV1b7411N798?p=84&vd_source=e771ecf34dd26728a54b6a4e17897770

插入：

![image-20221105125240068](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105125240068.png)

删除：

用堆底元素代替

![image-20221105125441050](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105125441050.png)

在删除类里，46下坠时，它需要左右孩子先要比较出一个更小的元素 这与上一类是不同的上面的话直接就是节点与副节点进行交换，他这个交换前先要比对一下。

但是不是说必须要下坠，只要你比你的左右孩子都小，就没什么问题。

### 其他类排序

#### 4.1归并排序

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105125938299.png" alt="image-20221105125938299" style="zoom:50%;" />

首先是在I和J里面选出一个更小的放到K数组里面。由于我们这里面j更小，所以j的值放进去了，并且j移动。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105130054719.png" alt="image-20221105130054719" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105130118184.png" alt="image-20221105130118184" style="zoom:50%;" />

就结束了

<hr>


<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105130314426.png" alt="image-20221105130314426" style="zoom: 50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105130407051.png" alt="image-20221105130407051" style="zoom:50%;" />

![image-20221105130418464](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105130418464.png)

==m路归并，每选出一个元素需要对比关键字m-1次==

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105130614024.png" alt="image-20221105130614024" style="zoom:50%;" />

(上面是2路归并)

核心操作：把数组中两个有序的序列归并为1个



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105130839282.png" alt="image-20221105130839282" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105131039202.png" alt="image-20221105131039202" style="zoom:50%;" />

因为写代码需要对顺序有比较清晰的了解，我这里就大致的说一下顺序，首先呢，我们是要把a里面的内容复制到b里面，复制的话就可以用k进行遍历。（ A数组里面有low high mid，这就是二路数组，它是用来区分的。）

复制到B数组里面以后，一数组里面我们也需要用a来进行区分，这的话它就是mid+1

然后我们对i j进行比较  较小的数字就放到K所指的位置里面，以此类推。

(当I和j指向相同的元素的时候，优先使用，I的，这个24的相对位置是不变的，也就是保证了稳定性。)

![image-20221105131619863](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105131619863.png)

最后一句执行前的效果是这样的

具体的递归见视频13分

需要讲一个就是如果你的。块中只有一个元素，那这个块肯定就是有序的，块中，如果有两个元素，比如说21那还可以排也就是12。

![image-20221105132222752](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105132222752.png)

#### 算法效率

倒着的二叉树

![image-20221105132540978](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105132540978.png)

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105132636552.png" alt="image-20221105132636552" style="zoom:53%;" />

归并需要h-1趟。h-1=log2n

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105132715231.png" alt="image-20221105132715231" style="zoom:50%;" />

不懂每趟归并可以看视频十八分

空间复杂度：O(n)

辅助数组B

递归调用的深度是Olog2n，小于n，保留更高阶的



![image-20221105133055899](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221105133055899.png)

归并排序第一句是low<high



#### 4.2基数排序

通常是链式存储

![image-20221111120444311](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111120444311.png)

#### 过程

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231207112745463.png" alt="image-20231207112745463"  />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111112734352.png" alt="image-20221111112734352" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111112746620.png" alt="image-20221111112746620" style="zoom:50%;" />

第一趟收集工作：队wei先出队

![image-20221111112814522](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111112814522.png)

![image-20221111112915967](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111112915967.png)

第2趟上面那一串数字是我们第1趟收集结束后完成的链表

第1趟收集结束后，我们完成的链表 是根据个位数由大到小排列的。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111113050270.png" alt="image-20221111113050270" style="zoom:50%;" />

第2趟可以发现我们个位数更大的会先进入队列，也就是说等第2趟收集的时候它会更晚出队。

![image-20221111113229490](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111113229490.png)

![image-20221111113311298](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111113311298.png)

![image-20221111113334493](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111113334493.png)

![image-20221111113358970](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111113358970.png)

![image-20221111113424083](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111113424083.png)

![image-20221111113452662](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111113452662.png)

在刚才d是3，最高位是百位，最低位是0

#### 总结

> 因为每个位上数字是0-9，所以我们设置了十个队列 r=9

> 权重递增指的是先排列权重最小的，比如个位数对关键字的值影响最小，所以个位数先排

> 收集里是指由于得到的是递减序列，所以从值最大的队列开始收集

![image-20221111113928859](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111113928859.png)

#### 算法效率

代码不太考 但为了满足好奇心可以看看

![image-20221111114139283](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111114139283.png)

横向来看，每增加一个粉色块，也就是增加一个队列，也就是要增加一个链表。

竖着来看也就是蓝色块 每增加一个队列，我们就只需要增加两个指针front和rear。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111114224303.png" alt="image-20221111114224303" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111114346294.png" alt="image-20221111114346294" style="zoom:50%;" />

n是指元素个数 r是几个队列（几个粉色块） d是几位数（这里是3位）

一趟需要分配+收集，分配是每个扫一遍O(n)，收集是O(r)

而一共有d趟

#### 稳定性

![image-20221111114737425](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111114737425.png)

这里我要介绍一下，因为这里要搞懂涉及一些代码的逻辑，我们把第1个12叫1号带下划线的12叫2号。

那么一二号先穿到了这个紫色块块上的羊肉块呀，这样没异议吧

在出的时候如果按照队列的话，那肯定是2号先出1号再出，那你会好奇说为什么在第1趟收集里面却不是这样写的呢？这个跟我们出的时候实现的代码有关。

我会假设Q3，我们假如说穿了三个块，也就是说我们1号前面会有三个块。我把这三个块叫做大a吧，大a是不存在的哦。

大a他想要指向Q2的三个块，他会首先让大a的尾部指向Q2.front，<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111114936570.png" alt="image-20221111114936570" style="zoom: 50%;" />

复习一下这个图你会发现,Q2.front是一号12元素，所以这也就解释了我们为什么不是2号，是二先出对而是1号是二先出对，因为我们会让前面的块直接指向Q2.front，然后让Q2.front指向NULL

懂了吗？我们在每个队的元素串起来的时候，我们并不考虑羊肉串中间的东西，我们只要把首和尾搞好就行了。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111115132156.png" alt="image-20221111115132156" style="zoom:50%;" />

#### 应用

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111115246913.png" alt="image-20221111115246913" style="zoom:50%;" />

首先先不要看下面的图，先听我讲。

我们要知道基础排序它是按照趟来说的，而趟是分为分配和收集。

分配是指你把它分为几个粉色块块。收集是说，你是打算怎么把这里面的羊肉粒穿在一起呢？你可以从左往右穿也可以从右往左穿，取决于你对数字的递增递减要求。



好了，我们来分析这个题目，他说你要按照年龄递减排序，我们首先把年月日。分配一下可以看到年，它是有15种情况，月是有12种，日是有31种。

那我们是要分为三趟，第1趟的话我们会写上15个块块，第2套我们会画上12个块块，第3套我们会画上31个块。

哦对了，为什么我们是要按照这个顺序呢？不是因为他叫年月日，而是因为年月日里对年龄的影响，年是最大的，日是最小的，我们按照权重最小的最先分配，那么就是先分配日。

![image-20221111115357807](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111115357807.png)

好了，我们已经看到这个图了，看到他美歌画的格数了，下面我们要考虑一下怎么收集。

因为日月年越大的年龄越小对不对？你比如说31号出生的比3号出生的年龄要小12，月出生的比2月出生的年龄要小。那我们是要按照年龄由大到小来收集。那也就是从左往右收集。



总结一下，你要判断一下年月日的权重，也要判断一下年月日的块块数目。在难一点的题里面，可能要你分一下要分几趟，这里面很明显，我们是年月日分三趟。

再其次考虑一下收集的顺序别忘了，我们每一趟是分配加收集。也就是你要先考虑趟数（同时考虑权重） 再考虑分配的，在考虑收集的时候的情况。

**计算时间复杂度**

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111120047014.png" alt="image-20221111120047014" style="zoom:50%;" />

r是指最大的分隔块块 n是学生数 d是趟数

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111120142152.png" alt="image-20221111120142152" style="zoom:50%;" />

 和别的算法比较的话，会发现基数排序很优越。

![image-20221111120219760](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111120219760.png)

基数排序不擅长的：

![image-20221111120326226](C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20221111120326226.png)



### 外部内部排序

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206135434616.png" alt="image-20231206135434616" style="zoom: 50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206113806318.png" alt="image-20231206113806318" style="zoom:50%;" />



磁盘=机械硬盘

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206114207694.png" alt="image-20231206114207694" style="zoom:50%;" />

**外部排序**

 <img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206114524287.png" alt="image-20231206114524287" style="zoom:50%;" />

得到八个归并段

> 我们两个两个读入磁盘，在输入缓冲区中。比如把8 9 26 36 42 48分别读到输入缓冲区一输入缓冲区二把，它当做归并排序的两个分段，把他们各自排好之后,再分别先读到输出缓冲区，再写入磁盘中一块一块来。就这样两个两个我们分别进行排序，再把它们写入磁盘，我们一共得到了8组归并段。
>
> 由于我们是两个两个来，所以我们需要读入两次，再写入两次。8个规定段就需要16次读和16次写。

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206114547522.png" alt="image-20231206114547522" style="zoom:50%;" />

==构造初试归并段：16次读和写==

 

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206115018318.png" alt="image-20231206115018318" style="zoom:50%;" />



>  这里就像归并排序一样，我们I和j分别指向输入缓冲区一和输入缓冲区2。把更小的读到输出缓冲区。



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206115122191.png" alt="image-20231206115122191" style="zoom: 50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206115139813.png" alt="image-20231206115139813" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206115950793.png" alt="image-20231206115950793" style="zoom:50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206120113197.png" alt="image-20231206120113197" style="zoom:50%;" />





---

#### 总结

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206123126960.png" alt="image-20231206123126960" style="zoom:50%;" />

> 内部排序是指在蓝色框框内先排好序

#### 优化：多路归并

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206124726567.png" alt="image-20231206124726567" style="zoom:50%;" />

i,j,m,n分别指向四个，先挑出最小的

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206124909601.png" alt="image-20231206124909601" style="zoom:50%;" />

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206124956432.png" alt="image-20231206124956432" style="zoom:50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206125023317.png" alt="image-20231206125023317" style="zoom:50%;" />



#### 优化：减少初始归并段数量

减少r

<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206125219258.png" alt="image-20231206125219258" style="zoom:50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206125234093.png" alt="image-20231206125234093" style="zoom:50%;" /><img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206135059088.png" alt="image-20231206135059088" style="zoom:50%;" />



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206135126719.png" alt="image-20231206135126719" style="zoom:50%;" />

 



<img src="C:\Users\朱嘉宜\AppData\Roaming\Typora\typora-user-images\image-20231206135200211.png" alt="image-20231206135200211" style="zoom:50%;" />















开始学习7：20 

7：00-9：00 写数学/专业课

9：00-10：00 英语或者政治

10：00-11：30 写数学或者专业课

中午：继续整理 约莫 30-40min

（270min）



下午：2：00-5：00 数学收尾

(180min)

晚上：6点开始学习 复盘30min到60min（到7：00）

7：00到8：00 政治

8：00到9：00 英语

9：00到11：00 继续收尾



（260min）





