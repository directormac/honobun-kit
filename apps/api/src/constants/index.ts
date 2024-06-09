const USER_ROLES = ['admin', 'user'] as const;

type UserRole = (typeof USER_ROLES)[number];

const adminRoutes = USER_ROLES.filter((role) => role !== 'user');

const checkAccess = (role: UserRole, allowedRoles: UserRole[]): boolean => {
	return allowedRoles.includes(role);
};

export type { UserRole };

export { USER_ROLES, adminRoutes, checkAccess };
