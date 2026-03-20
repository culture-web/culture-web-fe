import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Switch,
  Table,
  Typography,
  Upload,
  Image,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile } from 'antd/es/upload/interface';
import { InboxOutlined, ArrowLeftOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import BACKEND_URI from 'configs/env.config';
import { useColourToken } from 'themeStyles';

const { Title, Text } = Typography;

interface MudraAsset {
  id: number;
  mudraKey: string;
  mudraName: string;
  objectName: string;
  imageUrl: string | null;
  description: string | null;
  mimeType: string | null;
  sortOrder: number;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

interface MudraAssetsResponse {
  count: number;
  assets: MudraAsset[];
}

interface MudraAssetsPageProps {
  embedded?: boolean;
}

const toMudraKey = (value: string) =>
  String(value || '')
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

function MudraAssetsPage({ embedded = false }: MudraAssetsPageProps) {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const colourToken = useColourToken();

  const [assets, setAssets] = useState<MudraAsset[]>([]);
  const [assetsLoading, setAssetsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const currentRole = useMemo(() => {
    try {
      const raw = localStorage.getItem('adminUser');
      if (!raw) return 'viewer';
      const parsed = JSON.parse(raw) as { role?: string };
      return String(parsed?.role || 'viewer').toLowerCase();
    } catch {
      return 'viewer';
    }
  }, []);

  const canUpload = currentRole === 'admin';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchAssets = async () => {
    setAssetsLoading(true);
    try {
      const response = await fetch(
        `${BACKEND_URI}/kathakali/mudras/assets?includeInactive=true&limit=200`,
        {
          headers: getAuthHeaders(),
          cache: 'no-store',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to load mudra assets');
      }

      const data = (await response.json()) as MudraAssetsResponse;
      setAssets(Array.isArray(data.assets) ? data.assets : []);
    } catch (error) {
      console.error('Failed to fetch mudra assets:', error);
      message.error('Failed to load mudra assets');
    } finally {
      setAssetsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async () => {
    if (!canUpload) {
      message.warning('Viewer role cannot upload assets');
      return;
    }

    const selectedFile = fileList[0];
    const rawFile = (selectedFile?.originFileObj || (selectedFile as unknown as File)) as File | undefined;

    if (!selectedFile || !rawFile || typeof rawFile.name !== 'string') {
      message.error('Please select an image file');
      return;
    }

    try {
      const values = await form.validateFields();
      setUploading(true);

      const formData = new FormData();
      formData.append('image', rawFile);
      formData.append('mudraKey', values.mudraKey);
      formData.append('mudraName', values.mudraName);
      if (values.fileName) formData.append('fileName', values.fileName);
      if (values.description) formData.append('description', values.description);
      if (values.tags) formData.append('tags', values.tags);
      formData.append('sortOrder', String(values.sortOrder ?? 0));
      formData.append('isActive', String(values.isActive !== false));

      const response = await fetch(
        `${BACKEND_URI}/kathakali/mudras/assets/upload`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: formData,
        },
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Upload failed');
      }

      message.success('Mudra asset uploaded');
      form.resetFields();
      setFileList([]);
      await fetchAssets();
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) return;
      console.error('Upload failed:', error);
      message.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAsset = async (asset: MudraAsset) => {
    if (!canUpload) {
      message.warning('Viewer role cannot delete assets');
      return;
    }

    const confirmed = window.confirm(
      `Delete asset "${asset.mudraName}" (${asset.mudraKey})? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `${BACKEND_URI}/kathakali/mudras/assets/${asset.id}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders(),
        },
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Delete failed');
      }

      message.success('Mudra asset deleted');
      await fetchAssets();
    } catch (error) {
      console.error('Delete failed:', error);
      message.error(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  const handleToggleAssetActive = async (asset: MudraAsset, checked: boolean) => {
    if (!canUpload) {
      message.warning('Viewer role cannot update asset status');
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URI}/kathakali/mudras/assets/${asset.id}/status`,
        {
          method: 'PATCH',
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isActive: checked }),
        },
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to update active status');
      }

      setAssets((prev) => prev.map((item) => (
        item.id === asset.id
          ? {
            ...item,
            isActive: checked,
          }
          : item
      )));
      message.success(`Asset marked as ${checked ? 'active' : 'inactive'}`);
    } catch (error) {
      console.error('Failed to update active status:', error);
      message.error(error instanceof Error ? error.message : 'Failed to update active status');
    }
  };

  const tableColumns = useMemo<ColumnsType<MudraAsset>>(() => {
    const baseColumns: ColumnsType<MudraAsset> = [
      {
        title: 'Preview',
        key: 'preview',
        width: 110,
        render: (_, record) => (
          record.imageUrl
            ? <Image src={record.imageUrl} width={72} height={72} style={{ objectFit: 'cover' }} />
            : <Tag>no-url</Tag>
        ),
      },
      { title: 'Key', dataIndex: 'mudraKey', key: 'mudraKey' },
      { title: 'Name', dataIndex: 'mudraName', key: 'mudraName' },
      { title: 'File', dataIndex: 'objectName', key: 'objectName' },
      {
        title: 'Tags',
        key: 'tags',
        render: (_, record) => (
          <Space size={4} wrap>
            {(record.tags || []).slice(0, 4).map((tag) => <Tag key={`${record.id}-${tag}`}>{tag}</Tag>)}
          </Space>
        ),
      },
      {
        title: 'Active',
        key: 'active',
        render: (_, record) => (
          canUpload
            ? (
              <Switch
                checked={record.isActive}
                checkedChildren="yes"
                unCheckedChildren="no"
                disabled={assetsLoading || uploading}
                onChange={(checked) => handleToggleAssetActive(record, checked)}
              />
            )
            : <Tag color={record.isActive ? 'green' : 'default'}>{record.isActive ? 'yes' : 'no'}</Tag>
        ),
      },
    ];

    if (canUpload) {
      baseColumns.push({
        title: 'Action',
        key: 'action',
        width: 120,
        render: (_, record) => (
          <Button
            danger
            size="small"
            disabled={assetsLoading || uploading}
            onClick={() => handleDeleteAsset(record)}
          >
            Delete
          </Button>
        ),
      });
    }

    return baseColumns;
  }, [assetsLoading, canUpload, uploading]);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Space style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Space align="center">
          {!embedded && (
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/k-manage-portal')}>
              Back
            </Button>
          )}
          <Title level={embedded ? 4 : 3} style={{ margin: 0 }}>Mudra Assets Manager</Title>
        </Space>
        <Button icon={<ReloadOutlined />} onClick={fetchAssets} loading={assetsLoading}>
          Refresh
        </Button>
      </Space>

      {canUpload && (
        <Card title="Upload Mudra Image" style={{ border: `1px solid ${colourToken.pink}` }}>
          <Text type="secondary">
            Set mudra key + file name directly while uploading. The key is what backend uses to tie image retrieval.
          </Text>

          <Form
            form={form}
            layout="vertical"
            style={{ marginTop: 16 }}
            initialValues={{ sortOrder: 0, isActive: true }}
          >
            <Form.Item label="Image" required>
              <Upload.Dragger
                accept="image/*"
                maxCount={1}
                fileList={fileList}
                onChange={(info) => {
                  const latest = info.fileList.slice(-1);
                  setFileList(latest);
                }}
                beforeUpload={(file) => {
                  setFileList([
                    {
                      uid: file.uid,
                      name: file.name,
                      status: 'done',
                      originFileObj: file,
                    },
                  ]);
                  const inferredKey = toMudraKey(file.name);
                  const currentKey = form.getFieldValue('mudraKey');
                  const currentName = form.getFieldValue('mudraName');
                  const currentFileName = form.getFieldValue('fileName');
                  if (!currentKey) form.setFieldValue('mudraKey', inferredKey);
                  if (!currentName) {
                    form.setFieldValue(
                      'mudraName',
                      inferredKey
                        .split('_')
                        .filter(Boolean)
                        .map((part: string) => part.charAt(0).toUpperCase() + part.slice(1))
                        .join(' '),
                    );
                  }
                  if (!currentFileName) form.setFieldValue('fileName', file.name);
                  return false;
                }}
                onRemove={() => setFileList([])}
                disabled={uploading}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag image here</p>
              </Upload.Dragger>
            </Form.Item>

            <Space style={{ width: '100%' }} align="start" wrap>
              <Form.Item
                label="Mudra Key"
                name="mudraKey"
                rules={[{ required: true, message: 'mudraKey is required' }]}
                style={{ minWidth: 260, flex: 1 }}
              >
                <Input placeholder="e.g. pataka" />
              </Form.Item>

              <Form.Item
                label="Mudra Name"
                name="mudraName"
                rules={[{ required: true, message: 'mudraName is required' }]}
                style={{ minWidth: 260, flex: 1 }}
              >
                <Input placeholder="e.g. Pataka" />
              </Form.Item>

              <Form.Item
                label="File Name"
                name="fileName"
                style={{ minWidth: 260, flex: 1 }}
              >
                <Input placeholder="e.g. pataka.png" />
              </Form.Item>
            </Space>

            <Space style={{ width: '100%' }} align="start" wrap>
              <Form.Item label="Description" name="description" style={{ minWidth: 320, flex: 2 }}>
                <Input placeholder="Optional description" />
              </Form.Item>
              <Form.Item label="Tags" name="tags" style={{ minWidth: 260, flex: 1 }}>
                <Input placeholder="comma,separated,tags" />
              </Form.Item>
              <Form.Item label="Sort Order" name="sortOrder" style={{ minWidth: 140 }}>
                <InputNumber min={0} max={9999} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label="Active" name="isActive" valuePropName="checked" style={{ minWidth: 120 }}>
                <Switch />
              </Form.Item>
            </Space>

            <Button type="primary" onClick={handleUpload} loading={uploading}>
              Upload Asset
            </Button>
          </Form>
        </Card>
      )}

      <Card title={`Existing Assets (${assets.length})`}>
        <Table
          rowKey="id"
          loading={assetsLoading}
          dataSource={assets}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          columns={tableColumns}
        />
      </Card>
    </Space>
  );
}

export default MudraAssetsPage;
