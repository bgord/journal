# Backend code style
- Domain-Driven Design (with clear domain and application service layer separation)
- Event Sourcing
- CQRS
- Clean Code
- Design Patterns

# Workflow
- Always test the introduced changes, following the existing testing structure
- Prefer running single tests, and not the whole test suite, for performance using `bun test <file path>`
- Be sure to typecheck when you’re done making a series of code changes using bgord-scripts/typecheck.sh
