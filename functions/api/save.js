export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

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
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const data = await request.json();
    
    // ドキュメントの保存または更新
    const result = await env.DB.prepare(`
      INSERT INTO documents (user_id, content, updated_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) 
      DO UPDATE SET 
        content = excluded.content,
        updated_at = CURRENT_TIMESTAMP
    `).bind(userId, data.content).run();
    
    console.log('Document saved for user:', userId);
    
    return new Response(JSON.stringify({ 
      success: true, 
      userId: userId,
      affectedRows: result.meta.changes
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
      }
    });
  } catch (error) {
    console.error('Save error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save: ' + error.message }), {
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
    }
  });
}