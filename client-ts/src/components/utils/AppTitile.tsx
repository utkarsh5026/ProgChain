import React from "react";

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
  const HeadingTag = `h${size}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent mb-5 text-center">
      {title}
    </HeadingTag>
  );
};

export default AppTitle;
