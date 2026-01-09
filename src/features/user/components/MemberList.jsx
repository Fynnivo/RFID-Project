import MemberItem from "./MemberItem";

export default function MemberList({
  members,
  editingId,
  editedMember,
  onEditClick,
  onChangeEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      {members.map((member) => (
        <MemberItem
          key={member.id}
          member={member}
          isEditing={editingId === member.id}
          editedMember={editedMember}
          onEditClick={onEditClick}
          onChangeEdit={onChangeEdit}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}