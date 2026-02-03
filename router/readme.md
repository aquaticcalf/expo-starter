# router

file-system based router for react native. maps files in `pages/` directory to routes automatically.

## file structure

```
pages/
├── index.tsx          → /
├── about.tsx          → /about
├── users/
│   ├── index.tsx      → /users
│   └── [id].tsx       → /users/:id
├── posts/
│   └── [slug].tsx     → /posts/:slug
└── 404.tsx            → fallback for unmatched routes
```

**conventions:**
- `index.tsx` → root of that directory
- `[param].tsx` → dynamic segment, accessed via `useParams()`
- `404.tsx` → custom not found page
- `+layout.tsx` → layout wrapper for directory

## setup

### 1. create pages directory

```
mkdir pages
```

### 2. create your first page

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

### 3. initialize router

```tsx
// app.tsx
import { FileSystemRouter } from "@/router"

export default function App() {
  return <FileSystemRouter />
}
```

## navigation

### using link component

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

### programmatic navigation

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

### navigation methods

```tsx
const router = useRouter()

router.push("/path")              // navigate, add to history
router.replace("/path")           // navigate, replace current history entry
router.back()                     // go back in history
router.forward()                  // go forward in history
```

## dynamic routes

### defining dynamic routes

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

### linking to dynamic routes

```tsx
<Link href={`/users/${user.id}`}>
  <Text>{user.name}</Text>
</Link>
```

## layouts

layouts wrap pages and nested routes. create a `+layout.tsx` in any directory to apply a layout to all pages in that directory.

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

layouts are nested - child layouts wrap parent layouts.

## hooks

### useRouter

full router instance with navigation methods.

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

access dynamic route parameters.

```tsx
import { useParams } from "@/router"

// for /users/[id]/posts/[postId]
function Component() {
  const { id, postId } = useParams<{ id: string; postId: string }>()
}
```

### usePathname

get current pathname.

```tsx
import { usePathname } from "@/router"

function Component() {
  const pathname = usePathname()
  // pathname === "/users/123"
}
```

### useNavigate

get navigate function directly.

```tsx
import { useNavigate } from "@/router"

function Component() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/dashboard", { replace: true })
  }
}
```

## custom 404 page

### option 1: pages/404.tsx

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

### option 2: notFound prop

```tsx
function CustomNotFound() {
  return <Text>Custom 404</Text>
}

<FileSystemRouter notFound={CustomNotFound} />
```

## initial path

set starting route (useful for deep linking):

```tsx
<FileSystemRouter initialPath="/dashboard" />
```

## advanced: manual page imports

for custom setups, you can manually import and pass pages:

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

## api reference

### FileSystemRouter

main component that renders routes. auto-discovers pages from `../pages/**/*.tsx`.

| prop | type | default | description |
|------|------|---------|-------------|
| initialPath | `string` | `"/"` | starting route |
| notFound | `ComponentType` | built-in | custom 404 component |

### Link

navigation component.

| prop | type | default | description |
|------|------|---------|-------------|
| href | `string` | required | destination path |
| replace | `boolean` | `false` | replace history instead of push |
| children | `ReactNode` | required | content to render |
| onPress | `() => void` | - | additional press handler |

### RouterProvider

low-level provider for custom setups.

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

## module structure

```
router/
├── index.ts      # barrel exports
├── types.ts      # typescript interfaces
├── utils.ts      # path conversion, route matching
├── context.tsx   # RouterProvider, navigation state
├── hooks.ts      # useRouter, useParams, usePathname, useNavigate
├── link.tsx      # Link component
├── router.tsx    # FileSystemRouter component
└── readme.md     # this file
```
