# 思路

**伪造一个 emby 授权响应网站，瞒骗 emby 服务端程序取得 Emby Premiere 资格**

具体原理分析查阅：https://imrbq.cn/exp/emby_hack.html

本项目是按文章所述方法，使用 Docker Compose 编排整合
以实现简单一键部署

<img src="https://github.com/fejich/docker-embyhack/raw/main/working.jpg">

---

# 使用方法


### 1）拉取本项目相关文件
```
git clone https://github.com/fejich/docker-embyhack.git && cd docker-embyhack
```


### 2）embyhack 目录内的 docker-compose.yml 文件是配置，按自己实际情况修改
```
---
version: "2.1"
services:
  nginx:
    image: linuxserver/nginx

    # 两个容器间互联，实现免改 hosts/DNS
    # 指定 emby 服务端访问本地伪造的 mb3admin.com 网站
    container_name: mb3admin.com

    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
    volumes:
      # nginx 的配置目录，已经部署好伪造证书与 emby 授权的响应
      - ./nginx:/config
    restart: unless-stopped
# 单纯破解与该容器互联的 emby 服务端情况下，无需映射 https 的 443 端口出来
#    ports:
#      - 443:443

  emby:
    image: linuxserver/emby
    depends_on:
      - nginx
    container_name: emby
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Asia/Shanghai
    volumes:
      # 在后台替换付费信息，防止浏览器直接请求远端付费认证服务
      - ./crypto.js:/app/emby/dashboard-ui/modules/polyfills/crypto.js:ro

      # 将添加了 伪造 CA 证书 的信任列表，替换到容器内
      - ./ca-certificates.crt:/etc/ssl/certs/ca-certificates.crt:ro

      # 将添加了 伪造 CA 证书 的信任列表，替换到容器内（emby 的 c# 环境）
      - ./emby-ca-certificates.crt:/app/emby/etc/ssl/certs/ca-certificates.crt:ro

      # emby 的配置目录
      - ./emby:/config

      # 按需配置媒体目录
      - ./data:/data

    ports:
      - 8096:8096
    devices:
      - /dev/dri:/dev/dri
    restart: unless-stopped

# 其他参数的具体含义，请查阅容器的官方文档
# 使用到的 nginx 容器       https://hub.docker.com/r/linuxserver/nginx
# 使用到的 emby 容器        https://hub.docker.com/r/linuxserver/emby

```


### 3）运行命令 docker-compose 命令一键部署
```
cd embyhack
sudo docker-compose up -d
```
