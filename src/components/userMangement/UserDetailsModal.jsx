import { Button, Modal, Tag } from "antd";

// User Details Modal Component
const UserDetailsModal = ({ visible, onClose, user }) => {
  return (
    <Modal
      title="User Details"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
    >
      {user && (
        <div className="space-y-4 mt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Name:</label>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <label>Email:</label>
              <p className="font-medium">{user.email}</p>
            </div>
            {/* <div>
              <label>Phone:</label>
              <p className="font-medium">{user.phone}</p>
            </div> */}
            <div>
              <label>Investment:</label>
              <p className="font-medium text-blue-600">{user.invest}</p>
            </div>
            <div>
              <label>Submissions:</label>
              <p className="font-medium">{user.submission}</p>
            </div>
            <div>
              <label>Status:</label>
              <Tag
                color={!user.isBan ? "green" : "red"}
                style={{ padding: "2px 12px" }}
              >
                {!user.isBan ? "Active" : "Inactive"}
              </Tag>
            </div>
          </div>
          {/* <div>
            <label>Address:</label>
            <p className="font-medium">{user.address}</p>
          </div> */}

          <div className="flex justify-end mt-8">
            <Button size="large" onClick={onClose} className="px-8">
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UserDetailsModal;
