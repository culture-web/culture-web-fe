import React, { useState } from 'react';
import { Modal, Upload, Spin, Flex, Typography } from 'antd';
import Button from 'components/Common/Button';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { PredictionMultiple } from 'types/interface';
import type { UploadFile } from 'antd';
import './index.css';
import { useColourToken } from 'themeStyles';

const { Text } = Typography;

interface ImageUploadProps {
  isOpen: boolean;
  onClose: () => void;
  renderContent: (prediction: PredictionMultiple, file: File) => JSX.Element;
  uploadFunction: (file: File) => Promise<PredictionMultiple>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  isOpen,
  onClose,
  renderContent,
  uploadFunction,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState<PredictionMultiple | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const colourToken = useColourToken();

  const beforeUpload = (file: File): boolean => {
    setImage(file);
    setIsUploaded(false);
    setFileList([
      {
        uid: '-1',
        name: file.name,
        status: 'done',
        thumbUrl: URL.createObjectURL(file),
      },
    ]);
    return false;
  };

  const onRemove = () => {
    setImage(null);
    setIsUploaded(false);
    setContent(null);
    setFileList([]);
  };

  const handleUploadImage = async () => {
    if (!image) {
      setError('Please select an image first.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const prediction = await uploadFunction(image);
      setContent(prediction);
      setIsUploaded(true);

      setFileList((prevList) =>
        prevList.map((file) => ({
          ...file,
          status: 'done',
          thumbUrl: URL.createObjectURL(image),
        })),
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        setFileList((prevList) =>
          prevList.map((file) => ({
            ...file,
            status: 'error',
          })),
        );
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button width="20%" key="back" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Flex vertical gap="small" align="center">
        <ImgCrop rotationSlider>
          <Upload
            listType="picture-card"
            beforeUpload={beforeUpload}
            onRemove={onRemove}
            multiple={false}
            maxCount={1}
            accept="image/*"
            fileList={fileList}
          >
            {!image && (
              <Button type="primary" width="auto">
                <UploadOutlined /> Select Image
              </Button>
            )}
          </Upload>
        </ImgCrop>
        {error && (
          <Text style={{ fontSize: '20px', color: colourToken.red }}>
            {error}
          </Text>
        )}
        {!isUploaded && (
          <Button
            width="auto"
            onClick={handleUploadImage}
            disabled={uploading || !image}
          >
            {uploading ? 'Uploading...' : 'Upload Image'}
          </Button>
        )}
        {uploading ? (
          <Spin indicator={<LoadingOutlined spin />} />
        ) : (
          content &&
          image && (
            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
              {renderContent(content, image)}
            </div>
          )
        )}
      </Flex>
    </Modal>
  );
};

export default ImageUpload;
