---
layout: post
title: QueryList-PHP的采集利器
description: 在php中做数据采集比起采用正则进行匹配获取 我们也会有其他的解决方案 比如说今天要说的基于PHPQuery的PHP采集利器QueryList
tags:
     PHP
     QueryList
     数据采集
class: post-eight
comments: true
poster: /attachments/images/articles/2017-10-12/poster.jpg
---

## 简介
在面对数据采集的需求时   我们自然会想到采用爬虫这类的工具 在`php`中我们同样是以爬虫采集数据的形式  在`PHP`中我们需要知道和了解的

就是要说的`QueryList` 这是一套基于`PHPQuery`的数据采集方案 其使用习惯和我们使用`jquery`操作`dom`元素的选择器一样  十分直观

## 数据采集
一开始我们就说过`queryList`获取元素和`jquery`的选择器差不多  所以说如果我们想要获取一些基本元素  诸如一个页面的图片 指定区域的文本文件等等

当然在采集数据数据之前我们要明白所给我们的采集规则是这样的:

//采集规则
```php?start_inline=1
$rules = array(
   '规则名' => array('jQuery选择器','要采集的属性'[,"标签过滤列表"][,"回调函数"]),
   '规则名2' => array('jQuery选择器','要采集的属性'[,"标签过滤列表"][,"回调函数"]),
    ..........
);
//注:方括号括起来的参数可选
```
所对应的具体规则参数直接参照文档就好了  [https://doc.querylist.cc/site/index/doc/13](https://doc.querylist.cc/site/index/doc/13)

既然有了这些规则参数  那么我们就可以通过规则去采集一个页面的数据了

这时我们假设去采集下[laravel-china](https://laravel-china.org/topics)的页面部分数据
```php?start_inline=1
 $ql = QueryList::get('https://laravel-china.org/topics')->rules([
            'img'=>array('.media-object.avatar','src'),
            'title'=>array('.media-heading>a','text')
        ]);
        $data = $ql->query(function($item){
            return $item;
        })->getData();
        print_r($data->all());
```
这样就可以分别获取对应的`href`和`text`属性  在定义规则执行完`query`自后才可以通过`getData`获取数据 并在这里的回调函数自定义自己的返回形式

最后这样是以一个二维数据的形式返回的 

当然这个会有个证书的问题 因此我们可以直接获取页面的内容
```php?start_inline=1
$html = file_get_contents('https://laravel-china.org/topics');
        $ql = QueryList::html($html)->rules([
            'img'=>array('.mddia-object.avatar','src'),
            'title'=>array('.media-heading>a','text')
        ]);
```
得到数据数组后我们最好相应的释放资源
```php?start_inline=1
$ql->destruct();
```
## Api用法
就如之前多说  我们可以像`jquery`操作`dom`一样  我们可以直接使用`find`查找我们需要的元素
```php?start_inline=1
//获取页面中所有图片地址
$data = $ql->find('img')->attrs('src');
print_r($data->all());
```
这样我们其实和再去定义规则筛选的结果是一样的  只不过这样的方式更为简单方便

除了`find`还有一些其他的常用的`Api`用法其实和我们平时写`js`时差不多  如获取文本 获取`html`文本 获取孩子节点等

具体的用法和举例文档上也写的很清楚了 [https://doc.querylist.cc/site/index/doc/20](https://doc.querylist.cc/site/index/doc/20)

还有一些高级的用法  如绑定自定义参数  这样我们可以使用自定义的方法 如文档介绍的一种就是
```php?start_inline=1
$ql = QueryList::getInstance();
//注册一个myHttp方法到QueryList对象
$ql->bind('myHttp',function ($url){
    $html = file_get_contents($url);
    $this->setHtml($html);
    return $this;
});
//然后就可以通过注册的名字来调用
$data = $ql->myHttp('https://toutiao.io')->find('h3 a')->texts();
print_r($data->all());
```
扩展的作用就是定义自己的需求  这样就达到了功能扩展的目的  如我们需要对一个页面上的图片进行二次处理 这样我们就可以通过`bind`自定义的方法实现

还有一个需要注意的就是在使用插件时  我们需要使用`use`这个关键字  具体的用法下面在说到插件就知道了

## http请求
在`queryList`也是可以进行`http`请求的  那么这样一来我们就可以进行模拟登陆 请求获取等操作

在`get`请求中我们可以进行携带`cookie`进行`get`请求 这样我们就可以请求到一个登陆后的页面

拿文档所说的一个微博实例来说就是为了获取登陆后的页面内容 我们就可以在拿到登录后的cookie尽情get请求
```php?start_inline=1
$ql = QueryList::get('http://weibo.com',[],[
    'headers' => [
        //填写从浏览器获取到的cookie
        'Cookie' => 'SINAGLOBAL=546064; wb_cmtLike_2112031=1; wvr=6;....'
    ]
]);
//echo $ql->getHtml();
echo $ql->find('title')->text();
//输出: 我的首页 微博-随时随地发现新鲜事
```

同样的`post`的用法其实差不多  就如我们在模拟一些网站的登录请求

## 插件使用
最后他为我们提供了几个常见的功能插件 如`url`的转换插件
```php?start_inline=1
$ql = QueryList::getInstance();
$ql->use(AbsoluteUrl::class);
//或者自定义函数名
$ql->use(AbsoluteUrl::class,'absoluteUrl','absoluteUrlHelper');
```
这里的`use`就是引入我们的`url`插件  这样的话我们就可以转换一个也页面的所有url
```php?start_inline=1
$data = $ql->get('https://toutiao.io/')
    ->absoluteUrl('https://toutiao.io/')
    ->find('a')->attrs('href');
print_r($data);
```
还有一些基于百度和谷歌的搜索插件  也是非常实用的

当然所有的插件都需要`compoer`进来  这样我们才可以使用`use`进行声明使用

## 实际应用场景
最后举个我们平时项目中需要用到的一个应用场景吧  我们在发布文章时 可能我们会提供给作者一个抓取链接发布文章

当用户发现一个是非精彩的文章 但又省去粘贴复制这样的操作时  我们就可以利用`queryList`进行数据采集 

通过用户提供的`url`我们可以采集页面上的文章标题 作者 文章的主体内容这些有用信息  具体的操作就是拿到这些元素的规则这样我们就会很方便了

这里我以微信公众号的文章为例  我们在通过`url`抓取到页面的文章内容  具体的代码如下
```php?start_inline=1
$url = "http://mp.weixin.qq.com/s/r5MGWqaTEiYHi9c3fEIDhQ";
    $html = file_get_contents($url);  //获取文章源码并保存到参数中
    $html = str_replace("<!--headTrap<body></body><head></head><html></html>-->", "", $html);
    $data = QueryList::html($html)->rules([
        'title' => ['#activity-name', 'text'],
        'author' => ['#post-user', 'text'],
        'content' => ['#js_content', 'html']])->query(function($item){
                        $item['content'] = "文章内容 :".$item['content'];
                        return $item;
    })->getData();
    dd($data);
```  
如果是获取第一篇文章的标题其实很简单  这样的在`laravel`其实返回的是一个`collection` 所以我们可以这样
```php?start_inline=1
dd($data[0]['title']);
```
至于其他的以此类推就是了

## 相关链接
- [QueryList 中文文档](https://doc.querylist.cc/site/index/doc/1)