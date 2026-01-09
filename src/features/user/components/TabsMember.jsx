
export default function EventTabs({ activeTab, onChangeTab }) {
  const tabs = ["All Members","Cadet","Members","Main Team"];

  return (
    <div className="flex space-x-10 mb-0 px-1">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChangeTab(tab)}
          className={`px-20 py-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === tab
              ? "bg-[#F7F4C9] text-black"
              : "bg-gray-200 text-gray-700 hover:bg-orange-400"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}