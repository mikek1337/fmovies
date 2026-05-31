import UserSideMenu from "@/components/usersidemenu"

interface UserLayoutProps {
  children: React.ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="flex min-h-screen bg-formovies-dark">
      <UserSideMenu />
      <main className="flex-1 overflow-auto">
        <div className="bg-grain min-h-screen">
          {children}
        </div>
      </main>
    </div>
  )
}
