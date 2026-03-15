const REPO_OWNER = 'htandiono';
const REPO_NAME = 'Purwadhika';
const API_BASE_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`;

const modulesContainer = document.getElementById('modules-container');

async function fetchModules() {
    try {
        // Fetch the root directory contents
        const response = await fetch(API_BASE_URL);

        if (!response.ok) {
            throw new Error(`GitHub API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Filter out non-directories and system folders (like .git, .github)
        const modules = data.filter(item =>
            item.type === 'dir' &&
            item.name.startsWith('Module-')
        );

        if (modules.length === 0) {
            modulesContainer.innerHTML = '<div class="message">No modules found. Please push your folders to GitHub!</div>';
            return;
        }

        modulesContainer.innerHTML = ''; // Clear the loader

        // Process each module
        for (const module of modules) {
            await renderModuleCard(module);
        }

    } catch (error) {
        console.error('Error fetching data from GitHub:', error);
        modulesContainer.innerHTML = `
            <div class="message error-message">
                <strong>Failed to load modules.</strong><br>
                ${error.message}<br>
                <em>Note: If you run this file locally without pushing to GitHub, you will see the remote repository state. Also, GitHub API rate limits might apply.</em>
            </div>
        `;
    }
}

async function renderModuleCard(moduleItem) {
    // Fetch the contents inside the specific module folder to get the exercises
    try {
        const response = await fetch(moduleItem.url);
        if (!response.ok) throw new Error(`Could not fetch contents for ${moduleItem.name}`);

        const moduleContents = await response.json();

        // Filter for sub-directories (Exercises)
        const exercises = moduleContents.filter(item => item.type === 'dir' && item.name.toLowerCase().includes('exercise'));

        // Construct the HTML for the module
        const article = document.createElement('article');
        article.className = 'module-card';

        const moduleTitle = document.createElement('h2');
        moduleTitle.className = 'module-title';
        moduleTitle.textContent = moduleItem.name;
        article.appendChild(moduleTitle);

        if (exercises.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.style.color = "var(--text-secondary)";
            emptyMsg.textContent = "No exercises found in this module yet.";
            article.appendChild(emptyMsg);
        } else {
            const exerciseList = document.createElement('div');
            exerciseList.className = 'exercise-list';

            exercises.forEach(exercise => {
                const link = document.createElement('a');
                link.className = 'exercise-link';

                // Construct the local relative path to the index.html
                let indexPath = 'index.html';
                // Direct specific built projects to their dist folder
                if (exercise.name === 'Exercise-01-Todo-List' || exercise.name === 'Exercise-01-Profile-Page' || exercise.name === 'Exercise-01-Todo-List-Improved') {
                    indexPath = 'dist/index.html';
                }

                link.href = `./${moduleItem.name}/${exercise.name}/${indexPath}`;
                link.textContent = exercise.name;
                exerciseList.appendChild(link);
            });

            article.appendChild(exerciseList);
        }

        modulesContainer.appendChild(article);

    } catch (error) {
        console.error(`Error processing module ${moduleItem.name}:`, error);
    }
}

// Initialize
fetchModules();
