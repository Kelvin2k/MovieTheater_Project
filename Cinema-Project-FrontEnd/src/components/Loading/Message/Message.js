import React from "react";
import { Button, message, Space } from "antd";
const Message = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Success",
    });
  };
  const error = () => {
    messageApi.open({
      type: "error",
      content: "Failed!",
    });
  };

  return (
    <>
      {contextHolder}
      <Space>
        <Button onClick={success}>Success</Button>
        <Button onClick={error}>Error</Button>
      </Space>
    </>
  );
};
export default Message;
