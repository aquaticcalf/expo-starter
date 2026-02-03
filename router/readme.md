# Router

File-system based router for React Native. Maps files in `pages/` directory to routes automatically.

## File Structure

```
pages/
├── index.tsx                  → /
├── about.tsx                  → /about
├── (tabs)/                    → Route group (not in URL)
│   ├── +layout.tsx            → Tab layout wrapper
│   ├── index.tsx              → /
│   ├── explore.tsx            → /explore
│   └── profile.tsx            → /profile
├── (stack)/                   → Route group (not in URL)
│   ├── +layout.tsx            → Stack layout with header
│   └── settings/
│       ├── +layout.tsx        → Settings layout
│       ├── index.tsx          → /settings
│       ├── account.tsx        → /settings/account
│       └── 404.tsx            → Settings-specific 404
├── users/
│   ├── +layout.tsx            → Users layout
│   ├── index.tsx              → /users
│   ├── [id].tsx               → /users/:id
│   └── 404.tsx                → Users-specific 404
├── posts/
│   └── [slug].tsx             → /posts/:slug
└── 404.tsx                    → Root fallback for all unmatched routes
```

**Conventions:**
- `index.tsx` → Root of that directory
- `[param].tsx` → Dynamic segment, accessed via `useParams()`
- `(group)/` → Route group, organizes layouts without affecting URL
- `+layout.tsx` → Layout wrapper for directory and all subdirectories
- `404.tsx` → Custom not found page, works at any level (nested)

## Route Groups

Route groups let you organize layouts without changing the URL structure. Wrap a directory name in parentheses.

```
pages/
├── (tabs)/                    → URL: /, /explore, /profile
│   ├── +layout.tsx            → Wraps all tabs with tab bar
│   ├── index.tsx              → URL: /
│   ├── explore.tsx            → URL: /explore
│   └── profile.tsx            → URL: /profile
└── (marketing)/               → URL: /about, /contact
    ├── +layout.tsx            → Marketing layout (different header)
    ├── about.tsx              → URL: /about
    └── contact.tsx            → URL: /contact
```

The `(tabs)` and `(marketing)` groups are not part of the URL path.

## Setup

### 1. Create pages directory

```
mkdir pages
```

### 2. Create your first page

```tsx
// pages/index.tsx
import { View, Text } from "react-native"

export default function Home() {
  return (
    <View>
      <Text>Home Page</Text>
    </View>
  )
}
```

### 3. Initialize router

```tsx
// app.tsx
import { FileSystemRouter } from "@/router"

export default function App() {
  return <FileSystemRouter />
}
```

## Navigation

### Using Link component

```tsx
import { Link } from "@/router"
import { Text } from "react-native"

function Navigation() {
  return (
    <>
      <Link href="/">
        <Text>Home</Text>
      </Link>
      <Link href="/about">
        <Text>About</Text>
      </Link>
      <Link href="/users/123">
        <Text>User 123</Text>
      </Link>
    </>
  )
}
```

### Programmatic navigation

```tsx
import { useRouter } from "@/router"

function LoginButton() {
  const router = useRouter()

  const handleLogin = async () => {
    await performLogin()
    router.push("/dashboard")
  }

  return <Button onPress={handleLogin} title="Login" />
}
```

### Navigation methods

```tsx
const router = useRouter()

router.push("/path")              // Navigate, add to history
router.replace("/path")           // Navigate, replace current history entry
router.back()                     // Go back in history
router.forward()                  // Go forward in history
```

## Dynamic Routes

### Defining dynamic routes

```tsx
// pages/users/[id].tsx
import { useParams } from "@/router"
import { View, Text } from "react-native"

export default function UserProfile() {
  const { id } = useParams<{ id: string }>()

  return (
    <View>
      <Text>User ID: {id}</Text>
    </View>
  )
}
```

### Linking to dynamic routes

```tsx
<Link href={`/users/${user.id}`}>
  <Text>{user.name}</Text>
</Link>
```

## Layouts

Layouts wrap pages and nested routes. Create a `+layout.tsx` in any directory to apply a layout to all pages in that directory.

### Basic Layout

```tsx
// pages/+layout.tsx
import { LayoutProps } from "@/router"

export default function RootLayout({ children }: LayoutProps) {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      {children}
      <Footer />
    </View>
  )
}
```

### Nested Layouts

Layouts are nested automatically. Child layouts wrap inside parent layouts.

```
pages/
├── +layout.tsx                → Root layout (wraps everything)
├── index.tsx                  → / (inside root layout)
├── (tabs)/
│   ├── +layout.tsx            → Tab layout (wraps tabs)
│   ├── index.tsx              → / (inside root → tabs layout)
│   └── profile.tsx            → /profile (inside root → tabs layout)
└── users/
    ├── +layout.tsx            → Users layout
    ├── index.tsx              → /users (inside root → users layout)
    └── [id].tsx               → /users/:id (inside root → users layout)
```

Rendering order for `/users/123`:
1. RootLayout renders first
2. UsersLayout renders inside RootLayout
3. UserProfile page renders inside UsersLayout

```tsx
// Visual representation:
<RootLayout>
  <UsersLayout>
    <UserProfile id="123" />
  </UsersLayout>
</RootLayout>
```

### Layout with Route Groups

Route groups let you apply different layouts to different sections without changing URLs.

```tsx
// pages/(tabs)/+layout.tsx
import { Tabs } from "@/router"

export default function TabLayout({ children }: LayoutProps) {
  return (
    <Tabs
      tabs={[
        { href: "/", label: "Home" },
        { href: "/explore", label: "Explore" },
        { href: "/profile", label: "Profile" },
      ]}
    >
      {children}
    </Tabs>
  )
}
```

## Hooks

### useRouter

Full router instance with navigation methods.

```tsx
import { useRouter } from "@/router"

function Component() {
  const router = useRouter()

  // router.pathname  → current path
  // router.params    → route parameters
  // router.push()    → navigate
  // router.replace() → navigate without history
  // router.back()    → go back
  // router.forward() → go forward
}
```

### useParams

Access dynamic route parameters.

```tsx
import { useParams } from "@/router"

// For /users/[id]/posts/[postId]
function Component() {
  const { id, postId } = useParams<{ id: string; postId: string }>()
}
```

### usePathname

Get current pathname.

```tsx
import { usePathname } from "@/router"

function Component() {
  const pathname = usePathname()
  // pathname === "/users/123"
}
```

### useNavigate

Get navigate function directly.

```tsx
import { useNavigate } from "@/router"

function Component() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/dashboard", { replace: true })
  }
}
```

## Custom 404 Pages (Nested)

404 pages work at any directory level. If no specific 404 exists for the pathname, the router uses the 404 from the section the user came from (referrer). 404 pages are automatically wrapped with layouts from their directory hierarchy.

### Nested 404 Structure

```
pages/
├── 404.tsx                    → Fallback for entire app
├── index.tsx                  → /
├── (tabs)/
│   ├── 404.tsx                → Shown for routes navigated from (tabs) section
│   └── index.tsx              → /
└── settings/
    ├── 404.tsx                → Shown for /settings/* unmatched routes
    ├── index.tsx              → /settings
    └── account.tsx            → /settings/account
```

**Resolution order:**
- `/users/999` not found → Uses `pages/users/404.tsx`
- `/settings/admin` not found → Uses `pages/settings/404.tsx`
- `/unknown-route` with no referrer → Uses `pages/404.tsx` (root fallback)
- `/explore` not found with referrer `/` (from `(tabs)` section) → Uses `pages/(tabs)/404.tsx`
- `/history/xyz` (no `history/404.tsx`) with referrer `/users/123` → Uses `pages/users/404.tsx`

**Note:** If a pathname has no specific 404 but the user navigated from a section with a 404 (including route groups like `(tabs)`), the referrer's section 404 is used. This provides contextual feedback based on where the user was browsing.

### Root 404: pages/404.tsx

```tsx
// pages/404.tsx
import { View, Text } from "react-native"
import { Link } from "@/router"

export default function NotFound() {
  return (
    <View>
      <Text>Page not found</Text>
      <Link href="/">
        <Text>Go home</Text>
      </Link>
    </View>
  )
}
```

### Section-Specific 404

```tsx
// pages/users/404.tsx
import { View, Text } from "react-native"
import { Link } from "@/router"

export default function UserNotFound() {
  return (
    <View>
      <Text>User not found</Text>
      <Text>This user may have been deleted or moved.</Text>
      <Link href="/users">
        <Text>Browse all users</Text>
      </Link>
    </View>
  )
}
```

### Global 404 Override

Use the `notFound` prop for a custom global 404 component:

```tsx
function CustomNotFound() {
  return <Text>Custom 404</Text>
}

<FileSystemRouter notFound={CustomNotFound} />
```

### 404 Pages with Layouts

404 pages are automatically wrapped with layouts from their directory hierarchy, just like regular pages.

```
pages/
├── +layout.tsx                → Root layout (wraps everything)
├── 404.tsx                    → Uses root layout
└── users/
    ├── +layout.tsx            → Users layout
    ├── index.tsx              → /users
    └── 404.tsx                → Uses root layout → users layout
```

Rendering `/unknown-route`:
```
<RootLayout>
  <NotFound />
</RootLayout>
```

Rendering `/users/999/not-found`:
```
<RootLayout>
  <UsersLayout>
    <UserNotFound />
  </UsersLayout>
</RootLayout>
```

## Initial Path

Set starting route (useful for deep linking):

```tsx
<FileSystemRouter initialPath="/dashboard" />
```

## Advanced: Manual Page Imports

For custom setups, you can manually import and pass pages:

```tsx
import { FileSystemRouter } from "@/router"
import HomePage from "./pages/index"
import AboutPage from "./pages/about"

const pages = {
  "./pages/index.tsx": { default: HomePage },
  "./pages/about.tsx": { default: AboutPage },
}

export default function App() {
  return <FileSystemRouter pages={pages} />
}
```

## API Reference

### FileSystemRouter

Main component that renders routes. Auto-discovers pages from `../pages/**/*.tsx`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialPath | `string` | `"/"` | Starting route |
| notFound | `ComponentType` | built-in | Custom 404 component |

### Link

Navigation component.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| href | `string` | required | Destination path |
| replace | `boolean` | `false` | Replace history instead of push |
| children | `ReactNode` | required | Content to render |
| onPress | `() => void` | - | Additional press handler |

### RouterProvider

Low-level provider for custom setups.

```tsx
import { RouterProvider } from "@/router"

function CustomRouter({ children }) {
  return (
    <RouterProvider initialPath="/app">
      {children}
    </RouterProvider>
  )
}
```

## Module Structure

```
router/
├── index.ts      # Barrel exports
├── types.ts      # TypeScript interfaces
├── utils.ts      # Path conversion, route matching
├── context.tsx   # RouterProvider, navigation state
├── hooks.ts      # useRouter, useParams, usePathname, useNavigate
├── link.tsx      # Link component
├── router.tsx    # FileSystemRouter component
└── readme.md     # This file
```
