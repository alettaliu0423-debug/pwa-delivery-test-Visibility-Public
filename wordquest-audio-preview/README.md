# WordQuest 3B 六词美音试听

版本：WQ-3B-SAMPLE-0.1.0。等待家长试听，未替换正式音频。

## 平板直接在线播放

[打开A/B独立试听网页](https://alettaliu0423-debug.github.io/pwa-delivery-test-Visibility-Public/wordquest-audio-preview/)

点击“播放 A”或“播放 B”，可暂停、继续和从头重播，切换时自动暂停上一段。
不需要登录、下载、安装软件或使用开发工具。

如果曾安装旧测试PWA，请先打开[原测试站根网址](https://alettaliu0423-debug.github.io/pwa-delivery-test-Visibility-Public/)，
在那里点击“联网检查更新”，待PWA-TEST-0.1.2就绪后点击“启用新版本并重新载入”，
再打开试听网址。旧SW可能把试听子路径返回为原首页，请回到上述根网址操作更新，
不要在被拦截的子路径页面寻找更新入口。
不要清除缓存或网站数据。播放与音质仍须华为平板实际验收。

[阅读六词教学预览](teaching-preview.md)

两段顺序相同：crystal、happy、feather、ribbon、mineral、curious；
每词依次播放单词、代表例句、代表搭配。均为合成美音，en-US，速度1.0，
不是独立真人录音，也没有自动发音质量评分。请比较自然度、元辅音、重音、词尾和节奏。

## 文件校验

| 文件 | 字节数 | SHA-256 |
| --- | ---: | --- |
| sampler-A.mp3 | 325484 | `d1a8afc6eb8ad94bd2d8ffe81b3d22c2897282be0a4bed79ec8e2fe31eec879b` |
| sampler-B.mp3 | 316844 | `018d2337a667459d813ea4022930846ad91a297504496702d5ea8966e7fdea65` |

所有音频、教学内容和许可记录均复制自已审核的3B本地样包，
审核提交：`ed99666c76b43f438d2ac65eb4d6ce3cef978608`。
本目录README仅用于交付导航，未重新合成、剪辑、转码或替换任何音频。

[音源、模型和许可说明](licenses/README.md)；
[Apache-2.0通知](licenses/kokoro-APACHE-2.0.txt)；
[MIT通知](licenses/kokoro-onnx-MIT.txt)。
原始 `audio-manifest.json` 记录完整审核样包的36条片段及两段合辑；
本目录只提供两段合辑，清单中的其他单条音频未上传。

此目录公开可读，不包含个人信息、学习记录、数据库、录音采集或备份。
试听页通过现有GitHub Pages发布。原测试PWA保持计数、离线与用户确认更新功能；
Service Worker对试听目录放行。试听页不注册自己的Service Worker，不读写数据库。

请反馈：A / B / 都不满意，以及具体需要重做的词或句子。
未经试听确认，不替换正式WordQuest音频。
