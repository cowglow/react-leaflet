function isEqual(a: any, b: any): boolean {
	if (a === b) return true;

	if (typeof a !== typeof b || typeof a !== 'object' || a === null || b === null) {
		return false;
	}

	const keysA = Object.keys(a);
	const keysB = Object.keys(b);

	if (keysA.length !== keysB.length) {
		return false;
	}

	for (const key of keysA) {
		if (!isEqual(a[key], b[key])) {
			return false;
		}
	}

	return true;
}

export function removeFromCollection<T>(target: T, collection: T[]): T[] {
	return collection.filter((item) => !isEqual(item, target));
}