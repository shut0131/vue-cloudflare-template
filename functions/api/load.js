export async function onRequest(context) {
  const { request, env } = context;

  // ユーザーIDの取得
  const userId = request.headers.get('X-User-Id');
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // D1データベースが利用可能か確認
  if (!env.DB) {
    console.error('D1 database not configured');
    // D1が設定されていない場合は空のコンテンツを返す
    return new Response(JSON.stringify({ 
      content: '',
      timestamp: new Date().toISOString(),
      userId: userId
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
      }
    });
  }

  try {
    // ユーザーのドキュメントを取得
    const result = await env.DB.prepare(`
      SELECT content, updated_at
      FROM documents
      WHERE user_id = ?
    `).bind(userId).first();
    
    if (result) {
      return new Response(JSON.stringify({ 
        content: result.content,
        timestamp: result.updated_at,
        userId: userId
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
        }
      });
    } else {
      // ドキュメントが見つからない場合は空のコンテンツを返す
      return new Response(JSON.stringify({ 
        content: '',
        timestamp: new Date().toISOString(),
        userId: userId
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
        }
      });
    }
  } catch (error) {
    console.error('Load error:', error);
    return new Response(JSON.stringify({ error: 'Failed to load: ' + error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
    }
  });
}