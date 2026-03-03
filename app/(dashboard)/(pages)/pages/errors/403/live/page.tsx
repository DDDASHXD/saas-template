import { forbidden } from 'next/navigation'

export const dynamic = 'force-dynamic'

const ForbiddenLivePage = () => {
  return forbidden()
}

export default ForbiddenLivePage
