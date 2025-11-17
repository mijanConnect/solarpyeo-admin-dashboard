import { Modal } from "antd";
import { getImageUrl } from "../../common/imageUrl";

export default function TechnicalSupportDetailModal({
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
      title="Technical Support Details"
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
            {selectedRecord?.DOB && (
              <div>
                <p className="text-gray-600">Date of Birth:</p>
                <p className="font-semibold">
                  {new Date(selectedRecord.DOB).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Issue Details */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 border-b pb-2">
            Issue Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <p className="text-gray-600">Issue Classification:</p>
              <p className="font-semibold">
                {Array.isArray(selectedRecord?.issueClassification)
                  ? selectedRecord.issueClassification.join(", ")
                  : selectedRecord?.issueClassification || "N/A"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600">Description:</p>
              <p className="font-semibold">
                {selectedRecord?.description || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Date & Time:</p>
              <p className="font-semibold">
                {selectedRecord?.dateAndTime
                  ? new Date(selectedRecord.dateAndTime).toLocaleString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Device Type:</p>
              <p className="font-semibold">
                {selectedRecord?.deviceType || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Browser/App:</p>
              <p className="font-semibold">
                {selectedRecord?.browserApp || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Issue Occurrence:</p>
              <p className="font-semibold">
                {selectedRecord?.issueOccur || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Platform Usage:</p>
              <p className="font-semibold">
                {selectedRecord?.usingPlatform || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Support Method:</p>
              <p className="font-semibold">
                {selectedRecord?.receiveSupport?.toLowerCase() === "email"
                  ? "Email"
                  : selectedRecord?.receiveSupport?.toLowerCase() === "phone"
                  ? "Phone"
                  : selectedRecord?.receiveSupport || "N/A"}
              </p>
            </div>
            {/* <div>
              <p className="text-gray-600">Schedule Call:</p>
              <p className="font-semibold">
                {selectedRecord?.scheduleCall ? "Yes" : "No"}
              </p>
            </div> */}
            <div>
              <p className="text-gray-600">Status:</p>
              <p className="font-semibold capitalize">
                {selectedRecord?.progressStatus?.toLowerCase() === "review"
                  ? "Solved"
                  : selectedRecord?.progressStatus || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Priority:</p>
              <p className="font-semibold capitalize">
                {selectedRecord?.impact || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Attachments */}
        {selectedRecord?.attachment && selectedRecord.attachment.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 border-b pb-2">
              Attachments
            </h3>
            <ul className="list-disc pl-5">
              {selectedRecord.attachment.map((file, index) => (
                <li key={index} className="mb-1">
                  <a
                    href={getImageUrl(file)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {file.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Digital Signature */}
        {selectedRecord?.digitalSignature && (
          <div className="mb-6">
            <h3 className="text-lg font-bold mb-3 border-b pb-2">
              Digital Signature
            </h3>
            <p className="font-semibold">{selectedRecord.digitalSignature}</p>
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
            <div>
              <p className="text-gray-600">Last Updated:</p>
              <p className="font-semibold">
                {selectedRecord?.updatedAt
                  ? new Date(selectedRecord.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
