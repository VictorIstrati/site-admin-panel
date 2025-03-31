# GitHub Copilot Instructions

This file provides context to GitHub Copilot about our Angular admin panel project to help generate more relevant and consistent code suggestions.

**User: VictorIstrati**  
**Last Updated: 2025-03-31 21:18:01 UTC**

## Tech Stack & Architecture

- We use **Angular v19+** with strict TypeScript mode enabled
- State management with **NgRx** following the feature-based store organization pattern
- UI components from **PrimeNG** library
- Styling with **Tailwind CSS** utility classes
- Unit testing with Jest, E2E testing with Cypress

## Code Style & Conventions

- We follow Angular style guide recommendations
- Every component uses OnPush change detection strategy
- Smart/Presentational component pattern: smart components connect to store, presentational receive inputs/emit outputs
- Component selectors use the 'app-' prefix
- We use standalone components as the default approach
- TypeScript strict mode is enabled project-wide
- Properly type all variables, parameters, and return values
- We use async/await for Promise-based code and appropriate RxJS operators for Observables

## Writing Style Standards

- Use clear, descriptive variable and function names that reflect their purpose
- Keep functions small and focused on a single responsibility
- Limit line length to 100 characters
- Use 2-space indentation
- Use single quotes for strings in TypeScript
- Add trailing commas in multiline arrays and objects
- Place interface properties in alphabetical order
- Group imports by source (Angular, third-party, application)
- Add JSDoc comments for public APIs and complex functions
- Use TypeScript's non-null assertion operator (!.) sparingly
- Avoid any type unless absolutely necessary
- Name observables with a $ suffix (e.g., users$)
- Prefer const over let, avoid var completely
- Use early returns to reduce nesting

## Project Structure

```
src/
├── app/
│   ├── core/                  # Singleton services, guards, interceptors
│   ├── features/              # Feature modules
│   │   ├── auth/              # Authentication feature
│   │   ├── dashboard/         # Dashboard feature
│   │   └── [feature-name]/    # Other features
│   ├── shared/                # Shared components, directives, pipes
│   └── store/                 # NgRx store configuration
├── assets/                    # Static assets
└── environments/              # Environment configurations
```

## Reactive Forms Standards

- Use FormBuilder service to create reactive forms
- Create strongly typed form controls using Angular's typed forms API
- Extract complex validation logic into separate validator functions
- Use valueChanges and statusChanges observables with debounceTime for performance
- Implement custom form controls that extend ControlValueAccessor for complex inputs
- Create reusable form groups for common patterns (address forms, user details, etc.)
- Handle form submission with dedicated submission methods
- Disable submit buttons when forms are invalid
- Show validation errors only after form control is touched or form is submitted
- Use patchValue for partial updates and setValue for complete form updates
- Reset forms after successful submission

**Example:**

```typescript
interface UserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  preferences: FormGroup<{
    notifications: FormControl<boolean>;
    theme: FormControl<'light' | 'dark'>;
  }>;
}

@Component({...})
export class UserProfileComponent implements OnInit {
  userForm = this.fb.group<UserForm>({
    name: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(2)],
      nonNullable: true
    }),
    email: this.fb.control('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true
    }),
    preferences: this.fb.group({
      notifications: this.fb.control(true, { nonNullable: true }),
      theme: this.fb.control('light' as const, { nonNullable: true })
    })
  });

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    // Process form data
    console.log(this.userForm.getRawValue());

    // Reset form after successful submission
    this.userForm.reset();
  }
}
```

## NgRx Patterns

- Each feature has its own store with actions, reducers, selectors, and effects
- Use NgRx entity adapters for collections
- Implement facade services to encapsulate store interactions
- Keep effects focused on a single responsibility
- Use createAction and createReducer functions
- Strongly type everything
- Use action creators with discriminated union types
- Prefer using the latest NgRx features like component store for local state

## PrimeNG Integration

- Import only required PrimeNG modules to reduce bundle size
- We use PrimeNG's built-in theme system with Tailwind for customization
- Encapsulate complex PrimeNG components in our own wrapper components
- Create dedicated modules for PrimeNG component imports

## Tailwind Usage

- Use Tailwind utility classes directly in templates
- Avoid custom CSS files where possible, prefer Tailwind's configuration
- For repeated patterns, create component classes in our tailwind.config.js
- Use @apply sparingly and only for complex, frequently reused patterns

## API and Data Handling

- All API calls go through services in the core module
- We use HttpInterceptors for authentication, error handling, and logging
- Error handling follows a consistent pattern with user-friendly messages
- Data models are defined as interfaces in a models directory within each feature
- Use the async pipe in templates to automatically handle subscription management

## Authentication & Authorization

- JWT-based authentication with token refresh mechanism
- Role-based authorization using route guards
- Secure token storage in browser memory (not localStorage)

## Performance Considerations

- Implement lazy loading for all feature modules
- Use trackBy function with ngFor directives
- Optimize change detection with OnPush strategy
- Memoize expensive calculations with NgRx selectors
- Use pure pipes for transformations in templates
- Implement virtual scrolling for large lists

## Accessibility

- All components must be keyboard navigable
- Use semantic HTML elements
- Include proper ARIA attributes
- Maintain color contrast that meets WCAG AA standards

## Internationalization

- All user-facing strings use Angular's i18n system
- Right-to-left (RTL) layout support is implemented

## Responsive Design

- Mobile-first approach using Tailwind's responsive utilities
- Critical admin functions must work on tablets and mobile devices
- Use container queries for complex responsive components

## Security Practices

- Implement CSRF protection
- Apply strict Content Security Policy
- Sanitize all user inputs before display
- Implement appropriate rate limiting for API requests

## Testing Standards

- Unit tests for all services, components, and store
- Integration tests for complex features
- E2E tests for critical user paths
- Test coverage minimum of 80% for business logic
- Use testing doubles (spies, stubs, mocks) appropriately
- Test components in isolation with TestBed and component harnesses

## Error Handling Strategy

- Global error handling using Angular's ErrorHandler
- Consistent error UI components with severity levels
- Categorize errors: network, validation, server, authorization
- Dedicated error reporting service for centralized error management
- Implement error logging to external monitoring systems
- Use retry with backoff strategy for transient API failures
- Show user-friendly error messages while logging technical details
- Implement recoverable errors where possible (e.g., retry buttons)

## Build & Deployment

- Environment-specific configuration via environment.ts files
- Production builds must enable all optimization flags
- CI/CD pipeline using GitHub Actions
- Automated version increments following semantic versioning
- Bundle analysis for size optimization
- Pre-deployment checklist includes:
  - All tests passing
  - Lighthouse performance scores meeting targets
  - Successful build with AOT compilation
  - No console errors or warnings
- Containerized deployments with Docker

## Browser & Device Support

- Support latest two versions of Chrome, Firefox, Safari, and Edge
- IE11 is explicitly not supported
- Minimum iOS version: 14
- Minimum Android version: 8.0
- Implement specific polyfills for Edge compatibility
- Test critical functions on iPad and common Android tablets

## Feature Flag Implementation

- Use NgRx state for feature flag management
- Feature flags controlled via admin interface
- Environment-based feature flag defaults
- Feature flag persistence between sessions
- Component-level conditional rendering based on feature flags
- Analytics tracking for feature flag usage

## Documentation Requirements

- README.md with setup and development instructions
- Component documentation using Storybook
- API endpoints documented with Swagger/OpenAPI
- JSDoc comments for all public methods and complex private methods
- Inline code comments explaining non-obvious business logic
- State management diagrams for complex workflows
- CHANGELOG.md following conventional commits format

## Local Development Guidelines

- Use Angular CLI for generating components, services, etc.
- Mock API responses using Angular interceptors or MSW
- Use nx.dev for monorepo management if project scales
- Required extensions: ESLint, Prettier, Angular Language Service
- Use npm scripts for common development tasks
- Local environment setup documented in README.md
- Pre-commit hooks for linting and formatting

## Performance Metrics

- First Contentful Paint < 1.5s
- Time to Interactive < 3.5s
- Maximum bundle size: 500KB initial load (gzipped)
- Lighthouse Performance score > 85
- Core Web Vitals passing thresholds
- API response handling timeouts after 30 seconds
- Optimize rendering with virtual scrolling for lists > 50 items
- Measure and monitor Angular change detection cycles

## State Persistence Strategy

- Transient state in NgRx store
- Persistent state synced to secure HttpOnly cookies
- User preferences stored in localStorage with encryption
- Session recovery on page refresh via store rehydration
- Clear security-sensitive state on logout
- Implement storage quota management
- Version stored state to handle app updates

## Third-party Integrations

- Centralized service for each external API
- OAuth2 flow for external service authentication
- Retry and circuit breaker patterns for unreliable services
- Abstract third-party dependencies behind internal interfaces
- Mock external services for testing and development
- Document rate limits and API constraints for each service
- Implement adapters to transform between external and internal data models

## Analytics & Tracking

- Page view and user interaction tracking with Google Analytics
- Custom event tracking for business-critical actions
- Respect user privacy settings (GDPR, CCPA compliance)
- Implement consent management
- User journey tracking for UX optimization
- Error rate monitoring and alerting
- Performance metrics tracking
- Data anonymization for sensitive information
