export async function onRequestGet({ env }) {
    try {
        const kv = env.MY_KV;
        const orders = [];
        let cursor;

        do {
            const result = await kv.list({ cursor, limit: 200 });
            for (const key of result.keys) {
                const value = await kv.get(key.name, 'json');
                if (value) {
                    orders.push({ id: key.name, ...value });
                }
            }
            cursor = result.cursor;
        } while (cursor);

        // 按时间倒序排列（最新的在前）
        orders.sort((a, b) => new Date(b.time) - new Date(a.time));

        return new Response(JSON.stringify(orders), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify([]), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}