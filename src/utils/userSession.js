// ユーザーセッション管理

// UUIDv4生成
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ユーザーIDの取得または生成
export function getUserId() {
  let userId = localStorage.getItem('user_id');
  
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem('user_id', userId);
  }
  
  return userId;
}

// セッション情報の取得
export function getSessionInfo() {
  const userId = getUserId();
  const lastVisit = localStorage.getItem('last_visit') || new Date().toISOString();
  
  // 最終訪問日時を更新
  localStorage.setItem('last_visit', new Date().toISOString());
  
  return {
    userId,
    lastVisit,
    isAnonymous: true
  };
}