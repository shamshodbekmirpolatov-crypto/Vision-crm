# Security policy

## Reporting a vulnerability

Do not post credentials, student information, exploit details, or security-sensitive findings in public issues or pull requests. Contact the repository owner through a private channel. If GitHub private vulnerability reporting is enabled, use that feature.

## Secrets and access

Never commit API keys, passwords, access tokens, private keys, database exports, student records, production backups, or .env files. Store secrets in the deployment environment or a secure secrets manager. Use least-privilege credentials, rotate any credential exposed in repository history, and keep database policies enforced server-side.

## Changes

Review dependency updates, test changes, and require explicit owner approval before production deployment or sensitive data operations.
