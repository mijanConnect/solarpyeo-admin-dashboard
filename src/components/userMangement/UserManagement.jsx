import { Button, Input, message, Select, Space, Table, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  useCreateUserMutation,
  useGetUsersQuery,
  useToggleUserBanMutation,
} from "../../redux/apiSlices/userManagementSlice";
import AddUserModal from "./AddUserModal";
import UserDetailsModal from "./UserDetailsModal";
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All User");
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBanFilter, setIsBanFilter] = useState(undefined);

  // fetch users from server with controlled params
  const {
    data: usersResponse,
    error,
    isLoading,
    refetch,
  } = useGetUsersQuery({ page, limit, searchTerm, isBan: isBanFilter });
  const [toggleUserBan, { isLoading: isToggling }] = useToggleUserBanMutation();
  const [togglingId, setTogglingId] = useState(null);
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const usersData = usersResponse?.data || [];

  const mappedUsers = useMemo(() => {
    return usersData.map((u) => ({
      key: u?._id || u?.id || Math.random().toString(36).slice(2),
      _id: u?._id || u?.id,
      name:
        u?.firstName +
        " " +
        (u?.middleName ? u.middleName + " " : "") +
        (u?.lastName || ""),
      email: u?.email || "N/A",
      phone: u?.phone || "N/A",
      profile: u?.profile || null,
      submission: u?.submission || 0,
      invest: u?.invest || "$0.00",
      isBan: typeof u?.isBan === "boolean" ? u.isBan : false,
      role: u?.role || "N/A",
      createdAt: u?.createdAt || u?.created_at || null,
      raw: u,
    }));
  }, [usersData]);

  // initialize local users state from API mapping so UI actions (toggle/add) affect the table
  useEffect(() => {
    setUsers(mappedUsers);
    if (usersResponse?.pagination) {
      setPagination((p) => ({
        ...p,
        total: usersResponse.pagination.total ?? mappedUsers.length,
        current: usersResponse.pagination.page ?? p.current,
        pageSize: usersResponse.pagination.limit ?? p.pageSize,
      }));
      // Keep local controls in sync with server values
      if (usersResponse.pagination.page) setPage(usersResponse.pagination.page);
      if (usersResponse.pagination.limit)
        setLimit(usersResponse.pagination.limit);
    } else {
      setPagination((p) => ({ ...p, total: mappedUsers.length }));
    }
  }, [mappedUsers, usersResponse]);

  const handleAddUser = async (userData) => {
    try {
      await createUser(userData).unwrap();
      message.success("User created successfully!");
      setAddModalVisible(false);
      // Refetch to get the updated list from server
      refetch();
    } catch (error) {
      message.error(error?.data?.message || "Failed to create user");
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setDetailsModalVisible(true);
  };

  const handleTurnOff = async (userId) => {
    try {
      // find current user state to compute next flag
      const current = users.find((u) => u._id === userId || u.id === userId);
      const nextIsBan = current ? !current.isBan : true;
      setTogglingId(userId);
      await toggleUserBan({ id: userId, isBan: nextIsBan }).unwrap();
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId || u.id === userId ? { ...u, isBan: nextIsBan } : u
        )
      );
      message.success(`User ${nextIsBan ? "inactive" : "active"} successfully`);
      // optionally refresh from server to ensure sync
      // await refetch();
    } catch (e) {
      message.error("Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (text, record, index) => {
        return (pagination.current - 1) * pagination.pageSize + index + 1;
      },
    },
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      align: "left",
      render: (name) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#f0f0f0",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            👤
          </div>
          <span style={{ fontWeight: "500" }}>{name}</span>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Submission",
      dataIndex: "submission",
      key: "submission",
      align: "center",
    },
    {
      title: "Invest",
      dataIndex: "invest",
      key: "invest",
      align: "center",
      render: (invest) => <span style={{ fontWeight: "500" }}>{invest}</span>,
    },
    {
      title: "Status",
      dataIndex: "isBan",
      key: "isBan",
      align: "center",
      render: (isBan, record) => (
        <Tag color={!isBan ? "green" : "red"} style={{ padding: "4px 12px" }}>
          {!isBan ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            onClick={() => handleViewDetails(record)}
            style={{
              borderColor: "#d9d9d9",
              color: "#666",
              fontSize: "12px",
            }}
          >
            View Details
          </Button>
          <Button
            size="small"
            danger
            onClick={() => handleTurnOff(record._id || record.id)}
            style={{
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
              color: "white",
              fontSize: "12px",
            }}
            loading={togglingId === (record._id || record.id) && isToggling}
          >
            {record.isBan ? "Turn On" : "Turn Off"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Select
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setPage(1);
              // Map UI filter to API parameter
              if (value === "All User") {
                setIsBanFilter(undefined);
              } else if (value === "Active") {
                setIsBanFilter(false);
              } else if (value === "Banned") {
                setIsBanFilter(true);
              }
            }}
            style={{ width: "200px" }}
            size="large"
          >
            <Option value="All User"> All User</Option>
            <Option value="Active">Active </Option>
            <Option value="Banned">Banned </Option>
          </Select>
          <Input.Search
            allowClear
            placeholder="Search users..."
            style={{ width: 260 }}
            size="large"
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              if (!val) {
                setPage(1);
              }
            }}
            onSearch={(v) => {
              setSearchTerm(v || "");
              setPage(1);
            }}
          />
        </div>

        <Button
          type="primary"
          size="large"
          onClick={() => setAddModalVisible(true)}
          style={{
            backgroundColor: "#B91C1C",
            borderColor: "primary",
            padding: "0 32px",
            borderRadius: "6px",
          }}
        >
          Add New User
        </Button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey={(r) => r._id || r.id}
          pagination={{
            ...pagination,
            size: "default",
            onChange: (current, pageSize) => {
              setPage(current);
              setLimit(pageSize);
            },
          }}
          loading={isLoading}
          size="large"
          scroll={{ x: "max-content" }}
          // style={{ borderRadius: "8px" }}
          className="custom-table"
          //  scroll={{ x: 'max-content' }}
        />
      </div>

      {/* Modals */}
      <AddUserModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleAddUser}
        isLoading={isCreating}
      />

      <UserDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagement;
