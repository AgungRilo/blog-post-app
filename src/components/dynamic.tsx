import dynamic from 'next/dynamic';

export const DynamicModal = dynamic(() => import('antd/lib/modal'), { ssr: false });
export const DynamicButton = dynamic(() => import('antd/lib/button'), { ssr: false });
export const DynamicInput = dynamic(() => import('antd/lib/input'), { ssr: false });
export const DynamicSwitch = dynamic(() => import('antd/lib/switch'), { ssr: false });
export const DynamicTable = dynamic(() => import('antd/lib/table'), { ssr: false });
export const DynamicSpin = dynamic(() => import('antd/lib/spin'), { ssr: false });

export const DynamicInputForm: React.FC<any> = (props) => {
    return <DynamicInput {...props} />;
  };