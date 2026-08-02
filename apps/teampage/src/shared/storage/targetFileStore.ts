// 파일로 유저 지정 발송 시 첨부한 원본 파일을 로컬(IndexedDB)에 보관한다.
// 감사 목적: "그때 누구에게 보낸 건지" 나중에 확인할 수 있어야 하므로, 발송/예약이
// 확정된 시점의 원본 파일과 발송 맥락(제목/메시지/인원수)을 함께 남긴다.
// 보관 기간은 3개월(90일)로 제한하고, 기간이 지난 파일은 자동으로 폐기한다.
// 실 백엔드 연동 시에는 이 파일이 아니라 서버(오브젝트 스토리지) 쪽에 동일한 정책으로
// 저장하도록 옮겨야 한다 — 지금은 로컬 프로토타입이라 브라우저 IndexedDB로 대체한 것.

const DB_NAME = 'uoslife-notification-target-files';
const DB_VERSION = 1;
const STORE_NAME = 'files';
export const TARGET_FILE_RETENTION_DAYS = 90;

export interface StoredTargetFile {
  id: number;
  fileName: string;
  blob: Blob;
  title: string;
  message: string;
  recipientCount: number;
  deliveryType: 'IMMEDIATE' | 'SCHEDULED';
  occurredAt: number;
}

const isIndexedDbAvailable = () => typeof window !== 'undefined' && 'indexedDB' in window;

const openDb = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const saveTargetFile = async (record: StoredTargetFile): Promise<void> => {
  if (!isIndexedDbAvailable()) return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getTargetFile = async (id: number): Promise<StoredTargetFile | undefined> => {
  if (!isIndexedDbAvailable()) return undefined;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve(req.result as StoredTargetFile | undefined);
    req.onerror = () => reject(req.error);
  });
};

/** 보관 기간(3개월)이 지난 원본 파일을 폐기한다. 삭제된 건수를 반환한다. */
export const purgeExpiredTargetFiles = async (): Promise<number> => {
  if (!isIndexedDbAvailable()) return 0;
  const db = await openDb();
  const cutoff = Date.now() - TARGET_FILE_RETENTION_DAYS * 24 * 60 * 60 * 1000;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    let deleted = 0;
    const cursorReq = store.openCursor();
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (cursor) {
        const record = cursor.value as StoredTargetFile;
        if (record.occurredAt < cutoff) {
          cursor.delete();
          deleted += 1;
        }
        cursor.continue();
      }
    };
    tx.oncomplete = () => resolve(deleted);
    tx.onerror = () => reject(tx.error);
  });
};
