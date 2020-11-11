# 日志记录小组件

## 为什么使用npm管理

因为多个项目同时使用，抽离出去管理更好，使用更简单，里面集成AppShare方法，适配以前的日志写入逻辑

## 怎么使用

```
    import idblog from 'idblog/dist/index';
    window.wgLog = new idblog();

    // 记录日志
    wgLog.logError(error, level);

    // 获取日志
    const logFile = await wgLog.getLog();

    // 清空日志
    new idblog({ refresh: true });
```
