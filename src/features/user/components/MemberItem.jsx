// src/components/EventItem.jsx

export default function EventItem({
  member,
  isEditing,
  editedMember,
  onEditClick,
  onChangeEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
      {isEditing ? (
        // === Tampilan saat edit ===
        <div className="flex flex-col w-full gap-2">
          <input
            type="text"
            name="name"
            value={editedMember.name}
            onChange={onChangeEdit}
            className="border rounded p-2"
          />
          <input
            type="text"
            name="date"
            value={editedMember.role}
            onChange={onChangeEdit}
            className="border rounded p-2"
          />
          <select
            name="status"
            value={editedMember.status}
            onChange={onChangeEdit}
            className="border rounded p-2"
          >
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>

          <div className="flex gap-3 mt-2">
            <button
              onClick={onSaveEdit}
              className="bg-green-500 text-white px-4 py-1 rounded"
            >
              Simpan
            </button>
            <button
              onClick={onCancelEdit}
              className="bg-gray-300 text-black px-4 py-1 rounded"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        // === Tampilan normal ===
        <>
          <div>
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.role}</p>
            <span className="text-xs text-orange-600">{member.status}</span>
          </div>

          <div className="flex gap-4 text-sm">
            <button
              onClick={() => onEditClick(member)}
              className="text-blue-500 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(member.id)}
              className="text-red-500 hover:underline"
            >
              Hapus
            </button>
          </div>
        </>
      )}
    </div>
  );
}