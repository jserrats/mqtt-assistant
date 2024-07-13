export function getEnvVariable(varName: string) {
	if (process.env[varName] === undefined) {
		throw new Error(`Missing environment variable ${varName}`);
	}
	return process.env[varName];
}
