---
layout: post
title: PHP中的正则表达式
description: 最近遇到公司的一个emoji表情替换的应用场景 于是我立马想到了这样的一个需求就可以用正则表达式来
                解决 只需要把相应的表情文本替换成表情的地址即可
tags:
     PHP
     正则表达式
     Emoji
class: post-six
comments: true
poster: /attachments/images/articles/2017-06-24/poster.jpg
---

## 简介

最近公司需要App端的网页端的页面分享 在书籍的评论区处 会有遇到`Emoji`表情的解析  当然这在移动端都是以图片的形式存储的

所以在网页端 自然我也需要对评论的内容找那个涉及到评论图片的地方进行解析 当然我的第一反应就是利用正则表达式去解析到

对应的表情代码 然后再去解析成图片的地址

> 相应的解析代码我会放到我的`gist`里 [Emotion.php]()

## 开始
在数据库中用户的评论表情是以一定的文本格式存储的 比如`[dog-00]`,`[拜拜]`这样的形式 那么我们需要对这些特定的格式进行解析成

相应的图片的地址 这样就可以显示出具体的评论内容

1.当然首先对于这些评论图片我们可以放在本地的目录  这里我以安卓端的文件夹目录放在`/img/mipmap`

2.对于评论的获取 这些我们可以在对应的控制器方法中去获取评论 这里给出一个事例:
```php?start_inline=1
$comments = DB::table('posts')
            ->where('book_num', $book->book_num)
            ->join('user', 'user.id', '=', 'posts.uid')
            ->orderBy('posts.release_time', 'desc')
            ->get();
```
这里只是一个对后台评论的获取

3.对于模板的评论内容的展示当然以我们的`html`形式展现 即`{!! $comment->content !!}`

## 关于解析的核心代码
为了功能的解耦 这里我将表情的解析放在一个`Repositories`目录下的`Emotion.php`里

在这个类文件里我写了一个替换方法
```php?start_inline=1
 function replace_emotion($content)
    {

        preg_match_all('/\[[\s\S]+?\]/', $content, $arr);
        $emotions = array(
            "[ej-01]" => 'tieba_emotion_01',
            "[ej-02]" => 'tieba_emotion_02',
            "[ej-03]" => 'tieba_emotion_03',
            "[ej-04]" => 'tieba_emotion_04',
            "[ej-05]" => 'tieba_emotion_05',
            "[ej-06]" => 'tieba_emotion_06',
            "[ej-07]" => 'tieba_emotion_07',
            "[ej-08]" => 'tieba_emotion_08',
            "[ej-09]" => 'tieba_emotion_09',
            "[ej-10]" => 'tieba_emotion_10');
            foreach ($arr[0] as $v) {
                foreach ($emotions as $key => $value) {
                    if($v==$key){
                        $content = str_replace($v, '<img src="/img/mipmap/' . $value . '.png" width="24" height="24"/>', $content);
                        continue;
                    }
                }
            }
            return $content;
    }
```

这里给出其中的一小段实例 这里就是利用正则表达式对类似`[xxxx]`这样的形式 解析成对应的图片路径

## 控制器方法依赖注入
对于写好的方法类 在构造函数里进行依赖注入就是了
```php?start_inline=1
protected $emotion;
public function __construct(Emotion $emotion)
{
    $this->emotion = $emotion;
}
```

所以这样依赖对于获取的评论列表数据的内容都需要进行解析替换 因为返回的是一个`collection` `so` 我们通过`map`处理
```php?start_inline=1
$collections = $comments->map(function($item,$key){
   $item->content = $this->emotion->replace_emotion($item->content);
});
```

这样一来在评论文本中如果有类似`[ej-02]`这样的形式就会解析成对应的表情图片