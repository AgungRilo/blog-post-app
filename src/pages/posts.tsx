import { useEffect, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { DynamicTable, DynamicButton, DynamicInput, DynamicSpin } from '@/components/dynamic';
import withAuth from '@/components/protectedRoute'; // HOC untuk proteksi rute
import Header from '@/components/header';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ColumnType } from 'antd/es/table';
import { useTheme } from '@/components/themeProvider';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Modal, Tooltip } from 'antd';

function Posts() {
  interface Post {
    id: number;
    title: string;
    body: string;
  }
  const { isDarkMode } = useTheme();

  const [apiToken, setApiToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Halaman aktif
  const [totalPages, setTotalPages] = useState<number>(0); // Total halaman
  const [searchQuery, setSearchQuery] = useState<string>(''); // Query pencarian
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(''); // Query dengan debounce
  const [deleteModalVisible, setDeleteModalVisible] = useState(false); // State modal
  const [postToDelete, setPostToDelete] = useState<number | null>(null); // Post ID untuk delete
  const queryClient = useQueryClient();
  const router = useRouter();
  // Ambil token dan userName dari localStorage
  useEffect(() => {
    console.log("token: ", localStorage.getItem('apiToken'))
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
      clearTimeout(handler); // Bersihkan timeout jika pengguna mengetik lagi sebelum 300ms
    };
  }, [searchQuery]);

  // Fetch posts dari API
  const fetchPosts = async () => {
    const response = await axios.get(
      `https://gorest.co.in/public/v2/posts?page=${currentPage}&title=${debouncedSearchQuery}`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      }
    );

    const totalPages = parseInt(response.headers['x-pagination-pages'], 10) || 0;

    setTotalPages(totalPages); // Simpan total halaman
    return response.data; // Data yang digunakan untuk tabel
  };

  const deletePost = async (id: number): Promise<void> => {
    await axios.delete(`https://gorest.co.in/public/v2/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });
  };



  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', currentPage, debouncedSearchQuery], // Tambahkan currentPage ke queryKey
    queryFn: fetchPosts, // Fungsi fetch data
    enabled: !!apiToken, // Fetch hanya jika token tersedia
    // keepPreviousData: true, // Simpan data lama saat berganti halaman
  });

  const mutation = useMutation<void, Error, number>({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] }); // Refetch data setelah berhasil hapus
      setDeleteModalVisible(false); // Tutup modal
    },
  });

  const goToDetail = (id: number) => {
    router.push(`/posts/${id}`);
  };

  const handleDelete = () => {
    if (postToDelete !== null) {
      mutation.mutate(postToDelete);
    }
  };

  if (isError) return <p>Error loading posts. Check your API token.</p>;
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
      render: (_: any, record: Post) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Tooltip title="View Details">
            <EyeOutlined
              style={{
                fontSize: '16px',
                color: '#1890ff',
                cursor: 'pointer',
              }}
              onClick={() => goToDetail(record.id)}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#40a9ff';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '#1890ff';
              }}
            />
          </Tooltip>

          <Tooltip title="Edit Post">
            <EditOutlined
              style={{
                fontSize: '16px',
                color: '#faad14',
                cursor: 'pointer',
              }}
              // onClick={() => goToEdit(record.id)} // Tambahkan fungsi goToEdit
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#ffc069';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '#faad14';
              }}
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
                setPostToDelete(record.id); // Set ID post yang akan dihapus
              }}

              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.color = '#ff7875';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.color = '#ff4d4f';
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className='m-20'
    >
      <div>
        <Header userName={userName} />
        <div className='flex justify-between'>

        <DynamicInput
          placeholder='search post'
          className='w-40 mb-4'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          />
        <DynamicButton
          type="primary"
          // onClick={() => (1)}
          className="mb-4"
          >Add Posts</DynamicButton>
          </div>
      </div>
      {isLoading ?
        <DynamicSpin size="large" />
        :
        // <DynamicTable
        //   dataSource={(data || []) as Post[]}
        //   columns={columns}
        //   pagination={{
        //     current: currentPage,
        //     pageSize: 20,
        //     total: totalPages,
        //     style: {
        //       backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff', // Pagination background
        //       color: isDarkMode ? '#ffffff' : '#000000', // Pagination text
        //     },
        //     onChange: (page) => setCurrentPage(page),
        //   }}
        //   rowKey="id"
        // />
        <DynamicTable
          dataSource={(data || []) as Post[]}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: 20,
            total: totalPages,
            onChange: (page) => setCurrentPage(page),
            style: {
              backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff', // Pagination background
              color: isDarkMode ? '#ffffff' : '#000000', // Pagination text
            },
            itemRender: (page, type, originalElement) => {
              if (type === 'prev') {
                return (
                  <a
                    style={{
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  >
                    Previous
                  </a>
                );
              }
              if (type === 'next') {
                return (
                  <a
                    style={{
                      color: isDarkMode ? '#ffffff' : '#000000',
                    }}
                  >
                    Next
                  </a>
                );
              }
              return originalElement;
            },
          }}
          rowKey="id"
          style={{
            backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff', // Table background
            color: isDarkMode ? '#ffffff' : '#000000', // Table text color
          }}
        />


      }
      <Modal
        title="Confirm Delete"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this post?</p>
      </Modal>
    </div>
  );
}

export default withAuth(Posts);
