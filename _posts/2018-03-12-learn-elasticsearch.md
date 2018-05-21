---
layout: post
title: Elasticsearch搜索引擎
description: Elasticsearch是一个基于Apache Lucene(TM)的开源搜索引擎。无论在开源还是专有领域，Lucene可以被认为是迄今为止最先进、性能最好的、功能最全的搜索引擎库。
tags:
     PHP
     Elasticsearch
     Api
class: post-one
comments: true
poster: /attachments/images/articles/2018-03-12/poster.png
---
## 简介
`Elasticsearch`是一个基于`Apache Lucene(TM)`的开源搜索引擎。无论在开源还是专有领域，`Lucene`可以被认为是迄今为止最先进、性能最好的、功能最全的搜索引擎库。

但是，`Lucene`只是一个库。想要使用它，你必须使用`Java`来作为开发语言并将其直接集成到你的应用中，更糟糕的是，`Lucene`非常复杂，你需要深入了解检索的相关知识来理解它是如何工作的。

`Elasticsearch`也使用`Java`开发并使用`Lucene`作为其核心来实现所有索引和搜索的功能，但是它的目的是通过简单的`RESTful API`来隐藏`Lucene`的复杂性，从而让全文搜索变得简单。

## 安装
`Elasticsearch`需要`Java8`的运行环境。因此无论你是`windows`平台还是`linux`平台。先确保`Java`环境的安装。可以查看`Oracle`官网查看，这里不做详述。

`Java`环境安装完毕之后就可以去下载`Elasticsearch`。这里我是以`Linux`的环境进行安装。在官网的下载页面[https://www.elastic.co/downloads/elasticsearch](https://www.elastic.co/downloads/elasticsearch)

这里我下载的是**6.2.3**的版本。**6.0**版本更新的还是很多的，这在后面会提到。下载`tar`包:
```shell
$ curl -L -O https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.2.3.tar.gz
```

解压下载的安装包：
```shell
$ tar -xvf elasticsearch-6.2.3.tar.gz
```
进入解压后的文件夹后我们就可以启动`Elasticsearch`
```shell
$ ./elasticsearch
```
如果启动成功你会看到这样的:
![1](/attachments/images/articles/2018-03-12/1.png)

启动一个新的窗口 因为服务的默认端口是**9200** 当然可以自行设置  `http`请求会返回如下
```shell
$ curl -X GET 'localhost:9200/?pretty'
```
![1](/attachments/images/articles/2018-03-12/1.png)

## 基本概念
### 集群(Cluster)
一个集群是由一个或多个节点(服务器)组成的，通过所有的节点一起保存你的全部数据并且提供联合索引和搜索功能的节点集合。每个集群有一个唯一的名称标识，默认是“elasticsearch”。这个名称非常重要，因为一个节点(Node)只有设置了这个名称才能加入集群，成为集群的一部分。

确保你没有在不同的环境下重用相同的名称，否则你最终可能会将节点加入错误的集群。例如你可以使用`dev`，`stage`和`prod`来分别给开发，展示和生产集群命名。

> 一个集群中只有一个节点是有效的并且是非常好的。所以这样的话，你可能需要部署多个集群并且每个集群有它们唯一的集群名称。

### 索引(Index)
一个索引就是含有某些相似特性的文档的集合。例如，你可以有一个用户数据的索引，还有其他的有规则数据的索引。一个索引被一个名称(必须都是小写)唯一标识，并且这个名称被用于索引通过文档去执行索引，搜索，更新和删除操作。

这里的索引其实你就可以理解为`MySQL`中的数据库，因此你在一个集群中可以定义任意多的Index

## 使用
在开始使用`ES`之前可以大概了解一下他与我们平时的关系型数据库的对比
| MySQL        |  ES   |
| --------   | :----: |
| Database（数据库）        |   Index （索引）    |
| Table（表）        |   Type （类型）   |
| Row （行）         |   Document （文档）    |
| Index （索引）       |   Everything Indexed by default （所有字段都被索引））    |
| SQL （结构化查询语言）       |   Query DSL （查询专用语言）    |

> 值得注意的是：Type在6.0.0版本中已经不赞成使用

所以在**6.0**版本以后一个**doc**也就是一个文档是一个可被索引的数据的基础单元。我们完全可以通过类似`/index/doc/:id`这样的形式表现出来

### 基本命令
1.首先我们可以去了解一个集群的阿康状况 使用`_cat API`去查看(包括查看节点索引这些都会使用这个`API`)
```shell
$ curl -X GET 'localhost:9200/_cat/health?v&pretty'
```
> pretty参数 是返回格式的美化 下面不做太多介绍

响应的结果会是这样：
```shell
epoch  timestamp cluster  status node.total node.data shards pri relo init unassign pending_tasks max_task_wait_time active_shards_percent
1475247709 17:01:49  elasticsearch green           1         1      0   0    0    0        0             0                  -                100.0%
```
注意这里的状态为`green` 这里的状态有三种 `red`、`yellow`、`green`
- green - 一切运行正常(集群功能齐全)
- yellow - 所有数据是可以获取的，但是一些复制品还没有被分配(集群功能齐全)
- red  一些数据因为一些原因获取不到(集群部分功能不可用)

2. 查看节点
```shell
$ curl -X GET 'localhost:9200/_cat/nodes?v&pretty'
```
返回的结果为:
```shell
ip        heap.percent ram.percent cpu load_1m load_5m load_15m node.role master name
127.0.0.1           16          94   3    0.01    0.01     0.02 mdi       *      XJCA34j
```
这里可以看到返回的只有一个名为`XJCA34j`的节点 它也是目前集群中唯一的节点

3.列出所有索引
```shell
$ curl -X GET 'localhost:9200/_cat/indices?v&pretty'
```
返回的结果为:
```shell
health status index uuid pri rep docs.count docs.deleted store.size pri.store.size
```
### 使用事例
1.先尝试创建一个索引
```shelll
$ curl -X PUT 'localhost:9200/user?pretty&pretty'
```
返回的结果为:
```shell
{
  "acknowledged" : true,
  "shards_acknowledged" : true,
  "index" : "user"
}
```
再列出所有的索引
```shell
$ curl -X GET 'localhost:9200/_cat/indices?v&pretty'
```
2.插入一条数据(文档)
```shell
curl -X PUT 'localhost:9200/user/doc/1?pretty&pretty' -H 'Content-Type: application/json' -d 
'{"name": "GeekGhc"}'
```
返回的结果为:
```shell
{
  "_index" : "user",
  "_type" : "doc",
  "_id" : "1",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 0,
  "_primary_term" : 1
}
```
从返回的结果我们可以看到这条数据的基本信息 如是在`user`这个`index` `type`为`doc` 并且`id`为**1**

3.获取一条数据
那么查看这条数据时执行
```shell
$ curl -X GET 'localhost:9200/user/doc/1?pretty&pretty'
```
返回的结果为:
```shell
{
  "_index" : "user",
  "_type" : "doc",
  "_id" : "1",
  "_version" : 1,
  "found" : true,
  "_source" : { "name": "GeekGhc" }
}
```
4.修改一条数据
其实修改和插入形式是一样的  如果存在那个`id`那么就会更新之前文档的数据  反之则会增加一条文档数据
```shell
curl -X PUT 'localhost:9200/user/doc/1?pretty&pretty' -H 'Content-Type: application/json' -d 
'{"name": "JellyBean"}'
```
5.删除一条索引(可以理解为删除一个数据库)
```shell
$curl -X DELETE 'localhost:9200/customer?pretty&pretty'
```
在此列出所有索引即可查看到最终效果
6.批处理数据
往往我们会需要批处理一些数据 比如我们需要插入几条数据 这个时候我们需要使用`_bulk API`
举个例子来说就是去插入两条数据
 ```shell
 curl -X POST 'localhost:9200/user/doc/_bulk?pretty&pretty' -H 'Content-Type: application/json' -d'
 {"index":{"_id":"1"}}
 {"name": "Jelly One" }
 {"index":{"_id":"2"}}
 {"name": "Jelly Two" }
 '
 ```
 > 当然也可以同时进行插入和删除等操作
 
 ## 搜索
 在使用搜索之前我们需要一批数据 这里我引用别人的一段`json`数据 其生成工具是[www.json-generator.com](www.json-generator.com)
 
 > json-generator 里面会有字段的定义语法 对着它的帮组文档可以定义你需要的字段
 
 你可以从这里进行[下载](https://raw.githubusercontent.com/elastic/elasticsearch/master/docs/src/test/resources/accounts.json)
 
 下载之后放入当前目录我们就可以加载到集群中
 ```shell
 $ curl -H "Content-Type: application/json" -XPOST 'localhost:9200/bank/account/_bulk?pretty&refresh' --data-binary "@accounts.json"
 ```
 接着再去查看所有索引
 ```shell
$ curl -X GET 'localhost:9200/_cat/indices?v&pretty'
```
这样的话我们就在`bank`这个`Index`中的`account`类型`(type)`下插入了**1000**条数据

### 搜索API
在执行搜索时我们需要的`API`是`_search` 在执行搜索时会有两种方式 一种是通过`url`方式 而另外一种则是通过将请求放入请求体中

这里更推荐所有的请求放入请求体  这样更为友好和解读 就以一个简单的搜索来说

如果是`url`方式  `Curl`请求
```shell
$ curl -X GET 'localhost:9200/bank/_search?q=*&sort=account_number:asc&pretty&pretty'
```

如果是放入请求体中：
```shell
$ curl -X GET 'localhost:9200/bank/_search?pretty' -H 'Content-Type: application/json' -d'
  {
    "query": { "match_all": {} },
    "sort": [
      { "account_number": "asc" }
    ]
  }
  '
```
两者返回结果为:
```shell
{
  "took" : 63,
  "timed_out" : false,
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "skipped" : 0,
    "failed" : 0
  },
  "hits" : {
    "total" : 1000,
    "max_score" : null,
    "hits" : [ {
      "_index" : "bank",
      "_type" : "account",
      "_id" : "0",
      "sort": [0],
      "_score" : null,
      "_source" : {"account_number":0,"balance":16623,"firstname":"Bradshaw","lastname":"Mckenzie","age":29,"gender":"F","address":"244 Columbus Place","employer":"Euron","email":"bradshawmckenzie@euron.com","city":"Hobucken","state":"CO"}
    }, {
      "_index" : "bank",
      "_type" : "account",
      "_id" : "1",
      "sort": [1],
      "_score" : null,
      "_source" : {"account_number":1,"balance":39225,"firstname":"Amber","lastname":"Duke","age":32,"gender":"M","address":"880 Holmes Lane","employer":"Pyrami","email":"amberduke@pyrami.com","city":"Brogan","state":"IL"}
    }, ...
    ]
  }
}
```
对于返回结果的字段的解释如下:
- took - `ES`执行此次搜索所用的时间(单位：毫秒)
- timed_out - 告诉我们此次搜索是否超时
- _shards - 告诉我们搜索了多少分片，还有搜索成功和搜索失败的分片数量
- hits - 搜索结果
- hits.total - 符合搜索条件的文档数量
- hits.hits - 实际返回的搜索结果对象数组(默认只返回前10条)
- hits.sort - 返回结果的排序字段值(如果是按`score`进行排序，则没有)
- hits._score 和 max_score - 目前先忽略这两个字段

#### 查询语法
和很多关系型数据库一样 在查询方面  `ES`也提供了很多查询方法
举个例子来说
```shell
curl -X GET 'localhost:9200/bank/_search?pretty' -H 'Content-Type: application/json' -d'
{
  "query": { "match_all": {} },
  "sort": [
      { "account_number": "asc" }
  ],
  "from": 10,
  "size": 1
}
'
```
这里我一下子列出了几个参数

`match_all`部分简单指定了我们想去执行的查询类型，这里意思就是在索引中搜索所有的文档。`sort`来指定搜索结果的顺序。`size`来指定返回的结果数量。`rom`参数(从**0**开始)指定了从哪个文档索引开始。

这个和`mysql`中的`limit`和`offset`是一个意思。

还有就是在`Laravel`中有一种字段映射，在`MySQL`中返回指定字段  那么只需要在请求体中加入`_source`属性即可:
```shell
curl -X GET 'localhost:9200/bank/_search?pretty' -H 'Content-Type: application/json' -d'
{
  "query": { "match_all": {} },
  "_source": ["account_number", "balance"]
}
'
```
这样的话我们只会返回`account_number`和`balance`两个字段

### 关键字搜索
这是为了应对全文搜索这样的应用场景 下面来搜索`address`字段里有`mill`这个单词的文档集
```shell
curl -X GET 'localhost:9200/bank/_search?pretty' -H 'Content-Type: application/json' -d'
{
  "query": { "match": { "address": "mill" } }
}
'
```
