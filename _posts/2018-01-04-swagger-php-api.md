---
layout: post
title: Swagger 构建项目中Api文档
description: 作为一个后端程序员,在编辑后台接口时,我们可以有多种选择,当然在此之前介绍过apidocJs,这里再介绍一个目前在用的接口管理工具Swagger
tags:
     PHP
     Swagger
     Api
class: post-nine
comments: true
poster: /attachments/images/articles/2018-01-04/poster.jpg
---

## 简介
在后端提供的前端的接口时，以前可能以一分`md`形式的文档提供给前端，现在开发对于前后台的交互很是常见，在编写我们后台的文档时，再遵循一定的规范即`OpenAPI`规范，根据这样的规范我们可以更加准确快速的描述`API`
而和`swagger`这些文档描述一样 ，你可以理解成一种独立与程序语言的注释性语言，因为他们不会随着最后程序而编译，而是单独的独立出来，根据自身的解释器而转换成一种格式文档，最后再加以渲染，比如`swagger`由`swagger-ui`渲染之后，前端程序员就可以直观的指导`API`的作用，并提供了交换测试的方式，这样的话很是方便
`swagger`具有十分庞大的生态系统，几乎支持所有的编程语言，对于这样的交互式的`API`文档对于开发者来说是很好的福音

## 使用
这里以`laravel`项目为例，对于`swagger`已有先人帮我们集成好了，这里我们使用的是`zircote/swagger-php`,和`laravel`的扩展一样通过`composer`安装
```shell
$ composer require zircote/swagger-php
```

安装完毕之后 我们可以在应用的目录`App/Http`下新建`Api`目录用来存放我们的`Api`接口

新建一个`BaseController`来写基本的返回信息格式 当然在这个控制器里也会标注我们接口的版本信息

在`BaseController`里去定义接口的版本等信息
```php?start_inline=1
/**
 * @SWG\Swagger(
 *   host="www.geekghc.com",
 *   schemes={"http", "https"},
 *   basePath="/api/",
 *   @SWG\Info(
 *     version="1.0.0",
 *     title="codespace API文档",
 *     description="codespace community description...",
 *   )
 * )
 */
```
这里指明了`host` `version` `title` `description`这些描述信息 在接下来的接口类中都会继承这个父类

在解释器最终形成文档时也只会去解析这样的非代码的解释语言 最终就是得我们的`API`文档

在这里我们最终生成的是`json`组成的文件信息,那么如果只是这样留给我们的前端相比会一脸懵逼,作为接口文档我们

希望其他人可以在线执行模拟接口信息并提供一定的`UI`这样看起来才是友好的

接下来新建一个路由用来展示最终的`Api`文档

```php?start_inline=1
//api文档
Route::get('/api/docs',function(){
   return view('apidoc');
});
//api文档json
Route::get('get/swagger', ['middleware' => 'auth', function () {
    echo file_get_contents('./swagger.json');
}]);
```
第一个`api/docs`用来返回我我们的`view`视图 最后需要呈现的是一个`UI`的接口文档 因此我们需要引入`swagger-ui`来丰富我们的界面

这里返回的视图为`apidoc.blade.php`  首先定义好文档的用户名和密码 这样方便为内部使用
```php?start_inline=1
<?php
define('ADMIN_USERNAME','admin'); 	// Admin Username
define('ADMIN_PASSWORD','ghc1996');  	// Admin Password
if (!isset($_SERVER['PHP_AUTH_USER']) || !isset($_SERVER['PHP_AUTH_PW']) ||
    $_SERVER['PHP_AUTH_USER'] != ADMIN_USERNAME ||$_SERVER['PHP_AUTH_PW'] != ADMIN_PASSWORD) {
    Header("WWW-Authenticate: Basic realm=\"Memcache Login\"");
    Header("HTTP/1.0 401 Unauthorized");

    echo <<<EOB
				<html><body>
				<h1>Rejected!</h1>
				<big>Wrong Username or Password!</big>
				</body></html>
EOB;
    exit;
}
?>
```

至于`swagger-ui`可以直接去官网[https://swagger.io/swagger-ui/](https://swagger.io/swagger-ui/)进行下载 
在文件中继续引入必要的`css`和`js`文件即可  这里的详情我放在[gist](https://gist.github.com/GeekGhc/d58f37771b35f2e1990e11e4ee6981b5)上 请自行查看

##Swagger结合项目
之前都是安装的准备工作，接下来结合到具体的项目里，这里我以我其中的一个项目为例：

首先介绍一下OpenAPI规范。OpenAPI是Linux基金会的一个项目。试图通过定义一种用来描述API格式或API定义的语言，来规范RESTful服务开发过程。OpenAPI规范帮助我们描述一个API的基本信息，比如：
- 有关该API的一般性描述
- 可用路径（/资源）
- 在每个路径上的可用操作（获取/提交...）
- 每个操作的输入/输出格式

在实际项目中 对于接口的基类 这里放在`BaseController`我们定义`swagger`的基本组成部分
```php?start_inline=1
/**
 * @SWG\Swagger(
 *   swagger="2.0", 
 *   host="codespace.example",
 *   schemes={"http", "https"},
 *   basePath="/api/",
 *   @SWG\Info(
 *     version="1.0.1",
 *     title="codespace API文档",
 *     description="codespace system description...",
 *   ),
 *   @SWG\Tag(name="User", description="用户"),
 *   @SWG\Tag(name="Post", description="动态"),
 *   @SWG\Tag(name="Article", description="文章"),
 *   @SWG\Tag(name="Message", description="消息"),
 *   @SWG\Tag(name="Article", description="标签"),
 *   @SWG\Tag(name="Comment", description="评论"),
 *   @SWG\Tag(name="Action", description="用户互动操作"),
 *   @SWG\Tag(name="Comment", description="侧边栏"),
 *   @SWG\Tag(name="Setting", description="用户设置"),
 *  
 * )
 */
```
这里首先通过`swagger`属性来申明`OpenAPI` 规范的版本。
```php?start_inline=1
<?php
/**
 * @SWG\Swagger(
 *     swagger="2.0"
 * )
 */
```
接下来就是接口文档的地址和给开发者的URL地址 这里还定义了接口地址的前缀
```php?start_inline=1
 *   host="codespace.example",
 *   schemes={"http", "https"},
 *   basePath="/api/",
```
接下来就是接口文档的描述信息 这其中包含了标题、版本和描述信息
```php?start_inline=1
 *   @SWG\Info(
 *     version="1.0.1",
 *     title="codespace API文档",
 *     description="codespace system description...",
 *   ),
```
为了实际的接口分类 这里引入了`Tag`的概念   这在每个接口申明时可以对其进行归并分类
```?php?start_inline=`
 *   @SWG\Tag(name="User", description="用户"),
 *   @SWG\Tag(name="Post", description="动态"),
 *   @SWG\Tag(name="Article", description="文章"),
```

定义完毕基类中的接口基本信息后我们可以尝试着去书写详细的接口信息  以用户为例
```php?start_inline=1
/**
     * 当前用户
     * @SWG\Get(
     *     tags={"User"},
     *     path="/user",
     *     operationId="UserController",
     *     summary="当前用户",
     *     description="当前用户",
     *     produces={"application/json"},
     *     @SWG\Parameter(
     *         name="id",
     *         in="query",
     *         description="用户id",
     *         required=true,
     *         type="string",
     *     ),
     *     @SWG\Response(
     *         response=200,
     *         description="当前用户",
     *         @SWG\Schema(
     *             type="array",
     *             example={"errcode":"响应代码","data":{{"name":"项目名称","logo":"项目封面","creatorId":"项目拥有者id","status":"0 删除 | 1 活动","updated_at":"项目修改时间","isArchived":"是否归档 true 归档 false 未归档","created_at":"项目添加时间","creator": {"uid": "项目拥有者id","full_name": "项目拥有者姓名","avatar": "项目拥有者头像"}}},"errmsg":"响应信息"}
     *         )
     *     )
     * )
     */
```
这里将当前用户的这个接口归并为`User`这个`Tag` 同时也包含了`url`地址、请求方式、操作控制器、说明这些属性信息
在`Parameter`里申明请求参数  这里需要的是用户的`id`,`in`申明请求体类型  当然如果是`post`请求 这里的方式应该为`formData`

有了请求的参数定义当然也需要有返回值得定义  在`Response`体里返回对应的数据体

这里只是以一个小的用户信息接口为例 在每个接口方法中可以对应着不同的接口请求和返回  而这些也基本都是大同小异

最后完成了接口文档的编写 在此之前说过最后我们需要将所有的接口描述生成到一个`json`文件中再通过`semantic-ui`渲染的界面呈现给前端开发者

这里的生成命令为
```shell
$ php ./vendor/zircote/swagger-php/bin/swagger ./app/Http/Controllers/Api -o ./public
```
也就是说将`./app/Http/Controllers/Api`路径下的所有`API`的控制文件的接口信息生成到`public`目录

最后的结果访问`api/doc`就是这样的
![1](/attachments/images/articles/2018-01-04/1.png)



## 相关链接
- [swagger官网](https://swagger.io/)
- [zircote/swagger-php插件地址](https://github.com/zircote/swagger-php)
- [gist地址](https://gist.github.com/GeekGhc/d58f37771b35f2e1990e11e4ee6981b5)
- [如何编写 Swagger-PHP 的 API 文档](https://laravel-china.org/index.php/topics/7430/how-to-write-api-documents-based-on-swagger-php)
