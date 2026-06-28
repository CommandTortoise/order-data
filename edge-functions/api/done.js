export async function onRequestPost({ request, env }) {
    try {
        const { orderId } = await request.json();
        if (!orderId) {
            return new Response(JSON.stringify({ success: false, message: '订单ID不能为空' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const kv = env.MY_KV;
        const raw = await kv.get(orderId);
        if (!raw) {
            return new Response(JSON.stringify({ success: false, message: '订单不存在' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const order = JSON.parse(raw);
        order.status = 'done';
        await kv.put(orderId, JSON.stringify(order));

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, message: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}