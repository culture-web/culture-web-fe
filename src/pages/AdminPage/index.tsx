/* eslint-disable no-use-before-define, react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Layout, Tabs, Button, message, Spin, Card, Popconfirm, Table,
  Form, Input, Divider, Typography, Switch, Tooltip, Tag, Space, Dropdown, Modal, Upload, Select, Checkbox, ConfigProvider, theme, Progress, Drawer, Empty, Steps, Slider, InputNumber, Pagination,
} from 'antd';
import {
  LogoutOutlined, DeleteOutlined, ReloadOutlined, UploadOutlined,
  FileTextOutlined, MessageOutlined, PlayCircleOutlined,
  EditOutlined, DownloadOutlined, PlusOutlined, FolderAddOutlined, SearchOutlined, FilterOutlined,
  CheckCircleOutlined, CloseCircleOutlined, WarningOutlined, DatabaseOutlined, InboxOutlined, CloudUploadOutlined, TeamOutlined, QuestionCircleOutlined, AuditOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useColourToken } from 'themeStyles';
import BACKEND_URI from 'configs/env.config';
import { supabase } from 'configs/supabase.config';
import FormattedText from 'components/Common/FormattedText';
import MudraAssetsPage from 'pages/MudraAssetsPage';
import './index.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface Chunk {
  id: number;
  content: string;
  source_file: string;
  page: number | null;
  keywords: string[];
  questions: string[];
  tags: string[];
  enabled: boolean;
  created_at: string;
}

interface FileAiSummary {
  executiveSummary: string;
  keyConcepts: string[];
  topicsCovered: string[];
  suggestedTags: string[];
  exampleQuestions: string[];
}

interface FileSummaryResponse {
  fileName: string;
  chunkCount: number;
  sampledChunkIds: number[];
  samplingStrategy: string;
  summary: FileAiSummary;
  generatedAt: string;
}

interface FileActivityRecord {
  id: number;
  file_name: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface FileActivityHistoryResponse {
  fileName: string;
  activities: FileActivityRecord[];
}

interface EditingChunk {
  id: number;
  content: string;
  keywords: string[];
  questions: string[];
  tags: string[];
  enabled: boolean;
}

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
}

interface ChatAssetMatch {
  id?: number | string;
  mudraKey?: string;
  mudraName?: string;
  imageUrl?: string;
}

type ManagedUserRole = 'admin' | 'editor' | 'viewer';
type DeployTarget = 'mudras' | 'kathakali' | 'shared';

const DEFAULT_CHUNK_SIZE = 1000;
const DEFAULT_CHUNK_OVERLAP = 200;

interface ManagedUser {
  id: string;
  username: string;
  email: string;
  role: ManagedUserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuditTrailEntry {
  id: number;
  actor_user_id: string | null;
  actor_email: string | null;
  actor_role: string | null;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  status: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

interface AuditTrailResponse {
  total: number;
  limit: number;
  offset: number;
  retentionDays?: number;
  prunedRows?: number;
  entries: AuditTrailEntry[];
}

interface GlobalChatSettings {
  systemPrompt: string;
  similarityThreshold: number;
  vectorWeight: number;
  topN: number;
  multiTurnOptimization: boolean;
}

const DEFAULT_GLOBAL_CHAT_SETTINGS: GlobalChatSettings = {
  systemPrompt: 'You are an intelligent assistant. Please summarize the content of the knowledge base to answer the question. Please list the data in the knowledge base and answer in detail. When all knowledge base content is irrelevant to the question, your answer must include the sentence "The answer you are looking for is not found in the knowledge base!" Answers need to consider chat history.',
  similarityThreshold: 0.2,
  vectorWeight: 0.3,
  topN: 8,
  multiTurnOptimization: true,
};

const normalizeGlobalChatSettings = (
  settings: GlobalChatSettings,
): GlobalChatSettings => ({
  ...settings,
  similarityThreshold: Number(Math.max(0, Math.min(1, settings.similarityThreshold)).toFixed(2)),
  vectorWeight: Number(Math.max(0, Math.min(1, settings.vectorWeight)).toFixed(2)),
  topN: Math.max(1, Math.min(20, Math.round(settings.topN))),
  multiTurnOptimization: settings.multiTurnOptimization !== false,
  systemPrompt: String(settings.systemPrompt || DEFAULT_GLOBAL_CHAT_SETTINGS.systemPrompt),
});

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

const TERMINAL_INGEST_STATUSES = ['completed', 'failed'];
const TERMINAL_PARSE_STATUSES = ['completed', 'failed'];
const ACTIVE_PARSE_STATUSES = ['queued', 'running', 'processing', 'parsing', 'ocr', 'embedding', 'uploading'];
const STATUS_FETCH_MIN_INTERVAL_MS = 1000;
const NON_PARSABLE_KB_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg', '.ico'];

const isParsableKbFileName = (fileName?: string) => {
  const normalized = String(fileName || '').trim().toLowerCase();
  if (!normalized) return false;
  return !NON_PARSABLE_KB_EXTENSIONS.some((ext) => normalized.endsWith(ext));
};

const isIngestJobActive = (status?: string) => {
  const normalized = String(status || '').toLowerCase();
  if (!normalized) return false;
  return !TERMINAL_INGEST_STATUSES.includes(normalized);
};

const isParseStatusActive = (status?: string, progress?: number) => {
  const normalized = String(status || '').toLowerCase();
  if (TERMINAL_PARSE_STATUSES.includes(normalized)) return false;
  if (ACTIVE_PARSE_STATUSES.includes(normalized)) return true;
  const numericProgress = Number(progress || 0);
  return Number.isFinite(numericProgress) && numericProgress > 0 && numericProgress < 100;
};

const parseOcrProgress = (lastMessage?: string) => {
  const msg = String(lastMessage || '');
  if (!msg) return null;

  const pagePattern = /OCR\s+page\s+(\d+)\/(\d+)\s*:\s*(\d+)%/i;
  const pageMatch = msg.match(pagePattern);
  if (!pageMatch) return null;

  const currentPage = Math.max(1, Number(pageMatch[1] || 1));
  const totalPages = Math.max(1, Number(pageMatch[2] || 1));
  const pagePercent = Math.max(0, Math.min(100, Number(pageMatch[3] || 0)));
  const overallPercent = Math.max(
    0,
    Math.min(
      100,
      Math.round((((currentPage - 1) + (pagePercent / 100)) / totalPages) * 100),
    ),
  );

  return {
    currentPage,
    totalPages,
    pagePercent,
    overallPercent,
  };
};

const getDeployTargetTagColor = (target: string) => {
  if (target === 'mudras') return 'magenta';
  if (target === 'kathakali') return 'blue';
  return 'purple';
};

const AdminPage: React.FC = () => {
  const colourToken = useColourToken();
  const [chatForm] = Form.useForm();
  const [uploadTextForm] = Form.useForm();
  const [newFolderForm] = Form.useForm();
  const [userForm] = Form.useForm();
  const [adminResetPasswordForm] = Form.useForm();
  const [stats, setStats] = useState<KBStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parsingBusy, setParsingBusy] = useState<Record<string, boolean>>({});
  const [bulkLoading, setBulkLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    // Load chat history from sessionStorage on mount (cleared when tab closes)
    const saved = sessionStorage.getItem('adminChatHistory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [chatTested, setChatTested] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('adminChatTested') === '1';
    } catch {
      return false;
    }
  });
  const [statusMap, setStatusMap] = useState<Record<string, JobStatus>>({});
  const [activeTab, setActiveTab] = useState<string>('kb');
  const [renameTarget, setRenameTarget] = useState<string | null>(null);
  const [renameForm] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [fileStatusFilter, setFileStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');
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
  const [currentChunks, setCurrentChunks] = useState<Chunk[]>([]);
  const [currentFileName, setCurrentFileName] = useState<string>('');
  const [editChunkModalOpen, setEditChunkModalOpen] = useState(false);
  const [editingChunk, setEditingChunk] = useState<EditingChunk | null>(null);
  const [editChunkForm] = Form.useForm();
  const [selectedChunkIds, setSelectedChunkIds] = useState<number[]>([]);
  const [chunkTagFilter, setChunkTagFilter] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [ingestJobs, setIngestJobs] = useState<Record<string, IngestJob>>({});
  const [rerankerStrategy, setRerankerStrategy] = useState<'embedding-based' | 'cross-encoder'>('embedding-based');
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [parseStatusFilter, setParseStatusFilter] = useState<string>('all');
  const [isTableDragActive, setIsTableDragActive] = useState(false);
  const [selectedKnowledgeSource, setSelectedKnowledgeSource] = useState<string>('all');
  const [chunkSize, setChunkSize] = useState<number>(DEFAULT_CHUNK_SIZE);
  const [chunkOverlap, setChunkOverlap] = useState<number>(DEFAULT_CHUNK_OVERLAP);
  const [savedChunkSettings, setSavedChunkSettings] = useState<{ chunkSize: number; chunkOverlap: number }>({
    chunkSize: DEFAULT_CHUNK_SIZE,
    chunkOverlap: DEFAULT_CHUNK_OVERLAP,
  });
  const [globalChatSettings, setGlobalChatSettings] = useState<GlobalChatSettings>(DEFAULT_GLOBAL_CHAT_SETTINGS);
  const [savedGlobalChatSettings, setSavedGlobalChatSettings] = useState<GlobalChatSettings>(
    DEFAULT_GLOBAL_CHAT_SETTINGS,
  );
  const [savedIngestionSettings, setSavedIngestionSettings] = useState<{
    autoParseAfterUpload: boolean;
    rerankerStrategy: 'embedding-based' | 'cross-encoder';
  }>({
    autoParseAfterUpload: true,
    rerankerStrategy: 'embedding-based',
  });
  const [autoParseAfterUpload, setAutoParseAfterUpload] = useState(true);
  const [workflowStep, setWorkflowStep] = useState<number>(0);
  const [deployTargetFile, setDeployTargetFile] = useState<string | null>(() => {
    try {
      return localStorage.getItem('kbDeployTargetFile');
    } catch {
      return null;
    }
  });
  const [deployTargetType, setDeployTargetType] = useState<DeployTarget>(() => {
    try {
      const saved = localStorage.getItem('kbDeployTargetType');
      if (saved === 'mudras' || saved === 'kathakali' || saved === 'shared') {
        return saved;
      }
      return 'mudras';
    } catch {
      return 'mudras';
    }
  });
  const [deployedFiles, setDeployedFiles] = useState<Record<string, string>>(() => {
    try {
      const stored = localStorage.getItem('kbDeployedFiles');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [detailsFile, setDetailsFile] = useState<FileRecord | null>(null);
  const [pendingDeleteNames, setPendingDeleteNames] = useState<string[]>([]);
  const [fileSummaries, setFileSummaries] = useState<Record<string, FileSummaryResponse>>({});
  const [summaryLoading, setSummaryLoading] = useState<Record<string, boolean>>({});
  const [fileActivities, setFileActivities] = useState<Record<string, FileActivityRecord[]>>({});
  const [activityLoading, setActivityLoading] = useState<Record<string, boolean>>({});
  const [activityPageByFile, setActivityPageByFile] = useState<Record<string, number>>({});
  const [timeTick, setTimeTick] = useState<number>(Date.now());
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [userCreating, setUserCreating] = useState(false);
  const [roleUpdating, setRoleUpdating] = useState<Record<string, boolean>>({});
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [resetTargetUser, setResetTargetUser] = useState<ManagedUser | null>(null);
  const [adminResetPasswordLoading, setAdminResetPasswordLoading] = useState(false);
  const [auditEntries, setAuditEntries] = useState<AuditTrailEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditSearchTerm, setAuditSearchTerm] = useState('');
  const [auditTotal, setAuditTotal] = useState(0);
  const [auditRetentionDays, setAuditRetentionDays] = useState<number | null>(null);
  const [auditPagination, setAuditPagination] = useState({ current: 1, pageSize: 20 });
  const pendingDeleteTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const tableDragDepth = useRef<number>(0);
  const realtimeSocketRef = useRef<Socket | null>(null);
  const statusInFlightRef = useRef<Record<string, Promise<void>>>({});
  const statusLastFetchedAtRef = useRef<Record<string, number>>({});
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [realtimeTransport, setRealtimeTransport] = useState('');
  const navigate = useNavigate();
  const currentKbUserRole = useMemo(() => {
    try {
      const raw = localStorage.getItem('adminUser');
      if (!raw) return 'viewer';
      const parsed = JSON.parse(raw);
      return String(parsed?.role || 'viewer').toLowerCase();
    } catch {
      return 'viewer';
    }
  }, []);

  const currentKbRoleLabel = useMemo(() => {
    if (currentKbUserRole === 'admin') return 'Admin';
    if (currentKbUserRole === 'editor') return 'Editor';
    return 'Viewer';
  }, [currentKbUserRole]);

  const currentKbRoleActions = useMemo(() => {
    if (currentKbUserRole === 'admin') {
      return [
        'Manage users and roles',
        'Reset user passwords',
        'Upload / parse / delete files',
        'Enable / disable chunks',
        'Chat testing and deploy controls',
      ];
    }
    if (currentKbUserRole === 'editor') {
      return [
        'Upload / parse files',
        'Enable / disable chunks',
        'Edit chunk content',
        'Chat testing',
      ];
    }
    return [
      'View knowledge base files',
      'Read parse status',
      'Chat testing',
    ];
  }, [currentKbUserRole]);

  const canModifyKnowledgeBase = currentKbUserRole !== 'viewer';

  // Load reranker strategy preference from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('rerankerStrategy');
    const savedAutoParse = localStorage.getItem('kbAutoParseAfterUpload');
    const savedChunkSize = Number(localStorage.getItem('kbChunkSize'));
    const savedChunkOverlap = Number(localStorage.getItem('kbChunkOverlap'));
    const nextAutoParse = savedAutoParse !== 'false';
    setAutoParseAfterUpload(nextAutoParse);

    const normalizedChunkSize = Number.isFinite(savedChunkSize)
      ? Math.max(100, Math.min(4000, Math.round(savedChunkSize)))
      : DEFAULT_CHUNK_SIZE;
    const normalizedChunkOverlap = Number.isFinite(savedChunkOverlap)
      ? Math.max(0, Math.min(normalizedChunkSize - 1, Math.round(savedChunkOverlap)))
      : DEFAULT_CHUNK_OVERLAP;
    setChunkSize(normalizedChunkSize);
    setChunkOverlap(normalizedChunkOverlap);
    setSavedChunkSettings({
      chunkSize: normalizedChunkSize,
      chunkOverlap: normalizedChunkOverlap,
    });

    if (saved === 'cross-encoder' || saved === 'embedding-based') {
      setRerankerStrategy(saved);
      setSavedIngestionSettings({
        autoParseAfterUpload: nextAutoParse,
        rerankerStrategy: saved,
      });
      return;
    }
    setSavedIngestionSettings({
      autoParseAfterUpload: nextAutoParse,
      rerankerStrategy: 'embedding-based',
    });
  }, []);

  // Keep reranker in state; persisted by Save All
  const handleRerankerStrategyChange = (value: 'embedding-based' | 'cross-encoder') => {
    setRerankerStrategy(value);
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem('globalChatSettings');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const vectorWeight = Number(parsed?.vectorWeight);
      const normalized = normalizeGlobalChatSettings({
        systemPrompt: typeof parsed?.systemPrompt === 'string' && parsed.systemPrompt.trim().length > 0
          ? parsed.systemPrompt
          : DEFAULT_GLOBAL_CHAT_SETTINGS.systemPrompt,
        similarityThreshold: Number.isFinite(Number(parsed?.similarityThreshold))
          ? Math.max(0, Math.min(1, Number(parsed.similarityThreshold)))
          : DEFAULT_GLOBAL_CHAT_SETTINGS.similarityThreshold,
        vectorWeight: Number.isFinite(vectorWeight)
          ? Math.max(0, Math.min(1, vectorWeight))
          : DEFAULT_GLOBAL_CHAT_SETTINGS.vectorWeight,
        topN: Number.isFinite(Number(parsed?.topN))
          ? Math.max(1, Math.min(20, Math.round(Number(parsed.topN))))
          : DEFAULT_GLOBAL_CHAT_SETTINGS.topN,
        multiTurnOptimization: parsed?.multiTurnOptimization !== false,
      });
      setGlobalChatSettings(normalized);
      setSavedGlobalChatSettings(normalized);
    } catch {
      setGlobalChatSettings(DEFAULT_GLOBAL_CHAT_SETTINGS);
      setSavedGlobalChatSettings(DEFAULT_GLOBAL_CHAT_SETTINGS);
    }
  }, []);

  const saveAllConfiguration = () => {
    const normalizedSize = Math.max(100, Math.min(4000, Math.round(chunkSize)));
    const normalizedOverlap = Math.max(0, Math.min(normalizedSize - 1, Math.round(chunkOverlap)));
    const normalizedGlobal = normalizeGlobalChatSettings(globalChatSettings);

    setChunkSize(normalizedSize);
    setChunkOverlap(normalizedOverlap);
    setSavedChunkSettings({ chunkSize: normalizedSize, chunkOverlap: normalizedOverlap });

    setGlobalChatSettings(normalizedGlobal);
    setSavedGlobalChatSettings(normalizedGlobal);

    setSavedIngestionSettings({
      autoParseAfterUpload,
      rerankerStrategy,
    });

    localStorage.setItem('kbChunkSize', String(normalizedSize));
    localStorage.setItem('kbChunkOverlap', String(normalizedOverlap));
    localStorage.setItem('globalChatSettings', JSON.stringify(normalizedGlobal));
    localStorage.setItem('rerankerStrategy', rerankerStrategy);
    localStorage.setItem('kbAutoParseAfterUpload', String(autoParseAfterUpload));
    message.success('All configuration saved');
  };

  const resetConfigurationDefaults = () => {
    setAutoParseAfterUpload(true);
    setRerankerStrategy('embedding-based');

    setChunkSize(DEFAULT_CHUNK_SIZE);
    setChunkOverlap(DEFAULT_CHUNK_OVERLAP);
    setSavedChunkSettings({
      chunkSize: DEFAULT_CHUNK_SIZE,
      chunkOverlap: DEFAULT_CHUNK_OVERLAP,
    });

    setGlobalChatSettings(DEFAULT_GLOBAL_CHAT_SETTINGS);
    setSavedGlobalChatSettings(DEFAULT_GLOBAL_CHAT_SETTINGS);
    setSavedIngestionSettings({
      autoParseAfterUpload: true,
      rerankerStrategy: 'embedding-based',
    });

    localStorage.setItem('kbChunkSize', String(DEFAULT_CHUNK_SIZE));
    localStorage.setItem('kbChunkOverlap', String(DEFAULT_CHUNK_OVERLAP));
    localStorage.setItem('globalChatSettings', JSON.stringify(DEFAULT_GLOBAL_CHAT_SETTINGS));
    localStorage.setItem('rerankerStrategy', 'embedding-based');
    localStorage.setItem('kbAutoParseAfterUpload', 'true');
    message.success('Configuration reset to defaults');
  };

  const hasUnsavedConfig = useMemo(() => {
    const chunkChanged = chunkSize !== savedChunkSettings.chunkSize
      || chunkOverlap !== savedChunkSettings.chunkOverlap;
    const ingestionChanged = autoParseAfterUpload !== savedIngestionSettings.autoParseAfterUpload
      || rerankerStrategy !== savedIngestionSettings.rerankerStrategy;
    const normalizedCurrentGlobal = normalizeGlobalChatSettings(globalChatSettings);
    const normalizedSavedGlobal = normalizeGlobalChatSettings(savedGlobalChatSettings);
    const globalChanged = JSON.stringify(normalizedCurrentGlobal) !== JSON.stringify(normalizedSavedGlobal);
    return chunkChanged || ingestionChanged || globalChanged;
  }, [
    autoParseAfterUpload,
    rerankerStrategy,
    chunkSize,
    chunkOverlap,
    savedChunkSettings,
    globalChatSettings,
    savedGlobalChatSettings,
    savedIngestionSettings,
  ]);

  useEffect(() => {
    localStorage.setItem('kbDeployedFiles', JSON.stringify(deployedFiles));
  }, [deployedFiles]);

  useEffect(() => {
    if (!deployTargetFile) {
      localStorage.removeItem('kbDeployTargetFile');
      return;
    }
    localStorage.setItem('kbDeployTargetFile', deployTargetFile);
  }, [deployTargetFile]);

  useEffect(() => {
    localStorage.setItem('kbDeployTargetType', deployTargetType);
  }, [deployTargetType]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Supabase logout failed:', error);
    }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    message.success('Logged out successfully');
    navigate('/sign-in');
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/stats`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
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

  

  

  

  async function fetchStatus(
    fileName: string,
    options?: { refreshOnTerminal?: boolean; bypassThrottle?: boolean },
  ) {
    const key = String(fileName || '');
    if (!key) return;

    const existing = statusInFlightRef.current[key];
    if (existing) {
      await existing;
      return;
    }

    const now = Date.now();
    const lastFetched = statusLastFetchedAtRef.current[key] || 0;
    if (!options?.bypassThrottle && now - lastFetched < STATUS_FETCH_MIN_INTERVAL_MS) {
      return;
    }

    const request = (async () => {
      try {
        const res = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(key)}/status`, {
          headers: getAuthHeaders(),
          cache: 'no-store',
        });
        if (!res.ok) return;
        const data = await res.json();
        let enteredTerminalState = false;
        const nextStatus = (data?.status || '').toLowerCase();
        setStatusMap((prev) => {
          const prevStatus = (prev[key]?.status || '').toLowerCase();
          enteredTerminalState = ['completed', 'failed'].includes(nextStatus)
            && !['completed', 'failed'].includes(prevStatus);
          return {
            ...prev,
            [key]: {
              ...(prev[key] || {}),
              ...(data || {}),
            },
          };
        });
        if (options?.refreshOnTerminal !== false && enteredTerminalState) {
          await Promise.all([fetchFiles(), fetchStats()]);
        }
      } catch (error) {
        console.error('Error fetching status:', error);
      } finally {
        statusLastFetchedAtRef.current[key] = Date.now();
        delete statusInFlightRef.current[key];
      }
    })();

    statusInFlightRef.current[key] = request;
    await request;
  }

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/files`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      if (!response.ok) throw new Error('Failed to load files');
      const data = await response.json();
      const nextFiles: FileRecord[] = (data || []).filter((file: FileRecord) => isParsableKbFileName(file?.name));
      const queuedIngestFiles = Object.values(ingestJobs)
        .filter((job) => isIngestJobActive(job.status) && !!job.fileName)
        .map((job) => job.fileName as string);
      setFiles((prev) => {
        const merged = [...nextFiles];
        const prevMap = new Map(prev.map((file) => [file.name, file]));
        queuedIngestFiles.forEach((fileName) => {
          if (merged.some((file) => file.name === fileName)) return;
          merged.unshift(prevMap.get(fileName) || {
            name: fileName,
            upload_date: new Date().toISOString(),
            chunk_number: 0,
            enabled: true,
          });
        });
        return merged;
      });
      await Promise.all(nextFiles.map((file) => fetchStatus(file.name, { refreshOnTerminal: false })));
    } catch (e) {
      console.error('Error loading files:', e);
      message.error('Failed to load dataset files');
    }
  };

  


  

  

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteDocumentOld = async (fileName: string) => {
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // document already missing on backend; treat as deleted to clean up UI
          console.warn(`deleteDocument: ${fileName} not found on backend`);
        } else {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to delete document');
        }
      }

      setFiles((prev) => prev.filter((file) => file.name !== fileName));
      setStatusMap((prev) => {
        const next = { ...prev };
        delete next[fileName];
        return next;
      });
      setDeployedFiles((prev) => {
        const next = { ...prev };
        delete next[fileName];
        return next;
      });
      if (deployTargetFile === fileName) {
        setDeployTargetFile(null);
      }
      if (detailsFile?.name === fileName) {
        setDetailsDrawerOpen(false);
        setDetailsFile(null);
      }

      message.success('Document deleted successfully!');
      await fetchFiles();
      await fetchStats();
      await fetchFolders();
    } catch (error: unknown) {
      console.error('Error deleting document:', error);
      message.error(error instanceof Error ? error.message : 'Failed to delete document');
    }
  };

  const toggleEnable = async (
    fileName: string,
    enabled: boolean,
    deployTarget?: DeployTarget,
  ) => {
    if (!canModifyKnowledgeBase) {
      message.warning('Viewer role cannot change file status');
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}/enable`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(enabled ? { enabled, deployTarget } : { enabled }),
      });
      if (!response.ok) throw new Error('Failed to update enabled state');
      message.success(`${enabled ? 'Enabled' : 'Disabled'} ${fileName}`);
      await fetchFiles();
    } catch (error) {
      console.error('Enable toggle failed:', error);
      message.error('Failed to update enabled state');
    }
  };

  const toggleDeployState = async (record: FileRecord, shouldDeploy: boolean) => {
    if (!canModifyKnowledgeBase) {
      message.warning('Viewer role cannot deploy or disable files');
      return;
    }

    const fileName = record.name;
    const status = (statusMap[fileName]?.status || '').toLowerCase();
    const isParsed = status === 'completed' || Number(record.chunk_number || 0) > 0;

    if (shouldDeploy && !isParsed) {
      message.warning('File must be parsed before deploy');
      return;
    }

    await toggleEnable(fileName, shouldDeploy, shouldDeploy ? deployTargetType : undefined);

    if (shouldDeploy) {
      setDeployedFiles((prev) => ({ ...prev, [fileName]: new Date().toISOString() }));
      await logFileActivity(fileName, 'deploy', {
        via: 'toggle',
        deployTarget: deployTargetType,
      });
      setWorkflowStep((prev) => Math.max(prev, 3));
      message.success(`Deployed to ${deployTargetType}: ${fileName}`);
      return;
    }

    setDeployedFiles((prev) => {
      const next = { ...prev };
      delete next[fileName];
      return next;
    });
    setWorkflowStep((prev) => Math.min(prev, 2));
    message.success(`Pending: ${fileName}`);
  };

  const startParse = async (fileName: string) => {
    if (!canModifyKnowledgeBase) {
      message.warning('Viewer role cannot parse or re-parse files');
      return;
    }
    if (!isParsableKbFileName(fileName)) {
      message.warning('Image files are blocked from KB parsing');
      return;
    }
    setParsingBusy((prev) => ({ ...prev, [fileName]: true }));
    try {
      setStatusMap((prev) => ({
        ...prev,
        [fileName]: {
          ...(prev[fileName] || {}),
          status: 'queued',
          progress: 0,
          last_message: 'Queued',
        },
      }));
      const res = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}/parse`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ chunkSize, chunkOverlap }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        if (res.status === 409) {
          message.warning(errorData.error || `Parse already in progress: ${fileName}`);
          await fetchStatus(fileName);
          return;
        }
        throw new Error(errorData.error || 'Start parse failed');
      }
      await res.json();
      message.success(`Started parsing: ${fileName}`);
      setWorkflowStep((prev) => Math.max(prev, 1));
      
      // Fetch status immediately; active polling effect handles subsequent updates
      await fetchStatus(fileName);
    } catch (e) {
      console.error('Start parse error:', e);
      message.error('Failed to start parsing');
    } finally {
      setParsingBusy((prev) => ({ ...prev, [fileName]: false }));
    }
  };

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
            const url = window.URL.createObjectURL(blob);
            setPdfUrl(url);
          } else {
            setPdfUrl('');
          }
        } catch {
          setPdfUrl('');
        }
      } else {
        setPdfUrl('');
      }
  
      setChunksModalOpen(true);
    } catch (error) {
      console.error('Error loading chunks:', error);
      message.error('Failed to load chunks');
    }
  };

  const downloadFile = async (fileName: string) => {
    try {
      const res = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}/export`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      message.error('Failed to download file');
    }
  };

  // Computed dashboard values
  const enabledCount = files.filter((f) => f.enabled).length;
  const needsParsingCount = files.filter((f) => {
    const s = statusMap[f.name];
    return f.enabled && (!s || (s.status !== 'completed' && s.status !== 'processing'));
  }).length;
  const failedCount = files.filter((f) => statusMap[f.name]?.status === 'failed').length;
  const parsingCount = files.filter((f) => {
    const s = statusMap[f.name];
    return s?.status === 'processing' || (s?.progress && s.progress > 0 && s.progress < 100);
  }).length;
  const totalFilesCount = Math.max(stats?.total_files || 0, files.length);
  const totalChunksFromFiles = files.reduce(
    (sum, file) => sum + Number(file.chunk_number || 0),
    0,
  );
  const avgChunksPerFile = files.length > 0
    ? Math.round(totalChunksFromFiles / files.length)
    : 0;

  const knowledgeSourceOptions = useMemo(() => {
    const fileOptions = files.map((file) => ({
      label: `File: ${file.name}`,
      value: file.name,
    }));
    const folderOptions = folders.map((folder) => ({
      label: `Folder: ${folder}/`,
      value: `${folder}/`,
    }));
    return [{ label: 'All Sources', value: 'all' }, ...folderOptions, ...fileOptions];
  }, [files, folders]);

  const filteredManagedUsers = useMemo(() => {
    const term = userSearchTerm.trim().toLowerCase();
    if (!term) return managedUsers;
    return managedUsers.filter((user) =>
      user.username.toLowerCase().includes(term)
      || user.email.toLowerCase().includes(term)
      || user.role.toLowerCase().includes(term),
    );
  }, [managedUsers, userSearchTerm]);

  const activeFileStatusNames = useMemo(
    () => Array.from(new Set(
      Object.entries(statusMap)
        .filter(([, status]) => isParseStatusActive(status?.status, status?.progress))
        .map(([fileName]) => fileName),
    )),
    [statusMap],
  );

  const activeIngestJobs = useMemo(
    () => Object.entries(ingestJobs)
      .filter(([, job]) => isIngestJobActive(job.status)),
    [ingestJobs],
  );

  const activeIngestJobsRef = useRef(activeIngestJobs);

  useEffect(() => {
    activeIngestJobsRef.current = activeIngestJobs;
  }, [activeIngestJobs]);

  const fetchFileSummary = async (fileName: string, force = false) => {
    if (!fileName) return;
    if (!force && fileSummaries[fileName]) return;
    setSummaryLoading((prev) => ({ ...prev, [fileName]: true }));
    try {
      const res = await fetch(
        `${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}/summary`,
        { headers: getAuthHeaders() },
      );
      if (!res.ok) throw new Error('Failed to generate summary');
      const data = (await res.json()) as FileSummaryResponse;
      setFileSummaries((prev) => ({ ...prev, [fileName]: data }));
    } catch (error: unknown) {
      console.error('Summary generation failed:', error);
      message.error(error instanceof Error ? error.message : 'Failed to generate summary');
    } finally {
      setSummaryLoading((prev) => ({ ...prev, [fileName]: false }));
    }
  };

  const fetchManagedUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/users`, {
        headers: getAuthHeaders(),
        cache: 'no-store',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to load users');
      }
      const data = await response.json();
      setManagedUsers(data.users || []);
    } catch (error: unknown) {
      console.error('Error loading users:', error);
      message.error(error instanceof Error ? error.message : 'Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateManagedUser = async () => {
    try {
      const values = await userForm.validateFields();
      setUserCreating(true);
      const response = await fetch(`${BACKEND_URI}/k-manage/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to create user');
      }

      message.success('User created successfully');
      setCreateUserModalOpen(false);
      userForm.resetFields();
      await fetchManagedUsers();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errorFields' in error) return;
      console.error('Create user error:', error);
      message.error(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setUserCreating(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, role: ManagedUserRole) => {
    setRoleUpdating((prev) => ({ ...prev, [userId]: true }));
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/users/${encodeURIComponent(userId)}/role`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update role');
      }
      setManagedUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)));
      message.success('Role updated');
    } catch (error: unknown) {
      console.error('Update user role error:', error);
      message.error(error instanceof Error ? error.message : 'Failed to update role');
    } finally {
      setRoleUpdating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleAdminResetUserPassword = async () => {
    if (!resetTargetUser) return;
    try {
      const values = await adminResetPasswordForm.validateFields();
      setAdminResetPasswordLoading(true);
      const response = await fetch(`${BACKEND_URI}/k-manage/users/${encodeURIComponent(resetTargetUser.id)}/reset-password`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newPassword: values.newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to reset password');
      }
      message.success(`Password reset for ${resetTargetUser.username}`);
      setResetTargetUser(null);
      adminResetPasswordForm.resetFields();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errorFields' in error) return;
      message.error(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setAdminResetPasswordLoading(false);
    }
  };

  const fetchAuditTrail = async (
    options?: { page?: number; pageSize?: number; search?: string },
  ) => {
    const page = options?.page || auditPagination.current;
    const pageSize = options?.pageSize || auditPagination.pageSize;
    const search = typeof options?.search === 'string' ? options.search : auditSearchTerm;
    const offset = (page - 1) * pageSize;

    setAuditLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(pageSize),
        offset: String(offset),
      });
      if (search.trim()) {
        params.set('search', search.trim());
      }

      const response = await fetch(
        `${BACKEND_URI}/k-manage/audit-trail?${params.toString()}`,
        {
          headers: getAuthHeaders(),
          cache: 'no-store',
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to load audit trail');
      }

      const data = (await response.json()) as AuditTrailResponse;
      setAuditEntries(data.entries || []);
      setAuditTotal(Number(data.total || 0));
      setAuditRetentionDays(
        typeof data.retentionDays === 'number' ? data.retentionDays : null,
      );
      setAuditPagination({ current: page, pageSize });
    } catch (error: unknown) {
      console.error('Audit trail fetch error:', error);
      message.error(error instanceof Error ? error.message : 'Failed to load audit trail');
    } finally {
      setAuditLoading(false);
    }
  };

  const fetchFileActivities = async (fileName: string, force = false) => {
    if (!fileName) return;
    if (!force && fileActivities[fileName]) return;
    setActivityLoading((prev) => ({ ...prev, [fileName]: true }));
    try {
      const res = await fetch(
        `${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}/activity`,
        { headers: getAuthHeaders() },
      );
      if (!res.ok) throw new Error('Failed to load activity history');
      const data = (await res.json()) as FileActivityHistoryResponse;
      setFileActivities((prev) => ({ ...prev, [fileName]: data.activities || [] }));
    } catch (error: unknown) {
      console.error('Activity history fetch failed:', error);
      message.error(error instanceof Error ? error.message : 'Failed to load activity history');
    } finally {
      setActivityLoading((prev) => ({ ...prev, [fileName]: false }));
    }
  };

  const logFileActivity = async (fileName: string, action: 'test' | 'deploy', metadata: Record<string, unknown> = {}) => {
    if (!fileName) return;
    try {
      const res = await fetch(
        `${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}/activity`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ action, metadata }),
        },
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to store ${action} activity`);
      }
    } catch (error: unknown) {
      console.error('Activity log failed:', error);
    }
  };

  const openDetailsPanel = (fileName: string) => {
    const target = files.find((file) => file.name === fileName) || null;
    setDetailsFile(target);
    setActivityPageByFile((prev) => ({ ...prev, [fileName]: 1 }));
    setDeployTargetFile(fileName);
    setDetailsDrawerOpen(true);
    fetchFileSummary(fileName);
    fetchFileActivities(fileName);
  };

  const renderHighlightedText = (text: string, terms: string[]) => {
    if (!terms.length) return text;
    const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(regex);
    const keyCounts: Record<string, number> = {};
    return parts.map((part) => {
      const isMatch = terms.some((term) => part.toLowerCase() === term.toLowerCase());
      keyCounts[part] = (keyCounts[part] || 0) + 1;
      const partKey = `${part}-${keyCounts[part]}`;
      if (isMatch) {
        return (
          <mark key={partKey} className="matched-term-mark">
            {part}
          </mark>
        );
      }
      return <React.Fragment key={partKey}>{part}</React.Fragment>;
    });
  };

  const undoScheduledDelete = (fileName: string) => {
    const timer = pendingDeleteTimers.current[fileName];
    if (timer) {
      clearTimeout(timer);
      delete pendingDeleteTimers.current[fileName];
    }
    setPendingDeleteNames((prev) => prev.filter((name) => name !== fileName));
    message.success(`Restored: ${fileName}`);
  };

  const scheduleDeleteWithUndo = (fileName: string) => {
    if (pendingDeleteTimers.current[fileName]) return;
    setPendingDeleteNames((prev) => [...prev, fileName]);
    message.open({
      type: 'warning',
      duration: 5,
      content: (
        <Space>
          <span>File deleted: {fileName}</span>
          <Button size="small" onClick={() => undoScheduledDelete(fileName)}>
            Undo
          </Button>
        </Space>
      ),
    });

    pendingDeleteTimers.current[fileName] = setTimeout(async () => {
      try {
        await handleDeleteDocumentReal(fileName);
      } finally {
        setPendingDeleteNames((prev) => prev.filter((name) => name !== fileName));
        delete pendingDeleteTimers.current[fileName];
      }
    }, 5000);
  };

  const getFileDeployTargets = (record: FileRecord): string[] => {
    const candidateTargets = (record as unknown as { deploy_targets?: unknown }).deploy_targets;
    if (Array.isArray(candidateTargets)) {
      return candidateTargets
        .map((target) => String(target || '').trim().toLowerCase())
        .filter(Boolean);
    }
    const fallbackTarget = (record as unknown as { deploy_target?: unknown }).deploy_target;
    if (typeof fallbackTarget === 'string' && fallbackTarget.trim()) {
      if (fallbackTarget === 'mixed') return ['mudras', 'kathakali'];
      return [fallbackTarget.trim().toLowerCase()];
    }
    return [];
  };

  const fileColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: FileRecord) => {
        const status = statusMap[record.name];
        const normalizedStatus = String(status?.status || '').toLowerCase();
        const isParsing = isParseStatusActive(normalizedStatus, status?.progress);
        const isFailed = normalizedStatus === 'failed';
        const isParsed = !isParsing && !isFailed
          && (normalizedStatus === 'completed' || Number(record.chunk_number || 0) > 0);
        const deployTargets = getFileDeployTargets(record);

        let statusColor: 'default' | 'green' | 'blue' | 'red' | 'orange' = 'default';
        let statusLabel = 'Not Parsed';
        if (isFailed) { statusColor = 'red'; statusLabel = 'Failed'; }
        else if (isParsing) { statusColor = 'blue'; statusLabel = 'Parsing'; }
        else if (isParsed) { statusColor = 'green'; statusLabel = 'Ready'; }
        else { statusColor = 'orange'; statusLabel = 'Not Parsed'; }

        return (
          <div className="file-name">
            <Tooltip title={statusLabel}>
              <Tag color={statusColor} className="file-status-tag">{statusLabel}</Tag>
            </Tooltip>
            <FileTextOutlined />
            <Button
              type="link"
              className="file-name-link"
              onClick={() => openDetailsPanel(record.name)}
            >
              {text}
            </Button>
            {deployedFiles[record.name] && (
              <Tag color="purple">
                {deployTargets.length <= 1
                  ? `Deployed to ${deployTargets[0] || 'target'}`
                  : `Deployed to ${deployTargets.length} targets`}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: 'Upload Date',
      dataIndex: 'upload_date',
      key: 'upload_date',
      sorter: (a: FileRecord, b: FileRecord) => new Date(a.upload_date).getTime() - new Date(b.upload_date).getTime(),
      defaultSortOrder: 'descend' as const,
      render: (date: string) => (
        <div className="upload-date">
          <span>{new Date(date).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}</span>
        </div>
      ),
    },
    {
      title: 'Deploy',
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled: boolean, record: FileRecord) => {
        const status = statusMap[record.name];
        const normalizedStatus = String(status?.status || '').toLowerCase();
        const parsed = !isParseStatusActive(normalizedStatus, status?.progress)
          && (normalizedStatus === 'completed' || Number(record.chunk_number || 0) > 0);
        const isDeployChecked = parsed ? enabled : false;
        let tooltipTitle = 'File must be parsed before deploying';
        if (parsed) {
          if (isDeployChecked) tooltipTitle = 'Disable (set to pending)';
          else tooltipTitle = 'Deploy file';
        }
        const deployTargets = getFileDeployTargets(record);
        return (
          <Space direction="vertical" size={4}>
            <Tooltip title={tooltipTitle}>
              <Switch
                checked={isDeployChecked}
                disabled={!canModifyKnowledgeBase || !parsed}
                onChange={(nextChecked) => toggleDeployState(record, nextChecked)}
              />
            </Tooltip>
            {isDeployChecked && deployTargets.length > 0 && (
              <Space size={4} wrap>
                {deployTargets.map((target) => (
                  <Tag
                    key={`${record.name}-target-${target}`}
                    color={getDeployTargetTagColor(target)}
                  >
                    {target}
                  </Tag>
                ))}
              </Space>
            )}
          </Space>
        );
      },
    },
    {
      title: 'Chunk Number',
      dataIndex: 'chunk_number',
      key: 'chunk_number',
    },
    {
      title: 'Parse',
      key: 'parse',
      render: (_: unknown, record: FileRecord) => {
        const status = statusMap[record.name];
        const normalizedStatus = String(status?.status || '').toLowerCase();
        const progress = status?.progress ?? 0;
        const ocrProgress = parseOcrProgress(status?.last_message);
        const isParsable = isParsableKbFileName(record.name);
        const isFailed = normalizedStatus === 'failed';
        const isParsing = isParseStatusActive(normalizedStatus, progress);
        const isParsed = !isParsing && !isFailed
          && (normalizedStatus === 'completed' || Number(record.chunk_number || 0) > 0);
        const startTime = status?.start_time ? new Date(status.start_time) : null;
        const endTime = status?.end_time ? new Date(status.end_time) : null;
        const durationMs = startTime ? ((endTime ? endTime.getTime() : Date.now()) - startTime.getTime()) : 0;
        const durationSec = Math.round(durationMs / 1000);
        let parseActionTitle = 'Parse file';
        if (isParsing) parseActionTitle = 'Parsing in progress';
        else if (isParsed) parseActionTitle = 'Re-parse file';
        else if (!isParsable) parseActionTitle = 'Images are not parsable in KB';
        const tip = (
          <div>
            <div>Status: {status?.status || 'Not parsed'}</div>
            <div>Process Begin At: {startTime ? startTime.toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }) : '—'}</div>
            <div>Process Duration: {durationSec}s</div>
            {ocrProgress && (
              <div>
                OCR Progress: {ocrProgress.overallPercent}% overall
                {' '}
                (page {ocrProgress.currentPage}/{ocrProgress.totalPages}, {ocrProgress.pagePercent}%)
              </div>
            )}
            <div>Progress Msg: {status?.last_message || '—'}</div>
          </div>
        );
        return (
          <Space>
            {isParsing && progress > 0 && progress < 100 && (
              <Tooltip title={tip}>
                <div className="parse-progress-wrap">
                  <Progress
                    percent={Math.round(progress)}
                    size="small"
                    strokeColor={{ '0%': '#1890ff', '100%': '#52c41a' }}
                    style={{ marginBottom: 0 }}
                  />
                  {ocrProgress && (
                    <div style={{ fontSize: 11, color: '#91caff', marginTop: 2 }}>
                      OCR {ocrProgress.overallPercent}% (p{ocrProgress.currentPage}/{ocrProgress.totalPages})
                    </div>
                  )}
                </div>
              </Tooltip>
            )}
            {isParsed && (
              <Tooltip title={tip}>
                <Tag color="green"><CheckCircleOutlined /> Parsed</Tag>
              </Tooltip>
            )}
            {isFailed && (
              <Tooltip title={tip}>
                <Tag color="red"><CloseCircleOutlined /> Failed</Tag>
              </Tooltip>
            )}
            <Tooltip title={parseActionTitle}>
              <Button
                type="text"
                icon={isParsed ? <ReloadOutlined /> : <PlayCircleOutlined />}
                loading={!!parsingBusy[record.name]}
                disabled={!canModifyKnowledgeBase || !isParsable || isParsing || !!parsingBusy[record.name]}
                onClick={() => startParse(record.name)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, record: { name: string }) => (
        <Space>
          <Tooltip title="View Chunks">
            <Button type="text" icon={<FileTextOutlined />} onClick={() => handleViewChunks(record.name)} />
          </Tooltip>
          <Tooltip title="Rename">
            <Button
              type="text"
              icon={<EditOutlined />}
              disabled={!canModifyKnowledgeBase}
              onClick={() => { setRenameTarget(record.name); renameForm.setFieldsValue({ newName: record.name }); }}
            />
          </Tooltip>
          <Tooltip title="Download">
            <Button type="text" icon={<DownloadOutlined />} onClick={() => downloadFile(record.name)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              type="text"
              disabled={!canModifyKnowledgeBase}
              onClick={() => {
                setDeleteTarget(record.name);
                setDeleteModalOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  async function fetchFolders() {
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/folders`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Failed to load folders');
      const data = await response.json();
      setFolders(data.folders || []);
    } catch (e) {
      console.error('Error loading folders:', e);
    }
  }

  const upsertIngestJob = (jobId: string, data: Partial<IngestJob>) => {
    setIngestJobs((prev) => ({ ...prev, [jobId]: { ...(prev[jobId] || {}), ...data } }));
  };

  const upsertQueuedFileRecord = (fileName: string) => {
    setFiles((prev) => {
      if (prev.some((file) => file.name === fileName)) return prev;
      return [{
        name: fileName,
        upload_date: new Date().toISOString(),
        chunk_number: 0,
        enabled: true,
      }, ...prev];
    });
  };

  const addMenuItems: MenuItem[] = [
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

  const handleAddMenuClick = ({ key }: { key: string }) => {
    if (!canModifyKnowledgeBase) {
      message.warning('Viewer role cannot upload or create folders');
      return;
    }
    if (key === 'upload') {
      setUploadModalOpen(true);
      setUploadMode('text');
    }
    if (key === 'folder') {
      setFolderModalOpen(true);
    }
  };

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
    } catch (error: unknown) {
      console.error('Bulk action error:', error);
      message.error(error instanceof Error ? error.message : 'Bulk action failed');
    } finally {
      setBulkLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchStats();
    fetchFiles();
    fetchFolders();
  }, []);

  // Save chat messages to sessionStorage whenever they change (clears on tab close)
  useEffect(() => {
    if (chatMessages.length > 0) {
      sessionStorage.setItem('adminChatHistory', JSON.stringify(chatMessages));
      sessionStorage.setItem('adminChatTested', '1');
      setChatTested(true);
    }
  }, [chatMessages]);

  useEffect(() => {
    if (!chatTested) return;
    sessionStorage.setItem('adminChatTested', '1');
  }, [chatTested]);

  // Poll ingest job statuses
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!activeIngestJobsRef.current.length) return undefined;

    const websocketHealthy = realtimeConnected && realtimeTransport === 'websocket';
    if (websocketHealthy) return undefined;
    const ingestPollingIntervalMs = 1500;

    const pollIngestJobs = async () => {
      let shouldRefreshFiles = false;
      const jobsSnapshot = activeIngestJobsRef.current;

      if (!jobsSnapshot.length) return;

      await Promise.all(jobsSnapshot.map(async ([jobId, job]) => {
        try {
          const res = await fetch(`${BACKEND_URI}/k-manage/jobs/${encodeURIComponent(jobId)}/status`, {
            headers: getAuthHeaders(),
            cache: 'no-store',
          });
          if (!res.ok) return;

          const nextJob = await res.json();
          const nextStatus = String(nextJob?.status || '').toLowerCase();
          const nextFileName = String(nextJob?.fileName || job.fileName || '');

          upsertIngestJob(jobId, {
            ...nextJob,
            fileName: nextFileName || undefined,
          });

          if (TERMINAL_INGEST_STATUSES.includes(nextStatus)) {
            shouldRefreshFiles = true;
            if (nextFileName) {
              await fetchStatus(nextFileName, { refreshOnTerminal: false });
            }
          }
        } catch (err) {
          console.error('Job polling error:', err);
        }
      }));

      if (shouldRefreshFiles) {
        await Promise.all([fetchFiles(), fetchStats()]);
      }
    };

    pollIngestJobs().catch((err) => {
      console.error('Initial job polling error:', err);
    });
    const interval = setInterval(() => {
      pollIngestJobs().catch((err) => {
        console.error('Scheduled job polling error:', err);
      });
    }, ingestPollingIntervalMs);

    return () => clearInterval(interval);
  }, [activeIngestJobs.length, realtimeConnected, realtimeTransport]);

  // Realtime websocket updates for ingest + parse status
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return undefined;

    // Construct socket URL with proper fallback for local dev
    let realtimeBaseUrl = String(BACKEND_URI || '').replace(/\/api\/?$/, '');
    
    // If BACKEND_URI was relative (e.g., /api), use window.location.origin
    if (!realtimeBaseUrl || realtimeBaseUrl === 'http://' || realtimeBaseUrl === 'https://') {
      if (typeof window !== 'undefined' && window.location) {
        realtimeBaseUrl = window.location.origin;
        // For local dev on Vite dev server (port 5173 or 3000), backend is on :3001
        // But if on port 80 (nginx/docker), use the proxy (same origin)
        if (
          window.location.hostname === 'localhost' &&
          (window.location.port === '5173' || window.location.port === '3000')
        ) {
          realtimeBaseUrl = 'http://localhost:3001';
        }
      }
    }

    const socketUrl = `${realtimeBaseUrl}/k-manage-realtime`;
    console.log('[Socket.IO] BACKEND_URI:', BACKEND_URI);
    console.log('[Socket.IO] window.location.origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A');
    console.log('[Socket.IO] window.location.port:', typeof window !== 'undefined' ? window.location.port : 'N/A');
    console.log('[Socket.IO] realtimeBaseUrl:', realtimeBaseUrl);
    console.log('[Socket.IO] Attempting websocket-first connection to:', socketUrl);

    let disposed = false;
    let isConnected = false;
    let allowPollingFallback = false;
    let activeSocket: Socket | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const onIngestStatus = (payload: Partial<IngestJob> & { jobId?: string }) => {
      const jobId = String(payload?.jobId || '');
      if (!jobId) return;

      const nextFileName = String(payload?.fileName || '');
      const nextStatus = String(payload?.status || '').toLowerCase();

      upsertIngestJob(jobId, {
        ...payload,
        fileName: nextFileName || undefined,
      });

      if (nextFileName) {
        upsertQueuedFileRecord(nextFileName);
      }

      if (TERMINAL_INGEST_STATUSES.includes(nextStatus) && nextFileName) {
        fetchStatus(nextFileName).catch((err) => {
          console.error('Failed to refresh parse status after ingest completion:', err);
        });
      }
    };

    const onParseStatus = (
      payload: {
        fileName?: string;
        file_name?: string;
        status?: string;
        progress?: number;
        last_message?: string;
        start_time?: string;
        end_time?: string;
      },
    ) => {
      const fileName = String(payload?.fileName || payload?.file_name || '');
      if (!fileName) return;

      const normalized = String(payload?.status || '').toLowerCase();
      const nextStatus =
        normalized === 'running'
          ? 'processing'
          : normalized;

      setStatusMap((prev) => ({
        ...prev,
        [fileName]: {
          ...(prev[fileName] || {}),
          status: nextStatus || prev[fileName]?.status || 'processing',
          progress:
            typeof payload?.progress === 'number'
              ? payload.progress
              : prev[fileName]?.progress || 0,
          last_message:
            String(payload?.last_message || '')
            || prev[fileName]?.last_message
            || '',
          start_time: payload?.start_time || prev[fileName]?.start_time,
          end_time: payload?.end_time || prev[fileName]?.end_time,
        },
      }));

      if (TERMINAL_PARSE_STATUSES.includes(nextStatus)) {
        Promise.all([fetchFiles(), fetchStats()]).catch((err) => {
          console.error('Failed to refresh files/stats after parse completion:', err);
        });
      }
    };

    const connectRealtime = (transports: Array<'websocket' | 'polling'>, mode: string) => {
      if (disposed) return null;

      const socket = io(socketUrl, {
        auth: { token: `Bearer ${token}` },
        transports,
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 800,
        reconnectionDelayMax: 5000,
        timeout: 12000,
      });

      socket.on('connect', () => {
        isConnected = true;
        const transport = String(socket.io.engine.transport?.name || 'unknown');
        setRealtimeConnected(true);
        setRealtimeTransport(transport);
        console.log(`[Socket.IO] Connected via ${transport} (${mode})`);
      });

      socket.io.engine.on('upgrade', (transport) => {
        const transportName = String(transport?.name || 'unknown');
        setRealtimeTransport(transportName);
        console.log('[Socket.IO] Upgraded transport:', transportName);
      });

      socket.on('connect_error', (error) => {
        setRealtimeConnected(false);
        setRealtimeTransport('');
        console.warn(`[Socket.IO] Connection error (${mode}):`, error?.message || error);

        if (!allowPollingFallback || disposed || isConnected) return;
        allowPollingFallback = false;
        if (activeSocket) {
          activeSocket.removeAllListeners();
          activeSocket.disconnect();
        }
        console.warn('[Socket.IO] Falling back to websocket+polling after websocket-only timeout');
        activeSocket = connectRealtime(['websocket', 'polling'], 'fallback');
        if (activeSocket) realtimeSocketRef.current = activeSocket;
      });

      socket.on('disconnect', (reason) => {
        setRealtimeConnected(false);
        setRealtimeTransport('');
        console.log('[Socket.IO] Disconnected, reason:', reason);
      });

      socket.on('ingest_job_status', onIngestStatus);
      socket.on('parse_file_status', onParseStatus);

      return socket;
    };

    activeSocket = connectRealtime(['websocket'], 'websocket-first');
    if (activeSocket) realtimeSocketRef.current = activeSocket;

    fallbackTimer = setTimeout(() => {
      if (disposed || isConnected) return;
      allowPollingFallback = true;
      if (activeSocket) {
        activeSocket.removeAllListeners();
        activeSocket.disconnect();
      }
      activeSocket = connectRealtime(['websocket', 'polling'], 'fallback');
      if (activeSocket) realtimeSocketRef.current = activeSocket;
    }, 12000);

    return () => {
      disposed = true;
      setRealtimeConnected(false);
      setRealtimeTransport('');
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (activeSocket) {
        activeSocket.removeAllListeners();
        activeSocket.disconnect();
      }
      realtimeSocketRef.current = null;
    };
  }, []);

  // Poll statuses only for active queued/running/processing parse jobs
  useEffect(() => {
    if (!activeFileStatusNames.length) return undefined;
    const websocketHealthy = realtimeConnected && realtimeTransport === 'websocket';
    if (websocketHealthy) return undefined;
    const pollingIntervalMs = 1000;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const interval = setInterval(() => {
      activeFileStatusNames.forEach((fileName) => fetchStatus(fileName));
    }, pollingIntervalMs);
    return () => clearInterval(interval);
  }, [activeFileStatusNames, realtimeConnected, realtimeTransport]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [searchTerm, folderFilter, files.length]);

  useEffect(() => () => {
    Object.values(pendingDeleteTimers.current).forEach((timer) => clearTimeout(timer));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeTick(Date.now());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchManagedUsers();
    }
    if (activeTab === 'audit') {
      fetchAuditTrail();
    }
    if (activeTab === 'chat') {
      setChatTested(true);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!files.length) {
      setDeployTargetFile(null);
      setWorkflowStep(0);
      return;
    }

    const fileMap = new Map(files.map((file) => [file.name, file]));
    const validFileNames = new Set(fileMap.keys());
    const deployedEntries = Object.entries(deployedFiles)
      .filter(([fileName]) => validFileNames.has(fileName))
      .sort(([, deployedAtA], [, deployedAtB]) => new Date(deployedAtB).getTime() - new Date(deployedAtA).getTime());

    const parsedFile = files.find((file) => {
      const status = (statusMap[file.name]?.status || '').toLowerCase();
      return status === 'completed' || Number(file.chunk_number || 0) > 0;
    })?.name;

    const preferredFileName = (
      (deployTargetFile && validFileNames.has(deployTargetFile) ? deployTargetFile : null)
      || deployedEntries[0]?.[0]
      || parsedFile
      || files[0].name
    );

    if (!deployTargetFile && preferredFileName) {
      setDeployTargetFile(preferredFileName);
    }

    if (deployTargetFile && !validFileNames.has(deployTargetFile)) {
      setDeployTargetFile(preferredFileName || null);
    }

    const preferredFile = fileMap.get(preferredFileName);
    const preferredStatus = (statusMap[preferredFileName]?.status || '').toLowerCase();
    const isParsed = preferredStatus === 'completed' || Number(preferredFile?.chunk_number || 0) > 0;
    const hasChatTesting = chatTested || activeTab === 'chat' || chatMessages.length > 0;
    const isDeployed = Boolean(preferredFileName && deployedFiles[preferredFileName]);

    let nextStep = 0;
    if (isParsed) nextStep = 1;
    if (hasChatTesting) nextStep = Math.max(nextStep, 2);
    if (isDeployed) nextStep = 3;

    setWorkflowStep((prev) => (prev === nextStep ? prev : nextStep));
  }, [files, statusMap, deployedFiles, deployTargetFile, activeTab, chatMessages.length, chatTested]);

  useEffect(() => {
    if (!files.length) {
      return;
    }
    const validFileNames = new Set(files.map((file) => file.name));
    setDeployedFiles((prev) => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([fileName]) => validFileNames.has(fileName)),
      );
      if (Object.keys(filtered).length === Object.keys(prev).length) return prev;
      return filtered;
    });
  }, [files]);

  const formatRelativeTime = (timestamp: number) => {
    const diffMs = Math.max(0, timeTick - timestamp);
    const sec = Math.floor(diffMs / 1000);
    if (sec < 5) return 'just now';
    if (sec < 60) return `${sec}s ago`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m ago`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h ago`;
    const day = Math.floor(hr / 24);
    return `${day}d ago`;
  };

  const handleDeleteDocumentReal = async (fileName: string) => {
    try {
      const response = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          // document already missing on backend; treat as deleted to clean up UI
          console.warn(`deleteDocument: ${fileName} not found on backend`);
        } else {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to delete document');
        }
      }

      setFiles((prev) => prev.filter((file) => file.name !== fileName));
      setStatusMap((prev) => {
        const next = { ...prev };
        delete next[fileName];
        return next;
      });
      setDeployedFiles((prev) => {
        const next = { ...prev };
        delete next[fileName];
        return next;
      });
      if (deployTargetFile === fileName) {
        setDeployTargetFile(null);
      }
      if (detailsFile?.name === fileName) {
        setDetailsDrawerOpen(false);
        setDetailsFile(null);
      }

      message.success('Document deleted successfully!');
      await fetchFiles();
      await fetchStats();
      await fetchFolders();
    } catch (error: unknown) {
      console.error('Error deleting document:', error);
      message.error(error instanceof Error ? error.message : 'Failed to delete document');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteTarget) {
        scheduleDeleteWithUndo(deleteTarget);
      } else {
        selectedRowKeys.forEach((key) => scheduleDeleteWithUndo(key as string));
        setSelectedRowKeys([]);
      }
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget(null);
      await fetchFolders();
    }
  };

  const postEnable = (fileName: string, enabled: boolean) => fetch(
    `${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}/enable`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ enabled }),
    },
  ).then((res) => {
    if (!res.ok) throw new Error('Failed to update enabled state');
  });

  const parseRequest = (fileName: string) => fetch(
    `${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}/parse`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ chunkSize, chunkOverlap }),
    },
  ).then(async (res) => {
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Start parse failed');
    }
    setStatusMap((prev) => ({
      ...prev,
      [fileName]: {
        ...(prev[fileName] || {}),
        status: 'queued',
        progress: 0,
        last_message: 'Queued',
      },
    }));
    await fetchStatus(fileName);
  });

  const submitRename = async () => {
    try {
      const values = await renameForm.validateFields();
      const res = await fetch(`${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(renameTarget || '')}/rename`, {
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
      return Promise.resolve();
    } catch (e) {
      // Ignore validation errors from form submission
      if (e && typeof e === 'object' && 'errorFields' in e) return Promise.reject(e);
      console.error('Rename error:', e);
      message.error('Failed to rename');
      return Promise.reject(e);
    }
  };

  const handleUploadText = async (values: { fileName: string; documentText: string; author?: string }) => {
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
          chunkSize,
          chunkOverlap,
        }),
      });

      if (!response.ok) throw new Error('Failed to ingest document');

      message.success('Document uploaded successfully');
      setWorkflowStep((prev) => Math.max(prev, 0));
      uploadTextForm.resetFields();
      setUploadModalOpen(false);
      await fetchFiles();
      await fetchStats();
      // immediately clear any stale parse status so the UI shows Not Parsed
      setStatusMap((prev) => ({
        ...prev,
        [finalName]: { status: 'idle', progress: 0, last_message: 'Not parsed yet' },
      }));
      if (autoParseAfterUpload) {
        await parseRequest(finalName);
        await fetchStatus(finalName);
        setWorkflowStep((prev) => Math.max(prev, 1));
      }
    } catch (error: unknown) {
      console.error('Upload text error:', error);
      message.error(error instanceof Error ? error.message : 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadPdf = async (values: { pdfFileName?: string }) => {
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
      formData.append('autoParse', String(autoParseAfterUpload));
      formData.append('rerankerStrategy', rerankerStrategy);
      formData.append('chunkSize', String(chunkSize));
      formData.append('chunkOverlap', String(chunkOverlap));

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
          fileName: finalName,
        });
        upsertQueuedFileRecord(finalName);
        message.success('Upload started — tracking progress');
        setWorkflowStep((prev) => Math.max(prev, 0));
        // clear status so queued job doesn't persist from an earlier parse
        setStatusMap((prev) => ({
          ...prev,
          [finalName]: { status: 'idle', progress: 0, last_message: 'Not parsed yet' },
        }));
      } else {
        message.success('PDF uploaded successfully');
        await fetchFiles();
        await fetchStats();
        // clear status in case backend still returns stale job
        setStatusMap((prev) => ({
          ...prev,
          [finalName]: { status: 'idle', progress: 0, last_message: 'Not parsed yet' },
        }));
        setWorkflowStep((prev) => Math.max(prev, 0));
        if (autoParseAfterUpload) {
          await parseRequest(finalName);
          await fetchStatus(finalName);
          setWorkflowStep((prev) => Math.max(prev, 1));
        }
      }

      setPdfFile(null);
      setUploadModalOpen(false);
    } catch (error: unknown) {
      console.error('Upload PDF error:', error);
      message.error(error instanceof Error ? error.message : 'Failed to upload PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleDropUpload = async (filesToUpload: File[]) => {
    const maxSizeBytes = 15 * 1024 * 1024;
    const pdfFiles = filesToUpload.filter((file) => file.name.toLowerCase().endsWith('.pdf'));

    if (!pdfFiles.length) {
      message.error('Only PDF files can be dropped here');
      return false;
    }

    const oversizedFiles = pdfFiles.filter((file) => file.size > maxSizeBytes);
    const validPdfFiles = pdfFiles.filter((file) => file.size <= maxSizeBytes);

    if (oversizedFiles.length) {
      message.warning(`${oversizedFiles.length} file(s) skipped (max 15MB each)`);
    }

    if (!validPdfFiles.length) {
      return false;
    }

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    const targetFolder = folderFilter || folderPrefix;
    let queuedCount = 0;
    let uploadedCount = 0;
    let conflictCount = 0;
    let failedUploads = 0;

    try {
      /* eslint-disable no-await-in-loop, no-restricted-syntax, no-continue */
      for (const file of validPdfFiles) {
        const finalName = targetFolder ? `${targetFolder}/${file.name}` : file.name;
        const renamedFile = new File([file], finalName, { type: file.type });
        try {
          const formData = new FormData();
          formData.append('pdf', renamedFile);
          formData.append('autoParse', String(autoParseAfterUpload));
          formData.append('rerankerStrategy', rerankerStrategy);
          formData.append('chunkSize', String(chunkSize));
          formData.append('chunkOverlap', String(chunkOverlap));
          const res = await fetch(`${BACKEND_URI}/k-manage/ingest-pdf`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          });

          if (res.status === 409) {
            conflictCount += 1;
            continue;
          }

          if (!res.ok) throw new Error('Failed to upload PDF');

          const data = await res.json();
          if (data.jobId) {
            queuedCount += 1;
            upsertIngestJob(data.jobId, {
              status: data.status || 'queued',
              progress: data.progress || 0,
              message: data.message || 'Queued',
              fileName: finalName,
            });
            upsertQueuedFileRecord(finalName);
            // clear any lingering parse status for the fresh upload
            setStatusMap((prev) => ({
              ...prev,
              [finalName]: { status: 'idle', progress: 0, last_message: 'Not parsed yet' },
            }));
          } else {
            uploadedCount += 1;
            // clear status immediately even before optional parse
            setStatusMap((prev) => ({
              ...prev,
              [finalName]: { status: 'idle', progress: 0, last_message: 'Not parsed yet' },
            }));
            if (autoParseAfterUpload) {
              await parseRequest(finalName);
              await fetchStatus(finalName);
              setWorkflowStep((prev) => Math.max(prev, 1));
            }
          }
        } catch (error) {
          failedUploads += 1;
          console.error('Drop upload error:', error);
        }
      }
      /* eslint-enable no-await-in-loop, no-restricted-syntax, no-continue */

      if (queuedCount || uploadedCount) {
        await Promise.all([fetchFiles(), fetchStats()]);
        setWorkflowStep((prev) => Math.max(prev, 0));
      }

      if (validPdfFiles.length === 1 && uploadedCount === 1 && !queuedCount) {
        message.success('PDF uploaded successfully');
      } else if (queuedCount || uploadedCount) {
        message.success(`Uploaded ${uploadedCount}, queued ${queuedCount}`);
      }

      if (conflictCount) {
        message.warning(`${conflictCount} file(s) skipped (already exists)`);
      }
      if (failedUploads) {
        message.error(`${failedUploads} file(s) failed to upload`);
      }
    } finally {
      setUploading(false);
    }

    return false;
  };

  const handleTableDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    tableDragDepth.current += 1;
    setIsTableDragActive(true);
  };

  const handleTableDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    // eslint-disable-next-line no-param-reassign
    const dt = event.dataTransfer;
    if (dt) dt.dropEffect = 'copy';
  };

  const handleTableDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    tableDragDepth.current = Math.max(0, tableDragDepth.current - 1);
    if (tableDragDepth.current === 0) {
      setIsTableDragActive(false);
    }
  };

  const handleTableDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    tableDragDepth.current = 0;
    setIsTableDragActive(false);

    const droppedFiles = Array.from(event.dataTransfer.files || []);
    if (!droppedFiles.length) return;
    await handleDropUpload(droppedFiles);
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
    } catch (e: unknown) {
      if (e && typeof e === 'object' && 'errorFields' in e) {
        // Validation errors from form
        return;
      }
      console.error('Create folder error:', e);
      message.error(e instanceof Error ? e.message : 'Failed to create folder');
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
    } catch (error: unknown) {
      console.error('Delete folder error:', error);
      message.error(error instanceof Error ? error.message : 'Failed to delete folder');
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      console.error('Error deleting chunks:', error);
      message.error('Failed to delete chunks');
    }
  };

  // Open edit chunk modal
  const handleEditChunk = (chunk: Chunk) => {
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
    if (!editingChunk) return;
    try {
      const values = await editChunkForm.validateFields();
      const response = await fetch(
        `${BACKEND_URI}/k-manage/chunks/${editingChunk?.id}`,
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
    } catch (error: unknown) {
      console.error('Error updating chunk:', error);
      message.error('Failed to update chunk');
    }
  };

  const handleSendMessage = async (values: { chatInput: string }) => {
    const userMessage = values.chatInput;
    const historyMessages = chatMessages
      .filter((msg) =>
        (msg.role === 'user' || msg.role === 'assistant')
        && typeof msg.content === 'string'
        && msg.content.trim().length > 0,
      )
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
    
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
          message: userMessage,
          rerankerStrategy, // Pass selected reranking strategy
          knowledgeSource: selectedKnowledgeSource,
          systemPrompt: globalChatSettings.systemPrompt,
          similarityThreshold: globalChatSettings.similarityThreshold,
          vectorWeight: globalChatSettings.vectorWeight,
          fullTextWeight: Number((1 - globalChatSettings.vectorWeight).toFixed(2)),
          topN: globalChatSettings.topN,
          multiTurnOptimization: globalChatSettings.multiTurnOptimization,
          historyMessages,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();

      // Backend returns structured response with shortAnswer, sections, tables, reasoning
      let content = data.shortAnswer || '';

      // Append tables as markdown if available
      interface ChatTable {
        id: string;
        title: string;
        headers: string[];
        rows: string[][];
      }
      if (data.tables && data.tables.length > 0) {
        const tablesText = (data.tables as ChatTable[]).map((t) => {
          const headerRow = `| ${t.headers.join(' | ')} |`;
          const separator = `| ${t.headers.map(() => '---').join(' | ')} |`;
          const dataRows = t.rows.map((row) => `| ${row.join(' | ')} |`).join('\n');
          return `\n\n${headerRow}\n${separator}\n${dataRows}`;
        }).join('');
        content += tablesText;
      }

      // Append sections if available
      interface Section {
        title: string;
        content: string;
      }
      if (data.sections && data.sections.length > 0) {
        const sectionsText = (data.sections as Section[]).map((s) => 
          `\n\n**${s.title}**\n${s.content}`
        ).join('');
        content += sectionsText;
      }

      // Append reasoning (remaining content like summary paragraphs with source refs)
      if (data.reasoning) {
        content += `\n\n${data.reasoning}`;
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: content || 'No response',
        timestamp: Date.now(),
        citations: data.citations || [],
        retrieval: data.retrieval,
        ...(Array.isArray(data.assetMatches)
          ? { assetMatches: data.assetMatches }
          : {}),
      } as ChatMessage;
      setChatMessages((prev) => [...prev, assistantMessage]);
      if (deployTargetFile) {
        await logFileActivity(deployTargetFile, 'test', {
          rerankerStrategy,
          knowledgeSource: selectedKnowledgeSource,
        });
        if (detailsFile?.name === deployTargetFile) {
          fetchFileActivities(deployTargetFile, true);
        }
      }
      setWorkflowStep((prev) => Math.max(prev, 2));
    } catch (error: unknown) {
      console.error('Chat error:', error);
      message.error(error instanceof Error ? error.message : 'Failed to get response');
    } finally {
      setChatLoading(false);
    }
  };

  const datasetContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
        <Card className="dashboard-stat-card" style={{ background: colourToken.primary, border: '1px solid #3a3d4a', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <FileTextOutlined style={{ fontSize: '22px', color: colourToken.pink, marginBottom: '6px' }} />
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: colourToken.pink, marginBottom: '4px' }}>
              {totalFilesCount}
            </div>
            <Text style={{ color: colourToken.gray, fontSize: '12px' }}>Total Files</Text>
          </div>
        </Card>
        <Card className="dashboard-stat-card" style={{ background: colourToken.primary, border: '1px solid #3a3d4a', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <CheckCircleOutlined style={{ fontSize: '22px', color: '#52c41a', marginBottom: '6px' }} />
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#52c41a', marginBottom: '4px' }}>
              {enabledCount}
            </div>
            <Text style={{ color: colourToken.gray, fontSize: '12px' }}>Active Files</Text>
          </div>
        </Card>
        <Card className="dashboard-stat-card" style={{ background: colourToken.primary, border: '1px solid #3a3d4a', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <WarningOutlined style={{ fontSize: '22px', color: '#faad14', marginBottom: '6px' }} />
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#faad14', marginBottom: '4px' }}>
              {needsParsingCount}
            </div>
            <Text style={{ color: colourToken.gray, fontSize: '12px' }}>Needs Parsing</Text>
          </div>
        </Card>
        {failedCount > 0 && (
          <Card className="dashboard-stat-card" style={{ background: colourToken.primary, border: '1px solid #ff4d4f33', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <CloseCircleOutlined style={{ fontSize: '22px', color: '#ff4d4f', marginBottom: '6px' }} />
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#ff4d4f', marginBottom: '4px' }}>
                {failedCount}
              </div>
              <Text style={{ color: colourToken.gray, fontSize: '12px' }}>Failed</Text>
            </div>
          </Card>
        )}
        <Card className="dashboard-stat-card" style={{ background: colourToken.primary, border: '1px solid #3a3d4a', borderRadius: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <DatabaseOutlined style={{ fontSize: '22px', color: '#1890ff', marginBottom: '6px' }} />
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}>
              {stats?.total_chunks || 0}
            </div>
            <Text style={{ color: colourToken.gray, fontSize: '12px' }}>Total Chunks</Text>
            <div style={{ fontSize: '11px', color: '#ababab', marginTop: '2px' }}>
              ~{avgChunksPerFile} avg/file
            </div>
          </div>
        </Card>
        {parsingCount > 0 && (
          <Card className="dashboard-stat-card" style={{ background: colourToken.primary, border: '1px solid #1890ff33', borderRadius: '12px' }}>
            <div style={{ textAlign: 'center' }}>
              <CloudUploadOutlined style={{ fontSize: '22px', color: '#1890ff', marginBottom: '6px' }} />
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#1890ff', marginBottom: '4px' }}>
                {parsingCount}
              </div>
              <Text style={{ color: colourToken.gray, fontSize: '12px' }}>Processing</Text>
            </div>
          </Card>
        )}
      </div>

      <Card className="workflow-card" style={{ background: colourToken.primary, border: '1px solid #3a3d4a', borderRadius: '12px' }}>
        <div className="workflow-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Title level={5} style={{ margin: 0, color: colourToken.white }}>Upload → Parse → Test → Deploy</Title>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <Space>
              <Select
                placeholder="Deploy target file"
                style={{ minWidth: 280 }}
                value={deployTargetFile || undefined}
                onChange={(value) => setDeployTargetFile(value)}
                options={files.map((file) => ({ label: file.name, value: file.name }))}
                showSearch
                optionFilterProp="label"
              />
              <Select
                style={{ width: 150 }}
                value={deployTargetType}
                onChange={(value) => setDeployTargetType(value as DeployTarget)}
                options={[
                  { label: 'Mudras KB', value: 'mudras' },
                  { label: 'Kathakali KB', value: 'kathakali' },
                  { label: 'Shared KB', value: 'shared' },
                ]}
              />
              <Button
                type="primary"
                size="small"
                disabled={!canModifyKnowledgeBase}
                onClick={async () => {
                  if (!canModifyKnowledgeBase) {
                    message.warning('Viewer role cannot deploy files');
                    return;
                  }
                  if (!deployTargetFile) {
                    message.warning('Select a target file to deploy');
                    return;
                  }
                  const targetRecord = files.find((file) => file.name === deployTargetFile);
                  if (!targetRecord) {
                    message.warning('Selected file no longer exists. Please choose another file.');
                    setDeployTargetFile(null);
                    return;
                  }
                  await toggleDeployState(targetRecord, true);
                }}
                style={{ background: colourToken.pink, borderColor: colourToken.pink }}
              >
                Deploy
              </Button>
            </Space>
          </div>
        </div>
        {deployTargetFile && (() => {
          const fileRecord = files.find((file) => file.name === deployTargetFile);
          const rawStatus = (statusMap[deployTargetFile]?.status || '').toLowerCase();
          let currentStatus = 'uploaded';
          if (fileRecord && fileRecord.enabled === false) {
            currentStatus = 'pending';
          } else if (deployedFiles[deployTargetFile]) {
            currentStatus = 'deployed';
          } else if (workflowStep >= 2) {
            currentStatus = 'tested';
          } else if (rawStatus === 'completed' || Number(fileRecord?.chunk_number || 0) > 0) {
            currentStatus = 'parsed';
          }

          return (
            <Tag color="green" style={{ fontSize: '15px', padding: '4px 10px', width: 'fit-content', marginBottom: 10 }}>
              {deployTargetFile.split('/').pop()} • {currentStatus} • {deployTargetType}
            </Tag>
          );
        })()}
        <Steps
          current={workflowStep}
          items={[
            { title: 'Upload' },
            { title: 'Parse' },
            { title: 'Test' },
            { title: 'Deploy' },
          ]}
        />
      </Card>

      <Card className="power-features-card" style={{ background: colourToken.primary, border: '1px solid #3a3d4a', borderRadius: '12px' }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Space>
              <Title level={5} style={{ margin: 0, color: colourToken.white }}>Configuration</Title>
              <Tooltip
                title={(
                  <div style={{ maxWidth: 520, fontSize: 12, lineHeight: '16px' }}>
                    <div><strong>Configuration Help</strong></div>
                    <div>Auto Parse: parse immediately after upload.</div>
                    <div>Reranker: retrieval strategy (`Embedding` faster, `Cross-Encoder` more precise).</div>
                    <div>Chunk Size/Overlap: how documents are split for embeddings.</div>
                    <div>Similarity: minimum match threshold for retrieval.</div>
                    <div>Vector Weight: balance semantic vector vs full-text score.</div>
                    <div>Top N: number of chunks used in context.</div>
                    <div>Multi-turn optimization: improves follow-up continuity across messages.</div>
                    <div>System Prompt: global instruction used for answers.</div>
                  </div>
                )}
              >
                <Button type="text" size="small" icon={<QuestionCircleOutlined />} />
              </Tooltip>
              {hasUnsavedConfig && <Tag color="gold">Unsaved changes</Tag>}
            </Space>
            <Space>
              <Button size="small" onClick={resetConfigurationDefaults}>Reset to Defaults</Button>
              <Button size="small" type="primary" onClick={saveAllConfiguration}>Save All</Button>
            </Space>
          </div>
          <div className="power-features-grid">
            <div>
              <Text strong>Ingestion</Text>
              <div className="power-feature-row power-feature-row-spaced">
                <div className="power-feature-pair">
                  <Tooltip title="If enabled, uploaded files are parsed immediately; otherwise they stay uploaded-only until manual parse.">
                    <Text type="secondary" style={{ cursor: 'help' }}>Auto Parse</Text>
                  </Tooltip>
                  <Switch checked={autoParseAfterUpload} onChange={setAutoParseAfterUpload} />
                </div>
                <div className="power-feature-pair">
                  <Tooltip title="Retrieval reranking strategy. Embedding-based is faster; Cross-Encoder is usually more accurate.">
                    <Text type="secondary" style={{ cursor: 'help' }}>Reranker</Text>
                  </Tooltip>
                  <Select
                    style={{ minWidth: 190 }}
                    value={rerankerStrategy}
                    onChange={handleRerankerStrategyChange}
                    options={[
                      { label: 'Embedding-Based', value: 'embedding-based' },
                      { label: 'Cross-Encoder', value: 'cross-encoder' },
                    ]}
                  />
                </div>
              </div>
              <div className="power-feature-row" style={{ marginTop: 8 }}>
                <Tooltip title="Approximate characters per chunk before embedding.">
                  <Text type="secondary" style={{ cursor: 'help' }}>Chunk Size</Text>
                </Tooltip>
                <InputNumber
                  min={100}
                  max={4000}
                  step={50}
                  value={chunkSize}
                  onChange={(value) => {
                    const nextValue = Number(value);
                    if (!Number.isFinite(nextValue)) return;
                    const bounded = Math.max(100, Math.min(4000, Math.round(nextValue)));
                    setChunkSize(bounded);
                    setChunkOverlap((prev) => Math.min(prev, bounded - 1));
                  }}
                  disabled={!canModifyKnowledgeBase}
                  style={{ width: 100 }}
                />
                <Tooltip title="Characters shared between neighboring chunks to preserve context continuity.">
                  <Text type="secondary" style={{ cursor: 'help' }}>Overlap</Text>
                </Tooltip>
                <InputNumber
                  min={0}
                  max={Math.max(0, chunkSize - 1)}
                  step={10}
                  value={chunkOverlap}
                  onChange={(value) => {
                    const nextValue = Number(value);
                    if (!Number.isFinite(nextValue)) return;
                    const bounded = Math.max(0, Math.min(Math.max(0, chunkSize - 1), Math.round(nextValue)));
                    setChunkOverlap(bounded);
                  }}
                  disabled={!canModifyKnowledgeBase}
                  style={{ width: 90 }}
                />
              </div>
            </div>

            <div>
              <Text strong>Retrieval (RAG)</Text>
              <div className="power-feature-row">
                <Tooltip title="Minimum similarity score to accept chunk candidates.">
                  <Text type="secondary" style={{ cursor: 'help' }}>Similarity</Text>
                </Tooltip>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={globalChatSettings.similarityThreshold}
                  onChange={(value) => setGlobalChatSettings((prev) => ({ ...prev, similarityThreshold: Number(value) }))}
                  style={{ width: 180 }}
                />
                <Tag color="blue">{globalChatSettings.similarityThreshold.toFixed(2)}</Tag>
              </div>
              <div className="power-feature-row" style={{ marginTop: 8 }}>
                <Tooltip title="How much semantic embedding score contributes vs full-text signal.">
                  <Text type="secondary" style={{ cursor: 'help' }}>Vector vs Full-Text Weight</Text>
                </Tooltip>
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  value={globalChatSettings.vectorWeight}
                  onChange={(value) => setGlobalChatSettings((prev) => ({ ...prev, vectorWeight: Number(value) }))}
                  style={{ width: 160 }}
                />
                <Tag color="cyan">v {globalChatSettings.vectorWeight.toFixed(2)}</Tag>
                <Tag color="purple">ft {(1 - globalChatSettings.vectorWeight).toFixed(2)}</Tag>
                <Tooltip title="Number of retrieved chunks to keep for answer context.">
                  <Text type="secondary" style={{ cursor: 'help' }}>Top N</Text>
                </Tooltip>
                <InputNumber
                  min={1}
                  max={20}
                  step={1}
                  value={globalChatSettings.topN}
                  onChange={(value) => {
                    const nextValue = Number(value);
                    if (!Number.isFinite(nextValue)) return;
                    setGlobalChatSettings((prev) => ({ ...prev, topN: Math.max(1, Math.min(20, Math.round(nextValue))) }));
                  }}
                  style={{ width: 78 }}
                />
              </div>
              <div className="power-feature-row" style={{ marginTop: 8 }}>
                <Tooltip title="When enabled, follow-up queries are optimized with prior conversation context.">
                  <Text type="secondary" style={{ cursor: 'help' }}>Multi-turn optimization</Text>
                </Tooltip>
                <Switch
                  checked={globalChatSettings.multiTurnOptimization}
                  onChange={(checked) => setGlobalChatSettings((prev) => ({ ...prev, multiTurnOptimization: checked }))}
                />
              </div>
            </div>
          </div>

          <div>
            <Tooltip title="Global instruction guiding style and behavior of generated responses.">
              <Text strong style={{ cursor: 'help' }}>System Prompt</Text>
            </Tooltip>
            <Input.TextArea
              rows={4}
              value={globalChatSettings.systemPrompt}
              onChange={(e) => setGlobalChatSettings((prev) => ({ ...prev, systemPrompt: e.target.value }))}
            />
          </div>
        </Space>
      </Card>

      <Card className="power-features-card" style={{ background: colourToken.primary, border: '1px solid #3a3d4a', borderRadius: '12px' }}>
        <div className="power-features-grid">
          <div>
            <Text strong>Smart Chunk Suggestions</Text>
            <div className="power-feature-row">
              <Text type="secondary">Chunk Size</Text>
              <Tag color="blue">{chunkSize}</Tag>
              <Text type="secondary">Overlap</Text>
              <Tag color="purple">{chunkOverlap}</Tag>
              <Text type="secondary">Model</Text>
              <Tag color="green">all-MiniLM-L6-v2</Tag>
            </div>
          </div>
          <div>
            <Text strong>Knowledge Collections</Text>
            <div className="power-feature-row">
              <Tag color="magenta">Culture/Kathakali</Tag>
              <Tag color="magenta">Culture/Mudras</Tag>
            </div>
          </div>
          <div>
            <Text strong>Access Control</Text>
            <div className="power-feature-row">
              <Tag color="red">You are {currentKbRoleLabel}</Tag>
              {currentKbRoleActions.map((action) => (
                <Tag key={`action-${action}`}>{action}</Tag>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Content Card */}
      <Card style={{ 
        background: colourToken.primary, 
        border: `1px solid #3a3d4a`, 
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
      }}>
        {(() => {
          const filteredFiles = files
            .filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter((f) => (folderFilter ? f.name.startsWith(`${folderFilter}/`) : true))
            .filter((f) => {
              if (fileStatusFilter === 'enabled') return f.enabled;
              if (fileStatusFilter === 'disabled') return !f.enabled;
              return true;
            })
            .filter((f) => {
              const status = statusMap[f.name]?.status;
              const normalized = String(status || '').toLowerCase();
              const chunkCount = Number(f.chunk_number || 0);
              const failed = normalized === 'failed';
              const processing = isParseStatusActive(normalized, statusMap[f.name]?.progress);
              const parsed = !processing && !failed && (normalized === 'completed' || chunkCount > 0);

              if (parseStatusFilter === 'parsed') return parsed;
              if (parseStatusFilter === 'processing') return processing;
              if (parseStatusFilter === 'failed') return failed;
              if (parseStatusFilter === 'not_parsed') return !parsed && !processing && !failed;
              return true;
            })
            .filter((f) => !pendingDeleteNames.includes(f.name));

          return (
            <>
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
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
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
                disabled={!canModifyKnowledgeBase}
              >
                <Button danger size="small" disabled={!canModifyKnowledgeBase}>
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
                type={fileStatusFilter !== 'all' ? 'primary' : 'default'}
                style={
                  fileStatusFilter !== 'all'
                    ? { background: colourToken.pink, borderColor: colourToken.pink }
                    : {}
                }
              >
                Filter
              </Button>
            </Dropdown>
            <Select
              placeholder="Parse Status"
              style={{ width: 160 }}
              value={parseStatusFilter}
              onChange={(val) => {
                setParseStatusFilter(val);
                setPagination((prev) => ({ ...prev, current: 1 }));
              }}
              options={[
                { label: 'All Parse States', value: 'all' },
                { label: 'Parsed', value: 'parsed' },
                { label: 'Processing', value: 'processing' },
                { label: 'Failed', value: 'failed' },
                { label: 'Not Parsed', value: 'not_parsed' },
              ]}
            />
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
                disabled={!canModifyKnowledgeBase}
                style={{ background: colourToken.pink, borderColor: colourToken.pink }}
              >
                Add File
              </Button>
            </Dropdown>
            <Button
              onClick={() => {
                setActiveTab('chat');
                setWorkflowStep((prev) => Math.max(prev, 2));
              }}
            >
              Test Now
            </Button>
          </Space>
        </div>
        {/* Ingest job progress */}
        {activeIngestJobs.length > 0 && (
          <Card size="small" style={{ marginBottom: '16px', background: '#2f303a', borderColor: '#3a3d4a' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {activeIngestJobs.map(([jobId, job]) => {
                let statusColor = 'blue';
                if (job.status === 'completed') statusColor = 'green';
                else if (job.status === 'failed') statusColor = 'red';
                
                return (
                  <div key={jobId} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Tag color={statusColor}>
                      {job.status || 'pending'}
                    </Tag>
                    <Text style={{ color: '#e0e0e0' }}>{job.fileName || 'PDF upload'}</Text>
                    <Text type="secondary" style={{ flex: 1 }}>{job.message || ''}</Text>
                    <div style={{ width: 180 }}>
                      <Progress percent={Math.min(100, Math.max(0, Math.round(job.progress || 0)))} size="small" showInfo={false} />
                    </div>
                  </div>
                );
              })}
            </Space>
          </Card>
        )}

        <Spin spinning={loading}>
          {selectedRowKeys.length > 0 && (
            <div className="sticky-bulk-toolbar">
              <Button
                icon={<PlayCircleOutlined />}
                loading={bulkLoading}
                onClick={() => runBulk('Started parsing', selectedRowKeys.map((key) => parseRequest(key as string)))}
                size="small"
                style={{ background: colourToken.pink, borderColor: colourToken.pink }}
              >
                Parse
              </Button>
              <Button
                loading={bulkLoading}
                onClick={() => runBulk('Enabled', selectedRowKeys.map((key) => postEnable(key as string, true)))}
                size="small"
              >
                Enable
              </Button>
              <Button
                loading={bulkLoading}
                onClick={() => runBulk('Disabled', selectedRowKeys.map((key) => postEnable(key as string, false)))}
                size="small"
              >
                Disable
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                loading={bulkLoading}
                size="small"
                style={{ background: colourToken.pink, borderColor: colourToken.pink, color: '#fff' }}
                onClick={() => {
                  setDeleteTarget(null);
                  setDeleteModalOpen(true);
                }}
              >
                Delete
              </Button>
              <div className="bulk-selected-count">
                <Text style={{ color: colourToken.pink, fontWeight: 'bold' }}>
                  {selectedRowKeys.length} selected
                </Text>
              </div>
            </div>
          )}
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

          {/* Files Table */}
          <div
            className={`kb-table-drop-target ${isTableDragActive ? 'drag-active' : ''}`}
            onDragEnter={handleTableDragEnter}
            onDragOver={handleTableDragOver}
            onDragLeave={handleTableDragLeave}
            onDrop={handleTableDrop}
          >
            <Table
              columns={fileColumns.filter((col) => col.key !== 'chunk_number')}
              dataSource={filteredFiles}
              rowKey={(row) => row.name}
              rowSelection={{
                selectedRowKeys,
                onChange: (keys) => setSelectedRowKeys(keys),
              }}
              pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: filteredFiles.length,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                onChange: (current, pageSize) => setPagination({ current, pageSize }),
                showTotal: (total) => `Total ${total} files`,
              }}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={(
                      <div>
                        <div style={{ fontWeight: 600 }}>📂 No files yet</div>
                        <div>Upload your first knowledge document</div>
                      </div>
                    )}
                  >
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => setUploadModalOpen(true)}
                      style={{ background: colourToken.pink, borderColor: colourToken.pink }}
                    >
                      Add File
                    </Button>
                  </Empty>
                ),
              }}
              scroll={{ x: true }}
              style={{ 
                color: colourToken.white,
              }}
            />
            {isTableDragActive && (
              <div className="kb-table-drop-overlay">
                <InboxOutlined />
                <span>Drop PDF file to upload</span>
              </div>
            )}
          </div>
        </Spin>
            </>
          );
        })()}
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
          <Title level={4} style={{ margin: 0, color: colourToken.white }}>Test RAG Responses</Title>
          <Space>
            <Select
              value={selectedKnowledgeSource}
              options={knowledgeSourceOptions}
              onChange={setSelectedKnowledgeSource}
              style={{ minWidth: 260 }}
              placeholder="Select knowledge source"
            />
            {chatMessages.length > 0 && (
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                onClick={() => {
                  setChatMessages([]);
                  sessionStorage.removeItem('adminChatHistory');
                }}
                style={{ color: colourToken.white }}
              >
                Clear Chat
              </Button>
            )}
          </Space>
        </div>
        
        {/* Chat Messages */}
        <div className="chat-messages">
          {chatMessages.length === 0 ? (
            <div className="chat-empty">
              <Text style={{ color: '#ababab' }}>No messages yet. Start typing below!</Text>
            </div>
          ) : (
            chatMessages.map((msg) => {
              const timestampExact = new Date(msg.timestamp).toLocaleString('en-SG', {
                timeZone: 'Asia/Singapore',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
              });
              const timestampLabel = formatRelativeTime(msg.timestamp);
              const msgWithAssets = msg as typeof msg & {
                assetMatches?: ChatAssetMatch[];
              };
              const assetMatches = Array.isArray(msgWithAssets.assetMatches)
                ? msgWithAssets.assetMatches
                : [];

              return (
              <div
                key={msg.id}
                className={msg.role === 'user' ? 'chat-row chat-row-user' : 'chat-row chat-row-assistant'}
              >
                <div className="chat-message-block">
                  <div className={msg.role === 'user' ? 'chat-bubble chat-bubble-user' : 'chat-bubble chat-bubble-assistant'}>
                    <div 
                      className={msg.role === 'user' ? 'chat-text-user' : 'chat-text-assistant'}
                      style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word', margin: 0 }}
                    >
                      {msg.role === 'assistant' ? (
                        <FormattedText content={msg.content} />
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                  <Tooltip title={timestampExact}>
                    <Text className={msg.role === 'user' ? 'chat-timestamp chat-timestamp-user' : 'chat-timestamp chat-timestamp-assistant'}>
                      {timestampLabel}
                    </Text>
                  </Tooltip>
                  {/* Citations section for assistant messages - now at bottom */}
                  {msg.role === 'assistant' && assetMatches.length > 0 && (
                    <div className="chat-citations" style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-start' }}>
                        {assetMatches
                          .filter((asset) => asset?.imageUrl)
                          .map((asset, index: number) => (
                            <div
                              key={`asset-${asset.id || asset.mudraKey || index}`}
                              style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                            >
                              <img
                                src={asset.imageUrl}
                                alt={asset.mudraName || asset.mudraKey || 'Mudra'}
                                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #3a3d4a' }}
                              />
                              <Text style={{ fontSize: '11px', color: '#ababab' }}>
                                {asset.mudraName || asset.mudraKey}
                              </Text>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                    <div className="chat-citations">
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                        <Text style={{ fontSize: '11px', color: '#ababab', fontWeight: 'bold' }}>Sources:</Text>
                        {(() => {
                          const consolidatedCitations = (msg.citations || []).reduce<Array<{
                            id: number;
                            source: string;
                            pages: number[];
                          }>>((acc, citation) => {
                            const source = String(citation?.source || '').trim();
                            if (!source) return acc;
                            const pageNumber = Number(citation?.page);
                            const hasPage = Number.isFinite(pageNumber) && pageNumber > 0;
                            const existing = acc.find((item) => item.source === source);
                            if (!existing) {
                              acc.push({
                                id: acc.length + 1,
                                source,
                                pages: hasPage ? [pageNumber] : [],
                              });
                              return acc;
                            }
                            if (hasPage && !existing.pages.includes(pageNumber)) {
                              existing.pages.push(pageNumber);
                            }
                            return acc;
                          }, []).map((item) => ({
                            ...item,
                            pages: [...item.pages].sort((a, b) => a - b),
                          }));

                          return consolidatedCitations.map((citation) => {
                          const fileName = citation.source;
                          const displayName = fileName.split('/').pop();
                          return (
                            <Tag 
                              key={`citation-${citation.source}`} 
                              color="blue" 
                              style={{ fontSize: '10px', margin: 0, cursor: 'pointer' }}
                              onClick={async () => {
                                try {
                                  const token = localStorage.getItem('adminToken');
                                  const res = await fetch(
                                    `${BACKEND_URI}/k-manage/knowledge-base/${encodeURIComponent(fileName)}/pdf`,
                                    { headers: { Authorization: `Bearer ${token}` } }
                                  );
                                  if (!res.ok) throw new Error('PDF not found');
                                  const blob = await res.blob();
                                  const url = window.URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = displayName || 'document.pdf';
                                  document.body.appendChild(a);
                                  a.click();
                                  document.body.removeChild(a);
                                  window.URL.revokeObjectURL(url);
                                } catch {
                                  message.error('Failed to download source PDF');
                                }
                              }}
                            >
                              <DownloadOutlined style={{ marginRight: 4 }} />
                              [{citation.id}] {displayName}
                              {citation.pages.length > 0 && ` P${citation.pages.join(',')}`}
                            </Tag>
                          );
                          });
                        })()}
                      </div>
                    </div>
                  )}
                  {msg.role === 'assistant' && msg.retrieval && (
                    <div className="chat-retrieval-debug">
                      <div className="chat-retrieval-summary">
                        <Text style={{ fontSize: '11px', color: '#ababab' }}>
                          Source: {msg.retrieval.knowledgeSource} • Strategy: {msg.retrieval.strategy}
                        </Text>
                        <Text style={{ fontSize: '11px', color: '#ababab' }}>
                          Retrieved: {msg.retrieval.totalRetrieved} • Used: {msg.retrieval.usedInContext} • Tokens: ~{msg.retrieval.contextTokens}
                        </Text>
                        <Tag color="cyan">
                          Confidence: {msg.retrieval.confidenceAvg !== null ? `${(msg.retrieval.confidenceAvg * 100).toFixed(1)}%` : 'N/A'}
                        </Tag>
                      </div>
                      {msg.retrieval.chunks?.length > 0 && (
                        <div className="chat-retrieval-chunks">
                          {msg.retrieval.chunks.slice(0, 3).map((chunk) => (
                            <Card key={`retrieval-${msg.id}-${chunk.id}`} size="small" className="retrieval-chunk-card">
                              <div className="retrieval-chunk-head">
                                <Text strong style={{ color: '#e0e0e0' }}>{chunk.source}</Text>
                                <Space>
                                  {chunk.page && <Tag>Page {chunk.page}</Tag>}
                                  {chunk.combinedScore !== null && (
                                    <Tag color="blue">Score {(chunk.combinedScore * 100).toFixed(1)}%</Tag>
                                  )}
                                </Space>
                              </div>
                              <Text style={{ color: '#d0d0d0', fontSize: '12px' }}>
                                {renderHighlightedText(chunk.excerpt, chunk.matchedTerms || [])}
                              </Text>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              );
            })
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

  const mudraAssetsTab = {
    key: 'mudra-assets',
    label: <span style={{ color: '#e0e0e0' }}><DatabaseOutlined style={{ color: '#e0e0e0' }} /> Mudra Assets</span>,
    children: <MudraAssetsPage embedded />,
  };

  const userManagementTab = {
    key: 'users',
    label: <span style={{ color: '#e0e0e0' }}><TeamOutlined style={{ color: '#e0e0e0' }} /> User Management</span>,
    children: (
      <Card
        style={{
          background: colourToken.primary,
          border: '1px solid #3a3d4a',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: 12, flexWrap: 'wrap' }}>
          <Title level={4} style={{ margin: 0, color: colourToken.white }}>Users & Roles</Title>
          <Space>
            <Input
              placeholder="Search users..."
              allowClear
              prefix={<SearchOutlined />}
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              style={{ width: 260 }}
            />
            <Button icon={<ReloadOutlined />} onClick={fetchManagedUsers} loading={usersLoading}>
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateUserModalOpen(true)}
              style={{ background: colourToken.pink, borderColor: colourToken.pink }}
            >
              Add User
            </Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          loading={usersLoading}
          dataSource={filteredManagedUsers}
          columns={[
            {
              title: 'Username',
              dataIndex: 'username',
              key: 'username',
              render: (value: string) => <Text strong>{value}</Text>,
            },
            {
              title: 'Email',
              dataIndex: 'email',
              key: 'email',
            },
            {
              title: 'Role',
              dataIndex: 'role',
              key: 'role',
              render: (value: ManagedUserRole, record: ManagedUser) => (
                <Select
                  value={value}
                  style={{ width: 140 }}
                  loading={!!roleUpdating[record.id]}
                  onChange={(nextRole) => handleUpdateUserRole(record.id, nextRole as ManagedUserRole)}
                  options={[
                    { value: 'admin', label: 'Admin' },
                    { value: 'editor', label: 'Editor' },
                    { value: 'viewer', label: 'Viewer' },
                  ]}
                />
              ),
            },
            {
              title: 'Created',
              dataIndex: 'created_at',
              key: 'created_at',
              render: (value: string) => (value ? new Date(value).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }) : '-'),
            },
            {
              title: 'Updated',
              dataIndex: 'updated_at',
              key: 'updated_at',
              render: (value: string) => (value ? new Date(value).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }) : '-'),
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_: unknown, record: ManagedUser) => (
                <Button
                  size="small"
                  onClick={() => {
                    setResetTargetUser(record);
                    adminResetPasswordForm.resetFields();
                  }}
                >
                  Reset Password
                </Button>
              ),
            },
          ]}
          pagination={{ pageSize: 10, showSizeChanger: true }}
        />

        <Modal
          title="Create User"
          open={createUserModalOpen}
          onCancel={() => {
            setCreateUserModalOpen(false);
            userForm.resetFields();
          }}
          onOk={handleCreateManagedUser}
          okText="Create"
          confirmLoading={userCreating}
        >
          <Form
            form={userForm}
            layout="vertical"
            initialValues={{ role: 'viewer' }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please enter username' }]}
            >
              <Input placeholder="viewer01" />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input placeholder="user@example.com" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password placeholder="At least 6 characters" />
            </Form.Item>
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: 'Please choose role' }]}
            >
              <Select
                options={[
                  { value: 'admin', label: 'Admin' },
                  { value: 'editor', label: 'Editor' },
                  { value: 'viewer', label: 'Viewer' },
                ]}
              />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          title={resetTargetUser ? `Reset Password: ${resetTargetUser.username}` : 'Reset Password'}
          open={!!resetTargetUser}
          onCancel={() => {
            setResetTargetUser(null);
            adminResetPasswordForm.resetFields();
          }}
          onOk={handleAdminResetUserPassword}
          okText="Reset"
          confirmLoading={adminResetPasswordLoading}
        >
          <Form form={adminResetPasswordForm} layout="vertical">
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter new password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password placeholder="At least 6 characters" />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    ),
  };

  const auditTrailTab = {
    key: 'audit',
    label: <span style={{ color: '#e0e0e0' }}><AuditOutlined style={{ color: '#e0e0e0' }} /> Audit Trail</span>,
    children: (
      <Card
        style={{
          background: colourToken.primary,
          border: '1px solid #3a3d4a',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', gap: 12, flexWrap: 'wrap' }}>
          <Space direction="vertical" size={2}>
            <Title level={4} style={{ margin: 0, color: colourToken.white }}>Audit Trail</Title>
            <Text type="secondary" style={{ color: '#ababab' }}>
              Retention: {auditRetentionDays ?? '-'} day(s)
            </Text>
          </Space>
          <Space>
            <Input
              placeholder="Search action, resource, actor..."
              allowClear
              prefix={<SearchOutlined />}
              value={auditSearchTerm}
              onChange={(e) => setAuditSearchTerm(e.target.value)}
              onPressEnter={() => fetchAuditTrail({ page: 1, search: auditSearchTerm })}
              style={{ width: 320 }}
            />
            <Button onClick={() => fetchAuditTrail({ page: 1, search: auditSearchTerm })}>
              Search
            </Button>
            <Button icon={<ReloadOutlined />} onClick={() => fetchAuditTrail()} loading={auditLoading}>
              Refresh
            </Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          loading={auditLoading}
          dataSource={auditEntries}
          columns={[
            {
              title: 'Time',
              dataIndex: 'created_at',
              key: 'created_at',
              width: 190,
              render: (value: string) => (value ? new Date(value).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' }) : '-'),
            },
            {
              title: 'Action',
              dataIndex: 'action',
              key: 'action',
              render: (value: string) => <Tag color="blue">{value}</Tag>,
            },
            {
              title: 'Actor',
              key: 'actor',
              render: (_: unknown, record: AuditTrailEntry) => (
                <Space direction="vertical" size={0}>
                  <Text>{record.actor_email || record.actor_user_id || '-'}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{record.actor_role || '-'}</Text>
                </Space>
              ),
            },
            {
              title: 'Resource',
              key: 'resource',
              render: (_: unknown, record: AuditTrailEntry) => (
                <Space direction="vertical" size={0}>
                  <Text>{record.resource_type || '-'}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>{record.resource_id || '-'}</Text>
                </Space>
              ),
            },
            {
              title: 'Status',
              dataIndex: 'status',
              key: 'status',
              width: 100,
              render: (value: string) => (
                <Tag color={String(value).toLowerCase() === 'success' ? 'green' : 'red'}>{value || '-'}</Tag>
              ),
            },
            {
              title: 'Details',
              dataIndex: 'details',
              key: 'details',
              render: (value: Record<string, unknown> | null) => {
                if (!value || typeof value !== 'object') return '-';
                const preview = JSON.stringify(value);
                const text = preview.length > 180 ? `${preview.slice(0, 180)}...` : preview;
                return <Text style={{ fontSize: 12, color: '#ababab' }}>{text}</Text>;
              },
            },
          ]}
          pagination={{
            current: auditPagination.current,
            pageSize: auditPagination.pageSize,
            total: auditTotal,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            onChange: (current, pageSize) => {
              fetchAuditTrail({ page: current, pageSize, search: auditSearchTerm });
            },
            showTotal: (total) => `Total ${total} records`,
          }}
        />
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
          padding: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Title level={3} style={{ margin: 0, color: colourToken.white }}>
              Knowledge Base Manager
            </Title>
            <Tag color="blue">{currentKbUserRole}</Tag>
          </div>
          <Space>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%', minHeight: 'calc(100vh - 64px)' }}>
        <Tabs
          items={currentKbUserRole === 'admin'
            ? [knowledgeBaseTab, mudraAssetsTab, chatTab, userManagementTab, auditTrailTab]
            : [knowledgeBaseTab, chatTab]}
          size="large"
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k)}
          defaultActiveKey="kb"
        />

        <Drawer
          className="file-details-drawer"
          title={detailsFile ? <span className="file-details-title">File Details: {detailsFile.name}</span> : 'File Details'}
          placement="right"
          width={460}
          open={detailsDrawerOpen}
          onClose={() => setDetailsDrawerOpen(false)}
        >
          {detailsFile ? (
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Card size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text><strong>Name:</strong> <span className="file-details-file-name">{detailsFile.name}</span></Text>
                  <Text><strong>Uploaded:</strong> {new Date(detailsFile.upload_date).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}</Text>
                  <Text><strong>Chunks:</strong> {detailsFile.chunk_number}</Text>
                  <Text><strong>Enabled:</strong> {detailsFile.enabled ? 'Yes' : 'No'}</Text>
                  <Text><strong>Parse Status:</strong> {statusMap[detailsFile.name]?.status || 'Not parsed'}</Text>
                </Space>
              </Card>
              <Card
                size="small"
                title="AI File Summary"
                extra={(
                  <Button
                    size="small"
                    loading={!!summaryLoading[detailsFile.name]}
                    onClick={() => fetchFileSummary(detailsFile.name, true)}
                  >
                    Regenerate
                  </Button>
                )}
              >
                {summaryLoading[detailsFile.name] && !fileSummaries[detailsFile.name] ? (
                  <Spin size="small" />
                ) : (
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Text>
                      <strong>Executive Summary:</strong>{' '}
                      {fileSummaries[detailsFile.name]?.summary?.executiveSummary || 'No summary available yet.'}
                    </Text>

                    <div>
                      <Text strong>Key Concepts</Text>
                      <div style={{ marginTop: 4 }}>
                        {(fileSummaries[detailsFile.name]?.summary?.keyConcepts || []).map((item) => (
                          <Tag key={`kc-${detailsFile.name}-${item}`} color="blue">{item}</Tag>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Text strong>Topics Covered</Text>
                      <div style={{ marginTop: 4 }}>
                        {(fileSummaries[detailsFile.name]?.summary?.topicsCovered || []).map((item) => (
                          <Tag key={`tp-${detailsFile.name}-${item}`} color="purple">{item}</Tag>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Text strong>Suggested Tags</Text>
                      <div style={{ marginTop: 4 }}>
                        {(fileSummaries[detailsFile.name]?.summary?.suggestedTags || []).map((item) => (
                          <Tag key={`tg-${detailsFile.name}-${item}`} color="magenta">{item}</Tag>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Text strong>Example Questions</Text>
                      <ul style={{ margin: '6px 0 0 18px', padding: 0 }}>
                        {(fileSummaries[detailsFile.name]?.summary?.exampleQuestions || []).map((item) => (
                          <li key={`q-${detailsFile.name}-${item}`}>
                            <Text>{item}</Text>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {fileSummaries[detailsFile.name] && (
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Sampling: {fileSummaries[detailsFile.name].samplingStrategy} • Sampled chunk IDs: {fileSummaries[detailsFile.name].sampledChunkIds.join(', ')}
                      </Text>
                    )}
                  </Space>
                )}
              </Card>
              <Card
                size="small"
                title="Activity History"
                extra={(
                  <Button
                    size="small"
                    loading={!!activityLoading[detailsFile.name]}
                    onClick={() => fetchFileActivities(detailsFile.name, true)}
                  >
                    Refresh
                  </Button>
                )}
              >
                {activityLoading[detailsFile.name] && !fileActivities[detailsFile.name] ? (
                  <Spin size="small" />
                ) : (
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    {(() => {
                      const activities = fileActivities[detailsFile.name] || [];
                      const pageSize = 5;
                      const currentPage = activityPageByFile[detailsFile.name] || 1;
                      const pageStart = (currentPage - 1) * pageSize;
                      const pagedActivities = activities.slice(pageStart, pageStart + pageSize);

                      if (activities.length === 0) {
                        return <Text type="secondary">No activity history recorded yet.</Text>;
                      }

                      return (
                        <>
                          {pagedActivities.map((activity) => {
                            const eventTime = new Date(activity.created_at).toLocaleString('en-SG', { timeZone: 'Asia/Singapore' });
                            const label = activity.action === 'reembed' ? 'reparse' : activity.action;
                            return (
                              <Card key={`activity-${activity.id}`} size="small" style={{ background: '#1f212a', borderColor: '#3a3d4a' }}>
                                <Space direction="vertical" size={2} style={{ width: '100%' }}>
                                  <Space wrap style={{ justifyContent: 'space-between', width: '100%' }}>
                                    <Space wrap>
                                      <Tag color="purple">{label}</Tag>
                                      <Text type="secondary" style={{ fontSize: 12 }}>{eventTime}</Text>
                                    </Space>
                                  </Space>
                                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                                    <Text style={{ fontSize: 12, color: '#c8ccd8' }}>
                                      {Object.entries(activity.metadata)
                                        .map(([key, value]) => `${key}: ${String(value)}`)
                                        .join(' • ')}
                                    </Text>
                                  )}
                                </Space>
                              </Card>
                            );
                          })}
                          {activities.length > pageSize && (
                            <Pagination
                              size="small"
                              current={currentPage}
                              pageSize={pageSize}
                              total={activities.length}
                              showSizeChanger={false}
                              onChange={(page) => {
                                setActivityPageByFile((prev) => ({ ...prev, [detailsFile.name]: page }));
                              }}
                            />
                          )}
                        </>
                      );
                    })()}
                  </Space>
                )}
              </Card>
              <Space className="file-details-action-row">
                <Button
                  icon={<PlayCircleOutlined />}
                  disabled={!canModifyKnowledgeBase || !isParsableKbFileName(detailsFile.name)}
                  onClick={() => startParse(detailsFile.name)}
                >
                  Parse
                </Button>
                <Button icon={<FileTextOutlined />} onClick={() => handleViewChunks(detailsFile.name)}>View Chunks</Button>
                <Button icon={<DownloadOutlined />} onClick={() => downloadFile(detailsFile.name)}>Download</Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={!canModifyKnowledgeBase}
                  style={{ color: colourToken.white }}
                  onClick={() => {
                    setDeleteTarget(detailsFile.name);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </Space>
            </Space>
          ) : (
            <Text type="secondary">Select a file to view details.</Text>
          )}
        </Drawer>

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
                    <Form.Item label="Auto Parse After Upload">
                      <Switch checked={autoParseAfterUpload} onChange={setAutoParseAfterUpload} />
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
                    
                    <Form.Item label="Reranking Strategy">
                      <Select 
                        value={rerankerStrategy}
                        onChange={handleRerankerStrategyChange}
                        placeholder="Choose reranking strategy"
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
                        fileList={pdfFile ? [{ uid: '-1', name: pdfFile.name, status: 'done' }] : []}
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
                    <Form.Item label="Auto Parse After Upload">
                      <Switch checked={autoParseAfterUpload} onChange={setAutoParseAfterUpload} />
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
                    disabled={!canModifyKnowledgeBase || selectedChunkIds.length === 0}
                    onClick={handleBulkEnable}
                    style={{ background: selectedChunkIds.length ? '#c81f58' : undefined, borderColor: '#c81f58', color: '#ffffff' }}
                  >
                    Enable
                  </Button>
                  <Button
                    size="small"
                    disabled={!canModifyKnowledgeBase || selectedChunkIds.length === 0}
                    onClick={handleBulkDisable}
                    style={{ background: selectedChunkIds.length ? '#ff4d4f' : undefined, borderColor: '#ff4d4f', color: '#ffffff' }}
                  >
                    Disable
                  </Button>
                  <Popconfirm
                    title={`Delete ${selectedChunkIds.length} chunks?`}
                    onConfirm={handleBulkDeleteChunks}
                    disabled={!canModifyKnowledgeBase || selectedChunkIds.length === 0}
                  >
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      disabled={!canModifyKnowledgeBase || selectedChunkIds.length === 0}
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
                          disabled={!canModifyKnowledgeBase}
                          onChange={(checked) => handleToggleChunkEnable(chunk.id, checked)}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          disabled={!canModifyKnowledgeBase}
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
                            {chunk.keywords.map((kw: string) => (
                              <Tag key={`kw-${chunk.id}-${kw}`} style={{ fontSize: '9px', margin: '2px' }}>{kw}</Tag>
                            ))}
                          </div>
                        )}
                        {chunk.questions && chunk.questions.length > 0 && (
                          <div>
                            <Text style={{ fontSize: '10px', color: '#ababab' }}>Questions: </Text>
                            {chunk.questions.map((q: string) => (
                              <Tag key={`q-${chunk.id}-${q}`} color="purple" style={{ fontSize: '9px', margin: '2px' }}>{q}</Tag>
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
        })()} {}
        </Modal>

        {/* Edit Chunk Modal */}
        <Modal
          open={editChunkModalOpen}
          onCancel={() => setEditChunkModalOpen(false)}
          onOk={handleSaveChunk}
          okButtonProps={{ disabled: !canModifyKnowledgeBase }}
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
              <Switch disabled={!canModifyKnowledgeBase} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
    </ConfigProvider>
  );
};

export default AdminPage;
