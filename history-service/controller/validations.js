export function validateRecord(record) {
    const { questionId, firstUserId, secondUserId } = record;

    if (!questionId) {
        return { ok: false, err: 'Missing questionId.' }
    }

    if (!firstUserId || !secondUserId) {
        return { ok: false, err: 'Missing user id(s).' }
    }

    if (firstUserId === secondUserId) {
        return { ok: false, err: "Users provided must be different." }
    }

    return { ok: true };
}