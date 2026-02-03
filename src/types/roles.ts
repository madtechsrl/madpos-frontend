// types/roles.ts
export const ROLES = {
 CASHIER : "7c9e6679-7425-40de-944b-e07fc1f907c9",
  MANAGER : "195dfc25-f5d9-49ed-bed7-82409fe2e7df",
  ADMIN : "7c9e6679-7425-40de-944b-e07fc1f907cb",
} as const;

export type RoleKey  = keyof typeof ROLES;                 // "ADMIN" | "CASHIER" | "MANAGER"
export type RoleUuid = (typeof ROLES)[keyof typeof ROLES]; // cada UUID literal


const ROLE_UUID_TO_KEY: Record<RoleUuid, RoleKey> = (() => {
  const entries = Object.entries(ROLES) as [RoleKey, RoleUuid][];
  return entries.reduce((acc, [k, v]) => {
    acc[v] = k;
    return acc;
  }, {} as Record<RoleUuid, RoleKey>);
})();

function toUpperSafe(s: string): RoleKey | null {
  const upper = s.toUpperCase();
  return (Object.keys(ROLES) as RoleKey[]).includes(upper as RoleKey)
    ? (upper as RoleKey)
    : null;
}

export type UserRole = RoleKey | RoleUuid;

export function isRoleUuid(v: string): v is RoleUuid {
  return (Object.values(ROLES) as string[]).includes(v);
}

export function toRoleUuid(input: UserRole): RoleUuid {
  if (typeof input !== "string") return ROLES.CASHIER;
  // si ya es UUID, devuélvelo
  if (isRoleUuid(input)) return input;
  // si es key, mapea a uuid
  return mapRoleToUuid(input as RoleKey) as RoleUuid;
}


/** Overloads 100% tipados */
export function mapRoleToUuid(input: RoleKey): RoleUuid;
export function mapRoleToUuid(input: string): string;
export function mapRoleToUuid(input: string): string {
  const k = toUpperSafe(input);
  return k ? ROLES[k] : input; // si ya es UUID u otra cosa, lo dejamos igual
}

export function mapUuidToRoleName(uuid: RoleUuid): RoleKey;
export function mapUuidToRoleName(uuid: string): RoleKey | "";
export function mapUuidToRoleName(uuid: string): RoleKey | "" {
  // usamos un índice string para evitar `any` y mantener compatibilidad
  return (ROLE_UUID_TO_KEY as Record<string, RoleKey>)[uuid] ?? "";
}