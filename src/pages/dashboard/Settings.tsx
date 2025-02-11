import DashboardLayout from "../../components/layout/DashboardLayout";

export default function Settings() {
    return (
      
<DashboardLayout>
<main id="main-content">
        <header
          id="header"
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-neutral-500">
              Manage your account settings
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
              <i className="fa-regular fa-bell w-5 h-5" />
            </button>
            <img
              src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=123"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        <div id="settings-content" className="grid grid-cols-2 gap-2">
          {/* Change Password Section */}
          <div
            id="password-section"
            className="bg-white p-6 rounded-lg border border-neutral-200 mb-6"
          >
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                  placeholder="Confirm new password"
                />
              </div>
              <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm hover:bg-neutral-800">
                Update Password
              </button>
            </form>
          </div>

          {/* Change Email Section */}
          <div
            id="email-section"
            className="bg-white p-6 rounded-lg border border-neutral-200"
          >
            <h2 className="text-lg font-semibold mb-4">Change Email Address</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Current Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg bg-neutral-50"
                  value="john.doe@example.com"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  New Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                  placeholder="Enter new email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-neutral-200 rounded-lg"
                  placeholder="Enter your password"
                />
              </div>
              <button className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm hover:bg-neutral-800">
                Update Email
              </button>
            </form>
          </div>
        </div>
      </main>
</DashboardLayout>
    );
}
