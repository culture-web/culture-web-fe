import React, { useState, useEffect } from 'react';
import {
  Layout, Tabs, Button, message, Spin, Card, Row, Col, Statistic, Popconfirm, Table,
  Form, Input, Divider, Typography, Switch, Tooltip, Tag, Space, Dropdown, Modal, Upload, Select, Checkbox, ConfigProvider, theme, Progress,
} from 'antd';
import {
  LogoutOutlined, DeleteOutlined, ReloadOutlined, UploadOutlined,
  FileTextOutlined, MessageOutlined, FolderOutlined, PlayCircleOutlined,
  LinkOutlined, EditOutlined, DownloadOutlined, PlusOutlined, FolderAddOutlined, SearchOutlined, FilterOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useStyleToken, useColourToken } from 'themeStyles';
import BACKEND_URI from 'configs/env.config';
import './index.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface KBStats {
  total_chunks: number;
  total_files: number;
  files: string[];
  total_pages: number;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  citations?: Array<{
    id: number;
    source: string;
    page: number | null;
    similarity: number | null;
  }>;
}

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

const AdminPage: React.FC = () => {
  const styleToken = useStyleToken();
  const colourToken = useColourToken();
  const [ingestForm] = Form.useForm();
  const [chatForm] = Form.useForm();
  const [uploadTextForm] = Form.useForm();
  const [newFolderForm] = Form.useForm();
  const [stats, setStats] = useState<KBStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parsingBusy, setParsingBusy] = useState<Record<string, boolean>>({});
  const [bulkLoading, setBulkLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    // Load chat history from localStorage on mount
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [statusMap, setStatusMap] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<string>('kb');
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [renameForm] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [fileStatusFilter, setFileStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
  const [dateSort, setDateSort] = useState<'default' | 'newest' | 'oldest'>('default');
  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 50 });
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<'text' | 'pdf'>('text');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderPrefix, setFolderPrefix] = useState('');
  const [folders, setFolders] = useState<string[]>([]);
  const [chunksModalOpen, setChunksModalOpen] = useState(false);
  const [currentChunks, setCurrentChunks] = useState<any[]>([]);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [editChunkModalOpen, setEditChunkModalOpen] = useState(false);
  const [editingChunk, setEditingChunk] = useState<any>(null);
  const [editChunkForm] = Form.useForm();
  const [hoveredChunkId, setHoveredChunkId] = useState<number | null>(null);
  const [selectedChunkIds, setSelectedChunkIds] = useState<number[]>([]);
  const [chunkTagFilter, setChunkTagFilter] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [ingestJobs, setIngestJobs] = useState<Record<string, any>>({});
  const [rerankerStrategy, setRerankerStrategy] = useState<'embedding-based' | 'cross-encoder'>('embedding-based');
  const navigate = useNavigate();

  // Load reranker strategy preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rerankerStrategy');
    if (saved === 'cross-encoder' || saved === 'embedding-based') {
      setRerankerStrategy(saved);
    }
  }, []);

  // Save reranker strategy to localStorage when it changes
  const handleRerankerStrategyChange = (value: 'embedding-based' | 'cross-encoder') => {
    setRerankerStrategy(value);
    localStorage.setItem('rerankerStrategy', value);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    message.success('Logged out successfully');
    navigate('/admin-login');
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/stats`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      message.error('Failed to load knowledge base stats');
    } finally {
      setLoading(false);
    }
  };

  const fileColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div className="file-name">
          <FileTextOutlined />
          <Text strong>{text}</Text>
        </div>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'upload_date',
      key: 'upload_date',
      sorter: (a: any, b: any) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime(),
      defaultSortOrder: 'descend' as const,
      render: (date: string) => (
        <div className="upload-date">
          <span>{new Date(date).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}</span>
        </div>
      ),
    },
    {
      title: 'Enable',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: any) => (
        <Switch checked={enabled} onChange={(checked) => toggleEnable(record.name, checked)} />
      ),
    },
    {
      title: 'Chunk Number',
      dataIndex: 'chunk_number',
      key: 'chunk_number',
    },
    {
      title: 'Parse',
      key: 'parse',
      render: (_: any, record: any) => {
        const status = statusMap[record.name];
        const progress = status?.progress ?? 0;
        const isParsed = status?.status === 'completed';
        const startTime = status?.start_time ? new Date(status.start_time) : null;
        const endTime = status?.end_time ? new Date(status.end_time) : null;
        const durationMs = startTime ? ((endTime ? endTime.getTime() : Date.now()) - startTime.getTime()) : 0;
        const durationSec = Math.round(durationMs / 1000);
        const tip = (
          <div>
            <div>Status: {status?.status || 'Not parsed'}</div>
            <div>Process Begin At: {startTime ? startTime.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }) : '—'}</div>
            <div>Process Duration: {durationSec}s</div>
            <div>Progress Msg: {status?.last_message || '—'}</div>
          </div>
        );
        return (
          <Space>
            {progress > 0 && progress < 100 && (
              <Tooltip title={tip}>
                <Tag color="blue">{`Parsing ${progress}%`}</Tag>
              </Tooltip>
            )}
            {isParsed && (
              <Tooltip title={tip}>
                <Tag color="green">Parsed</Tag>
              </Tooltip>
            )}
            <Button
              type="text"
              icon={isParsed ? <ReloadOutlined /> : <PlayCircleOutlined />}
              loading={!!parsingBusy[record.name]}
              onClick={() => startParse(record.name)}
            />
          </Space>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { name: string }) => (
        <Space>
          <Tooltip title="View Chunks">
            <Button type="text" icon={<FileTextOutlined />} onClick={() => handleViewChunks(record.name)} />
          </Tooltip>
          <Tooltip title="Rename">
            <Button type="text" icon={<EditOutlined />} onClick={() => { setRenameTarget(record.name); renameForm.setFieldsValue({ newName: record.name }); }} />
          </Tooltip>
          <Tooltip title="Download">
            <Button type="text" icon={<DownloadOutlined />} onClick={() => downloadFile(record.name)} />
          </Tooltip>
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            type="text"
            onClick={() => {
              setDeleteTarget(record.name);
              setDeleteModalOpen(true);
            }}
          />
        </Space>
      ),
    },
  ];

  const [files, setFiles] = useState<any[]>([]);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/files`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to load files');
      const data = await response.json();
      setFiles(data || []);
    } catch (e) {
      console.error('Error loading files:', e);
      message.error('Failed to load dataset files');
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/folders`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to load folders');
      const data = await response.json();
      setFolders(data.folders || []);
    } catch (e) {
      console.error('Error loading folders:', e);
    }
  };

  const upsertIngestJob = (jobId: string, data: any) => {
    setIngestJobs((prev) => ({ ...prev, [jobId]: { ...(prev[jobId] || {}), ...data } }));
  };

  const addMenuItems = [
    {
      key: 'upload',
      icon: <UploadOutlined />,
      label: 'Upload File',
    },
    {
      key: 'folder',
      icon: <FolderAddOutlined />,
      label: 'New Folder',
    },
  ];

  const handleAddMenuClick = ({ key }: any) => {
    if (key === 'upload') {
      setUploadModalOpen(true);
      setUploadMode('text');
    }
    if (key === 'folder') {
      setFolderModalOpen(true);
    }
  };

  const fetchStatus = async (fileName: string) => {
    try {
      const res = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${fileName}/status`, { headers: getAuthHeaders() });
      if (!res.ok) return;
      const data = await res.json();
      setStatusMap((prev) => ({ ...prev, [fileName]: data }));
    } catch {}
  };

  const filteredFiles = files
    .filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((f) => (folderFilter ? f.name.startsWith(`${folderFilter}/`) : true))
    .filter((f) => {
      if (fileStatusFilter === 'enabled') return f.enabled;
      if (fileStatusFilter === 'disabled') return !f.enabled;
      return true;
    });

  const sortedFiles = (() => {
    if (dateSort === 'newest') {
      return [...filteredFiles].sort((a, b) => new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime());
    }
    if (dateSort === 'oldest') {
      return [...filteredFiles].sort((a, b) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime());
    }
    return filteredFiles;
  })();

  const runBulk = async (label: string, tasks: Promise<void>[]) => {
    if (!selectedRowKeys.length) {
      message.info('Select files to perform bulk action');
      return;
    }
    setBulkLoading(true);
    try {
      await Promise.all(tasks);
      message.success(`${label} ${selectedRowKeys.length} file(s)`);
      setSelectedRowKeys([]);
      await fetchFiles();
      await fetchStats();
    } catch (error: any) {
      console.error('Bulk action error:', error);
      message.error(error.message || 'Bulk action failed');
    } finally {
      setBulkLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchFiles();
    fetchFolders();
  }, []);

  // Save chat messages to localStorage whenever they change
  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  // Poll ingest job statuses
  useEffect(() => {
    const activeJobs = Object.entries(ingestJobs).filter(([, job]) => job.status && !['completed', 'failed'].includes(job.status));
    if (!activeJobs.length) return undefined;

    const interval = setInterval(async () => {
      for (const [jobId] of activeJobs) {
        try {
          const res = await fetch(`${BACKEND_URI}/k-manage/jobs/${jobId}/status`, { headers: getAuthHeaders() });
          if (!res.ok) continue;
          const data = await res.json();
          upsertIngestJob(jobId, data);

          if (data.status === 'completed') {
            message.success(`Ingested ${data.fileName || 'file'}`);
            fetchFiles();
            fetchStats();
            setTimeout(() => {
              setIngestJobs((prev) => {
                const copy = { ...prev };
                delete copy[jobId];
                return copy;
              });
            }, 4000);
          }

          if (data.status === 'failed') {
            message.error(data.message || 'Upload failed');
            setTimeout(() => {
              setIngestJobs((prev) => {
                const copy = { ...prev };
                delete copy[jobId];
                return copy;
              });
            }, 6000);
          }
        } catch (err) {
          console.error('Job polling error:', err);
        }
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [ingestJobs]);

  // Poll statuses for running jobs - more frequently for faster jobs
  useEffect(() => {
    const interval = setInterval(() => {
      files.forEach((f) => fetchStatus(f.name));
    }, 1000); // Changed from 3000ms to 1000ms for faster updates
    return () => clearInterval(interval);
  }, [files]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [searchTerm, folderFilter, files.length]);

  const handleIngestDocument = async (values: any) => {
    setIngesting(true);
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/ingest`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fileName: values.fileName,
          text: values.documentText,
          metadata: { author: values.author || 'Unknown' },
        }),
      });

      if (!response.ok) throw new Error('Failed to ingest document');

      message.success('Document ingested successfully!');
      ingestForm.resetFields();
      await fetchStats();
    } catch (error: any) {
      console.error('Error ingesting document:', error);
      message.error(error.message || 'Failed to ingest document');
    } finally {
      setIngesting(false);
    }
  };

  const handleDeleteDocument = async (fileName: string) => {
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${fileName}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error('Failed to delete document');

      message.success('Document deleted successfully!');
      await fetchFiles();
      await fetchStats();
      await fetchFolders();
    } catch (error) {
      console.error('Error deleting document:', error);
      message.error('Failed to delete document');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteTarget) {
        await handleDeleteDocument(deleteTarget);
      } else {
        await runBulk('Deleted', selectedRowKeys.map((key) => deleteDocumentRequest(key as string)));
      }
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      await fetchFolders();
    }
  };

  const deleteDocumentRequest = (fileName: string) => fetch(
    `${BACKEND_URI}/k-manage/knowledge-base/${fileName}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    },
  ).then((res) => {
    if (!res.ok) throw new Error('Failed to delete document');
  });

  const toggleEnable = async (fileName: string, enabled: boolean) => {
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${fileName}/enable`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ enabled }),
      });
      if (!response.ok) throw new Error('Failed to update enabled state');
      message.success(`${enabled ? 'Enabled' : 'Disabled'} ${fileName}`);
      await fetchFiles();
    } catch (error) {
      console.error('Enable toggle failed:', error);
      message.error('Failed to update enabled state');
    }
  };

  const postEnable = (fileName: string, enabled: boolean) => fetch(
    `${BACKEND_URI}/k-manage/knowledge-base/${fileName}/enable`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ enabled }),
    },
  ).then((res) => {
    if (!res.ok) throw new Error('Failed to update enabled state');
  });

  const reembedFile = async (fileName: string) => {
    setParsingBusy((prev) => ({ ...prev, [fileName]: true }));
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${fileName}/reembed`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Re-embed failed');
      const data = await response.json();
      message.success(`Parsed ${fileName} (${data.chunksUpdated} chunks refreshed)`);
      await fetchFiles();
      await fetchStats();
      await fetchStatus(fileName);
    } catch (error) {
      console.error('Re-embed error:', error);
      message.error('Failed to parse/refresh file');
    } finally {
      setParsingBusy((prev) => ({ ...prev, [fileName]: false }));
    }
  };

  const reembedRequest = (fileName: string) => fetch(
    `${BACKEND_URI}/k-manage/knowledge-base/${fileName}/reembed`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
    },
  ).then((res) => {
    if (!res.ok) throw new Error('Re-embed failed');
  });

  const startParse = async (fileName: string) => {
    setParsingBusy((prev) => ({ ...prev, [fileName]: true }));
    try {
      const res = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${fileName}/parse`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Start parse failed');
      const data = await res.json();
      message.success(`Started parsing: ${fileName}`);
      
      // Fetch status immediately and then poll more frequently
      await fetchStatus(fileName);
      
      // Poll status every 500ms for the next 60 seconds to catch completion
      let pollCount = 0;
      const statusInterval = setInterval(async () => {
        pollCount++;
        await fetchStatus(fileName);
        
        // Stop polling after 60 seconds or if job is completed/failed
        if (pollCount > 120) {
          clearInterval(statusInterval);
        } else {
          const status = statusMap[fileName];
          if (status && (status.status === 'completed' || status.status === 'failed')) {
            clearInterval(statusInterval);
            await fetchFiles(); // Refresh file list when done
            await fetchStats(); // Refresh stats
          }
        }
      }, 500);
    } catch (e) {
      console.error('Start parse error:', e);
      message.error('Failed to start parsing');
    } finally {
      setParsingBusy((prev) => ({ ...prev, [fileName]: false }));
    }
  };

  const parseRequest = (fileName: string) => fetch(
    `${BACKEND_URI}/k-manage/knowledge-base/${fileName}/parse`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
    },
  ).then((res) => {
    if (!res.ok) throw new Error('Start parse failed');
  });

  const downloadFile = async (fileName: string) => {
    try {
      const res = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${fileName}/export`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.txt`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Download error:', e);
      message.error('Failed to download file');
    }
  };

  const submitRename = async () => {
    try {
      const values = await renameForm.validateFields();
      const res = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${renameTarget}/rename`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newName: values.newName }),
      });
      if (!res.ok) throw new Error('Rename failed');
      message.success('Renamed successfully');
      setRenameTarget(null);
      renameForm.resetFields();
      await fetchFiles();
      await fetchStats();
    } catch (e) {
      // Ignore validation errors from form submission
      if ((e as any)?.errorFields) return Promise.reject(e);
      console.error('Rename error:', e);
      message.error('Failed to rename');
      return Promise.reject(e);
    }
  };

  const handleUploadText = async (values: any) => {
    setUploading(true);
    const finalName = folderPrefix ? `${folderPrefix}/${values.fileName}` : values.fileName;
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/ingest`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fileName: finalName,
          text: values.documentText,
          metadata: { author: values.author || 'Unknown' },
        }),
      });

      if (!response.ok) throw new Error('Failed to ingest document');

      message.success('Document uploaded successfully');
      uploadTextForm.resetFields();
      setUploadModalOpen(false);
      await fetchFiles();
      await fetchStats();
    } catch (error: any) {
      console.error('Upload text error:', error);
      message.error(error.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadPdf = async (values: any) => {
    if (!pdfFile) {
      message.error('Please choose a PDF file');
      return;
    }

    // Limit PDF upload size to 15 MB
    const maxSizeBytes = 15 * 1024 * 1024;
    if (pdfFile.size > maxSizeBytes) {
      message.error('File is too large. Maximum size is 15 MB.');
      return;
    }

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    const desiredName = values.pdfFileName || pdfFile.name;
    const finalName = folderPrefix ? `${folderPrefix}/${desiredName}` : desiredName;
    const renamedFile = new File([pdfFile], finalName, { type: pdfFile.type });

    try {
      const formData = new FormData();
      formData.append('pdf', renamedFile);

      const res = await fetch(`${BACKEND_URI}/k-manage/ingest-pdf`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 409) {
        const errorData = await res.json();
        message.error(errorData.error || 'A file with this name already exists');
        return;
      }

      if (!res.ok) throw new Error('Failed to upload PDF');

      const data = await res.json();
      if (data.jobId) {
        upsertIngestJob(data.jobId, {
          status: data.status || 'queued',
          progress: data.progress || 0,
          message: data.message || 'Queued',
          fileName: desiredName,
        });
        message.success('Upload started — tracking progress');
      } else {
        message.success('PDF uploaded successfully');
        await fetchFiles();
        await fetchStats();
      }

      setPdfFile(null);
      setUploadModalOpen(false);
    } catch (error: any) {
      console.error('Upload PDF error:', error);
      message.error(error.message || 'Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    try {
      const { folderName } = await newFolderForm.validateFields();
      const trimmed = folderName.trim();
      setFolderPrefix(trimmed);
      setFolderFilter(trimmed);
      const res = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/folders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ folderName: trimmed }),
      });
      
      if (res.status === 409) {
        const errorData = await res.json();
        message.error(errorData.error || 'A folder with this name already exists');
        return;
      }
      
      if (!res.ok) throw new Error('Failed to create folder');
      
      await fetchFolders();
      message.success(`Folder ready: ${trimmed}`);
      setFolderModalOpen(false);
      newFolderForm.resetFields();
    } catch (e: any) {
      if (e.errorFields) {
        // Validation errors from form
        return;
      }
      console.error('Create folder error:', e);
      message.error(e.message || 'Failed to create folder');
    }
  };

  const handleDeleteFolder = async (folderName: string) => {
    try {
      const res = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/folders/${encodeURIComponent(folderName)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to delete folder');
      message.success(`Folder deleted: ${folderName}`);
      if (folderFilter === folderName) setFolderFilter(null);
      if (folderPrefix === folderName) setFolderPrefix('');
      await Promise.all([fetchFiles(), fetchStats(), fetchFolders()]);
    } catch (error: any) {
      console.error('Delete folder error:', error);
      message.error(error.message || 'Failed to delete folder');
    }
  };

  // Fetch chunks for a file
  const handleViewChunks = async (fileName: string) => {
    try {
      setCurrentFileName(fileName);
      const response = await fetch(
        `${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}/chunks`,
        { headers: getAuthHeaders() }
      );
      if (!response.ok) throw new Error('Failed to fetch chunks');
      const data = await response.json();
      setCurrentChunks(data.chunks || []);
      setChunkTagFilter([]);
      setSelectedChunkIds([]);
      
      // Fetch PDF if available
      const lowerFileName = fileName.toLowerCase();
      if (lowerFileName.endsWith('.pdf')) {
        try {
          const pdfRes = await fetch(
            `${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}/pdf`,
            { headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` } }
          );
          if (pdfRes.ok) {
            const blob = await pdfRes.blob();
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            console.log('PDF loaded successfully:', fileName);
          } else {
            console.error('Failed to fetch PDF:', pdfRes.status, pdfRes.statusText);
          }
        } catch (pdfError) {
          console.error('Error loading PDF:', pdfError);
        }
      } else {
        setPdfUrl(''); // Clear PDF URL for non-PDF files
      }
      setChunksModalOpen(true);
    } catch (error: any) {
      console.error('Error fetching chunks:', error);
      message.error('Failed to load chunks');
    }
  };

  // Toggle chunk enabled
  const handleToggleChunkEnable = async (chunkId: number, enabled: boolean) => {
    try {
      const response = await fetch(
        `${BACKEND_URI}/k-manage/chunks/${chunkId}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ enabled }),
        }
      );
      if (!response.ok) throw new Error('Failed to update chunk');
      await handleViewChunks(currentFileName);
    } catch (error: any) {
      console.error('Error updating chunk:', error);
      message.error('Failed to update chunk');
    }
  };

  // Bulk enable chunks
  const handleBulkEnable = async () => {
    if (selectedChunkIds.length === 0) return;
    try {
      const response = await fetch(
        `${BACKEND_URI}/k-manage/chunks/bulk-enable`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ chunkIds: selectedChunkIds }),
        }
      );
      if (!response.ok) throw new Error('Failed to enable chunks');
      message.success(`Enabled ${selectedChunkIds.length} chunks`);
      setSelectedChunkIds([]);
      await handleViewChunks(currentFileName);
      await fetchFiles();
    } catch (error: any) {
      console.error('Error enabling chunks:', error);
      message.error('Failed to enable chunks');
    }
  };

  // Bulk disable chunks
  const handleBulkDisable = async () => {
    if (selectedChunkIds.length === 0) return;
    try {
      const response = await fetch(
        `${BACKEND_URI}/k-manage/chunks/bulk-disable`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ chunkIds: selectedChunkIds }),
        }
      );
      if (!response.ok) throw new Error('Failed to disable chunks');
      message.success(`Disabled ${selectedChunkIds.length} chunks`);
      setSelectedChunkIds([]);
      await handleViewChunks(currentFileName);
      await fetchFiles();
    } catch (error: any) {
      console.error('Error disabling chunks:', error);
      message.error('Failed to disable chunks');
    }
  };

  // Bulk delete chunks
  const handleBulkDeleteChunks = async () => {
    if (selectedChunkIds.length === 0) return;
    try {
      const response = await fetch(
        `${BACKEND_URI}/k-manage/chunks/bulk-delete`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ chunkIds: selectedChunkIds }),
        }
      );
      if (!response.ok) throw new Error('Failed to delete chunks');
      message.success(`Deleted ${selectedChunkIds.length} chunks`);
      setSelectedChunkIds([]);
      await handleViewChunks(currentFileName);
      await fetchFiles();
    } catch (error: any) {
      console.error('Error deleting chunks:', error);
      message.error('Failed to delete chunks');
    }
  };

  // Open edit chunk modal
  const handleEditChunk = (chunk: any) => {
    setEditingChunk(chunk);
    editChunkForm.setFieldsValue({
      content: chunk.content,
      keywords: chunk.keywords || [],
      questions: chunk.questions || [],
      tags: chunk.tags || [],
      enabled: chunk.enabled !== false,
    });
    setEditChunkModalOpen(true);
  };

  // Save chunk edits
  const handleSaveChunk = async () => {
    try {
      const values = await editChunkForm.validateFields();
      const response = await fetch(
        `${BACKEND_URI}/k-manage/chunks/${editingChunk.id}`,
        {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(values),
        }
      );
      if (!response.ok) throw new Error('Failed to update chunk');
      message.success('Chunk updated');
      setEditChunkModalOpen(false);
      // Refresh chunks
      await handleViewChunks(currentFileName);
    } catch (error: any) {
      console.error('Error updating chunk:', error);
      message.error('Failed to update chunk');
    }
  };

  // Delete chunk
  const handleDeleteChunk = async (chunkId: number) => {
    try {
      const response = await fetch(
        `${BACKEND_URI}/k-manage/chunks/${chunkId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        }
      );
      if (!response.ok) throw new Error('Failed to delete chunk');
      message.success('Chunk deleted');
      // Refresh chunks
      await handleViewChunks(currentFileName);
      await fetchFiles();
    } catch (error: any) {
      console.error('Error deleting chunk:', error);
      message.error('Failed to delete chunk');
    }
  };

  const handleSendMessage = async (values: any) => {
    const userMessage = values.chatInput;
    
    // Add user message to chat
    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };
    setChatMessages([...chatMessages, newUserMessage]);
    chatForm.resetFields();
    setChatLoading(true);

    try {
      const response = await fetch(`${BACKEND_URI}/kathakali/chat-mudras`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          query: userMessage,
          rerankerStrategy: rerankerStrategy, // Pass selected reranking strategy
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();

      // Backend returns structured response with shortAnswer, sections, etc.
      let content = data.shortAnswer || '';
      
      // Append sections if available
      if (data.sections && data.sections.length > 0) {
        const sectionsText = data.sections.map((s: any) => 
          `\n\n**${s.title}**\n${s.content}`
        ).join('');
        content += sectionsText;
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: content || 'No response',
        timestamp: Date.now(),
        citations: data.citations || [],
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);
      message.error(error.message || 'Failed to get response');
    } finally {
      setChatLoading(false);
    }
  };

  const datasetContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <Card style={{ background: colourToken.primary, border: `1px solid #3a3d4a`, borderRadius: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: colourToken.pink, marginBottom: '8px' }}>
              {stats?.total_files || 0}
            </div>
            <Text style={{ color: colourToken.gray }}>Total Files</Text>
          </div>
        </Card>
        <Card style={{ background: colourToken.primary, border: `1px solid #3a3d4a`, borderRadius: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: colourToken.pink, marginBottom: '8px' }}>
              {stats?.total_chunks || 0}
            </div>
            <Text style={{ color: colourToken.gray }}>Total Chunks</Text>
          </div>
        </Card>
        <Card style={{ background: colourToken.primary, border: `1px solid #3a3d4a`, borderRadius: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: colourToken.pink, marginBottom: '8px' }}>
              {stats?.total_pages || 0}
            </div>
            <Text style={{ color: colourToken.gray }}>Total Pages</Text>
          </div>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card style={{ 
        background: colourToken.primary, 
        border: `1px solid #3a3d4a`, 
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Header with Title and Actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: `1px solid #3a3d4a`,
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <Title level={4} style={{ margin: 0, color: colourToken.white }}>Knowledge Base Files</Title>
            <Text style={{ color: colourToken.gray, fontSize: '12px' }}>
              {folderFilter ? `Folder: ${folderFilter}` : 'All files'}
            </Text>
          </div>
          <Space wrap>
            <Input
              placeholder="Search files..."
              prefix={<SearchOutlined />}
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: colourToken.darkGray,
                borderColor: '#3a3d4a',
                color: colourToken.white,
                width: '250px'
              }}
            />
            <Select
              allowClear
              placeholder="Folder"
              style={{ width: 180 }}
              value={folderFilter || undefined}
              options={folders.map((f) => ({ label: f, value: f }))}
              onChange={(val) => {
                setFolderFilter(val || null);
                setFolderPrefix(val || '');
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
            />
            {folderFilter && (
              <Popconfirm
                title={`Delete folder "${folderFilter}"? This removes its files.`}
                onConfirm={() => handleDeleteFolder(folderFilter)}
              >
                <Button danger size="small">
                  Delete Folder
                </Button>
              </Popconfirm>
            )}
            <Dropdown
              trigger={['click']}
              placement="bottomRight"
              menu={{
                items: [
                  { key: 'status_all', label: 'Status: All' },
                  { key: 'status_enabled', label: 'Status: Enabled' },
                  { key: 'status_disabled', label: 'Status: Disabled' },
                ],
                onClick: ({ key }) => {
                  if (key === 'status_all') setFileStatusFilter('all');
                  if (key === 'status_enabled') setFileStatusFilter('enabled');
                  if (key === 'status_disabled') setFileStatusFilter('disabled');
                },
              }}
            >
              <Button
                icon={<FilterOutlined />}
                type={(fileStatusFilter !== 'all' || dateSort !== 'default') ? 'primary' : 'default'}
                style={(fileStatusFilter !== 'all' || dateSort !== 'default') ? { background: colourToken.pink, borderColor: colourToken.pink } : {}}
              >
                Filter
              </Button>
            </Dropdown>
            {folderPrefix && (
              <Tag closable onClose={() => setFolderPrefix('')} color="magenta">
                {folderPrefix}
              </Tag>
            )}
            <Dropdown
              menu={{ items: addMenuItems, onClick: handleAddMenuClick }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: colourToken.pink, borderColor: colourToken.pink }}
              >
                Add File
              </Button>
            </Dropdown>
          </Space>
        </div>

        {/* Ingest job progress */}
        {Object.keys(ingestJobs).length > 0 && (
          <Card size="small" style={{ marginBottom: '16px', background: '#2f303a', borderColor: '#3a3d4a' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {Object.entries(ingestJobs).map(([jobId, job]) => (
                <div key={jobId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Tag color={job.status === 'completed' ? 'green' : job.status === 'failed' ? 'red' : 'blue'}>
                    {job.status || 'pending'}
                  </Tag>
                  <Text style={{ color: '#e0e0e0' }}>{job.fileName || 'PDF upload'}</Text>
                  <Text type="secondary" style={{ flex: 1 }}>{job.message || ''}</Text>
                  <div style={{ width: 180 }}>
                    <Progress percent={Math.min(100, Math.max(0, Math.round(job.progress || 0)))} size="small" showInfo={false} />
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        )}

        {/* Bulk Actions Bar */}
        <Spin spinning={loading}>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
            flexWrap: 'wrap',
            alignItems: 'center',
            paddingBottom: '12px',
            borderBottom: `1px solid #3a3d4a`
          }}>
            <Button
              icon={<PlayCircleOutlined />}
              disabled={!selectedRowKeys.length}
              loading={bulkLoading}
              onClick={() => runBulk('Started parsing', selectedRowKeys.map((key) => parseRequest(key as string)))}
              size="small"
              style={{ background: selectedRowKeys.length ? colourToken.pink : undefined, borderColor: colourToken.pink }}
            >
              Parse
            </Button>
            <Button
              disabled={!selectedRowKeys.length}
              loading={bulkLoading}
              onClick={() => runBulk('Enabled', selectedRowKeys.map((key) => postEnable(key as string, true)))}
              size="small"
            >
              Enable
            </Button>
            <Button
              disabled={!selectedRowKeys.length}
              loading={bulkLoading}
              onClick={() => runBulk('Disabled', selectedRowKeys.map((key) => postEnable(key as string, false)))}
              size="small"
            >
              Disable
            </Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={!selectedRowKeys.length}
              loading={bulkLoading}
              size="small"
              style={{ background: selectedRowKeys.length ? colourToken.pink : undefined, borderColor: colourToken.pink }}
              onClick={() => {
                setDeleteTarget(null);
                setDeleteModalOpen(true);
              }}
            >
              Delete
            </Button>
            <Modal
              title={deleteTarget ? 'Delete file?' : 'Delete selected files?'}
              open={deleteModalOpen}
              centered
              onOk={handleConfirmDelete}
              onCancel={() => {
                setDeleteModalOpen(false);
                setDeleteTarget(null);
              }}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <p>
                {deleteTarget
                  ? `Are you sure you want to delete "${deleteTarget}"?`
                  : `Are you sure you want to delete the selected ${selectedRowKeys.length} file(s)?`}
              </p>
            </Modal>
            {selectedRowKeys.length > 0 && (
              <div style={{ marginLeft: 'auto' }}>
                <Text style={{ color: colourToken.pink, fontWeight: 'bold' }}>
                  {selectedRowKeys.length} selected
                </Text>
              </div>
            )}
          </div>

          {/* Files Table */}
          <Table
            columns={fileColumns.filter((col) => col.key !== 'chunk_number')}
            dataSource={sortedFiles}
            rowKey={(row) => row.name}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: sortedFiles.length,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              onChange: (current, pageSize) => setPagination({ current, pageSize }),
              showTotal: (total) => `Total ${total} files`,
            }}
            locale={{ emptyText: 'No documents uploaded yet' }}
            scroll={{ x: true }}
            style={{ 
              color: colourToken.white,
            }}
          />
        </Spin>
      </Card>
    </div>
  );

  const knowledgeBaseTab = {
    key: 'kb',
    label: <span style={{ color: '#e0e0e0' }}><FileTextOutlined style={{ color: '#e0e0e0' }} /> Knowledge Base</span>,
    children: datasetContent,
  };

  // Chat Testing Tab
  const chatTab = {
    key: 'chat',
    label: <span style={{ color: '#e0e0e0' }}><MessageOutlined style={{ color: '#e0e0e0' }} /> Chat Testing</span>,
    children: (
      <Card 
        style={{ 
          height: 'calc(100vh - 200px)', 
          display: 'flex', 
          flexDirection: 'column', 
          background: colourToken.darkGray, 
          border: `1px solid ${colourToken.primary}`, 
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)' 
        }}
        bodyStyle={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          padding: '24px'
        }}
      >
        <Title level={4} style={{ marginBottom: '16px', color: colourToken.white, flexShrink: 0 }}>Test RAG Responses</Title>
        
        {/* Chat Messages */}
        <div className="chat-messages">
          {chatMessages.length === 0 ? (
            <div className="chat-empty">
              <Text style={{ color: '#ababab' }}>No messages yet. Start typing below!</Text>
            </div>
          ) : (
            chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={msg.role === 'user' ? 'chat-row chat-row-user' : 'chat-row chat-row-assistant'}
              >
                <div style={{ maxWidth: '85%', width: '100%' }}>
                  <div className={msg.role === 'user' ? 'chat-bubble chat-bubble-user' : 'chat-bubble chat-bubble-assistant'}>
                    <div 
                      className={msg.role === 'user' ? 'chat-text-user' : 'chat-text-assistant'}
                      style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', margin: 0 }}
                    >
                      {msg.content}
                    </div>
                  </div>
                  {/* Citations section for assistant messages - now at bottom */}
                  {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                    <div className="chat-citations">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                        <Text style={{ fontSize: '11px', color: '#ababab', fontWeight: 'bold' }}>Sources:</Text>
                        {msg.citations.map((citation) => (
                          <Tag key={citation.id} color="blue" style={{ fontSize: '10px', margin: 0 }}>
                            [{citation.id}] {citation.source.split('/').pop()}
                            {citation.page && ` P${citation.page}`}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          {chatLoading && (
            <div className="chat-spinner">
              <Spin size="small" /> <Text style={{ color: '#ababab' }}>Thinking...</Text>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <Divider style={{ margin: '12px 0', borderColor: colourToken.primary, flexShrink: 0 }} />
        <Form
          form={chatForm}
          onFinish={handleSendMessage}
          layout="horizontal"
          style={{
            background: colourToken.primary,
            padding: '12px',
            borderRadius: '6px',
            border: `1px solid ${colourToken.primary}`,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Form.Item
            name="chatInput"
            noStyle
            rules={[{ required: true, message: 'Please enter a message' }]}
          >
            <Input
              placeholder="Ask about Mudras, dance forms, cultural practices..."
              disabled={chatLoading}
              style={{
                background: colourToken.darkGray,
                borderColor: colourToken.primary,
                color: colourToken.white,
                flex: 1,
                minWidth: 0,
              }}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={chatLoading}
            style={{ background: colourToken.pink }}
          >
            Send
          </Button>
        </Form>
      </Card>
    ),
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorText: '#e0e0e0',
          colorTextSecondary: '#ababab',
          colorBgContainer: '#2b2d38',
          colorBgElevated: '#2b2d38',
          colorBorder: '#3a3d4a',
          colorPrimary: '#c81f58',
          colorPrimaryHover: '#db2a6b',
          fontSize: 14,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: colourToken.darkGray }}>
      <Header
        style={{
          background: colourToken.primary,
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Title level={3} style={{ margin: 0, color: colourToken.white }}>
            Knowledge Base Manager
          </Title>
        </div>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Header>

      <Content style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%', minHeight: 'calc(100vh - 64px)' }}>
        <Tabs
          items={[knowledgeBaseTab, chatTab]}
          size="large"
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k)}
          defaultActiveKey="kb"
        />

        <Modal
          open={uploadModalOpen}
          onCancel={() => { setUploadModalOpen(false); setPdfFile(null); }}
          footer={null}
          width={640}
          title="Add file"
        >
          <Tabs
            activeKey={uploadMode}
            onChange={(k) => setUploadMode(k as 'text' | 'pdf')}
            items={[
              {
                key: 'text',
                label: 'Text',
                children: (
                  <Form
                    layout="vertical"
                    form={uploadTextForm}
                    onFinish={handleUploadText}
                  >
                    <Form.Item
                      label="File Name"
                      name="fileName"
                      rules={[{ required: true, message: 'Please enter file name' }]}
                    >
                      <Input placeholder="example.txt" />
                    </Form.Item>
                    <Form.Item
                      label="Content"
                      name="documentText"
                      rules={[{ required: true, message: 'Please enter content' }]}
                    >
                      <Input.TextArea rows={6} placeholder="Paste text content" />
                    </Form.Item>
                    <Form.Item label="Author (optional)" name="author">
                      <Input placeholder="Author name" />
                    </Form.Item>
                    <Space>
                      <Button onClick={() => setUploadModalOpen(false)}>Cancel</Button>
                      <Button type="primary" htmlType="submit" loading={uploading}>
                        Upload
                      </Button>
                    </Space>
                  </Form>
                ),
              },
              {
                key: 'pdf',
                label: 'PDF',
                children: (
                  <Form layout="vertical" onFinish={handleUploadPdf}>
                    <Form.Item label="PDF Name (optional)" name="pdfFileName">
                      <Input placeholder="Defaults to selected file name" />
                    </Form.Item>
                    
                    <Form.Item label="Reranking Strategy" name="rerankerStrategy">
                      <Select 
                        value={rerankerStrategy}
                        onChange={handleRerankerStrategyChange}
                        options={[
                          { label: 'Embedding-Based (Faster, uses existing embeddings)', value: 'embedding-based' },
                          { label: 'Cross-Encoder (More accurate, separate model)', value: 'cross-encoder' }
                        ]}
                      />
                    </Form.Item>
                    
                    <Form.Item label="Select PDF">
                      <Upload
                        accept=".pdf"
                        maxCount={1}
                        beforeUpload={(file) => {
                          const maxSizeBytes = 15 * 1024 * 1024;
                          if (file.size > maxSizeBytes) {
                            message.error('File is too large. Maximum size is 15 MB.');
                            return Upload.LIST_IGNORE;
                          }
                          setPdfFile(file);
                          return false;
                        }}
                        onRemove={() => {
                          setPdfFile(null);
                          return true;
                        }}
                      >
                        <Button icon={<UploadOutlined />}>Choose PDF</Button>
                      </Upload>
                      {pdfFile && (
                        <Text style={{ display: 'block', marginTop: 8, color: '#e0e0e0' }}>
                          {pdfFile.name}
                        </Text>
                      )}
                    </Form.Item>
                    <Space>
                      <Button onClick={() => setUploadModalOpen(false)}>Cancel</Button>
                      <Button type="primary" htmlType="submit" loading={uploading}>
                        Upload
                      </Button>
                    </Space>
                  </Form>
                ),
              },
            ]}
          />
        </Modal>

        <Modal
          open={folderModalOpen}
          onCancel={() => setFolderModalOpen(false)}
          onOk={handleCreateFolder}
          okText="Create"
          title="New Folder"
        >
          <Form form={newFolderForm} layout="vertical">
            <Form.Item
              label="Folder Name"
              name="folderName"
              rules={[{ required: true, message: 'Please enter folder name' }]}
            >
              <Input placeholder="e.g., research" />
            </Form.Item>
            <Text style={{ color: '#ababab' }}>
              Files you upload will be prefixed with this folder (folder/name.ext).
            </Text>
          </Form>
        </Modal>

        {/* Rename Modal */}
        <Modal
          open={!!renameTarget}
          onCancel={() => setRenameTarget(null)}
          onOk={submitRename}
          title="Rename File"
          okText="Rename"
          cancelText="Cancel"
          destroyOnClose
        >
          <Form form={renameForm} layout="vertical" onFinish={submitRename}>
            <Form.Item
              name="newName"
              label="New Name"
              rules={[{ required: true, message: 'Please enter a new name' }]}
            >
              <Input placeholder={renameTarget || 'Enter new file name'} />
            </Form.Item>
          </Form>
        </Modal>

        {/* Chunks View Modal */}
        <Modal
          open={chunksModalOpen}
          onCancel={() => { setChunksModalOpen(false); setPdfUrl(''); setSelectedChunkIds([]); }}
          title={`Chunks - ${currentFileName}`}
          width="95vw"
          style={{ top: 20 }}
          footer={null}
        >
          {(() => {
            const chunkTagOptions = Array.from(new Set(currentChunks.flatMap((c) => c.tags || []))).map((tag) => ({ label: tag, value: tag }));
            const displayedChunks = chunkTagFilter.length
              ? currentChunks.filter((chunk) => (chunk.tags || []).some((tag: string) => chunkTagFilter.includes(tag)))
              : currentChunks;

            return (
          <div className="chunks-split-layout">
            {/* Left side: PDF viewer */}
            <div className="chunks-pdf-viewer">
              {pdfUrl ? (
                <iframe
                  src={pdfUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="PDF Preview"
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: colourToken.gray }}>
                  <Text style={{ color: '#ababab' }}>PDF preview not available</Text>
                </div>
              )}
            </div>
            
            {/* Right side: Chunk results */}
            <div className="chunks-result-panel">
              <div className="chunks-toolbar">
                <Space>
                  <Checkbox
                    aria-label="Select all chunks"
                    title="Select all chunks"
                    checked={selectedChunkIds.length === currentChunks.length && currentChunks.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChunkIds(currentChunks.map(c => c.id));
                      } else {
                        setSelectedChunkIds([]);
                      }
                    }}
                  >
                    <Text strong>Select All</Text>
                  </Checkbox>
                </Space>
                <Space>
                  <Select
                    allowClear
                    mode="multiple"
                    style={{ minWidth: 180 }}
                    placeholder="Filter tags"
                    suffixIcon={<FilterOutlined />}
                    options={chunkTagOptions}
                    value={chunkTagFilter}
                    onChange={(values) => setChunkTagFilter(values as string[])}
                  />
                  <Button
                    size="small"
                    disabled={selectedChunkIds.length === 0}
                    onClick={handleBulkEnable}
                    style={{ background: selectedChunkIds.length ? '#c81f58' : undefined, borderColor: '#c81f58', color: '#ffffff' }}
                  >
                    Enable
                  </Button>
                  <Button
                    size="small"
                    disabled={selectedChunkIds.length === 0}
                    onClick={handleBulkDisable}
                    style={{ background: selectedChunkIds.length ? '#ff4d4f' : undefined, borderColor: '#ff4d4f', color: '#ffffff' }}
                  >
                    Disable
                  </Button>
                  <Popconfirm
                    title={`Delete ${selectedChunkIds.length} chunks?`}
                    onConfirm={handleBulkDeleteChunks}
                    disabled={selectedChunkIds.length === 0}
                  >
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={selectedChunkIds.length === 0}
                      style={{ color: '#ffffff' }}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
              
              <div className="chunks-list">
                {displayedChunks.map((chunk) => (
                  <div
                    key={chunk.id}
                    className={`chunk-result-card ${selectedChunkIds.includes(chunk.id) ? 'selected' : ''}`}
                  >
                    <div className="chunk-result-header">
                      <Space>
                        <Checkbox
                          aria-label={`Select chunk ${chunk.id}`}
                          title={`Select chunk ${chunk.id}`}
                          checked={selectedChunkIds.includes(chunk.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedChunkIds([...selectedChunkIds, chunk.id]);
                            } else {
                              setSelectedChunkIds(selectedChunkIds.filter(id => id !== chunk.id));
                            }
                          }}
                        />
                        <Tag color="blue">#{chunk.id}</Tag>
                        {chunk.page && <Tag>Page {chunk.page}</Tag>}
                      </Space>
                      <Space>
                        <Switch
                          size="small"
                          checked={chunk.enabled !== false}
                          onChange={(checked) => handleToggleChunkEnable(chunk.id, checked)}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={() => handleEditChunk(chunk)}
                        />
                      </Space>
                    </div>
                    <div className="chunk-result-content">
                      <Text style={{ color: '#e0e0e0', fontSize: '14px' }}>{chunk.content}</Text>
                    </div>
                    {(chunk.keywords && chunk.keywords.length > 0) || (chunk.questions && chunk.questions.length > 0) ? (
                      <div className="chunk-result-meta">
                        {chunk.keywords && chunk.keywords.length > 0 && (
                          <div>
                            <Text style={{ fontSize: '10px', color: '#ababab' }}>Keywords: </Text>
                            {chunk.keywords.map((kw: string, i: number) => (
                              <Tag key={i} style={{ fontSize: '9px', margin: '2px' }}>{kw}</Tag>
                            ))}
                          </div>
                        )}
                        {chunk.questions && chunk.questions.length > 0 && (
                          <div>
                            <Text style={{ fontSize: '10px', color: '#ababab' }}>Questions: </Text>
                            {chunk.questions.map((q: string, i: number) => (
                              <Tag key={i} color="purple" style={{ fontSize: '9px', margin: '2px' }}>{q}</Tag>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
            );
          })()}
        </Modal>

        {/* Edit Chunk Modal */}
        <Modal
          open={editChunkModalOpen}
          onCancel={() => setEditChunkModalOpen(false)}
          onOk={handleSaveChunk}
          title="Edit Chunk"
          width={700}
        >
          <Form form={editChunkForm} layout="vertical">
            <Form.Item label="Chunk Content" name="content">
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item 
              label="Keywords" 
              name="keywords"
              tooltip="Specific terms to boost Hybrid Search (Keyword + Vector). Add technical terms, acronyms, or names that improve keyword matching."
            >
              <Select 
                mode="tags" 
                placeholder="e.g., mudra, hasta, abhinaya, Kathakali..." 
              />
            </Form.Item>
            <Form.Item 
              label="Questions" 
              name="questions"
              tooltip="Potential questions this chunk answers. Helps bridge the semantic gap between user queries and document content."
            >
              <Select 
                mode="tags" 
                placeholder="e.g., What is a mudra? How many mudras are there?..." 
              />
            </Form.Item>
            <Form.Item 
              label="Tags" 
              name="tags"
              tooltip="General categorization tags for organizing chunks."
            >
              <Select mode="tags" placeholder="Add tags" />
            </Form.Item>
            <Form.Item label="Enabled" name="enabled" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
    </ConfigProvider>
  );
};

export default AdminPage;
