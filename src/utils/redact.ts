const IP_PATTERN = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
const AUTH_TOKEN_PATTERN = /(_authToken=).+/g;
const SSH_HOSTNAME_PATTERN = /(HostName\s+).+/g;
const SSH_IDENTITY_PATTERN = /(IdentityFile\s+).+/g;

export function redactIPs(text: string): string {
  return text.replace(IP_PATTERN, "[REDACTED]");
}

export function redactNpmTokens(text: string): string {
  return text.replace(AUTH_TOKEN_PATTERN, "$1[REDACTED]");
}

export function redactSshConfig(text: string): string {
  return text
    .replace(SSH_HOSTNAME_PATTERN, "$1[REDACTED]")
    .replace(SSH_IDENTITY_PATTERN, "$1[REDACTED]");
}

export function redactAll(text: string): string {
  return redactIPs(redactNpmTokens(redactSshConfig(text)));
}
