# deno-caddy-cluster-reverse-proxy

https://deno.land/x/masx200_deno_caddy_cluster_reverse_proxy/mod.ts

适用于`Deno`的分布式微服务注册与发现服务器和客户端.

`RegistryServer`:启动服务注册中心的服务器的函数,参数`check_auth_token`是检查身份令牌的函数,

`RegistryStorage`:表示注册表存储的接口,可以是内存存储,也可以是分布式数据库存储,或者文件存储.

`MemoryRegistryStorage`:创建内存注册表存储对象.

`ServerInformation`:微服务的信息的接口,`health_url`表示健康检查的`URL`,健康检查只需要得到状态码`200`就认为服务在正常运行,`name`表示微服务的名称,`address`表示微服务的网址,包含协议,主机名,端口.

`create_middleware`:创建一个服务注册中心的中间件的函数

`start_health_check`:启动定时对微服务健康检查的函数.

`health_check_with_storage`:对微服务进行一次健康检查的函数.

`client_register`:微服务向注册中心发送一次注册请求的函数.

`client_unregister`:微服务向注册中心发送一次取消注册请求的函数.

`client_start_heart_beat`:启动微服务定时向注册中心发送注册请求的函数.

`client_getAllServerInformation`:获得所有微服务的信息的函数.

`client_getServerInformation`:获得指定网址的微服务信息的函数.

`client_getAllServiceNames`:获得所有微服务的名称的列表的函数.

`client_getAllAddress`:获得指定名称的所有微服务的网址.

`MapWithExpires`:带有超时删除的功能的`Map`.

关于使用`caddy`从服务注册中心获取服务的地址进行反向代理,可以查看这个讨论

https://caddy.community/t/can-reverse-proxy-to-dynamic-upstreams-by-http/16338
