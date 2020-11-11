const openDB = (databaseName, version) => {
    console.log('打开数据库');
    let db;
    const indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
    const request = indexedDB.open(databaseName, version);

    return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
            db = request.result;
            db.isSuccess = true;
            console.log('数据库打开成功');
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            db = event.target.result;
            db.isUpgrade = true;
            console.log('数据库升级成功');
            resolve(db);
        };

        request.onerror = (event) => {
            console.log('数据库打开报错');
            reject(event);
        };
    });
}

export default openDB;
