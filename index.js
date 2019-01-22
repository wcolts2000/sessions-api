const server = require('./api/server');

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`\n=== server listening on port ${PORT}===\n`))