# Backend code style
- Domain-Driven Design (with clear domain and application service layer separation)
- Event Sourcing
- CQRS
- Clean Code
- Design Patterns

# Workflow
- @bgord/bun is used for Hono/Bun services and middlewares
- @bgord/tools is a set of reusable Value Objects and Services with no runtime dependencies
- Always respect the project structure, follow established patterns for all DDD building blocks
- When you encounter an existing file when asked to create something, update the file without breaking the rest of the module
- Always test the introduced changes, following the existing testing structure bgord-scripts/test-run.sh
- Always typecheck the introduced changes using bgord-scripts/typecheck.sh
