const addErrorLog = (store, data) => {
    let req = {};

    try {
        req = store.add(data);
    } catch (e) {
        console.log('addErrorLog error: ', e);
    }

    req.onsuccess = e => {
        if (process.env.NODE_ENV === 'development')
            console.log('日志添加成功');
    };
    req.onerror = e => {
        console.log('addErrorLog error: ', e);
    };
}

export default addErrorLog;
