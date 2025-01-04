import { useEffect, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { DynamicTable, DynamicButton, DynamicInput, DynamicSpin } from '@/components/dynamic';
import withAuth from '@/components/protectedRoute';
import Header from '@/components/header';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ColumnType } from 'antd/es/table';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';
import { useDispatch } from 'react-redux';
import { setData } from '@/store/slices/detailSlice';
import { Post } from '@/components/interface';

function Posts() {
  

  const [apiToken, setApiToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const token = localStorage.getItem('apiToken');
    setUserName(savedName);
    setApiToken(token);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch posts dari API
  const fetchPosts = async (): Promise<Post[]> => {
    if (!apiToken) {
      throw new Error('API token not available');
    }

    const response = await axios.get(
      `https://gorest.co.in/public/v2/posts?page=${currentPage}&title=${debouncedSearchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    const totalPages = parseInt(response.headers['x-pagination-pages'], 10) || 0;
    setTotalPages(totalPages);
  
    return response.data;
  };

  const deletePost = async (id: number): Promise<void> => {
    if (!apiToken) {
      throw new Error('API token not available');
    }

    await axios.delete(`https://gorest.co.in/public/v2/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });
  };

  const { data, isLoading, isError } = useQuery<Post[]>({
    queryKey: ['posts', currentPage, debouncedSearchQuery],
    queryFn: fetchPosts,
    enabled: !!apiToken,
  });

  const mutation = useMutation<void, Error, number>({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setDeleteModalVisible(false);
    },
  });

  const goToDetail = (id: number, data: Post) => {
    dispatch(setData(data));
    router.push(`/posts/${id}`);
  };

  const goToEdit = (id: number, dataEdit: Post) => {
    dispatch(setData(dataEdit));
    router.push(`/posts/edit/${id}`);
  };

  const goToAdd = () => {
    router.push(`/posts/add`);
  };

  const handleDelete = () => {
    if (postToDelete !== null) {
      mutation.mutate(postToDelete);
    }
  };

  if (isError) {
    return <p>Error loading posts. Check your API token.</p>;
  }

  const columns: ColumnType<Post>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Body',
      dataIndex: 'body',
      key: 'body',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Post) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tooltip title="View Details">
            <EyeOutlined
              style={{
                fontSize: '16px',
                color: '#1890ff',
                cursor: 'pointer',
              }}
              onClick={() => goToDetail(record.id, record)}
            />
          </Tooltip>

          <Tooltip title="Edit Post">
            <EditOutlined
              style={{
                fontSize: '16px',
                color: '#faad14',
                cursor: 'pointer',
              }}
              onClick={() => goToEdit(record.id, record)}
            />
          </Tooltip>

          <Tooltip title="Delete Post">
            <DeleteOutlined
              style={{
                fontSize: '16px',
                color: '#ff4d4f',
                cursor: 'pointer',
              }}
              onClick={() => {
                setDeleteModalVisible(true);
                setPostToDelete(record.id);
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header userName={userName} />
      <div className="flex justify-between">
        <DynamicInput
          placeholder="Search post"
          className="w-40 mb-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <DynamicButton type="primary" onClick={goToAdd} className="mb-4">
          Add Posts
        </DynamicButton>
      </div>
      {isLoading ? (
        <DynamicSpin size="large" />
      ) : (
        <DynamicTable
          dataSource={data || []}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: 20,
            total: totalPages,
            onChange: (page) => setCurrentPage(page),
          }}
          rowKey="id"
        />
      )}
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this post?</p>
      </Modal>
    </div>
  );
}

export default withAuth(Posts);
