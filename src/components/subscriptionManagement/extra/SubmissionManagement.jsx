import { Input, message, Modal, Select, Table } from "antd";
import { useState } from "react";
import {
  AcceptModal,
  EditModal,
  JuryModal,
  PDFModal,
} from "./GeneratePDFContent ";
import { InitialTableColumns, InitialTableData } from "./InitialTableColumns";
import { MisuseTableColumns, MisuseTableData } from "./MisuseTableColumns";

const { Option } = Select;

const SubmissionManagementCom = () => {
  const [data, setData] = useState(() => InitialTableData());
  const [searchText, setSearchText] = useState("");
  const [submissionType, setSubmissionType] = useState("All");
  const [isPDFModalVisible, setIsPDFModalVisible] = useState(false);
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [isJuryModalVisible, setIsJuryModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filter data by search only. The dropdown selects which table/columns to use
  // but does NOT filter rows by submission type.
  const filteredData = data.filter((item) => {
    const q = searchText.trim().toLowerCase();
    if (!q) return true;
    return (
      (item.initiatorName || "").toLowerCase().includes(q) ||
      (item.email || "").toLowerCase().includes(q) ||
      (item.caseType || "").toLowerCase().includes(q) ||
      (item.submissionType || "").toLowerCase().includes(q)
    );
  });

  // Modal handlers
  const showPDFModal = (record) => {
    setSelectedRecord(record);
    setIsPDFModalVisible(true);
  };

  const showAcceptModal = (record) => {
    setSelectedRecord(record);
    setIsAcceptModalVisible(true);
  };

  const showJuryModal = (record) => {
    setSelectedRecord(record);
    setIsJuryModalVisible(true);
  };

  const showEditModal = (record) => {
    setSelectedRecord(record);
    setIsEditModalVisible(true);
  };

  // Action handlers
  const handleAcceptSubmit = () => {
    const updatedData = data.map((item) =>
      item.id === selectedRecord.id ? { ...item, status: "Sent to Jury" } : item
    );
    setData(updatedData);
    setIsAcceptModalVisible(false);
    message.success("Case sent to jury for review!");
  };

  // Accept Function with Confirmation
  const directAccept = (record) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to accept this submission and send it to jury?",
      okText: "Yes, Accept",
      cancelText: "Cancel",
      onOk() {
        const updatedData = data.map((item) =>
          item.id === record.id ? { ...item, status: "Sent to Jury" } : item
        );
        setData(updatedData);
        message.success("Case sent to jury successfully!");
      },
    });
  };

  const handleJurySubmit = (juryDecision, juryReason) => {
    if (!juryDecision || !juryReason.trim()) {
      message.error("Please provide both decision and reason!");
      return false;
    }

    const updatedData = data.map((item) => {
      if (item.id === selectedRecord.id) {
        const newFeedback = [
          ...(item.juryFeedback || []),
          {
            jurorId: (item.juryFeedback?.length || 0) + 1,
            decision: juryDecision,
            reason: juryReason,
          },
        ];

        const newVoteCount = newFeedback.length;
        const newStatus =
          newVoteCount === 3 ? "Final Review" : "Under Jury Review";

        return {
          ...item,
          juryFeedback: newFeedback,
          jurorVote: `${newVoteCount} of 3`,
          status: newStatus,
        };
      }
      return item;
    });

    setData(updatedData);
    message.success("Jury decision submitted successfully!");
    return true;
  };

  const handleFinalEdit = (decisions, formValues) => {
    const updatedData = data.map((item) => {
      if (item.id === selectedRecord.id) {
        return {
          ...item,
          status: "Finalized",
          finalDecisions: decisions,
          adminComments: formValues.adminComments,
          finalResult: formValues.finalResult,
        };
      }
      return item;
    });

    setData(updatedData);
    message.success("Final decision submitted successfully!");
    return true;
  };

  const handleReject = (record) => {
    Modal.confirm({
      title: "Are you sure?",
      content: "Do you want to reject this submission?",
      okText: "Yes, Reject",
      cancelText: "Cancel",
      onOk() {
        const updatedData = data.map((item) =>
          item.id === record.id ? { ...item, status: "Rejected" } : item
        );
        setData(updatedData);
        message.success("Submission rejected!");
      },
    });
  };

  const actionHandlers = {
    showPDFModal,
    showAcceptModal,
    showJuryModal,
    showEditModal,
    handleReject,
    directAccept,
  };

  const components = {
    header: {
      row: (props) => (
        <tr
          {...props}
          style={{
            backgroundColor: "#f0f5f9",
            height: "50px",
            color: "secondary",
            fontSize: "18px",
            textAlign: "center",
            padding: "12px",
          }}
        />
      ),
      cell: (props) => (
        <th
          {...props}
          style={{
            color: "secondary",
            fontWeight: "bold",
            fontSize: "18px",
            textAlign: "center",
            padding: "12px",
          }}
        />
      ),
    },
  };

  const initialColumns = InitialTableColumns(actionHandlers);
  const misuseColumns = MisuseTableColumns(actionHandlers);

  // pick columns set & data transform based on submissionType dropdown
  const currentColumns =
    submissionType === "Misuse" ? misuseColumns : initialColumns;
  const currentData =
    submissionType === "Misuse"
      ? MisuseTableData(filteredData)
      : InitialTableData(filteredData);

  return (
    <div className="">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center justify-between w-full gap-2">
          <Input
            placeholder="Search by name, email, case type, or submission type"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 350, height: 40 }}
          />

          <Select
            value={submissionType}
            onChange={setSubmissionType}
            style={{ width: 200, height: 40 }}
          >
            <Option value="All">All Submission</Option>
            <Option value="Initial">Initial Submission</Option>
            <Option value="Misuse">Misuse Submission</Option>
            <Option value="Appeal">Appeal Submission</Option>
            <Option value="Respondent">Respondent Submission</Option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto mt-3">
        <div className="overflow-x-auto min-w-full p-0">
          <Table
            components={components}
            columns={currentColumns}
            dataSource={currentData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1300 }}
            className="custom-table"
          />
        </div>
      </div>

      {/* Modals */}
      <PDFModal
        visible={isPDFModalVisible}
        onCancel={() => setIsPDFModalVisible(false)}
        selectedRecord={selectedRecord}
      />

      <AcceptModal
        visible={isAcceptModalVisible}
        onCancel={() => setIsAcceptModalVisible(false)}
        onOk={handleAcceptSubmit}
        selectedRecord={selectedRecord}
      />

      <JuryModal
        visible={isJuryModalVisible}
        onCancel={() => setIsJuryModalVisible(false)}
        onSubmit={handleJurySubmit}
        selectedRecord={selectedRecord}
      />

      <EditModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSubmit={handleFinalEdit}
        selectedRecord={selectedRecord}
      />
    </div>
  );
};

export default SubmissionManagementCom;
