import { Modal } from "antd";

export default function IdentityDisputeDetailModal({
  visible,
  onCancel,
  selectedRecord,
}) {
  return (
    <Modal
      visible={!!visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      title="Identity Dispute Details"
    >
      <div className="p-4">
        {/* User Information */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 border-b pb-2">
            User Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name:</p>
              <p className="font-semibold">
                {selectedRecord?.user?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-semibold">
                {selectedRecord?.user?.email || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Identity Dispute */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 border-b pb-2">
            Identity Dispute Claims
          </h3>
          {selectedRecord?.identityDispute &&
          selectedRecord.identityDispute.length > 0 ? (
            <ul className="list-disc pl-5">
              {selectedRecord.identityDispute
                .filter((item) => item && item.trim() !== "")
                .map((item, index) => (
                  <li key={index} className="mb-2">
                    <p className="font-normal">{item}</p>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">
              No identity dispute claims submitted
            </p>
          )}
        </div>

        {/* Timestamps */}
        {/* <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 border-b pb-2">
            Submission Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Created At:</p>
              <p className="font-semibold">
                {selectedRecord?.createdAt
                  ? new Date(selectedRecord.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Last Updated:</p>
              <p className="font-semibold">
                {selectedRecord?.updatedAt
                  ? new Date(selectedRecord.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </Modal>
  );
}
