import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { DynamicSpin } from '@/components/dynamic';
import BackToList from '@/components/backToList';
import Header from '@/components/header';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/index';
// import CardCustom from '@/components/card';
const CardCustom = dynamic(() => import('@/components/card'), { ssr: false });
// Detail data post
interface PostDetail {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [userName, setUserName] = useState<string | null>("");
  const dataDetail = useSelector((state: RootState) => state.detail.data);

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    setUserName(savedName);
  }, []);

  // Fetch detail data berdasarkan ID
  const fetchPostDetail = async (): Promise<PostDetail> => {
    const response = await axios.get(`https://gorest.co.in/public/v2/posts/${id}`);
    return response.data;
  };

 
  // Gunakan useQuery dengan bentuk objek
  const { data, isLoading } = useQuery<PostDetail>({
    queryKey: ['postDetail', id],
    queryFn: fetchPostDetail,
    enabled: !!id, // Fetch hanya jika `id` ada
  });

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


  if (!id) {
    return <DynamicSpin size="large" />; // Tampilkan spinner jika ID belum tersedia
  }

  return (
    <div className='m-10'>
      <Header userName={userName} />
      <div className='mx-4'>
        <BackToList />
        <CardCustom>
          <h1 className='font-bold' style={{ fontSize: "24px" }}>Posts Detail</h1>
          <h2 className='font-bold'>ID</h2>
          <h2>{detail?.id}</h2>
          <h2 className='font-bold'>User ID</h2>
          <h2>{detail?.user_id}</h2>
          <h2 className='font-bold'>Title</h2>
          <h2>{detail?.title}</h2>
          <h2 className='font-bold'>Body</h2>
          <p>{detail?.body}</p>
        </CardCustom>
      </div>
    </div>
  );
};

export default PostDetail;
