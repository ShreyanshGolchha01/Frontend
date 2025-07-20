<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Chhānv Health Camp Admin Panel - Copilot Instructions

## Project Overview
This is a React + Vite admin panel for managing health camps and schemes for the "Chhānv" government health initiative. The project uses modern web technologies with a focus on accessibility and government compliance.

## Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks (no Redux)
- **Data**: Mock/dummy data only (no backend integration)

## Design Guidelines
- **Primary Color**: #0E7DFF (blue theme for government health portal)
- **Typography**: Inter font family
- **Spacing**: Consistent Tailwind spacing scale
- **Borders**: Rounded corners (rounded-2xl preferred)
- **Components**: Card-based layout with shadows
- **Responsive**: Mobile-first design with sidebar collapse

## Component Patterns
- Use TypeScript interfaces from `src/types/interfaces.ts`
- Follow the established component structure in `src/components/`
- Use mock data from `src/data/mockData.ts`
- Implement consistent error handling and validation
- Use Tailwind CSS classes with the established design tokens

## File Organization
- **Components**: Reusable UI components in `src/components/`
- **Pages**: Route-level components in `src/pages/`
- **Layouts**: Layout components in `src/layouts/`
- **Types**: TypeScript interfaces in `src/types/`
- **Data**: Mock data and utilities in `src/data/`
- **Routes**: Router configuration in `src/routes/`

## Government Compliance
- Hindi language support for user-facing text
- Accessibility considerations (WCAG guidelines)
- Professional government branding
- SSIPMT, Raipur attribution
- Security best practices for forms and data handling

## Development Standards
- Use functional components with React Hooks
- Implement proper TypeScript typing
- Follow consistent naming conventions
- Add proper error boundaries and loading states
- Ensure responsive design across all screen sizes
- Use semantic HTML elements for accessibility

## Key Features to Maintain
1. **Authentication**: Simple email/password login with dummy validation
2. **Dashboard**: KPI cards, charts, and activity feeds
3. **Camps Management**: CRUD operations with modal forms
4. **Doctors Management**: Profile management with camp assignments
5. **Users & Health Records**: Expandable rows with health timelines
6. **Schemes Management**: Tabbed interface with approval workflows
7. **Reports & Analytics**: Interactive charts with export functionality

## Common Patterns
- Modal dialogs for forms and confirmations
- DataTable component for list views with search and pagination
- Sidebar navigation with active state highlighting
- Header with search and user profile
- Responsive grid layouts for cards and content
- Toast notifications for user feedback (when implemented)

Remember to maintain the government health portal theme and ensure all new components follow the established design patterns and accessibility standards.
