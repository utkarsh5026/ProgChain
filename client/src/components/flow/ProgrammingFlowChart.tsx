import React, { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Node,
  NodeTypes,
  Edge,
  useReactFlow,
  Connection,
  addEdge,
  Panel,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
} from "@xyflow/react";
import "reactflow/dist/style.css";
import {
  Card,
  Input,
  Typography,
  Tag,
  Modal,
  Button,
  Tooltip,
  Select,
  Space,
} from "antd";
import {
  InfoCircleOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface Resource {
  title: string;
  url: string;
}

interface NodeData extends Record<string, unknown> {
  label: string;
  details: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  codeExample?: string;
  resources?: Resource[];
}

interface FlowchartData {
  overview: string;
  nodes: Array<Node<NodeData>>;
  edges: Edge[];
}

const difficultyColors: Record<NodeData["difficulty"], string> = {
  Beginner: "green",
  Intermediate: "gold",
  Advanced: "red",
};

const FlowchartNode: React.FC<{
  data: NodeData;
  isConnectable: boolean;
}> = ({ data }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Tooltip title="Click for more details">
              <span
                style={{ cursor: "pointer" }}
                onClick={() => setIsModalVisible(true)}
              >
                {data.label}
              </span>
            </Tooltip>
            <Tag color={difficultyColors[data.difficulty]}>
              {data.difficulty}
            </Tag>
          </div>
        }
        size="small"
        style={{ width: 200, fontSize: "12px" }}
        extra={<InfoCircleOutlined onClick={() => setIsModalVisible(true)} />}
      >
        <Paragraph ellipsis={{ rows: 2 }}>{data.details}</Paragraph>
      </Card>
      <Modal
        title={data.label}
        visible={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        <Tag
          color={difficultyColors[data.difficulty]}
          style={{ marginBottom: "10px" }}
        >
          {data.difficulty}
        </Tag>
        <Paragraph>{data.details}</Paragraph>
        {data.codeExample && (
          <>
            <Text strong>Code Example:</Text>
            <pre
              style={{
                background: "#f0f0f0",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <code>{data.codeExample}</code>
            </pre>
          </>
        )}
        {data.resources && (
          <>
            <Text strong>Additional Resources:</Text>
            <ul>
              {data.resources.map((resource, index) => (
                <li key={index}>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {resource.title}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>
    </>
  );
};

const nodeTypes: NodeTypes = {
  custom: FlowchartNode,
};

interface ProgrammingFlowchartComponentProps {
  flowchartData: FlowchartData;
}

const ProgrammingFlowchartComponent: React.FC<
  ProgrammingFlowchartComponentProps
> = ({ flowchartData }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "All" | NodeData["difficulty"]
  >("All");
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  useEffect(() => {
    const initialNodes: Node<NodeData>[] = flowchartData.nodes.map((node) => ({
      ...node,
      type: "custom",
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    }));

    const initialEdges: Edge[] = flowchartData.edges.map((edge, index) => ({
      ...edge,
      id: `e${index}`,
      type: "smoothstep",
      animated: true,
    }));

    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [flowchartData]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleDifficultyChange = (value: "All" | NodeData["difficulty"]) => {
    setSelectedDifficulty(value);
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        hidden: value !== "All" && node.data.difficulty !== value,
      }))
    );
    fitView();
  };

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
        <Panel position="top-left">
          <Space>
            <Select
              defaultValue="All"
              style={{ width: 120 }}
              onChange={handleDifficultyChange}
            >
              <Option value="All">All Levels</Option>
              <Option value="Beginner">Beginner</Option>
              <Option value="Intermediate">Intermediate</Option>
              <Option value="Advanced">Advanced</Option>
            </Select>
            <Tooltip title="Zoom In">
              <Button icon={<ZoomInOutlined />} onClick={() => zoomIn()} />
            </Tooltip>
            <Tooltip title="Zoom Out">
              <Button icon={<ZoomOutOutlined />} onClick={() => zoomOut()} />
            </Tooltip>
            <Tooltip title="Fit View">
              <Button icon={<FullscreenOutlined />} onClick={() => fitView()} />
            </Tooltip>
          </Space>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const App: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [flowchartData, setFlowchartData] = useState<FlowchartData | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/generate-flowchart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data: FlowchartData = await response.json();
      setFlowchartData(data);
    } catch (error) {
      console.error("Error fetching flowchart data:", error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <Title level={2}>Programming Concept Flowchart Generator</Title>
      <Input.Search
        placeholder="Enter a programming topic or concept"
        enterButton="Generate Flowchart"
        size="large"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        onSearch={handleSubmit}
        loading={loading}
      />
      {flowchartData && (
        <ProgrammingFlowchartComponent flowchartData={flowchartData} />
      )}
    </div>
  );
};

export default App;
