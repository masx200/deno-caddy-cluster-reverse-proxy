# deno-caddy-cluster-reverse-proxy

deno-caddy-cluster-reverse-proxy

使用`deno`,根据需要的服务子进程数量(默认为`cpu`个数),找到任意空闲的端口,然后启动子进程开启服务进程集群,使用`caddy`进行反向代理.适用于服务进程是单进程服务,比如说`node`或者`deno`.支持`https`和`http`.

https://deno.land/

https://caddyserver.com/

`serve_cluster_reverse_proxy`:启动集群反向代理服务

适用于`Deno` 

https://deno.land/x/masx200_deno_caddy_cluster_reverse_proxy/mod.ts

查看例子:

https://github.com/masx200/deno-caddy-cluster-reverse-proxy/blob/main/test.ts

https://github.com/masx200/deno-caddy-cluster-reverse-proxy/blob/main/hello-world-server.ts

https://github.com/masx200/deno-caddy-cluster-reverse-proxy/blob/main/handler.ts

https://github.com/masx200/deno-caddy-cluster-reverse-proxy/blob/main/main.ts
