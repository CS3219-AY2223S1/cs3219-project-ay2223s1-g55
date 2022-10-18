export function validateRecord(record) {
    const { questionName, firstUsername, secondUsername } = record;

    if (!questionName) {
        return { ok: false, err: 'Missing questionName.' }
    }

    if (!firstUsername || !secondUsername) {
        return { ok: false, err: 'Missing username(s).' }
    }

    if (firstUsername === secondUsername) {
        return { ok: false, err: "Users provided must be different." }
    }

    return { ok: true };
}