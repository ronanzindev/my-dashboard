import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './pages/login/index.tsx'
import Register from './pages/register/index.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import AddExpense from './pages/add-expense/index.tsx'
import { UserProvider } from './contexts/user-context.tsx'
import { ToastContainer, Bounce } from 'react-toastify'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import EditExpense from './pages/edit-expense/index.tsx'
const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/edit-expense/:id" element={<EditExpense />} />
          </Routes>
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  </QueryClientProvider>
)
