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