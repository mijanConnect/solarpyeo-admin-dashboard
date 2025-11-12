import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Radio,
  Space,
  Tag,
  message,
} from "antd";
import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { MdGavel } from "react-icons/md";

const { TextArea } = Input;

// Helper to extract a human-friendly juror label from various shapes
const getJurorLabel = (juror) => {
  if (!juror) return "#";
  if (typeof juror === "string") return juror;
  if (typeof juror === "number") return String(juror);
  if (typeof juror === "object") {
    // common shapes: { _id, name, email } or { name } or { id }
    if (juror.name) return juror.name;
    if (juror.email) return juror.email;
    if (juror._id) return juror._id;
    if (juror.id) return juror.id;
    return "Juror";
  }
  return String(juror);
};

// Accept Modal Component
export const AcceptModal = ({ visible, onCancel, onOk, selectedRecord }) => {
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  const handleOk = () => {
    if (!confirmationChecked) {
      message.warning(
        "Please confirm that you have reviewed all case details."
      );
      return;
    }
    onOk();
    setConfirmationChecked(false);
  };

  const handleCancel = () => {
    setConfirmationChecked(false);
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <span>Approve & Send to Jury Panel</span>
        </div>
      }
      visible={visible}
      onCancel={handleCancel}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="approve"
          type="primary"
          onClick={handleOk}
          disabled={!confirmationChecked}
          style={{
            background: confirmationChecked
              ? "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)"
              : undefined,
            border: "none",
            borderRadius: "6px",
            fontWeight: "500",
          }}
        >
          Approve & Send to Jury
        </Button>,
      ]}
    >
      {selectedRecord && (
        <div className="space-y-4">
          <Card
            title={
              <div className="flex items-center gap-2">
                <span className="text-green-600 text-lg">✅</span>
                <span>Case Approved for Jury Review</span>
              </div>
            }
            className="border-green-200"
          >
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-green-800 mb-3">
                📋 Case Summary
              </h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <strong>Case Type:</strong>{" "}
                  <span className="text-blue-700">
                    {selectedRecord.caseType}
                  </span>
                </div>
                <div>
                  <strong>Initiator:</strong>{" "}
                  <span className="text-blue-700">
                    {selectedRecord.initiatorName}
                  </span>
                </div>
                <div>
                  <strong>Respondent:</strong>{" "}
                  <span className="text-blue-700">
                    {selectedRecord.respondentName}
                  </span>
                </div>
                <div>
                  <strong>Email:</strong>{" "}
                  <span className="text-blue-700">{selectedRecord.email}</span>
                </div>
                <div>
                  <strong>Moderator:</strong>{" "}
                  <span className="text-blue-700">
                    {selectedRecord.moderatorName}
                  </span>
                </div>
                <div>
                  <strong>Current Status:</strong>{" "}
                  <span className="text-blue-700">{selectedRecord.status}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                📋 Jury Review Process
              </h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>
                  • 3 qualified jurors will independently review this case
                </li>
                <li>
                  • Each juror will provide a detailed decision with reasoning
                </li>
                <li>
                  • All jury feedback will be compiled for final administrative
                  review
                </li>
                <li>
                  • The case status will be updated to "Sent to Jury"
                  immediately
                </li>
              </ul>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="confirmation"
                checked={confirmationChecked}
                onChange={(e) => setConfirmationChecked(e.target.checked)}
                className="w-4 h-4 text-green-600"
              />
              <label htmlFor="confirmation" className="text-sm text-gray-700">
                I confirm that I have thoroughly reviewed all case details and
                supporting documents
              </label>
            </div>
          </Card>
        </div>
      )}
    </Modal>
  );
};

// Jury Modal Component
export const JuryModal = ({ visible, onCancel, onSubmit, selectedRecord }) => {
  const [juryDecision, setJuryDecision] = useState("");
  const [juryReason, setJuryReason] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const handleSubmit = () => {
    if (!juryDecision || !juryReason.trim() || !confidenceLevel) {
      message.error(
        "Please provide decision, detailed reasoning, and confidence level!"
      );
      return;
    }

    const success = onSubmit(
      juryDecision,
      juryReason,
      confidenceLevel,
      additionalNotes
    );
    if (success) {
      setJuryDecision("");
      setJuryReason("");
      setConfidenceLevel("");
      setAdditionalNotes("");
    }
  };

  const handleCancel = () => {
    setJuryDecision("");
    setJuryReason("");
    setConfidenceLevel("");
    setAdditionalNotes("");
    onCancel();
  };

  const currentVoteCount = selectedRecord?.juryFeedback?.length || 0;
  const remainingVotes = 3 - currentVoteCount;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <MdGavel className="text-purple-600 text-xl" />
          <span>Jury Decision Panel - Vote {currentVoteCount + 1} of 3</span>
        </div>
      }
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      width={800}
      okText="⚖️ Submit Jury Decision"
      cancelText="Cancel"
      bodyStyle={{ paddingBottom: 48 }}
      okButtonProps={{
        style: {
          background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
          border: "none",
          fontSize: "16px",
          height: "40px",
        },
        disabled: !juryDecision || !juryReason.trim() || !confidenceLevel,
      }}
      cancelButtonProps={{
        style: {
          fontSize: "16px",
          height: "40px",
        },
      }}
    >
      {selectedRecord && (
        <div className="space-y-4">
          <Card className="border-l-4 border-l-purple-500">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-purple-700 mb-2">
                Case Under Jury Review
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Votes Cast: {currentVoteCount}/3
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Remaining: {remainingVotes}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3">
                Case Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Case Type:</strong>{" "}
                  <span className="text-gray-700">
                    {selectedRecord.caseType}
                  </span>
                </div>
                <div>
                  <strong>Initiator:</strong>{" "}
                  <span className="text-gray-700">
                    {selectedRecord.initiatorName}
                  </span>
                </div>
                <div>
                  <strong>Respondent:</strong>{" "}
                  <span className="text-gray-700">
                    {selectedRecord.respondentName}
                  </span>
                </div>
                <div>
                  <strong>Moderator:</strong>{" "}
                  <span className="text-gray-700">
                    {selectedRecord.moderatorName}
                  </span>
                </div>
                <div>
                  <strong>Email:</strong>{" "}
                  <span className="text-gray-700">{selectedRecord.email}</span>
                </div>
                <div>
                  <strong>Current Status:</strong>{" "}
                  <span className="text-gray-700">{selectedRecord.status}</span>
                </div>
              </div>
            </div>

            {/* Previous Jury Decisions */}
            {selectedRecord.juryFeedback &&
              selectedRecord.juryFeedback.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                  <h4 className="font-semibold text-indigo-800 mb-3">
                    Previous Jury Decisions
                  </h4>
                  {selectedRecord.juryFeedback.map((feedback, index) => {
                    const jurorId = getJurorLabel(
                      feedback.jurorId || feedback.juror || index + 1
                    );
                    const decision = (
                      feedback.decision ||
                      feedback.action ||
                      ""
                    ).toUpperCase();
                    const reason = feedback.reason || feedback.comment || "";
                    const rawDecision = (
                      feedback.decision ||
                      feedback.action ||
                      ""
                    ).toUpperCase();
                    let tagColor = "default";
                    if (
                      rawDecision === "APPROVE" ||
                      rawDecision === "ACCEPT" ||
                      rawDecision === "APPROVED"
                    ) {
                      tagColor = "green";
                    } else if (
                      rawDecision === "REJECT" ||
                      rawDecision === "REJECTED"
                    ) {
                      tagColor = "red";
                    } else if (
                      rawDecision.includes("UNABLE") ||
                      rawDecision === "UNABLETODECIDE"
                    ) {
                      tagColor = "gold"; // yellow-ish
                    } else {
                      tagColor = "default";
                    }
                    let displayDecision = rawDecision || "N/A";
                    if (
                      rawDecision === "APPROVE" ||
                      rawDecision === "ACCEPT" ||
                      rawDecision === "APPROVED"
                    ) {
                      displayDecision = "ACCEPTED";
                    } else if (
                      rawDecision === "REJECT" ||
                      rawDecision === "REJECTED"
                    ) {
                      displayDecision = "REJECTED";
                    } else if (
                      rawDecision.includes("UNABLE") ||
                      rawDecision === "UNABLETODECIDE"
                    ) {
                      displayDecision = "UNABLETODECIDED";
                    }
                    return (
                      <div
                        key={index}
                        className="mb-3 p-3 bg-white rounded border border-indigo-100"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <strong>Juror {jurorId}:</strong>
                          <Tag color={tagColor}>{displayDecision}</Tag>
                        </div>
                        <p className="text-sm text-gray-600">{reason}</p>
                      </div>
                    );
                  })}
                </div>
              )}
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <h3 className="text-lg font-semibold text-blue-700 mb-4">
              Your Jury Decision
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Verdict Decision:
                </label>
                <Radio.Group
                  value={juryDecision}
                  onChange={(e) => setJuryDecision(e.target.value)}
                  className="w-full"
                >
                  <Space direction="vertical" className="w-full">
                    <Radio
                      value="approve"
                      className="p-3 border border-green-200 rounded-lg hover:bg-green-50"
                    >
                      <div>
                        <strong className="text-green-700">✓ APPROVE</strong>
                        <p className="text-sm text-gray-600 ml-6">
                          Support the case/claim - Evidence is sufficient
                        </p>
                      </div>
                    </Radio>
                    <Radio
                      value="reject"
                      className="p-3 border border-red-200 rounded-lg hover:bg-red-50"
                    >
                      <div>
                        <strong className="text-red-700">✗ REJECT</strong>
                        <p className="text-sm text-gray-600 ml-6">
                          Do not support the case/claim - Evidence is
                          insufficient
                        </p>
                      </div>
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Confidence Level:
                </label>
                <Radio.Group
                  value={confidenceLevel}
                  onChange={(e) => setConfidenceLevel(e.target.value)}
                  className="w-full"
                >
                  <Space
                    direction="horizontal"
                    className="flex flex-wrap gap-2"
                  >
                    <Radio
                      value="high"
                      className="border border-green-200 rounded px-2 py-1"
                    >
                      High Confidence
                    </Radio>
                    <Radio
                      value="medium"
                      className="border border-yellow-200 rounded px-2 py-1"
                    >
                      Medium Confidence
                    </Radio>
                    <Radio
                      value="low"
                      className="border border-red-200 rounded px-2 py-1"
                    >
                      Low Confidence
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Detailed Reasoning (Required):
                </label>
                <TextArea
                  value={juryReason}
                  onChange={(e) => setJuryReason(e.target.value)}
                  placeholder="Provide detailed explanation for your decision. Include analysis of evidence, legal considerations, and reasoning behind your verdict..."
                  rows={4}
                  maxLength={1000}
                  showCount
                  className="border-2 border-gray-200 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Additional Notes (Optional):
                </label>
                <TextArea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any additional observations, recommendations, or concerns..."
                  rows={2}
                  maxLength={500}
                  showCount
                  className="border-2 border-gray-200 focus:border-blue-400"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-yellow-800 text-sm">
                  <strong>⚠️ Important:</strong> Your decision will be recorded
                  permanently and cannot be changed. Please ensure you have
                  thoroughly reviewed all case materials before submitting.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Modal>
  );
};

// Edit Modal Component
export const EditModal = ({ visible, onCancel, onSubmit, selectedRecord }) => {
  const [inputFields, setInputFields] = useState([{ id: 1, value: "" }]);
  const [editForm] = Form.useForm();

  // Reset form when modal opens
  React.useEffect(() => {
    if (visible) {
      setInputFields([{ id: 1, value: "" }]);
      editForm.setFieldsValue({
        adminComments: "",
        finalResult: "",
      });
    }
  }, [visible, editForm]);

  // Normalize selectedRecord fields to show API-provided values even when shape varies
  const sr = selectedRecord || {};
  const caseType = sr.typeOfFiling || sr.caseType || sr.case?.type || "N/A";
  const caseId = sr.caseId || "N/A";
  const jurorVote = Array.isArray(sr.jurorDecisions)
    ? sr.jurorDecisions.length
    : sr.jurorVote ??
      (Array.isArray(sr.juryFeedback)
        ? sr.juryFeedback.length
        : sr.jurorCount ?? 0);
  const initiatorName =
    sr.initiatorName ||
    sr.user?.name ||
    sr.initiator?.name ||
    sr.user?.firstName ||
    "N/A";
  const respondentName =
    sr.respondentName ||
    sr.respondent?.name ||
    sr.respondentFastName ||
    sr.respondent?.firstName ||
    "N/A";
  const email = sr.email || sr.user?.email || sr.contactEmail || "N/A";
  const moderatorName = sr.moderatorName || sr.moderator?.name || "N/A";
  const status = sr.status || sr.caseStatus || sr.currentStatus || "N/A";

  const addInputField = () => {
    const newId = Math.max(...inputFields.map((field) => field.id)) + 1;
    setInputFields([...inputFields, { id: newId, value: "" }]);
  };

  const removeInputField = (id) => {
    if (inputFields.length > 1) {
      setInputFields(inputFields.filter((field) => field.id !== id));
    }
  };

  const updateInputField = (id, value) => {
    setInputFields(
      inputFields.map((field) =>
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const handleSubmit = () => {
    editForm.validateFields().then((values) => {
      const hasValidDecision = inputFields.some(
        (field) => field.value.trim() !== ""
      );

      if (!hasValidDecision) {
        message.error("Please provide at least one decision!");
        return;
      }

      const decisions = inputFields
        .filter((field) => field.value.trim() !== "")
        .map((field) => field.value.trim());

      const success = onSubmit(decisions, values);
      if (success) {
        // Reset form
        setInputFields([{ id: 1, value: "" }]);
        editForm.resetFields();
      }
    });
  };

  return (
    <Modal
      title="Final Case Review & Decision"
      visible={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={900}
      bodyStyle={{ paddingBottom: 25 }}
      okText="Submit Final Decision"
      cancelText="Cancel"
    >
      {selectedRecord && (
        <div className="space-y-4">
          <Card title="Case Summary">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <strong>Case Type:</strong> {caseType}
              </div>
              <div>
                <strong>Case ID:</strong> {caseId}
              </div>
              <div>
                <strong>Initiator:</strong> {initiatorName}
              </div>
              <div>
                <strong>Jury Votes:</strong> {jurorVote}
              </div>
              <div>
                <strong>Respondent:</strong> {respondentName}
              </div>
              <div>
                <strong>Email:</strong> {email}
              </div>
              <div>
                <strong>Moderator:</strong> {moderatorName}
              </div>
              <div>
                <strong>Current Status:</strong> {status}
              </div>
            </div>

            {selectedRecord.jurorDecisions &&
              selectedRecord.jurorDecisions.length > 0 && (
                <div className="border px-4 py-1 rounded-lg">
                  <h4 className="mb-3 mt-2 font-semibold">
                    Jury Panel Decisions:
                  </h4>
                  {selectedRecord.jurorDecisions.map((feedback, index) => {
                    const jurorId = getJurorLabel(
                      feedback.jurorId || feedback.juror || index + 1
                    );
                    const decision = (
                      feedback.decision ||
                      feedback.action ||
                      ""
                    ).toUpperCase();
                    const reason = feedback.reason || feedback.comment || "";
                    const confidence = (
                      feedback.confidenceLevel || ""
                    ).toUpperCase();
                    const rawDecision = (
                      feedback.decision ||
                      feedback.action ||
                      ""
                    ).toUpperCase();
                    let tagColor = "default";
                    if (
                      rawDecision === "APPROVE" ||
                      rawDecision === "ACCEPT" ||
                      rawDecision === "APPROVED"
                    ) {
                      tagColor = "green";
                    } else if (
                      rawDecision === "REJECT" ||
                      rawDecision === "REJECTED"
                    ) {
                      tagColor = "red";
                    } else if (
                      rawDecision.includes("UNABLE") ||
                      rawDecision === "UNABLETODECIDE"
                    ) {
                      tagColor = "gold"; // yellow-ish
                    } else {
                      tagColor = "default";
                    }
                    let displayDecision = rawDecision || "N/A";
                    if (
                      rawDecision === "APPROVE" ||
                      rawDecision === "ACCEPT" ||
                      rawDecision === "APPROVED"
                    ) {
                      displayDecision = "ACCEPTED";
                    } else if (
                      rawDecision === "REJECT" ||
                      rawDecision === "REJECTED"
                    ) {
                      displayDecision = "REJECTED";
                    } else if (
                      rawDecision.includes("UNABLE") ||
                      rawDecision === "UNABLETODECIDE"
                    ) {
                      displayDecision = "UNABLETODECIDED";
                    }
                    const time = feedback.timestamp || feedback.votedAt || null;
                    return (
                      <div
                        key={index}
                        className="mb-3 p-4 bg-gray-50 rounded-lg border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <strong>{jurorId}:</strong>
                            <Tag color={tagColor}>{displayDecision}</Tag>
                            {confidence && (
                              <Tag
                                color={
                                  confidence === "HIGH"
                                    ? "blue"
                                    : confidence === "MEDIUM"
                                    ? "orange"
                                    : "red"
                                }
                              >
                                {confidence} CONFIDENCE
                              </Tag>
                            )}
                          </div>
                          {time && (
                            <span className="text-xs text-gray-500">
                              {new Date(time).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700">
                          <p className="mb-1">
                            <strong>Reasoning:</strong> {reason}
                          </p>
                          {feedback.additionalNotes && (
                            <p className="text-gray-600">
                              <strong>Additional Notes:</strong>{" "}
                              {feedback.additionalNotes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </Card>

          <Card title="Final Administrative Decision">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Administrative Decisions:
                </label>
                {inputFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2 mb-3">
                    <Input
                      placeholder={`Enter decision ${index + 1}`}
                      value={field.value}
                      onChange={(e) =>
                        updateInputField(field.id, e.target.value)
                      }
                      style={{ flex: 1 }}
                      className="h-12"
                    />
                    <div className="flex gap-1">
                      {index === 0 ? (
                        <Button
                          type="primary"
                          icon={<FaPlus />}
                          size="large"
                          onClick={addInputField}
                          style={{ minWidth: "32px" }}
                        />
                      ) : (
                        <>
                          <Button
                            type="primary"
                            icon={<FaPlus />}
                            size="large"
                            onClick={addInputField}
                            style={{ minWidth: "32px" }}
                          />
                          <Button
                            type="primary"
                            danger
                            icon={<FaMinus />}
                            size="large"
                            onClick={() => removeInputField(field.id)}
                            style={{ minWidth: "32px" }}
                          />
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* <Form form={editForm} layout="vertical">
            <Form.Item
              name="adminComments"
              label="Administrative Comments"
              rules={[{ required: true, message: 'Please provide administrative comments' }]}
            >
              <TextArea
                placeholder="Provide detailed administrative comments based on jury feedback and case evidence..."
                rows={4}
                maxLength={1000}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="finalResult"
              label="Final Result & Actions"
              rules={[{ required: true, message: 'Please specify final result and actions' }]}
            >
              <TextArea
                placeholder="Specify any actions to be taken, penalties, recommendations, or case closure details..."
                rows={3}
                maxLength={800}
                showCount
              />
            </Form.Item>
          </Form> */}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-700 text-sm">
              <strong>Note:</strong> This final decision will be permanently
              recorded and the case will be marked as finalized. All parties
              will be notified of the outcome.
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
};
