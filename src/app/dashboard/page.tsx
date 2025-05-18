import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Mystery Message",
  description: "Your Mystery Message Dashboard",
};

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <div className="mt-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-foreground">Welcome to Mystery Message</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  This is your personal dashboard where you can manage your messages and account settings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 