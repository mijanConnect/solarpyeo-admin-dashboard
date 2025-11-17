import { Modal } from "antd";

export default function JurorProgramDetailModal({
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
      title="Juror Program Details"
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

        {/* Eligibility Attestation */}
        {selectedRecord?.eligibilityAttestation &&
          selectedRecord.eligibilityAttestation.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 border-b pb-2">
                Eligibility Attestation
              </h3>
              <ul className="list-disc pl-5">
                {selectedRecord.eligibilityAttestation
                  .filter((item) => item && item.trim() !== "")
                  .map((item, index) => (
                    <li key={index} className="mb-2">
                      <p className="font-normal">{item}</p>
                    </li>
                  ))}
              </ul>
            </div>
          )}

        {/* Affidavit */}
        {/* {selectedRecord?.affidavit && selectedRecord.affidavit.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 border-b pb-2">Affidavit</h3>
            <ul className="list-disc pl-5">
              {selectedRecord.affidavit
                .filter((item) => item && item.trim() !== "")
                .map((item, index) => (
                  <li key={index} className="mb-2">
                    <p className="font-semibold capitalize">{item}</p>
                  </li>
                ))}
            </ul>
          </div>
        )} */}

        {/* Platform Agreements */}
        {selectedRecord?.platform && selectedRecord.platform.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 border-b pb-2">
              Platform Agreements
            </h3>
            <ul className="list-disc pl-5">
              {selectedRecord.platform
                .filter((item) => item && item.trim() !== "")
                .map((item, index) => (
                  <li key={index} className="mb-2">
                    <p className="font-normal">{item}</p>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Timestamps */}
        <div className="mb-6">
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
            {/* <div>
              <p className="text-gray-600">Last Updated:</p>
              <p className="font-semibold">
                {selectedRecord?.updatedAt
                  ? new Date(selectedRecord.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </Modal>
  );
}
