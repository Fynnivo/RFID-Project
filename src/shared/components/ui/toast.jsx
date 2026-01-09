import { Toaster as ReactHotToaster } from 'react-hot-toast'

export function Toaster() {
  return (
    <ReactHotToaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName="!font-sans"
      toastOptions={{
        className: `
          bg-background text-foreground border-border
          shadow-sm rounded-[var(--radius-md)] 
          text-sm font-medium
          dark:bg-[oklch(var(--background)/0.95)]
          dark:border-[oklch(var(--border)/0.3)]
          !px-3 !py-2
        `,
        success: {
          className: `
            !border-[oklch(var(--chart-1)/0.5)] 
            !bg-[oklch(var(--background)/0.98)]
          `,
          iconTheme: {
            primary: 'oklch(var(--chart-1))',
            secondary: 'oklch(var(--primary-foreground))',
          },
        },
        error: {
          className: `
            !border-[oklch(var(--destructive)/0.5)]
            !bg-[oklch(var(--background)/0.98)]
          `,
          iconTheme: {
            primary: 'oklch(var(--destructive))',
            secondary: 'oklch(var(--destructive-foreground))',
          },
        },
        loading: {
          className: `
            !border-[oklch(var(--primary)/0.3)]
            !bg-[oklch(var(--background)/0.98)]
          `
        }
      }}
    />
  )
}