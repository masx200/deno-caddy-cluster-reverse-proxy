# deno-caddy-cluster-reverse-proxy

deno-caddy-cluster-reverse-proxy

使用deno,根据需要的服务子进程数量(默认为cpu个数),找到任意空闲的端口,然后启动子进程开启服务进程集群,使用caddy进行反向代理.适用于服务进程是单进程服务,比如说node或者deno.

https://deno.land/

https://caddyserver.com/
