---
layout: post
title: 轻松部署你的PHP7运行环境
description: 在部署一个服务器时 我们可以有多种选择 比如apache和nginx 在这些选择之中 每个人都有最终的一个目的就是部署好环境 
            发布自己的项目网站  这里就对Nginx+PHP7+Mysql+phpmyadmin的安装做一个总结
tags:
     PHP
     Nginx
     MySQL
class: post-one
comments: true
poster: /attachments/images/articles/2017-04-28/poster.jpg
---
## 简介

对于有时候服务器的安装部署 每次有的过程忘记总得再把之前的笔记再找出来 现在将整个流程做一个整理
 
结合自己以前遇到的各种坑和实践经验吧  这样也方便以后少浪费点时间在查找各种笔记 :smile:

## 服务目录
- Nginx      /etc/nginx
- Mysql      /var/lib/mysql
- php7.1     /usr/local/php
- php-fpm    /usr/local/bin/php-fpm
- phpmyadmin /data/www/phpmyadmin
- 站点根目录  /data/www/

## 安装nginx

```shell
$ sudo yum install nginx
```

> 这里你可以选择编译安装或者这种仓库的形式安装 编译安装的可选择性更好 你可以安装到指定的目录
>
> 比如我们一般或放在`/usr/local/nginx`


这里采用的是包的安装  此时`nginx`安装在`/etc/nginx` 安装完毕之后

```shell
$ nginx -v
```

`Nginx`服务的一些命令形式
```shell
$ systemctl restart nginx
$ systemctl stop nginx
$ systemctl start nginx
```


## 安装Mysql57
1.下载 `mysql57-community-release-el7-8.noarch.rpm` 的 `YUM` 源：
```shell
$ wget http://repo.mysql.com/mysql57-community-release-el7-8.noarch.rpm
```

2.查看`mysql`源是否安装成功
```shell
$ yum repolist enabled | grep "mysql.*-community.*"
```

3. 安装 `MySQL`(一路Y就可以)：

```shell
$ yum install mysql-community-server
```

4.启动Mysql 
```shell
$ systemctl start mysqld
```

5.设置开机启动
```shell
$ systemctl enable mysqld
$ systemctl daemon-reload
```

6.接下来就是去修改数据库的密码

`mysql`安装完成之后，在`/var/log/mysqld.log`文件中给`root`生成了一个默认密码。通过下面的方式找到`root`默认密码，然后登录`mysql`进行修改：

> 必须为启动`mysql`之后

```shell
$ grep 'temporary password' /var/log/mysqld.log
```

有了这个密码去登录`mysql`
```shell
$ mysql -u root -p
```

> `mysql5.7`默认安装了密码安全检查插件（validate_password），默认密码检查策略要求密码必须包含：
> 大小写字母、数字和特殊符号，并且长度不能少于**8**位。否则会提示ERROR 1819 (HY000): 
> Your password does not satisfy the current policy requirements错误，

所以这里的解决办法就是要么修改的密码满足他的验证规则 如果你想密码不用那么复杂 那么你就可以去关闭这些验证规则

7.在`/etc/my.cnf`文件添加`validate_password_policy`配置，指定密码策略

当然你也可以直接关闭验证
```shell
$ vim /etc/my.cnf
```

接着在末尾添加:
```shell
$ validate_password = off
```

填写完密码之后就可以登录了  接着设置密码:
```shell
$ set password = password("xxxx");
```
8.重启我们的mysql
```shell
$ systemctl restart mysqld
```

接下来我们就可以直接使用刚设置的密码去登录服务器的`mysql`了

9.一些命令
- 启动 MySQL 服务：service mysqld start
- 关闭 MySQL 服务：service mysqld stop
- 重启 MySQL 服务：service mysqld restart
- 查看 MySQL 的状态：service mysqld status  & systemctl status mysqld

10、添加远程登录用户
默认只允许`root`帐户在本地登录，如果要在其它机器上连接`mysql`，必须修改`root`允许远程连接，
或者添加一个允许远程连接的帐户(这种最为理想) 这里我们先给所有用户以权限
```shell
$ grant all privileges on *.* to 'root'@'%' identified by '123456' with grant option;
# root是用户名，%代表任意主机，'123456'指定的登录密码（这个和本地的root密码可以设置不同的，互不影响）
$ flush privileges; # 重载系统权限
$ exit;
```

12.`Centos 7` 防火开启**3306**端口

然后编辑系统的开放端口列表，增加**3306**端口，重启防火墙即可。
```shell
vi /etc/sysconfig/iptables # 加上下面这行规则也是可以的
-A INPUT -p tcp -m state --state NEW -m tcp --dport 3306 -j ACCEPT
```
```shell
$ iptables -I INPUT -p tcp -m state --state NEW -m tcp --dport 3306 -j ACCEPT
```

13.配置默认编码为`utf8`
修改`/etc/my.cnf`配置文件，在[mysqld]下添加编码配置，如下所示：
```shell
[mysqld]
character_set_server=utf8
init_connect='SET NAMES utf8'
```

14 文件目录:

> 存放数据库文件的目录  /var/lib/mysql
>
> 默认配置文件路径：   /etc/my.cnf  
>
> 日志文件：/var/log//var/log/mysqld.log 
>
> 服务启动脚本：/usr/lib/systemd/system/mysqld.service 
>
> socket文件：/var/run/mysqld/mysqld.pid


## 安装phpmyadmin

1.官网下载

[phpmyadmin](https://www.phpmyadmin.net/)

下载完毕之后可以上传到服务器的目录  例如可以放在`/root/phpmyadmin/`

2.进入目录 解压文件
```shell
$ cd /root/phpmyadmin
```

```shell
$ unzip phpMyAdmin-4.7.0-all-languages.zip
```

3.移动解压后的文件到站点根目录(`nginx` 配置的root路径为`/data/www` ) 比如
```shell
$  mv phpMyAdmin-4.7.0-all-languages /data/www/phpmyadmin
```

4.修改文件的拥护者
```shell
$ chown root:root /data/www/phpmyadmin
```

5.这里可能遇到的问题

#### 提示没有发现指定文件

如果不存在/var/mysql则创建
```shell
$ sudo mkdir /var/mysql
```

接着创建一个软连接
```shell
$ sudo ln -s /var/lib/mysql/mysql.sock /var/mysql/mysql.sock
```

如果你找不到你服务器下的文件 可以查找(以上只是我的目录):
```shell
$ sudo find / -name mysql.sock
```
#### 需要一个密文
那么在配置文件填入大于32为的字符串就可以了：
```shell
$cfg['blowfish_secret']='';
```

接着可以在`/etc/nginx`下去创建`phpmyadmin.conf` 内容是:
```php?start_inline=1
location /phpMyAdmin {
    alias /data/www/phpMyAdmin;
    index index.php;
    location ~ ^/phpMyAdmin/.+\.php$ {
        alias /data/www/phpMyAdmin;
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME /data/www$fastcgi_script_name;
        include        fastcgi_params;
    }
}
```

接着你可以在`nginx.conf`里去包含这个配置文件
```php?start_inline=1
 location ~* \.php$ {
            fastcgi_index   index.php;
            fastcgi_pass    127.0.0.1:9000;
            include         fastcgi_params;
            fastcgi_param   SCRIPT_FILENAME    $document_root$fastcgi_script_name;
            fastcgi_param   SCRIPT_NAME        $fastcgi_script_name;
 }
 include /etc/nginx/phpmyadmin.conf;
```

接着你可以访问`http://example.com/phpmyadmin`就可进入`phpmyadmin`操作数据库了

## 编译安装PHP7

1.下载
```php
wget -O php7.tar.gz http://cn2.php.net/get/php-7.1.1.tar.gz/from/this/mirror
```

2.解压`php7`

```shell
$ tar -xvf php7.tar.gz
```

3.进入`php7`目录

```shell
$ cd PHP-7.1.1
```

4.下载相关依赖
```shell
$ yum install -y libxml2 libxml2-devel openssl openssl-devel bzip2 bzip2-devel libcurl libcurl-devel libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel gmp gmp-devel libmcrypt libmcrypt-devel readline readline-devel libxslt libxslt-devel
```

5.当然在编译安装之前 需要下载`gcc`编译
```shell
$ yum install -y gcc
```

6.编译配置
```shell
./configure \ 
--prefix=/usr/local/php \
--with-config-file-path=/usr/local/php/etc \
--exec-prefix=/usr/local/php \
--bindir=/usr/local/php/bin \
--sbindir=/usr/local/php/sbin \
--includedir=/usr/local/php/include \
--libdir=/usr/local/php/lib/php \
--mandir=/usr/local/php/php/man \
--enable-fpm \
--with-fpm-user=nginx \
--with-fpm-group=nginx \
--enable-inline-optimization \
--disable-debug \
--disable-rpath \
--enable-shared \
--enable-soap \
--with-libxml-dir \
--with-xmlrpc \
--with-openssl \
--with-mcrypt \
--with-mhash \
--with-pcre-regex \
--with-sqlite3 \
--with-zlib \
--enable-bcmath \
--with-iconv \
--with-bz2 \
--enable-calendar \
--with-curl \
--with-cdb \
--enable-dom \
--enable-exif \
--enable-fileinfo \
--enable-filter \
--with-pcre-dir \
--enable-ftp \
--with-gd \
--with-openssl-dir \
--with-jpeg-dir \
--with-png-dir \
--with-zlib-dir \
--with-freetype-dir \
--enable-gd-native-ttf \
--enable-gd-jis-conv \
--with-gettext \
--with-gmp \
--with-mhash \
--enable-json \
--enable-mbstring \
--enable-mbregex \
--enable-mbregex-backtrack \
--with-libmbfl \
--with-onig \
--enable-pdo \
--with-mysql=mysqlnd \ 
--with-mysqli=mysqlnd \
--with-pdo-mysql=mysqlnd \                    
--with-zlib-dir \
--with-pdo-sqlite \
--with-readline \
--enable-session \
--enable-shmop \
--enable-simplexml \
--enable-sockets \
--enable-sysvmsg \
--enable-sysvsem \
--enable-sysvshm \
--enable-wddx \
--with-libxml-dir \
--with-xsl \
--enable-zip \
--enable-mysqlnd-compression-support \
--with-pear \
--enable-opcache
```
整理之后可以在服务器里面执行
```shell
./configure  --prefix=/usr/local/php --exec-prefix=/usr/local/php --with-config-file-path=/usr/local/php/etc --bindir=/usr/local/php/bin --sbindir=/usr/local/php/sbin
 --includedir=/usr/local/php/include --libdir=/usr/local/php/lib/php --mandir=/usr/local/php/php/man --enable-fpm --with-fpm-user=nginx --with-fpm-group=nginx 
 --enable-inline-optimization --disable-debug --disable-rpath --enable-shared --enable-soap --with-libxml-dir --with-xmlrpc --with-openssl --with-mcrypt --with-mhash 
 --with-pcre-regex --with-sqlite3 --with-zlib --enable-bcmath --with-iconv --with-bz2 --enable-calendar 
--with-curl --with-cdb --enable-dom --enable-exif --enable-fileinfo --enable-filter --with-pcre-dir --enable-ftp --with-gd --with-openssl-dir --with-jpeg-dir 
--with-png-dir --with-zlib-dir --with-freetype-dir --enable-gd-native-ttf --enable-gd-jis-conv --with-gettext --with-gmp --with-mhash --enable-json --enable-mbstring 
--enable-mbregex --enable-mbregex-backtrack --with-libmbfl --with-onig --enable-pdo --with-mysql=mysqlnd  --with-mysqli=mysqlnd --with-pdo-mysql=mysqlnd  --with-zlib-dir
--with-pdo-sqlite --with-readline --enable-session --enable-shmop --enable-simplexml --enable-sockets
--enable-sysvmsg --enable-sysvsem --enable-sysvshm --enable-wddx --with-libxml-dir --with-xsl --enable-zip --enable-mysqlnd-compression-support --with-pear --enable-opcach
```

从配置中看到
```shell
--prefix=/usr/local/php \
```
所以最终的`php`安装目录为 `/usr/local/php`

配置文件设置
```shell
$ --with-config-file-path=/usr/local/php/etc \
```

配置文件放在`usr/local/php/etc`

7.正式安装
```shell
$ make && make install
```

8.配置环境变量
```shell
$ vi /etc/profile
```

在最后加上(也就是我们安装php存放的路径):
```shell
PATH=$PATH:/usr/local/php/bin
export PATH
```

执行命令使得改动立即生效
```shell
$ source /etc/profile
```

10.配置`php-fpm`
```shell
$  cp php.ini-production /usr/local/php/php.ini

$ cp /usr/local/php/etc/php-fpm.conf.default /usr/local/php/etc/php-fpm.conf

cp /usr/local/php/etc/php-fpm.d/www.conf.default /usr/local/php/etc/php-fpm.d/www.conf

cp sapi/fpm/init.d.php-fpm /usr/local/bin/php-fpm

```

所以我们`php-fpm`的位置为`usr/local/bin/php-fom`

11.配置`php.ini`

需要着重提醒的是，如果文件不存在，则阻止` Nginx` 将请求发送到后端的 `PHP-FPM` 模块， 以避免遭受恶意脚本注入的攻击。
将 `php.ini` 文件中的配置项 `cgi.fix_pathinfo` 设置为 **0** 

```shell
vim /usr/local/php/php.ini
```

定位到 `cgi.fix_pathinfo=` 并将其修改为如下所示
```shell
cgi.fix_pathinfo=0
```


编辑`nginx.conf`
```shell
 vim /etc/nginx/nginx.conf
```

12.`php-fpm`的一些命令形式
```shell
/usr/local/bin/php-fpm [start | stop | reload]
```

## 部署ssl证书
```php?start_inline=1
    server {
        listen       443 ssl http2 default_server;
        server_name  www.example.com;
        root         /data/www;  #站点的根目录

        ssl on;
        ssl_certificate "/usr/ssl/1_www.example.com_bundle.crt";
        ssl_certificate_key "/usr/ssl/2_www.example.com.key";
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  5m;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
            index  index.php  index.html index.htm;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
```

> 这里的证书和解密后的私钥文件放在`/usr/ssl/`目录下  
> 每个证书的提供商可能提供的形式不一样 不过最终我们需要的就是颁发的证书和解密后的私钥文件


### 相关链接文档
Mysql
- [http://www.centoscn.com/mysql/2016/0626/7537.html](http://www.centoscn.com/mysql/2016/0626/7537.html)
- [http://www.linuxidc.com/Linux/2016-09/135288.htm](http://www.linuxidc.com/Linux/2016-09/135288.htm)
- [http://www.linuxidc.com/Linux/2016-06/132676.htm](http://www.linuxidc.com/Linux/2016-06/132676.htm)

PHP
- [http://php.net/manual/zh/install.unix.nginx.php](http://php.net/manual/zh/install.unix.nginx.php)
- [http://www.jb51.net/article/109228.htm](http://www.jb51.net/article/109228.htm)
- [http://blog.csdn.net/dglxsong/article/details/52075918](http://blog.csdn.net/dglxsong/article/details/52075918)
- [http://blog.csdn.net/u014595668/article/details/50188127](http://blog.csdn.net/u014595668/article/details/50188127)

SSL证书
[腾讯云的证书配置](https://www.qcloud.com/document/product/400/4143)
