export const dynamic = 'force-dynamic'

const ServerErrorLivePage = () => {
  throw new Error('Intentional 500 test error from /pages/errors/500/live')
}

export default ServerErrorLivePage
