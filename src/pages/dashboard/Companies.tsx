import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAppSelector } from "../../store/hooks";

export default function Companies() {
  const companies = useAppSelector((state) => state.company.companies);
  return (
    <DashboardLayout>
      <main id="main-content">
        <header id="header" className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Companies</h1>
            <p className="text-sm text-neutral-500">View and Select Company</p>
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

        <ul>
          {companies!.map((company) => (
            <li
              key={company.companyId}
              className="bg-white p-4 shadow-sm rounded-md mb-4"
            >
              <h2 className="text-lg font-bold">{company.companyName}</h2>
              <p className="text-gray-600">{company.role}</p>
            </li>
          ))}
        </ul>
        <div id="company-switcher" className="p-4 grid gap-4">
          <button className="w-full flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg group border border-neutral-200 ">
            <div className="flex items-center space-x-3">
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=789"
                alt="Company Logo"
                className="w-8 h-8 rounded-lg"
              />
              <div className="text-left">
                <p className="text-sm font-medium">Çözüm Üretenler A.Ş</p>
                <p className="text-xs text-neutral-500">C-Corp</p>
              </div>
            </div>
            <i className="fa-solid fa-chevron-down w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
          </button>
          <button className="w-full flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg group border border-neutral-200">
            <div className="flex items-center space-x-3">
              <img
                src="https://api.dicebear.com/7.x/notionists/svg?scale=200&seed=789"
                alt="Company Logo"
                className="w-8 h-8 rounded-lg"
              />
              <div className="text-left">
                <p className="text-sm font-medium">Better Company</p>
                <p className="text-xs text-neutral-500">LLC</p>
              </div>
            </div>
            <i className="fa-solid fa-chevron-down w-4 h-4 text-neutral-400 group-hover:text-neutral-600" />
          </button>
        </div>
      </main>
    </DashboardLayout>
  );
}
