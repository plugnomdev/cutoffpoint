import MainNav from './MainNav';
import MainFooter from './MainFooter';

type MainLayoutProps = {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MainNav />
      <main className="flex-1 min-h-0">
        {children}
      </main>
      <MainFooter />
    </div>
  );
} 