const publishedModules = [
    {
        name: "Module-02-02",
        exercises: [
            { name: "Exercise-01", href: "./Module-02-02/Exercise-01/index.html" },
            { name: "Exercise-02", href: "./Module-02-02/Exercise-02/index.html" },
        ],
    },
    {
        name: "Module-02-03",
        exercises: [
            {
                name: "Exercise-01-Profile-Page",
                href: "./Module-02-03/Exercise-01-Profile-Page/dist/index.html",
            },
        ],
    },
    {
        name: "Module-02-04",
        exercises: [
            {
                name: "Exercise-01-Todo-List",
                href: "./Module-02-04/Exercise-01-Todo-List/dist/index.html",
            },
        ],
    },
    {
        name: "Module-02-05",
        exercises: [
            {
                name: "Exercise-01-Todo-List",
                href: "./Module-02-05/Exercise-01-Todo-List/dist/index.html",
            },
        ],
    },
    {
        name: "Module-02-06",
        exercises: [
            {
                name: "Exercise-01-Todo-List-Improved",
                href: "./Module-02-06/Exercise-01-Todo-List-Improved/dist/index.html",
            },
        ],
    },
    {
        name: "Module-02-07",
        exercises: [
            {
                name: "Exercise-02-Todo-List-with-Login",
                href: "./Module-02-07/Exercise-02-Todo-List-with-Login/dist/index.html",
            },
        ],
    },
    {
        name: "Module-02-08",
        exercises: [
            {
                name: "Exercise-01-Todo-List-with-Backendless",
                href: "./Module-02-08/Exercise-01-Todo-List-with-Backendless/dist/index.html",
            },
        ],
    },
    {
        name: "Module-03",
        note: "Back-end, REST API, database, ORM, and full-stack coursework — no standalone static build is published yet.",
        exercises: [],
    },
    {
        name: "Module-04",
        note: "AI-assisted full-stack coursework — no standalone static build is published yet.",
        exercises: [],
    },
];

const modulesContainer = document.getElementById("modules-container");

const createModuleCard = ({ name, exercises, note }) => {
    const article = document.createElement("article");
    article.className = "module-card";

    const moduleTitle = document.createElement("h2");
    moduleTitle.className = "module-title";
    moduleTitle.textContent = name;
    article.appendChild(moduleTitle);

    if (exercises.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "module-note";
        emptyMessage.textContent = note ?? "No standalone browser exercise is published yet.";
        article.appendChild(emptyMessage);
        return article;
    }

    const exerciseList = document.createElement("div");
    exerciseList.className = "exercise-list";

    for (const exercise of exercises) {
        const link = document.createElement("a");
        link.className = "exercise-link";
        link.href = exercise.href;
        link.textContent = exercise.name;
        exerciseList.appendChild(link);
    }

    article.appendChild(exerciseList);
    return article;
};

modulesContainer.replaceChildren(...publishedModules.map(createModuleCard));
