import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'links.json');

app.use(express.json());

interface Link {
    platform: string;
    url: string;
}

// Endpoint for redirect
app.get('/:platform', (req: Request, res: Response): any => {
    try {
        const targetPlatform = req.params.platform.toLowerCase();

        // Read the JSON file every time
        console.log('[System] Reading from links.json file...');
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        const links = JSON.parse(data) as Link[];

        // Find the platform in the links array
        const linkObj = links.find(l => l.platform.toLowerCase() === targetPlatform);

        if (!linkObj) {
            return res.status(404).send('Platform link not found.');
        }

        // Perform the redirect
        console.log(`[Redirect] Sending user to ${linkObj.url}`);
        return res.redirect(linkObj.url);

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).send('Internal Server Error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Test links: http://localhost:${PORT}/instagram, http://localhost:${PORT}/github, http://localhost:${PORT}/discord`);
});
