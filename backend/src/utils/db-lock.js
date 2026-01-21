/**
 * Simple async lock to prevent overlapping SQLite transactions
 */
class DbLock {
  constructor() {
    this.promise = Promise.resolve();
  }

  acquire() {
    let release;
    const next = new Promise(resolve => {
      release = resolve;
    });
    const current = this.promise;
    this.promise = current.then(() => next);
    return current.then(() => release);
  }
}

const globalLock = new DbLock();

module.exports = {
  acquireLock: () => globalLock.acquire()
};
