import { getServerAuthSession } from '@/lib/auth/auth'
import { GetServerSideProps } from 'next'

const HomePage = () => {
  return <h1>HOME PAGE</h1>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      session: await getServerAuthSession(context),
    },
  }
}
export default HomePage
