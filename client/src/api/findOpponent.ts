export const findOpponent = async (id) => {
    const res = await fetch('/opponents/find', {
        method: 'POST',
        body: JSON.stringify({ id }),
        headers: {  'Content-Type': 'application/json' }
    });
    const json = await res.json();
    if (json.opponent) {
        return json.opponent;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    return await findOpponent(id);
};
