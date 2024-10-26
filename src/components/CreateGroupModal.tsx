import { useDispatch } from "react-redux";
import { useAppSelector } from "~/lib/hooks";
import { setIsCreateGroupModalOpen } from "~/lib/features/uiSlice";

export default function CreateGroupModal() {
  const dispatch = useDispatch();
  const isOpen = useAppSelector((state) => state.ui.isCreateGroupModalOpen);

  const handleClose = () => {
    dispatch(setIsCreateGroupModalOpen(false));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg bg-white p-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Create New Study Group</h2>
          <button onClick={handleClose} className="text-xl">
            &times;
          </button>
        </div>
        <form>
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Title"
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Course"
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Prerequisites"
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Time"
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Location"
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="number"
            placeholder="Number of Participants"
          />
          <input
            className="mb-2 w-full rounded border p-2"
            type="text"
            placeholder="Details"
          ></input>
          <button
            type="submit"
            className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
}
