import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

interface AppTitleProps {
  title: string;
  size: 1 | 2 | 3 | 4 | 5;
}

/**
 * AppTitle component displays a styled title with a gradient background.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The text to be displayed as the title.
 * @param {1 | 2 | 3 | 4 | 5} props.size - The size of the title, corresponding to h1-h5 HTML tags.
 * @returns {React.ReactElement} A styled Title component with the given text and size.
 */
const AppTitle: React.FC<AppTitleProps> = ({ title, size }) => {
  return (
    <Title
      level={size}
      style={{
        background: "linear-gradient(45deg, #2196F3, #FF4081)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "20px",
        textAlign: "center",
      }}
    >
      {title}
    </Title>
  );
};

export default AppTitle;
