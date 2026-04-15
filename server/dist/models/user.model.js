import { eq, isNull, and } from 'drizzle-orm';
import { getDb } from '../db/connection.js';
import { users } from '../db/schema.js';
// ── Queries ───────────────────────────────────────────────────────────────────
export async function findUserById(id) {
    const db = getDb();
    const [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.id, id), isNull(users.deletedAt)))
        .limit(1);
    return user;
}
export async function findUserByUsername(username) {
    const db = getDb();
    const [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.username, username), isNull(users.deletedAt)))
        .limit(1);
    return user;
}
export async function findUserByEmail(email) {
    const db = getDb();
    const [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.email, email.toLowerCase()), isNull(users.deletedAt)))
        .limit(1);
    return user;
}
export async function listUsers() {
    const db = getDb();
    return db
        .select()
        .from(users)
        .where(isNull(users.deletedAt))
        .orderBy(users.createdAt);
}
export async function createUser(input) {
    const db = getDb();
    const [user] = await db
        .insert(users)
        .values({
        username: input.username,
        email: input.email.toLowerCase(),
        passwordHash: input.passwordHash,
        role: input.role ?? 'admin',
        mustChangePassword: input.mustChangePassword ?? false,
    })
        .returning();
    if (!user)
        throw new Error('createUser did not return a row');
    return user;
}
export async function updateUser(id, input) {
    const db = getDb();
    const patch = { updatedAt: new Date() };
    if (input.email !== undefined)
        patch.email = input.email.toLowerCase();
    if (input.passwordHash !== undefined)
        patch.passwordHash = input.passwordHash;
    if (input.role !== undefined)
        patch.role = input.role;
    if (input.isActive !== undefined)
        patch.isActive = input.isActive;
    if (input.mustChangePassword !== undefined)
        patch.mustChangePassword = input.mustChangePassword;
    const [updated] = await db
        .update(users)
        .set(patch)
        .where(and(eq(users.id, id), isNull(users.deletedAt)))
        .returning();
    return updated;
}
/** Soft delete */
export async function deleteUser(id) {
    const db = getDb();
    await db
        .update(users)
        .set({ deletedAt: new Date(), isActive: false, updatedAt: new Date() })
        .where(eq(users.id, id));
}
// ── Seguridad / bloqueo de cuenta ─────────────────────────────────────────────
export async function incrementFailedAttempts(id) {
    // Drizzle no soporta UPDATE ... SET col = col + 1 directamente,
    // pero en Neon/PG podemos usar sql`` template.
    const db = getDb();
    const current = await findUserById(id);
    if (!current)
        return;
    await db
        .update(users)
        .set({
        failedLoginAttempts: (current.failedLoginAttempts ?? 0) + 1,
        updatedAt: new Date(),
    })
        .where(eq(users.id, id));
}
export async function lockUserUntil(id, until) {
    const db = getDb();
    await db
        .update(users)
        .set({ lockedUntil: until, updatedAt: new Date() })
        .where(eq(users.id, id));
}
export async function resetFailedAttempts(id) {
    const db = getDb();
    await db
        .update(users)
        .set({
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
        updatedAt: new Date(),
    })
        .where(eq(users.id, id));
}
export async function unlockUser(id) {
    const db = getDb();
    await db
        .update(users)
        .set({ failedLoginAttempts: 0, lockedUntil: null, updatedAt: new Date() })
        .where(eq(users.id, id));
}
//# sourceMappingURL=user.model.js.map