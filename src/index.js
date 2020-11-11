import openDB from './openDB';
import addErrorLog from './error';

const databaseName = 'log';
const version = 1;

class IDBLog {
    constructor(option = {}) {
        const { refresh = false } = option;
        this.refresh = refresh;
        this.db = null;

        this.#startLog();
    }

    #startLog = async () => {
        try {
            this.db = await openDB(databaseName, version);

            console.log('---this.db: ', this.db);
            if (this.db.isUpgrade) {
                console.log('----- 更新回调 -----');
                this.#startLogError();
                this.#startLogPerformance();
            } else {
                console.log('----- 成功回调 -----');
            }

            this.#refreshStores();
        } catch (e) {
            console.log('startLog error: ', e);
        }
    }

    #getObjectStore = (storeName, mode) => {
        const tx = this.db.transaction(storeName, mode);
        return tx.objectStore(storeName);
    }

    #refreshStores = () => {
        if (this.refresh && !this.db.isUpgrade) {
            // 清空数据库
            const store = this.#getObjectStore('log', 'readwrite');
            store.clear();
        }
    }

    #startLogError = () => {
        let objectStore;
        if (!this.db.objectStoreNames.contains('log')) {
            objectStore = this.db.createObjectStore('log', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('message', 'message', { unique: false });
        }
    }

    #startLogPerformance = () => {}

    /**
     * @description 错误记录
     * @param err 错误对象
     * @param level 错误等级
     * @memberof IDBLog
     */
    logError = (err = {}, level = 3) => {
        const { message } = err;

        const stack = err.stack || (err.error && err.error.stack);

        if (window.AppShare && window.isMobile.AppClient()) {
            appShare(79,{
                type: level,
                log: {
                    error: JSON.stringify(stack),
                    info: ''
                }
            })
        } else {
            const stack1_2 = stack.split('at');
            const data = {
                message,
                stack: stack1_2[0] + stack1_2[1],
                level
            };

            const store = this.#getObjectStore('log', 'readwrite');

            addErrorLog(store, data);
        }
    }

    getLog = () => {
        return new Promise((resolve, reject) => {
            const store = this.#getObjectStore('log', 'readwrite');

            const req = store.getAll();

            req.onsuccess = () => {
                const file = new File([JSON.stringify(req.result)], "log.txt", {
                    type: "text/plain",
                });

                console.log('logFile: ', file);
                resolve(file);
            }

            req.onerror = () => {
                reject('获取错误');
            }
        });
    }
}

export default IDBLog;
