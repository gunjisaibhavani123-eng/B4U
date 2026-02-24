
# B4USpend Backend Coding Standards

**Tech Stack:** FastAPI + Python 3.12 + SQLite  
**Version:** 1.0  
**Last Updated:** February 2026

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Architecture](#project-architecture)
3. [Core Principles](#core-principles)
4. [Design Patterns](#design-patterns)
5. [File and Function Size Guidelines](#file-and-function-size-guidelines)
6. [Code Organization Standards](#code-organization-standards)
7. [API Design Guidelines](#api-design-guidelines)
8. [Database Standards](#database-standards)
9. [Service Layer Architecture](#service-layer-architecture)
10. [Error Handling](#error-handling)
11. [Security Standards](#security-standards)
12. [Testing Requirements](#testing-requirements)
13. [Performance Standards](#performance-standards)
14. [Documentation Requirements](#documentation-requirements)
15. [Code Review Checklist](#code-review-checklist)

---

## Technology Stack

### Core Technologies

- **Framework:** FastAPI (latest stable)
- **Language:** Python 3.12
- **Database:** SQLite (development/small-scale deployment)
- **ORM:** SQLAlchemy
- **Migration:** Alembic
- **Validation:** Pydantic v2
- **Authentication:** JWT (PyJWT)
- **Testing:** pytest, pytest-asyncio

### Why This Stack?

- **FastAPI:** High performance, automatic API documentation, type hints, async support
- **Python 3.12:** Latest features, improved performance, better type hints
- **SQLite:** Lightweight, serverless, zero configuration, perfect for MVP
- **SQLAlchemy:** Mature ORM, type-safe, excellent query builder
- **Pydantic:** Data validation, serialization, automatic documentation

---

## Project Architecture

### 1. Feature-Based Architecture

Organize code by business features/domains rather than technical layers.

#### Directory Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application entry point
│   ├── config.py               # Configuration management
│   ├── database.py             # Database connection and session
│   ├── dependencies.py         # Dependency injection
│   │
│   ├── features/               # Feature modules
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── router.py       # API endpoints
│   │   │   ├── service.py      # Business logic
│   │   │   ├── models.py       # Database models
│   │   │   ├── schemas.py      # Pydantic schemas
│   │   │   ├── repository.py   # Data access layer
│   │   │   └── utils.py        # Feature utilities
│   │   │
│   │   ├── users/
│   │   ├── expenses/
│   │   ├── financial_health/
│   │   ├── goals/
│   │   ├── budgets/
│   │   ├── spending_nudge/
│   │   └── education/
│   │
│   ├── shared/                 # Shared/common code
│   │   ├── middleware/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── exceptions/
│   │   ├── schemas/
│   │   └── models/
│   │
│   └── core/                   # Core functionality
│       ├── security.py
│       ├── logging.py
│       └── cache.py
│
├── tests/                      # Test suite
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── alembic/                    # Database migrations
│   └── versions/
│
├── scripts/                    # Utility scripts
├── requirements.txt
└── .env.example
```

#### Feature Module Structure

Each feature should contain:

- **router.py** - API endpoints and route definitions
- **service.py** - Business logic and orchestration
- **models.py** - SQLAlchemy database models
- **schemas.py** - Pydantic request/response schemas
- **repository.py** - Database queries and data access
- **utils.py** - Feature-specific utilities
- **exceptions.py** - Feature-specific exceptions (optional)

### 2. Layered Architecture Within Features

Each feature follows a three-layer architecture:

**Presentation Layer (Router)**
- Handle HTTP requests and responses
- Input validation via Pydantic
- Authentication and authorization
- Call service layer methods
- Return appropriate HTTP status codes

**Business Logic Layer (Service)**
- Implement all business rules
- Orchestrate repository operations
- Handle transactions
- Apply domain logic
- No HTTP concerns
- Framework-agnostic

**Data Access Layer (Repository)**
- Database queries using SQLAlchemy
- CRUD operations
- Complex queries and joins
- Data mapping
- No business logic

### 3. Benefits

- **Scalability:** Easy to add new features independently
- **Maintainability:** Related code is co-located
- **Testability:** Clear separation enables isolated testing
- **Team Collaboration:** Teams can work on features without conflicts
- **Reusability:** Shared components clearly separated
- **Migration Path:** Easy to move to microservices if needed

---

## Core Principles

### 1. DRY (Don't Repeat Yourself)

**Apply DRY at all levels:**

- Extract repeated validation logic into shared schemas
- Create base repository classes for common CRUD operations
- Use utility functions for common operations
- Centralize configuration and constants
- Create reusable middleware
- Share common exception handlers
- Extract repeated query patterns

**Where to Apply:**

- Validation rules → Pydantic schemas/validators
- Database queries → Repository methods
- Business rules → Service methods
- Response formatting → Response models
- Error handling → Exception classes
- Authentication checks → Dependencies

### 2. SOLID Principles

#### Single Responsibility Principle (SRP)

**Each module should have one reason to change:**

- Routers handle only HTTP concerns
- Services contain only business logic
- Repositories handle only data access
- Models define only database structure
- Schemas define only data validation
- Each file addresses one feature aspect

**File Responsibility:**

- `router.py` → Route definitions and HTTP handling
- `service.py` → Business logic implementation
- `repository.py` → Database operations
- `models.py` → Database schema
- `schemas.py` → Data validation and serialization
- `utils.py` → Helper functions

#### Open/Closed Principle (OCP)

**Open for extension, closed for modification:**

- Use dependency injection for flexibility
- Create abstract base classes for extensions
- Use strategy pattern for varying behaviors
- Design pluggable authentication mechanisms
- Create extensible middleware
- Use configuration for behavior changes

**Extension Points:**

- Custom validators in Pydantic schemas
- Pluggable repository implementations
- Configurable middleware
- Strategy-based business rules
- Event handlers for side effects

#### Liskov Substitution Principle (LSP)

**Subtypes must be substitutable for base types:**

- Repository implementations must honor base contracts
- Service classes must maintain interface consistency
- Exception hierarchies must preserve semantics
- Response models must be compatible
- Dependency implementations must work interchangeably

**Implementation:**

- Use abstract base classes
- Define clear interfaces
- Document expected behavior
- Maintain consistent error handling
- Honor method signatures

#### Interface Segregation Principle (ISP)

**Clients shouldn't depend on interfaces they don't use:**

- Create focused service methods
- Split large repositories into smaller ones
- Design minimal dependency interfaces
- Avoid god objects
- Create specific schemas for specific use cases

**Application:**

- Separate read and write repositories if needed
- Create request-specific schemas
- Design minimal service interfaces
- Use focused dependencies

#### Dependency Inversion Principle (DIP)

**Depend on abstractions, not concretions:**

- Services depend on repository interfaces
- Use dependency injection throughout
- Abstract external service integrations
- Create interfaces for third-party services
- Inject configuration rather than importing

**Benefits:**

- Easy to test with mocks
- Simple to swap implementations
- Reduced coupling
- Enhanced testability

### 3. Business Logic in Service Layer

**All business logic must reside in the service layer:**

- Routers should only handle HTTP concerns
- Repositories should only handle data access
- Services orchestrate and implement business rules
- Keep services framework-agnostic
- Services should be testable without HTTP context

**Service Layer Responsibilities:**

- Validate business rules
- Orchestrate multiple repository calls
- Handle transactions
- Apply domain logic
- Calculate derived values
- Enforce constraints
- Manage state transitions
- Coordinate side effects

**What Doesn't Belong in Service:**

- HTTP request/response handling → Router
- SQL queries → Repository
- Data validation → Pydantic schemas
- Database transactions (mechanics) → Repository
- Authentication checks → Dependencies/Middleware

---

## Design Patterns

### 1. Repository Pattern

**Purpose:** Abstract data access logic from business logic

**Responsibilities:**

- Encapsulate database queries
- Provide CRUD operations
- Handle complex queries
- Map between domain objects and database records
- Manage database sessions

**Benefits:**

- Testable business logic
- Swappable data sources
- Centralized query logic
- Reduced code duplication

### 2. Service Layer Pattern

**Purpose:** Encapsulate business logic

**Responsibilities:**

- Implement business rules
- Orchestrate repository operations
- Handle transactions
- Coordinate multiple operations
- Apply domain logic

**Benefits:**

- Reusable business logic
- Testable without HTTP
- Clear separation of concerns
- Framework independence

### 3. Dependency Injection Pattern

**Purpose:** Manage dependencies and improve testability

**Application Areas:**

- Database sessions
- Repository instances
- Service instances
- Configuration objects
- External service clients

**Benefits:**

- Loose coupling
- Easy testing
- Configuration flexibility
- Runtime behavior modification

### 4. Unit of Work Pattern

**Purpose:** Maintain consistency during transactions

**Usage:**

- Group related operations
- Ensure atomic commits
- Rollback on failures
- Manage transaction boundaries

**Implementation:**

- Database session management
- Transaction decorators
- Context managers
- Explicit transaction control

### 5. DTO (Data Transfer Object) Pattern

**Purpose:** Transfer data between layers

**Implementation:**

- Pydantic schemas for requests
- Response models for outputs
- Separate schemas per use case
- Validation at boundaries

**Benefits:**

- Type safety
- Automatic validation
- Clear contracts
- Documentation generation

### 6. Factory Pattern

**Purpose:** Create complex objects

**Use Cases:**

- Model instance creation
- Test data generation
- Schema instantiation
- Configuration objects

### 7. Strategy Pattern

**Purpose:** Select algorithms at runtime

**Use Cases:**

- Payment processing methods
- Notification strategies
- Calculation algorithms
- Authentication methods

---

## File and Function Size Guidelines

### File Size Limits

**Maximum File Length: 250-300 lines**

#### Guidelines

- If a file exceeds 300 lines, refactor and split
- Extract helper functions to separate utility modules
- Split large routers into sub-routers
- Decompose large services into smaller services
- Move shared logic to common modules

#### Common Refactoring Strategies

- Split routers by sub-resources
- Extract business logic to separate service methods
- Move utility functions to utils module
- Create separate files for related schemas
- Split repositories by entity or concern

#### Exceptions

Files may exceed 300 lines only when:

- Comprehensive model definitions with many fields
- Extensive schema definitions for complex domains
- Generated code (migration files)
- Configuration files with many settings

### Function Size Limits

**Maximum Function Length: 60 lines**

#### Guidelines

- Functions exceeding 60 lines must be decomposed
- Extract complex logic into helper functions
- Use composition to build complex operations
- Each function should do one thing well
- Avoid deep nesting (max 3 levels)

#### Refactoring Strategies

- Extract conditional logic into named functions
- Use early returns to reduce nesting
- Create helper functions for repeated code
- Split long functions into steps
- Use function composition

#### Benefits

- Improved readability
- Easier testing
- Better reusability
- Reduced cognitive load
- Simplified debugging
- Enhanced maintainability

### Complexity Limits

In addition to size limits:

- **Cyclomatic Complexity:** Max 10 per function
- **Nesting Depth:** Max 3 levels
- **Parameters:** Max 5 per function
- **Return Points:** Prefer single return, max 3

---

## Code Organization Standards

### Module Structure

**Import Organization:**

Group imports in this order:

1. Standard library imports
2. Third-party library imports (FastAPI, SQLAlchemy, etc.)
3. Application absolute imports
4. Relative imports from parent modules
5. Relative imports from same module

**Blank Lines:**

- 2 blank lines between top-level definitions
- 1 blank line between methods in a class
- 1 blank line between logical sections in functions

### File Organization

**Standard File Structure:**

1. Module docstring
2. Imports (grouped as above)
3. Constants
4. Type definitions
5. Exception classes
6. Utility functions
7. Main classes/functions
8. Dependency definitions

### Naming Conventions

**Files and Modules:**

- Use snake_case for file names
- Use descriptive names
- Avoid abbreviations

**Functions and Methods:**

- Use snake_case
- Verb-noun patterns for actions
- Descriptive names over short names
- Boolean functions start with `is_`, `has_`, `can_`

**Classes:**

- Use PascalCase
- Nouns or noun phrases
- Repository classes end with `Repository`
- Service classes end with `Service`
- Schema classes end with schema type (Request, Response, Create, Update)

**Constants:**

- Use UPPER_SNAKE_CASE
- Group related constants
- Define in module or constants file

**Variables:**

- Use snake_case
- Descriptive names
- Avoid single letters except in loops

### Type Hints

**Required everywhere:**

- Function parameters
- Function return types
- Class attributes
- Complex variables

**Benefits:**

- IDE autocomplete
- Static type checking
- Self-documentation
- Catch errors early

---

## API Design Guidelines

### RESTful Principles

**Resource Naming:**

- Use plural nouns for collections
- Use lowercase and hyphens
- Reflect domain models
- Maintain consistency

**HTTP Methods:**

- GET: Retrieve resources (idempotent)
- POST: Create new resources
- PUT: Replace entire resource
- PATCH: Partial update
- DELETE: Remove resource

**Status Codes:**

- 200: Success
- 201: Created
- 204: No content
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 422: Validation error
- 500: Server error

### Endpoint Structure

**URL Patterns:**

- `/api/v1/users` - List users
- `/api/v1/users/{id}` - Specific user
- `/api/v1/users/{id}/expenses` - Nested resource
- `/api/v1/search/expenses` - Custom action

**Versioning:**

- Use URL versioning: `/api/v1/`
- Maintain backward compatibility
- Document breaking changes
- Support old versions temporarily

### Request/Response Schemas

**Separation by Use Case:**

- `UserCreateRequest` - Creating users
- `UserUpdateRequest` - Updating users
- `UserResponse` - User data response
- `UserListResponse` - List of users
- `UserDetailResponse` - Detailed user info

**Pagination:**

- Use consistent pagination schema
- Include total count
- Provide next/previous links
- Default page size: 20-50

### Error Handling

**Consistent Error Format:**

- Include error code
- Provide message
- Add details/validation errors
- Include timestamp
- Request ID for tracking

---

## Database Standards

### SQLite Configuration

**Settings:**

- Enable foreign keys
- Use WAL mode for concurrency
- Set appropriate timeouts
- Configure connection pooling

**Limitations Awareness:**

- No concurrent writes
- Limited concurrency
- File-based locking
- Migration strategy for production DB

### Model Design

**Best Practices:**

- Use appropriate column types
- Define relationships explicitly
- Add indexes for queried fields
- Include created_at/updated_at timestamps
- Use soft deletes when appropriate
- Implement optimistic locking if needed

**Naming Conventions:**

- Table names: snake_case, plural
- Column names: snake_case
- Foreign keys: `{table}_id`
- Junction tables: `{table1}_{table2}`

### Migrations

**Alembic Guidelines:**

- One migration per feature/change
- Descriptive migration names
- Test migrations up and down
- Include data migrations when needed
- Review before committing

**Migration Best Practices:**

- Never edit existing migrations
- Test rollback procedures
- Include migration in feature PR
- Document complex migrations

### Query Optimization

**Guidelines:**

- Use indexes on frequently queried columns
- Avoid N+1 queries
- Use eager loading for relationships
- Limit query results
- Use database-level constraints

---

## Service Layer Architecture

### Service Responsibilities

**What Services Should Do:**

- Implement business rules and logic
- Validate business constraints
- Orchestrate multiple repository calls
- Handle complex transactions
- Calculate derived values
- Enforce domain rules
- Coordinate side effects
- Transform data between layers

**What Services Should NOT Do:**

- Handle HTTP requests/responses
- Perform database queries directly
- Validate data formats (use Pydantic)
- Deal with authentication tokens
- Manage database sessions

### Service Design Principles

**Single Responsibility:**

- Each service handles one domain area
- Methods have clear, focused purposes
- Avoid god services

**Dependency Management:**

- Inject repositories via constructor
- Use type hints for dependencies
- Keep dependencies minimal

**Transaction Management:**

- Services handle transaction boundaries
- Use context managers for transactions
- Rollback on business rule violations
- Coordinate multi-repository transactions

**Error Handling:**

- Raise domain-specific exceptions
- Don't catch and hide errors
- Let exceptions bubble appropriately
- Provide context in exceptions

### Service Method Design

**Method Characteristics:**

- Pure business logic
- Framework-agnostic
- Testable without mocks (mostly)
- Clear input/output contracts
- Focused responsibility

**Naming Conventions:**

- Use verbs: `create_user`, `update_expense`
- Be specific: `calculate_monthly_budget`
- Indicate return: `get_user_by_id`
- Show side effects: `send_notification`

---

## Error Handling

### Exception Hierarchy

**Create Custom Exceptions:**

- Base application exception
- Domain-specific exceptions
- HTTP-mapped exceptions
- Validation exceptions

**Exception Categories:**

- `BusinessRuleException` - Business logic violations
- `NotFoundException` - Resource not found
- `ValidationException` - Invalid data
- `UnauthorizedException` - Authentication failure
- `ForbiddenException` - Authorization failure

### Exception Handling Strategy

**Where to Handle:**

- **Router Level:** Convert to HTTP responses
- **Service Level:** Business rule validation
- **Repository Level:** Database errors
- **Middleware:** Global exception handling

**Error Response Format:**

- Consistent JSON structure
- Include error type
- Provide helpful message
- Add validation details
- Include correlation ID

### Logging

**What to Log:**

- Errors and exceptions
- Business logic decisions
- External service calls
- Authentication attempts
- Performance metrics

**Logging Levels:**

- DEBUG: Detailed diagnostic info
- INFO: General information
- WARNING: Warning messages
- ERROR: Error events
- CRITICAL: Critical failures

**Log Format:**

- Include timestamp
- Add correlation ID
- Include user context
- Add request path
- Include stack trace for errors

---

## Security Standards

### Authentication

**Implementation:**

- Use JWT tokens
- Implement refresh tokens
- Token expiration
- Secure token storage
- Revocation mechanism

**Best Practices:**

- Hash passwords (bcrypt)
- Implement rate limiting
- Use HTTPS only
- Validate token signatures
- Check token expiration

### Authorization

**Access Control:**

- Role-based access control (RBAC)
- Resource-level permissions
- Ownership validation
- Dependency-based checks

**Implementation:**

- Use FastAPI dependencies
- Check permissions at endpoint level
- Validate resource ownership
- Audit access attempts

### Data Protection

**Sensitive Data:**

- Never log passwords or tokens
- Encrypt sensitive fields
- Use environment variables
- Validate all inputs
- Sanitize outputs

**SQL Injection Prevention:**

- Use SQLAlchemy ORM
- Parameterized queries
- Validate inputs
- Avoid raw SQL

### Input Validation

**Layers of Validation:**

1. Pydantic schema validation
2. Business rule validation
3. Database constraints
4. Custom validators

---

## Testing Requirements

### Testing Strategy

**Test Pyramid:**

- **Unit Tests (70%):** Services, utilities, business logic
- **Integration Tests (20%):** API endpoints, database operations
- **E2E Tests (10%):** Critical user flows

### Unit Testing

**What to Test:**

- Service layer business logic
- Utility functions
- Validators
- Calculations
- Business rules

**Guidelines:**

- Test one thing per test
- Use descriptive test names
- Arrange-Act-Assert pattern
- Mock external dependencies
- Test edge cases

### Integration Testing

**What to Test:**

- API endpoints
- Database operations
- Repository methods
- Authentication flows
- Authorization checks

**Setup:**

- Use test database
- Clean state between tests
- Use fixtures for test data
- Test actual HTTP requests

### Testing Best Practices

**General Rules:**

- Write tests alongside code
- Maintain test quality
- Keep tests independent
- Use meaningful assertions
- Test failure cases
- Aim for 80%+ coverage

**Test Organization:**

- Mirror source structure
- Group related tests
- Use clear naming
- Share fixtures appropriately

---

## Performance Standards

### API Performance

**Response Time Targets:**

- Simple queries: < 100ms
- Complex queries: < 500ms
- List endpoints: < 1s
- Search endpoints: < 2s

**Optimization Strategies:**

- Use database indexes
- Implement caching
- Lazy load relationships
- Paginate large results
- Use connection pooling

### Database Performance

**Query Optimization:**

- Avoid N+1 queries
- Use select_in loading
- Add indexes strategically
- Limit result sets
- Use raw SQL for complex queries

**Connection Management:**

- Pool connections appropriately
- Set reasonable timeouts
- Close connections properly
- Monitor connection usage

### Caching Strategy

**What to Cache:**

- Frequently accessed data
- Expensive computations
- Rarely changing data
- External API responses

**Cache Invalidation:**

- Time-based expiration
- Event-based invalidation
- Manual cache clearing
- Version-based keys

### Background Tasks

**Use Cases:**

- Email notifications
- Report generation
- Data processing
- Cleanup operations

**Implementation:**

- Use background tasks API
- Implement job queues
- Handle failures gracefully
- Monitor task status

---

## Documentation Requirements

### Code Documentation

**Docstrings Required For:**

- All public functions
- All classes
- Complex algorithms
- Service methods
- Repository methods

**Docstring Format:**

Use Google-style docstrings:

- Summary line
- Detailed description
- Args with types
- Returns with type
- Raises exceptions
- Examples if helpful

### API Documentation

**FastAPI Auto-Documentation:**

- Add operation descriptions
- Document parameters
- Provide example requests
- Show response schemas
- Include error responses

**Additional Documentation:**

- README with setup instructions
- Architecture documentation
- Deployment guide
- Environment variables
- API changelog

### Code Comments

**When to Comment:**

- Complex business logic
- Non-obvious algorithms
- Workarounds and hacks
- TODO and FIXME notes
- License and attribution

**When NOT to Comment:**

- Self-explanatory code
- Restating code
- Outdated information
- Commented-out code

---

## Code Review Checklist

### Before Submitting PR

**Architecture & Design**
- [ ] Follows feature-based architecture
- [ ] Implements proper layering (Router → Service → Repository)
- [ ] Business logic is in service layer
- [ ] Adheres to SOLID principles
- [ ] Follows DRY principle
- [ ] Uses dependency injection

**Code Quality**
- [ ] No file exceeds 300 lines
- [ ] No function exceeds 60 lines
- [ ] Proper type hints everywhere
- [ ] Follows naming conventions
- [ ] No code duplication
- [ ] Proper error handling

**Database**
- [ ] Includes migration if schema changes
- [ ] Proper indexes defined
- [ ] Relationships correctly defined
- [ ] No N+1 query issues

**API Design**
- [ ] RESTful endpoint design
- [ ] Proper HTTP methods and status codes
- [ ] Request/response schemas defined
- [ ] Pagination implemented for lists
- [ ] Proper error responses

**Security**
- [ ] Input validation implemented
- [ ] Authorization checks in place
- [ ] No sensitive data in logs
- [ ] SQL injection protected
- [ ] Proper authentication

**Testing**
- [ ] Unit tests for business logic
- [ ] Integration tests for endpoints
- [ ] All tests passing
- [ ] Edge cases covered
- [ ] Test coverage acceptable

**Documentation**
- [ ] Docstrings for public functions
- [ ] API endpoint documented
- [ ] README updated if needed
- [ ] Complex logic commented

**Performance**
- [ ] Database queries optimized
- [ ] Proper indexing
- [ ] No obvious bottlenecks
- [ ] Appropriate caching

---

## General Guidelines

### Do's

✅ Write self-documenting code  
✅ Use type hints everywhere  
✅ Follow the layered architecture  
✅ Keep business logic in services  
✅ Write comprehensive tests  
✅ Handle errors properly  
✅ Use dependency injection  
✅ Document complex logic  
✅ Optimize database queries  
✅ Follow security best practices  
✅ Keep functions focused and small  
✅ Use descriptive variable names  

### Don'ts

❌ Don't put business logic in routers  
❌ Don't write raw SQL (use ORM)  
❌ Don't ignore type hints  
❌ Don't skip tests  
❌ Don't log sensitive data  
❌ Don't create god classes  
❌ Don't ignore exceptions  
❌ Don't commit commented code  
❌ Don't hardcode configuration  
❌ Don't skip migrations  
❌ Don't write functions over 60 lines  
❌ Don't create files over 300 lines  

---

## Python-Specific Best Practices

### Language Features

**Use Modern Python Features:**

- Type hints (Python 3.12)
- F-strings for formatting
- Context managers
- List/dict comprehensions
- Dataclasses where appropriate
- Async/await for I/O operations

### Code Style

**Follow PEP 8:**

- 4 spaces for indentation
- Max line length: 88-100 characters
- Use Black for formatting
- Use isort for import sorting
- Use flake8 for linting
- Use mypy for type checking

### Common Patterns

**Context Managers:**

- Database sessions
- File operations
- Locks and synchronization

**Decorators:**

- Authentication checks
- Logging
- Caching
- Transaction management
- Rate limiting

---

## Continuous Improvement

### Code Quality Tools

**Required Tools:**

- **Linting:** flake8, pylint
- **Formatting:** Black
- **Import Sorting:** isort
- **Type Checking:** mypy
- **Security:** bandit
- **Testing:** pytest, pytest-cov

### Pre-commit Hooks

**Automated Checks:**

- Format with Black
- Sort imports with isort
- Run flake8
- Run mypy
- Run tests
- Check for secrets

### Monitoring

**What to Monitor:**

- API response times
- Error rates
- Database performance
- Memory usage
- Cache hit rates

---

## Migration to Production Database

### Future Considerations

**When SQLite Becomes Limiting:**

- Concurrent write requirements
- Large dataset size
- Need for replication
- Advanced features required

**Migration Path:**

- PostgreSQL recommended
- Minimal code changes (SQLAlchemy)
- Update connection strings
- Test migrations thoroughly
- Update deployment config

---

## Conclusion

These coding standards ensure maintainable, scalable, and high-quality backend code. They provide clear guidelines for organization, implementation, and collaboration while maintaining flexibility for team growth and product evolution.

**Remember:**

- Standards guide, not constrain
- Apply with context and judgment
- Prioritize maintainability
- Focus on delivering value
- Continuously learn and improve

---

**Last Updated:** February 2026  
**Version:** 1.0  
**Team:** B4USpend Backend Development
