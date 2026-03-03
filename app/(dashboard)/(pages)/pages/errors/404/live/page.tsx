import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const NotFoundLivePage = () => {
  return notFound()
}

export default NotFoundLivePage
