import { listen } from './app';
import { server } from './config';

const port = server.port || 3000;

listen(port, () => {
    console.log(`Server is running on port ${port}`);
});