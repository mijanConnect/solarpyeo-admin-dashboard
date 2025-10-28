import { Form, Input } from "antd";
import { useEffect } from "react";

const FormItem = ({ name, label, inputStyle = {} }) => {
  const form = Form.useFormInstance();

  useEffect(() => {
    form.setFieldsValue({ name: "" });
  }, [form]);

  return (
    <Form.Item
      name={name}
      label={<p>{label}</p>}
      rules={[
        {
          required: true,
          message: `Please Enter your ${name}`,
        },
      ]}
    >
      <Input
        placeholder={`Enter Your ${label}`}
        style={{
          height: 45,
          border: "1px solid #b91c1c",
          outline: "none",
          boxShadow: "none",
          borderRadius: "200px",
          ...inputStyle,
        }}
      />
    </Form.Item>
  );
};

export default FormItem;
