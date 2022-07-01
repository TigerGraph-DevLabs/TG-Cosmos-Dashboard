import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';
import { ConfigProvider } from 'antd';
import en_US from 'antd/lib/locale/en_US';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <ConfigProvider locale={en_US}> 
      <PageContainer ghost>
        <div className={styles.container}>
          <Guide name={trim(name)} />
        </div>
      </PageContainer>
    </ConfigProvider>
  );
};

export default HomePage;