---
layout: post
title: HTMLPurifier解决Laravel5的XSS跨站脚本攻击安全问题
description: Web安全问题越来越受到人们的注意 对于XXS是对于站点的用户隐私的攻击 这对于用户安全造成很大的隐患
             就目前来说HTMLPurifier是目前最好的PHP富文本HTML过滤器
tags:
     HTMLPurifier
     XXS
     Laravel
class: post-one
comments: true
poster: /attachments/images/articles/2017-07-12/poster.jpg
---

`XXS` 也成为跨站脚本攻击 这也是常见的`Web`攻击 同时`XXS`涉及三个群体:黑客 客户端 `Web`站点。就目前来说解决

`php`中`XXS`攻击的方法就是使用`HTML Purifier`  基于他支持自定义过滤规则 可以把不标准的`HTML`转换为标准的`HTML`

> 同时我们也要相信一点的就是没有绝对的安全 所以我们也只能尽量的去过滤一些不必要的安全隐患

对于他的自定义规则就是对`HTML`的标签和属性的的过滤 利用**白名单机制**  在执行`clean()`方法后 对于不在白名单的
元素则会被过滤

下面就来介绍我们需要用到的 [HTMLPurifier for Laravel](https://github.com/mewebstudio/Purifier)

在已经创建好的`Laravel`项目中 执行:
```shell
$composer require mews/purifier
```
在 `config/app.php` 文件的 `providers` 数组里添加
```php?start_inline=1
Mews\Purifier\PurifierServiceProvider::class,
```

生成 `HTMLPurifier for Laravel 5` 的配置文件

在命令行下执行:
```shell
$ php artisan vendor:publish --provider="Mews\Purifier\PurifierServiceProvider"
```
这个时候打开`config/purifier.php`可以看到一系列的配置
```php?start_inline=1
return [

    'encoding'  => 'UTF-8',
    'finalize'  => true,
    'cachePath' => storage_path('app/purifier'),
    'cacheFileMode' => 0755,
    'settings'  => [
        'default' => [
            'HTML.Doctype'             => 'XHTML 1.0 Strict',
            'HTML.Allowed'             => 'div,b,strong,i,em,a[href|title],ul,ol,li,p[style],br,span[style],img[width|height|alt|src]',
            'CSS.AllowedProperties'    => 'font,font-size,font-weight,font-style,font-family,text-decoration,padding-left,color,background-color,text-align',
            'AutoFormat.AutoParagraph' => true,
            'AutoFormat.RemoveEmpty'   => true,
        ],
        'test'    => [
            'Attr.EnableID' => true
        ],
        "youtube" => [
            "HTML.SafeIframe"      => 'true',
            "URI.SafeIframeRegexp" => "%^(http://|https://|//)(www.youtube.com/embed/|player.vimeo.com/video/)%",
        ],
    ],

];
```
接下来对于接受到的参数 我们就可以使用`clean(Input::get('name'))`进行过滤了

当然这里执行的过滤规则是配置文件里`setting`的`default`的配置规则 代码如下:
```php?start_inline=1
'default' => [
    'HTML.Doctype'             => 'XHTML 1.0 Strict',
    'HTML.Allowed'             => 'div,b,strong,i,em,a[href|title],ul,ol,li,p[style],br,span[style],img[width|height|alt|src]',
    'CSS.AllowedProperties'    => 'font,font-size,font-weight,font-style,font-family,text-decoration,padding-left,color,background-color,text-align',
    'AutoFormat.AutoParagraph' => true,
    'AutoFormat.RemoveEmpty'   => true,
],
```
当然我们完全可以自定义过滤规则 如我们定义规则:
```php?start_inline=1
'post_topic' => array(
    'HTML.Doctype'             => 'XHTML 1.0 Strict',
    'HTML.Allowed'             => 'div,b,strong,i,em,a[href|title],ul,ol,li,p[style],br,span[style],img[width|height|alt|src],pre,code',
    'CSS.AllowedProperties'    => 'font,font-size,font-weight,font-style,font-family,text-decoration,padding-left,color,background-color,text-align',
    'AutoFormat.AutoParagraph' => true,
    'AutoFormat.RemoveEmpty'   => true,
),
```
那么我们就可以在执行过滤是介入第二个参数 `clean(Input('name'),'post_topic')`
最后还是那句话 `web`安全的工作终究不是最完美的 我们需要不断的改进我们的防御机制已达到预期的效果


## 相关链接
- [HtmlPurifier官网](http://htmlpurifier.org/)
- [Purifier-for-laravel](https://github.com/mewebstudio/Purifier)
- [跨站点脚本攻击深入解析](https://www.ibm.com/developerworks/cn/rational/08/0325_segal/)
- [Laravel-China 使用 HTMLPurifier来解决Laravel5中的 XSS 跨站脚本攻击安全问题](https://laravel-china.org/articles/4798/the-use-of-htmlpurifier-to-solve-the-xss-xss-attacks-of-security-problems-in-laravel)