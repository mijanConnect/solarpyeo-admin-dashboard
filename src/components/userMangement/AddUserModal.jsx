import { Button, Input, Modal, Select, message } from "antd";
import { useState } from "react";

const { Option } = Select;

const AddUserModal = ({ visible, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    gender: "",
    phone: "",
    address: "",
    birthDate: "",
  });

  const handleSave = () => {
    if (
      !formData.firstName ||
      !formData.middleName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.role ||
      !formData.gender ||
      !formData.phone ||
      !formData.address ||
      !formData.birthDate
    ) {
      message.error("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 8) {
      message.error("Password must be at least 8 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    onSave(formData);
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      gender: "",
      phone: "",
      address: "",
      birthDate: "",
    });
  };

  const handleCancel = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      gender: "",
      phone: "",
      address: "",
      birthDate: "",
    });
    onClose();
  };

  return (
    <Modal
      title="Add New User"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      centered
    >
      <div className="mt-6 space-y-4">
        {/* Name Fields - 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name*
            </label>
            <Input
              placeholder="Enter first name"
              size="large"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Middle Name*
            </label>
            <Input
              placeholder="Enter middle name"
              size="large"
              value={formData.middleName}
              onChange={(e) =>
                setFormData({ ...formData, middleName: e.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name*
            </label>
            <Input
              placeholder="Enter last name"
              size="large"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email*
            </label>
            <Input
              placeholder="Enter User email"
              size="large"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
        </div>

        {/* Password Fields - 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password*
            </label>
            <Input.Password
              placeholder="Enter Password"
              size="large"
              value={formData.password}
              minLength={8}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              status={
                formData.password && formData.password.length < 8 ? "error" : ""
              }
            />
            {formData.password && formData.password.length < 8 && (
              <p className="text-red-500 text-xs mt-1">
                Password must be at least 8 characters
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password*
            </label>
            <Input.Password
              placeholder="Re-enter Password"
              size="large"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              status={
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? "error"
                  : ""
              }
            />
            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Passwords do not match
                </p>
              )}
          </div>
        </div>

        {/* Gender, Phone - 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender*
            </label>
            <Select
              placeholder="Select gender"
              size="large"
              className="w-full"
              value={formData.gender}
              onChange={(value) => setFormData({ ...formData, gender: value })}
            >
              <Option value="male">Male</Option>
              <Option value="female">Female</Option>
              <Option value="other">Other</Option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone*
            </label>
            <Input
              placeholder="Enter phone number"
              size="large"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>
        </div>

        {/* Birth Date, Role - 2 columns */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date*
            </label>
            <Input
              placeholder="Enter birth date"
              size="large"
              type="date"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Role*
            </label>
            <Select
              placeholder="Assign Role"
              size="large"
              className="w-full"
              value={formData.role}
              onChange={(value) => setFormData({ ...formData, role: value })}
            >
              <Option value="MODERATOR">Moderator</Option>
              <Option value="JUROR">Juror</Option>
              <Option value="SITEFUND">Site Fund</Option>
              <Option value="DOCUMENTS">Documents</Option>
              <Option value="SUPER_ADMIN">Super Admin</Option>
              <Option value="USER">User</Option>
            </Select>
          </div>
        </div>

        {/* Address - Full width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address*
          </label>
          <Input.TextArea
            placeholder="Enter address"
            size="large"
            rows={3}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <Button size="large" onClick={handleCancel} className="px-8">
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={handleSave}
            className="bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 px-8"
            loading={isLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;
