-- ドキュメントテーブルの作成
CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- 更新日時を自動更新するトリガー
CREATE TRIGGER IF NOT EXISTS update_documents_updated_at
AFTER UPDATE ON documents
BEGIN
  UPDATE documents SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_updated_at ON documents(updated_at);