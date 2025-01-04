import BackToList from '@/components/backToList';
import Header from '@/components/header';
import React, { useEffect, useState } from 'react';
import CardCustom from '@/components/card';
import { Form, Input } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { DynamicModal, DynamicButton, DynamicSpin } from '@/components/dynamic';
import { useQuery } from '@tanstack/react-query';
import PostDetail from '../[id]';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
const EditPost = () => {
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [post, setPost] = useState<{ id: number; user_id: number; title: string; body: string } | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const dataDetail = useSelector((state: RootState) => state.detail.data);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const token = localStorage.getItem('apiToken');
    setUserName(savedName);
    setApiToken(token);
  }, []);

  const fetchPostDetail = async (): Promise<PostDetail> => {
    const response = await axios.get(`https://gorest.co.in/public/v2/posts/${id}`);
    setPost(response.data || dataDetail)
    return response.data;
  };


  const { data, isLoading } = useQuery<PostDetail>({
    queryKey: ['postDetail', id],
    queryFn: fetchPostDetail,
    enabled: !!id, // Fetch hanya jika `id` ada
  });

  

  const handleFinish = async (values: { id: number; user_id: number; title: string; body: string }) => {
    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `https://gorest.co.in/public/v2/posts/${id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        setIsModalVisible(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios-specific error
        alert(error.response?.data?.message || 'An error occurred');
      } else if (error instanceof Error) {
        // Generic JS error
        alert(error.message);
      } else {
        // Unknown error
        alert('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    router.push('/posts'); // Navigasi ke halaman daftar posts
  };
  const detail = data || dataDetail; 

  if (isLoading) {
    return <DynamicSpin size="large" />;
  }
 if (!detail) {
    return (
      <div>
        <BackToList />
        <p>Error loading post detail. Please try again.</p>
      </div>
    )
  }
  return (
    <div>
      <Header userName={userName} />
      <div className="mx-4">
        <BackToList />
        <CardCustom>
          <h1 className="font-bold" style={{ fontSize: '24px' }}>
            Edit Post
          </h1>
          {post ? (
            <Form
              layout="vertical"
              onFinish={handleFinish}
              style={{ marginTop: '20px' }}
              initialValues={post}
            >
              <Form.Item
                label="ID"
                name="id"
                rules={[
                  { required: true, message: 'ID is required!' },
                  {
                    pattern: /^[0-9]+$/,
                    message: 'ID must be a number!',
                  },
                ]}
              >
                <Input placeholder="Enter ID" disabled />
              </Form.Item>
              <Form.Item
                label="User ID"
                name="user_id"
                rules={[
                  { required: true, message: 'User ID is required!' },
                  {
                    pattern: /^[0-9]+$/,
                    message: 'User ID must be a number!',
                  },
                ]}
              >
                <Input placeholder="Enter User ID" />
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  { required: true, message: 'Title is required!' },
                  { max: 100, message: 'Title must be less than 100 characters!' },
                ]}
              >
                <Input placeholder="Enter post title" />
              </Form.Item>
              <Form.Item
                label="Body"
                name="body"
                rules={[
                  { required: true, message: 'Body is required!' },
                  { max: 500, message: 'Body must be less than 500 characters!' },
                ]}
              >
                <Input.TextArea placeholder="Enter post body" />
              </Form.Item>
              <div className="flex justify-end gap-4">
                <DynamicButton onClick={() => router.push('/posts')}>Cancel</DynamicButton>
                <DynamicButton
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Update Post
                </DynamicButton>
              </div>
            </Form>
          ) : (
            <Form
              layout="vertical"
              onFinish={handleFinish}
              style={{ marginTop: '20px' }}
              initialValues={detail}
            >
              <Form.Item
                label="ID"
                name="id"
                rules={[
                  { required: true, message: 'ID is required!' },
                  {
                    pattern: /^[0-9]+$/,
                    message: 'ID must be a number!',
                  },
                ]}
              >
                <Input placeholder="Enter ID" disabled />
              </Form.Item>
              <Form.Item
                label="User ID"
                name="user_id"
                rules={[
                  { required: true, message: 'User ID is required!' },
                  {
                    pattern: /^[0-9]+$/,
                    message: 'User ID must be a number!',
                  },
                ]}
              >
                <Input placeholder="Enter User ID" />
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  { required: true, message: 'Title is required!' },
                  { max: 100, message: 'Title must be less than 100 characters!' },
                ]}
              >
                <Input placeholder="Enter post title" />
              </Form.Item>
              <Form.Item
                label="Body"
                name="body"
                rules={[
                  { required: true, message: 'Body is required!' },
                  { max: 500, message: 'Body must be less than 500 characters!' },
                ]}
              >
                <Input.TextArea placeholder="Enter post body" />
              </Form.Item>
              <div className="flex justify-end gap-4">
                <DynamicButton onClick={() => router.push('/posts')}>Cancel</DynamicButton>
                <DynamicButton
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Update Post
                </DynamicButton>
              </div>
            </Form>
          )}
        </CardCustom>
        <DynamicModal
          title="Success"
          open={isModalVisible}
          onOk={handleOk}
          closable={false}
          footer={[
            <DynamicButton key="ok" type="primary" onClick={handleOk}>
              OK
            </DynamicButton>,
          ]}
        >
          <p>The post has been successfully updated!</p>
        </DynamicModal>
      </div>
    </div>
  );
};

export default EditPost;
