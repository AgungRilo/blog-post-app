import BackToList from '@/components/backToList';
import Header from '@/components/header';
import React, { useEffect, useState } from 'react';
import CardCustom from '@/components/card';
import { Form, Button, Modal, Input } from 'antd';
import axios from 'axios';
import { useRouter } from 'next/router';
import { DynamicModal, DynamicButton } from '@/components/dynamic';


const AddPost = () => {
  const [apiToken, setApiToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const token = localStorage.getItem('apiToken');
    setUserName(savedName);
    setApiToken(token);
  }, []);

  const handleFinish = async (values: { id: number; user_id: number; title: string; body: string }) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        'https://gorest.co.in/public/v2/posts',
        values,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 201) {
        setIsModalVisible(true); 
      }
    } catch (error) {
      alert('Failed to add post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    router.push('/posts'); // Navigasi ke halaman daftar posts
  };

  return (
    <div>
      <Header userName={userName} />
      <div className="mx-4">
        <BackToList />
        <CardCustom>
          <h1 className="font-bold" style={{ fontSize: '24px' }}>
            Add New Post
          </h1>
          <Form
            layout="vertical"
            onFinish={handleFinish}
            style={{ marginTop: '20px' }}
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
              <Input placeholder="Enter ID" />
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
                Add Post
              </DynamicButton>
            </div>
          </Form>
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
          <p>The post has been successfully added!</p>
        </DynamicModal>
      </div>
    </div>
  );
};

export default AddPost;
