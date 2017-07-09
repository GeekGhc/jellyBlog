---
layout: post
title: Mint-UI结合laravel实现内容加载更多
description: 很多时候我们会遇到就是点击或者当页面滑到底部加载数据  因为一次性加载数据不仅对内存响应造成一定的影响 当然这样的
            记载更多的方式给用户的体验也会比较好
tags:
     Mint
     Vue
     Laravel
class: post-seven
comments: true
poster: /attachments/images/articles/2017-07-02/poster.jpg
---

## 简介

我们经常会遇到这样的一个场景就是对于一些消息和列表的显示 因为数据太多如果一次性显示出来的话无论是对内存还网站的响应时间

都会造成一定的影响 所以很多时候我们的解决方案是一次性加载固定条数的数据显示 可以给用户一个加载更多的链接或者当用户滑动到页面

底部时继续加载  这样的话一个页面不会充斥太多内容 用户的体验也会不错

那么对于实现这样的按需加载  我在最近处理的一个消息显示时就以Mint-UI结合laravel来实现了数据的按需加载  最后的实现效果就是

当页面滑动到底部指定距离时再去加载数据

## 下载第三方包
1.下载第三方依赖包(Vue 2.0)
```shell
$ npm install mint-ui -S
```
2.引用组件
在`resource/assets/js/app.js`里引用
```php?start_inline=1
//引入mint-ui
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI);
```
3.引入`axios`以实现`api`请求
```shell
$ npm install --save axios vue-axios
```
然后注入`axios`依赖包
```php?start_inline=1
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
```

## 在Vue组件里使用
对于现实消息我这里以一个评论展示为例  所以在`resource/assets/js/components`目录下新建Comment.Vue文件

这里当然根据每个人需要的而现实消息来定 当然在实现下拉加载时 我们需要用到的是`Mint-UI`的[InfiniteScroll](http://mint-ui.github.io/docs/#/en2/infinite-scroll)

按着官方给出的demo实例我们在组件的Vue文件中引入进来
```php?start_inline=1
import { InfiniteScroll } from 'mint-ui';
```
其中在列表显示时我们要去定义他们的父标签  在这个父标签中我们有几个方法需要声明
- v-infinite-scroll 记载时会触发的方法
- infinite-scroll-disabled 记录是否要触发加载函数
- infinite-scroll-distance 指定多少距离触发加载方法

这里我先给出我项目里的评论的展示组件`Commetn.Vue`
```php?start_inline=1
 <div class="comments-list">
        <ul class="lists"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10"
            v-if="comments">
            <li class="item"
                v-for="comment in comments">
                <div class="user-avatar">
                    <img :src="comment.head">
                </div>
                <div class="comment-info">
                    <div class="head-info">
                        <span class="name">{{comment.nickname}}</span>
                        <span class="post-time">{{comment.release_time}}</span>
                    </div>
                    <div class="content-title">
                        <p>{{comment.title}}</p>
                    </div>
                    <div class="content-text">
                        <p v-html="comment.content"></p>
                    </div>
                </div>
            </li>
        </ul>
        <div class="loading-div" v-if="is_loading">
            <div class="loading">
                <div class="loader" title="5">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                         width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                        <rect x="0" y="13" width="4" height="5" fill="#333">
                            <animate attributeName="height" attributeType="XML"
                                     values="5;21;5"
                                     begin="0s" dur="0.6s" repeatCount="indefinite" />
                            <animate attributeName="y" attributeType="XML"
                                     values="13; 5; 13"
                                     begin="0s" dur="0.6s" repeatCount="indefinite" />
                        </rect>
                        <rect x="10" y="13" width="4" height="5" fill="#333">
                            <animate attributeName="height" attributeType="XML"
                                     values="5;21;5"
                                     begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                            <animate attributeName="y" attributeType="XML"
                                     values="13; 5; 13"
                                     begin="0.15s" dur="0.6s" repeatCount="indefinite" />
                        </rect>
                        <rect x="20" y="13" width="4" height="5" fill="#333">
                            <animate attributeName="height" attributeType="XML"
                                     values="5;21;5"
                                     begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                            <animate attributeName="y" attributeType="XML"
                                     values="13; 5; 13"
                                     begin="0.3s" dur="0.6s" repeatCount="indefinite" />
                        </rect>
                    </svg>
                </div>
                <div class="loading-text">加载中。。。</div>
            </div>
        </div>
 </div>
```

还有其相应的加载方法
```php?start)inline=1
<script>
    import { InfiniteScroll } from 'mint-ui';
    export default{
        props:['post_num'],
        data(){
            return{
                comments:[],
                is_loading:true,
                count:1,
                is_finished:false
            }
        },
        components:{

        },
        created(){
            this.initData()
        },
        methods:{
            loadMore() {
                this.is_loading = true
                if(!this.is_finished){//如果还有数据可以加载
                    setTimeout(() => {
                        Vue.axios.get('/api/postl?bookNum='+this.post_num+'&&count='+this.count).then(response => {
                              if(response.data.code){
                                 if(response.data.comments.length){
                                     let last = response.data.comments.length
                                     for(let i = 0;i<last;i++){
                                         this.comments.push(response.data.comments[i])
                                     }
                                     console.log(this.comments.length+" newData = "+this.count)
                                     this.count++
                                 }else{
                                     this.is_finished = true
                                 }
                              }else{
                                 console.log("error....")
                              }
                        })

                    }, 1000);
                }else{
                    this.is_loading = false
                }
            },
            initData(){
                Vue.axios.get('/api/post?postNum='+this.post_num).then(response => {
                      if(response.data.code){
                          this.comments = response.data.comments
                          console.log(this.comments.length+" data = "+response.data.code)
                      }else{
                         console.log("error....")
                      }
                })
            }
        }
    }
</script>
```
这里的`loadMore`方法只是在1秒后触发加载数据 写完之后去`app.js`注册一下这个`component`
```php?start_inline=1
Vue.component('post-comment', require('./components/Comment.vue'));
```
所以这时候在需要的视图文件里给出`<post-comment post_num="{{$post->post_num}}"></post-comment>`

## 完善api请求
在此之前我们已经写好了`Vue`组件 当然我们在触发的加载函数里去请求的后端请求我们可以在`api.php`里去完成

具体的`api`请求因业务需求不同而不同  这里就不再累赘

写完这些我们需要将之前的组件打包  这里因为我用的是**5.4**版本  `Laravel`以`webpack`替代了原先的`gulp`

所以在`webpack.mix.js`文件里声明
```php?start_inline=1
mix.browserSync('my-domain.dev');

mix.js('resources/assets/js/app.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css')
    .version();
```

还是执行`npm run dev`  打包之后在视图的文件里引如打包后的文件
```php?start_inline=1
<script src="{{mix('js/app.js')}}"></script>
```

## 相关网址
- [Mint-UI](http://mint-ui.github.io/#!/zh-cn)
- [Vuw-axios](https://github.com/imcvampire/vue-axios)