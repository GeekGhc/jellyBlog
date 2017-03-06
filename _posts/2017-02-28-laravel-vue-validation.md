---
layout: post
title: vuelidate结合Laravel后端数据注册验证
description: 在前端vue项目使用基于vuelidarte验证 结合后端数据库和api数据 这样才是一个完整的注册登录以及验证流程
tags:
     laravel
     vue
     validation
class: post-one
comments: true
poster: /attachments/images/articles/2017-02-28/poster.png
---

## 介绍
在实现`vuelidate`基本的验证之后 我们需要去真正实现项目中的注册登录以及我们的验证流程 

> 有的具体的代码我也会放到我的`gist`上面

## 后端api以及数据准备

对于前端的请求 以`laravel`作为后端项目需要对数据进行处理和相应的反馈

我们可以先去创建`User Model`在项目终端:
```
$ php artisan make:model User -m
```
生成Model后就去定义好字段信息:
```php?start_inline=1
 public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('avatar');//保存用户头像
            $table->string('confirm_code',64);//邮箱确认激活code
            $table->smallInteger('is_confirmed')->default(0);//判断用户呢是否已经激活他的邮箱
            $table->integer('followers_count')->default(0);
            $table->integer('followings_count')->default(0);
            $table->rememberToken();
            $table->timestamps();
        });
 }
```
我们也可以尝试创建对应的Factory然后可以生成测试数据:
```php?start_inline=1
$factory->define(App\User::class, function (Faker\Generator $faker) {
    static $password;

    return [
        'name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'avatar' => $faker->imageUrl(256, 256),
        'confirm_code' => str_random(48),
        'password' => $password ?: $password = bcrypt('secret'),
        'remember_token' => str_random(10),
    ];
});
```

写好模型工厂后我们可以试着生成几个测试数据 项目终端:
```
$ php artisan tinker;
```
```
$ namespace App;
```
```
$ factory(User::class,4)->create()
```

现在我们已经准备好测试数据 当然你也可以使用注册过后的数据 

开始注册之前先去生成对应的`Controller` 

> 我的`laravel`后端项目是**5.4** 而在**5.4**里面新增了控制器与模型的绑定

在项目终端执行:
```
$ php artisan make:controller UserController --model=User
```
生成控制器后就去路由定义我们的路由方法:
```php?start_inline=1
Route::group(['prefix'=>'user','middleware'=>['api','cors']], function () {
    Route::post('/register','UserController@store');
});
```

而`UserController`里面的具体逻辑就是平常的注册逻辑:
```php?start_inline=1
public function store(Request $request)
    {
        $data = [
            'avatar' => '/images/avatar/default.png',
            'confirm_code' => str_random(48),
        ];
        $user = User::create(array_merge($request->get('user'),$data));
        return json_encode(["user_id"=>$user->id,"status"=>"success"]);
 }
```
这样就可以完成注册的后端处理逻辑

## `vue`基于后端`api`数据进行数据检验

我们的`template`内容基本还是那样的判断方式 只不过在这里我对字段的唯一性的针对用户名和邮箱

所以我的具体`validations`是这样的:
```php?start_inline=1
validations: {
    newUser:{
       name: {
            required,
            minLength: minLength(4),
            async isUnique (value) {
               if (value === '') return true
               const response = await fetch(`http://localhost:8000/api/unique/name/${value}`)
               return Boolean(await response.json())
            }
       },
       email: {
            required,
            email,
            async isUnique (value) {
               if (value === '') return true
               const response = await fetch(`http://localhost:8000/api/unique/email/${value}`)
               return Boolean(await response.json())
            }
       },
       password: {
           required,
           minLength: minLength(6)
       },
       confirm_pwd: {
            required,
            sameAsPassword: sameAs('password')
       }
    }
},
```

当然这只是对字段检验的要求 后端的检验路由方法:
```php?start_inline=1
Route::group(['prefix'=>'unique','middleware'=>['api','cors']], function () {
    Route::get('/name/{value}','ValidateController@ValidateName');
    Route::get('/email/{value}','ValidateController@ValidateEmail');
});
```

> 这里我是单独生成了一个`Controller`去实现方法逻辑

对于用户名的检验:
```php?start_inline=1
public function ValidateName($name)
    {
        $res = User::where("name",$name)->count();
        if($res){
            return response()->json(false);
        }
        return response()->json(true);
}
```
当然对于邮箱的检验也是一样的

这些完成后我们再去前端完成我们的注册方法应该就差不多可以了 但其实并不是

因为注册的前提的是每个字段都符合要求 这样才可以去进行注册这个逻辑 
 
所以在注册按钮添加方法:
```html
<div class="control-group">
    <button
            class="btn btn-primary btn-lg btn-block btn-login-register"
            @click="register($v.newUser)"
    >立即注册
    </button>
</div>
```
这里的`$v.newUser`其实就是所有被检验数据的集合 因为我的`data`是这样被声明的:
```php?start_inline=1
 data(){
    return{
        newUser: {
            name:'',
            email:'',
            password:'',
            confirm_pwd:''
        },
    }
},
```

这样完成好后 最终的注册逻辑被我放在了`register function`里面
```php?start_inline=1
register:function(value){
    value.$touch();//验证所有信息
    if(!value.$error){
        this.axios.post('http://localhost:8000/api/user/register',{user:this.newUser}).then(response => {
          console.log("data = "+response.data.status)
        })
    }
}
```

> 这里的`value.$error`是对所有字段的`$error`的或的结果 只有所有字段的`$error`为`false`时 才能通过检验进行下一步的注册
>
> `value.$touch()` 其实是执行的设置其`$dirty`为`true`这些在文档上也都有介绍

这样我们去走一下整个的注册流程 

- 用户注册
![first](/attachments/images/articles/2017-02-28/first.gif)

我们已经注册过了以为`jason`的用户

- 数据检验
![second](/attachments/images/articles/2017-02-28/second.gif)

#### 资料链接
- [vuelidate网址](https://monterail.github.io/vuelidate/#getting-started)
- [gist地址1](https://gist.github.com/GeekGhc/3acfe4275ca6a6cc7587728ff0018715)
- [gist地址2](https://gist.github.com/GeekGhc/c2e1ebb44f63772c0dc59b04681853bb)