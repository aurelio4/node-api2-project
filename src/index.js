const express = require('express')
const postsRouter = require('./routers/posts')

const server = express()

server.use(express.json())

server.get('/', (req, res) => {
  res.status(200).json({ YEP: 'working!' })
})

server.use('/api/posts', postsRouter)

server.listen(4000, () => {
  console.log('server is up on port 4000')
})