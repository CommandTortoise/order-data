export async function onRequestPost({ request, env }) {
    try {
        const { dish, remark } = await request.json();
        if (!dish) {
            return new Response(JSON.stringify({ success: false, message: '菜品不能为空' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const kv = env.MY_KV;
        const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const orderData = {
            dish,
            remark: remark || '无备注',
            status: 'new',
            time: new Date().toISOString()
        };

        await kv.put(orderId, JSON.stringify(orderData));

        return new Response(JSON.stringify({ success: true, orderId }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}